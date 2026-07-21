function renderAll() {
  renderNavigation();
  renderToday();
  renderPlan();
  renderSkills();
  renderHistory();
  renderProjects();
  renderEngagementDashboard();
}

function renderNavigation() {
  $$('.view').forEach(view => view.classList.toggle('active', view.id === activeView));
  $$('.nav-btn').forEach(button => button.classList.toggle('active', button.dataset.viewTarget === activeView));
  state.meta.lastView = activeView;
  queueSave();
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function setView(viewId) {
  if (!document.getElementById(viewId)) return;
  activeView = viewId;
  renderNavigation();
  if (viewId === 'plan') renderPlan();
  if (viewId === 'skills') renderSkills();
  if (viewId === 'history') renderHistory();
  if (viewId === 'projects') renderProjects();
}

function renderToday() {
  const score = overallScore();
  const level = getLevel(score);
  $('#overallScore').textContent = score;
  $('#overallScoreRing').style.setProperty('--score', score);
  $('#levelName').textContent = level.name;
  $('#levelExplanation').textContent = level.text;
  $('#evidenceTopics').textContent = masteredTopicCount();
  $('#evidencePractice').textContent = practiceCount();
  $('#evidenceProjects').textContent = completedProjectCount();
  $('#runAssessmentBtn').textContent = state.assessment.completedAt ? 'Обновить стартовую оценку' : 'Пройти стартовую оценку';

  const current = getCurrentTopic();
  const action = nextActionFor(current);
  if (current) {
    const data = topicState(current.id);
    $('#currentTitle').textContent = current.title;
    $('#currentSummary').textContent = `${current.stageTitle}. ${current.summary}`;
    $('#currentVisual').src = visualForStage(current.stageId);
    $('#currentVisual').alt = `Инфографика этапа ${current.stageTitle}`;
    const badge = $('#currentStatusBadge');
    badge.textContent = reviewIsDue(current) ? 'Нужно повторить' : STATUS[data.status].label;
    badge.className = `status-badge status-${reviewIsDue(current) ? 'review' : data.status}`;
    $('#nextActionText').textContent = action.label;
    $('#nextActionMeta').textContent = action.meta;
    $('#openCurrentBtn').textContent = reviewIsDue(current) ? 'Открыть для повторения' : 'Открыть текущую тему';
    $('#advanceCurrentBtn').textContent = action.button;
    $('#advanceCurrentBtn').dataset.action = action.action;
    $('#advanceCurrentBtn').disabled = false;
    $('#openCurrentBtn').disabled = false;
    $('#statusPipeline').innerHTML = ['learning','practice','review','mastered'].map(status => {
      const statusOrder = STATUS[status].order;
      const currentOrder = STATUS[data.status].order;
      const className = statusOrder < currentOrder ? 'done' : statusOrder === currentOrder ? 'active' : '';
      return `<div class="pipeline-step ${className}"><b>${STATUS[status].short}</b><small>${pipelineHelp(status)}</small></div>`;
    }).join('');
  } else {
    $('#currentTitle').textContent = 'Основной маршрут завершён';
    $('#currentSummary').textContent = 'Все темы отмечены как освоенные. Усиливай портфолио и повторяй ключевые навыки.';
    $('#currentVisual').src = visualForStage('portfolio');
    $('#currentStatusBadge').textContent = 'Готово';
    $('#currentStatusBadge').className = 'status-badge status-mastered';
    $('#nextActionText').textContent = action.label;
    $('#nextActionMeta').textContent = action.meta;
    $('#statusPipeline').innerHTML = ['learning','practice','review','mastered'].map(status => `<div class="pipeline-step done"><b>${STATUS[status].short}</b><small>${pipelineHelp(status)}</small></div>`).join('');
    $('#openCurrentBtn').disabled = true;
    $('#advanceCurrentBtn').textContent = 'Открыть проекты';
    $('#advanceCurrentBtn').dataset.action = 'projects';
  }

  renderTodayTasks();
  renderRecentHistory();
  renderSkillSnapshot();
}

function pipelineHelp(status) {
  return ({ learning: 'понять идею', practice: 'сделать руками', review: 'проверить', mastered: 'подтвердить' })[status];
}

function buildTodayTasks() {
  const current = getCurrentTopic();
  if (!current) return [
    { id: 'projects', icon: '▣', title: 'Выбрать следующий проект', detail: 'Маршрут пройден — пора усиливать портфолио.', action: 'projects', done: completedProjectCount() === PROJECTS.length },
    { id: 'review', icon: '↺', title: 'Повторить слабый навык', detail: 'Открой карту навыков и выбери самый низкий результат.', action: 'skills', done: false },
    { id: 'backup', icon: '▤', title: 'Создать резервную копию', detail: 'Сохрани текущий прогресс перед следующей большой целью.', action: 'backup', done: false }
  ];
  const data = topicState(current.id);
  const quizDone = Boolean(state.stageQuiz[current.stageId]);
  return [
    {
      id: 'learn', icon: '1', title: 'Понять главную идею', detail: current.summary,
      action: 'open-topic', topicId: current.id,
      done: STATUS[data.status].order >= STATUS.practice.order
    },
    {
      id: 'practice', icon: '2', title: 'Сделать руками', detail: current.practice,
      action: 'practice', topicId: current.id,
      done: data.practiceDone
    },
    {
      id: 'check', icon: '3', title: 'Проверить и закрепить', detail: quizDone ? `Проверка пройдена: ${state.stageQuiz[current.stageId].score}%` : 'Пройди короткую проверку и запиши главный вывод.',
      action: 'quiz', topicId: current.id,
      done: data.status === 'mastered'
    }
  ];
}

function renderTodayTasks() {
  const tasks = buildTodayTasks();
  $('#todayTaskList').innerHTML = tasks.map(task => `<div class="task-item ${task.done ? 'done' : ''}">
    <span class="task-icon">${task.done ? '✓' : task.icon}</span>
    <span class="task-copy"><strong>${escapeHtml(task.title)}</strong><small>${escapeHtml(task.detail)}</small></span>
    <button class="task-action" type="button" data-task-action="${task.action}" data-topic-id="${task.topicId || ''}" title="${task.done ? 'Выполнено' : 'Открыть'}">${task.done ? '✓' : '→'}</button>
  </div>`).join('');
}

function renderRecentHistory() {
  const items = state.history.slice(0, 4);
  $('#recentHistory').innerHTML = items.length ? items.map(event => `<div class="history-mini-item">
    <span class="history-icon">${historyIcon(event.type)}</span>
    <span><strong>${escapeHtml(event.title)}</strong><small>${formatRelativeTime(event.timestamp)} · ${escapeHtml(event.detail || '')}</small></span>
  </div>`).join('') : '<div class="empty-state">История пока пуста. Начни первую тему — каждое действие будет записано автоматически.</div>';
}

function renderSkillSnapshot() {
  const scores = allStageScores();
  const entries = ROADMAP.map(stage => ({ stage, score: scores[stage.id] }));
  const started = entries.filter(item => item.score > 0);
  const selected = started.length >= 3
    ? [...started.sort((a,b) => b.score - a.score).slice(0,2), ...started.sort((a,b) => a.score - b.score).slice(0,1)]
    : entries.slice(0,3);
  const unique = [...new Map(selected.map(item => [item.stage.id, item])).values()].slice(0,3);
  $('#skillSnapshot').innerHTML = unique.map(({ stage, score }) => `<div class="skill-compact">
    <div class="skill-compact-head"><b>${escapeHtml(stage.title)}</b><b>${score}/100</b></div>
    <div class="progress-track"><span style="width:${score}%"></span></div>
    <small>${skillHint(stage.id, score)}</small>
  </div>`).join('');
}

function skillHint(stageId, score) {
  if (score === 0) return 'Ещё не оценено и не начато';
  if (score < 20) return 'Есть знакомство, нужна практика';
  if (score < 40) return 'База формируется';
  if (score < 60) return 'Можно выполнять задачи с подсказкой';
  if (score < 75) return 'Уверенный прикладной уровень';
  if (score < 90) return 'Сильный практический навык';
  return 'Навык подтверждён практикой и проектами';
}

function renderPlan() {
  $$('.segment-btn').forEach(button => button.classList.toggle('active', button.dataset.planTab === activePlanTab));
  const container = $('#planContent');
  if (activePlanTab === 'today') container.innerHTML = renderTodayPlanContent();
  if (activePlanTab === 'week') container.innerHTML = renderWeekPlanContent();
  if (activePlanTab === 'roadmap') container.innerHTML = renderRoadmapContent();
}

function renderTodayPlanContent() {
  const tasks = buildTodayTasks();
  const done = tasks.filter(task => task.done).length;
  return `<section class="plan-summary">
    <div class="summary-stat"><b>${done}/${tasks.length}</b><small>шагов выполнено</small></div>
    <div class="summary-stat"><b>${state.profile.sessionLength} мин</b><small>длина сессии</small></div>
    <div class="summary-stat"><b>${calcStreak()}</b><small>дней серия</small></div>
    <div class="summary-stat"><b>${overallScore()}/100</b><small>текущий уровень</small></div>
  </section>
  <section class="plan-list">${tasks.map((task, index) => `<article class="plan-item">
    <span class="plan-item-number">${task.done ? '✓' : index + 1}</span>
    <div><h3>${escapeHtml(task.title)}</h3><p>${escapeHtml(task.detail)}</p></div>
    <div class="plan-item-meta"><span class="status-badge ${task.done ? 'status-mastered' : 'status-learning'}">${task.done ? 'Выполнено' : 'Следующее действие'}</span><button class="btn ${task.done ? 'btn-quiet' : 'btn-primary'}" type="button" data-task-action="${task.action}" data-topic-id="${task.topicId || ''}">${task.done ? 'Открыть' : 'Выполнить'}</button></div>
  </article>`).join('')}</section>`;
}

function renderWeekPlanContent() {
  const budget = state.profile.weeklyHours * 60;
  const ordered = getOrderedTopics().filter(item => topicState(item.id).status !== 'mastered');
  let used = 0;
  const items = [];
  for (const item of ordered) {
    if (items.length && used + item.minutes > budget) break;
    items.push(item);
    used += item.minutes;
  }
  return `<section class="plan-summary">
    <div class="summary-stat"><b>${state.profile.weeklyHours} ч</b><small>доступно на неделе</small></div>
    <div class="summary-stat"><b>${items.length}</b><small>тем в плане</small></div>
    <div class="summary-stat"><b>≈ ${Math.round(used / 60 * 10) / 10} ч</b><small>расчётная нагрузка</small></div>
    <div class="summary-stat"><b>${estimateWeeks()}</b><small>недель до конца</small></div>
  </section>
  <section class="plan-list">${items.map((item, index) => {
    const data = topicState(item.id);
    return `<article class="plan-item">
      <span class="plan-item-number">${index + 1}</span>
      <div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.stageTitle)} · ${escapeHtml(item.summary)}</p></div>
      <div class="plan-item-meta"><span class="status-badge status-${data.status}">${STATUS[data.status].label}</span><button class="btn btn-secondary" type="button" data-open-topic="${item.id}">Открыть · ${item.minutes} мин</button></div>
    </article>`;
  }).join('') || '<div class="empty-state">Все темы маршрута освоены.</div>'}</section>`;
}

