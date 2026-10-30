# МЕЖДУ СТРОК — INTELLIGENCE LAYER v7

## Цель этой итерации

Не менять визуальный стиль и не перерабатывать landing.

Задача — сделать анализ значительно умнее, устойчивее и постепенно улучшаемым на реальных пользовательских данных.

После этой итерации система должна:

1. понимать свободный человеческий ввод;
2. исследовать весь набор предпочтений, а не первый очевидный кластер;
3. использовать evidence-informed knowledge base для построения гипотез;
4. различать гипотезу и факт;
5. находить связи между далёкими категориями через повторяющийся тип опыта;
6. не превращаться в personality test;
7. сохранять анонимизированные данные о сессиях и feedback для дальнейшего улучшения;
8. иметь набор regression-тестов на разных типах пользователей.

---

# 1. Ключевая концепция продукта

«Между строк» НЕ пытается определить личность человека по любимым вещам.

Основная рабочая гипотеза продукта:

**То, что человек выбирает как любимое, даёт информацию о типах опыта, которые имеют для него положительную ценность.**

Нужно искать:

**что именно человеку нравится в очень разных вещах.**

Не:

> Что общего между бегом и Linkin Park как объектами?

А:

> Какой тип переживания человек получает и в беге, и в Linkin Park?

Примеры возможных повторяющихся механизмов:

- телесная интенсивность;
- чувство мастерства;
- принадлежность;
- совместный опыт;
- новизна;
- исследование;
- эстетическое удовольствие;
- сенсорное удовольствие;
- ритуал;
- восстановление;
- масштаб;
- awe;
- автономия;
- непосредственное участие;
- эмоциональная интенсивность;
- смена состояния;
- чувство прогресса;
- близость;
- игра;
- соревнование;
- исследование неизвестного.

Это не готовые ответы.

Это внутренние аналитические координаты.

---

# 2. Positive orientation

Проект должен в первую очередь исследовать:

- что даёт человеку удовольствие;
- куда его тянет;
- какие состояния он ценит;
- какой опыт выбирает снова;
- что его заряжает;
- что даёт ощущение жизни, интереса, близости, силы или удовольствия.

Не искать:

- травмы;
- дефициты;
- комплексы;
- патологию;
- негативные черты;
- скрытые проблемы.

Но positive orientation НЕ означает автоматические комплименты.

Не писать:

> Ты невероятно сильный и глубокий человек.

Нужно говорить о выборе:

> В индивидуальных видах спорта здесь повторяется удовольствие от ситуации, где результат напрямую зависит от собственного усилия.

---

# 3. Не путать LIKING и WANTING

Не делать вывод:

> если человеку нравится X, он обязательно хочет стать X или обязательно стремится к этому.

Использовать более точную логику:

**предпочтение — сигнал того, что определённый тип опыта имеет положительную ценность для человека.**

Иногда это может указывать на стремление.

Но это гипотеза, а не автоматический факт.

---

# 4. Архитектура

Использовать:

```text
RAW INPUT
↓
PARSER
↓
STRUCTURED ITEMS
↓
ITEM INTERPRETATION
↓
PATTERN ANALYST
↓
CRITIC
↓
WRITER
↓
RESULT
↓
FEEDBACK
↓
ANONYMOUS RESEARCH LOG
```

---

# 5. ITEM INTERPRETATION — новый отдельный этап

После Parser не переходить сразу к поиску паттернов.

Для каждого item построить несколько **possible functions**.

Например:

```json
{
  "item_id": "item_4",
  "label": "бег",
  "possible_functions": [
    {
      "function": "movement",
      "confidence": 0.9
    },
    {
      "function": "mastery_progress",
      "confidence": 0.75
    },
    {
      "function": "autonomy",
      "confidence": 0.6
    },
    {
      "function": "state_regulation",
      "confidence": 0.55
    }
  ]
}
```

Не выбирать один смысл сразу.

Один item может иметь несколько возможных функций.

---

# 6. Confidence

Каждая интерпретация имеет confidence.

