function openTopicDialog(id) {
  const item = getTopic(id);
  if (!item) return;
  const data = topicState(id);
  const dialog = $('#topicDialog');
  const score = topicScore(item);
  const stageQuiz = state.stageQuiz[item.stageId];
  $('.modal-content', dialog).innerHTML = `<div class="modal-head">
    <div><p class="eyebrow">${escapeHtml(item.stageTitle).toUpperCase()} · ОЦЕНКА ${score}/100</p><h2>${escapeHtml(item.title)}</h2></div>
    <button class="icon-btn close-btn" type="button" data-close-dialog>×</button>
  </div>
  <section class="topic-hero"><img src="${visualForStage(item.stageId)}" alt="${escapeHtml(item.stageTitle)}"><div><span class="status-badge status-${data.status}">${STATUS[data.status].label}</span><p>${escapeHtml(item.summary)}</p><small class="muted">Ориентир: ≈ ${item.minutes} минут · записано фактически: ${data.minutes || 0} минут</small></div></section>
  <section class="topic-workflow">${['learning','practice','review','mastered'].map(status => {
    const statusOrder = STATUS[status].order;
    const currentOrder = STATUS[data.status].order;
    return `<div class="workflow-card ${statusOrder < currentOrder ? 'done' : statusOrder === currentOrder ? 'current' : ''}"><b>${STATUS[status].short}</b><small>${pipelineHelp(status)}</small></div>`;
  }).join('')}</section>
  <section class="topic-sections">
    <article class="topic-section"><h3>Главная идея</h3><p>${escapeHtml(topicExplanation(item.id))}</p></article>
    <article class="topic-section practice-box"><h3>Практическое задание</h3><p>${escapeHtml(item.practice)}</p></article>
    <article class="topic-section">
      <h3>Текущий статус</h3>
      <div class="status-selector">${Object.entries(STATUS).map(([key, value]) => `<button class="status-option ${data.status === key ? 'active' : ''}" type="button" data-set-topic-status="${key}">${value.label}</button>`).join('')}</div>
    </article>
    <article class="topic-section">
      <div class="field"><label><input id="practiceDoneInput" type="checkbox" ${data.practiceDone ? 'checked' : ''}> Практическое задание выполнено</label></div>
      <p class="muted" style="margin-top:8px">Отметка практики — отдельное доказательство навыка и добавляется в историю.</p>
    </article>
    <article class="topic-section">
      <h3>Проверка знаний по этапу</h3>
      <p>${stageQuiz ? `Последний результат: ${stageQuiz.score}% · ${formatDateTime(stageQuiz.completedAt)}` : 'Проверка ещё не пройдена.'}</p>
      <button id="openStageQuizBtn" class="btn btn-secondary" type="button" style="margin-top:12px">${stageQuiz ? 'Пройти ещё раз' : 'Пройти проверку'}</button>
    </article>
    <article class="topic-section"><div class="field"><label for="topicNotesInput">Главный вывод своими словами</label><textarea id="topicNotesInput" placeholder="Что понял? Где это применишь? Что осталось непонятным?">${escapeHtml(data.notes || '')}</textarea></div></article>
    <article class="topic-section"><div class="field"><label for="studyMinutesInput">Фактически потрачено сейчас, минут</label><input id="studyMinutesInput" type="number" min="0" max="1440" step="5" value="0"></div></article>
  </section>
  <div class="modal-actions">
    ${data.status === 'mastered' ? '<button id="reviewTopicBtn" class="btn btn-secondary" type="button">Повторил тему сегодня</button>' : ''}
    <button class="btn btn-quiet" type="button" data-close-dialog>Закрыть</button>
    <button id="saveTopicBtn" class="btn btn-primary" type="button">Сохранить изменения</button>
  </div>`;

  let selectedStatus = data.status;
  $$('[data-set-topic-status]', dialog).forEach(button => button.addEventListener('click', () => {
    selectedStatus = button.dataset.setTopicStatus;
    $$('[data-set-topic-status]', dialog).forEach(item => item.classList.toggle('active', item === button));
  }));
  $('#openStageQuizBtn', dialog).addEventListener('click', () => openQuizDialog(item.stageId, item.id));
  $('#reviewTopicBtn', dialog)?.addEventListener('click', () => {
    recordReview(item.id);
    persistState({ silent: true });
    dialog.close();
    renderAll();
    toast('Повторение записано в историю');
  });
  $('#saveTopicBtn', dialog).addEventListener('click', () => {
    const wasPracticeDone = data.practiceDone;
    const nextPracticeDone = $('#practiceDoneInput', dialog).checked;
    const notes = $('#topicNotesInput', dialog).value.trim();
    const minutes = Number($('#studyMinutesInput', dialog).value || 0);
    if (selectedStatus !== data.status) setTopicStatus(item.id, selectedStatus, { clearMastered: true });
    if (wasPracticeDone !== nextPracticeDone) markPracticeDone(item.id, nextPracticeDone);
    data.notes = notes;
    data.updatedAt = nowISO();
    if (minutes > 0) recordStudyMinutes(item.id, minutes);
    queueSave();
    dialog.close();
    renderAll();
    toast('Тема обновлена');
  });
  dialog.showModal();
}

