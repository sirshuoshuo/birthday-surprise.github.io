const pageShell = document.querySelector(".page-shell");
const sealButton = document.getElementById("sealButton");
const nextPage = document.getElementById("nextPage");
const page3 = document.getElementById("page3");
const page4 = document.getElementById("page4");
const page5 = document.getElementById("page5");
const page6 = document.getElementById("page6");
const page7 = document.getElementById("page7");
const page8 = document.getElementById("page8");
const page9 = document.getElementById("page9");
const page10 = document.getElementById("page10");
const page11 = document.getElementById("page11");
const musicTip = document.getElementById("musicTip");
const bgm = document.getElementById("bgm");

let hasOpened = false;

/** 第八页：左列 col/ 竖图；右列 row/ 横图两行（前一半 / 后一半，互不重复） */
function initPage8FilmStrips() {
  const gallery = document.querySelector("#page8 .page8-gallery");
  if (!gallery || gallery.dataset.page8Ready === "1") return;

  const colFigs = [...gallery.querySelectorAll("figure.page8-thumb--col")];
  const rowFigs = [...gallery.querySelectorAll("figure.page8-thumb--row")];
  const allFigs = [...colFigs, ...rowFigs];
  if (!allFigs.length) return;

  const waitImg = (img) => {
    if (!img) return Promise.resolve();
    if (img.complete && img.naturalWidth > 0) return Promise.resolve();
    return new Promise((resolve) => {
      img.addEventListener("load", resolve, { once: true });
      img.addEventListener("error", resolve, { once: true });
    });
  };

  /** 横图拆成上下两行：前半与后半，无交集 */
  function splitLandscapeRows(list) {
    if (!list.length) return [[], []];
    const mid = Math.ceil(list.length / 2);
    return [list.slice(0, mid), list.slice(mid)];
  }

  function buildVerticalTrack(figList, durationSec) {
    const track = document.createElement("div");
    track.className = "film-track film-track--vertical";
    track.style.setProperty("--film-duration", `${durationSec}s`);

    const addCells = (list) => {
      for (const fig of list) {
        const cell = document.createElement("div");
        cell.className = "film-strip__cell";
        cell.appendChild(fig.cloneNode(true));
        track.appendChild(cell);
      }
    };
    addCells(figList);
    addCells(figList);

    return track;
  }

  function buildHorizontalTrack(figList, durationSec, reverse) {
    const track = document.createElement("div");
    track.className = "film-track film-track--horizontal";
    track.style.setProperty("--film-duration", `${durationSec}s`);
    if (reverse) track.classList.add("film-track--reverse-x");

    const addCells = (list) => {
      for (const fig of list) {
        const cell = document.createElement("div");
        cell.className = "film-strip__cell";
        cell.appendChild(fig.cloneNode(true));
        track.appendChild(cell);
      }
    };
    addCells(figList);
    addCells(figList);

    return track;
  }

  function makePerfVertical() {
    const el = document.createElement("div");
    el.className = "film-perf film-perf--vertical";
    el.setAttribute("aria-hidden", "true");
    return el;
  }

  function makePerfHorizontal() {
    const el = document.createElement("div");
    el.className = "film-perf film-perf--horizontal";
    el.setAttribute("aria-hidden", "true");
    return el;
  }

  Promise.all(allFigs.map((fig) => waitImg(fig.querySelector("img")))).then(() => {
    if (!gallery.isConnected || gallery.dataset.page8Ready === "1") return;

    gallery.innerHTML = "";

    const zone = document.createElement("div");
    zone.className = "film-zone";
    zone.setAttribute("aria-label", "照片轮播区");

    if (!colFigs.length) {
      zone.classList.add("film-zone--landscape-only");
    } else if (!rowFigs.length) {
      zone.classList.add("film-zone--portrait-only");
    }

    if (colFigs.length) {
      const colP = document.createElement("div");
      colP.className = "film-col film-col--portrait";
      const rail = document.createElement("div");
      rail.className = "film-rail film-rail--vertical";
      const vp = document.createElement("div");
      vp.className = "film-viewport film-viewport--vertical";
      vp.appendChild(buildVerticalTrack(colFigs, 46));
      rail.appendChild(makePerfVertical());
      rail.appendChild(vp);
      rail.appendChild(makePerfVertical());
      colP.appendChild(rail);
      zone.appendChild(colP);
    }

    if (rowFigs.length) {
      const [row1Figs, row2Figs] = splitLandscapeRows(rowFigs);

      const colL = document.createElement("div");
      colL.className = "film-col film-col--landscape";

      const rowTop = document.createElement("div");
      rowTop.className = "film-row film-row--horizontal";
      const vpT = document.createElement("div");
      vpT.className = "film-viewport film-viewport--horizontal";
      vpT.appendChild(buildHorizontalTrack(row1Figs, 52, false));
      rowTop.appendChild(makePerfHorizontal());
      rowTop.appendChild(vpT);
      rowTop.appendChild(makePerfHorizontal());
      colL.appendChild(rowTop);

      if (row2Figs.length) {
        const rowBot = document.createElement("div");
        rowBot.className = "film-row film-row--horizontal";
        const vpB = document.createElement("div");
        vpB.className = "film-viewport film-viewport--horizontal";
        vpB.appendChild(buildHorizontalTrack(row2Figs, 58, true));
        rowBot.appendChild(makePerfHorizontal());
        rowBot.appendChild(vpB);
        rowBot.appendChild(makePerfHorizontal());
        colL.appendChild(rowBot);
      }

      zone.appendChild(colL);
    }

    gallery.appendChild(zone);
    gallery.dataset.page8Ready = "1";
  });
}