function renderRoadmapContent() {
  return `<section class="plan-summary">
    <div class="summary-stat"><b>${masteredTopicCount()}/${allTopics().length}</b><small>тем освоено</small></div>
    <div class="summary-stat"><b>${practiceCount()}</b><small>практик выполнено</small></div>
    <div class="summary-stat"><b>${Object.keys(state.stageQuiz).length}/${ROADMAP.length}</b><small>проверок пройдено</small></div>
    <div class="summary-stat"><b>${overallScore()}/100</b><small>общая оценка</small></div>
  </section>
  <section class="stage-list">${ROADMAP.map((stage, index) => renderStageCard(stage, index)).join('')}</section>`;
}

function renderStageCard(stage, index) {
  const statuses = stage.topics.map(item => topicState(item.id));
  const mastered = statuses.filter(item => item.status === 'mastered').length;
  const score = stageScore(stage.id);
  const isCurrent = getCurrentTopic()?.stageId === stage.id;
  return `<article class="stage-card ${isCurrent ? 'open' : ''}" data-stage-card="${stage.id}">
    <button class="stage-header" type="button" data-toggle-stage="${stage.id}" aria-expanded="${isCurrent}">
      <span class="stage-number">${index + 1}</span>
      <span><h2>${escapeHtml(stage.title)}</h2><p>${escapeHtml(stage.subtitle)}</p></span>
      <span class="stage-stat"><b>${score}/100</b><small>${mastered}/${stage.topics.length} освоено</small></span>
      <span class="stage-chevron">⌄</span>
    </button>
    <div class="stage-body">
      <div class="stage-overview"><img src="${visualForStage(stage.id)}" alt="Схема этапа ${escapeHtml(stage.title)}"><p><strong>Результат этапа.</strong><br>${escapeHtml(stage.outcome)}</p></div>
      <div class="topic-table">${stage.topics.map(item => {
        const full = { ...item, stageId: stage.id };
        const data = topicState(item.id);
        return `<div class="topic-row" data-open-topic="${item.id}" data-status="${data.status}" role="button" tabindex="0">
          <span class="topic-status-dot"></span>
          <span class="topic-title"><strong>${escapeHtml(item.title)}</strong><small>${STATUS[data.status].label} · ${escapeHtml(item.summary)}</small></span>
          <span class="topic-score">${topicScore(full)}/100</span>
          <span class="topic-time">≈ ${item.minutes} мин</span>
        </div>`;
      }).join('')}</div>
    </div>
  </article>`;
}