function topicExplanation(id) {
  const map = {
    'python-basics': 'Переменная — это имя для значения. Список хранит набор элементов, словарь — пары «ключ: значение». В AI-приложениях особенно часто встречаются строки, списки, словари и JSON.',
    'python-functions': 'Функция получает входные данные, выполняет одну понятную задачу и возвращает результат. Хорошая функция небольшая, предсказуемая и называется по действию.',
    'embeddings': 'Embedding превращает смысл текста в набор чисел. Похожие по смыслу тексты получают близкие векторы, поэтому их можно находить даже без совпадения точных слов.',
    'rag-pipeline': 'RAG не обучает модель на твоих документах. Он сначала находит подходящие фрагменты, затем добавляет их в запрос модели. Качество зависит от chunking, поиска и правил ответа.',
    'agent-architecture': 'Агент — это не просто чат. У него есть цель, текущее состояние, доступные действия и цикл: оценить ситуацию → выбрать действие → получить результат → решить, что делать дальше.',
    'tools': 'Tool calling означает, что модель формирует структурированный запрос, а твой код проверяет его и вызывает реальную функцию или API.',
    'fastapi': 'FastAPI принимает HTTP-запрос, проверяет данные, вызывает Python-логику и возвращает JSON. Это мост между AI-функцией и интерфейсом, ботом или другим сервисом.',
    'docker': 'Docker описывает окружение приложения: системные пакеты, Python, зависимости и команду запуска. Это уменьшает ситуацию «у меня работает, а на сервере нет».'
  };
  return map[id] || 'Разбери тему на трёх уровнях: что это такое, зачем это нужно в AI-приложении и какой минимальный пример можно сделать своими руками. Цель — не запомнить определение, а понять причину и результат.';
}