async function tryPlayMusic() {
  if (!bgm) {
    return;
  }

  try {
    bgm.currentTime = 0;
    await bgm.play();
    if (musicTip) {
      musicTip.textContent = "背景音乐已开始播放。";
    }
  } catch (error) {
    if (musicTip) {
      musicTip.textContent = "页面动画已经开始。如果还没有音乐，请把文件放到 bgm/birthday-bgm.mp3。";
    }
  }
}

function openEnvelope() {
  if (hasOpened) {
    return;
  }

  hasOpened = true;
  pageShell?.classList.add("is-open");
  nextPage?.setAttribute("aria-hidden", "false");
  void tryPlayMusic();
}

function handlePageTransition() {
  if (!hasOpened) return;
  
  if (!pageShell?.classList.contains("is-page3")) {
    pageShell?.classList.add("is-page3");
    page3?.setAttribute("aria-hidden", "false");
  } else if (!pageShell?.classList.contains("is-page4")) {
    pageShell?.classList.add("is-page4");
    page4?.setAttribute("aria-hidden", "false");
  } else if (!pageShell?.classList.contains("is-page5")) {
    pageShell?.classList.add("is-page5");
    page5?.setAttribute("aria-hidden", "false");
  } else if (!pageShell?.classList.contains("is-page6")) {
    pageShell?.classList.add("is-page6");
    page6?.setAttribute("aria-hidden", "false");
  } else if (!pageShell?.classList.contains("is-page7")) {
    pageShell?.classList.add("is-page7");
    page7?.setAttribute("aria-hidden", "false");
  } else if (!pageShell?.classList.contains("is-page8")) {
    pageShell?.classList.add("is-page8");
    page8?.setAttribute("aria-hidden", "false");
    queueMicrotask(() => initPage8FilmStrips());
  } else if (!pageShell?.classList.contains("is-page9")) {
    pageShell?.classList.add("is-page9");
    page9?.setAttribute("aria-hidden", "false");
    queueMicrotask(() => syncPage9Videos(true));
  } else if (!pageShell?.classList.contains("is-page10")) {
    pageShell?.classList.add("is-page10");
    page10?.setAttribute("aria-hidden", "false");
    // Trigger animation when page10 is active
    page10?.classList.add("active");
  } else if (!pageShell?.classList.contains("is-page11")) {
    pageShell?.classList.add("is-page11");
    page11?.setAttribute("aria-hidden", "false");
    startPage11CandleSequence();
  }
}

