import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 3000);
const youtubeApiKey = process.env.YOUTUBE_API_KEY || "";
const openaiApiKey = process.env.OPENAI_API_KEY || "";
const openaiModel = process.env.OPENAI_MODEL || "gpt-5.5";
const youtubeBase = "https://www.googleapis.com/youtube/v3";

const mimeTypes = {
  ".html": "text/html;charset=utf-8",
  ".css": "text/css;charset=utf-8",
  ".js": "application/javascript;charset=utf-8",
  ".json": "application/json;charset=utf-8",
  ".txt": "text/plain;charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host}`);

    if (request.method === "GET" && url.pathname === "/api/health") {
      return sendJson(response, 200, {
        ok: true,
        youtubeConfigured: Boolean(youtubeApiKey),
        openaiConfigured: Boolean(openaiApiKey),
      });
    }

    if (request.method === "POST" && url.pathname === "/api/analyze") {
      return handleAnalyze(request, response);
    }

    if (request.method === "POST" && url.pathname.startsWith("/api/ai/")) {
      return handleAi(request, response, url.pathname);
    }

    if (request.method !== "GET") {
      return sendJson(response, 405, { error: "Method not allowed" });
    }

    return serveStatic(url.pathname, response);
  } catch (error) {
    console.error(error);
    return sendJson(response, 500, { error: "Internal server error" });
  }
});

server.listen(port, () => {
  console.log(`Reference Signal is running on http://localhost:${port}`);
});

async function handleAi(request, response, pathname) {
  if (!openaiApiKey) {
    return sendJson(response, 503, { error: "OPENAI_API_KEY is not configured" });
  }

  const body = await readBody(request);
  const tasks = {
    "/api/ai/summary": buildSummaryPrompt,
    "/api/ai/plan": buildPlanPrompt,
    "/api/ai/script": buildScriptPrompt,
  };
  const buildPrompt = tasks[pathname];
  if (!buildPrompt) return sendJson(response, 404, { error: "AI task not found" });

  try {
    const result = await openaiResponse(buildPrompt(body));
    return sendJson(response, 200, { result, model: openaiModel });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return sendJson(response, 502, { error: error.message || "AI generation failed" });
  }
}

function buildSummaryPrompt(body) {
  return {
    instructions: [
      "You summarize video transcripts accurately.",
      "Write in Korean even when the source transcript is in another language.",
      "Do not invent facts, motives, events, or interpretations absent from the transcript.",
      "Return plain text with exactly these headings: 전체 요약, 주요 내용, 내용 흐름, 마무리 내용.",
    ].join("\n"),
    input: `다음 스크립트를 한글로 요약하세요.\n\n${limitText(body.script, 100000)}`,
    maxOutputTokens: 1800,
  };
}

function buildPlanPrompt(body) {
  return {
    instructions: [
      "You are a YouTube content strategist who works across all genres.",
      "Create an original production plan grounded in the reference video and transcript.",
      "Use relevant factual details and successful structural techniques, but do not copy distinctive wording.",
      "Fit the target channel, audience, genre, format, and desired duration.",
      "Write in Korean. Return a practical plan, not instructions about how to write a plan.",
      "Include: 아이템 정의, 레퍼런스에서 가져올 요소, 새 영상의 관점, 구성안, 제목 후보 3개, 썸네일 방향, 추가 조사 필요사항.",
    ].join("\n"),
    input: makeAiContext(body),
    maxOutputTokens: 3000,
  };
}

function buildScriptPrompt(body) {
  return {
    instructions: [
      "You are an experienced YouTube scriptwriter.",
      "Write a complete, ready-to-read original script in Korean.",
      "The result must be actual narration/dialogue, not a plan, outline, writing advice, or commentary about the reference.",
      "Use the reference transcript's relevant facts, details, event sequence, and narrative techniques.",
      "Do not copy distinctive wording or claim unsupported facts. Preserve uncertainty where the source is uncertain.",
      "Follow the requested structure and target duration. Use natural paragraphs and section headings only when useful.",
      "Do not mention performance scores, reference analysis, prompts, or that this script was generated from another video.",
    ].join("\n"),
    input: makeAiContext(body),
    maxOutputTokens: 9000,
  };
}