function renderSkills() {
  const score = overallScore();
  const level = getLevel(score);
  $('#methodLevelName').textContent = `${level.name} · ${score}/100`;
  $('#skillsAssessmentBtn').textContent = state.assessment.completedAt ? 'Обновить стартовую оценку' : 'Пройти стартовую оценку';
  renderRadar();
  const scores = allStageScores();
  $('#skillMatrix').innerHTML = ROADMAP.map(stage => {
    const stageData = stage.topics.map(item => topicState(item.id));
    const practices = stageData.filter(item => item.practiceDone).length;
    const mastered = stageData.filter(item => item.status === 'mastered').length;
    const reviews = stageData.reduce((sum, item) => sum + Number(item.reviewCount || 0), 0);
    const quiz = Number(state.stageQuiz[stage.id]?.score || 0);
    return `<article class="skill-card">
      <div class="skill-card-head">
        <span class="skill-card-icon"><img src="${visualForStage(stage.id)}" alt="${escapeHtml(stage.title)}"></span>
        <span><h3>${escapeHtml(stage.title)}</h3><small>${skillHint(stage.id, scores[stage.id])}</small></span>
        <b class="skill-score">${scores[stage.id]}</b>
      </div>
      <div class="progress-track"><span style="width:${scores[stage.id]}%"></span></div>
      <div class="skill-evidence">
        <span><b>${mastered}/${stage.topics.length}</b><small>темы</small></span>
        <span><b>${practices}</b><small>практика</small></span>
        <span><b>${quiz || '—'}</b><small>тест %</small></span>
        <span><b>${reviews}</b><small>повторения</small></span>
      </div>
    </article>`;
  }).join('');
}