/** 第 11 页：3s 后风吹灭烛 → 再切烟花终幕（时长与 CSS 中熄灭动画一致） */
const PAGE11_HINT_MS = 3000;
const PAGE11_EXTINGUISH_MS = 2200;

function startPage11CandleSequence() {
  if (!page11 || page11.dataset.page11Seq === "1") return;
  page11.dataset.page11Seq = "1";
  page11.classList.add("active");

  window.setTimeout(() => {
    page11.classList.add("is-extinguishing");
  }, PAGE11_HINT_MS);

  window.setTimeout(() => {
    page11.classList.add("is-finale");
    queueMicrotask(() => startPage11FireworksCanvas());
  }, PAGE11_HINT_MS + PAGE11_EXTINGUISH_MS);
}

/**
 * 第 11 页终幕：Canvas 物理弹道烟花（与独立参考页算法一致，仅在 is-finale 后启动）
 */
function startPage11FireworksCanvas() {
  if (!page11 || page11.dataset.page11FwInit === "1") return;
  const canvas = document.getElementById("page11FireworksCanvas");
  if (!canvas) return;

  page11.dataset.page11FwInit = "1";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let cw = 800;
  let ch = 600;

  const gravity = 0.06;
  const particleGravity = 0.12;
  const friction = 0.94;

  const rockets = [];
  const particles = [];

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function resizeCanvas() {
    const wrap = canvas.parentElement;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    cw = Math.max(1, Math.floor(rect.width));
    ch = Math.max(1, Math.floor(rect.height));
    canvas.width = cw;
    canvas.height = ch;
  }

  class Rocket {
    constructor(startX, startY, targetX, targetY) {
      const isMidScreen = Math.random() > 0.7;
      this.x = startX !== undefined ? startX : random(cw * 0.1, cw * 0.9);
      this.y = startY !== undefined ? startY : (isMidScreen ? random(ch * 0.4, ch * 0.7) : ch);

      this.targetX = targetX !== undefined ? targetX : this.x + random(-cw * 0.2, cw * 0.2);
      this.targetY = targetY !== undefined ? targetY : random(ch * 0.1, ch * 0.4);

      if (this.targetY >= this.y) {
        this.targetY = this.y - 100;
      }

      this.hue = random(0, 360);

      const distanceY = this.y - this.targetY;
      this.vy = -Math.sqrt(2 * gravity * distanceY);
      const timeToApex = -this.vy / gravity;
      const distanceX = this.targetX - this.x;
      this.vx = distanceX / timeToApex;

      this.coordinates = [];
      let coordinateCount = 4;
      while (coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }
    }

    update(index) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);

      this.vy += gravity;
      this.x += this.vx;
      this.y += this.vy;

      if (this.vy >= 0) {
        rockets.splice(index, 1);
        createParticles(this.x, this.y, this.hue);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = `hsl(${this.hue}, 100%, 60%)`;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
  }

  class Particle {
    constructor(x, y, hue) {
      this.x = x;
      this.y = y;
      this.coordinates = [];
      let coordinateCount = Math.floor(random(4, 7));
      while (coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
      }

      const angle = random(0, Math.PI * 2);
      const speed = random(1, 12);

      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;

      this.friction = friction;
      this.gravity = particleGravity;

      this.hue = random(hue - 30, hue + 30);
      this.brightness = random(50, 90);
      this.alpha = 1;
      this.decay = random(0.015, 0.03);
    }

    update(index) {
      this.coordinates.pop();
      this.coordinates.unshift([this.x, this.y]);

      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;

      this.x += this.vx;
      this.y += this.vy;

      this.alpha -= this.decay;

      if (this.alpha <= this.decay) {
        particles.splice(index, 1);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  function createParticles(x, y, hue) {
    let particleCount = Math.floor(random(100, 150));
    while (particleCount--) {
      particles.push(new Particle(x, y, hue));
    }
  }

  let timerTotal = 50;
  let timerTick = 0;

  function loop() {
    requestAnimationFrame(loop);

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(10, 15, 25, 0.25)";
    ctx.fillRect(0, 0, cw, ch);

    ctx.globalCompositeOperation = "lighter";

    let i = rockets.length;
    while (i--) {
      rockets[i].draw();
      rockets[i].update(i);
    }

    let j = particles.length;
    while (j--) {
      particles[j].draw();
      particles[j].update(j);
    }

    if (timerTick >= timerTotal) {
      let launchCount = Math.floor(random(1, 4));
      while (launchCount--) {
        rockets.push(new Rocket());
      }
      timerTick = 0;
      timerTotal = random(30, 80);
    } else {
      timerTick++;
    }
  }

  function onCanvasClick(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const targetX = (e.clientX - rect.left) * scaleX;
    const targetY = (e.clientY - rect.top) * scaleY;
    rockets.push(new Rocket(cw / 2, ch, targetX, targetY));
  }

  function onResize() {
    resizeCanvas();
  }

  /* 等 is-finale 布局稳定后再量宽高，避免首帧尺寸为 0 */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      resizeCanvas();
      canvas.style.cursor = "crosshair";
      canvas.addEventListener("click", onCanvasClick);
      window.addEventListener("resize", onResize);
      loop();
    });
  });
}

