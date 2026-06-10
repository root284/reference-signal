const today = new Date("2026-06-01T00:00:00+09:00");

const sampleChannels = [
  "@creator-lab",
  "@ai-operator",
  "@story-market",
];

const sampleVideos = [
  ["creator-lab", "구독자 3만 채널이 2주 만에 80만 조회수를 만든 제목 공식", "long", 820000, 30000, 41000, 4200, 23, 18],
  ["creator-lab", "평범한 브이로그를 기획 콘텐츠로 바꾸는 5가지 장면", "long", 226000, 30000, 9700, 1120, 64, 16],
  ["creator-lab", "요즘 잘 되는 썸네일은 왜 글자가 적을까", "short", 910000, 30000, 36000, 1800, 16, 1],
  ["creator-lab", "첫 10초에 시청자를 붙잡는 질문 설계법", "long", 354000, 30000, 18800, 2140, 128, 14],
  ["creator-lab", "조회수는 낮아도 저장되는 콘텐츠의 공통점", "long", 74000, 30000, 5200, 760, 41, 12],
  ["ai-operator", "AI 툴 소개 영상이 더 이상 먹히지 않는 이유", "long", 1480000, 126000, 64000, 5400, 38, 17],
  ["ai-operator", "하루 업무를 30분으로 줄인 자동화 루틴 공개", "long", 642000, 126000, 30200, 2990, 82, 19],
  ["ai-operator", "이 프롬프트 하나로 회의록, 메일, 기획안 끝", "short", 2380000, 126000, 91200, 3600, 12, 1],
  ["ai-operator", "ChatGPT보다 중요한 것은 업무 흐름 설계입니다", "long", 391000, 126000, 23600, 2800, 205, 21],
  ["ai-operator", "새로운 AI 기능보다 먼저 정리해야 할 것", "long", 112000, 126000, 4800, 690, 19, 10],
  ["story-market", "팔리는 이야기는 주인공보다 결핍이 먼저입니다", "long", 519000, 54000, 28700, 4300, 54, 15],
  ["story-market", "사람들이 끝까지 보는 사례 영상의 구성", "long", 302000, 54000, 15100, 2100, 91, 13],
  ["story-market", "브랜드 채널이 예능처럼 보이면 안 되는 이유", "long", 185000, 54000, 8700, 980, 175, 11],
  ["story-market", "후킹 문장을 고칠 때 버려야 하는 단어들", "short", 740000, 54000, 22100, 960, 28, 1],
  ["story-market", "작은 채널이 큰 채널을 이기는 아이템 선정법", "long", 610000, 54000, 33400, 5200, 33, 18],
  ["creator-lab", "업로드 후 24시간 데이터를 읽는 현실적인 방법", "long", 132000, 30000, 7300, 820, 7, 9],
  ["ai-operator", "초보자가 자동화 영상을 만들 때 망하는 패턴", "short", 980000, 126000, 27800, 1410, 49, 1],
  ["story-market", "제목만 바꿨는데 클릭률이 바뀌는 이유", "long", 456000, 54000, 19800, 2600, 71, 14],
  ["creator-lab", "썸네일 회의에서 바로 써먹는 체크리스트", "short", 584000, 30000, 15600, 620, 5, 1],
  ["ai-operator", "내가 쓰는 AI 리서치 워크플로우", "long", 208000, 126000, 9100, 770, 301, 18],
  ["story-market", "사례를 콘텐츠로 바꾸는 가장 쉬운 질문", "short", 692000, 54000, 26100, 1320, 9, 1],
  ["creator-lab", "조회수보다 먼저 봐야 하는 댓글 신호", "long", 92000, 30000, 6100, 1250, 217, 13],
  ["ai-operator", "AI 시대에도 오래가는 채널의 조건", "long", 355000, 126000, 18800, 2060, 142, 16],
  ["story-market", "시청자가 공유하는 콘텐츠에는 약속이 있습니다", "long", 244000, 54000, 12600, 1840, 260, 12],
].map((row, index) => {
  const [channel, title, type, views, subscribers, likes, comments, ageDays, durationMinutes] = row;
  const publishedAt = new Date(today);
  publishedAt.setDate(today.getDate() - ageDays);
  return {
    id: `sample-${index + 1}`,
    channel,
    title,
    type,
    views,
    subscribers,
    likes,
    comments,
    ageDays,
    durationMinutes,
    publishedAt,
    url: `https://www.youtube.com/watch?v=sample${index + 1}`,
    transcriptAvailable: index % 4 === 0,
  };
});