function renderRadar() {
  const groups = [
    { label: 'Python', ids: ['python'] },
    { label: 'Data/AI', ids: ['libraries','fundamentals'] },
    { label: 'Prompt/LLM', ids: ['prompting','llm'] },
    { label: 'RAG', ids: ['rag'] },
    { label: 'Agents', ids: ['agents','frameworks'] },
    { label: 'Backend', ids: ['backend'] },
    { label: 'Deploy', ids: ['deployment'] },
    { label: 'Portfolio', ids: ['portfolio'] }
  ];
  const values = groups.map(group => Math.round(group.ids.reduce((sum, id) => sum + stageScore(id), 0) / group.ids.length));
  const size = 430;
  const center = size / 2;
  const radius = 150;
  const point = (index, value = 100) => {
    const angle = -Math.PI / 2 + index * (Math.PI * 2 / groups.length);
    const r = radius * value / 100;
    return [center + Math.cos(angle) * r, center + Math.sin(angle) * r];
  };
  const rings = [20,40,60,80,100].map(level => `<polygon class="radar-grid" points="${groups.map((_, index) => point(index, level).join(',')).join(' ')}"></polygon>`).join('');
  const axes = groups.map((_, index) => { const [x,y] = point(index); return `<line class="radar-axis" x1="${center}" y1="${center}" x2="${x}" y2="${y}"></line>`; }).join('');
  const polygon = groups.map((_, index) => point(index, values[index]).join(',')).join(' ');
  const labels = groups.map((group, index) => {
    const [x,y] = point(index, 119);
    const anchor = x < center - 10 ? 'end' : x > center + 10 ? 'start' : 'middle';
    return `<text class="radar-label" x="${x}" y="${y}" text-anchor="${anchor}">${group.label}</text><text class="radar-value" x="${x}" y="${y + 14}" text-anchor="${anchor}">${values[index]}</text>`;
  }).join('');
  $('#skillRadar').innerHTML = `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Радар навыков AI Engineer">${rings}${axes}<polygon class="radar-shape" points="${polygon}"></polygon>${labels}</svg>`;
}