Пример:

`бег → движение`

high confidence.

`бег → дисциплина`

medium confidence.

`бег → выпустить злость`

low confidence без дополнительных данных.

Если пользователь написал:

> бег помогает мне выпустить злость

тогда confidence этой интерпретации становится high.

---

# 7. USER CONTEXT имеет максимальный приоритет

Если пользователь сам объяснил смысл:

> бокс — помогает выпустить накопившуюся энергию

не заменять его стандартной интерпретацией boxing.

`user_context` имеет больший вес, чем knowledge base.

---

# 8. Создать KNOWLEDGE BASE

Создать отдельный файл, например:

```text
knowledge/preference-functions.json
```

Knowledge base содержит не выводы о личности, а возможные функции разных типов выбора.

Пример структуры:

```json
{
  "running": {
    "possible_functions": [
      {
        "id": "movement",
        "confidence": "high"
      },
      {
        "id": "mastery_progress",
        "confidence": "medium"
      },
      {
        "id": "autonomy",
        "confidence": "medium"
      },
      {
        "id": "state_regulation",
        "confidence": "medium"
      }
    ],
    "avoid_defaulting_to": [
      "anger_release",
      "discipline_as_personality_trait"
    ]
  }
}
```

---

# 9. FUNCTION TAXONOMY

Создать отдельный:

```text
knowledge/functions.json
```

Начальный набор:

### embodied_intensity
Опыт сильно ощущается телом.

### movement
Удовольствие от движения как процесса.

### mastery_progress
Удовольствие от улучшения навыка и собственного прогресса.

### competence
Чувство «я могу это делать».

### autonomy
Самостоятельность действия и контроля.

### belonging
Чувство быть частью группы.

### shared_experience
Удовольствие от того, что переживание разделяется с другими.

### attachment
Близость и значимые отношения.

### sensory_pleasure
Вкус, звук, фактура, запах, физическое удовольствие.

### hedonism_savouring
Удовольствие имеет самостоятельную ценность; способность наслаждаться приятным опытом.

### novelty
Новое как источник интереса.

### exploration
Исследование места, темы или неизвестного.

### self_expansion
Расширение собственной картины мира через новые опыты.

### awe_scale
Притяжение к масштабу, vastness, чему-то существенно большему привычной рамки.

### restoration
Спокойствие, восстановление, снижение нагрузки.

### collective_energy
Энергия толпы или общего события.

### emotional_intensity
Сильное эмоциональное переживание.

### emotion_regulation
Музыка, движение или другой опыт помогает менять или удерживать эмоциональное состояние.

### aesthetic_pleasure
Визуальное или формальное удовольствие.

### ritual
Повторяемый опыт, которому важна форма и контекст.

### live_presence
Важно присутствовать непосредственно, а не получать опыт через экран или запись.

### competition
Интерес к соревнованию и сравнению результата.

### challenge
Удовольствие от задачи, требующей усилий.

### contemplation
Наблюдение, погружение, медленное внимание.

### play
Удовольствие от игры как процесса.

### meaning
Интерес к идеям, вопросам, смыслам.

Этот список расширяемый.

---

# 10. KNOWLEDGE BASE — SPORT

Начальные правила.

## RUNNING

High / medium candidates:

- movement;
- mastery_progress;
- autonomy;
- competence;
- challenge;
- state regulation;
- embodied experience.

Не использовать автоматически:

- anger release;
- aggression;
- extroversion;
- discipline as fixed personality trait.

---

## BOXING

Candidates:

- embodied_intensity;
- competence;
- mastery;
- strength experience;
- challenge;
- focus;
- physical expression;
- state regulation.

`anger_release` использовать только:

- если человек сам дал такой контекст;
- либо если эта функция подтверждается другими выборами.

Не сводить recreational boxing к:

- сопернику;
- рингу;
- победе;
- чтению другого человека.

---

## TEAM SPORTS

Например:

- футбол;
- волейбол;
- баскетбол;
- падел в паре;
- командные соревнования.

