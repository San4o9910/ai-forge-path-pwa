const ROADMAP = [
  {
    id: 'python', title: 'Python', subtitle: 'База языка без лишней академичности', hours: 18,
    outcome: 'Сможешь написать небольшую программу, работать с файлами, разбивать код на модули и понимать чужие Python-скрипты.',
    topics: [
      topic('python-basics','Переменные и типы данных','Строки, числа, списки, словари и логические значения.','Создай карточку AI-проекта в виде словаря и выведи её поля.',35),
      topic('python-control','Циклы и условия','Как автоматизировать повторяющиеся действия и принимать решения в коде.','Обработай список задач и выведи только незавершённые.',45),
      topic('python-functions','Функции','Повторно используемые блоки кода с понятными входами и результатом.','Напиши функцию расчёта стоимости токенов.',45),
      topic('python-oop','Объектно-ориентированное программирование','Классы и объекты на практическом уровне: когда они реально полезны.','Создай класс Agent с именем, ролью и методом execute().',60),
      topic('python-errors','Обработка ошибок','Как программа переживает неправильный ввод, сбои сети и отсутствующие файлы.','Добавь try/except в загрузчик конфигурации.',35),
      topic('python-files','Работа с файлами','Чтение и запись JSON, TXT и CSV.','Сохрани историю диалога в JSON и загрузи её обратно.',45),
      topic('python-modules','Модули и пакеты','Структура проекта, import, виртуальное окружение и зависимости.','Раздели мини-проект на main.py, config.py и utils.py.',55)
    ]
  },
  {
    id: 'libraries', title: 'Python-библиотеки', subtitle: 'Данные, графики и классический ML', hours: 16,
    outcome: 'Сможешь загрузить данные, очистить их, провести базовый анализ, визуализировать результат и обучить простую модель.',
    topics: [
      topic('numpy','NumPy','Быстрые числовые массивы и базовые вычисления.','Посчитай среднее, минимум и максимум массива метрик.',45),
      topic('pandas','Pandas','Табличные данные: фильтрация, группировка, пропуски и объединение.','Проанализируй CSV с обращениями клиентов.',90),
      topic('matplotlib','Matplotlib','Понятные графики для анализа и отчётов.','Построй график количества запросов по дням.',50),
      topic('sklearn','Scikit-learn','Подготовка данных, обучение, оценка и сохранение ML-модели.','Собери простой классификатор обращений.',120)
    ]
  },
  {
    id: 'fundamentals', title: 'Основы AI', subtitle: 'Понять карту местности', hours: 12,
    outcome: 'Будешь понимать разницу между AI, ML, Deep Learning, нейросетями, генеративным AI и LLM — без путаницы в терминах.',
    topics: [
      topic('ai','Artificial Intelligence','Общее поле систем, выполняющих интеллектуальные задачи.','Определи, где в твоих процессах нужен AI, а где достаточно правил.',35),
      topic('ml','Machine Learning','Модели, которые находят закономерности в данных.','Сформулируй признаки и целевое значение для задачи классификации.',45),
      topic('dl','Deep Learning','Многослойные нейросети и задачи, где они особенно сильны.','Сравни ML и DL для распознавания изображений.',40),
      topic('nn','Нейронные сети','Слои, веса, обучение и функция ошибки простыми словами.','Нарисуй схему вход → слои → выход для простой сети.',50),
      topic('genai','Generative AI','Модели, создающие текст, изображения, аудио и код.','Выбери 3 бизнес-задачи для генеративного AI.',35),
      topic('llm-intro','Large Language Models','Что умеют LLM, почему ошибаются и как их правильно использовать.','Составь таблицу: задача → риск → способ проверки результата.',50)
    ]
  },
  {
    id: 'prompting', title: 'Prompt Engineering', subtitle: 'Управлять моделью через контекст и структуру', hours: 8,
    outcome: 'Сможешь получать более стабильный результат от LLM и создавать повторно используемые промпты под реальные процессы.',
    topics: [
      topic('zero-shot','Zero-shot prompting','Задача без примеров: когда этого достаточно.','Напиши промпт для классификации входящего обращения.',30),
      topic('one-shot','One-shot prompting','Один хороший пример, задающий формат ответа.','Добавь эталонный пример к классификатору.',30),
      topic('few-shot','Few-shot prompting','Несколько примеров для сложной логики и граничных случаев.','Подготовь 4 примера для разных типов обращений.',40),
      topic('role','Role prompting','Роль, цель, ограничения и критерии качества.','Создай системный промпт аудитора AI-ответов.',35),
      topic('reasoning','Структурированное рассуждение','Просить модель проверять шаги и давать краткое обоснование без слепого доверия.','Добавь план, проверку ограничений и финальный формат.',45)
    ]
  },
  {
    id: 'llm', title: 'Как работают LLM', subtitle: 'Главные параметры без математики ради математики', hours: 10,
    outcome: 'Сможешь осознанно выбирать модель, управлять длиной контекста, стоимостью, случайностью и качеством ответа.',
    topics: [
      topic('tokens','Токенизация','Как текст превращается в части и почему это влияет на цену и лимиты.','Оцени токены для короткого документа и истории чата.',40),
      topic('embeddings','Embeddings','Числовое представление смысла текста.','Собери 10 фраз и мысленно сгруппируй их по смыслу.',50),
      topic('context','Контекстное окно','Что модель реально видит в одном запросе и как не засорять контекст.','Сократи длинный контекст до фактов, правил и текущей задачи.',40),
      topic('temperature','Temperature','Как управлять предсказуемостью и разнообразием ответа.','Подбери температуру для аудита, идей и извлечения данных.',30),
      topic('parameters','Параметры модели','Размер, стоимость, скорость, reasoning и качество.','Составь матрицу выбора модели для 5 типов задач.',45)
    ]
  },
  {
    id: 'rag', title: 'RAG', subtitle: 'Ответы модели на основе своих документов', hours: 18,
    outcome: 'Соберёшь систему, которая ищет нужные фрагменты в документах и передаёт их модели для ответа с опорой на источники.',
    topics: [
      topic('rag-embeddings','Embeddings для поиска','Как сравнивать смысл запроса и документов.','Преобразуй описание задачи в поисковый запрос.',50),
      topic('chunking','Chunking','Как делить документы так, чтобы не потерять смысл.','Раздели инструкцию на логические фрагменты с заголовками.',60),
      topic('vector-db','Vector Databases','Хранение векторов и метаданных для быстрого поиска.','Спроектируй поля записи: text, source, section, date.',60),
      topic('similarity','Similarity Search','Поиск ближайших по смыслу фрагментов и фильтрация.','Определи top-k и фильтры для базы документов.',55),
      topic('rag-pipeline','Retrieval Pipeline','Полный путь: запрос → поиск → контекст → ответ → ссылки.','Нарисуй и реализуй минимальный RAG-пайплайн.',120)
    ]
  },
  {
    id: 'agents', title: 'AI Agents', subtitle: 'LLM, которая умеет планировать и использовать инструменты', hours: 18,
    outcome: 'Сможешь спроектировать агента с ролью, состоянием, памятью, инструментами и контролем выполнения.',
    topics: [
      topic('agent-architecture','Архитектура агента','Цель, модель, состояние, цикл действий и критерий остановки.','Спроектируй агента обработки нового заказа.',60),
      topic('memory','Память','Краткосрочная, долговременная и внешняя память без перегрузки контекста.','Раздели данные на текущую сессию, профиль и историю.',60),
      topic('planning','Планирование','Разбиение цели на шаги и контроль выполнения.','Составь план агента от запроса до готового отчёта.',50),
      topic('tools','Tool Calling','Безопасный вызов API, функций, поиска и базы данных.','Опиши schema инструмента create_task и правила его вызова.',70),
      topic('multi-agent','Multi-Agent Systems','Когда нужны несколько ролей и как избежать хаоса.','Спроектируй связку координатор → исполнитель → аудитор.',90)
    ]
  },
  {
    id: 'frameworks', title: 'AI-фреймворки', subtitle: 'Изучать после понимания базовых принципов', hours: 16,
    outcome: 'Сможешь выбрать инструмент под задачу, а не строить систему вокруг модного фреймворка.',
    topics: [
      topic('langchain','LangChain','Компоненты для промптов, моделей, инструментов и RAG.','Собери минимальную цепочку запрос → модель → parser.',70),
      topic('langgraph','LangGraph','Граф состояний для управляемых агентных процессов.','Создай граф: планирование → действие → проверка.',100),
      topic('llamaindex','LlamaIndex','Индексация данных и RAG-приложения.','Подключи папку документов и сделай поиск.',80),
      topic('crewai','CrewAI','Ролевые команды агентов для понятных сценариев.','Собери команду researcher + writer + reviewer.',80)
    ]
  },
  {
    id: 'backend', title: 'Backend', subtitle: 'Превратить прототип в приложение', hours: 20,
    outcome: 'Сможешь открыть функции AI-системы через API, подключить базу, пользователей и безопасную авторизацию.',
    topics: [
      topic('fastapi','FastAPI','Современный Python backend с автоматической документацией.','Создай endpoint /chat с валидацией входа.',100),
      topic('rest','REST APIs','Методы, статусы, маршруты, JSON и версия API.','Спроектируй API для документов и диалогов.',70),
      topic('auth','Authentication','Пользователи, токены, права доступа и базовая безопасность.','Добавь регистрацию и JWT-аутентификацию.',100),
      topic('database','Database Integration','PostgreSQL/SQLite, модели, миграции и запросы.','Сохраняй пользователей, чаты и сообщения.',120)
    ]
  },
  {
    id: 'deployment', title: 'Деплой', subtitle: 'Запустить и наблюдать систему', hours: 18,
    outcome: 'Сможешь упаковать приложение, опубликовать его, хранить код в Git и понимать причины сбоев.',
    topics: [
      topic('docker','Docker','Одинаковое окружение для разработки и сервера.','Создай Dockerfile и docker-compose для API и базы.',100),
      topic('git','Git и GitHub','Версии кода, ветки, commits, pull requests и CI.','Опубликуй проект с понятным README.',90),
      topic('cloud','Cloud Platforms','Базовый деплой на AWS, Azure или GCP без привязки ко всему сразу.','Разверни API и настрой переменные окружения.',120),
      topic('monitoring','Monitoring & Logging','Логи, ошибки, метрики, задержка и стоимость LLM.','Добавь структурированные логи и health endpoint.',80)
    ]
  },
  {
    id: 'portfolio', title: 'Проекты', subtitle: 'Собрать доказательства навыков', hours: 60,
    outcome: 'Закончишь обучение с шестью проектами, понятным GitHub-портфолио и опытом полного цикла разработки.',
    topics: [
      topic('project-chatbot','AI Chatbot','Диалог, история, системный промпт и потоковый ответ.','Собери рабочий чат с сохранением истории.',240),
      topic('project-pdf','PDF Chat Assistant','Загрузка PDF, chunking, embeddings, поиск и ссылки.','Собери ассистента по документам.',360),
      topic('project-research','AI Research Assistant','План исследования, поиск, сбор фактов и отчёт.','Создай исследовательский пайплайн с проверкой источников.',360),
      topic('project-resume','AI Resume Analyzer','Извлечение данных, оценка соответствия и рекомендации.','Сравни резюме с вакансией по критериям.',300),
      topic('project-support','Customer Support Agent','Классификация, база знаний, инструменты и эскалация.','Собери агента поддержки с передачей человеку.',420),
      topic('project-coding','AI Coding Assistant','Контекст проекта, инструменты, патчи и проверка результата.','Собери ассистента для небольшого репозитория.',480)
    ]
  }
];