/** 与 styles.css 中 page9-fly-in-depth 动画时长一致 */
const PAGE9_TUNNEL_DURATION_SEC = 10;

/** 仅四个角：左上 / 左下 / 右上 / 右下（索引 0–3） */
const PAGE9_ZONES = [
  { tx: "-17vw", ty: "-12vh" },
  { tx: "-15vw", ty: "14vh" },
  { tx: "17vw", ty: "-11vh" },
  { tx: "16vw", ty: "13vh" },
];

function page9ShuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** 环形序列：任意相邻两槽（含首尾）不得为同一方向 */
function page9IsValidRingSequence(seq) {
  const n = seq.length;
  for (let i = 0; i < n; i++) {
    if (seq[i] === seq[(i + 1) % n]) return false;
  }
  return true;
}

/**
 * 在 4 个角上尽量均匀分配出现次数（6 次≈各 1～2 次），再洗牌直到满足环形不相邻重复
 */
function page9PickBalancedQuadSequence(len) {
  const k = PAGE9_ZONES.length;
  if (len <= 0) return [];

  const perm = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
  const multiset = [];
  for (let i = 0; i < k; i++) {
    const cnt = i < len % k ? Math.ceil(len / k) : Math.floor(len / k);
    for (let j = 0; j < cnt; j++) multiset.push(perm[i]);
  }

  for (let attempt = 0; attempt < 400; attempt++) {
    page9ShuffleInPlace(multiset);
    if (page9IsValidRingSequence(multiset)) return multiset;
  }

  return page9GreedyQuadRingSequence(len);
}

/**
 * 均匀 multiset 仍无法环形时：贪心随机填槽（相邻及首尾不同）
 */
function page9GreedyQuadRingSequence(len) {
  const k = PAGE9_ZONES.length;
  for (let attempt = 0; attempt < 5000; attempt++) {
    const seq = [];
    let ok = true;
    for (let i = 0; i < len; i++) {
      const forbidden = new Set();
      if (i > 0) forbidden.add(seq[i - 1]);
      if (i === len - 1 && len > 1) forbidden.add(seq[0]);
      const choices = [];
      for (let z = 0; z < k; z++) {
        if (!forbidden.has(z)) choices.push(z);
      }
      if (!choices.length) {
        ok = false;
        break;
      }
      seq.push(choices[Math.floor(Math.random() * choices.length)]);
    }
    if (ok && page9IsValidRingSequence(seq)) return seq;
  }
  const cycle = Array.from({ length: len }, (_, i) => i % k);
  if (page9IsValidRingSequence(cycle)) return cycle;
  /* 当前页面为 6 张卡时的已知合法环 */
  if (len === 6) return [0, 1, 2, 0, 3, 1];
  return cycle;
}

