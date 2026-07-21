const STAGE_VISUALS = {
  python: 'python',
  libraries: 'libraries',
  fundamentals: 'ai-fundamentals',
  prompting: 'prompting',
  llm: 'llm',
  rag: 'rag',
  agents: 'agents',
  frameworks: 'frameworks',
  backend: 'backend',
  deployment: 'deployment',
  portfolio: 'projects'
};

const STATUS = {
  not_started: { label: 'Не начато', short: 'Старт', order: 0 },
  learning: { label: 'Изучаю', short: 'Теория', order: 1 },
  practice: { label: 'Нужна практика', short: 'Практика', order: 2 },
  review: { label: 'На проверке', short: 'Проверка', order: 3 },
  mastered: { label: 'Освоено', short: 'Освоено', order: 4 }
};

const LEVELS = [
  { min: 0, name: 'Новичок', text: 'Формируется база. Главная цель — начать выполнять небольшие задачи руками.' },
  { min: 20, name: 'AI Explorer', text: 'Основные понятия уже знакомы, но пока нужна опора на инструкции и примеры.' },
  { min: 40, name: 'AI Builder', text: 'Ты способен собирать небольшие AI-приложения из готовых компонентов.' },
  { min: 60, name: 'Junior AI Engineer', text: 'Ты соединяешь модели, данные, API и деплой в работающие решения.' },
  { min: 75, name: 'Applied AI Engineer', text: 'Ты уверенно решаешь прикладные задачи и умеешь проверять качество системы.' },
  { min: 90, name: 'Production-ready AI Engineer', text: 'Ты проектируешь, разворачиваешь и сопровождаешь надёжные AI-системы.' }
];

const PROJECT_STAGE_MAP = {
  chatbot: ['python','llm','prompting','backend','deployment'],
  pdf: ['python','llm','rag','backend','deployment'],
  research: ['llm','rag','agents','frameworks','backend'],
  resume: ['python','fundamentals','prompting','llm','backend'],
  support: ['rag','agents','frameworks','backend','deployment'],
  coding: ['python','agents','frameworks','deployment']
};

const PROJECT_FIRST = ['python-basics','python-functions','python-files','zero-shot','llm-intro','tokens','embeddings','rag-pipeline','agent-architecture','tools','fastapi','rest','docker','git'];
const APP_VERSION = '2.1.0';
const DB_NAME = 'ai-forge-path-v2';
const DB_VERSION = 1;
const STATE_KEY = 'current-state';
const LOCAL_KEY = 'ai-forge-path-state-v2';
const LEGACY_KEY = 'ai-forge-path-state';

let db = null;
let state = null;
let activeView = 'today';
let activePlanTab = 'today';
let historyFilter = 'all';
let deferredPrompt = null;
let saveTimer = null;
let toastTimer = null;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const nowISO = () => new Date().toISOString();
const dateKey = (date = new Date()) => {
  const d = new Date(date);
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};
const clone = (value) => typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));

function visualForStage(stageId) {
  return `assets/infographics/${STAGE_VISUALS[stageId] || 'projects'}.svg`;
}

function allTopics() {
  return ROADMAP.flatMap((stage, stageIndex) => stage.topics.map((item, topicIndex) => ({
    ...item,
    stageId: stage.id,
    stageTitle: stage.title,
    stageIndex,
    topicIndex
  })));
}

function getTopic(id) {
  return allTopics().find(item => item.id === id) || null;
}

function getStage(id) {
  return ROADMAP.find(stage => stage.id === id) || null;
}

function getProject(id) {
  return PROJECTS.find(projectItem => projectItem.id === id) || null;
}

function defaultTopicState() {
  return {
    status: 'not_started',
    startedAt: null,
    updatedAt: null,
    masteredAt: null,
    practiceDone: false,
    practiceCompletedAt: null,
    reviewCount: 0,
    lastReviewedAt: null,
    minutes: 0,
    notes: ''
  };
}

