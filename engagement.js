const LEAGUES = [
  { min: 0, name: 'Уголь', icon: '●', next: 100 },
  { min: 100, name: 'Бронза', icon: '◆', next: 250 },
  { min: 250, name: 'Серебро', icon: '◇', next: 500 },
  { min: 500, name: 'Золото', icon: '⬟', next: 800 },
  { min: 800, name: 'Платина', icon: '✦', next: 1200 },
  { min: 1200, name: 'Алмаз', icon: '◈', next: null }
];

const ACHIEVEMENTS = [
  { id: 'first-step', icon: '🚀', title: 'Первый запуск', detail: 'Сделай первое осмысленное учебное действие.', test: () => meaningfulHistory().length >= 1 },
  { id: 'streak-3', icon: '🔥', title: 'Ритм найден', detail: 'Поддерживай серию 3 дня.', test: () => calculateStreakDetails().current >= 3 },
  { id: 'streak-7', icon: '⚡', title: 'Неделя в потоке', detail: 'Поддерживай серию 7 дней.', test: () => calculateStreakDetails().current >= 7 },
  { id: 'xp-100', icon: '✨', title: '100 XP', detail: 'Набери первые 100 очков качественного обучения.', test: () => state.engagement.xpTotal >= 100 },
  { id: 'first-practice', icon: '🛠', title: 'Сделано руками', detail: 'Заверши первую практическую задачу.', test: () => practiceCount() >= 1 },
  { id: 'first-mastered', icon: '✓', title: 'Навык подтверждён', detail: 'Освой первую тему полностью.', test: () => masteredTopicCount() >= 1 },
  { id: 'first-quiz', icon: '🧠', title: 'Проверка принята', detail: 'Пройди первую проверку знаний.', test: () => Object.keys(state.stageQuiz).length >= 1 },
  { id: 'mistake-fixed', icon: '🩹', title: 'Ошибка исправлена', detail: 'Вернись к ошибке и ответь правильно.', test: () => state.engagement.mistakes.some(item => item.resolvedAt) },
  { id: 'quest-day', icon: '🎯', title: 'День закрыт', detail: 'Выполни и забери награды за все ежедневные квесты.', test: () => dailyQuestStatus().allClaimed },
  { id: 'review-5', icon: '↺', title: 'Знания закрепляются', detail: 'Выполни 5 интервальных повторений.', test: () => allTopics().reduce((sum, item) => sum + Number(topicState(item.id).reviewCount || 0), 0) >= 5 },
  { id: 'first-project', icon: '▣', title: 'Проект в портфолио', detail: 'Заверши первый проект-доказательство.', test: () => completedProjectCount() >= 1 },
  { id: 'comeback', icon: '🌱', title: 'Возвращение', detail: 'Вернись к обучению после перерыва в 3 дня.', test: () => Boolean(state.engagement.comebackAt) }
];

function engagementDefaultState() {
  return {
    xpTotal: 0,
    sparks: 10,
    dailyGoalXp: 40,
    dailyGoalMinutes: 15,
    streakFreezes: 1,
    maxStreakFreezes: 2,
    protectedDates: [],
    questClaims: {},
    chestClaims: {},
    weeklyClaims: {},
    monthlyClaims: {},
    achievements: {},
    mistakes: [],
    comebackAt: null,
    lastActiveSeenAt: null,
    lastRewardMessage: null,
    seededFromProgress: false
  };
}

function ensureEngagementState() {
  if (!state.engagement || typeof state.engagement !== 'object') state.engagement = engagementDefaultState();
  state.engagement = deepMerge(engagementDefaultState(), state.engagement);
  state.engagement.protectedDates = Array.isArray(state.engagement.protectedDates) ? state.engagement.protectedDates : [];
  state.engagement.mistakes = Array.isArray(state.engagement.mistakes) ? state.engagement.mistakes : [];
  state.engagement.questClaims = state.engagement.questClaims && typeof state.engagement.questClaims === 'object' ? state.engagement.questClaims : {};
  state.engagement.chestClaims = state.engagement.chestClaims && typeof state.engagement.chestClaims === 'object' ? state.engagement.chestClaims : {};
  state.engagement.weeklyClaims = state.engagement.weeklyClaims && typeof state.engagement.weeklyClaims === 'object' ? state.engagement.weeklyClaims : {};
  state.engagement.monthlyClaims = state.engagement.monthlyClaims && typeof state.engagement.monthlyClaims === 'object' ? state.engagement.monthlyClaims : {};
  state.engagement.achievements = state.engagement.achievements && typeof state.engagement.achievements === 'object' ? state.engagement.achievements : {};
}

