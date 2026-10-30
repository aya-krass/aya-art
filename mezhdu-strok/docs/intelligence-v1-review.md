# Intelligence bundle v1 — пакет перед публикацией

Подготовлено: 23 октября 2026 г. в 23:49, Asia/Dubai.

## 1. Файлы

Полный список: [changed-files.txt](review/changed-files.txt).

- knowledge/preference-kb.report-derived.v1.json — 101 видимых классов таблицы + 2 класса из видимых примеров. Отсутствующие 485 строк не воспроизводятся.
- knowledge/function-taxonomy.v1.json — 40 функций; interpretation-traps.v1.json — 42 ловушки; distinctions.v1.json — 12 различий.
- server/parser.mjs, classifier.mjs, kb-retriever.mjs, hypothesis-engine.mjs, critic.mjs, writer.mjs, reanalysis.mjs, analysis-pipeline.mjs, bundle-schemas.mjs, guardrails.mjs.
- server/worker.mjs, research.mjs, build.mjs — HTTP, trace с согласия, сборка.
- dist/app.js — только передача предыдущего подписанного результата; landing и стили в этой итерации не менялись.
- tests/parser.test.mjs, knowledge.test.mjs, analysis.test.mjs, stability.test.mjs, guardrails.test.mjs; API, feedback и UI regression suite.

## 2–5. Схемы

Полные JSON Schema: [schemas.json](review/schemas.json).

Parser: item_id, label, source_text, explicit_user_reason. IDs canonical и независимы от порядка.

Classification: item_id, domain, subdomain, experience_type, observable context, classification_confidence (LOW/MEDIUM/MEDIUM_HIGH/HIGH). Мотивов на этом шаге нет.

Item hypotheses: objective_affordances и несколько candidate_functions; evidence_strength приходит из report-derived KB и может быть null. User-fit — отдельный ordinal label, не вероятность. Explicit reason подтверждает/исключает функции и понижает остальные priors как основу выводов.

Finding: finding_id, primary_function_id, secondary_function_ids, user_fit_confidence, минимум 2 unique supporting IDs, counterevidence, competing_functions, reason_selected, title, description.

## 6. Retrieval

[Три фактических примера](review/retrieval-examples.json): бегать → endurance class с movement/mastery priors; стадион → live sport, не участие в игре; Япония → named place с пустым generic motive prior.

## 7. Regression results

89 tests, 89 passed, 0 failed. [Полный TAP](review/regression-results.tap). Проверены A–J, 42 report traps, пять порядков ввода, парафраз бега, повторяемость детерминированного ядра, reanalysis KEEP/STRENGTHEN/REVISE/REMOVE, реальные IDs и consent.

## 8. Structured trace

[Полный trace](review/structured-trace.json): raw input → parsed items → classifications → retrieved KB → item hypotheses → independent aggregation → competing functions/counterevidence → four approved findings → writer output → frontend result.

Это OFFLINE_FIXTURE: ответы Parser/Critic/Writer подготовлены, остальные перечисленные этапы и все валидаторы выполнены реальным кодом. Это не live API verification. Скрытых chain-of-thought нет; только явные структуры и короткие опоры.

## Ограничения проверки

Сеть среды отклоняет соединение с опубликованным сайтом (proxy 403), локального OPENAI_API_KEY нет. Полная семантика и repeat-run stability реальных модельных ответов пока не проверены. Live runner scripts/evaluate-intelligence.mjs подготовлен для разрешённой среды с ключом; offline tests не подменяют такую проверку. Источники отчёта и citation markers сохранены с provenance, но не выдаются за независимо проверенные публикации.