let selectedType = "all";
let currentResults = [];
let selectedVideo = null;

const channelInput = document.querySelector("#channelInput");
const videoLimit = document.querySelector("#videoLimit");
const periodFilter = document.querySelector("#periodFilter");
const analyzeButton = document.querySelector("#analyzeButton");
const loadSampleButton = document.querySelector("#loadSampleButton");
const exportButton = document.querySelector("#exportButton");
const resultsList = document.querySelector("#resultsList");
const insightPanel = document.querySelector("#insightPanel");
const scriptResultPanel = document.querySelector("#scriptResultPanel");
const scriptInput = document.querySelector("#scriptInput");
const scriptAnalyzeButton = document.querySelector("#scriptAnalyzeButton");
const copyScriptButton = document.querySelector("#copyScriptButton");
const downloadScriptButton = document.querySelector("#downloadScriptButton");
const saveSessionButton = document.querySelector("#saveSessionButton");
const loadSessionButton = document.querySelector("#loadSessionButton");
const saveAuthorInput = document.querySelector("#saveAuthorInput");
const saveCommentInput = document.querySelector("#saveCommentInput");
const savedSessionSelect = document.querySelector("#savedSessionSelect");
const globalInsightButton = document.querySelector("#globalInsightButton");
const statusMessage = document.querySelector("#statusMessage");

document.querySelectorAll(".segment").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".segment").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    selectedType = button.dataset.type;
  });
});

loadSampleButton.addEventListener("click", () => {
  channelInput.value = sampleChannels.join("\n");
  runAnalysis();
});

analyzeButton.addEventListener("click", runAnalysis);
globalInsightButton.addEventListener("click", showGlobalInsights);
scriptAnalyzeButton.addEventListener("click", analyzeScript);
copyScriptButton.addEventListener("click", copyScript);
downloadScriptButton.addEventListener("click", downloadScript);
exportButton.addEventListener("click", exportJson);
saveSessionButton.addEventListener("click", saveSession);
loadSessionButton.addEventListener("click", loadSession);
savedSessionSelect.addEventListener("change", previewSavedSession);

function scoreVideo(video) {
  const viewRatio = video.views / Math.max(video.subscribers, 1);
  const ratioScore = clamp(((Math.log10(viewRatio) + 3) / 4) * 40, 0, 40);
  const likeRate = video.likes / Math.max(video.views, 1);
  const likeScore = clamp((likeRate / 0.05) * 20, 0, 20);
  const commentRate = video.comments / Math.max(video.views, 1);
  const commentScore = clamp((commentRate / 0.005) * 15, 0, 15);
  const viewsPerDay = video.views / Math.max(video.ageDays, 1);
  const speedRatio = viewsPerDay / Math.max(video.subscribers / 30, 1);
  const speedScore = clamp((Math.log10(speedRatio + 1) / Math.log10(11)) * 15, 0, 15);
  const freshnessScore = freshness(video.ageDays);

  const total = ratioScore + likeScore + commentScore + speedScore + freshnessScore;
  return {
    total: Math.round(total),
    ratioScore,
    likeScore,
    commentScore,
    speedScore,
    freshnessScore,
    likeRate,
    commentRate,
    viewRatio,
    viewsPerDay,
  };
}

function freshness(ageDays) {
  if (ageDays <= 30) return 10;
  if (ageDays <= 180) return 10 - ((ageDays - 30) / 150) * 3;
  if (ageDays <= 365) return 7 - ((ageDays - 180) / 185) * 4;
  return 1;
}

async function runAnalysis() {
  const channels = channelInput.value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
  const limit = Number(videoLimit.value);
  const period = periodFilter.value;

  let source = [];
  if (channels.length) {
    source = await loadVideos(channels, limit);
  }

  const filtered = source
    .filter((video) => selectedType === "all" || video.type === selectedType)
    .filter((video) => period === "all" || video.ageDays <= Number(period))
    .slice(0, Math.max(limit * Math.max(channels.length, 1), limit))
    .map((video) => ({ ...video, score: scoreVideo(video) }))
    .sort((a, b) => b.score.total - a.score.total);

  currentResults = filtered.slice(0, 20);
  selectedVideo = currentResults[0] || null;
  renderMetrics(filtered);
  renderResults(currentResults);
  if (selectedVideo) showVideoInsight(selectedVideo);
  else showEmptyState();
}