function seedEngagementFromProgress() {
  ensureEngagementState();
  if (state.engagement.seededFromProgress) return;
  const mastered = allTopics().filter(item => topicState(item.id).status === 'mastered').length;
  const practices = allTopics().filter(item => topicState(item.id).practiceDone).length;
  const reviews = allTopics().reduce((sum, item) => sum + Number(topicState(item.id).reviewCount || 0), 0);
  const quizzes = Object.keys(state.stageQuiz || {}).length;
  const projects = completedProjectCount();
  const estimatedXp = mastered * 20 + practices * 20 + reviews * 8 + quizzes * 15 + projects * 100;
  state.engagement.xpTotal = Math.max(Number(state.engagement.xpTotal || 0), estimatedXp);
  state.engagement.sparks = Math.max(Number(state.engagement.sparks || 0), 10 + Math.floor(estimatedXp / 25));
  const rebuiltDates = [...new Set(meaningfulHistory().map(event => dateKey(event.timestamp)))];
  if (rebuiltDates.length) state.activityDates = rebuiltDates;
  state.engagement.seededFromProgress = true;
}

function eventQualifiesForStreak(event) {
  if (!event) return false;
  if (event.learningEvent === false) return false;
  if (event.minutes > 0) return true;
  if (event.type === 'practice') return event.practiceDone !== false;
  if (event.type === 'assessment') return true;
  if (event.type === 'project') return Boolean(event.toStatus || Number(event.criteriaAdded || 0) > 0);
  if (event.type === 'topic' && ['learning', 'practice', 'review', 'mastered'].includes(event.toStatus)) return true;
  return false;
}

function xpForEvent(event) {
  if (!event || event.learningEvent === false) return 0;
  if (event.type === 'topic' && event.minutes) return Math.min(25, Math.max(2, Math.ceil(Number(event.minutes) / 3)));
  if (event.type === 'topic' && event.toStatus === 'learning') return 5;
  if (event.type === 'topic' && event.toStatus === 'practice') return 8;
  if (event.type === 'topic' && event.toStatus === 'mastered') return 20;
  if (event.type === 'practice') return event.practiceDone === false ? 0 : 20;
  if (event.type === 'assessment' && event.score !== undefined) return event.repeatAttempt ? (event.score >= 80 ? 8 : 2) : (event.score >= 80 ? 20 : 8);
  if (event.type === 'assessment' && /Повторена тема/.test(event.title || '')) return 12;
  if (event.type === 'assessment') return 10;
  if (event.type === 'project' && event.toStatus === 'building') return 15;
  if (event.type === 'project' && event.toStatus === 'review') return 35;
  if (event.type === 'project' && event.toStatus === 'complete') return 100;
  if (event.type === 'project' && Number(event.criteriaAdded || 0) > 0) return Math.min(30, Number(event.criteriaAdded) * 10);
  return 0;
}

function applyEngagementToEvent(event) {
  ensureEngagementState();
  const xp = Math.max(0, Number(xpForEvent(event) || 0));
  const sparks = xp >= 20 ? Math.max(1, Math.floor(xp / 10)) : 0;
  event.xp = xp;
  event.sparks = sparks;
  if (xp) state.engagement.xpTotal += xp;
  if (sparks) state.engagement.sparks += sparks;
  if (eventQualifiesForStreak(event)) {
    const key = dateKey(event.timestamp);
    if (!state.activityDates.includes(key)) state.activityDates.push(key);
  }
  return event;
}

function meaningfulHistory() {
  return state.history.filter(event => eventQualifiesForStreak(event));
}

function eventsForDate(key) {
  return state.history.filter(event => dateKey(event.timestamp) === key);
}

function dailyMetrics(key = dateKey()) {
  const events = eventsForDate(key);
  const learning = events.filter(event => eventQualifiesForStreak(event));
  return {
    xp: events.reduce((sum, event) => sum + Number(event.xp || 0), 0),
    minutes: events.reduce((sum, event) => sum + Number(event.minutes || 0), 0),
    actions: learning.length,
    practice: events.filter(event => event.type === 'practice').length,
    assessment: events.filter(event => event.type === 'assessment').length,
    mastered: events.filter(event => event.toStatus === 'mastered').length,
    reviews: events.filter(event => event.type === 'assessment' && /Повторена тема/.test(event.title || '')).length,
    projects: events.filter(event => event.type === 'project').length
  };
}

function calculateStreakDetails() {
  ensureEngagementState();
  const active = new Set(state.activityDates || []);
  const protectedDays = new Set(state.engagement.protectedDates || []);
  const hasDay = key => active.has(key) || protectedDays.has(key);
  let cursor = new Date();
  const today = dateKey(cursor);
  const todayQualified = active.has(today);
  if (!hasDay(today)) cursor.setDate(cursor.getDate() - 1);
  let current = 0;
  while (hasDay(dateKey(cursor))) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return {
    current,
    todayQualified,
    freezes: state.engagement.streakFreezes,
    protectedDates: [...protectedDays]
  };
}