const PROJECTS = [
  project('chatbot','AI Chatbot','Первое полноценное приложение: чат, история сообщений, системный промпт и аккуратная обработка ошибок.',['Python','LLM API','FastAPI','UI'],['Диалог работает','История сохраняется','Есть README','Проект развёрнут']),
  project('pdf','PDF Chat Assistant','RAG-система, отвечающая по загруженным документам и показывающая, откуда взят ответ.',['RAG','Embeddings','Vector DB','Chunking'],['PDF загружается','Поиск релевантен','Ответ содержит источники','Есть тестовый набор']),
  project('research','AI Research Assistant','Агент формирует план, собирает факты, сравнивает источники и готовит структурированный отчёт.',['Agents','Tool Calling','Search','Evaluation'],['Есть план исследования','Факты отделены от выводов','Источники проверяются','Отчёт экспортируется']),
  project('resume','AI Resume Analyzer','Сравнивает резюме с вакансией, объясняет пробелы и предлагает конкретные улучшения.',['Structured Output','NLP','Scoring','API'],['Извлекает навыки','Считает соответствие','Объясняет оценку','Не выдумывает опыт']),
  project('support','Customer Support Agent','Работает с базой знаний, создаёт действия через инструменты и передаёт сложные случаи человеку.',['Agents','RAG','Tools','Auth'],['Классифицирует запрос','Ищет в базе знаний','Есть эскалация','Действия логируются']),
  project('coding','AI Coding Assistant','Читает структуру проекта, предлагает изменения, создаёт патч и запускает проверки.',['Agents','Git','Tool Calling','Testing'],['Понимает репозиторий','Создаёт минимальный patch','Запускает тесты','Показывает риски'])
];