async function loadVideos(channels, limit) {
  if (!isServerMode()) {
    statusMessage.textContent = "정적 파일로 열려 있어 샘플 데이터로 표시합니다.";
    return sampleVideos;
  }

  statusMessage.textContent = "YouTube 데이터를 가져오는 중입니다.";
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channels, limit }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "분석 요청에 실패했습니다.");
    }
    const videos = data.videos.map(normalizeIncomingVideo);
    const failed = (data.channels || []).filter((channel) => channel.error);
    statusMessage.textContent = failed.length
      ? `일부 채널을 불러오지 못했습니다: ${failed.map((item) => item.input).join(", ")}`
      : "실제 YouTube 데이터로 분석했습니다.";
    return videos.length ? videos : sampleVideos;
  } catch (error) {
    statusMessage.textContent = `${error.message} 샘플 데이터로 표시합니다.`;
    return sampleVideos;
  }
}

function normalizeIncomingVideo(video) {
  const publishedAt = video.publishedAt ? new Date(video.publishedAt) : new Date();
  return {
    ...video,
    publishedAt,
    ageDays: typeof video.ageDays === "number" ? video.ageDays : Math.max(0, Math.floor((Date.now() - publishedAt.getTime()) / 86400000)),
    subscribers: Number(video.subscribers || 0),
    views: Number(video.views || 0),
    likes: Number(video.likes || 0),
    comments: Number(video.comments || 0),
    durationMinutes: Number(video.durationMinutes || 1),
    transcriptAvailable: Boolean(video.transcriptAvailable),
  };
}

function isServerMode() {
  return location.protocol === "http:" || location.protocol === "https:";
}

function renderMetrics(videos) {
  const avg = videos.length
    ? Math.round(videos.reduce((sum, video) => sum + video.score.total, 0) / videos.length)
    : 0;
  document.querySelector("#metricVideos").textContent = formatNumber(videos.length);
  document.querySelector("#metricScore").textContent = String(avg);
  document.querySelector("#metricBreakouts").textContent = formatNumber(videos.filter((video) => video.score.total >= 78).length);
  document.querySelector("#metricType").textContent = typeLabel(selectedType);
}

function renderResults(videos) {
  if (!videos.length) {
    resultsList.innerHTML = `
      <div class="insight-panel empty-state">
        <h3>아직 결과가 없습니다</h3>
        <p>샘플을 불러오거나 채널을 입력한 뒤 분석을 실행하세요.</p>
      </div>
    `;
    return;
  }

  resultsList.innerHTML = videos.map(renderVideoCard).join("");
  document.querySelectorAll("[data-insight-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const video = currentResults.find((item) => item.id === button.dataset.insightId);
      if (video) {
        selectedVideo = video;
        showVideoInsight(video);
      }
    });
  });
  document.querySelectorAll("[data-transcript-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const video = currentResults.find((item) => item.id === button.dataset.transcriptId);
      if (!video || !video.transcriptAvailable) return;
      scriptInput.value = makeSampleScript(video);
      showVideoInsight(video);
    });
  });
}

function renderVideoCard(video) {
  const score = video.score;
  const transcriptButton = video.transcriptAvailable
    ? `<button type="button" data-transcript-id="${video.id}">스크립트 불러오기</button>`
    : "";
  const thumbnailImage = video.thumbnail
    ? `<img src="${escapeHtml(video.thumbnail)}" alt="${escapeHtml(video.title)} 썸네일" loading="lazy" referrerpolicy="no-referrer" />`
    : "";
  return `
    <article class="video-card">
      <div class="thumb">
        ${thumbnailImage}
        <div class="type-badge">${typeLabel(video.type)}</div>
        <span>${escapeHtml(video.channel)}</span>
      </div>
      <div class="video-main">
        <h3 class="video-title">${escapeHtml(video.title)}</h3>
        <div class="video-meta">
          <span>${escapeHtml(video.channel)}</span>
          <span>${video.ageDays}일 전</span>
          <span>${video.durationMinutes}분</span>
        </div>
        <div class="stat-row">
          <div class="stat"><span>조회수</span><strong>${formatNumber(video.views)}</strong></div>
          <div class="stat"><span>조회/구독자</span><strong>${score.viewRatio.toFixed(1)}배</strong></div>
          <div class="stat"><span>좋아요율</span><strong>${percent(score.likeRate)}</strong></div>
          <div class="stat"><span>댓글율</span><strong>${percent(score.commentRate)}</strong></div>
        </div>
      </div>
      <div class="score-box">
        <div class="score-circle" style="--score: ${score.total}"><span>${score.total}</span></div>
      </div>
      <div class="card-actions">
        <button type="button" data-insight-id="${video.id}">심화분석</button>
        <a href="${video.url}" target="_blank" rel="noreferrer">바로가기</a>
        ${transcriptButton}
      </div>
    </article>
  `;
}

