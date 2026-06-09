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
const myChannelInput = document.querySelector("#myChannelInput");
const templateNameInput = document.querySelector("#templateNameInput");
const channelTopicInput = document.querySelector("#channelTopicInput");
const audienceInput = document.querySelector("#audienceInput");
const toneInput = document.querySelector("#toneInput");
const avoidInput = document.querySelector("#avoidInput");
const targetFormatInput = document.querySelector("#targetFormatInput");
const targetLengthInput = document.querySelector("#targetLengthInput");
const contentFormatInput = document.querySelector("#contentFormatInput");
const customFormatField = document.querySelector("#customFormatField");
const customFormatInput = document.querySelector("#customFormatInput");
const templateSelect = document.querySelector("#templateSelect");
const saveTemplateButton = document.querySelector("#saveTemplateButton");
const saveSessionButton = document.querySelector("#saveSessionButton");
const loadSessionButton = document.querySelector("#loadSessionButton");
const saveAuthorInput = document.querySelector("#saveAuthorInput");
const saveCommentInput = document.querySelector("#saveCommentInput");
const savedSessionSelect = document.querySelector("#savedSessionSelect");
const generatePlanButton = document.querySelector("#generatePlanButton");
const planPanel = document.querySelector("#planPanel");
const draftEditor = document.querySelector("#draftEditor");
const draftTitleInput = document.querySelector("#draftTitleInput");
const scriptStructureInput = document.querySelector("#scriptStructureInput");
const editablePlanInput = document.querySelector("#editablePlanInput");
const sourceMaterialInput = document.querySelector("#sourceMaterialInput");
const generateScriptButton = document.querySelector("#generateScriptButton");
const scriptDraftPanel = document.querySelector("#scriptDraftPanel");
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
generatePlanButton.addEventListener("click", generatePlan);
generateScriptButton.addEventListener("click", generateScriptDraft);
exportButton.addEventListener("click", exportJson);
saveTemplateButton.addEventListener("click", saveTemplate);
templateSelect.addEventListener("change", loadTemplate);
saveSessionButton.addEventListener("click", saveSession);
loadSessionButton.addEventListener("click", loadSession);
savedSessionSelect.addEventListener("change", previewSavedSession);
contentFormatInput.addEventListener("change", syncCustomFormatField);

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

