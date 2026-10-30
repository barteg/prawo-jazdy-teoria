// app.js — Main Application Controller for Prawo Jazdy PWA

import { COMPENDIUM_CHAPTERS } from './compendium-data.js';
import { ROAD_SIGNS } from './signs-data.js';

// Configuration
const CDN_IMG_BASE = 'https://f003.backblazeb2.com/file/prawko/img/';
const CDN_VID_BASE = 'https://f003.backblazeb2.com/file/prawko/vid/';

// State
const state = {
  activeTab: 'exam',
  currentCategory: 'B',
  categoriesMeta: [],
  examRules: {
    totalQuestions: 32,
    basicQuestions: 20,
    specialistQuestions: 12,
    maxPoints: 74,
    passThreshold: 68,
    totalTimeSeconds: 1500,
    basicTimeSeconds: 20,
    specialistTimeSeconds: 50,
    basicPoints: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1],
    specialistPoints: [3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 1, 1]
  },
  questionsCache: {}, // { 'B': { basic: [], specialist: [] } }
  
  // Exam State
  exam: {
    active: false,
    questions: [], // list of 32 selected exam question objects with points
    currentIndex: 0,
    userAnswers: {}, // { index: selectedAnswer }
    confirmed: {}, // { index: true }
    totalTimerId: null,
    questionTimerId: null,
    totalTimeLeft: 1500,
    questionTimeLeft: 20,
    finished: false,
    result: null
  },

  // Practice State
  practice: {
    questions: [],
    filteredQuestions: [],
    currentIndex: 0,
    currentFilter: 'all', // all, basic, specialist
    searchQuery: '',
    selectedAnswer: null,
    isAnswered: false
  },

  // Mistakes State
  mistakes: {
    questionIds: [], // list of question ids
    currentIndex: 0,
    selectedAnswer: null,
    isAnswered: false
  },

  // Compendium
  compendiumSearch: '',

  // Storage
  userStats: {
    examsTotal: 0,
    examsPassed: 0,
    questionsAnswered: 0,
    questionsCorrect: 0,
    examHistory: []
  }
};

// LocalStorage Keys
const STORAGE_KEYS = {
  STATS: 'pj_user_stats',
  MISTAKES: 'pj_mistakes_ids',
  BOOKMARKS: 'pj_bookmarks_ids',
  THEME: 'pj_theme_preference'
};

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  loadSavedData();
  setupNavigation();
  setupTheme();
  setupIOSModal();
  setupOfflineSupport();
  renderCompendium();
  renderRoadSigns();
  updateStatsDisplay();

  // Load Meta and default Category Questions
  await loadMetadata();
  await switchCategory(state.currentCategory);
});

// ---------------------------------------------------------------------------
// Storage Management
// ---------------------------------------------------------------------------
function loadSavedData() {
  try {
    const savedStats = localStorage.getItem(STORAGE_KEYS.STATS);
    if (savedStats) state.userStats = JSON.parse(savedStats);

    const savedMistakes = localStorage.getItem(STORAGE_KEYS.MISTAKES);
    if (savedMistakes) state.mistakes.questionIds = JSON.parse(savedMistakes);
  } catch (e) {
    console.error('Failed to load local storage:', e);
  }
}

function saveStats() {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(state.userStats));
  } catch (e) {
    console.warn('Storage save error:', e);
  }
}

function saveMistakes() {
  try {
    localStorage.setItem(STORAGE_KEYS.MISTAKES, JSON.stringify(state.mistakes.questionIds));
  } catch (e) {
    console.warn('Storage save error:', e);
  }
}

function recordMistake(questionId) {
  if (!state.mistakes.questionIds.includes(questionId)) {
    state.mistakes.questionIds.push(questionId);
    saveMistakes();
    updateMistakesBadge();
  }
}

function removeMistake(questionId) {
  state.mistakes.questionIds = state.mistakes.questionIds.filter(id => id !== questionId);
  saveMistakes();
  updateMistakesBadge();
}

function updateMistakesBadge() {
  const badge = document.getElementById('nav-mistakes-count');
  if (badge) {
    const count = state.mistakes.questionIds.length;
    badge.textContent = count > 0 ? count : '';
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  }
}

// ---------------------------------------------------------------------------
// Theme Management
// ---------------------------------------------------------------------------
function setupTheme() {
  const themeToggle = document.getElementById('btn-toggle-theme');
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(STORAGE_KEYS.THEME, next);
      updateThemeIcon(next);
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ---------------------------------------------------------------------------
// Navigation / Routing
// ---------------------------------------------------------------------------
function setupNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const target = tab.getAttribute('data-target');
      switchTab(target);
    });
  });

  // Category select change
  const catSelect = document.getElementById('category-select');
  if (catSelect) {
    catSelect.addEventListener('change', async (e) => {
      await switchCategory(e.target.value);
    });
  }
}