function applyStreakProtection() {
  ensureEngagementState();
  const active = new Set(state.activityDates || []);
  const protectedDays = new Set(state.engagement.protectedDates || []);
  const all = [...active, ...protectedDays].sort();
  if (!all.length) return;
  const today = new Date(`${dateKey()}T12:00:00`);
  const last = new Date(`${all[all.length - 1]}T12:00:00`);
  const daysApart = Math.round((today - last) / 86400000);
  const missing = [];
  for (let i = 1; i < daysApart; i += 1) {
    const day = new Date(last);
    day.setDate(day.getDate() + i);
    const key = dateKey(day);
    if (!active.has(key) && !protectedDays.has(key)) missing.push(key);
  }
  if (!missing.length || missing.length > state.engagement.streakFreezes || missing.length > 2) return;
  for (const key of missing) {
    state.engagement.protectedDates.push(key);
    state.engagement.streakFreezes -= 1;
  }
  state.history.unshift({
    id: `freeze-${Date.now()}`,
    type: 'reward',
    title: 'Серия защищена',
    detail: `Автоматически использовано заморозок: ${missing.length}.`,
    timestamp: nowISO(),
    learningEvent: false,
    xp: 0,
    sparks: 0
  });
}

function isoWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

function weekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay() || 7;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day + 1);
  return d;
}

function weeklyMetrics() {
  const start = weekStart().getTime();
  const end = start + 7 * 86400000;
  const events = state.history.filter(event => {
    const time = new Date(event.timestamp).getTime();
    return time >= start && time < end;
  });
  const activeDays = new Set(events.filter(eventQualifiesForStreak).map(event => dateKey(event.timestamp)));
  return {
    xp: events.reduce((sum, event) => sum + Number(event.xp || 0), 0),
    minutes: events.reduce((sum, event) => sum + Number(event.minutes || 0), 0),
    activeDays: activeDays.size,
    practices: events.filter(event => event.type === 'practice').length,
    mastered: events.filter(event => event.toStatus === 'mastered').length
  };
}

function currentLeague() {
  const xp = weeklyMetrics().xp;
  const league = [...LEAGUES].reverse().find(item => xp >= item.min) || LEAGUES[0];
  const next = LEAGUES[LEAGUES.indexOf(league) + 1] || null;
  const progress = next ? Math.round(((xp - league.min) / Math.max(1, next.min - league.min)) * 100) : 100;
  return { ...league, xp, next, progress: Math.max(0, Math.min(100, progress)) };
}

function getDailyQuests() {
  ensureEngagementState();
  const due = allTopics().filter(reviewIsDue).length;
  const key = dateKey();
  return [
    { id: 'meaningful-step', title: 'Сделай один осмысленный шаг', detail: 'Начни тему, выполни практику, тест или повторение.', metric: 'actions', target: 1, rewardXp: 10, rewardSparks: 2 },
    { id: 'daily-xp', title: `Набери ${state.engagement.dailyGoalXp} XP`, detail: 'XP начисляется за прогресс, а не за бесконечное повторение.', metric: 'xp', target: state.engagement.dailyGoalXp, rewardXp: 15, rewardSparks: 3 },
    due
      ? { id: 'adaptive', title: 'Закрепи слабое место', detail: 'Повтори одну тему, срок которой уже подошёл.', metric: 'reviews', target: 1, rewardXp: 20, rewardSparks: 5 }
      : { id: 'adaptive', title: 'Продвинь тему до практики', detail: 'Переведи одну тему вперёд или заверши практическое действие.', metric: 'growth', target: 1, rewardXp: 20, rewardSparks: 5 }
  ].map(quest => ({ ...quest, key: `${key}:${quest.id}` }));
}

function questProgress(quest) {
  const metrics = dailyMetrics();
  if (quest.metric === 'growth') return metrics.practice + metrics.mastered + eventsForDate(dateKey()).filter(event => event.toStatus === 'practice').length;
  return Number(metrics[quest.metric] || 0);
}

function dailyQuestStatus() {
  const quests = getDailyQuests().map(quest => {
    const progress = Math.min(quest.target, questProgress(quest));
    const complete = progress >= quest.target;
    const claimed = Boolean(state.engagement.questClaims[quest.key]);
    return { ...quest, progress, complete, claimed };
  });
  return {
    quests,
    completeCount: quests.filter(item => item.complete).length,
    claimedCount: quests.filter(item => item.claimed).length,
    allComplete: quests.every(item => item.complete),
    allClaimed: quests.every(item => item.claimed)
  };
}