function showGlobalInsights() {
  if (!currentResults.length) {
    showEmptyState();
    return;
  }
  const shortCount = currentResults.filter((video) => video.type === "short").length;
  const longCount = currentResults.length - shortCount;
  const best = currentResults[0];
  const highComment = [...currentResults].sort((a, b) => b.score.commentRate - a.score.commentRate)[0];
  const recent = [...currentResults].sort((a, b) => a.ageDays - b.ageDays)[0];

  insightPanel.classList.remove("empty-state");
  insightPanel.innerHTML = `
    <ul class="insight-list">
      <li><strong>아이템 선정:</strong> Top 20은 문제 제기형 제목과 실전 공개형 제목이 강합니다. 특히 "${escapeHtml(best.title)}"처럼 결과가 선명한 제목이 조회/구독자 비율을 끌어올립니다.</li>
      <li><strong>포맷 신호:</strong> 현재 Top 20에는 롱폼 ${longCount}개, 숏츠 ${shortCount}개가 있습니다. 숏츠는 확산, 롱폼은 신뢰와 저장에 더 적합한 흐름으로 분리해 볼 만합니다.</li>
      <li><strong>썸네일 전략:</strong> 숫자, 전후 변화, 강한 판단 문장이 있는 영상이 유리합니다. 썸네일은 설명보다 선택지를 좁혀주는 역할을 해야 합니다.</li>
      <li><strong>댓글 신호:</strong> "${escapeHtml(highComment.title)}"는 댓글율이 높습니다. 논쟁보다 자기 경험을 꺼내게 하는 질문형 마무리를 참고하세요.</li>
      <li><strong>최근성:</strong> "${escapeHtml(recent.title)}"는 가장 최근의 강한 신호입니다. 지금 시점의 관심사를 반영한 아이템 후보로 우선 검토할 수 있습니다.</li>
    </ul>
  `;
}

function showVideoInsight(video) {
  const score = video.score;
  insightPanel.classList.remove("empty-state");
  insightPanel.innerHTML = `
    <ul class="insight-list">
      <li><strong>왜 튀었나:</strong> 조회/구독자 비율이 ${score.viewRatio.toFixed(1)}배입니다. 기존 구독자 밖으로 확산됐을 가능성이 큽니다.</li>
      <li><strong>아이템:</strong> "${escapeHtml(video.title)}"이 어떤 궁금증·욕구·감정을 건드리는지 확인하고, 소재 자체의 확장성을 판단하세요.</li>
      <li><strong>패키징:</strong> ${escapeHtml(inferTitleFormula(video.title))} / ${escapeHtml(getThumbnailInsight(video))}</li>
      <li><strong>서사·구성:</strong> 스크립트를 넣으면 정보 공개 순서, 긴장 상승, 전환 지점, 결말 방식까지 분석합니다.</li>
      <li><strong>반응 품질:</strong> 좋아요율 ${percent(score.likeRate)}, 댓글율 ${percent(score.commentRate)}입니다. 조회수뿐 아니라 만족·토론·공유 가능성을 함께 봅니다.</li>
      <li><strong>활용 가능성:</strong> 아이템, 패키징, 구성, 디테일 중 어떤 요소를 참고할지 선택하고 고유 표현은 그대로 복제하지 않는 것이 좋습니다.</li>
    </ul>
  `;
}

