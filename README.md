# Kvest

```bash
npm install
npm test        # тесты
npm run dev     # локальный запуск
npm run build   # сборка в dist/
```

Сайт: https://andrii-nehrii.github.io/Kvest/

## Карта проекта: что нужно, чтобы писать историю

Владелец проекта сам играет. Папка `docs/hidden/` — со спойлерами, игрокам её не открывать. В чате, коммитах и описаниях
изменений сюжет не пересказывается.

### С чего начать (по порядку)

| № | Файл | Зачем |
|---|---|---|
| 1 | `AGENTS.md` | Неприкосновенные правила: что нельзя менять, что нельзя говорить владельцу, команды. |
| 2 | `docs/hidden/CONTEXT.md` | Память проекта: где что лежит, решения владельца (§6), где сейчас настоящая пара (§4), журнал сессий (§7). В конце работы дописать сюда 3–6 строк. |
| 3 | `docs/hidden/CHECKPOINT_WORKFLOW.md` | Как из одного запроса сделать готовую точку: принятый формат, карта механик, собственная приёмка. |
| 4 | `docs/hidden/TECHNIQUES.md` | Приёмы истории (находки, опасность, ресурсы, порознь, разные сведения, люди из прошлого, потери): что это, правила, частоты. |
| 5 | `docs/hidden/STORY_STATE.md` | Что уже случилось: люди, места, флаги. Актуален последний раздел; остальное искать по имени или флагу. |

### Правила и справочники

| Нужно | Где |
|---|---|
| Голос, стиль, речь людей, образцы «было → надо» | `docs/hidden/WRITING_GUIDE.md` |
| Устройство сцены, два телефона, чек-лист ошибок | `docs/hidden/CHAPTER_GUIDE.md` (§2, §3, §6) |
| Законы мира: болезнь, обращённые, хронология | `docs/hidden/WORLD_BIBLE.md` |
| Исходный замысел, персонажи, темп дней | `docs/hidden/STORY_DESIGN.md` |
| Архитектура движка, выбывание и смерть (§9), сохранения | `docs/ARCHITECTURE.md` |
| Текущее задание по главе 3 | `docs/hidden/CHAPTER3_BRIEF.md` |
| Планы написанных точек (замысел, скрытая правда, флаги) | `docs/hidden/CHAPTER3_ARC9_PLAN.md`, `…ARC12…`, `…ARC14…`, `…ARC16…`, `…ARC18…`, `CHAPTER3_POINT7_PLAN.md`, `CHAPTER3_POINT8_PLAN.md` |
| Запас идей на следующие точки и правило опасности | `docs/hidden/CHAPTER3_ARC19_PLAN.md` |
| Старые разборы и методы (не обязательны) | `docs/hidden/CHAPTER3_REVIEW*.md`, `PART_METHOD.md`, `archive/` |

### Приёмы и жребий

| Нужно | Где |
|---|---|
| Вытянуть приёмы для точки N (до сюжета) | `node scripts/techniques.cjs N --write` |
| Журнал: что выпало и что вошло в каждую точку (дозаполнять после письма) | `docs/hidden/techniques-log.json` |
| Частоты и страховки | таблицы в `TECHNIQUES.md` §2 и константы в `scripts/techniques.cjs` — менять в обоих местах и только по слову владельца |

### Где лежит сама история

| Что | Где |
|---|---|
| Сцены по главам | `src/content/chapter1/`, `chapter2/`, `chapter3/` |
| Сборка сюжета: главы, контрольные точки, совместные решения | `src/content/index.ts`, `src/content/chapter3/index.ts` |
| Входы в точки (`cN_start`) | `src/content/chapter3/routes.ts` |
| Точка N главы 3: условия / сцены / сводка и вопросы | `pointN.ts` / `dayN*.ts` (или `nightN*`, `dawnN*`) / `finishN.ts` |
| Предметы | `src/content/items.ts` |
| Люди с поведением и доверием | `src/content/people.ts`, `chapter2/world2.ts`, блоки `npcsN` в `chapter3/pointN.ts` |
| Карточки людей без симуляции | `src/content/chapter3/contacts.ts` |
| Места, погода, связь, питание | `src/content/world.ts`, `chapter3/world3.ts` |
| Повседневные действия (еда, вода, сон, зарядка) | `src/engine/camp.ts`, `chapter3/farm6care.ts` |
| Образцы голоса | `chapter1/opening.ts`, `chapter2/night.ts`, `chapter2/day.ts` |
| Образцы приёмов | порознь — точка 18 (`point18.ts`, `day18a.ts`, `day18b.ts`); находки — `c17_b_pantry` в `day17x.ts`, `c18_a_smoke` в `day18y.ts`; разные сведения — дуга 9–11 |

### Движок и приложение

| Что | Где |
|---|---|
| Типы сцен, действий, условий, эффектов | `src/engine/content-types.ts`, `src/engine/types.ts` |
| Ходы и планы, условия, эффекты, проверки навыков | `src/engine/actions.ts`, `conditions.ts`, `effects.ts`, `checks.ts` |
| Тело, болезни, время, дорога, база и машина | `src/engine/body.ts`, `illness.ts`, `time.ts`, `simulate.ts`, `journey.ts`, `base.ts` |
| Контрольная точка: слияние линий, совместные решения | `src/engine/checkpoint.ts` |
| Сессия телефона, обновление сохранений, облако | `src/app/session.ts`, `src/app/cloud.ts` |
| Интерфейс | `src/ui/` |

### Настоящая пара и сохранения

Игра идёт, начать заново нельзя. Сохранения пары лежат в ветке `saves`; как их взять и в каком слоте играют — `CONTEXT.md` §4.
Писать только для мест, где пара ещё может оказаться; сыгранное не менять; всё новое по расчёту — за условием `{ cp: N }`.
В основную ветку сохранения не коммитить.

### Проверки

| Что | Команда |
|---|---|
| Типы и все тесты | `npx tsc --noEmit && npx vitest run` |
| Подсказки по тексту для своих файлов | `KVEST_QUALITY_FILES=chapter3/файл.ts npx vitest run src/content/quality.test.ts` |
| Стенограмма от сохранений пары (прочитать целиком) | `KVEST_PAIR=transcripts/pair KVEST_TRANSCRIPT=имя KVEST_FROM=N KVEST_TO=N npx vitest run src/content/transcript.test.ts` |
| Где пара может оказаться | `KVEST_PAIR=transcripts/pair npx vitest run src/content/pairpaths.test.ts` |
| Браузер, два телефона | `npm run e2e:quick` (от новой игры доходит не до всех точек; новые точки проверять отдельным прогоном от состояния пары) |
| Помощники для тестов точек | `src/test/arc9kit.ts`, пример — `src/content/point16.test.ts` |
| Совместимость со старыми сохранениями | `src/content/compat.test.ts`, эталоны `src/content/fixtures/release-*.json` — не менять |

Защищённые файлы (в рабочей ветке главы не менять): `quality.test.ts`, `playtest.ts`, `transcript.test.ts`, `compat.test.ts`,
`fixtures/`, `CHAPTER_GUIDE.md`, `WRITING_GUIDE.md`, `AGENTS.md`, `.github/`.

### Выпуск

Пуш в `main` сразу выкладывает игру игрокам (`.github/workflows/pages.yml`). Перед этим: зелёные типы и тесты, браузер,
проверка, что сохранения пары повторяются текущей сборкой без изменений, и выкладка раньше, чем пара дойдёт до новой точки.
После выпуска: дописать `CONTEXT.md` §7, раздел в `STORY_STATE.md`, план точки и журнал приёмов.