function makeAiContext(body) {
  const profile = body.profile || {};
  const reference = body.reference || {};
  return [
    "[목표 채널]",
    `채널명: ${profile.name || "미정"}`,
    `주제: ${profile.topic || "미정"}`,
    `타깃: ${profile.audience || "미정"}`,
    `톤앤매너: ${profile.tone || "미정"}`,
    `피할 스타일: ${profile.avoid || "없음"}`,
    `영상 유형: ${profile.format || "미정"}`,
    `콘텐츠 포맷: ${profile.contentFormat || "미정"}`,
    `목표 길이: ${profile.length || "미정"}`,
    `추가 메모: ${profile.memo || "없음"}`,
    "",
    "[제작 요청]",
    `제목: ${body.title || "추천 필요"}`,
    `구성 방식: ${body.structure || "자동 추천"}`,
    `사용자가 수정한 기획안: ${limitText(body.plan, 20000) || "없음"}`,
    `추가 자료: ${limitText(body.materials, 50000) || "없음"}`,
    "",
    "[레퍼런스 영상]",
    `제목: ${reference.title || "미정"}`,
    `채널: ${reference.channel || "미정"}`,
    `성과 신호: ${reference.metrics || "없음"}`,
    `제목 구조: ${reference.titleFormula || "없음"}`,
    `썸네일 참고점: ${reference.thumbnailInsight || "없음"}`,
    "",
    "[레퍼런스 스크립트 원문]",
    limitText(body.script, 100000) || "없음",
  ].join("\n");
}

async function openaiResponse({ instructions, input, maxOutputTokens }) {
  const apiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: openaiModel,
      instructions,
      input,
      reasoning: { effort: "low" },
      text: { verbosity: "medium" },
      max_output_tokens: maxOutputTokens,
    }),
  });
  const data = await apiResponse.json();
  if (!apiResponse.ok) {
    throw new Error(data.error?.message || `OpenAI API error: ${apiResponse.status}`);
  }
  const outputText = (data.output || [])
    .flatMap((item) => item.content || [])
    .filter((content) => content.type === "output_text")
    .map((content) => content.text)
    .join("\n")
    .trim();
  if (!outputText) throw new Error("AI response did not contain text");
  return outputText;
}

function limitText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

async function handleAnalyze(request, response) {
  if (!youtubeApiKey) {
    return sendJson(response, 503, {
      error: "YOUTUBE_API_KEY is not configured",
    });
  }

  const body = await readBody(request);
  const channels = Array.isArray(body.channels)
    ? body.channels.map((item) => String(item).trim()).filter(Boolean)
    : [];
  const limit = clamp(Number(body.limit || 100), 1, 200);

  if (!channels.length) {
    return sendJson(response, 400, { error: "channels is required" });
  }

  const channelResults = await Promise.all(
    channels.map(async (channelInput) => {
      try {
        const channel = await resolveChannel(channelInput);
        const playlistItems = await fetchUploadItems(channel.uploadsPlaylistId, limit);
        const videos = await fetchVideos(playlistItems.map((item) => item.videoId));
        return {
          input: channelInput,
          channel,
          videos: videos.map((video) => normalizeVideo(video, channel)),
        };
      } catch (error) {
        return {
          input: channelInput,
          error: error.message,
          channel: null,
          videos: [],
        };
      }
    }),
  );

  return sendJson(response, 200, {
    channels: channelResults,
    videos: channelResults.flatMap((result) => result.videos),
  });
}

async function resolveChannel(input) {
  const parsed = parseChannelInput(input);
  const params = new URLSearchParams({
    part: "snippet,statistics,contentDetails",
    key: youtubeApiKey,
  });

  if (parsed.channelId) {
    params.set("id", parsed.channelId);
  } else if (parsed.handle) {
    params.set("forHandle", parsed.handle);
  } else if (parsed.username) {
    params.set("forUsername", parsed.username);
  } else {
    throw new Error("지원하는 채널 형식이 아닙니다. @handle 또는 /channel/UC... URL을 사용하세요.");
  }

  const data = await youtubeFetch("channels", params);
  const item = data.items?.[0];
  if (!item) {
    throw new Error("채널을 찾을 수 없습니다.");
  }

  return {
    id: item.id,
    title: item.snippet?.title || item.id,
    handle: parsed.handle || "",
    subscribers: Number(item.statistics?.subscriberCount || 0),
    uploadsPlaylistId: item.contentDetails?.relatedPlaylists?.uploads,
    thumbnail: bestThumbnail(item.snippet?.thumbnails),
  };
}