function switchTab(tabId) {
  state.activeTab = tabId;

  // Update tabs active state
  document.querySelectorAll('.nav-tab').forEach(t => {
    t.classList.toggle('active', t.getAttribute('data-target') === tabId);
  });

  // Update view active state
  document.querySelectorAll('.tab-view').forEach(v => {
    v.classList.toggle('active', v.id === `view-${tabId}`);
  });

  // Specific tab on-enter actions
  if (tabId === 'practice') {
    initPractice();
  } else if (tabId === 'mistakes') {
    initMistakes();
  } else if (tabId === 'stats') {
    updateStatsDisplay();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---------------------------------------------------------------------------
// Data Loading
// ---------------------------------------------------------------------------
async function loadMetadata() {
  try {
    const res = await fetch('data/meta.json');
    if (!res.ok) throw new Error('Meta fetch failed');
    const meta = await res.json();
    state.categoriesMeta = meta.categories || [];
    if (meta.exam) state.examRules = meta.exam;
    try {
      localStorage.setItem('pj_cache_meta', JSON.stringify(meta));
    } catch (_) {}
  } catch (err) {
    console.warn('Metadata load fallback to localStorage:', err);
    try {
      const cached = localStorage.getItem('pj_cache_meta');
      if (cached) {
        const meta = JSON.parse(cached);
        state.categoriesMeta = meta.categories || [];
        if (meta.exam) state.examRules = meta.exam;
      }
    } catch (_) {}
  }

  // Populate category dropdown
  const select = document.getElementById('category-select');
  if (select && state.categoriesMeta.length) {
    select.innerHTML = state.categoriesMeta.map(c => `
      <option value="${c.id}" ${c.id === state.currentCategory ? 'selected' : ''}>
        ${c.name} (${c.questionCount} pytań)
      </option>
    `).join('');
  }
}

async function switchCategory(cat) {
  state.currentCategory = cat;
  const loadingEl = document.getElementById('app-loading');
  if (loadingEl) loadingEl.style.display = 'block';

  try {
    if (!state.questionsCache[cat]) {
      let data = null;
      try {
        const res = await fetch(`data/${encodeURIComponent(cat)}.json`);
        if (!res.ok) throw new Error(`Category ${cat} fetch failed`);
        data = await res.json();
        try {
          if (cat === 'B') {
            localStorage.setItem(`pj_cache_cat_${cat}`, JSON.stringify(data));
          }
        } catch (_) {}
      } catch (fetchErr) {
        // Fallback to localStorage if available
        const localCached = localStorage.getItem(`pj_cache_cat_${cat}`);
        if (localCached) {
          data = JSON.parse(localCached);
        } else {
          throw fetchErr;
        }
      }
      
      const basic = [];
      const specialist = [];
      (data.questions || []).forEach(q => {
        if (q.type === 'basic') basic.push(q);
        else specialist.push(q);
      });

      state.questionsCache[cat] = {
        all: data.questions || [],
        basic,
        specialist
      };
    }

    // Refresh views with new questions
    if (state.activeTab === 'practice') initPractice();
    if (state.activeTab === 'mistakes') initMistakes();
    renderExamStartScreen();

  } catch (err) {
    console.error(`Error loading category ${cat}:`, err);
    if (!state.questionsCache[cat]) {
      alert(`Nie udało się załadować pytań dla kategorii ${cat}. Sprawdź, czy baza pytań została pobrana w trybie offline.`);
    }
  } finally {
    if (loadingEl) loadingEl.style.display = 'none';
    updateMistakesBadge();
  }
}

// ---------------------------------------------------------------------------
// EXAM MODE (WORD OFFICIAL SIMULATION)
// ---------------------------------------------------------------------------
function renderExamStartScreen() {
  const container = document.getElementById('exam-container');
  if (!container) return;

  const catData = state.questionsCache[state.currentCategory];
  const qCount = catData ? catData.all.length : 0;

  container.innerHTML = `
    <div class="card">
      <div class="card-title">
        <span>🚗</span> Symulacja Egzaminu Państwowego WORD
      </div>
      <p class="card-subtitle">
        Oficjalny egzamin teoretyczny na prawo jazdy kategorii <strong>${state.currentCategory}</strong>.
      </p>

      <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: 16px; margin: 16px 0; border: 1px solid var(--border-color);">
        <h4 style="font-size: 14px; margin-bottom: 10px; color: var(--accent-blue);">Zasady oficjalnego egzaminu:</h4>
        <ul style="font-size: 13px; color: var(--text-secondary); margin-left: 20px; line-height: 1.6;">
          <li>Liczba pytań: <strong>32</strong> (20 podstawowych + 12 specjalistycznych)</li>
          <li>Czas trwania: <strong>25 minut</strong></li>
          <li>Maksymalna liczba punktów: <strong>74</strong></li>
          <li>Próg zaliczenia: <strong>68 punktów (92%)</strong></li>
          <li>Pytania podstawowe: <strong>20 sekund</strong> na zapoznanie i odpowiedź (TAK/NIE)</li>
          <li>Pytania specjalistyczne: <strong>50 sekund</strong> na zapoznanie i odpowiedź (A/B/C)</li>
          <li>Po zatwierdzeniu odpowiedzi nie ma możliwości powrotu do pytania!</li>
        </ul>
      </div>

      <div class="flex-between" style="margin-bottom: 20px;">
        <span class="badge badge-blue">Kategoria ${state.currentCategory}</span>
        <span style="font-size: 12px; color: var(--text-muted);">Dostępne pytania w bazie: ${qCount}</span>
      </div>

      <button id="btn-start-exam" class="btn btn-primary" style="font-size: 16px; padding: 15px;">
        🚀 Rozpocznij Egzamin WORD
      </button>
    </div>
  `;

  document.getElementById('btn-start-exam')?.addEventListener('click', startExam);
}

function startExam() {
  const catData = state.questionsCache[state.currentCategory];
  if (!catData || catData.all.length < 32) {
    alert('Baza pytań dla wybranej kategorii jest niedostępna.');
    return;
  }

  // Shuffle and pick 20 basic and 12 specialist
  const shuffledBasic = [...catData.basic].sort(() => 0.5 - Math.random()).slice(0, 20);
  const shuffledSpecialist = [...catData.specialist].sort(() => 0.5 - Math.random()).slice(0, 12);

  const examQuestions = [];
  const basicPts = state.examRules.basicPoints || [3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,1,1,1,1];
  const specPts = state.examRules.specialistPoints || [3,3,3,3,3,3,2,2,2,2,1,1];

  shuffledBasic.forEach((q, i) => {
    examQuestions.push({
      ...q,
      points: basicPts[i] || 1,
      orderIndex: i + 1,
      part: 'basic'
    });
  });

  shuffledSpecialist.forEach((q, i) => {
    examQuestions.push({
      ...q,
      points: specPts[i] || 1,
      orderIndex: i + 21,
      part: 'specialist'
    });
  });

  state.exam = {
    active: true,
    questions: examQuestions,
    currentIndex: 0,
    userAnswers: {},
    confirmed: {},
    totalTimerId: null,
    questionTimerId: null,
    totalTimeLeft: state.examRules.totalTimeSeconds || 1500,
    questionTimeLeft: 20,
    finished: false,
    result: null
  };

  // Start total timer
  startExamTimers();
  renderExamQuestion();
}

function startExamTimers() {
  clearInterval(state.exam.totalTimerId);
  clearInterval(state.exam.questionTimerId);

  state.exam.totalTimerId = setInterval(() => {
    if (state.exam.totalTimeLeft > 0) {
      state.exam.totalTimeLeft--;
      updateExamHeaderTimers();
    } else {
      finishExam('timeout_total');
    }
  }, 1000);

  resetQuestionTimer();
}

function resetQuestionTimer() {
  clearInterval(state.exam.questionTimerId);
  const curQ = state.exam.questions[state.exam.currentIndex];
  if (!curQ) return;

  state.exam.questionTimeLeft = curQ.type === 'basic' ? 
    (state.examRules.basicTimeSeconds || 20) : 
    (state.examRules.specialistTimeSeconds || 50);

  updateExamHeaderTimers();

  state.exam.questionTimerId = setInterval(() => {
    if (state.exam.questionTimeLeft > 0) {
      state.exam.questionTimeLeft--;
      updateExamHeaderTimers();
    } else {
      // Question time out: auto-confirm or proceed to next
      handleQuestionTimeout();
    }
  }, 1000);
}

function updateExamHeaderTimers() {
  const totalTimerEl = document.getElementById('exam-total-timer');
  const qTimerEl = document.getElementById('exam-question-timer');

  if (totalTimerEl) {
    const mins = Math.floor(state.exam.totalTimeLeft / 60);
    const secs = state.exam.totalTimeLeft % 60;
    totalTimerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  if (qTimerEl) {
    qTimerEl.textContent = `${state.exam.questionTimeLeft}s`;
    if (state.exam.questionTimeLeft <= 5) {
      qTimerEl.classList.add('danger');
    } else {
      qTimerEl.classList.remove('danger');
    }
  }
}

function handleQuestionTimeout() {
  clearInterval(state.exam.questionTimerId);
  // Auto confirm current answer or null
  const idx = state.exam.currentIndex;
  state.exam.confirmed[idx] = true;

  if (state.exam.currentIndex < state.exam.questions.length - 1) {
    state.exam.currentIndex++;
    resetQuestionTimer();
    renderExamQuestion();
  } else {
    finishExam('completed');
  }
}

function renderExamQuestion() {
  const container = document.getElementById('exam-container');
  if (!container || !state.exam.active) return;

  const idx = state.exam.currentIndex;
  const q = state.exam.questions[idx];
  const total = state.exam.questions.length;
  const selected = state.exam.userAnswers[idx];

  const progressPercent = Math.round(((idx + 1) / total) * 100);

  // Render media HTML
  let mediaHtml = '';
  if (q.media) {
    if (q.mediaType === 'video') {
      const vidUrl = `${CDN_VID_BASE}${q.media}`;
      mediaHtml = `
        <div class="media-viewport">
          <video id="exam-video" src="${vidUrl}" playsinline autoplay loop muted preload="auto">
            Twoja przeglądarka nie obsługuje wideo.
          </video>
          <button class="replay-btn" onclick="document.getElementById('exam-video').play()">🔁 Odtwórz</button>
        </div>
      `;
    } else {
      const imgUrl = `${CDN_IMG_BASE}${q.media}`;
      mediaHtml = `
        <div class="media-viewport">
          <img src="${imgUrl}" alt="Ilustracja do pytania" loading="eager" />
        </div>
      `;
    }
  }

  // Answer buttons
  let answersHtml = '';
  if (q.type === 'basic') {
    answersHtml = `
      <div class="answers-grid basic">
        <button class="answer-option ${selected === 'T' ? 'selected' : ''}" data-answer="T">
          <span class="opt-letter">TAK</span>
          <span>TAK</span>
        </button>
        <button class="answer-option ${selected === 'N' ? 'selected' : ''}" data-answer="N">
          <span class="opt-letter">NIE</span>
          <span>NIE</span>
        </button>
      </div>
    `;
  } else {
    answersHtml = `
      <div class="answers-grid">
        <button class="answer-option ${selected === 'A' ? 'selected' : ''}" data-answer="A">
          <span class="opt-letter">A</span>
          <span>${q.a || 'Odpowiedź A'}</span>
        </button>
        <button class="answer-option ${selected === 'B' ? 'selected' : ''}" data-answer="B">
          <span class="opt-letter">B</span>
          <span>${q.b || 'Odpowiedź B'}</span>
        </button>
        <button class="answer-option ${selected === 'C' ? 'selected' : ''}" data-answer="C">
          <span class="opt-letter">C</span>
          <span>${q.c || 'Odpowiedź C'}</span>
        </button>
      </div>
    `;
  }

  container.innerHTML = `
    <!-- Top status bar -->
    <div class="exam-status-bar">
      <div class="status-item">
        <span class="status-label">Pytanie</span>
        <span class="status-value">${idx + 1} / ${total}</span>
      </div>
      <div class="status-item">
        <span class="status-label">Waga</span>
        <span class="status-value" style="color: var(--accent-blue);">${q.points} ${q.points === 1 ? 'pkt' : 'punkty'}</span>
      </div>
      <div class="status-item">
        <span class="status-label">Czas pytania</span>
        <span class="status-value timer-value" id="exam-question-timer">${state.exam.questionTimeLeft}s</span>
      </div>
      <div class="status-item">
        <span class="status-label">Czas egzaminu</span>
        <span class="status-value timer-value" id="exam-total-timer">--:--</span>
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
    </div>

    <!-- Media -->
    ${mediaHtml}

    <!-- Question Prompt -->
    <div class="question-box">
      <p class="question-text">${q.q}</p>
    </div>

    <!-- Answers -->
    ${answersHtml}

    <!-- Action -->
    <div class="question-actions">
      <button id="btn-confirm-answer" class="btn btn-primary" ${!selected ? 'disabled' : ''}>
        ${idx === total - 1 ? '🏁 Zakończ Egzamin' : 'Dalej ➔'}
      </button>
    </div>
  `;

  updateExamHeaderTimers();

  // Attach answer selection handlers
  container.querySelectorAll('.answer-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const ans = btn.getAttribute('data-answer');
      state.exam.userAnswers[idx] = ans;
      vibrate(20);
      renderExamQuestion();
    });
  });

  // Attach confirm handler
  document.getElementById('btn-confirm-answer')?.addEventListener('click', () => {
    if (!state.exam.userAnswers[idx]) return;
    state.exam.confirmed[idx] = true;
    vibrate(30);

    if (state.exam.currentIndex < state.exam.questions.length - 1) {
      state.exam.currentIndex++;
      resetQuestionTimer();
      renderExamQuestion();
    } else {
      finishExam('completed');
    }
  });
}

