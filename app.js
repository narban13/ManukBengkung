const STORY_DATA = {
  title: "Surat dari Kota Hujan",
  synopsis:
    "Sebuah kisah singkat tentang perjalanan pulang, catatan lama yang tertinggal di stasiun, dan pertemuan tak terduga.",
  chapters: [
    {
      title: "Bab 1: Kereta Pagi",
      paragraphs: [
        "Hujan turun pelan sejak pukul lima pagi, membasahi kaca jendela kereta yang melaju ke arah selatan.",
        "Raka membuka buku catatan bersampul kulit yang baru ia temukan di laci meja kerjanya semalam. Di halaman pertama, ada potongan tiket kereta tertanggal tiga tahun lalu.",
        "Ia menarik napas panjang. Kadang, hal yang paling lama kita hindari justru menunggu di ujung perjalanan yang paling sederhana."
      ]
    },
    {
      title: "Bab 2: Stasiun Lama",
      paragraphs: [
        "Pintu peron terbuka dengan bunyi mendesis pelan. Aroma kopi tubruk dan aspal basah langsung menyambut langkah pertama Raka.",
        "Di bangku kayu dekat loket lama, seseorang duduk sambil memandangi jadwal keberangkatan yang sudah usang.",
        "\"Kamu datang juga,\" suara itu terdengar tenang, seolah waktu tidak pernah benar-benar menjauhkan mereka."
      ]
    }
  ]
};

const STORAGE_KEYS = {
  chapter: "story_current_chapter",
  fontSize: "story_font_size",
  darkMode: "story_dark_mode"
};

let currentIndex = Number(localStorage.getItem(STORAGE_KEYS.chapter)) || 0;
let fontSize = Number(localStorage.getItem(STORAGE_KEYS.fontSize)) || 18;
let isDark = localStorage.getItem(STORAGE_KEYS.darkMode) === "true";

const storyTitleEl = document.getElementById("storyTitle");
const storySynopsisEl = document.getElementById("storySynopsis");
const chapterListEl = document.getElementById("chapterList");
const chapterIndicatorEl = document.getElementById("chapterIndicator");
const readTimeEl = document.getElementById("readTime");
const chapterHeadingEl = document.getElementById("chapterHeading");
const chapterContentEl = document.getElementById("chapterContent");
const prevBtn = document.getElementById("prevChapterBtn");
const nextBtn = document.getElementById("nextChapterBtn");
const continueBtn = document.getElementById("continueBtn");
const themeToggleBtn = document.getElementById("themeToggle");

function applyPreferences() {
  document.body.classList.toggle("dark", isDark);
  themeToggleBtn.textContent = isDark ? "Mode Terang" : "Mode Gelap";
  document.documentElement.style.setProperty("--font-size", `${fontSize}px`);
}

function estimateReadTime(paragraphs) {
  const words = paragraphs.join(" ").trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `~${minutes} menit baca`;
}

function renderChapterList() {
  chapterListEl.innerHTML = "";
  STORY_DATA.chapters.forEach((chapter, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `chapter-item ${index === currentIndex ? "active" : ""}`;
    btn.innerHTML = `<span>${chapter.title}</span><span>Baca →</span>`;
    btn.addEventListener("click", () => {
      renderChapter(index, true);
    });
    chapterListEl.appendChild(btn);
  });
}

function renderChapter(index, scrollToReader = false) {
  const maxIndex = STORY_DATA.chapters.length - 1;
  currentIndex = Math.max(0, Math.min(index, maxIndex));
  localStorage.setItem(STORAGE_KEYS.chapter, String(currentIndex));

  const chapter = STORY_DATA.chapters[currentIndex];
  chapterIndicatorEl.textContent = `Bab ${currentIndex + 1} dari ${STORY_DATA.chapters.length}`;
  readTimeEl.textContent = estimateReadTime(chapter.paragraphs);
  chapterHeadingEl.textContent = chapter.title;

  chapterContentEl.innerHTML = chapter.paragraphs
    .map((p) => `<p>${p}</p>`)
    .join("");

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === maxIndex;
  continueBtn.textContent = currentIndex > 0 ? `Lanjut ${chapter.title}` : "Mulai Membaca";

  renderChapterList();

  if (scrollToReader) {
    document.getElementById("readerSection").scrollIntoView({ behavior: "smooth" });
  }
}

prevBtn.addEventListener("click", () => renderChapter(currentIndex - 1, true));
nextBtn.addEventListener("click", () => renderChapter(currentIndex + 1, true));
continueBtn.addEventListener("click", () => renderChapter(currentIndex, true));

document.getElementById("fontIncrease").addEventListener("click", () => {
  fontSize = Math.min(26, fontSize + 2);
  localStorage.setItem(STORAGE_KEYS.fontSize, String(fontSize));
  applyPreferences();
});

document.getElementById("fontDecrease").addEventListener("click", () => {
  fontSize = Math.max(14, fontSize - 2);
  localStorage.setItem(STORAGE_KEYS.fontSize, String(fontSize));
  applyPreferences();
});

themeToggleBtn.addEventListener("click", () => {
  isDark = !isDark;
  localStorage.setItem(STORAGE_KEYS.darkMode, String(isDark));
  applyPreferences();
});

storyTitleEl.textContent = STORY_DATA.title;
document.title = STORY_DATA.title;
storySynopsisEl.textContent = STORY_DATA.synopsis;
applyPreferences();
renderChapter(currentIndex, false);