async function analyzeScript() {
  const text = scriptInput.value.trim();
  if (!text) {
    scriptResultPanel.classList.add("is-visible");
    scriptResultPanel.innerHTML = `
      <div class="panel-title">
        <span>스크립트 분석</span>
        <h2>입력 필요</h2>
      </div>
      <ul class="insight-list">
        <li><strong>스크립트가 필요합니다:</strong> YouTube 설명란의 스크립트 보기에서 복사한 내용을 붙여넣으면 훅, 전개, 결론을 분석합니다.</li>
      </ul>
    `;
    return;
  }

  if (isServerMode()) {
    scriptAnalyzeButton.disabled = true;
    scriptAnalyzeButton.textContent = "AI 요약 중...";
    try {
      const result = await aiRequest("/api/ai/summary", { script: text });
      scriptResultPanel.classList.add("is-visible");
      scriptResultPanel.innerHTML = `
        <div class="panel-title">
          <span>AI 스크립트 분석</span>
          <h2>한글 내용 요약</h2>
        </div>
        <pre class="ai-output">${escapeHtml(result)}</pre>
      `;
      return;
    } catch (error) {
      statusMessage.textContent = `AI 요약 실패: ${error.message} 로컬 요약으로 표시합니다.`;
    } finally {
      scriptAnalyzeButton.disabled = false;
      scriptAnalyzeButton.textContent = "스크립트 분석";
    }
  }

  const summary = summarizeScript(text);

  scriptResultPanel.classList.add("is-visible");
  scriptResultPanel.innerHTML = `
    <div class="panel-title">
      <span>스크립트 분석</span>
      <h2>스크립트 내용 요약</h2>
    </div>
    <ul class="insight-list">
      <li><strong>전체 요약:</strong> ${escapeHtml(summary.overview)}</li>
      <li><strong>주요 내용:</strong> ${escapeHtml(summary.keyPoints.join(" / "))}</li>
      <li><strong>내용 흐름:</strong> ${escapeHtml(summary.flow)}</li>
      <li><strong>마무리 내용:</strong> ${escapeHtml(summary.ending)}</li>
    </ul>
  `;
}

async function aiRequest(path, payload) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "AI 요청에 실패했습니다.");
  return data.result;
}

function extractScriptDetails(text) {
  if (!text) return emptyScriptDetails();
  const sentences = splitSentences(text);
  const hook = sentences[0] || "초반 훅을 확인할 수 없습니다.";
  const numbers = pickSentences(sentences, [/\d/, /%/, /배/, /년/, /개월/, /주/, /일/, /분/, /초/], 4);
  const examples = pickSentences(sentences, ["예를 들어", "예를들어", "사례", "경우", "실제로", "가령", "보면"], 4);
  const warnings = pickSentences(sentences, ["문제", "실수", "주의", "하지 마", "안 됩니다", "안돼", "위험", "틀린", "잘못"], 4);
  const claims = pickSentences(sentences, ["중요", "핵심", "이유", "왜냐", "결국", "반드시", "필요", "해야"], 4);
  const keyDetails = rankDetailSentences(sentences, [...numbers, ...examples, ...warnings, ...claims], 6);
  const summary = keyDetails.length
    ? `레퍼런스 스크립트에서 ${keyDetails.length}개의 디테일 지식을 추출했습니다: ${keyDetails.slice(0, 3).join(" / ")}`
    : "아직 붙여넣은 레퍼런스 스크립트가 없거나 디테일을 충분히 추출하지 못했습니다.";
  const application = keyDetails.length
    ? `핵심 디테일(${keyDetails.slice(0, 4).join(" / ")})의 역할을 유지하되, 표현과 사례는 내 채널 주제에 맞게 바꿉니다.`
    : "레퍼런스 스크립트를 붙여넣으면 디테일 지식, 사례, 숫자 근거를 선택한 구성 방식에 반영합니다.";
  return { hook, claims, keyDetails, examples, numbers, warnings, summary, application };
}

function emptyScriptDetails() {
  return {
    hook: "레퍼런스 스크립트가 아직 없습니다.",
    claims: [],
    keyDetails: [],
    examples: [],
    numbers: [],
    warnings: [],
    summary: "레퍼런스 스크립트를 붙여넣으면 디테일 지식과 사례를 추출해 기획안과 선택한 스크립트 구성에 반영합니다.",
    application: "스크립트 디테일이 없으므로 현재는 제목, 썸네일, 수치 신호만 사용합니다.",
  };
}

function splitSentences(text) {
  return text
    .split(/\n+|(?<=[.!?。！？])\s+/)
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter((item) => item.length >= 8)
    .slice(0, 1000);
}