function finishExam(reason) {
  clearInterval(state.exam.totalTimerId);
  clearInterval(state.exam.questionTimerId);
  state.exam.active = false;
  state.exam.finished = true;

  // Calculate score
  let score = 0;
  let correctCount = 0;
  let wrongCount = 0;

  state.exam.questions.forEach((q, i) => {
    const userAns = state.exam.userAnswers[i];
    const isCorrect = userAns && userAns.toUpperCase() === q.correct.toUpperCase();

    if (isCorrect) {
      score += q.points;
      correctCount++;
    } else {
      wrongCount++;
      recordMistake(q.id);
    }
  });

  const maxPoints = state.examRules.maxPoints || 74;
  const passThreshold = state.examRules.passThreshold || 68;
  const isPassed = score >= passThreshold;

  // Update global stats
  state.userStats.examsTotal++;
  if (isPassed) state.userStats.examsPassed++;
  state.userStats.questionsAnswered += state.exam.questions.length;
  state.userStats.questionsCorrect += correctCount;

  state.userStats.examHistory.unshift({
    date: new Date().toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
    score,
    maxPoints,
    isPassed,
    category: state.currentCategory
  });
  if (state.userStats.examHistory.length > 20) state.userStats.examHistory.pop();
  saveStats();

  renderExamResult(score, maxPoints, passThreshold, isPassed, correctCount, wrongCount);
}