function claimQuest(questId) {
  ensureEngagementState();
  const status = dailyQuestStatus();
  const quest = status.quests.find(item => item.id === questId);
  if (!quest || !quest.complete || quest.claimed) return;
  state.engagement.questClaims[quest.key] = nowISO();
  state.engagement.xpTotal += quest.rewardXp;
  state.engagement.sparks += quest.rewardSparks;
  state.history.unshift({
    id: `quest-${quest.key}`,
    type: 'reward',
    title: `Квест выполнен: ${quest.title}`,
    detail: `Награда: +${quest.rewardXp} XP и +${quest.rewardSparks} искр.`,
    timestamp: nowISO(),
    learningEvent: false,
    xp: quest.rewardXp,
    sparks: quest.rewardSparks
  });
  queueSave();
  renderAll();
  showCelebration('Квест выполнен', `+${quest.rewardXp} XP · +${quest.rewardSparks} искр`, '🎯');
}

function claimDailyChest() {
  ensureEngagementState();
  const key = dateKey();
  const status = dailyQuestStatus();
  if (!status.allClaimed || state.engagement.chestClaims[key]) return;
  state.engagement.chestClaims[key] = nowISO();
  state.engagement.xpTotal += 25;
  state.engagement.sparks += 12;
  let freezeText = '';
  if (state.engagement.streakFreezes < state.engagement.maxStreakFreezes) {
    state.engagement.streakFreezes += 1;
    freezeText = ' и 1 заморозка серии';
  }
  state.history.unshift({
    id: `chest-${key}`,
    type: 'reward',
    title: 'Открыт ежедневный сундук',
    detail: `Награда: +25 XP, +12 искр${freezeText}.`,
    timestamp: nowISO(),
    learningEvent: false,
    xp: 25,
    sparks: 12
  });
  queueSave();
  renderAll();
  showCelebration('День закрыт', `Все квесты выполнены${freezeText}`, '🎁');
}

function weeklyChallengeStatus() {
  ensureEngagementState();
  const metrics = weeklyMetrics();
  const key = isoWeekKey();
  const complete = metrics.activeDays >= 4 && metrics.xp >= 200;
  return { key, metrics, complete, claimed: Boolean(state.engagement.weeklyClaims[key]) };
}

function monthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function monthlyChallengeStatus() {
  ensureEngagementState();
  const key = monthKey();
  const prefix = `${key}-`;
  const claimedQuests = Object.entries(state.engagement.questClaims).filter(([questKey]) => questKey.startsWith(prefix)).length;
  const target = 24;
  return {
    key,
    progress: claimedQuests,
    target,
    complete: claimedQuests >= target,
    claimed: Boolean(state.engagement.monthlyClaims[key])
  };
}

function claimMonthlyChallenge() {
  const status = monthlyChallengeStatus();
  if (!status.complete || status.claimed) return;
  state.engagement.monthlyClaims[status.key] = nowISO();
  state.engagement.xpTotal += 200;
  state.engagement.sparks += 60;
  if (state.engagement.streakFreezes < state.engagement.maxStreakFreezes) state.engagement.streakFreezes += 1;
  state.history.unshift({
    id: `monthly-${status.key}`,
    type: 'reward',
    title: 'Месячный челлендж выполнен',
    detail: 'Награда: +200 XP, +60 искр и защита серии.',
    timestamp: nowISO(),
    learningEvent: false,
    xp: 200,
    sparks: 60
  });
  queueSave();
  renderAll();
  showCelebration('Месячный челлендж', '+200 XP · +60 искр', '🌟');
}

async function shareProgress() {
  const level = getLevel(overallScore());
  const streak = calculateStreakDetails();
  const week = weeklyMetrics();
  const text = `AI Forge Path: ${level.name}, ${overallScore()}/100. Серия: ${streak.current} дней. За неделю: ${week.xp} XP и ${week.activeDays} активных дней.`;
  try {
    if (navigator.share) await navigator.share({ title: 'Мой прогресс AI Engineering', text, url: location.href });
    else if (navigator.clipboard) { await navigator.clipboard.writeText(`${text} ${location.href}`); toast('Прогресс скопирован в буфер обмена'); }
    else prompt('Скопируй прогресс:', `${text} ${location.href}`);
  } catch (error) {
    if (error?.name !== 'AbortError') console.warn('Share failed', error);
  }
}