function defaultProjectState(projectItem) {
  return {
    status: 'not_started',
    criteria: Object.fromEntries(projectItem.criteria.map((_, index) => [String(index), false])),
    evidenceUrl: '',
    notes: '',
    startedAt: null,
    updatedAt: null,
    completedAt: null
  };
}

function createDefaultState() {
  return {
    schemaVersion: 2,
    appVersion: APP_VERSION,
    profile: {
      weeklyHours: 10,
      sessionLength: 45,
      learningGoal: 'builder',
      mode: 'project'
    },
    topics: {},
    projects: {},
    assessment: {
      ratings: {},
      completedAt: null
    },
    stageQuiz: {},
    history: [],
    activityDates: [],
    dailyPlanNonce: {},
    engagement: engagementDefaultState(),
    legacyMinutes: 0,
    meta: {
      createdAt: nowISO(),
      updatedAt: nowISO(),
      lastSavedAt: null,
      lastAutoBackup: null,
      migratedFromV1: false,
      lastView: 'today'
    }
  };
}

function normalizeState(input) {
  const base = createDefaultState();
  const source = input && typeof input === 'object' ? input : {};
  const result = deepMerge(base, source);
  result.schemaVersion = 2;
  result.appVersion = APP_VERSION;
  result.history = Array.isArray(result.history) ? result.history : [];
  result.activityDates = Array.isArray(result.activityDates) ? result.activityDates : [];
  result.topics = result.topics && typeof result.topics === 'object' ? result.topics : {};
  result.projects = result.projects && typeof result.projects === 'object' ? result.projects : {};
  result.stageQuiz = result.stageQuiz && typeof result.stageQuiz === 'object' ? result.stageQuiz : {};
  result.assessment = result.assessment && typeof result.assessment === 'object' ? result.assessment : { ratings: {}, completedAt: null };
  result.assessment.ratings = result.assessment.ratings && typeof result.assessment.ratings === 'object' ? result.assessment.ratings : {};
  result.engagement = deepMerge(engagementDefaultState(), result.engagement && typeof result.engagement === 'object' ? result.engagement : {});
  result.meta = result.meta && typeof result.meta === 'object' ? result.meta : base.meta;
  return result;
}

function deepMerge(base, extra) {
  for (const [key, value] of Object.entries(extra || {})) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      base[key] = deepMerge(base[key] && typeof base[key] === 'object' ? base[key] : {}, value);
    } else {
      base[key] = value;
    }
  }
  return base;
}

function topicState(id) {
  if (!state.topics[id]) state.topics[id] = defaultTopicState();
  return state.topics[id];
}

