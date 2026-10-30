# Между строк — Intelligence Bundle v1

Сайт: https://mezhdu-strok-patterns.aygul-parskaya.chatgpt.site

Текущие версии: `prompt_version=intelligence-v1`, `kb_version=preference-kb.report-derived.v1`.

## Основание

[Полный bundle и report](docs/intelligence-bundle-v1.md) — предоставленный исследовательский источник. Оригинального expanded KB JSON в пакете нет. Runtime KB содержит только 101 видимый класс таблицы и два класса из видимых cross-domain примеров; это не 485 отсутствующих исходных строк. Provenance включает SHA256 и номера строк. Citation markers и библиография сохранены как заявленные в отчёте источники, без заявления о независимой проверке.

`knowledge/function-taxonomy.v1.json`: 40 функций. `preference-kb.report-derived.v1.json`: классы, priors, источники, примеры и default policy. `interpretation-traps.v1.json`: 42 ловушки. `distinctions.v1.json`: 12 операционных различий. Не поддержанные отчётом поля остаются null/пустыми. Старые широкие v7 mappings выведены из runtime и удалены; исходная версия доступна в Git history.

## Цепочка анализа

1. `server/parser.mjs`: семантические choices, source text и explicit reason. Стабильные canonical IDs без зависимости от порядка. Пунктуационный split не используется как Parser.
2. `classifier.mjs`: наблюдаемый experience class и контекст. Для известных классов — стабильная маршрутизация синонимов; для неизвестных — отдельный строгий модельный классификатор, допускающий unknown. Не определяет мотив.
3. `kb-retriever.mjs`: одна релевантная строка класса и максимум пять приоров, альтернативы и provenance; весь KB в модель не отправляется. Для названного места generic motive prior пустой. Неуверенная классификация понижает strength band.
4. `hypothesis-engine.mjs`: несколько функций на choice, explicit reason override, независимая cross-domain recurrence, соседние объяснения и first-class counterevidence. Research evidence strength и runtime user-fit — разные ordinal bands, не вероятности. Одинаковые domain signals не получают тот же вес, что независимые domains. Не подтверждённые явной причиной priors остаются альтернативами и не подменяют эту причину в support.
5. `critic.mjs`: 1–5 distinct findings, каждый на 2+ реальных supporting IDs. Богатому input предназначены 3–5 линий; один finding вызывает coverage recheck, без force-fit. Hard validators не позволяют подставлять другой item, смешивать близость с толпой или повышать runtime confidence произвольно.
6. `writer.mjs`: только одобренные findings. IDs, evidence, reasons и функции неизменны. Summary описывает несколько линий, не master theory. Ошибка Writer даёт исходный одобренный текст. Неожиданные пары приложение выводит только из approved finding.
7. `reanalysis.mjs`: полный обновлённый input + HMAC-подписанный предыдущий structured result; KEEP/STRENGTHEN/REVISE/REMOVE по evidence. Подпись не зависит от consent: результат хранится в памяти браузера, серверной истории без consent нет.

Аналитические модельные вызовы имеют temperature 0, Writer — 0.4. Это снижает вариативность, но не доказывает repeat-run стабильность самих внешних моделей. Статистическая калибровка user-fit bands не заявляется. Guardrail validators, ограниченная schema и output lint дополняют инструкции модели; семантическое качество реальных формулировок нужно проверять на живых данных.

## Интерфейс

Landing и визуальный язык сохранены. Сначала карточка, затем объяснения; «Дополнить вводные» сохраняет текст и передаёт весь обновлённый input вместе с предыдущим signed analysis. Без неожиданных пар карточка остаётся валидной. Черновик текста/категорий переживает ошибку и перезагрузку через sessionStorage; предыдущие findings для reanalysis находятся в памяти текущего результата.

## Research и privacy

Согласие по умолчанию false. Без него нет research reads/writes или feedback/event requests. Анализ работает полностью. При согласии Sites R2 `RESEARCH` содержит private JSON files по случайному session UUID:

- `pseudonymous-research/intelligence-v1/<id>/session.json`: raw input, parsed items, classifications, retrieved KB, item hypotheses, aggregates, approved findings, reanalysis actions, unused choices, writer output, final result и версии.
- `feedback.json`: последняя добровольная оценка.
- `events/<id>.json`: только дополнение, повторный анализ и сохранение карточки.

Это **pseudonymous research data**: raw input/feedback могут содержать имена. Dataset не содержит аккаунт, email, IP, location или authentication identifiers. У приложения нет публичного read/list endpoint. Scoped write capability действует 30 дней; технические поля подписи не являются аккаунтной идентичностью. Hosting operational logs не описываются этой гарантией. Никакого hidden chain-of-thought, auto-learning или fine-tuning. Ошибка storage не отменяет результат.

## Проверка и публикация

- `npm run build`: автономный Worker с assets и versioned KB.
- `npm run check`: синтаксис текущего bundle и UI.
- `npm test`: offline regression suite; A–J, 42 traps, стабильность core, API, privacy, UI и reanalysis.
- `node scripts/emit-intelligence-review.mjs`: схемы, три retrieval-примера, complete offline structured trace и TAP-results. [Пакет перед deploy](docs/intelligence-v1-review.md).
- `node scripts/evaluate-intelligence.mjs --live`: десять персон с реальным OpenAI API и отдельным quality evaluator. Требует `OPENAI_API_KEY` в окружении исполнения; результаты игнорируются Git в `.eval-output/`. Ничего автоматически не меняет. Hosted secret не копируется локально.

Offline tests проверяют код и контракт, а не семантическую точность ответа LLM. Complete review trace явно помечен OFFLINE_FIXTURE: Parser/Critic/Writer prepared responses, остальные этапы выполняются реальным кодом. Живой API и браузерная вёрстка в этой среде не проверены: proxy отклоняет сайт, локального ключа нет.

`OPENAI_API_KEY` — только секрет окружения. `OPENAI_MODEL` по умолчанию gpt-4.1; необязательные изображения используют `OPENAI_IMAGE_MODEL` (gpt-image-2 по умолчанию). Расход токенов зависит от найденных классов, наличия явных причин, repair/recheck и визуального brief; постоянное число вызовов не обещается.

## Repair-first validation

Runtime marker `validation_version=critic-repair-v1`. Optional analytical enrichment is cleaned before strict validation: unsupported/duplicate/redundant secondary functions are removed while valid primary findings remain. Broken individual evidence is pruned only if two real primary supports remain. Individual invalid findings do not cancel independent valid findings. Optional Writer/coverage/visual issues degrade to approved content. Internal repair diagnostics stay server-side; production errors show only a generic message and support reference. [Old/new logic and regression proof](docs/secondary-function-repair.md).
