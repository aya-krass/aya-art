Исправь текущую ошибку:

`critic/secondary_function_support`

Сейчас отсутствие достаточной поддержки для `secondary_function_id` приводит к отказу всего анализа.

Это неправильная логика.

## 1. PRIMARY FUNCTION — обязательна

Каждый final finding должен иметь одну доказанную:

```json
{
  "primary_function_id": "..."
}
```

Primary function должна иметь достаточный support от реальных `item_id`.

Если primary function не проходит validation, finding можно удалить или пересобрать.

---

## 2. SECONDARY FUNCTIONS — optional enrichment

`secondary_function_ids` НЕ обязательны.

Они нужны только тогда, когда второй mechanism действительно помогает точнее описать finding.

Допустимо:

```json
{
  "primary_function_id": "collective_energy",
  "secondary_function_ids": []
}
```

Это полностью валидный finding.

---

## 3. НЕ ПАДАТЬ ИЗ-ЗА SECONDARY FUNCTION

Если Critic считает secondary function недостаточно подтверждённой:

НЕ возвращать validation error.

НЕ ломать весь `/api/analyze`.

Вместо этого:

```text
unsupported secondary function
→ remove secondary function
→ keep finding if primary function remains valid
```

Например:

```json
{
  "primary_function_id": "collective_energy",
  "secondary_function_ids": [
    "belonging"
  ]
}
```

Если `collective_energy` доказана, а `belonging` нет:

результат должен автоматически стать:

```json
{
  "primary_function_id": "collective_energy",
  "secondary_function_ids": []
}
```

а не завершиться ошибкой.

---

## 4. SECONDARY FUNCTION SUPPORT THRESHOLD

Secondary function должна присутствовать только если:

- она поддерживается минимум двумя relevant signals;

ИЛИ

- один signal содержит explicit_user_reason, явно подтверждающий её;

ИЛИ

- она является почти structural для конкретного общего experience context.

Но если этого нет — просто удалить secondary.

---

## 5. SECONDARY НЕ ДОЛЖНА ДУБЛИРОВАТЬ PRIMARY

Если:

```text
primary = mastery
secondary = competence
```

и secondary ничего содержательно не добавляет в конкретном finding, убрать secondary.

Secondary нужна только если она реально уточняет механизм.

---

## 6. VALIDATION ДОЛЖНА БЫТЬ REPAIR-FIRST

Для recoverable issues использовать:

```text
validate
→ repair
→ validate again
→ return result
```

а не:

```text
validate
→ throw
→ пользователь видит ошибку
```

Recoverable issues:

- unsupported secondary function;
- duplicate secondary function;
- weak unexpected connection;
- duplicated finding;
- optional field invalid;
- one unsupported evidence item when enough evidence remains after removal.

---

## 7. HARD FAILURE ОСТАВИТЬ ТОЛЬКО ДЛЯ НЕВОССТАНОВИМЫХ СЛУЧАЕВ

Например:

- нет ни одного valid finding;
- primary functions всех findings не имеют достаточного evidence;
- model returned malformed JSON and repair failed;
- evidence ссылается на несуществующие `item_id` настолько широко, что результат нельзя восстановить;
- sensitive/forbidden inference невозможно удалить без разрушения результата.

Только тогда возвращать analysis error.

---

## 8. CRITIC OUTPUT

Critic должен возвращать очищенный результат.

Не возвращать пользователю внутренние validation failures.

Например:

```json
{
  "findings": [
    {
      "finding_id": "finding_01",
      "primary_function_id": "collective_energy",
      "secondary_function_ids": [],
      "user_fit_confidence": "MEDIUM_HIGH",
      "evidence": [...]
    }
  ]
}
```

---

## 9. ДОБАВИТЬ REPAIR LOG ДЛЯ DEBUG

В dev/internal logs можно сохранять:

```json
{
  "removed_secondary_functions": [
    {
      "finding_id": "finding_01",
      "function_id": "belonging",
      "reason": "insufficient_support"
    }
  ]
}
```

Не показывать это обычному пользователю.

---

## 10. USER-FACING ERROR

Не показывать пользователю внутренние коды типа:

`critic/secondary_function_support`

в production UI.

Для debugging их можно логировать server-side.

Пользователь должен увидеть generic error только если результат реально невозможно восстановить.

Но в данном случае error вообще не должен появляться.

---

## 11. REGRESSION TEST

Добавить test:

### Input
Достаточно данных для strong primary function, но secondary function имеет слабую поддержку.

### Expected
HTTP 200.

Finding сохраняется.

Unsupported secondary удаляется.

Пример:

```json
BEFORE CRITIC:
{
  "primary_function_id": "collective_energy",
  "secondary_function_ids": ["belonging"]
}
```

Critic определяет:

```text
collective_energy = supported
belonging = insufficient evidence
```

Expected:

```json
AFTER CRITIC:
{
  "primary_function_id": "collective_energy",
  "secondary_function_ids": []
}
```

НЕ:

```text
500 / validation failure
critic/secondary_function_support
```

---

## 12. ПРОВЕРИТЬ ВСЕ OPTIONAL FIELDS

Пройти по новой validation architecture и проверить, не используются ли другие optional enrichment fields как hard blockers.

Общий принцип:

**optional analytical enrichment should degrade gracefully.**

Недоказанный нюанс удаляем.

Не уничтожаем доказанный основной результат.

---

## 13. ПОСЛЕ ИСПРАВЛЕНИЯ

Покажи:

1. где именно возникал `critic/secondary_function_support`;
2. старую validation logic;
3. новую repair logic;
4. regression test;
5. результат теста;
6. убедись, что исправление находится в той же версии/ветке, из которой реально публикуется сайт.