Candidates:

- belonging;
- coordination;
- shared_experience;
- collective_energy;
- competition;
- play;
- mastery.

Не писать автоматически:

> ты командный человек.

Сначала искать повторение этих функций в других выборах.

---

## INDIVIDUAL SPORTS

Candidates:

- autonomy;
- mastery_progress;
- competence;
- challenge;
- embodied_intensity;
- self-reliance.

Не писать автоматически:

> хочет доказать свою силу.

---

# 11. FOOD / DRINK

Еда — полноценный источник данных.

Возможные функции:

- sensory_pleasure;
- savour­ing;
- comfort;
- ritual;
- social sharing;
- novelty;
- craft appreciation;
- familiarity.

Например:

`стейк`

может означать:

- насыщенный вкус;
- телесное / сенсорное удовольствие;
- ritual meal;
- indulgence.

Но один стейк НЕ означает автоматически:

> человек — гедонист.

Если появляются:

- стейк;
- хорошее вино;
- рестораны;
- красивые гостиницы;
- гастрономические путешествия;

confidence гипотезы `savouring / hedonic pleasure` повышается.

---

# 12. ALCOHOL

Например:

- вино;
- сидр;
- коктейли.

Не интерпретировать как характеристику личности.

Possible functions:

- taste;
- ritual;
- enhancement;
- sociality;
- savour­ing.

Не делать выводов про употребление алкоголя или здоровье.

---

# 13. MUSIC

Музыка может выполнять:

- emotional_intensity;
- emotion_regulation;
- stimulation;
- relaxation;
- nostalgia;
- identity;
- belonging;
- aesthetic pleasure;
- collective energy;
- live presence.

Обязательно учитывать конкретного исполнителя / жанр.

Не использовать:

> любит музыку → эмоциональный человек.

Это слишком общее.

---

# 14. LIVE MUSIC

Если человек отдельно говорит:

> ходить на концерты

это другой signal, чем просто:

> слушать музыку.

Проверять:

- live_presence;
- collective_energy;
- shared_experience;
- sensory_intensity;
- embodied sound.

---

# 15. TRAVEL

Possible functions:

- novelty;
- exploration;
- self_expansion;
- aesthetic experience;
- escape;
- restoration;
- movement;
- social experience;
- learning.

Не использовать автоматически:

> любит путешествовать → любознательный.

---

# 16. PLACES / COUNTRIES

Конкретное место — high-signal item.

Но причина выбора неизвестна.

Например:

`Япония`

может быть связана с:

- культурой;
- визуальным языком;
- едой;
- технологией;
- природой;
- порядком;
- личными воспоминаниями.

Нельзя выбрать одно без подтверждения.

Общеизвестные свойства места могут использоваться как candidate interpretations, но не как факт о пользователе.

---

# 17. PEOPLE / FAMILY

Если человек пишет:

- жена;
- ребёнок;
- родители;
- друзья;

это полноценные data points.

Possible functions:

- attachment;
- intimacy;
- belonging;
- shared life;
- care;
- family ritual.

Не писать автоматически:

> ты семейный человек.

Но если relational мотив появляется и в других выборах:

- совместные путешествия;
- стадион;
- ужины;
- друзья;
- общие ритуалы;

можно построить более сильный relational pattern.

---

# 18. BOOKS

Не использовать:

> любит читать → любит узнавать новое.

Сначала учитывать конкретный жанр / книгу.

Possible functions:

- learning;
- contemplation;
- meaning;
- imagination;
- perspective taking;
- emotional experience;
- aesthetic language;
- complexity;
- escapism.

---

# 19. FILMS / SERIES

Possible functions определять по конкретному произведению.

Проверять:

- emotional experience;
- tension;
- humour;
- social observation;
- aesthetics;
- world-building;
- ambiguity;
- intimacy;
- spectacle;
- identification.

Не использовать только жанр.

---

# 20. ANALYST — искать повторяющиеся функции

После интерпретации каждого item не сравнивать объекты напрямую.