function claimWeeklyChallenge() {
  const status = weeklyChallengeStatus();
  if (!status.complete || status.claimed) return;
  state.engagement.weeklyClaims[status.key] = nowISO();
  state.engagement.xpTotal += 100;
  state.engagement.sparks += 30;
  if (state.engagement.streakFreezes < state.engagement.maxStreakFreezes) state.engagement.streakFreezes += 1;
  state.history.unshift({
    id: `weekly-${status.key}`,
    type: 'reward',
    title: 'Недельная миссия выполнена',
    detail: 'Награда: +100 XP, +30 искр и пополнение защиты серии.',
    timestamp: nowISO(),
    learningEvent: false,
    xp: 100,
    sparks: 30
  });
  queueSave();
  renderAll();
  showCelebration('Недельная миссия', '+100 XP · +30 искр', '🏆');
}

function buyStreakFreeze() {
  ensureEngagementState();
  if (state.engagement.streakFreezes >= state.engagement.maxStreakFreezes) {
    toast('Защита серии уже заполнена');
    return;
  }
  if (state.engagement.sparks < 40) {
    toast('Нужно 40 искр для заморозки серии');
    return;
  }
  state.engagement.sparks -= 40;
  state.engagement.streakFreezes += 1;
  state.history.unshift({ id: `shop-${Date.now()}`, type: 'reward', title: 'Куплена заморозка серии', detail: 'Потрачено 40 искр.', timestamp: nowISO(), learningEvent: false, xp: 0, sparks: -40 });
  queueSave();
  renderAll();
  toast('Заморозка серии добавлена');
}

function addMistake(stageId, quizItem, answerIndex, topicId = null) {
  ensureEngagementState();
  const existing = state.engagement.mistakes.find(item => item.stageId === stageId && !item.resolvedAt);
  const payload = {
    id: existing?.id || `mistake-${stageId}-${Date.now()}`,
    stageId,
    topicId,
    question: quizItem.question,
    selectedAnswer: quizItem.answers[answerIndex],
    correctAnswer: quizItem.answers[quizItem.correct],
    explanation: quizItem.explanation,
    createdAt: existing?.createdAt || nowISO(),
    lastAttemptAt: nowISO(),
    attempts: Number(existing?.attempts || 0) + 1,
    resolvedAt: null
  };
  if (existing) Object.assign(existing, payload);
  else state.engagement.mistakes.unshift(payload);
  queueSave();
}

function resolveMistakesForStage(stageId) {
  ensureEngagementState();
  let resolved = 0;
  for (const item of state.engagement.mistakes) {
    if (item.stageId === stageId && !item.resolvedAt) {
      item.resolvedAt = nowISO();
      resolved += 1;
    }
  }
  if (resolved) queueSave();
  return resolved;
}

function unresolvedMistakes() {
  ensureEngagementState();
  return state.engagement.mistakes.filter(item => !item.resolvedAt);
}

function practiceRecommendations() {
  const due = allTopics().filter(reviewIsDue);
  const mistakes = unresolvedMistakes();
  const weakest = ROADMAP.map(stage => ({ stage, score: stageScore(stage.id) })).sort((a, b) => a.score - b.score)[0];
  return {
    mistakes,
    due,
    weakest,
    current: getCurrentTopic()
  };
}

function completeRescueSession() {
  const key = `rescue-${dateKey()}`;
  if (state.history.some(event => event.id === key)) {
    toast('Быстрый шаг на сегодня уже выполнен');
    return;
  }
  const current = getCurrentTopic();
  state.history.unshift({
    id: key,
    type: 'topic',
    title: 'Быстрый шаг на 2 минуты',
    detail: current ? `Повторена главная идея темы «${current.title}».` : 'Выполнено короткое повторение.',
    timestamp: nowISO(),
    topicId: current?.id,
    stageId: current?.stageId,
    minutes: 2,
    learningEvent: true,
    xp: 5,
    sparks: 0
  });
  state.engagement.xpTotal += 5;
  const today = dateKey();
  if (!state.activityDates.includes(today)) state.activityDates.push(today);
  queueSave();
  renderAll();
  showCelebration('Серия сохранена', 'Даже 2 минуты лучше, чем ноль', '🔥');
}

function checkComeback() {
  ensureEngagementState();
  const dates = [...new Set(state.activityDates || [])].sort();
  if (!dates.length) return;
  const last = new Date(`${dates[dates.length - 1]}T12:00:00`);
  const gap = Math.floor((Date.now() - last.getTime()) / 86400000);
  if (gap >= 3 && !state.engagement.comebackAt) state.engagement.comebackAt = nowISO();
}