/**
 * 随机打乱 6 个视频与 6 个时间槽的对应关系；为每槽分配不连续重复的出现方向
 */
function initPage9LayoutRandom() {
  const root = document.getElementById("page9");
  if (!root || root.dataset.page9LayoutInit === "1") return;
  const scene = root.querySelector(".page9-tunnel-scene");
  if (!scene) return;
  const cards = [...scene.querySelectorAll(".page9-card")];
  if (!cards.length) return;

  const videos = cards.map((c) => c.querySelector("video")).filter(Boolean);
  if (videos.length !== cards.length) return;

  const sources = videos.map((v) => v.getAttribute("src"));
  page9ShuffleInPlace(sources);

  const zoneIdx = page9PickBalancedQuadSequence(cards.length);

  const n = cards.length;
  /** 相邻两槽出现的时间间隔（秒）= 周期 / 卡片数；与 CSS 动画总时长一致 */
  const step = PAGE9_TUNNEL_DURATION_SEC / n;

  cards.forEach((card, i) => {
    const z = PAGE9_ZONES[zoneIdx[i]];
    const delaySec = -(i * step);
    card.style.setProperty("--page9-tx", z.tx);
    card.style.setProperty("--page9-ty", z.ty);
    card.style.setProperty("--page9-delay", `${delaySec.toFixed(3)}s`);
    videos[i].src = sources[i];
  });

  root.dataset.page9LayoutInit = "1";
}

/** 将视频跳到开头并播放（元数据未就绪时等 loadedmetadata） */
function page9RestartVideoFromStart(video) {
  if (!video) return;
  const seekAndPlay = () => {
    try {
      video.currentTime = 0;
    } catch {
      /* ignore */
    }
    video.play().catch(() => {});
  };
  if (video.readyState >= 1) {
    seekAndPlay();
  } else {
    video.addEventListener("loadedmetadata", seekAndPlay, { once: true });
  }
}

/** 第九页：进入/离开时控制视频；每次隧道循环从开头播放 */
function syncPage9Videos(playing) {
  const root = document.getElementById("page9");
  if (!root) return;
  root.querySelectorAll("video").forEach((v) => {
    if (playing) {
      page9RestartVideoFromStart(v);
    } else {
      v.pause();
    }
  });
}

/** 每张卡片 CSS 动画每完成一轮，对应视频从头播放（与隧道循环对齐） */
function initPage9TunnelVideoLoops() {
  const root = document.getElementById("page9");
  if (!root || root.dataset.page9LoopInit === "1") return;
  root.dataset.page9LoopInit = "1";
  root.querySelectorAll(".page9-card").forEach((card) => {
    const video = card.querySelector("video");
    if (!video) return;
    card.addEventListener("animationiteration", () => {
      page9RestartVideoFromStart(video);
    });
  });
}

sealButton?.addEventListener("click", openEnvelope);
nextPage?.addEventListener("click", handlePageTransition);
page3?.addEventListener("click", handlePageTransition);
page4?.addEventListener("click", handlePageTransition);
page5?.addEventListener("click", handlePageTransition);
page6?.addEventListener("click", handlePageTransition);
page7?.addEventListener("click", handlePageTransition);
page8?.addEventListener("click", handlePageTransition);
page9?.addEventListener("click", handlePageTransition);
page10?.addEventListener("click", handlePageTransition);

document.addEventListener("DOMContentLoaded", () => {
  initPage8FilmStrips();
  initPage9LayoutRandom();
  initPage9TunnelVideoLoops();
  syncPage9Videos(false);
});

if (page8) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) initPage8FilmStrips();
      });
    },
    { threshold: 0.01 }
  );
  io.observe(page8);
}