function openQuizDialog(stageId, topicId = null) {
  const quizItem = QUIZ.find(item => item.stage === stageId);
  if (!quizItem) {
    toast('Для этого этапа проверка пока не добавлена');
    return;
  }
  const dialog = $('#assessmentDialog');
  $('.modal-content', dialog).innerHTML = `<div class="modal-head"><div><p class="eyebrow">ПРОВЕРКА ЗНАНИЙ · ${escapeHtml(getStage(stageId).title)}</p><h2>${escapeHtml(quizItem.question)}</h2></div><button class="icon-btn close-btn" type="button" data-close-dialog>×</button></div>
    <div class="assessment-list">${quizItem.answers.map((answer, index) => `<button class="btn btn-secondary full quiz-answer" type="button" data-answer-index="${index}">${escapeHtml(answer)}</button>`).join('')}</div>
    <div id="quizFeedback"></div>`;
  $$('.quiz-answer', dialog).forEach(button => button.addEventListener('click', () => {
    const answerIndex = Number(button.dataset.answerIndex);
    const correct = answerIndex === quizItem.correct;
    $$('.quiz-answer', dialog).forEach(item => item.disabled = true);
    button.classList.remove('btn-secondary');
    button.classList.add(correct ? 'btn-primary' : 'btn-danger');
    const score = correct ? 100 : 40;
    const previousQuiz = state.stageQuiz[stageId];
    state.stageQuiz[stageId] = { score: Math.max(Number(previousQuiz?.score || 0), score), latestScore: score, completedAt: nowISO(), answerIndex, attempts: Number(previousQuiz?.attempts || 0) + 1 };
    if (correct) resolveMistakesForStage(stageId); else addMistake(stageId, quizItem, answerIndex, topicId);
    addHistory('assessment', `Проверка знаний: ${getStage(stageId).title}`, `${correct ? 'Верный ответ.' : 'Ответ добавлен в банк ошибок.'} ${quizItem.explanation}`, { stageId, topicId, score, repeatAttempt: Boolean(previousQuiz) });
    $('#quizFeedback', dialog).innerHTML = `<article class="topic-section ${correct ? '' : 'mistake-feedback'}" style="margin-top:14px"><h3>${correct ? 'Верно · ошибка закрыта' : 'Нужно повторить · сохранено в банк ошибок'}</h3><p>${escapeHtml(quizItem.explanation)}</p><small class="reward-preview">${correct ? '+20 XP за проверку' : '+8 XP за честную попытку'}</small>${topicId && correct ? '<button id="masterAfterQuizBtn" class="btn btn-primary" type="button" style="margin-top:12px">Отметить тему как освоенную</button>' : ''}</article>`;
    $('#masterAfterQuizBtn', dialog)?.addEventListener('click', () => {
      setTopicStatus(topicId, 'mastered');
      persistState({ silent: true });
      dialog.close();
      $('#topicDialog').close();
      renderAll();
      toast('Тема подтверждена');
    });
    queueSave();
    renderSkills();
  }));
  dialog.showModal();
}

function openAssessmentDialog() {
  const dialog = $('#assessmentDialog');
  const draft = { ...state.assessment.ratings };
  $('.modal-content', dialog).innerHTML = `<div class="modal-head"><div><p class="eyebrow">СТАРТОВАЯ САМООЦЕНКА</p><h2>Что ты уже реально делал</h2></div><button class="icon-btn close-btn" type="button" data-close-dialog>×</button></div>
    <p class="assessment-intro">Выбери уровень по каждому направлению. Эта оценка задаёт только стартовую базу — дальше баллы растут за реальные темы, практику, проверки и проекты.</p>
    <div class="assessment-list">${ROADMAP.map(stage => `<article class="assessment-row">
      <img src="${visualForStage(stage.id)}" alt="${escapeHtml(stage.title)}">
      <div><h3>${escapeHtml(stage.title)}</h3><small class="muted">${escapeHtml(stage.subtitle)}</small>
        <div class="rating-options">${[
          ['0','Не знаком'],['1','Изучал'],['2','Делал по инструкции'],['3','Делаю сам']
        ].map(([value,label]) => `<button class="rating-btn ${String(draft[stage.id] || 0) === value ? 'active' : ''}" type="button" data-rating-stage="${stage.id}" data-rating-value="${value}">${label}</button>`).join('')}</div>
      </div>
    </article>`).join('')}</div>
    <div class="modal-actions"><button class="btn btn-quiet" type="button" data-close-dialog>Отмена</button><button id="saveAssessmentBtn" class="btn btn-primary" type="button">Сохранить оценку</button></div>`;
  $$('[data-rating-stage]', dialog).forEach(button => button.addEventListener('click', () => {
    draft[button.dataset.ratingStage] = Number(button.dataset.ratingValue);
    $$(`[data-rating-stage="${button.dataset.ratingStage}"]`, dialog).forEach(item => item.classList.toggle('active', item === button));
  }));
  $('#saveAssessmentBtn', dialog).addEventListener('click', () => {
    state.assessment.ratings = draft;
    state.assessment.completedAt = nowISO();
    addHistory('assessment', 'Пройдена стартовая оценка навыков', `Текущий расчётный уровень: ${getLevel(overallScore()).name}, ${overallScore()}/100.`, { score: overallScore(), learningEvent: false });
    queueSave();
    dialog.close();
    renderAll();
    toast('Оценка навыков обновлена');
  });
  dialog.showModal();
}