function renderExamResult(score, maxPoints, threshold, isPassed, correctCount, wrongCount) {
  const container = document.getElementById('exam-container');
  if (!container) return;

  const percent = Math.round((score / maxPoints) * 100);

  let reviewItemsHtml = state.exam.questions.map((q, i) => {
    const userAns = state.exam.userAnswers[i] || 'Brak';
    const isCorrect = userAns.toUpperCase() === q.correct.toUpperCase();

    return `
      <div class="review-item" style="border-left: 4px solid ${isCorrect ? 'var(--accent-green)' : 'var(--accent-red)'};">
        <div class="review-header">
          <span style="font-size: 11px; font-weight: 700; color: var(--text-muted);">Pytanie ${i + 1} (${q.points} pkt)</span>
          <span class="badge ${isCorrect ? 'badge-green' : 'badge-red'}">
            ${isCorrect ? `+${q.points} pkt` : '0 pkt'}
          </span>
        </div>
        <p class="review-q-title">${q.q}</p>
        <div class="review-answers-inline">
          <span>Twoja odpowiedź: <strong style="color: ${isCorrect ? 'var(--accent-green)' : 'var(--accent-red)'};">${userAns}</strong></span>
          <span>Poprawna: <strong style="color: var(--accent-green);">${q.correct}</strong></span>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="result-hero ${isPassed ? 'passed' : 'failed'}">
      <div style="font-size: 48px; margin-bottom: 8px;">${isPassed ? '🎉' : '❌'}</div>
      <div class="result-status-title" style="color: ${isPassed ? 'var(--accent-green)' : 'var(--accent-red)'};">
        ${isPassed ? 'EGZAMIN ZDANY!' : 'EGZAMIN NIEZDANY'}
      </div>
      <div class="result-score-large" style="color: ${isPassed ? 'var(--accent-green)' : 'var(--accent-red)'};">
        ${score} <span style="font-size: 24px; color: var(--text-secondary);">/ ${maxPoints} pkt</span>
      </div>
      <p style="font-size: 14px; color: var(--text-secondary);">
        Próg zaliczenia to min. ${threshold} pkt (92%). Twój wynik: ${percent}%.
      </p>

      <div class="result-breakdown">
        <div class="result-stat-box">
          <div style="font-size: 20px; font-weight: 700; color: var(--accent-green);">${correctCount}</div>
          <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Poprawne</div>
        </div>
        <div class="result-stat-box">
          <div style="font-size: 20px; font-weight: 700; color: var(--accent-red);">${wrongCount}</div>
          <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Błędne</div>
        </div>
      </div>
    </div>

    <div style="display: flex; gap: 10px; margin-bottom: 20px;">
      <button id="btn-restart-exam" class="btn btn-primary">
        🔄 Rozwiąż ponownie
      </button>
      <button id="btn-goto-mistakes" class="btn btn-secondary">
        ❌ Przejrzyj błędy (${state.mistakes.questionIds.length})
      </button>
    </div>

    <h3 style="font-size: 16px; margin-bottom: 12px;">Przegląd pytań z tego testu:</h3>
    <div class="review-list">
      ${reviewItemsHtml}
    </div>
  `;

  document.getElementById('btn-restart-exam')?.addEventListener('click', startExam);
  document.getElementById('btn-goto-mistakes')?.addEventListener('click', () => switchTab('mistakes'));
}

// ---------------------------------------------------------------------------
// PRACTICE MODE (LEARNING / QUIZ)
// ---------------------------------------------------------------------------
function initPractice() {
  const catData = state.questionsCache[state.currentCategory];
  if (!catData) return;

  filterPracticeQuestions();
  state.practice.currentIndex = 0;
  state.practice.selectedAnswer = null;
  state.practice.isAnswered = false;

  renderPracticeUI();
}

function filterPracticeQuestions() {
  const catData = state.questionsCache[state.currentCategory];
  if (!catData) return;

  let pool = catData.all;
  if (state.practice.currentFilter === 'basic') pool = catData.basic;
  else if (state.practice.currentFilter === 'specialist') pool = catData.specialist;

  if (state.practice.searchQuery.trim()) {
    const q = state.practice.searchQuery.toLowerCase();
    pool = pool.filter(item => item.q.toLowerCase().includes(q));
  }

  state.practice.filteredQuestions = pool;
}

function renderPracticeUI() {
  const container = document.getElementById('practice-container');
  if (!container) return;

  const qList = state.practice.filteredQuestions;
  const total = qList.length;

  if (total === 0) {
    container.innerHTML = `
      <div class="card text-center">
        <p style="color: var(--text-muted); padding: 40px 0;">Brak pytań spełniających kryteria.</p>
      </div>
    `;
    return;
  }

  const idx = state.practice.currentIndex;
  const q = qList[idx];
  const isAnswered = state.practice.isAnswered;
  const selected = state.practice.selectedAnswer;

  // Media HTML
  let mediaHtml = '';
  if (q.media) {
    if (q.mediaType === 'video') {
      const vidUrl = `${CDN_VID_BASE}${q.media}`;
      mediaHtml = `
        <div class="media-viewport">
          <video id="practice-video" src="${vidUrl}" playsinline autoplay loop muted preload="auto">
            Twoja przeglądarka nie obsługuje wideo.
          </video>
          <button class="replay-btn" onclick="document.getElementById('practice-video').play()">🔁 Odtwórz</button>
        </div>
      `;
    } else {
      const imgUrl = `${CDN_IMG_BASE}${q.media}`;
      mediaHtml = `
        <div class="media-viewport">
          <img src="${imgUrl}" alt="Ilustracja do pytania" />
        </div>
      `;
    }
  }

  // Answer options
  let answersHtml = '';
  if (q.type === 'basic') {
    const getCls = (opt) => {
      if (!isAnswered) return selected === opt ? 'selected' : '';
      if (opt === q.correct) return 'correct';
      if (selected === opt) return 'wrong';
      return '';
    };

    answersHtml = `
      <div class="answers-grid basic">
        <button class="answer-option ${getCls('T')}" data-ans="T" ${isAnswered ? 'disabled' : ''}>
          <span class="opt-letter">TAK</span>
          <span>TAK</span>
        </button>
        <button class="answer-option ${getCls('N')}" data-ans="N" ${isAnswered ? 'disabled' : ''}>
          <span class="opt-letter">NIE</span>
          <span>NIE</span>
        </button>
      </div>
    `;
  } else {
    const getCls = (opt) => {
      if (!isAnswered) return selected === opt ? 'selected' : '';
      if (opt === q.correct) return 'correct';
      if (selected === opt) return 'wrong';
      return '';
    };

    answersHtml = `
      <div class="answers-grid">
        <button class="answer-option ${getCls('A')}" data-ans="A" ${isAnswered ? 'disabled' : ''}>
          <span class="opt-letter">A</span>
          <span>${q.a || 'Odpowiedź A'}</span>
        </button>
        <button class="answer-option ${getCls('B')}" data-ans="B" ${isAnswered ? 'disabled' : ''}>
          <span class="opt-letter">B</span>
          <span>${q.b || 'Odpowiedź B'}</span>
        </button>
        <button class="answer-option ${getCls('C')}" data-ans="C" ${isAnswered ? 'disabled' : ''}>
          <span class="opt-letter">C</span>
          <span>${q.c || 'Odpowiedź C'}</span>
        </button>
      </div>
    `;
  }

  // Feedback box if answered
  let feedbackHtml = '';
  if (isAnswered) {
    const isCorrect = selected === q.correct;
    feedbackHtml = `
      <div style="background: ${isCorrect ? 'var(--accent-green-bg)' : 'var(--accent-red-bg)'}; border: 1px solid ${isCorrect ? 'var(--accent-green)' : 'var(--accent-red)'}; border-radius: var(--radius-md); padding: 12px 16px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;">
        <span style="font-weight: 700; color: ${isCorrect ? 'var(--accent-green)' : 'var(--accent-red)'};">
          ${isCorrect ? '✓ Dobra odpowiedź!' : '✗ Błędna odpowiedź!'}
        </span>
        <span style="font-size: 13px; color: var(--text-secondary);">
          Prawidłowa: <strong style="color: var(--accent-green);">${q.correct}</strong>
        </span>
      </div>
    `;
  }

  container.innerHTML = `
    <!-- Filter tabs -->
    <div style="display: flex; gap: 8px; margin-bottom: 12px; overflow-x: auto; padding-bottom: 4px;">
      <button class="btn btn-secondary ${state.practice.currentFilter === 'all' ? 'btn-primary' : ''}" style="width: auto; padding: 7px 14px; font-size: 12px;" data-filter="all">Wszystkie (${state.questionsCache[state.currentCategory]?.all.length || 0})</button>
      <button class="btn btn-secondary ${state.practice.currentFilter === 'basic' ? 'btn-primary' : ''}" style="width: auto; padding: 7px 14px; font-size: 12px;" data-filter="basic">Podstawowe (TAK/NIE)</button>
      <button class="btn btn-secondary ${state.practice.currentFilter === 'specialist' ? 'btn-primary' : ''}" style="width: auto; padding: 7px 14px; font-size: 12px;" data-filter="specialist">Specjalistyczne (A/B/C)</button>
    </div>

    <!-- Live search input -->
    <input type="text" id="practice-search-input" class="search-input" placeholder="🔍 Szukaj w pytaniach..." value="${state.practice.searchQuery}" />

    <!-- Question counter -->
    <div class="flex-between mb-2">
      <span class="badge badge-blue">Pytanie ${idx + 1} z ${total} (ID: ${q.id})</span>
      <span style="font-size: 12px; color: var(--text-muted);">${q.type === 'basic' ? 'Podstawowe' : 'Specjalistyczne'}</span>
    </div>

    ${mediaHtml}

    <!-- Prompt -->
    <div class="question-box">
      <p class="question-text">${q.q}</p>
    </div>

    ${feedbackHtml}
    ${answersHtml}

    <!-- Navigation buttons -->
    <div style="display: flex; gap: 10px; margin-top: 14px;">
      <button id="btn-practice-prev" class="btn btn-secondary" style="flex: 1;" ${idx === 0 ? 'disabled' : ''}>
        ◀ Poprzednie
      </button>
      <button id="btn-practice-random" class="btn btn-secondary" style="width: 50px;">
        🎲
      </button>
      <button id="btn-practice-next" class="btn btn-primary" style="flex: 1;" ${idx === total - 1 ? 'disabled' : ''}>
        Następne ▶
      </button>
    </div>
  `;

  // Attach search input listener
  const searchEl = document.getElementById('practice-search-input');
  searchEl?.addEventListener('input', (e) => {
    state.practice.searchQuery = e.target.value;
    filterPracticeQuestions();
    state.practice.currentIndex = 0;
    state.practice.selectedAnswer = null;
    state.practice.isAnswered = false;
    renderPracticeUI();
    // Keep focus
    const newSearch = document.getElementById('practice-search-input');
    newSearch?.focus();
    newSearch?.setSelectionRange(e.target.value.length, e.target.value.length);
  });

  // Attach filter buttons
  container.querySelectorAll('[data-filter]').forEach(b => {
    b.addEventListener('click', () => {
      state.practice.currentFilter = b.getAttribute('data-filter');
      filterPracticeQuestions();
      state.practice.currentIndex = 0;
      state.practice.selectedAnswer = null;
      state.practice.isAnswered = false;
      renderPracticeUI();
    });
  });

  // Attach answer selection
  container.querySelectorAll('.answer-option').forEach(b => {
    b.addEventListener('click', () => {
      if (state.practice.isAnswered) return;
      const ans = b.getAttribute('data-ans');
      state.practice.selectedAnswer = ans;
      state.practice.isAnswered = true;

      const isCorrect = ans === q.correct;
      vibrate(isCorrect ? 30 : 70);

      // Record stats
      state.userStats.questionsAnswered++;
      if (isCorrect) state.userStats.questionsCorrect++;
      else recordMistake(q.id);
      saveStats();

      renderPracticeUI();
    });
  });

  // Prev / Next / Random buttons
  document.getElementById('btn-practice-prev')?.addEventListener('click', () => {
    if (state.practice.currentIndex > 0) {
      state.practice.currentIndex--;
      state.practice.selectedAnswer = null;
      state.practice.isAnswered = false;
      renderPracticeUI();
    }
  });

  document.getElementById('btn-practice-next')?.addEventListener('click', () => {
    if (state.practice.currentIndex < state.practice.filteredQuestions.length - 1) {
      state.practice.currentIndex++;
      state.practice.selectedAnswer = null;
      state.practice.isAnswered = false;
      renderPracticeUI();
    }
  });

  document.getElementById('btn-practice-random')?.addEventListener('click', () => {
    const len = state.practice.filteredQuestions.length;
    if (len > 1) {
      let rand = Math.floor(Math.random() * len);
      if (rand === state.practice.currentIndex) rand = (rand + 1) % len;
      state.practice.currentIndex = rand;
      state.practice.selectedAnswer = null;
      state.practice.isAnswered = false;
      renderPracticeUI();
    }
  });
}

// ---------------------------------------------------------------------------
// MISTAKES REVIEW MODE
// ---------------------------------------------------------------------------
function initMistakes() {
  state.mistakes.currentIndex = 0;
  state.mistakes.selectedAnswer = null;
  state.mistakes.isAnswered = false;
  renderMistakesUI();
}

function renderMistakesUI() {
  const container = document.getElementById('mistakes-container');
  if (!container) return;

  const mistakeIds = state.mistakes.questionIds;
  const catData = state.questionsCache[state.currentCategory];

  if (mistakeIds.length === 0) {
    container.innerHTML = `
      <div class="card text-center" style="padding: 40px 20px;">
        <div style="font-size: 52px; margin-bottom: 12px;">🌟</div>
        <h3 class="card-title" style="justify-content: center;">Brak błędów!</h3>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">
          Świetna robota! Nie masz obecnie żadnych pytań oznaczonych jako błędne.
        </p>
        <button id="btn-mistakes-to-exam" class="btn btn-primary" style="max-width: 250px; margin: 0 auto;">
          Rozpocznij Egzamin
        </button>
      </div>
    `;
    document.getElementById('btn-mistakes-to-exam')?.addEventListener('click', () => switchTab('exam'));
    return;
  }

  // Find question objects by ID from current or cached data
  const mistakeQuestions = [];
  if (catData) {
    mistakeIds.forEach(id => {
      const found = catData.all.find(q => q.id === id);
      if (found) mistakeQuestions.push(found);
    });
  }

  if (mistakeQuestions.length === 0) {
    container.innerHTML = `
      <div class="card text-center">
        <p style="color: var(--text-secondary); padding: 30px 0;">
          Występują błędy z innych kategorii prawa jazdy. Przełącz kategorię w prawym górnym rogu.
        </p>
      </div>
    `;
    return;
  }

  const idx = Math.min(state.mistakes.currentIndex, mistakeQuestions.length - 1);
  const q = mistakeQuestions[idx];
  const isAnswered = state.mistakes.isAnswered;
  const selected = state.mistakes.selectedAnswer;

  let mediaHtml = '';
  if (q.media) {
    if (q.mediaType === 'video') {
      const vidUrl = `${CDN_VID_BASE}${q.media}`;
      mediaHtml = `
        <div class="media-viewport">
          <video id="mistake-video" src="${vidUrl}" playsinline autoplay loop muted preload="auto">
            Wideo
          </video>
        </div>
      `;
    } else {
      const imgUrl = `${CDN_IMG_BASE}${q.media}`;
      mediaHtml = `
        <div class="media-viewport">
          <img src="${imgUrl}" alt="Ilustracja do pytania" />
        </div>
      `;
    }
  }

  let answersHtml = '';
  if (q.type === 'basic') {
    const getCls = (opt) => {
      if (!isAnswered) return selected === opt ? 'selected' : '';
      if (opt === q.correct) return 'correct';
      if (selected === opt) return 'wrong';
      return '';
    };

    answersHtml = `
      <div class="answers-grid basic">
        <button class="answer-option ${getCls('T')}" data-ans="T" ${isAnswered ? 'disabled' : ''}>
          <span class="opt-letter">TAK</span>
          <span>TAK</span>
        </button>
        <button class="answer-option ${getCls('N')}" data-ans="N" ${isAnswered ? 'disabled' : ''}>
          <span class="opt-letter">NIE</span>
          <span>NIE</span>
        </button>
      </div>
    `;
  } else {
    const getCls = (opt) => {
      if (!isAnswered) return selected === opt ? 'selected' : '';
      if (opt === q.correct) return 'correct';
      if (selected === opt) return 'wrong';
      return '';
    };

    answersHtml = `
      <div class="answers-grid">
        <button class="answer-option ${getCls('A')}" data-ans="A" ${isAnswered ? 'disabled' : ''}>
          <span class="opt-letter">A</span>
          <span>${q.a}</span>
        </button>
        <button class="answer-option ${getCls('B')}" data-ans="B" ${isAnswered ? 'disabled' : ''}>
          <span class="opt-letter">B</span>
          <span>${q.b}</span>
        </button>
        <button class="answer-option ${getCls('C')}" data-ans="C" ${isAnswered ? 'disabled' : ''}>
          <span class="opt-letter">C</span>
          <span>${q.c}</span>
        </button>
      </div>
    `;
  }

  let feedbackHtml = '';
  if (isAnswered) {
    const isCorrect = selected === q.correct;
    feedbackHtml = `
      <div style="background: ${isCorrect ? 'var(--accent-green-bg)' : 'var(--accent-red-bg)'}; border: 1px solid ${isCorrect ? 'var(--accent-green)' : 'var(--accent-red)'}; border-radius: var(--radius-md); padding: 12px 16px; margin-bottom: 16px;">
        <div style="font-weight: 700; color: ${isCorrect ? 'var(--accent-green)' : 'var(--accent-red)'}; margin-bottom: 4px;">
          ${isCorrect ? '✓ Gratulacje! Prawidłowa odpowiedź.' : '✗ Niestety znów błąd!'}
        </div>
        <div style="font-size: 13px; color: var(--text-secondary);">
          Poprawna odpowiedź: <strong style="color: var(--accent-green);">${q.correct}</strong>
        </div>
        ${isCorrect ? `
          <button id="btn-remove-mistake" class="btn btn-success" style="margin-top: 10px; padding: 8px 12px; font-size: 13px;">
            Usuń z bazy błędów (Opanowane)
          </button>
        ` : ''}
      </div>
    `;
  }

  container.innerHTML = `
    <div class="flex-between mb-4">
      <div>
        <h3 class="card-title">Trening Błędów</h3>
        <p style="font-size: 12px; color: var(--text-secondary);">Pozostało ${mistakeQuestions.length} pytań do powtórki</p>
      </div>
      <button id="btn-clear-all-mistakes" class="btn btn-secondary" style="width: auto; padding: 6px 12px; font-size: 12px;">
        Wyczyść listę
      </button>
    </div>

    <div class="flex-between mb-2">
      <span class="badge badge-red">Pytanie ${idx + 1} z ${mistakeQuestions.length} (ID: ${q.id})</span>
    </div>

    ${mediaHtml}

    <div class="question-box">
      <p class="question-text">${q.q}</p>
    </div>

    ${feedbackHtml}
    ${answersHtml}

    <div style="display: flex; gap: 10px; margin-top: 14px;">
      <button id="btn-mistake-prev" class="btn btn-secondary" style="flex: 1;" ${idx === 0 ? 'disabled' : ''}>
        ◀ Poprzednie
      </button>
      <button id="btn-mistake-next" class="btn btn-primary" style="flex: 1;" ${idx === mistakeQuestions.length - 1 ? 'disabled' : ''}>
        Następne ▶
      </button>
    </div>
  `;

  // Clear all mistakes button
  document.getElementById('btn-clear-all-mistakes')?.addEventListener('click', () => {
    if (confirm('Czy na pewno chcesz wyczyścić listę zapisanych błędów?')) {
      state.mistakes.questionIds = [];
      saveMistakes();
      updateMistakesBadge();
      renderMistakesUI();
    }
  });

  // Answer click
  container.querySelectorAll('.answer-option').forEach(b => {
    b.addEventListener('click', () => {
      if (state.mistakes.isAnswered) return;
      const ans = b.getAttribute('data-ans');
      state.mistakes.selectedAnswer = ans;
      state.mistakes.isAnswered = true;
      const isCorrect = ans === q.correct;
      vibrate(isCorrect ? 30 : 70);
      renderMistakesUI();
    });
  });

  // Remove mistake button
  document.getElementById('btn-remove-mistake')?.addEventListener('click', () => {
    removeMistake(q.id);
    state.mistakes.isAnswered = false;
    state.mistakes.selectedAnswer = null;
    renderMistakesUI();
  });

  // Prev / Next
  document.getElementById('btn-mistake-prev')?.addEventListener('click', () => {
    if (state.mistakes.currentIndex > 0) {
      state.mistakes.currentIndex--;
      state.mistakes.isAnswered = false;
      state.mistakes.selectedAnswer = null;
      renderMistakesUI();
    }
  });

  document.getElementById('btn-mistake-next')?.addEventListener('click', () => {
    if (state.mistakes.currentIndex < mistakeQuestions.length - 1) {
      state.mistakes.currentIndex++;
      state.mistakes.isAnswered = false;
      state.mistakes.selectedAnswer = null;
      renderMistakesUI();
    }
  });
}

// ---------------------------------------------------------------------------
// COMPENDIUM (KNOWLEDGE BASE)
// ---------------------------------------------------------------------------
function renderCompendium() {
  const container = document.getElementById('compendium-list');
  if (!container) return;

  const searchInput = document.getElementById('compendium-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.compendiumSearch = e.target.value.toLowerCase();
      renderCompendium();
    });
  }

  const query = state.compendiumSearch.trim();

  let filteredChapters = COMPENDIUM_CHAPTERS;
  if (query) {
    filteredChapters = COMPENDIUM_CHAPTERS.map(ch => {
      const matchInChapter = ch.title.toLowerCase().includes(query) || ch.description.toLowerCase().includes(query);
      const filteredSections = ch.sections.filter(s => 
        s.title.toLowerCase().includes(query) || 
        s.content.toLowerCase().includes(query) ||
        (s.tips && s.tips.toLowerCase().includes(query))
      );
      if (matchInChapter || filteredSections.length > 0) {
        return {
          ...ch,
          sections: filteredSections.length > 0 ? filteredSections : ch.sections,
          forceOpen: true
        };
      }
      return null;
    }).filter(Boolean);
  }

  if (filteredChapters.length === 0) {
    container.innerHTML = `
      <div class="card text-center" style="padding: 30px;">
        <p style="color: var(--text-muted);">Nie znaleziono wyników dla "${query}".</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredChapters.map((ch, chIdx) => {
    const sectionsHtml = ch.sections.map(s => `
      <div class="compendium-section">
        <div class="section-head">
          <span class="section-title">${s.title}</span>
          ${s.badge ? `<span class="badge badge-yellow">${s.badge}</span>` : ''}
        </div>
        <div class="section-body">
          ${formatMarkdownToHtml(s.content)}
          ${s.tips ? `<div class="exam-tip-box">💡 <strong>Wskazówka na egzamin:</strong> ${s.tips}</div>` : ''}
        </div>
      </div>
    `).join('');

    const isOpen = query.length > 0 || chIdx === 0;

    return `
      <div class="chapter-accordion ${isOpen ? 'open' : ''}">
        <div class="chapter-header" onclick="this.parentElement.classList.toggle('open')">
          <div class="chapter-title-group">
            <span class="chapter-icon">${ch.icon}</span>
            <div>
              <div class="chapter-title">${ch.title}</div>
              <div style="font-size: 12px; color: var(--text-secondary);">${ch.description}</div>
            </div>
          </div>
          <span style="font-size: 16px; color: var(--text-muted);">▼</span>
        </div>
        <div class="chapter-content">
          ${sectionsHtml}
        </div>
      </div>
    `;
  }).join('');
}

function renderRoadSigns() {
  const container = document.getElementById('road-signs-gallery');
  if (!container) return;

  container.innerHTML = ROAD_SIGNS.map(sign => `
    <div class="sign-card" onclick="openSignModal('${sign.code}')">
      ${sign.svg}
      <span class="sign-code">${sign.code}</span>
      <span class="sign-name">${sign.name}</span>
    </div>
  `).join('');
}

window.openSignModal = function(signCode) {
  const sign = ROAD_SIGNS.find(s => s.code === signCode);
  if (!sign) return;

  const modal = document.getElementById('sign-detail-modal');
  const content = document.getElementById('sign-modal-content');
  if (!modal || !content) return;

  content.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 16px;">
      <div style="width: 100px; height: 100px; margin-bottom: 12px;">
        ${sign.svg}
      </div>
      <span class="badge badge-blue mb-2">${sign.category}</span>
      <h3 style="font-size: 20px; font-weight: 800;">${sign.code} — ${sign.name}</h3>
    </div>
    <div style="font-size: 14px; color: var(--text-secondary); line-height: 1.6; background: var(--bg-primary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
      ${sign.desc}
    </div>
  `;

  modal.classList.add('active');
};

function formatMarkdownToHtml(md) {
  // Simple markdown processor
  let html = md.trim()
    .replace(/^### (.*$)/gim, '<h4 style="font-size:14px; margin: 8px 0; color:var(--text-primary);">$1</h4>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/^- (.*$)/gim, '<li>$1</li>');

  // Wrap lists
  html = html.replace(/(<li>[\s\S]*?<\/li>)/gim, '<ul style="margin: 8px 0 8px 20px; line-height: 1.6;">$1</ul>');

  // Table support
  if (html.includes('|')) {
    const lines = html.split('\n');
    let inTable = false;
    let tableHtml = '<div style="overflow-x: auto;"><table>';
    lines.forEach((line) => {
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        if (!inTable) { inTable = true; }
        const cells = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
        if (line.includes('---')) return;
        const isHeader = !tableHtml.includes('<tbody>');
        if (isHeader) {
          tableHtml += '<thead><tr>' + cells.map(c => `<th>${c.trim()}</th>`).join('') + '</tr></thead><tbody>';
        } else {
          tableHtml += '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>';
        }
      } else {
        if (inTable) {
          tableHtml += '</tbody></table></div>';
          inTable = false;
        }
      }
    });
    if (inTable) tableHtml += '</tbody></table></div>';
    html = tableHtml;
  }

  return html;
}

// ---------------------------------------------------------------------------
// STATS VIEW
// ---------------------------------------------------------------------------
function updateStatsDisplay() {
  const examsTotalEl = document.getElementById('stat-exams-total');
  const examsPassedEl = document.getElementById('stat-exams-passed');
  const examPassRateEl = document.getElementById('stat-pass-rate');
  const questionsAnsweredEl = document.getElementById('stat-questions-answered');
  const questionAccuracyEl = document.getElementById('stat-question-accuracy');
  const historyListEl = document.getElementById('stat-history-list');

  const { examsTotal, examsPassed, questionsAnswered, questionsCorrect, examHistory } = state.userStats;

  if (examsTotalEl) examsTotalEl.textContent = examsTotal;
  if (examsPassedEl) examsPassedEl.textContent = examsPassed;

  const passRate = examsTotal > 0 ? Math.round((examsPassed / examsTotal) * 100) : 0;
  if (examPassRateEl) examPassRateEl.textContent = `${passRate}%`;

  if (questionsAnsweredEl) questionsAnsweredEl.textContent = questionsAnswered;

  const accRate = questionsAnswered > 0 ? Math.round((questionsCorrect / questionsAnswered) * 100) : 0;
  if (questionAccuracyEl) questionAccuracyEl.textContent = `${accRate}%`;

  if (historyListEl) {
    if (examHistory.length === 0) {
      historyListEl.innerHTML = `
        <p style="color: var(--text-muted); font-size: 13px; text-align: center; padding: 20px 0;">
          Brak historii egzaminów. Rozwiąż swój pierwszy test!
        </p>
      `;
    } else {
      historyListEl.innerHTML = examHistory.map(h => `
        <div class="review-item" style="border-left: 4px solid ${h.isPassed ? 'var(--accent-green)' : 'var(--accent-red)'}; margin-bottom: 8px;">
          <div class="review-header">
            <span style="font-size: 12px; font-weight: 600;">Egzamin kat. ${h.category}</span>
            <span class="badge ${h.isPassed ? 'badge-green' : 'badge-red'}">
              ${h.isPassed ? 'ZDANY' : 'NIEZDANY'}
            </span>
          </div>
          <div class="flex-between" style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">
            <span>${h.date}</span>
            <span style="font-weight: 700; color: ${h.isPassed ? 'var(--accent-green)' : 'var(--accent-red)'};">
              ${h.score} / ${h.maxPoints} pkt (${Math.round((h.score / h.maxPoints) * 100)}%)
            </span>
          </div>
        </div>
      `).join('');
    }
  }

  // Clear stats listener
  document.getElementById('btn-reset-stats')?.addEventListener('click', () => {
    if (confirm('Czy na pewno chcesz zresetować wszystkie statystyki i historię?')) {
      state.userStats = {
        examsTotal: 0,
        examsPassed: 0,
        questionsAnswered: 0,
        questionsCorrect: 0,
        examHistory: []
      };
      saveStats();
      updateStatsDisplay();
    }
  });
}

// ---------------------------------------------------------------------------
// iOS MODAL & HELPERS
// ---------------------------------------------------------------------------
function setupIOSModal() {
  const iosBtn = document.getElementById('btn-ios-info');
  const modal = document.getElementById('ios-install-modal');
  const closeBtn = document.getElementById('btn-close-ios-modal');
  const banner = document.getElementById('insecure-context-banner');
  const bannerCloseBtn = document.getElementById('btn-close-insecure-banner');

  iosBtn?.addEventListener('click', () => modal?.classList.add('active'));
  closeBtn?.addEventListener('click', () => modal?.classList.remove('active'));

  // Close modal when tapping overlay
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  // Clicking banner opens iOS install guide modal
  banner?.addEventListener('click', () => modal?.classList.add('active'));
  bannerCloseBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (banner) banner.style.display = 'none';
  });

  const signModal = document.getElementById('sign-detail-modal');
  const closeSignBtn = document.getElementById('btn-close-sign-modal');
  closeSignBtn?.addEventListener('click', () => signModal?.classList.remove('active'));
  signModal?.addEventListener('click', (e) => {
    if (e.target === signModal) signModal.classList.remove('active');
  });
}