function pickSentences(sentences, patterns, limit) {
  return sentences
    .filter((sentence) =>
      patterns.some((pattern) => (pattern instanceof RegExp ? pattern.test(sentence) : sentence.includes(pattern))),
    )
    .slice(0, limit);
}

function rankDetailSentences(sentences, alreadyPicked, limit) {
  const picked = new Set(alreadyPicked);
  const scored = sentences.map((sentence, index) => {
    let score = 0;
    if (/\d|%|배|년|개월|주|일|분|초/.test(sentence)) score += 3;
    if (/예를 들어|사례|실제로|가령|경우/.test(sentence)) score += 3;
    if (/중요|핵심|이유|문제|실수|주의|방법|원리|전략|단계/.test(sentence)) score += 2;
    if (sentence.length >= 35 && sentence.length <= 180) score += 1;
    if (picked.has(sentence)) score += 2;
    return { sentence, score, index };
  });
  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((item) => item.sentence)
    .filter((sentence, index, arr) => arr.indexOf(sentence) === index)
    .slice(0, limit);
}

function inferNarrativeSignals(text) {
  if (!text) return "스크립트를 넣으면 긴장 상승, 반전, 정보 공개 순서, 감정 장치를 분석합니다.";
  const signals = [];
  if (/그런데|하지만|그러나|갑자기|그 순간|알고 보니|사실은/.test(text)) signals.push("전환 또는 반전 문장을 사용합니다");
  if (/이상|불안|두려|무서|소름|정체|흔적|사라/.test(text)) signals.push("불안감과 미확인 정보를 활용합니다");
  if (/왜|어떻게|무엇|과연|정말/.test(text)) signals.push("질문을 남겨 다음 정보를 기다리게 합니다");
  if (/\d{4}년|당시|그날|다음 날|며칠 후|시간/.test(text)) signals.push("시간 순서로 신뢰와 진행감을 만듭니다");
  if (/목격|기록|사진|영상|증언|경찰|보고서/.test(text)) signals.push("기록과 증언을 근거 장치로 사용합니다");
  return signals.length ? signals.join(" / ") : "뚜렷한 서사 장치가 적어 정보 공개 순서와 전환 문장을 보강할 수 있습니다.";
}

function summarizeScript(text) {
  const sentences = splitSentences(text);
  if (!sentences.length) {
    return {
      overview: "요약할 수 있는 문장을 찾지 못했습니다.",
      keyPoints: ["스크립트의 문장이나 줄바꿈 상태를 확인해주세요."],
      flow: "내용 흐름을 확인할 수 없습니다.",
      ending: "마무리 내용을 확인할 수 없습니다.",
    };
  }

  const important = rankSummarySentences(sentences, 5);
  const opening = sentences[0];
  const ending = sentences[sentences.length - 1];
  const middleIndex = Math.floor(sentences.length / 2);
  const middle = sentences[middleIndex] || important[1] || opening;
  const overviewParts = uniqueSentences([opening, important[0], important[1], ending]).slice(0, 3);
  return {
    overview: overviewParts.join(" "),
    keyPoints: important.length ? important : [opening],
    flow: `처음에는 "${shorten(opening, 90)}"에서 시작해, 중간에는 "${shorten(middle, 90)}"를 다루고, 마지막에는 "${shorten(ending, 90)}"로 이어집니다.`,
    ending,
  };
}

function uniqueSentences(sentences) {
  return sentences.filter((sentence, index, list) => sentence && list.indexOf(sentence) === index);
}

function rankSummarySentences(sentences, limit) {
  const wordFrequency = new Map();
  const stopWords = new Set(["그리고", "하지만", "그런데", "그래서", "이것", "저것", "그것", "하는", "있는", "없는", "입니다", "합니다", "됩니다", "때문", "정도"]);

  sentences.forEach((sentence) => {
    tokenize(sentence).forEach((word) => {
      if (!stopWords.has(word)) wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
    });
  });

  return sentences
    .map((sentence, index) => {
      const words = tokenize(sentence);
      const frequencyScore = words.reduce((sum, word) => sum + (wordFrequency.get(word) || 0), 0);
      const positionBonus = index === 0 || index === sentences.length - 1 ? 2 : 0;
      const detailBonus = /\d|년|월|일|시간|장소|사람|사건|이유|결과|발견|결국/.test(sentence) ? 2 : 0;
      return { sentence, index, score: frequencyScore / Math.max(words.length, 1) + positionBonus + detailBonus };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.sentence);
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 2);
}