const QUIZ = [
  quiz('python','Что лучше использовать для хранения пары «ключ → значение»?',['Список','Словарь','Кортеж','Строку'],1,'Словарь хранит данные как пары ключей и значений.'),
  quiz('libraries','Для чего чаще всего используют Pandas?',['Для работы с таблицами','Для деплоя','Для авторизации','Для создания Docker-образов'],0,'Pandas предназначен прежде всего для загрузки, очистки и анализа табличных данных.'),
  quiz('fundamentals','Чем Generative AI отличается от обычной классификации?',['Всегда работает без данных','Создаёт новый контент','Не использует модели','Работает только с числами'],1,'Генеративные модели создают текст, изображения, код и другой новый контент.'),
  quiz('prompting','Когда few-shot особенно полезен?',['Когда нужен стабильный формат и есть граничные случаи','Когда интернет отключён','Когда модель не принимает текст','Только для перевода'],0,'Несколько примеров помогают модели понять формат, логику и нестандартные случаи.'),
  quiz('llm','Что означает контекстное окно?',['Скорость интернета','Объём текста, который модель видит в запросе','Размер базы данных','Количество пользователей'],1,'Контекстное окно ограничивает объём входных данных и истории, доступных модели за один вызов.'),
  quiz('rag','Зачем нужен chunking?',['Чтобы разбить документы на удобные для поиска фрагменты','Чтобы уменьшить экран','Чтобы создать пароль','Чтобы обучить браузер'],0,'Правильные фрагменты повышают точность поиска и сохраняют смысл.'),
  quiz('agents','Что отличает агента от обычного одиночного запроса к LLM?',['Он может планировать и вызывать инструменты','Он всегда бесплатный','Он не использует промпты','Он обязательно состоит из 10 моделей'],0,'Агент выполняет цикл: оценивает состояние, выбирает действие, вызывает инструмент и проверяет результат.'),
  quiz('frameworks','Когда стоит изучать LangGraph?',['После понимания состояния, шагов и tool calling','До Python','Вместо понимания архитектуры','Только для графиков'],0,'Фреймворк проще использовать осознанно, когда понятны базовые принципы агентного процесса.'),
  quiz('backend','Что делает FastAPI?',['Создаёт Python API','Обучает нейросеть без кода','Хранит векторы','Заменяет Git'],0,'FastAPI позволяет быстро создавать HTTP API с валидацией и документацией.'),
  quiz('deployment','Для чего нужен Docker?',['Упаковать приложение и зависимости в воспроизводимое окружение','Увеличить контекст LLM','Создать embeddings','Написать промпт'],0,'Контейнер помогает запускать приложение одинаково локально и на сервере.'),
  quiz('portfolio','Что сильнее всего доказывает навык AI Engineer?',['Список просмотренных курсов','Работающий проект с кодом, README и деплоем','Количество сохранённых ссылок','Знание названий всех фреймворков'],1,'Законченный проект показывает, что ты умеешь соединять компоненты в рабочую систему.')
];