Сначала искать повторяющиеся functions.

Например:

```text
стейк
→ sensory_pleasure

сидр
→ sensory_pleasure / ritual

Linkin Park
→ emotional_intensity / sensory_intensity

сноуборд
→ embodied_intensity

стадион
→ collective_energy / embodied event
```

После этого Analyst может проверить гипотезу:

> человеку особенно нравятся переживания, которые ощущаются ярко и непосредственно.

---

# 21. CROSS-DOMAIN PRIORITY

Особенно ценны связи между далёкими категориями.

Например:

`еда + музыка + спорт`

обычно интереснее:

`два похожих вида спорта`.

Но только если underlying mechanism действительно совпадает.

---

# 22. COVERAGE PASS

Перед финальным выбором обязательно проверить:

- people / relationships;
- food / sensory;
- movement / sport;
- music;
- books / ideas;
- travel / places;
- work;
- aesthetics / objects;
- collective experiences.

Только те категории, которые реально присутствуют во входе.

Не игнорировать еду, страны или людей только потому, что первая найденная связь относится к спорту.

---

# 23. COMPETING HYPOTHESES

Для сильного кластера проверять несколько объяснений.

Например:

```text
бег
сноуборд
машина
путешествия
прогулки
```

Candidate A:

`intensity`

Candidate B:

`movement`

Candidate C:

`autonomy`

Если прогулки плохо объясняются intensity, но хорошо movement — это аргумент в пользу movement.

---

# 24. COUNTEREVIDENCE

Искать не только подтверждения.

Проверять:

> Есть ли выбор человека, который делает эту гипотезу слишком простой?

Например:

если гипотеза:

> человеку всегда нужна высокая интенсивность

но он любит:

> тихие прогулки в парке

гипотезу нужно уточнить или заменить.

---

# 25. НОВЫЕ DEMO / TEST PERSONAS

Создать regression suite минимум из 10 разных типов входа.

Не использовать только людей, похожих на автора проекта.

---

## PERSONA 1 — SPORT / FAMILY / FOOD

Input:

> жена, ребёнок, стейки, сидр, гулять по паркам, ездить на машине, сноуборд, ходить на стадион смотреть футбол или регби, путешествовать на машине или самолёте, видео про космос, бег, концерты Linkin Park, Англия, Армения

System должен проверить:

- participation;
- movement;
- sensory pleasure;
- relational experience;
- live collective experience;
- awe / scale;
- places.

Не сводить всё к movement.

---

## PERSONA 2 — CULTURE / QUIET

> Вирджиния Вулф, Чехов, камерные концерты, музеи, прогулки в одиночестве, чай, старые библиотеки, Вена, дождь, рисование акварелью, ботанические сады.

Не выдавать:

> интроверт / глубокий человек.

Искать:

- contemplation;
- close attention;
- quiet sensory pleasure;
- atmosphere;
- slow observation.

---

## PERSONA 3 — NIGHTLIFE / FASHION

> техно, клубы, Mugler, Rick Owens, поздние ужины, Берлин, танцы, кожаная одежда, большие вечеринки, contemporary art.

Проверить:

- embodied intensity;
- transformation;
- collective energy;
- aesthetic extremity;
- nightlife ritual.

Не выдавать:

> любит свободу и самовыражение.

---

## PERSONA 4 — GAMING / TECH

> strategy games, sci-fi, coding side projects, Formula 1, YouTube про инженерию, LEGO Technic, японские автомобили, настольные игры.

Проверить:

- systems;
- mastery;
- problem solving;
- mechanics;
- competition;
- construction.

---

## PERSONA 5 — HOME / CRAFT

> готовить дома, вязать, свечи, растения, выпечка, семейные ужины, маленькие кафе, керамика, загородный дом.

Проверить:

- tactile creation;
- ritual;
- care;
- comfort;
- shared experience.

Не сводить всё к «уюту».

---

## PERSONA 6 — BUSINESS / COMPETITION

> переговоры, шахматы, теннис, биографии предпринимателей, Formula 1, запуск проектов, публичные выступления, poker.