function openProjectDialog(id) {
  const projectItem = getProject(id);
  if (!projectItem) return;
  const data = projectState(id);
  const dialog = $('#projectDialog');
  $('.modal-content', dialog).innerHTML = `<div class="modal-head"><div><p class="eyebrow">ПРОЕКТ-ДОКАЗАТЕЛЬСТВО</p><h2>${escapeHtml(projectItem.title)}</h2></div><button class="icon-btn close-btn" type="button" data-close-dialog>×</button></div>
    <p class="assessment-intro">${escapeHtml(projectItem.description)}</p>
    <article class="topic-section"><h3>Статус проекта</h3><div class="status-selector">${[
      ['not_started','Не начат'],['building','В разработке'],['review','На проверке'],['complete','Завершён']
    ].map(([value,label]) => `<button class="status-option ${data.status === value ? 'active' : ''}" type="button" data-project-status="${value}">${label}</button>`).join('')}</div></article>
    <article class="topic-section"><h3>Критерии готовности</h3><div class="project-checklist">${projectItem.criteria.map((criterion, index) => `<label class="checklist-row"><input type="checkbox" data-project-criterion="${index}" ${data.criteria[String(index)] ? 'checked' : ''}><span>${escapeHtml(criterion)}</span></label>`).join('')}</div></article>
    <article class="topic-section"><div class="field"><label for="projectEvidenceInput">Ссылка на GitHub, демо или описание результата</label><input id="projectEvidenceInput" type="url" placeholder="https://..." value="${escapeHtml(data.evidenceUrl || '')}"></div></article>
    <article class="topic-section"><div class="field"><label for="projectNotesInput">Что сделано и что осталось</label><textarea id="projectNotesInput">${escapeHtml(data.notes || '')}</textarea></div></article>
    <div class="modal-actions"><button class="btn btn-quiet" type="button" data-close-dialog>Отмена</button><button id="saveProjectBtn" class="btn btn-primary" type="button">Сохранить проект</button></div>`;
  let selectedStatus = data.status;
  $$('[data-project-status]', dialog).forEach(button => button.addEventListener('click', () => {
    selectedStatus = button.dataset.projectStatus;
    $$('[data-project-status]', dialog).forEach(item => item.classList.toggle('active', item === button));
  }));
  $('#saveProjectBtn', dialog).addEventListener('click', () => {
    const previous = data.status;
    const criteriaBefore = Object.values(data.criteria).filter(Boolean).length;
    data.status = selectedStatus;
    data.evidenceUrl = $('#projectEvidenceInput', dialog).value.trim();
    data.notes = $('#projectNotesInput', dialog).value.trim();
    $$('[data-project-criterion]', dialog).forEach(input => { data.criteria[input.dataset.projectCriterion] = input.checked; });
    const criteriaAfter = Object.values(data.criteria).filter(Boolean).length;
    const criteriaAdded = Math.max(0, criteriaAfter - criteriaBefore);
    data.updatedAt = nowISO();
    if (selectedStatus !== 'not_started' && !data.startedAt) data.startedAt = nowISO();
    if (selectedStatus === 'complete') data.completedAt = data.completedAt || nowISO();
    if (selectedStatus !== 'complete') data.completedAt = null;
    if (previous !== selectedStatus) addHistory('project', `${projectStatusLabel(selectedStatus)}: ${projectItem.title}`, `Статус проекта изменён с «${projectStatusLabel(previous)}» на «${projectStatusLabel(selectedStatus)}».`, { projectId: id, fromStatus: previous, toStatus: selectedStatus, criteriaAdded });
    else addHistory('project', `Обновлён проект «${projectItem.title}»`, 'Сохранены критерии, ссылка или заметки проекта.', { projectId: id, criteriaAdded });
    queueSave();
    dialog.close();
    renderAll();
    toast('Карточка проекта сохранена');
  });
  dialog.showModal();
}