function renderHistory() {
  $$('.filter-btn').forEach(button => button.classList.toggle('active', button.dataset.historyFilter === historyFilter));
  const events = state.history.filter(event => historyFilter === 'all' || event.type === historyFilter);
  if (!events.length) {
    $('#historyTimeline').innerHTML = '<div class="empty-state">По выбранному фильтру событий пока нет.</div>';
    return;
  }
  const groups = new Map();
  for (const event of events) {
    const key = dateKey(event.timestamp);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(event);
  }
  $('#historyTimeline').innerHTML = [...groups.entries()].map(([key, dayEvents]) => `<section class="timeline-day">
    <div class="timeline-date">${formatDayLabel(key)}</div>
    ${dayEvents.map(event => `<article class="timeline-item">
      <span class="timeline-item-icon">${historyIcon(event.type)}</span>
      <div><h3>${escapeHtml(event.title)}</h3><p>${escapeHtml(event.detail || '')}${event.minutes ? ` · ${event.minutes} мин` : ''}${event.score !== undefined ? ` · ${event.score}%` : ''}${event.xp ? ` · +${event.xp} XP` : ''}</p></div>
      <time datetime="${event.timestamp}">${formatTime(event.timestamp)}</time>
    </article>`).join('')}
  </section>`).join('');
}

function historyIcon(type) {
  return ({ topic: '◉', practice: '⌁', assessment: '✓', project: '▣', backup: '▤', reward: '✦', achievement: '🏅' })[type] || '•';
}

function renderProjects() {
  $('#projectsGrid').innerHTML = PROJECTS.map((projectItem, index) => {
    const data = projectState(projectItem.id);
    const done = Object.values(data.criteria).filter(Boolean).length;
    const percent = Math.round(done / projectItem.criteria.length * 100);
    return `<article class="card project-card">
      <span class="project-number">${String(index + 1).padStart(2, '0')}</span>
      <p class="eyebrow">${projectStatusLabel(data.status).toUpperCase()}</p>
      <h2>${escapeHtml(projectItem.title)}</h2>
      <p>${escapeHtml(projectItem.description)}</p>
      <div class="project-skills">${projectItem.skills.map(skill => `<span class="skill-chip">${escapeHtml(skill)}</span>`).join('')}</div>
      <div class="project-progress"><div class="project-progress-head"><span>Критерии готовности</span><b>${done}/${projectItem.criteria.length}</b></div><div class="progress-track"><span style="width:${percent}%"></span></div></div>
      <footer><span class="status-badge ${projectStatusClass(data.status)}">${projectStatusLabel(data.status)}</span><button class="btn btn-secondary full" type="button" data-open-project="${projectItem.id}">${data.status === 'not_started' ? 'Начать проект' : 'Открыть карточку'}</button></footer>
    </article>`;
  }).join('');
}

function projectStatusLabel(status) {
  return ({ not_started: 'Не начат', building: 'В разработке', review: 'На проверке', complete: 'Завершён' })[status] || 'Не начат';
}

function projectStatusClass(status) {
  return ({ not_started: 'status-not_started', building: 'status-learning', review: 'status-review', complete: 'status-mastered' })[status] || 'status-not_started';
}