function topic(id,title,summary,practice,minutes){ return {id,title,summary,practice,minutes}; }
function project(id,title,description,skills,criteria){ return {id,title,description,skills,criteria}; }
function quiz(stage,question,answers,correct,explanation){ return {stage,question,answers,correct,explanation}; }


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

function visualForStage(stageId){ return `assets/infographics/${STAGE_VISUALS[stageId] || 'projects'}.svg`; }

const DEFAULT_STATE = {
  completedTopics: {}, completedProjects: {}, notes: {}, dailyPlans: {}, activityDates: [], practiceMinutes: 0,
  settings: { weeklyHours: 10, sessionLength: 45, learningGoal: 'builder', mode: 'project' },
  theme: 'dark', quizIndex: 0, quizAnswers: {}
};

let state = loadState();
let deferredPrompt = null;
let timerSeconds = state.settings.sessionLength * 60;
let timerHandle = null;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

function loadState(){
  try { return deepMerge(structuredClone(DEFAULT_STATE), JSON.parse(localStorage.getItem('ai-forge-path-state') || '{}')); }
  catch { return structuredClone(DEFAULT_STATE); }
}
function deepMerge(base, extra){
  for (const [key,value] of Object.entries(extra || {})) {
    if (value && typeof value === 'object' && !Array.isArray(value)) base[key] = deepMerge(base[key] || {}, value);
    else base[key] = value;
  }
  return base;
}
function saveState(){ localStorage.setItem('ai-forge-path-state', JSON.stringify(state)); }
function allTopics(){ return ROADMAP.flatMap(stage => stage.topics.map(t => ({...t, stageId: stage.id, stageTitle: stage.title}))); }
function completedCount(){ return Object.values(state.completedTopics).filter(Boolean).length; }
function progressPercent(){ return Math.round((completedCount() / allTopics().length) * 100); }
function todayKey(){ return new Date().toISOString().slice(0,10); }
function recordActivity(minutes = 0){
  const today = todayKey();
  if (!state.activityDates.includes(today)) state.activityDates.push(today);
  if (minutes) state.practiceMinutes += minutes;
  saveState();
}
function calcStreak(){
  const dates = new Set(state.activityDates);
  let streak = 0;
  const cursor = new Date();
  if (!dates.has(cursor.toISOString().slice(0,10))) cursor.setDate(cursor.getDate()-1);
  while (dates.has(cursor.toISOString().slice(0,10))) {
    streak++;
    cursor.setDate(cursor.getDate()-1);
  }
  return streak;
}

function render(){
  document.documentElement.dataset.theme = 'dark';
  renderDashboard(); renderRoadmap(); renderProjects(); renderQuiz(); renderNotes(); renderSettings(); updateModeButtons();
}