async function openSettingsDialog() {
  const backups = await idbGetAll('backups').catch(() => []);
  const bytes = new Blob([JSON.stringify(state)]).size;
  const dialog = $('#settingsDialog');
  $('.modal-content', dialog).innerHTML = `<div class="modal-head"><div><p class="eyebrow">НАСТРОЙКИ И ДАННЫЕ</p><h2>Темп обучения и сохранение</h2></div><button class="icon-btn close-btn" type="button" data-close-dialog>×</button></div>
    <div class="settings-grid">
      <section class="settings-panel">
        <h3>Темп обучения</h3>
        <div class="field"><label for="weeklyHoursInput">Часов в неделю</label><input id="weeklyHoursInput" type="number" min="1" max="40" value="${state.profile.weeklyHours}"></div>
        <div class="field"><label for="sessionLengthInput">Длина учебной сессии</label><select id="sessionLengthInput"><option value="25">25 минут</option><option value="45">45 минут</option><option value="60">60 минут</option><option value="90">90 минут</option></select></div>
        <div class="field"><label for="modeInput">Порядок обучения</label><select id="modeInput"><option value="project">Быстрее к проектам</option><option value="sequential">Строго по порядку</option></select></div>
        <div class="field"><label for="dailyGoalXpInput">Ежедневная цель XP</label><input id="dailyGoalXpInput" type="number" min="10" max="200" step="5" value="${state.engagement.dailyGoalXp}"></div>
        <div class="field"><label for="dailyGoalMinutesInput">Альтернативная цель, минут</label><input id="dailyGoalMinutesInput" type="number" min="2" max="120" step="1" value="${state.engagement.dailyGoalMinutes}"></div>
        <button id="saveSettingsBtn" class="btn btn-primary full" type="button">Сохранить настройки</button>
      </section>
      <section class="settings-panel">
        <h3>Где хранится прогресс</h3>
        <div class="storage-details">
          <div><span>Основное хранилище</span><b>${db ? 'IndexedDB' : 'localStorage'}</b></div>
          <div><span>Резервная копия</span><b>localStorage</b></div>
          <div><span>Последнее сохранение</span><b>${state.meta.lastSavedAt ? formatDateTime(state.meta.lastSavedAt) : 'сейчас'}</b></div>
          <div><span>Локальных снимков</span><b>${backups.length}</b></div>
          <div><span>Размер данных</span><b>≈ ${Math.max(1, Math.round(bytes / 1024))} КБ</b></div>
        </div>
        <p class="muted">Закрытие приложения или обновление сайта не сбрасывает прогресс. Данные могут исчезнуть при очистке данных браузера или переходе на другое устройство.</p>
      </section>
      <section class="settings-panel">
        <h3>Резервная копия</h3>
        <button id="manualBackupBtn" class="btn btn-secondary full" type="button">Создать локальный снимок</button>
        <button id="exportBtn" class="btn btn-secondary full" type="button">Скачать JSON-копию</button>
        <button id="importBtn" class="btn btn-secondary full" type="button">Восстановить из JSON</button>
      </section>
      <section class="settings-panel">
        <h3>Награды и серия</h3>
        <div class="storage-details"><div><span>Всего XP</span><b>${state.engagement.xpTotal}</b></div><div><span>Искры</span><b>${state.engagement.sparks}</b></div><div><span>Заморозки серии</span><b>${state.engagement.streakFreezes}/${state.engagement.maxStreakFreezes}</b></div></div>
        <button id="settingsBuyFreezeBtn" class="btn btn-secondary full" type="button" ${state.engagement.streakFreezes >= state.engagement.maxStreakFreezes || state.engagement.sparks < 40 ? 'disabled' : ''}>Купить заморозку · 40 искр</button>
        <p class="muted">Серия засчитывается за одно осмысленное действие. Дневная цель считается отдельно и может быть выше.</p>
      </section>
      <section class="settings-panel">
        <h3>Опасная зона</h3>
        <p class="muted">Сброс удалит историю, статусы, оценки и проекты только на этом устройстве.</p>
        <button id="resetDataBtn" class="btn btn-danger full" type="button">Сбросить весь прогресс</button>
      </section>
    </div>`;
  $('#sessionLengthInput', dialog).value = String(state.profile.sessionLength);
  $('#modeInput', dialog).value = state.profile.mode;
  $('#saveSettingsBtn', dialog).addEventListener('click', () => {
    state.profile.weeklyHours = Math.max(1, Math.min(40, Number($('#weeklyHoursInput', dialog).value || 10)));
    state.profile.sessionLength = Number($('#sessionLengthInput', dialog).value || 45);
    state.profile.mode = $('#modeInput', dialog).value;
    state.engagement.dailyGoalXp = Math.max(10, Math.min(200, Number($('#dailyGoalXpInput', dialog).value || 40)));
    state.engagement.dailyGoalMinutes = Math.max(2, Math.min(120, Number($('#dailyGoalMinutesInput', dialog).value || 15)));
    queueSave();
    dialog.close();
    renderAll();
    toast('Настройки сохранены');
  });
  $('#manualBackupBtn', dialog).addEventListener('click', createManualBackup);
  $('#exportBtn', dialog).addEventListener('click', exportData);
  $('#importBtn', dialog).addEventListener('click', () => $('#importInput').click());
  $('#settingsBuyFreezeBtn', dialog)?.addEventListener('click', () => { buyStreakFreeze(); dialog.close(); });
  $('#resetDataBtn', dialog).addEventListener('click', resetData);
  dialog.showModal();
}