function shorten(text, limit) {
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
}

function inferTitleFormula(title) {
  if (/\d/.test(title)) return "숫자/기간/결과를 앞세워 기대값을 명확히 만드는 제목";
  if (title.includes("이유") || title.includes("왜")) return "궁금증과 원인 분석을 약속하는 제목";
  if (title.includes("방법") || title.includes("법")) return "바로 적용 가능한 방법을 약속하는 제목";
  if (title.includes("안") || title.includes("못")) return "실수/금지/문제 상황을 통해 클릭 이유를 만드는 제목";
  return "하나의 강한 상황이나 약속을 전면에 내세우는 제목";
}

function inferReferencePattern(video, score) {
  const signals = [];
  if (score.viewRatio >= 3) signals.push("기존 구독자 밖으로 확산된 아이템");
  if (score.likeRate >= 0.04) signals.push("만족도나 저장 가치가 높은 반응");
  if (score.commentRate >= 0.004) signals.push("시청자가 의견을 남기기 쉬운 주제");
  if (video.type === "short") signals.push("짧은 시간에 한 장면/한 메시지로 전달되는 숏폼 구조");
  if (!signals.length) signals.push("제목과 썸네일의 약속을 먼저 점검해야 하는 레퍼런스");
  return signals.join(", ") + "입니다.";
}

function inferCorePromise(title) {
  if (title.includes("이유")) return "왜 그런 일이 벌어지는지 설명하는 약속";
  if (title.includes("방법") || title.includes("법")) return "바로 따라 할 수 있는 방법을 주는 약속";
  if (/\d/.test(title)) return "구체적인 숫자나 결과로 신뢰를 주는 약속";
  return "시청자의 궁금증을 한 번에 좁혀주는 약속";
}

function firstLine(text) {
  return text.split(/\n|[.!?。！？]/).map((item) => item.trim()).filter(Boolean)[0] || "";
}

function copyScript() {
  const text = scriptInput.value.trim();
  if (!text) {
    copyScriptButton.textContent = "내용 없음";
    setTimeout(() => {
      copyScriptButton.textContent = "스크립트 복사";
    }, 1400);
    return;
  }
  navigator.clipboard?.writeText(text);
  copyScriptButton.textContent = "복사됨";
  setTimeout(() => {
    copyScriptButton.textContent = "스크립트 복사";
  }, 1400);
}