function renderDashboard(){
  const percent = progressPercent();
  const streak = calcStreak();
  const totalHours = ROADMAP.reduce((sum, stage) => sum + stage.hours, 0);
  const remainingHours = Math.max(0, totalHours - Math.round(state.practiceMinutes / 60));
  const weeks = Math.ceil(remainingHours / Math.max(1, state.settings.weeklyHours));

  $('#overallProgress').textContent = `${percent}%`;
  $('#orbitProgress').style.strokeDashoffset = 314.16 * (1 - percent / 100);
  $('#progressStatValue').textContent = `${percent}%`;
  $('#remainingHoursValue').textContent = `≈ ${remainingHours} ч`;
  $('#streakValue').textContent = `${streak} дней`;
  $('#topStreakValue').textContent = streak;
  $('#weeklyPaceValue').textContent = `${state.settings.weeklyHours} ч/нед`;
  $('#paceEstimate').textContent = remainingHours ? `Ориентир: около ${weeks} недель при ${state.settings.weeklyHours} ч/нед.` : 'Основной маршрут завершён — усиливай портфолио.';

  const next = getNextTopic();
  $('#nextTopicTitle').textContent = next ? next.title : 'Роадмап завершён';
  $('#nextTopicSummary').textContent = next ? next.summary : 'Пора улучшать портфолио и собирать более сложные системы.';
  $('#nextTopicStage').textContent = next ? next.stageTitle : 'Готово';
  $('#nextTopicEstimate').textContent = next ? `≈ ${next.minutes} мин` : '';
  $('#nextTopicBtn').disabled = !next;
  $('#nextTopicBtn').dataset.topicId = next?.id || '';
  $('#nextTopicImage').src = visualForStage(next?.stageId || 'portfolio');
  $('#nextTopicImage').alt = next ? `Инфографика этапа ${next.stageTitle}` : 'Инфографика завершённого маршрута';
  renderTodayPlan();
}

function getNextTopic(){
  const topics = allTopics();
  if (state.settings.mode === 'project') {
    const projectFirst = ['python-basics','python-functions','python-files','zero-shot','llm-intro','tokens','embeddings','rag-pipeline','agent-architecture','tools','fastapi','rest','docker','git'];
    const ordered = [...projectFirst.map(id => topics.find(t => t.id === id)).filter(Boolean), ...topics.filter(t => !projectFirst.includes(t.id))];
    return ordered.find(t => !state.completedTopics[t.id]);
  }
  return topics.find(t => !state.completedTopics[t.id]);
}

function getTodayPlan(){
  const key = todayKey();
  if (state.dailyPlans[key]) return state.dailyPlans[key];
  const next = getNextTopic();
  if (!next) return [];
  const length = Number(state.settings.sessionLength);
  const plan = [
    { id:`${key}-learn`, kind:'РАЗОБРАТЬСЯ', title: next.title, text: next.summary, minutes: Math.min(25,length), done:false, topicId:next.id },
    { id:`${key}-practice`, kind:'СДЕЛАТЬ РУКАМИ', title:'Мини-практика', text: next.practice, minutes: Math.max(20, length - 15), done:false, topicId:next.id },
    { id:`${key}-review`, kind:'ЗАКРЕПИТЬ', title:'Записать главный вывод', text:'Открой тему, оставь 2–3 предложения своими словами и отметь, что осталось непонятным.', minutes:10, done:false, topicId:next.id }
  ];
  state.dailyPlans[key] = plan; saveState(); return plan;
}

function renderTodayPlan(){
  const plan = getTodayPlan();
  const done = plan.filter(task => task.done).length;
  const minutes = plan.reduce((sum, task) => sum + task.minutes, 0);
  $('#todayMinutesValue').textContent = minutes;
  $('#todayStepsValue').textContent = plan.length;
  $('#todayDoneValue').textContent = `${done}/${plan.length || 0}`;
  $('#todayPlan').innerHTML = plan.length ? plan.map((task,index) => `
    <article class="task-card ${task.done ? 'completed' : ''}">
      <span class="task-number">${index+1}</span>
      <div class="task-copy"><span class="task-kind">${task.kind}</span><h3>${task.title}</h3><p>${task.text}</p></div>
      <div class="task-meta"><strong>${task.minutes} мин</strong><span>${task.done ? 'готово' : 'не начато'}</span></div>
      <button class="check-btn" data-task-id="${task.id}" aria-label="${task.done ? 'Вернуть задачу в работу' : 'Отметить задачу выполненной'}">${task.done?'✓':''}</button>
    </article>`).join('') : '<div class="empty-state">Все темы завершены. Выбери проект и улучши его до уровня портфолио.</div>';
  $$('.check-btn').forEach(btn => btn.addEventListener('click', () => toggleDailyTask(btn.dataset.taskId)));
}