function unlockAchievements() {
  ensureEngagementState();
  let newest = null;
  for (const achievement of ACHIEVEMENTS) {
    if (!state.engagement.achievements[achievement.id] && achievement.test()) {
      state.engagement.achievements[achievement.id] = nowISO();
      state.engagement.sparks += 8;
      state.history.unshift({
        id: `achievement-${achievement.id}`,
        type: 'achievement',
        title: `Достижение: ${achievement.title}`,
        detail: `${achievement.detail} Награда: +8 искр.`,
        timestamp: nowISO(),
        learningEvent: false,
        xp: 0,
        sparks: 8
      });
      newest = achievement;
    }
  }
  if (newest) {
    queueSave();
    setTimeout(() => showCelebration(newest.title, 'Новое достижение · +8 искр', newest.icon), 50);
  }
}

function achievementProgress() {
  ensureEngagementState();
  return ACHIEVEMENTS.map(item => ({ ...item, unlockedAt: state.engagement.achievements[item.id] || null }));
}

function showCelebration(title, detail, icon = '✨') {
  let layer = $('#celebrationLayer');
  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'celebrationLayer';
    layer.className = 'celebration-layer';
    document.body.appendChild(layer);
  }
  layer.innerHTML = `<div class="celebration-card"><span>${icon}</span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(detail)}</small></div>`;
  layer.classList.add('show');
  setTimeout(() => layer.classList.remove('show'), 2200);
}

function dailyGoalStatus() {
  ensureEngagementState();
  const metrics = dailyMetrics();
  const xpPercent = Math.min(100, Math.round(metrics.xp / Math.max(1, state.engagement.dailyGoalXp) * 100));
  const minutePercent = Math.min(100, Math.round(metrics.minutes / Math.max(1, state.engagement.dailyGoalMinutes) * 100));
  return { metrics, xpPercent, minutePercent, complete: metrics.xp >= state.engagement.dailyGoalXp || metrics.minutes >= state.engagement.dailyGoalMinutes };
}

function nextReviewLabel(item) {
  const data = topicState(item.id);
  if (!data.masteredAt) return 'после освоения';
  const intervals = [1, 3, 7, 14, 30, 60];
  const days = intervals[Math.min(intervals.length - 1, Number(data.reviewCount || 0))];
  const base = new Date(data.lastReviewedAt || data.masteredAt);
  base.setDate(base.getDate() + days);
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' }).format(base);
}

function reviewDueWithIntervals(item) {
  const data = topicState(item.id);
  if (data.status !== 'mastered' || !data.masteredAt) return false;
  const intervals = [1, 3, 7, 14, 30, 60];
  const days = intervals[Math.min(intervals.length - 1, Number(data.reviewCount || 0))];
  const last = new Date(data.lastReviewedAt || data.masteredAt).getTime();
  return Date.now() - last >= days * 86400000;
}