function projectState(id) {
  if (!state.projects[id]) {
    const item = getProject(id);
    state.projects[id] = defaultProjectState(item);
  }
  return state.projects[id];
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains('kv')) database.createObjectStore('kv');
      if (!database.objectStoreNames.contains('backups')) database.createObjectStore('backups', { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function idbGet(storeName, key) {
  if (!db) return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const request = tx.objectStore(storeName).get(key);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

function idbPut(storeName, value, key) {
  if (!db) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    if (key === undefined) store.put(value); else store.put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function idbDelete(storeName, key) {
  if (!db) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function idbGetAll(storeName) {
  if (!db) return Promise.resolve([]);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const request = tx.objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

function migrateLegacyState(legacy) {
  const next = createDefaultState();
  next.meta.migratedFromV1 = true;
  next.legacyMinutes = Number(legacy.practiceMinutes || 0);
  next.profile.weeklyHours = Number(legacy.settings?.weeklyHours || 10);
  next.profile.sessionLength = Number(legacy.settings?.sessionLength || 45);
  next.profile.learningGoal = legacy.settings?.learningGoal || 'builder';
  next.profile.mode = legacy.settings?.mode || 'project';
  next.activityDates = Array.isArray(legacy.activityDates) ? legacy.activityDates : [];

  for (const item of allTopics()) {
    const completed = Boolean(legacy.completedTopics?.[item.id]);
    const notes = legacy.notes?.[item.id] || '';
    if (completed || notes) {
      next.topics[item.id] = {
        ...defaultTopicState(),
        status: completed ? 'mastered' : 'not_started',
        practiceDone: completed,
        startedAt: completed ? nowISO() : null,
        masteredAt: completed ? nowISO() : null,
        updatedAt: nowISO(),
        notes
      };
    }
  }

  for (const projectItem of PROJECTS) {
    if (legacy.completedProjects?.[projectItem.id]) {
      next.projects[projectItem.id] = {
        ...defaultProjectState(projectItem),
        status: 'complete',
        criteria: Object.fromEntries(projectItem.criteria.map((_, index) => [String(index), true])),
        startedAt: nowISO(),
        updatedAt: nowISO(),
        completedAt: nowISO()
      };
    }
  }

  next.history.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : `legacy-${Date.now()}`,
    type: 'backup',
    title: 'Прогресс перенесён из версии 1',
    detail: 'Отмеченные темы, проекты, заметки и настройки сохранены в новой структуре.',
    timestamp: nowISO()
  });
  return next;
}

async function loadState() {
  setSaveIndicator('saving', 'Загрузка…');
  try {
    db = await openDatabase();
  } catch (error) {
    console.warn('IndexedDB unavailable', error);
    db = null;
  }

  let loaded = null;
  try {
    loaded = await idbGet('kv', STATE_KEY);
  } catch (error) {
    console.warn('Could not read IndexedDB state', error);
  }

  if (!loaded) {
    try { loaded = JSON.parse(localStorage.getItem(LOCAL_KEY) || 'null'); } catch { loaded = null; }
  }

  if (!loaded) {
    try {
      const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || 'null');
      if (legacy) loaded = migrateLegacyState(legacy);
    } catch { loaded = null; }
  }

  state = normalizeState(loaded || createDefaultState());
  ensureEngagementState();
  seedEngagementFromProgress();
  checkComeback();
  applyStreakProtection();
  activeView = state.meta.lastView || 'today';
  await persistState({ immediate: true, silent: true });
  await ensureDailyBackup();
  setSaveIndicator('saved', db ? 'Сохранено' : 'Сохранено локально');
}

function queueSave() {
  clearTimeout(saveTimer);
  setSaveIndicator('saving', 'Сохраняю…');
  try {
    state.meta.updatedAt = nowISO();
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('localStorage save failed', error);
  }
  saveTimer = setTimeout(() => persistState({ silent: true }), 180);
}

async function persistState({ immediate = false, silent = false } = {}) {
  if (!state) return;
  state.meta.updatedAt = nowISO();
  state.meta.lastSavedAt = nowISO();
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
    await idbPut('kv', clone(state), STATE_KEY);
    if (!silent) toast('Прогресс сохранён');
    setSaveIndicator('saved', db ? 'Сохранено' : 'Сохранено локально');
  } catch (error) {
    console.error('State save failed', error);
    setSaveIndicator('error', 'Ошибка сохранения');
  }
  if (immediate) clearTimeout(saveTimer);
}

async function ensureDailyBackup() {
  const today = dateKey();
  if (state.meta.lastAutoBackup === today) return;
  try {
    await idbPut('backups', {
      id: `auto-${today}`,
      kind: 'auto',
      createdAt: nowISO(),
      state: clone(state)
    });
    state.meta.lastAutoBackup = today;
    await persistState({ silent: true });
  } catch (error) {
    console.warn('Auto backup failed', error);
  }
}

async function createManualBackup() {
  const id = `manual-${Date.now()}`;
  await idbPut('backups', { id, kind: 'manual', createdAt: nowISO(), state: clone(state) });
  addHistory('backup', 'Создана локальная резервная копия', 'Снимок прогресса сохранён в браузере этого устройства.');
  await persistState({ silent: true });
  renderAll();
  toast('Резервная копия создана');
}

function setSaveIndicator(mode, text) {
  const button = $('#storageStatusBtn');
  if (!button) return;
  button.classList.remove('saving', 'error');
  if (mode === 'saving') button.classList.add('saving');
  if (mode === 'error') button.classList.add('error');
  $('#saveStatusText').textContent = text;
}

function addHistory(type, title, detail, extra = {}) {
  const event = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    title,
    detail,
    timestamp: nowISO(),
    ...extra
  };
  applyEngagementToEvent(event);
  state.history.unshift(event);
  if (state.history.length > 1500) state.history.length = 1500;
  queueSave();
  return event;
}

function getLevel(score) {
  return [...LEVELS].reverse().find(level => score >= level.min) || LEVELS[0];
}

function statusPoints(status) {
  return ({ not_started: 0, learning: 10, practice: 20, review: 28, mastered: 35 })[status] || 0;
}

function projectBonusForStage(stageId) {
  let bonus = 0;
  for (const projectItem of PROJECTS) {
    const projectData = projectState(projectItem.id);
    if (projectData.status === 'complete' && PROJECT_STAGE_MAP[projectItem.id]?.includes(stageId)) bonus += 4;
    else if (projectData.status === 'review' && PROJECT_STAGE_MAP[projectItem.id]?.includes(stageId)) bonus += 2;
  }
  return Math.min(10, bonus);
}

function topicScore(item) {
  const data = topicState(item.id);
  const baseline = Math.max(0, Math.min(3, Number(state.assessment.ratings[item.stageId] || 0))) * 8;
  const quizScore = Number(state.stageQuiz[item.stageId]?.score || 0);
  const evidence = statusPoints(data.status)
    + (data.practiceDone ? 25 : 0)
    + Math.round(quizScore * .2)
    + Math.min(10, Number(data.reviewCount || 0) * 5)
    + projectBonusForStage(item.stageId);
  return Math.min(100, Math.max(baseline, evidence));
}

function stageScore(stageId) {
  const stage = getStage(stageId);
  if (!stage) return 0;
  const items = stage.topics.map(item => topicScore({ ...item, stageId }));
  return Math.round(items.reduce((sum, value) => sum + value, 0) / Math.max(1, items.length));
}

function allStageScores() {
  return Object.fromEntries(ROADMAP.map(stage => [stage.id, stageScore(stage.id)]));
}

function overallScore() {
  const scores = Object.values(allStageScores());
  return Math.round(scores.reduce((sum, value) => sum + value, 0) / Math.max(1, scores.length));
}

function masteredTopicCount() {
  return allTopics().filter(item => topicState(item.id).status === 'mastered').length;
}

function practiceCount() {
  return allTopics().filter(item => topicState(item.id).practiceDone).length;
}

function completedProjectCount() {
  return PROJECTS.filter(item => projectState(item.id).status === 'complete').length;
}

function getOrderedTopics() {
  const topics = allTopics();
  if (state.profile.mode !== 'project') return topics;
  const preferred = PROJECT_FIRST.map(id => topics.find(item => item.id === id)).filter(Boolean);
  return [...preferred, ...topics.filter(item => !PROJECT_FIRST.includes(item.id))];
}

function getCurrentTopic() {
  const ordered = getOrderedTopics();
  return ordered.find(item => topicState(item.id).status !== 'mastered') || ordered.find(item => reviewIsDue(item)) || null;
}

function reviewIsDue(item) {
  return reviewDueWithIntervals(item);
}

function nextActionFor(item) {
  if (!item) return { label: 'Маршрут завершён', button: 'Открыть проекты', meta: 'Продолжай усиливать портфолио', action: 'projects' };
  const data = topicState(item.id);
  if (reviewIsDue(item)) return { label: 'Повторить тему и проверить, что знания сохранились', button: 'Повторить тему', meta: '≈ 10–15 минут', action: 'review' };
  if (data.status === 'not_started') return { label: 'Открыть тему и разобраться в главной идее', button: 'Начать изучение', meta: `≈ ${item.minutes} минут`, action: 'learning' };
  if (data.status === 'learning') return { label: 'Перейти от теории к практическому заданию', button: 'Перейти к практике', meta: `Практика: ${item.practice}`, action: 'practice' };
  if (data.status === 'practice') return { label: 'Выполнить практику и зафиксировать результат', button: 'Практика выполнена', meta: item.practice, action: 'review' };
  if (data.status === 'review') {
    const quiz = state.stageQuiz[item.stageId];
    if (!quiz) return { label: 'Пройти короткую проверку знаний', button: 'Пройти проверку', meta: '1 вопрос + самооценка результата', action: 'quiz' };
    return { label: 'Подтвердить освоение темы', button: 'Отметить как освоено', meta: `Последняя проверка: ${quiz.score}%`, action: 'mastered' };
  }
  return { label: 'Повторить тему', button: 'Повторить', meta: 'Закрепление через интервальное повторение', action: 'review' };
}

function setTopicStatus(id, nextStatus, options = {}) {
  const item = getTopic(id);
  if (!item || !STATUS[nextStatus]) return;
  const data = topicState(id);
  const previous = data.status;
  if (previous === nextStatus && !options.force) return;
  const timestamp = nowISO();
  data.status = nextStatus;
  data.updatedAt = timestamp;
  if (!data.startedAt && nextStatus !== 'not_started') data.startedAt = timestamp;
  if (nextStatus === 'mastered') data.masteredAt = data.masteredAt || timestamp;
  if (nextStatus !== 'mastered' && previous === 'mastered' && options.clearMastered) data.masteredAt = null;

  const historyMap = {
    learning: ['topic', `Начата тема «${item.title}»`, `${item.stageTitle}: тема переведена в статус «Изучаю».`],
    practice: ['topic', `Теория по теме «${item.title}» изучена`, 'Следующий шаг — выполнить практическое задание.'],
    review: ['practice', `Практика по теме «${item.title}» выполнена`, item.practice],
    mastered: ['topic', `Освоена тема «${item.title}»`, `${item.stageTitle}: тема подтверждена и добавлена в освоенные.`],
    not_started: ['topic', `Тема «${item.title}» возвращена в начало`, 'Прогресс темы сброшен вручную.']
  };
  const [type, title, detail] = historyMap[nextStatus];
  addHistory(type, title, detail, { topicId: id, stageId: item.stageId, fromStatus: previous, toStatus: nextStatus });
}

function markPracticeDone(id, done = true) {
  const item = getTopic(id);
  const data = topicState(id);
  if (!item || data.practiceDone === done) return;
  data.practiceDone = done;
  data.practiceCompletedAt = done ? nowISO() : null;
  data.updatedAt = nowISO();
  if (done && STATUS[data.status].order < STATUS.review.order) data.status = 'review';
  addHistory('practice', done ? `Выполнена практика «${item.title}»` : `Практика «${item.title}» возвращена в работу`, done ? item.practice : 'Отметка о выполнении удалена.', { topicId: id, stageId: item.stageId, practiceDone: done });
}

function recordStudyMinutes(id, minutes) {
  const amount = Math.max(0, Math.min(1440, Number(minutes || 0)));
  if (!amount) return;
  const item = getTopic(id);
  const data = topicState(id);
  data.minutes = Number(data.minutes || 0) + amount;
  data.updatedAt = nowISO();
  addHistory('topic', `Учебная сессия: ${item.title}`, `Записано ${amount} минут работы.`, { topicId: id, stageId: item.stageId, minutes: amount });
}

function recordReview(id) {
  const item = getTopic(id);
  const data = topicState(id);
  if (data.lastReviewedAt && dateKey(data.lastReviewedAt) === dateKey()) {
    toast('Повторение этой темы уже записано сегодня');
    return false;
  }
  data.reviewCount = Number(data.reviewCount || 0) + 1;
  data.lastReviewedAt = nowISO();
  data.updatedAt = nowISO();
  addHistory('assessment', `Повторена тема «${item.title}»`, `Количество повторений: ${data.reviewCount}. Следующее повторение: ${nextReviewLabel(item)}.`, { topicId: id, stageId: item.stageId });
  return true;
}