function toggleDailyTask(id){
  const plan = state.dailyPlans[todayKey()] || [];
  const task = plan.find(t => t.id === id); if (!task) return;
  task.done = !task.done;
  if (task.done) recordActivity(task.minutes); else { state.practiceMinutes = Math.max(0, state.practiceMinutes - task.minutes); saveState(); }
  renderDashboard(); toast(task.done ? 'Задача выполнена' : 'Отметка снята');
}

function refreshPlan(){ delete state.dailyPlans[todayKey()]; saveState(); renderDashboard(); toast('План на сегодня обновлён'); }

function renderRoadmap(){
  $('#roadmapList').innerHTML = ROADMAP.map((stage,index) => {
    const done = stage.topics.filter(t => state.completedTopics[t.id]).length;
    const pct = Math.round(done / stage.topics.length * 100);
    const visual = visualForStage(stage.id);
    return `<article class="stage-card ${index===0?'open':''}" data-stage-id="${stage.id}">
      <button class="stage-header" type="button" aria-expanded="${index===0?'true':'false'}">
        <span class="stage-number">${index+1}</span>
        <span class="stage-thumb"><img src="${visual}" alt="" /></span>
        <span class="stage-title"><h2>${stage.title}</h2><p>${stage.subtitle}</p></span>
        <span class="stage-progress"><strong>${pct}%</strong><span>${done}/${stage.topics.length} тем</span></span>
        <span class="stage-chevron">⌄</span>
      </button>
      <div class="stage-body">
        <div class="stage-visual">
          <img src="${visual}" alt="Визуальная схема этапа ${stage.title}" />
          <div class="outcome"><strong>Что получится после этапа</strong>${stage.outcome}<div class="stage-progress-bar" aria-label="Прогресс этапа ${pct}%"><span style="width:${pct}%"></span></div></div>
        </div>
        <div class="topic-list">${stage.topics.map(t => `<div class="topic-row ${state.completedTopics[t.id]?'done':''}" data-topic-id="${t.id}" role="button" tabindex="0">
          <span class="topic-check">${state.completedTopics[t.id]?'✓':''}</span>
          <span><span class="topic-name">${t.title}</span><span class="topic-desc">${t.summary}</span></span>
          <span class="topic-time">≈ ${t.minutes} мин</span>
        </div>`).join('')}</div>
      </div>
    </article>`;
  }).join('');
  $$('.stage-header').forEach(h => h.addEventListener('click', () => {
    const card = h.closest('.stage-card');
    card.classList.toggle('open');
    h.setAttribute('aria-expanded', String(card.classList.contains('open')));
  }));
  $$('.topic-row').forEach(row => {
    row.addEventListener('click', () => openTopic(row.dataset.topicId));
    row.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openTopic(row.dataset.topicId); } });
  });
}

function openTopic(id){
  const item = allTopics().find(t => t.id === id); if (!item) return;
  $('#topicDialogContent').innerHTML = `<div class="dialog-content">
    <figure class="dialog-visual"><img src="${visualForStage(item.stageId)}" alt="Визуальная схема: ${item.stageTitle}" /></figure>
    <p class="eyebrow">${item.stageTitle.toUpperCase()} · ≈ ${item.minutes} МИН</p>
    <h2>${item.title}</h2>
    <p class="muted">${item.summary}</p>
    <section class="dialog-section"><h3>Главная идея</h3><p>${topicExplanation(item.id)}</p></section>
    <section class="dialog-section practice-box"><h3>Сделай руками</h3><p>${item.practice}</p></section>
    <section class="dialog-section"><h3>Объясни своими словами</h3><textarea id="topicNotes" class="topic-notes" placeholder="Что ты понял? Где это пригодится? Что осталось непонятным?">${escapeHtml(state.notes[item.id] || '')}</textarea></section>
    <div class="dialog-actions">
      <button id="saveNoteBtn" class="btn btn-secondary" type="button">Сохранить заметку</button>
      <button id="completeTopicBtn" class="btn btn-primary" type="button">${state.completedTopics[item.id]?'Вернуть в работу':'Тема пройдена'}</button>
    </div>
  </div>`;
  $('#saveNoteBtn').addEventListener('click', () => { state.notes[item.id] = $('#topicNotes').value.trim(); saveState(); renderNotes(); toast('Заметка сохранена'); });
  $('#completeTopicBtn').addEventListener('click', () => { toggleTopic(item.id, item.minutes); $('#topicDialog').close(); });
  $('#topicDialog').showModal();
}