Проверить:

- strategy;
- competition;
- decision making;
- uncertainty;
- performance;
- agency.

---

## PERSONA 7 — NATURE / EXPLORATION

> хайкинг, дайвинг, National Geographic, Исландия, космос, карты, походы, фотографировать пейзажи.

Проверить:

- exploration;
- scale/awe;
- embodied discovery;
- observation.

---

## PERSONA 8 — POP / SOCIAL

> Taylor Swift, Friends, brunch, Instagram, путешествия с друзьями, концерты, красивые отели, рестораны, дни рождения.

Не обесценивать как «поверхностный» вкус.

Проверить:

- shared emotion;
- ritual;
- social connection;
- aesthetic pleasure;
- celebration.

---

## PERSONA 9 — HIGH VARIETY

Набор специально почти хаотичный.

Цель:

проверить, умеет ли система оставить часть items unused и не натягивать единую теорию.

---

## PERSONA 10 — MINIMAL INPUT

8–10 нормальных предпочтений.

Цель:

проверить best available insight без `insufficient_data`.

---

# 26. TEST QUALITY

Для каждого regression persona проверять:

### Diversity
Не выдаёт ли система всем:

- энергия;
- свобода;
- глубина;
- баланс;
- самовыражение?

### Specificity
Можно ли поменять имя пользователя и оставить текст?

Если да — результат слабый.

### Coverage
Исследованы ли разные значимые области входа?

### Evidence
Каждый вывод действительно поддерживается указанными items?

### No fabrication
Не появились ли действия или свойства, которых пользователь не писал?

### Surprise
Есть ли хотя бы одна связь между далёкими категориями?

---

# 27. СОХРАНЕНИЕ РЕАЛЬНЫХ СЕССИЙ

Добавить backend storage для research / product improvement.

Не использовать данные непосредственно для автоматического обучения модели.

На данном этапе это dataset для:

- анализа ошибок;
- улучшения prompts;
- улучшения knowledge base;
- создания новых regression tests;
- понимания поведения пользователей.

---

# 28. PRIVACY BY DEFAULT

Не сохранять:

- email;
- имя аккаунта;
- OpenAI user ID;
- IP address;
- location;
- authentication identifiers.

Создавать случайный:

```text
anonymous_session_id
```

Он нужен только для связывания:

input → result → feedback.

---

# 29. Важно: raw text может содержать имена

Даже если сайт не знает личность пользователя, raw input может содержать:

> жена Аня  
> дочь Мария

Поэтому не называть dataset полностью anonymous.

Внутри кода использовать термин:

```text
pseudonymous research data
```

---

# 30. CONSENT

Перед первым анализом или рядом с CTA показать компактную настройку:

**Помочь улучшить «Между строк»**

> Можно анонимно сохранять твои ответы, результат и оценку качества, чтобы улучшать анализ.

Checkbox:

`Разрешаю использовать мои ответы для улучшения проекта`

По умолчанию желательно false.

Если checkbox выключен:

анализ работает полностью.

Research logging не происходит.

---

# 31. Дополнительная privacy copy

Мелко:

**Не указывай то, что не хочешь сохранять.**

Не писать:

> обучаем AI на ваших данных

если фактически происходит анализ dataset вручную / через prompt iteration.

Правильнее:

> используем для улучшения логики анализа.

---

# 32. ЧТО СОХРАНЯТЬ

Если пользователь дал consent:

```json
{
  "anonymous_session_id": "...",
  "created_at": "...",

  "prompt_version": "v7",
  "knowledge_base_version": "...",
  "model": "...",

  "raw_input": "...",

  "parsed_items": [],

  "item_interpretations": [],

  "final_result": {},

  "feedback": {}
}
```

---

# 33. Что НЕ обязательно хранить

Не нужно постоянно хранить полный hidden reasoning модели.

Не сохранять private chain-of-thought.

Хранить только structured outputs:

- candidate functions;
- selected patterns;
- scores;
- rejected hypothesis IDs при необходимости.