function renderEngagementDashboard() {
  ensureEngagementState();
  unlockAchievements();

  const streak = calculateStreakDetails();
  const goal = dailyGoalStatus();
  const week = weeklyMetrics();
  const league = currentLeague();
  const questStatus = dailyQuestStatus();
  const weekly = weeklyChallengeStatus();
  const monthly = monthlyChallengeStatus();
  const recommendations = practiceRecommendations();

  $('#streakValue').textContent = streak.current;
  $('#streakTodayText').textContent = streak.todayQualified ? 'Сегодня уже засчитано' : 'Один полезный шаг сохранит серию';
  $('#freezeValue').textContent = `${streak.freezes}/${state.engagement.maxStreakFreezes}`;
  $('#dailyGoalLabel').textContent = goal.metrics.xp >= state.engagement.dailyGoalXp
    ? `${goal.metrics.xp} XP · цель выполнена`
    : `${goal.metrics.xp} / ${state.engagement.dailyGoalXp} XP`;
  $('#dailyGoalPercent').textContent = `${goal.xpPercent}%`;
  $('#dailyGoalBar').style.width = `${goal.xpPercent}%`;
  $('#xpTotalValue').textContent = state.engagement.xpTotal;
  $('#sparksValue').textContent = state.engagement.sparks;
  $('#weeklyXpValue').innerHTML = `${week.xp} XP<br><small>за неделю</small>`;
  $('#leagueLabel').textContent = `Лига «${league.name}»`;
  $('#buyFreezeBtn').disabled = state.engagement.streakFreezes >= state.engagement.maxStreakFreezes || state.engagement.sparks < 40;
  $('#buyFreezeBtn').title = state.engagement.streakFreezes >= state.engagement.maxStreakFreezes ? 'Защита заполнена' : 'Купить заморозку за 40 искр';

  $('#questCounter').textContent = `${questStatus.completeCount}/3`;
  $('#questCounter').className = `status-badge ${questStatus.allComplete ? 'status-mastered' : 'status-learning'}`;
  $('#dailyQuestList').innerHTML = questStatus.quests.map(quest => {
    const percent = Math.min(100, Math.round(quest.progress / Math.max(1, quest.target) * 100));
    const buttonLabel = quest.claimed ? 'Получено' : quest.complete ? `+${quest.rewardXp} XP` : `${quest.progress}/${quest.target}`;
    return `<article class="quest-item ${quest.complete ? 'complete' : ''} ${quest.claimed ? 'claimed' : ''}">
      <span class="quest-check">${quest.claimed ? '✓' : quest.complete ? '!' : '○'}</span>
      <span class="quest-copy"><b>${escapeHtml(quest.title)}</b><small>${escapeHtml(quest.detail)}</small><span class="quest-progress"><i style="width:${percent}%"></i></span></span>
      <button class="quest-reward" type="button" data-claim-quest="${quest.id}" ${quest.complete && !quest.claimed ? '' : 'disabled'}>${buttonLabel}</button>
    </article>`;
  }).join('');

  const todayKey = dateKey();
  const chestClaimed = Boolean(state.engagement.chestClaims[todayKey]);
  const chest = $('#dailyChestBtn');
  chest.disabled = !questStatus.allClaimed || chestClaimed;
  chest.classList.toggle('ready', questStatus.allClaimed && !chestClaimed);
  chest.innerHTML = chestClaimed
    ? '<span>✅</span><span><b>Сундук открыт</b><small>Награда за сегодня получена</small></span><span>✓</span>'
    : questStatus.allClaimed
      ? '<span>🎁</span><span><b>Открыть ежедневный сундук</b><small>+25 XP, +12 искр и шанс пополнить защиту</small></span><span>→</span>'
      : '<span>🎁</span><span><b>Ежедневный сундук</b><small>Сначала забери награды за 3 квеста</small></span><span>→</span>';

  $('#mistakeCount').textContent = recommendations.mistakes.length;
  $('#reviewDueCount').textContent = recommendations.due.length;
  $('#weakestSkillName').textContent = recommendations.weakest ? `${recommendations.weakest.stage.title} · ${recommendations.weakest.score}/100` : 'Нет данных';

  $('#weeklyDaysProgress').textContent = `${weekly.metrics.activeDays}/4`;
  $('#weeklyXpProgress').textContent = `${weekly.metrics.xp}/200`;
  $('#leagueProgressLabel').textContent = `${league.progress}%`;
  $('#leagueEmblem').textContent = league.icon;
  $('#weeklyMissionText').textContent = weekly.complete
    ? 'Миссия выполнена. Забери награду и продолжай без перегрузки.'
    : `Лига «${league.name}». До следующей: ${league.next ? Math.max(0, league.next.min - league.xp) + ' XP' : 'максимальный уровень'}.`;
  const weeklyProgress = Math.min(100, Math.round(((Math.min(4, weekly.metrics.activeDays) / 4) * .5 + (Math.min(200, weekly.metrics.xp) / 200) * .5) * 100));
  $('#weeklyMissionBar').style.width = `${weeklyProgress}%`;
  $('#weeklyRewardBtn').disabled = !weekly.complete || weekly.claimed;
  $('#weeklyRewardBtn').textContent = weekly.claimed ? 'Награда получена' : weekly.complete ? 'Забрать +100 XP' : 'Награда недели';
  $('#monthlyChallengeLabel').textContent = `${Math.min(monthly.progress, monthly.target)}/${monthly.target} квестов`;
  $('#monthlyChallengeBar').style.width = `${Math.min(100, Math.round(monthly.progress / monthly.target * 100))}%`;
  $('#monthlyRewardBtn').disabled = !monthly.complete || monthly.claimed;
  $('#monthlyRewardBtn').textContent = monthly.claimed ? 'Месяц закрыт' : monthly.complete ? 'Забрать +200 XP' : 'Награда месяца';

  const achievements = achievementProgress();
  const unlocked = achievements.filter(item => item.unlockedAt).length;
  $('#achievementCounter').textContent = `${unlocked}/${achievements.length}`;
  $('#achievementShelf').innerHTML = achievements.map(item => `<article class="achievement ${item.unlockedAt ? 'unlocked' : 'locked'}" title="${escapeHtml(item.detail)}">
    <span>${item.unlockedAt ? item.icon : '◌'}</span><b>${escapeHtml(item.title)}</b><small>${item.unlockedAt ? 'получено' : escapeHtml(item.detail)}</small>
  </article>`).join('');
}