function downloadScript() {
  const text = scriptInput.value.trim();
  if (!text) {
    downloadScriptButton.textContent = "내용 없음";
    setTimeout(() => {
      downloadScriptButton.textContent = "스크립트 다운로드";
    }, 1400);
    return;
  }
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeTitle = (selectedVideo?.title || "script").replace(/[\\/:*?"<>|]/g, "").slice(0, 48);
  link.href = url;
  link.download = `${safeTitle || "script"}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function saveSession() {
  const author = saveAuthorInput.value.trim();
  const comment = saveCommentInput.value.trim();
  if (!author || !comment) {
    saveSessionButton.textContent = !author ? "저장자 필요" : "코멘트 필요";
    setTimeout(() => {
      saveSessionButton.textContent = "중간 저장";
    }, 1400);
    return;
  }

  const session = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    author,
    comment,
    channels: channelInput.value,
    limit: videoLimit.value,
    period: periodFilter.value,
    type: selectedType,
    script: scriptInput.value,
    savedAt: new Date().toISOString(),
  };
  const sessions = getSavedSessions();
  sessions.unshift(session);
  localStorage.setItem("referenceSignalDrafts", JSON.stringify(sessions.slice(0, 30)));
  localStorage.setItem("referenceSignalDraft", JSON.stringify(session));
  renderSavedSessionOptions(session.id);
  saveSessionButton.textContent = "저장됨";
  setTimeout(() => {
    saveSessionButton.textContent = "중간 저장";
  }, 1400);
}

function loadSession() {
  try {
    const selectedId = savedSessionSelect.value;
    const session = selectedId
      ? getSavedSessions().find((item) => item.id === selectedId)
      : JSON.parse(localStorage.getItem("referenceSignalDraft") || "null");
    if (!session) {
      loadSessionButton.textContent = "저장 없음";
      setTimeout(() => {
        loadSessionButton.textContent = "저장 불러오기";
      }, 1400);
      return;
    }
    channelInput.value = session.channels || "";
    saveAuthorInput.value = session.author || "";
    saveCommentInput.value = session.comment || "";
    videoLimit.value = session.limit || "100";
    periodFilter.value = session.period || "all";
    selectedType = session.type || "all";
    document.querySelectorAll(".segment").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.type === selectedType);
    });
    scriptInput.value = session.script || "";
    runAnalysis();
    loadSessionButton.textContent = "불러옴";
    setTimeout(() => {
      loadSessionButton.textContent = "저장 불러오기";
    }, 1400);
  } catch {
    loadSessionButton.textContent = "실패";
    setTimeout(() => {
      loadSessionButton.textContent = "저장 불러오기";
    }, 1400);
  }
}

function getSavedSessions() {
  try {
    return JSON.parse(localStorage.getItem("referenceSignalDrafts") || "[]");
  } catch {
    return [];
  }
}

function renderSavedSessionOptions(selectedId = "") {
  const sessions = getSavedSessions();
  savedSessionSelect.innerHTML = `<option value="">저장된 작업 선택</option>${sessions
    .map((session) => {
      const date = session.savedAt ? new Date(session.savedAt).toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" }) : "";
      const label = `${session.author || "이름 없음"} - ${session.comment || "코멘트 없음"}${date ? ` (${date})` : ""}`;
      return `<option value="${escapeHtml(session.id)}" ${session.id === selectedId ? "selected" : ""}>${escapeHtml(label)}</option>`;
    })
    .join("")}`;
}

function previewSavedSession() {
  const selected = getSavedSessions().find((session) => session.id === savedSessionSelect.value);
  if (!selected) return;
  saveAuthorInput.value = selected.author || "";
  saveCommentInput.value = selected.comment || "";
}

function exportJson() {
  const payload = JSON.stringify(currentResults, null, 2);
  navigator.clipboard?.writeText(payload);
  exportButton.textContent = "복사됨";
  setTimeout(() => {
    exportButton.textContent = "결과 데이터 복사";
  }, 1400);
}

function showEmptyState() {
  insightPanel.classList.add("empty-state");
  insightPanel.innerHTML = `
    <h3>분석할 영상을 선택하세요</h3>
    <p>Top 20 전체 인사이트를 보거나, 개별 영상의 스크립트를 붙여넣어 더 깊게 분석할 수 있습니다.</p>
  `;
}

function makeSampleScript(video) {
  return `오늘은 ${video.title}에 대해 이야기하겠습니다.
많은 채널이 조회수만 보고 따라 하지만, 실제로는 아이템 선정과 첫 문장이 훨씬 중요합니다.
먼저 시청자가 이미 느끼는 문제를 아주 구체적으로 잡아야 합니다.
그 다음 사례를 보여주고, 왜 이 방식이 작동했는지 숫자와 함께 설명합니다.
마지막으로 내 채널에 맞게 바꿀 수 있는 체크리스트를 정리합니다.`;
}

function getThumbnailInsight(video) {
  const title = video.title;
  if (title.includes("2주") || title.includes("30분") || title.includes("24시간")) {
    return "숫자와 시간 표현이 제목에 들어가 있으므로 썸네일도 '기간 대비 결과'를 크게 보여주는 방식이 잘 맞습니다. 전후 대비, 큰 숫자, 짧은 문구 조합을 우선 검토하세요.";
  }
  if (title.includes("이유") || title.includes("안 되는")) {
    return "판단형 주제라서 썸네일은 설명보다 강한 대비가 중요합니다. '되는 방식/안 되는 방식'처럼 선택지를 나누면 클릭 전 궁금증을 만들 수 있습니다.";
  }
  if (video.type === "short") {
    return "숏츠는 피드에서 빠르게 지나가므로 문구를 줄이고 한 가지 장면 또는 한 가지 표정/상황에 집중하는 편이 좋습니다. 작은 화면에서도 읽히는 대비가 핵심입니다.";
  }
  return "제목이 방법론형에 가까우므로 썸네일은 결과물, 체크리스트, 전후 변화 중 하나를 시각적으로 압축하는 방향이 좋습니다. 텍스트는 제목을 반복하지 말고 약속을 보강해야 합니다.";
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(value) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

function percent(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function typeLabel(type) {
  if (type === "short") return "숏츠";
  if (type === "long") return "롱폼";
  return "전체";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

renderSavedSessionOptions();
renderMetrics([]);
renderResults([]);