function exportData() {
  const payload = {
    exportedAt: nowISO(),
    app: 'AI Forge Path',
    appVersion: APP_VERSION,
    schemaVersion: 2,
    state
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `ai-forge-path-backup-${dateKey()}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
  addHistory('backup', 'Экспортирована резервная копия', 'JSON-файл скачан на устройство.');
  queueSave();
  renderHistory();
}

async function importData(file) {
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const incoming = parsed.state || parsed;
    if (!incoming || Number(incoming.schemaVersion) !== 2) throw new Error('Неподдерживаемая версия резервной копии');
    if (!confirm('Заменить текущий прогресс данными из выбранной копии?')) return;
    state = normalizeState(incoming);
    addHistory('backup', 'Восстановлена резервная копия', `Импортирован файл ${file.name}.`);
    await persistState({ silent: true });
    renderAll();
    toast('Прогресс восстановлен');
    $('#settingsDialog').close();
  } catch (error) {
    alert(`Не удалось импортировать данные: ${error.message}`);
  } finally {
    $('#importInput').value = '';
  }
}

async function resetData() {
  if (!confirm('Точно удалить весь прогресс на этом устройстве? Это действие нельзя отменить без резервной копии.')) return;
  state = createDefaultState();
  localStorage.removeItem(LOCAL_KEY);
  await idbDelete('kv', STATE_KEY).catch(() => {});
  await persistState({ silent: true });
  $('#settingsDialog').close();
  activeView = 'today';
  renderAll();
  toast('Прогресс сброшен');
}

function handleAdvanceCurrent() {
  const current = getCurrentTopic();
  const action = $('#advanceCurrentBtn').dataset.action;
  if (action === 'projects') { setView('projects'); return; }
  if (!current) return;
  if (action === 'learning') setTopicStatus(current.id, 'learning');
  if (action === 'practice') setTopicStatus(current.id, 'practice');
  if (action === 'review') {
    if (reviewIsDue(current) || topicState(current.id).status === 'mastered') {
      recordReview(current.id);
      toast('Повторение записано');
    } else {
      markPracticeDone(current.id, true);
    }
  }
  if (action === 'quiz') { openQuizDialog(current.stageId, current.id); return; }
  if (action === 'mastered') setTopicStatus(current.id, 'mastered');
  queueSave();
  renderAll();
}

function handleTaskAction(action, topicId) {
  if (action === 'open-topic' && topicId) openTopicDialog(topicId);
  else if (action === 'practice' && topicId) openTopicDialog(topicId);
  else if (action === 'quiz' && topicId) openQuizDialog(getTopic(topicId).stageId, topicId);
  else if (action === 'projects') setView('projects');
  else if (action === 'skills') setView('skills');
  else if (action === 'backup') createManualBackup();
}

function calcStreak() {
  return calculateStreakDetails().current;
}

function estimateWeeks() {
  const remainingMinutes = getOrderedTopics()
    .filter(item => topicState(item.id).status !== 'mastered')
    .reduce((sum, item) => sum + item.minutes, 0);
  return Math.max(0, Math.ceil(remainingMinutes / Math.max(60, state.profile.weeklyHours * 60)));
}

function formatRelativeTime(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'только что';
  if (minutes < 60) return `${minutes} мин назад`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ч назад`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} дн назад`;
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' }).format(new Date(timestamp));
}

function formatDayLabel(key) {
  if (key === dateKey()) return 'Сегодня';
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (key === dateKey(yesterday)) return 'Вчера';
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${key}T12:00:00`));
}

function formatTime(timestamp) {
  return new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(new Date(timestamp));
}

