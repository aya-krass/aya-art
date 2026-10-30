# Исправление secondary_function_support

## 1. Где возникал сбой

В опубликованной версии 16 (source 47265d2ba412ed0b973db9e330f97e7ea06c910e), server/critic.mjs:14. Strict validator бросал secondary_function_support, а analysis-pipeline.mjs после одной модельной попытки исправления снова вызывал тот же strict validator. Optional enrichment становился условием выдачи всего результата.

## 2. Старая логика

```js
  for(const id of f.secondary_function_ids){const alternative=hypotheses.get(id);if(id!==f.primary_function_id&&(!alternative||ids.filter(itemId=>alternative.support.some(s=>s.item_id===itemId)).length<2))throw Object.assign(Error('Unconfirmed secondary function'),{check:'secondary_function_support'})}
```

## 3. Новая логика

server/critic.mjs: repairApprovedFindings выполняется ДО strict validation, включая initial Critic, model retry, reanalysis merge и optional coverage recheck.

```text
validate structure → remove unsupported optional data
→ preserve only real primary evidence → validate cleaned findings
→ return result if any valid primary remains
```

Secondary сохраняется при двух relevant signals, одном signal с explicit_user_reason или near-structural HIGH signal в конкретном общем experience class без явного противоречия. Иначе удаляется с internal repair log. Duplicate secondary, primary дубликат и generic mastery→competence без уточнения удаляются. Неизвестные optional function IDs, неподтверждённые counterevidence и дубли findings очищаются. Один плохой evidence удаляется, если остаётся минимум два подтверждённых реальных item_id. Primary без достаточного evidence не восстанавливается выдуманным текстом: finding удаляется; другие valid findings сохраняются.

Если ни одного primary не осталось — максимум один model repair, затем понятный отказ. Malformed Critic JSON также имеет одну попытку исправления. Writer optional wording и accent восстанавливаются из approved text. Optional coverage/network expansion и image/visual-brief ошибки не отменяют готовые findings. Неожиданные пары строятся только из очищенных approved findings, отдельные выдуманные pairs не принимаются.

Серверный repair log содержит только function/finding IDs и технические причины, без raw text, key или текстов ответов. При consent он также включается в pseudonymous trace; без consent research storage не используется. UI и production JSON ошибки больше не содержат stage/check/code: только понятный текст и reference.

## 4–5. Regression и результат

[Фактический offline HTTP trace](review/secondary-repair-regression.json). Подготовленный ответ Critic: collective_energy + belonging с одной слабой опорой belonging. Настоящий Worker handler вернул **HTTP 200**, primary сохранён, secondary=[], Critic вызван **1 раз**. Это mock provider regression, не живой API-прогон.

10 новых repair-first tests проверяют исходный кейс, thresholds, explicit reason, near-structural context, redundancy, duplicates, optional fields, частично плохой evidence, unsafe wording, unavailable coverage и два необратимо malformed JSON. Полный suite: **89 tests, 89 passed, 0 failed**. [TAP](review/regression-results.tap).

## 6. Та же публикуемая версия/ветка

Project ID взят из существующего .openai/hosting.json: appgprj_6ac65f7397808191bd991ad4007aad1f. Checkout/source branch: main. Это текущий checkout опубликованного сайта, не отдельный draft или экспериментальная ветка. Сборка встраивает исправленные critic/analysis-pipeline/writer/worker в dist/server/index.js. Финальный commit push, saved version и deployment сверяются native Sites response при публикации. Runtime marker: validation_version=critic-repair-v1; доступен в GET /api/version и успешном API result.

Ключ окружения и audience сайта не менялись. Live API из этой среды по-прежнему не проверен из-за proxy policy; native deployment и offline Worker regression проверяются отдельно.