function openPracticeHub(mode) {
  const dialog = $('#practiceDialog');
  const rec = practiceRecommendations();
  const close = '<button class="icon-btn close-btn" type="button" data-close-dialog>×</button>';

  if (mode === 'mistakes') {
    $('.modal-content', dialog).innerHTML = `<div class="modal-head"><div><p class="eyebrow">БАНК ОШИБОК</p><h2>Исправь то, что уже было трудно</h2></div>${close}</div>
      <p class="assessment-intro">Ошибки не штрафуют. Они становятся персональной очередью для повторения.</p>
      <div class="practice-dialog-list">${rec.mistakes.length ? rec.mistakes.map(item => `<article class="practice-dialog-item"><span class="practice-symbol red">!</span><div><h3>${escapeHtml(getStage(item.stageId)?.title || item.stageId)}</h3><p>${escapeHtml(item.question)}</p><small>Попыток: ${item.attempts} · верный ответ будет показан после проверки</small></div><button class="btn btn-secondary" type="button" data-practice-quiz="${item.stageId}" data-topic-id="${item.topicId || ''}">Повторить</button></article>`).join('') : '<div class="empty-state">Нерешённых ошибок нет. Новые ошибки автоматически появятся здесь.</div>'}</div>`;
  } else if (mode === 'reviews') {
    $('.modal-content', dialog).innerHTML = `<div class="modal-head"><div><p class="eyebrow">ИНТЕРВАЛЬНОЕ ПОВТОРЕНИЕ</p><h2>Повтори перед тем, как начнёшь забывать</h2></div>${close}</div>
      <div class="practice-dialog-list">${rec.due.length ? rec.due.map(item => `<article class="practice-dialog-item"><span class="practice-symbol yellow">↺</span><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.stageTitle)} · повторений: ${topicState(item.id).reviewCount}</p><small>Следующий интервал станет длиннее после успешного повторения.</small></div><button class="btn btn-secondary" type="button" data-review-topic="${item.id}">Повторить</button></article>`).join('') : '<div class="empty-state">Сейчас нет тем, срок повторения которых подошёл. Система вернёт их позже автоматически.</div>'}</div>`;
  } else if (mode === 'weakest') {
    const weakest = rec.weakest;
    const stageTopics = weakest ? weakest.stage.topics.map(item => ({ ...item, stageId: weakest.stage.id })).sort((a, b) => topicScore(a) - topicScore(b)).slice(0, 4) : [];
    $('.modal-content', dialog).innerHTML = `<div class="modal-head"><div><p class="eyebrow">СЛАБЫЙ НАВЫК</p><h2>${escapeHtml(weakest?.stage.title || 'Недостаточно данных')}</h2></div>${close}</div>
      <p class="assessment-intro">Рекомендация строится по оценке темы, практике, тестам, повторению и проектам.</p>
      <div class="practice-dialog-list">${stageTopics.map(item => `<article class="practice-dialog-item"><span class="practice-symbol violet">${topicScore(item)}</span><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary)}</p><small>${STATUS[topicState(item.id).status].label}</small></div><button class="btn btn-secondary" type="button" data-open-practice-topic="${item.id}">Открыть</button></article>`).join('')}</div>`;
  } else {
    const current = rec.current;
    $('.modal-content', dialog).innerHTML = `<div class="modal-head"><div><p class="eyebrow">БЫСТРЫЙ ШАГ</p><h2>Две минуты без перегруза</h2></div>${close}</div>
      <article class="rescue-session"><span class="rescue-flame">🔥</span><h3>${escapeHtml(current?.title || 'Короткое повторение')}</h3><p>${escapeHtml(current?.summary || 'Вспомни один главный принцип из последней темы и объясни его своими словами.')}</p><ol><li>Прочитай главную идею.</li><li>Назови один реальный пример применения.</li><li>Нажми «Готово» — это засчитается как осмысленный шаг.</li></ol><button id="completeRescueBtn" class="btn btn-primary full" type="button">Готово · +5 XP</button></article>`;
  }

  $$('[data-practice-quiz]', dialog).forEach(button => button.addEventListener('click', () => {
    dialog.close();
    openQuizDialog(button.dataset.practiceQuiz, button.dataset.topicId || null);
  }));
  $$('[data-review-topic]', dialog).forEach(button => button.addEventListener('click', () => {
    recordReview(button.dataset.reviewTopic);
    persistState({ silent: true });
    dialog.close();
    renderAll();
    showCelebration('Повторение выполнено', 'Следующий интервал стал длиннее', '↺');
  }));
  $$('[data-open-practice-topic]', dialog).forEach(button => button.addEventListener('click', () => {
    dialog.close();
    openTopicDialog(button.dataset.openPracticeTopic);
  }));
  $('#completeRescueBtn', dialog)?.addEventListener('click', () => {
    completeRescueSession();
    dialog.close();
  });
  dialog.showModal();
}