function formatDateTime(timestamp) {
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(timestamp));
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function toast(message) {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('show'), 2600);
}

function bindEvents() {
  document.addEventListener('click', event => {
    const viewButton = event.target.closest('[data-view-target]');
    if (viewButton) setView(viewButton.dataset.viewTarget);

    const planButton = event.target.closest('[data-plan-tab]');
    if (planButton) {
      activePlanTab = planButton.dataset.planTab;
      renderPlan();
    }

    const topicButton = event.target.closest('[data-open-topic]');
    if (topicButton) openTopicDialog(topicButton.dataset.openTopic);

    const stageButton = event.target.closest('[data-toggle-stage]');
    if (stageButton) {
      const card = stageButton.closest('.stage-card');
      card.classList.toggle('open');
      stageButton.setAttribute('aria-expanded', String(card.classList.contains('open')));
    }

    const historyButton = event.target.closest('[data-history-filter]');
    if (historyButton) {
      historyFilter = historyButton.dataset.historyFilter;
      renderHistory();
    }

    const projectButton = event.target.closest('[data-open-project]');
    if (projectButton) openProjectDialog(projectButton.dataset.openProject);

    const taskButton = event.target.closest('[data-task-action]');
    if (taskButton) handleTaskAction(taskButton.dataset.taskAction, taskButton.dataset.topicId);

    const questButton = event.target.closest('[data-claim-quest]');
    if (questButton) claimQuest(questButton.dataset.claimQuest);

    const practiceButton = event.target.closest('[data-practice-mode]');
    if (practiceButton) openPracticeHub(practiceButton.dataset.practiceMode);

    const closeButton = event.target.closest('[data-close-dialog]');
    if (closeButton) closeButton.closest('dialog').close();
  });

  document.addEventListener('keydown', event => {
    const row = event.target.closest('.topic-row[role="button"]');
    if (row && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      openTopicDialog(row.dataset.openTopic);
    }
  });

  $('#runAssessmentBtn').addEventListener('click', openAssessmentDialog);
  $('#skillsAssessmentBtn').addEventListener('click', openAssessmentDialog);
  $('#settingsBtn').addEventListener('click', openSettingsDialog);
  $('#storageStatusBtn').addEventListener('click', openSettingsDialog);
  $('#openDataSettingsBtn').addEventListener('click', openSettingsDialog);
  $('#openCurrentBtn').addEventListener('click', () => { const current = getCurrentTopic(); if (current) openTopicDialog(current.id); });
  $('#advanceCurrentBtn').addEventListener('click', handleAdvanceCurrent);
  $('#refreshPlanBtn').addEventListener('click', () => {
    state.dailyPlanNonce[dateKey()] = Date.now();
    addHistory('topic', 'План на сегодня обновлён', 'Следующие действия пересчитаны по текущему состоянию тем.');
    renderAll();
    toast('План обновлён');
  });
  $('#exportHistoryBtn').addEventListener('click', exportData);
  $('#dailyChestBtn').addEventListener('click', claimDailyChest);
  $('#weeklyRewardBtn').addEventListener('click', claimWeeklyChallenge);
  $('#monthlyRewardBtn').addEventListener('click', claimMonthlyChallenge);
  $('#shareProgressBtn').addEventListener('click', shareProgress);
  $('#buyFreezeBtn').addEventListener('click', buyStreakFreeze);
  $('#importInput').addEventListener('change', event => importData(event.target.files?.[0]));

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    $('#installBtn').classList.remove('hidden');
  });
  $('#installBtn').addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    $('#installBtn').classList.add('hidden');
  });

  window.addEventListener('pagehide', () => {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(state)); } catch {}
  });
}

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.register('./sw.js');
    if (registration.waiting) registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) worker.postMessage({ type: 'SKIP_WAITING' });
      });
    });
  } catch (error) {
    console.warn('Service worker registration failed', error);
  }
}

async function init() {
  bindEvents();
  await loadState();
  activeView = state.meta.lastView || 'today';
  renderAll();
  await registerServiceWorker();
}

init().catch(error => {
  console.error(error);
  setSaveIndicator('error', 'Ошибка запуска');
  toast('Не удалось загрузить приложение. Обнови страницу.');
});