---

# 34. FEEDBACK ПОСЛЕ РЕЗУЛЬТАТА

Добавить небольшой блок.

### Насколько это попало?

`1 2 3 4 5`

---

### Что было самым интересным?

- главный вывод;
- паттерны;
- неожиданная связь;
- визуализация;
- ничего.

---

### Optional

**Что здесь совсем не про тебя?**

Одно короткое текстовое поле.

---

# 35. Не превращать feedback в форму

Feedback должен занимать несколько секунд.

Не заставлять пользователя объяснять продукту самого себя.

---

# 36. Поведенческие сигналы

Если consent включён, полезно сохранять:

- нажал ли «Почему именно они?»;
- какой pattern раскрыл;
- какую unexpected connection посмотрел;
- сохранил ли share card;
- нажал ли «Дополнить вводные»;
- запустил ли повторный анализ.

Не отслеживать лишние действия ради аналитики.

---

# 37. Важный продуктовый сигнал

Если пользователь нажимает:

**Дополнить вводные**

сохранить:

```text
initial_result_id
```

и связать повторный результат с первой сессией.

Это позволит проверять:

> действительно ли больше входных данных улучшает оценку результата?

---

# 38. KNOWLEDGE BASE VERSIONING

Каждая версия analysis должна знать:

```text
prompt_version
knowledge_base_version
```

Например:

```text
prompt_version = "analyst-v7.1"
knowledge_base_version = "preferences-v1"
```

Это обязательно.

Иначе невозможно понять, почему качество результатов изменилось после обновления.

---

# 39. INTERNAL QUALITY DATA

Для каждого финального pattern сохранить внутренние оценки:

```json
{
  "novelty": 8,
  "specificity": 9,
  "evidence_strength": 8,
  "coverage": 7,
  "confidence": "high"
}
```

Пользователь их не видит.

Это нужно для дальнейшего анализа продукта.

---

# 40. НЕ ДОБАВЛЯТЬ AUTO-LEARNING

Не создавать сейчас pipeline:

```text
feedback
→ автоматически изменить prompt
```

Это слишком рискованно.

Использовать:

```text
real sessions
→ review
→ identify recurring errors
→ manually update knowledge base / prompts
→ regression test
→ deploy
```

---

# 41. Новый принцип развития продукта

Нельзя улучшать систему по одному красивому example.

Каждое изменение должно:

1. исправлять конкретную ошибку;
2. проверяться на regression suite;
3. не ухудшать другие personas;
4. после deployment проверяться на real feedback.

---

# 42. Что НЕ делать сейчас

Не добавлять пока:

- recommendations;
- compatibility;
- career advice;
- personality labels;
- психологические scores;
- отдельную модель пользователя;
- социальные функции;
- accounts.

Сначала сделать ядро анализа действительно хорошим.

---

# 43. Будущие направления — не реализовывать сейчас

Архитектура должна не блокировать потенциальные будущие режимы:

### Taste Map
Постепенно дополняемая карта предпочтений.

### Recommendations
Рекомендовать новое не по категории, а по **причине, почему человеку это может понравиться**.

### Compare
Сравнивать карты двух людей через совпадающие mechanisms.

### Creative Taste
Карта эстетических и культурных предпочтений для художников / дизайнеров / creative professionals.

### Work Preferences
Исследовать, какие типы рабочего опыта человеку нравятся.

Не реализовывать их сейчас.

---

# 44. Критерий готовности этой итерации

Считать intelligence layer готовым, если:

1. свободный текст стабильно парсится;
2. реальный пользовательский список не падает из-за пунктуации;
3. система исследует разные части списка;
4. все patterns используют минимум 2 реальных item;
5. main insight использует минимум 3 item;
6. система не создаёт несуществующие пользовательские выборы;
7. разные personas получают принципиально разные результаты;
8. есть feedback;
9. при consent сохраняются pseudonymous research sessions;
10. prompt и knowledge base версионируются;
11. regression suite запускается перед публикацией.