function analyzeScript() {
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

function generatePlan() {
  const profile = getChannelProfile();
  const concept = formatProfile(profile);
  const base = selectedVideo || currentResults[0];
  const reference = getReferenceContext(base);
  const planText = makePlanText(profile, reference);
  const titleCandidates = makeTitleCandidates(profile, reference);
  draftTitleInput.value = titleCandidates[0];

  planPanel.classList.add("is-visible");
  planPanel.innerHTML = `
    <div class="plan-card">
      <h3>레퍼런스 근거</h3>
      <p>${escapeHtml(reference.summary)}</p>
    </div>
    <div class="plan-card">
      <h3>제목 후보</h3>
      <p>${titleCandidates.map(escapeHtml).join(" / ")}</p>
    </div>
    <div class="plan-card">
      <h3>추천 구성 방식</h3>
      <p>${escapeHtml(recommendStructure(profile, reference))}. Step 4에서 다른 구성 방식으로 변경할 수 있습니다.</p>
    </div>
    <div class="plan-card">
      <h3>스크립트 디테일 적용</h3>
      <p>${escapeHtml(reference.scriptDetails.summary)}</p>
    </div>
    <div class="plan-card">
      <h3>썸네일 방향</h3>
      <p>${escapeHtml(reference.thumbnailInsight)}</p>
    </div>
  `;
  editablePlanInput.value = planText;
  draftEditor.classList.add("is-visible");
}

function getChannelProfile() {
  return {
    name: templateNameInput.value.trim(),
    topic: channelTopicInput.value.trim(),
    audience: audienceInput.value.trim(),
    tone: toneInput.value.trim(),
    avoid: avoidInput.value.trim(),
    format: targetFormatInput.value,
    length: targetLengthInput.value,
    contentFormat: contentFormatInput.value === "기타" ? customFormatInput.value.trim() || "기타" : contentFormatInput.value,
    contentFormatPreset: contentFormatInput.value,
    customFormat: customFormatInput.value.trim(),
    memo: myChannelInput.value.trim(),
  };
}

function setChannelProfile(profile) {
  templateNameInput.value = profile.name || "";
  channelTopicInput.value = profile.topic || "";
  audienceInput.value = profile.audience || "";
  toneInput.value = profile.tone || "";
  avoidInput.value = profile.avoid || "";
  targetFormatInput.value = profile.format || "롱폼";
  targetLengthInput.value = profile.length || "8-12분";
  contentFormatInput.value = profile.contentFormatPreset || (profile.contentFormat === "기타" ? "기타" : profile.contentFormat) || "분석/해설";
  customFormatInput.value = profile.customFormat || "";
  syncCustomFormatField();
  myChannelInput.value = profile.memo || "";
}

function formatProfile(profile) {
  const parts = [
    profile.name || "내 채널",
    profile.topic && `주제: ${profile.topic}`,
    profile.audience && `타깃: ${profile.audience}`,
    profile.tone && `톤: ${profile.tone}`,
    profile.avoid && `피할 것: ${profile.avoid}`,
    profile.format && `유형: ${profile.format}`,
    profile.contentFormat && `포맷: ${profile.contentFormat}`,
    profile.length && `길이: ${profile.length}`,
  ].filter(Boolean);
  return parts.join(" / ");
}

function makePlanText(profile, reference) {
  return [
    `채널: ${profile.name || "내 채널"}`,
    `주제: ${profile.topic || "미정"}`,
    `타깃: ${profile.audience || "미정"}`,
    `톤앤매너: ${profile.tone || "미정"}`,
    `영상 길이 유형: ${profile.format}`,
    `콘텐츠 포맷: ${profile.contentFormat}`,
    `목표 길이: ${profile.length}`,
    `피하고 싶은 스타일: ${profile.avoid || "없음"}`,
    "",
    `[레퍼런스 영상]`,
    `제목: ${reference.title}`,
    `채널: ${reference.channel}`,
    `성과 신호: ${reference.metrics}`,
    `추정 성공 패턴: ${reference.pattern}`,
    `썸네일 참고점: ${reference.thumbnailInsight}`,
    `스크립트 디테일: ${reference.scriptDetails.summary}`,
    "",
    `[내 채널 변환 방향]`,
    `아이템 방향: 레퍼런스의 "${reference.corePromise}" 구조를 ${profile.topic || "내 주제"}와 ${profile.audience || "내 시청자"} 상황에 맞게 변환한다.`,
    `제목 방향: ${reference.titleFormula}`,
    "썸네일 방향: 제목을 반복하지 말고 전후 대비, 결과물, 금지/실수 신호 중 하나로 압축한다.",
    `디테일 적용 방향: ${reference.scriptDetails.application}`,
    "",
    `[추천 구성]`,
    `${recommendStructure(profile, reference)}`,
    "최종 구성 방식은 Step 4에서 선택하며, 심화분석 결과는 특정 구성법에 종속되지 않는다.",
    `추가 메모: ${profile.memo || "없음"}`,
  ].join("\n");
}

function makeRecommendedTitle(profile, titleSeed) {
  const audience = profile.audience || "내 시청자";
  const topic = profile.topic || "이 주제";
  if (profile.length === "60초 이하" || profile.format === "숏츠") {
    return `${audience}가 바로 써먹는 ${topic} 한 가지`;
  }
  if (titleSeed.includes("이유")) {
    return `${topic}이 생각보다 잘 안 되는 진짜 이유`;
  }
  return `${audience}를 위한 ${topic} 현실 적용법`;
}

function makeTitleCandidates(profile, reference) {
  const audience = profile.audience || "내 시청자";
  const topic = profile.topic || "내 주제";
  const core = reference.corePromise || "성과가 난 패턴";
  return [
    `${audience}를 위한 ${topic} 현실 적용법`,
    `${core}을 ${topic}에 적용하면 달라지는 것`,
    `${reference.titleFormula}로 다시 만든 ${topic} 콘텐츠`,
  ];
}

function generateScriptDraft() {
  const profile = getChannelProfile();
  const base = selectedVideo || currentResults[0];
  const reference = getReferenceContext(base);
  const title = draftTitleInput.value.trim() || makeTitleCandidates(profile, reference)[0];
  const plan = editablePlanInput.value.trim();
  const materials = sourceMaterialInput.value.trim();
  const details = reference.scriptDetails;
  const structure = resolveScriptStructure(profile, reference);
  const draft = [
    `[스크립트 초안]`,
    `제목: ${title}`,
    `영상 길이 유형: ${profile.format}`,
    `콘텐츠 포맷: ${profile.contentFormat}`,
    `목표 길이: ${profile.length}`,
    `구성 방식: ${structure}`,
    `레퍼런스: ${reference.title}`,
    `레퍼런스 성과 신호: ${reference.metrics}`,
    "",
    ...buildScriptSections(structure, profile, reference, plan, materials),
  ].join("\n");

  scriptDraftPanel.classList.add("is-visible");
  scriptDraftPanel.innerHTML = `
    <div class="panel-title">
      <span>초안</span>
      <h2>편집 가능한 스크립트</h2>
    </div>
    <div class="save-actions">
      <button id="copyDraftButton" class="ghost-button" type="button">초안 복사</button>
      <button id="downloadDraftButton" class="ghost-button" type="button">초안 다운로드</button>
    </div>
    <textarea id="finalScriptDraft" class="script-draft">${escapeHtml(draft)}</textarea>
  `;
  document.querySelector("#copyDraftButton").addEventListener("click", copyDraft);
  document.querySelector("#downloadDraftButton").addEventListener("click", downloadDraft);
}

function recommendStructure(profile, reference) {
  const context = `${profile.topic} ${profile.contentFormat} ${reference.title}`.toLowerCase();
  if (/괴담|미스터리|공포|사건|실화|범죄|스토리/.test(context)) {
    return "스토리텔링/괴담: 이상 징후 → 배경과 단서 → 긴장 상승 → 핵심 사건 → 해석과 여운";
  }
  if (/다큐|역사|사건 재구성/.test(context)) {
    return "다큐멘터리/사건 재구성: 핵심 장면 → 배경 → 시간순 사건 → 쟁점 → 현재적 의미";
  }
  if (/튜토리얼|따라하기|방법/.test(context)) {
    return "튜토리얼: 결과 예고 → 준비 → 단계별 실행 → 흔한 실수 → 완성 결과";
  }
  if (/리스트|체크리스트/.test(context)) {
    return "리스트형: 선정 기준 → 항목별 설명 → 우선순위 → 요약";
  }
  return "문제 해결형: 문제 상황 → 원인 → 핵심 인사이트 → 적용 방법 → 정리";
}

function resolveScriptStructure(profile, reference) {
  if (scriptStructureInput.value !== "자동 추천") return scriptStructureInput.value;
  const recommended = recommendStructure(profile, reference);
  if (recommended.startsWith("스토리텔링/괴담")) return "스토리텔링/괴담";
  if (recommended.startsWith("다큐멘터리")) return "다큐멘터리/사건 재구성";
  if (recommended.startsWith("튜토리얼")) return "튜토리얼";
  if (recommended.startsWith("리스트형")) return "리스트형";
  return "문제 해결형";
}

function buildScriptSections(structure, profile, reference, plan, materials) {
  const details = reference.scriptDetails;
  const topic = profile.topic || "이 주제";
  const audience = profile.audience || "시청자";
  const detailText = details.keyDetails.join(" / ") || reference.pattern;
  const evidenceText = [...details.examples, ...details.numbers].join(" / ") || materials || "추가 자료로 근거를 보강합니다.";
  const warningText = details.warnings.join(" / ") || "레퍼런스의 고유 표현과 사례를 그대로 복제하지 않습니다.";

  if (structure === "스토리텔링/괴담") {
    return [
      `[1. 이상 징후와 콜드 오픈]`,
      `가장 설명하기 어려운 순간이나 불길한 단서를 먼저 보여줍니다. 레퍼런스 훅 "${details.hook}"이 정보를 한 번에 다 주지 않는 방식을 참고하되, ${topic}에 맞는 새로운 장면으로 시작합니다.`,
      "",
      `[2. 배경과 정상 상태]`,
      `사건이 벌어지기 전 장소, 인물, 시간, 규칙을 짧게 정리합니다. ${audience}가 이후의 이상함을 느낄 수 있도록 평범한 상태를 먼저 세웁니다.`,
      "",
      `[3. 단서 배치와 긴장 상승]`,
      `레퍼런스에서 추출한 디테일(${detailText})의 역할을 참고해 감각 정보, 목격담, 기록, 반복되는 이상 징후를 단계적으로 배치합니다. 근거 후보: ${evidenceText}`,
      "",
      `[4. 핵심 사건과 해석]`,
      `가장 강한 사건을 공개하되 모든 의문을 한 번에 해소하지 않습니다. 서로 가능한 해석을 나란히 두고, ${warningText}`,
      "",
      `[5. 결말과 여운]`,
      `처음의 단서로 돌아가 의미를 바꾸거나, 아직 설명되지 않은 한 가지를 남겨 댓글과 재시청을 유도합니다.`,
      `기획안 반영: ${plan || "기획안의 사건과 관점을 여기에 반영합니다."}`,
    ];
  }

  if (structure === "다큐멘터리/사건 재구성") {
    return [
      `[1. 핵심 장면]`, `${reference.title}에서 가장 중요한 질문을 먼저 제시합니다.`,
      "", `[2. 배경]`, `인물, 장소, 시대적 맥락과 필요한 디테일을 설명합니다: ${detailText}`,
      "", `[3. 사건 재구성]`, `확인 가능한 사실과 시간순 사건을 구분해 전개합니다. 근거 후보: ${evidenceText}`,
      "", `[4. 쟁점과 해석]`, `서로 다른 해석과 불확실성을 분리합니다. 주의점: ${warningText}`,
      "", `[5. 현재적 의미]`, `${audience}가 이 사건에서 생각해볼 질문과 여운으로 마무리합니다.`,
    ];
  }

  if (structure === "튜토리얼") {
    return [
      `[1. 완성 결과 예고]`, `${topic}을 적용한 뒤 얻을 결과를 먼저 보여줍니다.`,
      "", `[2. 준비와 조건]`, `필요한 전제와 디테일을 정리합니다: ${detailText}`,
      "", `[3. 단계별 실행]`, `각 단계를 따라 할 수 있는 행동 단위로 설명합니다. 근거 후보: ${evidenceText}`,
      "", `[4. 흔한 실수]`, `${warningText}`,
      "", `[5. 결과 확인]`, `완료 기준과 다음 행동을 제시합니다.`,
    ];
  }

  if (structure === "리스트형") {
    return [
      `[도입]`, `${audience}에게 이 목록이 필요한 이유와 선정 기준을 설명합니다.`,
      "", `[핵심 목록]`, `${detailText}`,
      "", `[사례와 근거]`, `${evidenceText}`,
      "", `[우선순위]`, `무엇부터 적용할지 판단 기준을 줍니다.`,
      "", `[요약]`, `가장 중요한 항목 하나를 다시 강조합니다.`,
    ];
  }

  if (structure === "5-set") {
    return [
      `[SET 1. 훅]`, `${details.hook}`,
      "", `[SET 2. 문제 확대]`, `${details.claims.join(" / ") || reference.corePromise}`,
      "", `[SET 3. 디테일과 근거]`, `${detailText} / ${evidenceText}`,
      "", `[SET 4. 내 채널 적용]`, `${profile.name || "내 채널"}의 ${topic}에 맞게 변환합니다. ${plan}`,
      "", `[SET 5. 실행/마무리]`, `핵심 내용을 요약하고 다음 행동을 제안합니다.`,
    ];
  }

  if (structure === "문제 해결형") {
    return [
      `[1. 문제 상황]`, `${audience}가 ${topic}에서 겪는 문제를 구체적인 장면으로 보여줍니다.`,
      "", `[2. 원인]`, `${details.claims.join(" / ") || reference.corePromise}`,
      "", `[3. 핵심 인사이트]`, `${detailText}`,
      "", `[4. 적용 방법]`, `${plan || `${profile.name || "내 채널"}에 맞게 사례와 행동 단계로 변환합니다.`}`,
      "", `[5. 정리]`, `근거(${evidenceText})와 주의점(${warningText})을 짧게 정리하고 다음 행동을 제안합니다.`,
    ];
  }

  return [
    `[도입]`, `${details.hook}`,
    "", `[핵심 전개]`, `${detailText}`,
    "", `[사례와 근거]`, `${evidenceText}`,
    "", `[주의점]`, `${warningText}`,
    "", `[마무리]`, `${audience}가 기억할 핵심과 다음 행동을 제시합니다.`,
  ];
}

function getReferenceContext(video) {
  if (!video) {
    return {
      title: "선택한 레퍼런스 영상",
      channel: "레퍼런스 채널",
      metrics: "아직 선택된 레퍼런스 지표가 없습니다.",
      pattern: "성과가 난 주제/제목/썸네일 구조를 먼저 선택해야 합니다.",
      thumbnailInsight: "썸네일 분석을 위해 레퍼런스 영상을 선택하세요.",
      scriptDetails: emptyScriptDetails(),
      corePromise: "성과가 난 패턴",
      titleFormula: "문제와 결과를 선명하게 제시하는 제목",
      summary: "아직 선택된 레퍼런스 영상이 없습니다.",
    };
  }
  const score = video.score || scoreVideo(video);
  const titleFormula = inferTitleFormula(video.title);
  const pattern = inferReferencePattern(video, score);
  const thumbnailInsight = getThumbnailInsight(video);
  const scriptDetails = extractScriptDetails(scriptInput.value.trim());
  return {
    title: video.title,
    channel: video.channel,
    metrics: `성과점수 ${score.total}점, 조회/구독자 ${score.viewRatio.toFixed(1)}배, 좋아요율 ${percent(score.likeRate)}, 댓글율 ${percent(score.commentRate)}`,
    pattern,
    thumbnailInsight,
    scriptDetails,
    corePromise: inferCorePromise(video.title),
    titleFormula,
    summary: `"${video.title}"은 ${video.channel} 채널에서 ${score.viewRatio.toFixed(1)}배 조회/구독자 비율을 만든 레퍼런스입니다. ${pattern}`,
  };
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
    .slice(0, 160);
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

function syncCustomFormatField() {
  customFormatField.classList.toggle("is-visible", contentFormatInput.value === "기타");
}

function copyDraft() {
  const draft = document.querySelector("#finalScriptDraft")?.value.trim() || "";
  const button = document.querySelector("#copyDraftButton");
  if (!draft) {
    button.textContent = "내용 없음";
    setTimeout(() => {
      button.textContent = "초안 복사";
    }, 1400);
    return;
  }
  navigator.clipboard?.writeText(draft);
  button.textContent = "복사됨";
  setTimeout(() => {
    button.textContent = "초안 복사";
  }, 1400);
}

function downloadDraft() {
  const draft = document.querySelector("#finalScriptDraft")?.value.trim() || "";
  const button = document.querySelector("#downloadDraftButton");
  if (!draft) {
    button.textContent = "내용 없음";
    setTimeout(() => {
      button.textContent = "초안 다운로드";
    }, 1400);
    return;
  }
  const blob = new Blob([draft], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeName = (templateNameInput.value || "script-draft").replace(/[\\/:*?"<>|]/g, "").slice(0, 48);
  link.href = url;
  link.download = `${safeName || "script-draft"}-초안.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
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

function saveTemplate() {
  const profile = getChannelProfile();
  if (!profile.name) {
    saveTemplateButton.textContent = "이름 필요";
    setTimeout(() => {
      saveTemplateButton.textContent = "채널 설정 저장";
    }, 1400);
    return;
  }
  const templates = getTemplates();
  templates[profile.name] = profile;
  localStorage.setItem("referenceSignalTemplates", JSON.stringify(templates));
  renderTemplateOptions(profile.name);
  saveTemplateButton.textContent = "저장됨";
  setTimeout(() => {
    saveTemplateButton.textContent = "채널 설정 저장";
  }, 1400);
}

function loadTemplate() {
  const name = templateSelect.value;
  if (!name) return;
  const templates = getTemplates();
  if (templates[name]) {
    setChannelProfile(templates[name]);
  }
}

function getTemplates() {
  try {
    return JSON.parse(localStorage.getItem("referenceSignalTemplates") || "{}");
  } catch {
    return {};
  }
}

function renderTemplateOptions(selectedName = "") {
  const templates = getTemplates();
  const names = Object.keys(templates).sort((a, b) => a.localeCompare(b, "ko"));
  templateSelect.innerHTML = `<option value="">채널 불러오기</option>${names
    .map((name) => `<option value="${escapeHtml(name)}" ${name === selectedName ? "selected" : ""}>${escapeHtml(name)}</option>`)
    .join("")}`;
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
    draftTitle: draftTitleInput.value,
    scriptStructure: scriptStructureInput.value,
    editablePlan: editablePlanInput.value,
    sourceMaterial: sourceMaterialInput.value,
    profile: getChannelProfile(),
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
    draftTitleInput.value = session.draftTitle || "";
    scriptStructureInput.value = session.scriptStructure || "자동 추천";
    editablePlanInput.value = session.editablePlan || "";
    sourceMaterialInput.value = session.sourceMaterial || "";
    setChannelProfile(session.profile || {});
    draftEditor.classList.toggle("is-visible", Boolean(session.editablePlan || session.sourceMaterial));
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

renderTemplateOptions();
renderSavedSessionOptions();
syncCustomFormatField();
renderMetrics([]);
renderResults([]);