// ---------------------------------------------------------------------------
// OFFLINE & SERVICE WORKER LIFECYCLE
// ---------------------------------------------------------------------------
function setupOfflineSupport() {
  const offlineBadge = document.getElementById('offline-badge');
  const banner = document.getElementById('insecure-context-banner');

  // Check network status
  function updateOnlineStatus() {
    if (offlineBadge) {
      if (!navigator.onLine) {
        offlineBadge.style.display = 'inline-flex';
        offlineBadge.textContent = '✈️ Offline';
        offlineBadge.title = 'Brak połączenia z siecią — korzystasz z zapisanej bazy pytań';
      } else {
        offlineBadge.style.display = 'none';
      }
    }
  }

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();

  // Detect insecure origin (e.g. http://192.168.x.x:3000)
  // On iOS Safari, Service Worker requires a secure context (HTTPS or localhost)
  const isLocalHost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  if (!window.isSecureContext && !isLocalHost && banner) {
    banner.style.display = 'flex';
  }

  // Register Service Worker for offline capability
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('[PWA] Service Worker aktywny ze zakresem:', reg.scope);
      })
      .catch(err => {
        console.warn('[PWA] Service Worker niedostępny (wymagane HTTPS):', err);
      });
  }
}

function vibrate(ms) {
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(ms);
    } catch (_) {}
  }
}