async function fetchUploadItems(playlistId, limit) {
  if (!playlistId) {
    throw new Error("업로드 재생목록을 찾을 수 없습니다.");
  }

  const items = [];
  let pageToken = "";

  while (items.length < limit) {
    const params = new URLSearchParams({
      part: "snippet,contentDetails",
      playlistId,
      maxResults: String(Math.min(50, limit - items.length)),
      key: youtubeApiKey,
    });
    if (pageToken) params.set("pageToken", pageToken);

    const data = await youtubeFetch("playlistItems", params);
    for (const item of data.items || []) {
      const videoId = item.contentDetails?.videoId || item.snippet?.resourceId?.videoId;
      if (videoId) items.push({ videoId });
    }

    pageToken = data.nextPageToken || "";
    if (!pageToken) break;
  }

  return items;
}

async function fetchVideos(videoIds) {
  const videos = [];
  for (let index = 0; index < videoIds.length; index += 50) {
    const ids = videoIds.slice(index, index + 50);
    const params = new URLSearchParams({
      part: "snippet,statistics,contentDetails",
      id: ids.join(","),
      key: youtubeApiKey,
    });
    const data = await youtubeFetch("videos", params);
    videos.push(...(data.items || []));
  }
  return videos;
}

function normalizeVideo(video, channel) {
  const durationSeconds = parseDuration(video.contentDetails?.duration || "PT0S");
  const publishedAt = video.snippet?.publishedAt || new Date().toISOString();
  return {
    id: video.id,
    channel: channel.title,
    channelId: channel.id,
    title: video.snippet?.title || "Untitled",
    description: video.snippet?.description || "",
    type: durationSeconds <= 60 ? "short" : "long",
    views: Number(video.statistics?.viewCount || 0),
    subscribers: channel.subscribers,
    likes: Number(video.statistics?.likeCount || 0),
    comments: Number(video.statistics?.commentCount || 0),
    ageDays: ageDays(publishedAt),
    durationMinutes: Math.max(1, Math.round(durationSeconds / 60)),
    durationSeconds,
    publishedAt,
    thumbnail: bestThumbnail(video.snippet?.thumbnails),
    url: `https://www.youtube.com/watch?v=${video.id}`,
    transcriptAvailable: false,
  };
}

function parseChannelInput(input) {
  const value = String(input).trim();
  const channelMatch = value.match(/(?:youtube\.com\/channel\/|^)(UC[\w-]{20,})/);
  if (channelMatch) return { channelId: channelMatch[1] };

  const handleMatch = value.match(/@[\w.-]+/);
  if (handleMatch) return { handle: handleMatch[0] };

  const userMatch = value.match(/youtube\.com\/user\/([^/?#]+)/);
  if (userMatch) return { username: userMatch[1] };

  if (value.startsWith("@")) return { handle: value };
  if (/^UC[\w-]{20,}$/.test(value)) return { channelId: value };

  return {};
}

async function youtubeFetch(path, params) {
  const response = await fetch(`${youtubeBase}/${path}?${params.toString()}`);
  const data = await response.json();
  if (!response.ok) {
    const message = data.error?.message || `YouTube API error: ${response.status}`;
    throw new Error(message);
  }
  return data;
}

function parseDuration(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  return hours * 3600 + minutes * 60 + seconds;
}

function bestThumbnail(thumbnails = {}) {
  return (
    thumbnails.maxres?.url ||
    thumbnails.standard?.url ||
    thumbnails.high?.url ||
    thumbnails.medium?.url ||
    thumbnails.default?.url ||
    ""
  );
}

function ageDays(publishedAt) {
  const diff = Date.now() - new Date(publishedAt).getTime();
  return Math.max(0, Math.floor(diff / 86400000));
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
}

async function serveStatic(pathname, response) {
  const cleanPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = normalize(join(root, cleanPath));
  if (!filePath.startsWith(root)) {
    return sendJson(response, 403, { error: "Forbidden" });
  }

  try {
    const body = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(body);
  } catch {
    sendJson(response, 404, { error: "Not found" });
  }
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json;charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}