function topicExplanation(id){
  const map = {
    'python-basics':'Начни с простого: переменная — это имя для значения. Список хранит набор элементов, словарь — пары «ключ: значение». Для AI-приложений особенно часто встречаются строки, списки, словари и JSON.',
    'python-functions':'Функция получает входные данные, выполняет одну понятную задачу и возвращает результат. Хорошая функция небольшая, предсказуемая и называется по действию.',
    'embeddings':'Embedding превращает смысл текста в набор чисел. Похожие по смыслу тексты получают близкие векторы, поэтому их можно находить даже без совпадения точных слов.',
    'rag-pipeline':'RAG не обучает модель на твоих документах. Он сначала находит подходящие фрагменты, затем добавляет их в запрос модели. Качество зависит от chunking, поиска и правил ответа.',
    'agent-architecture':'Агент — это не просто чат. У него есть цель, текущее состояние, доступные действия и цикл: подумать → выбрать инструмент → получить результат → решить, что делать дальше.',
    'tools':'Tool calling означает, что модель не выполняет действие сама. Она формирует структурированный запрос, а твой код проверяет его и вызывает реальную функцию или API.',
    'fastapi':'FastAPI принимает HTTP-запрос, проверяет данные, вызывает Python-логику и возвращает JSON. Это мост между AI-функцией и интерфейсом, ботом или другим сервисом.',
    'docker':'Docker описывает окружение приложения: системные пакеты, Python, зависимости и команду запуска. Это уменьшает ситуацию «у меня работает, а на сервере нет».',
  };
  return map[id] || 'Разбери идею на трёх уровнях: что это такое, зачем это нужно в приложении и какой минимальный пример ты можешь сделать своими руками. Не пытайся запомнить всё — добейся понимания причин и результата.';
}

function toggleTopic(id, minutes){
  state.completedTopics[id] = !state.completedTopics[id];
  if (state.completedTopics[id]) recordActivity(minutes); else { state.practiceMinutes = Math.max(0, state.practiceMinutes - minutes); saveState(); }
  render(); toast(state.completedTopics[id] ? 'Тема отмечена как пройденная' : 'Тема возвращена в работу');
}

function renderProjects(){
  $('#projectsGrid').innerHTML = PROJECTS.map((p,i) => `<article class="card project-card ${state.completedProjects[p.id]?'complete':''}">
    <span class="project-number">${String(i+1).padStart(2,'0')}</span>
    <p class="eyebrow">ПРОЕКТ ${i+1}</p><h2>${p.title}</h2><p>${p.description}</p>
    <div class="skills">${p.skills.map(s=>`<span class="skill-chip">${s}</span>`).join('')}</div>
    <details><summary>Критерии готовности</summary><ul>${p.criteria.map(c=>`<li>${c}</li>`).join('')}</ul></details>
    <footer><button class="btn ${state.completedProjects[p.id]?'btn-secondary':'btn-primary'} full project-toggle" data-project-id="${p.id}" type="button">${state.completedProjects[p.id]?'Вернуть в работу':'Проект завершён'}</button></footer>
  </article>`).join('');
  $$('.project-toggle').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.projectId; state.completedProjects[id] = !state.completedProjects[id];
    if (state.completedProjects[id]) recordActivity(60); else { state.practiceMinutes = Math.max(0, state.practiceMinutes - 60); saveState(); } render();
  }));
}

function renderQuiz(){
  const q = QUIZ[state.quizIndex % QUIZ.length]; const selected = state.quizAnswers[state.quizIndex];
  $('#quizCard').innerHTML = `<p class="eyebrow">ВОПРОС ${state.quizIndex+1} ИЗ ${QUIZ.length}</p><h3>${q.question}</h3>
    <div class="answer-list">${q.answers.map((a,i)=>`<button class="answer-btn ${selected!==undefined ? (i===q.correct?'correct':i===selected?'wrong':'') : ''}" data-answer="${i}" ${selected!==undefined?'disabled':''}>${a}</button>`).join('')}</div>
    ${selected!==undefined?`<div class="quiz-feedback"><strong>${selected===q.correct?'Верно.':'Не совсем.'}</strong> ${q.explanation}</div><button id="nextQuizBtn" class="btn btn-primary" style="margin-top:14px">Следующий вопрос</button>`:''}`;
  $$('.answer-btn').forEach(btn => btn.addEventListener('click', () => { state.quizAnswers[state.quizIndex] = Number(btn.dataset.answer); recordActivity(5); renderQuiz(); }));
  $('#nextQuizBtn')?.addEventListener('click', () => { state.quizIndex = (state.quizIndex + 1) % QUIZ.length; saveState(); renderQuiz(); });
}

function renderNotes(){
  const notes = Object.entries(state.notes).filter(([,text])=>text.trim());
  $('#notesList').innerHTML = notes.length ? notes.map(([id,text]) => {
    const t = allTopics().find(x=>x.id===id); return `<div class="note-item"><strong>${t?.title || id}</strong><p>${escapeHtml(text)}</p></div>`;
  }).join('') : '<div class="empty-state">Пока заметок нет. Открой тему и запиши главный вывод своими словами.</div>';
}

function renderSettings(){
  $('#weeklyHours').value = state.settings.weeklyHours; $('#weeklyHoursValue').textContent = `${state.settings.weeklyHours} ч`;
  $('#sessionLength').value = state.settings.sessionLength; $('#learningGoal').value = state.settings.learningGoal;
}

function updateModeButtons(){ $$('.mode-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.mode===state.settings.mode)); }

function switchView(id){
  $$('.view').forEach(v => v.classList.toggle('active', v.id===id));
  $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view===id));
  window.scrollTo({top:0,behavior:'smooth'});
}

function setupEvents(){
  $$('.nav-btn').forEach(btn => btn.addEventListener('click', () => switchView(btn.dataset.view)));
  $$('[data-go-view]').forEach(btn => btn.addEventListener('click', () => switchView(btn.dataset.goView)));
  $$('[data-stage-open]').forEach(btn => btn.addEventListener('click', () => {
    switchView('roadmap');
    requestAnimationFrame(() => {
      const card = document.querySelector(`[data-stage-id="${btn.dataset.stageOpen}"]`);
      if (!card) return;
      card.classList.add('open');
      card.querySelector('.stage-header')?.setAttribute('aria-expanded','true');
      card.scrollIntoView({behavior:'smooth', block:'center'});
    });
  }));
  $$('.mode-btn').forEach(btn => btn.addEventListener('click', () => { state.settings.mode=btn.dataset.mode; saveState(); render(); }));
  $('#continueBtn').addEventListener('click', () => { const next=getNextTopic(); if(next) openTopic(next.id); else switchView('projects'); });
  $('#nextTopicBtn').addEventListener('click', e => openTopic(e.currentTarget.dataset.topicId));
  $('#refreshPlanBtn').addEventListener('click', refreshPlan);
  $('#openSettingsBtn').addEventListener('click', () => switchView('settings'));
  $('#weeklyHours').addEventListener('input', e => $('#weeklyHoursValue').textContent = `${e.target.value} ч`);
  $('#saveSettingsBtn').addEventListener('click', () => {
    state.settings.weeklyHours=Number($('#weeklyHours').value); state.settings.sessionLength=Number($('#sessionLength').value); state.settings.learningGoal=$('#learningGoal').value;
    timerSeconds=state.settings.sessionLength*60; saveState(); renderTimer(); render(); toast('Настройки сохранены');
  });
  $('#timerStartBtn').addEventListener('click', toggleTimer); $('#timerResetBtn').addEventListener('click', resetTimer);
  $('#exportBtn').addEventListener('click', exportProgress); $('#importInput').addEventListener('change', importProgress); $('#resetBtn').addEventListener('click', resetProgress);
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt=e; $('#installBtn').classList.remove('hidden'); });
  $('#installBtn').addEventListener('click', async () => { if(!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; $('#installBtn').classList.add('hidden'); });
}

function toggleTimer(){
  if (timerHandle) { clearInterval(timerHandle); timerHandle=null; $('#timerStartBtn').textContent='Продолжить'; return; }
  $('#timerStartBtn').textContent='Пауза';
  timerHandle=setInterval(()=>{ timerSeconds--; renderTimer(); if(timerSeconds<=0){ clearInterval(timerHandle); timerHandle=null; recordActivity(state.settings.sessionLength); toast('Фокус-сессия завершена'); resetTimer(); } },1000);
}
function resetTimer(){ if(timerHandle) clearInterval(timerHandle); timerHandle=null; timerSeconds=state.settings.sessionLength*60; $('#timerStartBtn').textContent='Старт'; renderTimer(); }
function renderTimer(){ const m=String(Math.floor(timerSeconds/60)).padStart(2,'0'); const s=String(timerSeconds%60).padStart(2,'0'); $('#timerDisplay').textContent=`${m}:${s}`; }

function exportProgress(){
  const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`ai-forge-path-progress-${todayKey()}.json`; a.click(); URL.revokeObjectURL(url);
}
function importProgress(e){
  const file=e.target.files?.[0]; if(!file) return; const reader=new FileReader();
  reader.onload=()=>{ try { state=deepMerge(structuredClone(DEFAULT_STATE),JSON.parse(reader.result)); saveState(); timerSeconds=state.settings.sessionLength*60; render(); renderTimer(); toast('Прогресс импортирован'); } catch { toast('Не удалось прочитать файл'); } };
  reader.readAsText(file); e.target.value='';
}
function resetProgress(){
  if (!confirm('Удалить весь прогресс, заметки и настройки?')) return;
  state=structuredClone(DEFAULT_STATE); state.theme='dark'; saveState(); timerSeconds=state.settings.sessionLength*60; render(); renderTimer(); toast('Прогресс сброшен');
}

function toast(message){ const el=$('#toast'); el.textContent=message; el.classList.add('show'); clearTimeout(toast.t); toast.t=setTimeout(()=>el.classList.remove('show'),1800); }
function escapeHtml(value=''){ return value.replace(/[&<>'"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(console.error));
setupEvents(); render(); renderTimer();
