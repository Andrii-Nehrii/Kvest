import type { Scene, WorldEvent } from '../../engine/content-types';

// 13 ноября: утро.
export const morning13Scenes: Scene[] = [
  {
    "id": "c7_farm",
    "for": "any",
    "chapter": "ch3",
    "location": "hof_luedemann",
    "title": "Хутор",
    "safe": true,
    "text": [
      {"when": {"before": 4680}, "text": "Под навесом пахнет щепой. На свежей поперечине калитки белеет отпечаток ладони. За полем не видно даже края дороги."},
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "На дворе белеют края луж. У стены сарая мокрый след от сумки. Дверь приоткрыта на ладонь."
      },
      {
        "when": {"all": [{"after": 5040}, {"before": 5340}]},
        "text": "К калитке прилипла мокрая глина. Оле счищает её с нижней доски, не снимая поперечины. На кухне уже ставят воду."
      },
      {
        "when": {"after": 5340},
        "text": "На кухне пар от мокрых рукавов. Миски стоят близко друг к другу, между ними едва помещается хлебница. У двери сухая скамейка."
      },
      {
        "when": {"all": [{"flag": "w.c3_kerem_stays"}, {"npc": "deniz", "at": "hof_luedemann", "alive": true}]},
        "text": "Сумка Керема осталась у внутренней стены. Дениз переставляет её повыше от сырого пола."
      },
      {
        "when": {"all": [{"flag": "w.c3_owed_food"}, {"npc": "henrike", "at": "hof_luedemann", "alive": true}]},
        "text": "Хенрике откладывает хлеб отдельно, под перевёрнутую миску. Сверху кладёт ключ от сарая."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_visitor.result", "op": "==", "value": "exchange"}, {"all": [{"npc": "c3_koehler", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}]}]}, {"before": 4860}]},
        "text": "Кёлер отряхивает пустой мешок у кухни. Восемь поленьев увезены; Хенрике потрогала плечо гостьи, останавливая перед уходом."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_visitor.result", "op": "==", "value": "inspect"}, {"all": [{"npc": "c3_koehler", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}]}]}, {"before": 4860}]},
        "text": "Кёлер опускает рукава после осмотра. — Теперь можно спросить про ночь? — говорит она Хенрике."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_visitor.result", "op": "==", "value": "no"}, {"all": [{"npc": "c3_koehler", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}]}]}, {"before": 4860}]},
        "text": "Кёлер остаётся у тележки. Хенрике закрывает перед Оле дверь кухни: — Я сама выйду."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_rope.result", "op": "==", "value": "fuel"}, {"all": [{"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]}]}, {"before": 4860}]},
        "text": "Рация коротко хрипит. Оле узнаёт голос и отворачивается от всех, прижав её к уху."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_rope.result", "op": "==", "value": "contacts"}, {"all": [{"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]}]}, {"before": 4860}]},
        "text": "Дениз нажимает кнопку; лампочка загорается и гаснет. — Провод цел. Бензин из провода пока не делаю."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_rope.result", "op": "==", "value": "keep"}, {"all": [{"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]}]}, {"before": 4860}]},
        "text": "Оле убирает мёртвую рацию во внутренний карман. Ключи от машины остаются у тебя."
      },
      {
        "when": {"all": [{"v": "$.c7_kerem.result", "op": "==", "value": "stay"}, {"all": [{"npc": "kerem", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "Керем сидит на сумке у сарая. Увидев Дениза, поднимается, но руку ему не подаёт."
      },
      {
        "when": {"all": [{"v": "$.c7_kerem.result", "op": "==", "value": "food"}, {"all": [{"npc": "kerem", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "Керем уходит с твоей едой в кармане. Дениз находит пустую кружку брата и спрашивает, кто видел его последним."
      },
      {
        "when": {"all": [{"v": "$.c7_kerem.result", "op": "==", "value": "henrike"}, {"all": [{"npc": "kerem", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "Хенрике забирает у Керема мешок. — Сначала брат. Потом дорога. — Керем смотрит на тебя поверх её плеча."
      },
      {
        "when": {"all": [{"v": "$.c7_trough.result", "op": "==", "value": "dig"}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}]},
        "text": "Вдоль забора течёт узкая струя. У дороги вода встаёт выше колеи; Оле смотрит туда, щурясь."
      },
      {
        "when": {"all": [{"v": "$.c7_trough.result", "op": "==", "value": "buckets"}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}]},
        "text": "У стены сухо, вёдра тяжелеют с каждым разом. Соседняя дорога остаётся проходимой."
      },
      {
        "when": {"all": [{"v": "$.c7_trough.result", "op": "==", "value": "road"}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}]},
        "text": "Вода ушла к колее. Через поле уже идёт человек: показывает на сапоги и кричит, ещё не дойдя до сетки."
      },
      {
        "when": {"all": [{"npc": "pawel", "alive": true, "at": "hof_luedemann"}, {"npcVar": "pawel", "key": "c3_rest_hand"}]},
        "text": "Павел привязал ложку к ладони полосой ткани. — Так держится, — говорит он. Верёвку колодца сегодня не берёт."
      },
      {
        "when": {"all": [{"npc": "pawel", "alive": true, "at": "hof_luedemann"}, {"npcVar": "pawel", "key": "c3_hand_treated"}]},
        "text": "Павел снимает повязку только у таза. — В Щецине бы уже велели лежать, — говорит он. Хенрике молча показывает на скамейку."
      },
      {"when": {"v": "$.c7_kerem.result", "op": "==", "value": "listen"}, "text": "Керем замолкает, увидев тебя. Своего ответа он пока не получил."},
      {"when": {"v": "$.c7_kerem.result", "op": "==", "value": "tell"}, "text": "Дениз идёт к брату. Между ними встаёт открытая дверь сарая."},
      {
        "when": {"not": {"npc": "henrike", "at": "hof_luedemann", "alive": true}},
        "text": "На кухне свободен стул у края стола. Ты оставляешь на нём вещи, чтобы не занимать чужую миску."
      }
    ],
    "actions": [
      {
        "id": "c7_boots",
        "label": "Помочь Павлу высушить сапог",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c7_boots"}}, {"before": 5100}]}, {"npc": "pawel", "alive": true, "at": "hof_luedemann"}]},
        "text": "Павел держит сапог здоровой рукой. Ты вытягиваешь мокрую стельку и кладёшь у печки, не на саму плиту. Он перестаёт пытаться делать всё одной рукой.",
        "effects": [{"set": "$.c7_boots", "value": true}, {"npc": "pawel", "trust": 4}]
      },
      {
        "id": "c7_keremcup",
        "label": "Отнести Керему кружку",
        "minutes": 6,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c7_keremcup"}}, {"before": 5100}]}, {"npc": "kerem", "alive": true, "at": "hof_luedemann"}]},
        "text": "Кружка горячая только с одного бока. Керем берёт её через край рукава. Сумку прижимает сапогом к стене.",
        "effects": [{"set": "$.c7_keremcup", "value": true}, {"npc": "kerem", "trust": 3}]
      },
      {
        "id": "c7_denizbolt",
        "label": "Подать Денизу крепёж",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c7_denizbolt"}}, {"before": 5100}]}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]},
        "text": "Дениз выбирает один болт из трёх. — Остальные похожи. Мотору этого мало. — Он вкручивает выбранный только пальцами.",
        "effects": [{"set": "$.c7_denizbolt", "value": true}, {"npc": "deniz", "trust": 3}]
      },
      {
        "id": "c7_olepath",
        "label": "Спросить Оле про ночные следы",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c7_olepath"}}, {"before": 5100}]}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}]},
        "text": "Оле показывает след вдоль сетки. — Собака. Наша, — говорит сквозь зубы. — Я тоже сначала не понял. — Сапог он отводит от следа.",
        "effects": [{"set": "$.c7_olepath", "value": true}, {"npc": "ole", "trust": 3}]
      },
      {"id": "c7_cellar", "label": "Спуститься к погребу", "minutes": 2, "terminal": true, "goto": "c7_cellar", "effects": []},
      {"id": "c7_well", "label": "Подойти к водяному желобу", "minutes": 2, "terminal": true, "goto": "c7_well", "effects": []},
      {"id": "c7_gate", "label": "Выйти к калитке", "minutes": 2, "terminal": true, "goto": "c7_gate", "effects": []},
      {
        "id": "c7_fence",
        "label": "Доделать поперечину",
        "minutes": 0,
        "activity": "moderate",
        "repeatable": true,
        "combinable": true,
        "when": {"all": [{"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"not": {"flag": "proj.c3_fence.done"}}]}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}]},
        "text": "Ты подгоняешь разбухший край по вчерашней отметке. Сырая стружка прилипает к пальцам. Оле проверит, когда брус снова встанет в скобы.",
        "effects": [{"work": "c3_fence", "hours": 1}]
      },
      {
        "id": "c7_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 4680},
        "effects": [{"sleep": 360}],
        "text": "Под навесом пахнет щепой. На свежей поперечине калитки белеет отпечаток ладони. За полем не видно даже края дороги."
      },
      {
        "id": "c7_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c7_kerem_approach", "label": "Окликнуть Керема у сарая", "minutes": 1, "terminal": true, "goto": "c7_kerem", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4780}, {"before": 5150}, {"all": [{"npc": "kerem", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c7_kerem.done"}}]}},
      {"id": "c7_trough_approach", "label": "Подойти к воде у крыльца", "minutes": 1, "terminal": true, "goto": "c7_trough", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4940}, {"before": 5150}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"not": {"flag": "$.c7_trough.done"}}]}},
      {"id": "c7_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c7_cp", "when": {"all": [{"cp": 6}, {"after": 5100}]}}
    ]
  },
  {
    "id": "c7_cellar",
    "for": "any",
    "chapter": "ch3",
    "location": "hof_luedemann",
    "title": "У погреба",
    "safe": true,
    "text": [
      {"when": {"before": 4680}, "text": "В щели люка светится уголь в печи. На нижней ступеньке лежит луковая шелуха. Ты придерживаешь крышку плечом."},
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "У нижней ступеньки кирпич темнее. Над ним сухие ящики. Ты опускаешь ладонь к стене и чувствуешь холодную влагу."
      },
      {
        "when": {"all": [{"after": 5040}, {"before": 5340}]},
        "text": "На мешке белеет росток. Ты поворачиваешь его от стены, к щели света. Крышку люка держишь плечом."
      },
      {"when": {"after": 5340}, "text": "Погреб закрывают до рассвета. У люка пара сухих досок. К одной прилипла картофельная кожура."}
    ],
    "actions": [
      {
        "id": "c7_bricks",
        "label": "Проверить низ кирпичной стены",
        "minutes": 6,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_bricks"}}, {"before": 5100}]},
        "text": "Ты проводишь сухой тканью по нижнему шву. Она темнеет только с одного края. Вода идёт от двери, не через всю стену.",
        "effects": [{"set": "$.c7_bricks", "value": true}]
      },
      {
        "id": "c7_raisebags",
        "label": "Поднять нижний мешок на доски",
        "minutes": 12,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_raisebags"}}, {"before": 5100}]},
        "text": "Ты тянешь мешок не за шов, а снизу. На старом месте мокрый прямоугольник. Новая доска пока светлая.",
        "effects": [{"set": "$.c7_raisebags", "value": true}, {"body": "fatigue", "delta": 4}]
      },
      {
        "id": "c7_airgap",
        "label": "Открыть маленькую отдушину",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_airgap"}}, {"before": 5100}]},
        "text": "Деревянная заглушка выходит с трудом. Из отверстия тянет наружу, не внутрь. Ты оставляешь под ней тонкую щель.",
        "effects": [{"set": "$.c7_airgap", "value": true}]
      },
      {
        "id": "c7_sprouts",
        "label": "Убрать проросший клубень",
        "minutes": 7,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_sprouts"}}, {"before": 5100}]},
        "text": "Росток белый и ломкий. Ты кладёшь клубень отдельно для ближайшей готовки, не возвращая к целому мешку.",
        "effects": [{"set": "$.c7_sprouts", "value": true}]
      },
      {
        "id": "c7_step",
        "label": "Прибить скользкую ступеньку",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_step"}}, {"before": 5100}]},
        "text": "Шляпку гвоздя приходится утопить до дерева. После второго удара доска перестаёт гулять под ногой.",
        "effects": [{"set": "$.c7_step", "value": true}, {"body": "fatigue", "delta": 3}]
      },
      {
        "id": "c7_lid",
        "label": "Придержать люк Павлу",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c7_lid"}}, {"before": 5100}]}, {"npc": "pawel", "alive": true, "at": "hof_luedemann"}]},
        "text": "Павел проходит с пустыми руками. На ладони свежая ткань. Люк опускаешь только после его последнего шага.",
        "effects": [{"set": "$.c7_lid", "value": true}]
      },
      {"id": "c7_back", "label": "Подняться в дом", "minutes": 2, "terminal": true, "goto": "c7_farm", "effects": []},
      {
        "id": "c7_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 4680},
        "effects": [{"sleep": 360}],
        "text": "В щели люка светится уголь в печи. На нижней ступеньке лежит луковая шелуха. Ты придерживаешь крышку плечом."
      },
      {
        "id": "c7_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c7_kerem_approach", "label": "Окликнуть Керема у сарая", "minutes": 1, "terminal": true, "goto": "c7_kerem", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4780}, {"before": 5150}, {"all": [{"npc": "kerem", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c7_kerem.done"}}]}},
      {"id": "c7_trough_approach", "label": "Подойти к воде у крыльца", "minutes": 1, "terminal": true, "goto": "c7_trough", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4940}, {"before": 5150}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"not": {"flag": "$.c7_trough.done"}}]}},
      {"id": "c7_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c7_cp", "when": {"all": [{"cp": 6}, {"after": 5100}]}}
    ]
  },
  {
    "id": "c7_well",
    "for": "any",
    "chapter": "ch3",
    "location": "hof_luedemann",
    "title": "У желоба",
    "safe": true,
    "text": [
      {"when": {"before": 4680}, "text": "На доске колодца лежит перевёрнутая кружка. Под ней сухой круг. Ты находишь его ладонью в темноте."},
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "Вода стоит поверх тонкого льда. Край желоба белый от инея. Между лужами два плоских сухих камня."
      },
      {
        "when": {"all": [{"after": 5040}, {"before": 5340}]},
        "text": "У колодца грязные следы упираются в свежую доску. На ней теперь можно ставить полное ведро, не наклоняя его к земле."
      },
      {"when": {"after": 5340}, "text": "По прочищенной канавке идёт узкая струйка. Она звенит о край старой банки в траве. Банку ты убираешь сразу."}
    ],
    "actions": [
      {
        "id": "c7_ice",
        "label": "Снять лёд с края желоба",
        "minutes": 7,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_ice"}}, {"before": 5100}]},
        "text": "Лёд отходит тонкой пластинкой. Ты кладёшь его в траву, не в питьевое ведро. Под ним вода тёмная и чистая на вид.",
        "effects": [{"set": "$.c7_ice", "value": true}]
      },
      {
        "id": "c7_chainhook",
        "label": "Проверить запасной крюк",
        "minutes": 7,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_chainhook"}}, {"before": 5100}]},
        "text": "Резьба поддаётся только через сухую ткань. Крюк не треснул у сгиба. Ты оставляешь его там, где можно достать одной рукой.",
        "effects": [{"set": "$.c7_chainhook", "value": true}]
      },
      {
        "id": "c7_boardwater",
        "label": "Подложить доску под полное ведро",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_boardwater"}}, {"before": 5100}]},
        "text": "Доска ложится краями на два кирпича. Ведро стоит ровно. Ручка остаётся стоять дугой.",
        "effects": [{"set": "$.c7_boardwater", "value": true}]
      },
      {
        "id": "c7_pawelrest",
        "label": "Отнести ведро вместо Павла",
        "minutes": 12,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c7_pawelrest"}}, {"before": 5100}]}, {"npc": "pawel", "alive": true, "at": "hof_luedemann"}]},
        "text": "Павел протягивает здоровую руку, но ты подхватываешь {m:первым|первой}. Он открывает тебе дверь. До кухни идёте молча.",
        "effects": [{"set": "$.c7_pawelrest", "value": true}, {"body": "fatigue", "delta": 4}, {"npc": "pawel", "trust": 3}]
      },
      {
        "id": "c7_hosejoint",
        "label": "Осмотреть вчерашний хомут",
        "minutes": 6,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_hosejoint"}}, {"before": 5100}]},
        "text": "Под хомутом резина матовая, без разошедшегося края. Ты не затягиваешь сильнее просто так. Капля висит на металле, не падает.",
        "effects": [{"set": "$.c7_hosejoint", "value": true}]
      },
      {
        "id": "c7_pump",
        "label": "Закончить работу над насосом",
        "minutes": 0,
        "activity": "moderate",
        "repeatable": true,
        "combinable": true,
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"not": {"flag": "proj.c3_pump.done"}}, {"any": [{"has": "c3_hose"}, {"flag": "proj.c3_pump.started"}]}]},
        "text": "Ты снимаешь заусенец с края штуцера. Резина входит без залома. Хомут пока держишь только пальцами.",
        "effects": [{"work": "c3_pump", "hours": 1}]
      },
      {"id": "c7_back", "label": "Вернуться к печке", "minutes": 2, "terminal": true, "goto": "c7_farm", "effects": []},
      {
        "id": "c7_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 4680},
        "effects": [{"sleep": 360}],
        "text": "На доске колодца лежит перевёрнутая кружка. Под ней сухой круг. Ты находишь его ладонью в темноте."
      },
      {
        "id": "c7_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c7_kerem_approach", "label": "Окликнуть Керема у сарая", "minutes": 1, "terminal": true, "goto": "c7_kerem", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4780}, {"before": 5150}, {"all": [{"npc": "kerem", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c7_kerem.done"}}]}},
      {"id": "c7_trough_approach", "label": "Подойти к воде у крыльца", "minutes": 1, "terminal": true, "goto": "c7_trough", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4940}, {"before": 5150}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"not": {"flag": "$.c7_trough.done"}}]}},
      {"id": "c7_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c7_cp", "when": {"all": [{"cp": 6}, {"after": 5100}]}}
    ]
  },
  {
    "id": "c7_gate",
    "for": "any",
    "chapter": "ch3",
    "location": "hof_luedemann",
    "title": "У калитки",
    "safe": true,
    "text": [
      {"when": {"before": 4680}, "text": "Калитка заперта поперечиной. Между скобой и деревом застряла сухая травинка. Ты вытаскиваешь её двумя пальцами."},
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "Снаружи свежий след узкой покрышки. К калитке он не подходит. Поперёк следа лежит тонкая обломанная ветка."
      },
      {
        "when": {"all": [{"after": 5040}, {"before": 5340}]},
        "text": "За сеткой новый след колеса. Ты видишь, где человек останавливался, но не знаешь, кто это был."
      },
      {"when": {"after": 5340}, "text": "Доски в скобах держатся ровно. Из дома доносится ложка о миску. Свет из кухонного окна падает на нижнюю поперечину."}
    ],
    "actions": [
      {
        "id": "c7_wirequiet",
        "label": "Закрепить звенящую проволоку",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_wirequiet"}}, {"before": 5100}]},
        "text": "Проволока касается столба от ветра. Ты подкладываешь щепку между металлом и деревом. Жестянка теперь молчит до настоящего движения.",
        "effects": [{"set": "$.c7_wirequiet", "value": true}]
      },
      {
        "id": "c7_neighborcall",
        "label": "Окликнуть соседа с дороги",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_neighborcall"}}, {"before": 5100}]},
        "text": "Он поднимает руку издалека и показывает на свою колею. Ближе пока не идёт. Ты не открываешь калитку раньше времени.",
        "effects": [{"set": "$.c7_neighborcall", "value": true}]
      },
      {
        "id": "c7_olecoat",
        "label": "Подержать Оле сухую куртку",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c7_olecoat"}}, {"before": 5100}]}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}]},
        "text": "Он меняет промокший рукав, не снимая глаз с дороги. Ты передаёшь сухой воротником вверх. Старую куртку он бросает только под крышу.",
        "effects": [{"set": "$.c7_olecoat", "value": true}]
      },
      {
        "id": "c7_post",
        "label": "Проверить нижнюю скобу",
        "minutes": 7,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c7_post"}}, {"before": 5100}]}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}]},
        "text": "Под нижней скобой мокрая кора. Ты вычищаешь её щепкой, пока Оле держит брус. Его пальцы уже не сжаты вокруг ружья.",
        "effects": [{"set": "$.c7_post", "value": true}]
      },
      {
        "id": "c7_dogstrap",
        "label": "Поправить собаке ошейник",
        "minutes": 7,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c7_dogstrap"}}, {"before": 5100}]}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}]},
        "text": "Ты даёшь ей сначала обнюхать ладонь. Под ремнём вытерта шерсть. Ослабляешь на одно отверстие, Оле проверяет сам.",
        "effects": [{"set": "$.c7_dogstrap", "value": true}]
      },
      {
        "id": "c7_darkpath",
        "label": "Запомнить путь от калитки до дома",
        "minutes": 6,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_darkpath"}}, {"before": 5100}]},
        "text": "От столба до сарая две сухие доски. Дальше камень у лужи. В темноте ты уже не будешь искать их ногой.",
        "effects": [{"set": "$.c7_darkpath", "value": true}]
      },
      {"id": "c7_back", "label": "Зайти в дом", "minutes": 2, "terminal": true, "goto": "c7_farm", "effects": []},
      {
        "id": "c7_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 4680},
        "effects": [{"sleep": 360}],
        "text": "Калитка заперта поперечиной. Между скобой и деревом застряла сухая травинка. Ты вытаскиваешь её двумя пальцами."
      },
      {
        "id": "c7_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c7_kerem_approach", "label": "Окликнуть Керема у сарая", "minutes": 1, "terminal": true, "goto": "c7_kerem", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4780}, {"before": 5150}, {"all": [{"npc": "kerem", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c7_kerem.done"}}]}},
      {"id": "c7_trough_approach", "label": "Подойти к воде у крыльца", "minutes": 1, "terminal": true, "goto": "c7_trough", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4940}, {"before": 5150}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"not": {"flag": "$.c7_trough.done"}}]}},
      {"id": "c7_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c7_cp", "when": {"all": [{"cp": 6}, {"after": 5100}]}}
    ]
  },
  {
    "id": "c7_aflat",
    "for": "any",
    "chapter": "ch3",
    "location": "a_flat",
    "title": "Buchholz",
    "safe": true,
    "text": [
      {"when": {"before": 4680}, "text": "Кухонный стул упирается в ручку двери. На сиденье лежит полотенце, чтобы дерево не стучало о металл. Ты поправляешь край."},
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "Кран закрыт, под ним сухая кастрюля. Во дворе первый раз за утро стучит ведро о ведро. Ты слышишь его даже с закрытым окном."
      },
      {
        "when": {"all": [{"after": 5040}, {"before": 5340}]},
        "text": "С верхнего этажа спускают пустое ведро на верёвке. Оно качается перед твоим окном, не задевая стекло."
      },
      {"when": {"after": 5340}, "text": "Свеча освещает только край стола. Сверху перестают двигать стулья. От двери не слышно ничего, кроме твоего дыхания."},
      {
        "when": {"all": [{"all": [{"v": "$.c6_container.result", "op": "==", "value": "bottle"}, {"all": []}]}, {"before": 4860}]},
        "text": "С третьего этажа спускают твою пустую бутылку. Внутри записка с просьбой постучать, если понадобится помощь."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_container.result", "op": "==", "value": "walk"}, {"all": []}]}, {"before": 4860}]},
        "text": "Сосед держит тебе дверь локтем. Канистру с соломинкой он оставил в мусоре."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_container.result", "op": "==", "value": "warn"}, {"all": []}]}, {"before": 4860}]},
        "text": "Сосед уносит грязную канистру вниз. Возвращается без неё и без воды."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_lamp.result", "op": "==", "value": "dark"}, {"all": []}]}, {"before": 4860}]},
        "text": "В подъезде темно. Снизу негромко ругаются, когда кто-то задевает погашенную переноску."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_lamp.result", "op": "==", "value": "move"}, {"all": []}]}, {"before": 4860}]},
        "text": "Генератор гудит снаружи у стены. Его хозяин машет на своё сухое место: там теперь стоит мокрый двигатель."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_lamp.result", "op": "==", "value": "stay"}, {"all": []}]}, {"before": 4860}]},
        "text": "Полоса света всё ещё лежит под твоей дверью. Запах выхлопа проходит даже через замочную скважину."
      },
      {
        "when": {"all": [{"v": "$.c7_fumes.result", "op": "==", "value": "vent"}, {"all": []}]},
        "text": "Сосед сидит у открытой двери, не удерживая голову. Свежий воздух проходит через квартиру; одеяло приходится держать на плечах."
      },
      {
        "when": {"all": [{"v": "$.c7_fumes.result", "op": "==", "value": "call"}, {"all": []}]},
        "text": "Люди с улицы выводят соседа. Один возвращается за твоим именем: нужно записать, кто позвал."
      },
      {
        "when": {"all": [{"v": "$.c7_fumes.result", "op": "==", "value": "window"}, {"all": []}]},
        "text": "Внизу открывают окна. Кто-то спрашивает про человека у генератора; ответа из подвала нет."
      },
      {
        "when": {"all": [{"v": "$.c7_emptytank.result", "op": "==", "value": "share"}, {"all": []}]},
        "text": "Сверху спускают пустую бутылку. На верёвке новый узел: короткую часть оставили тебе для следующего раза."
      },
      {
        "when": {"all": [{"v": "$.c7_emptytank.result", "op": "==", "value": "check"}, {"all": []}]},
        "text": "Ты возвращаешься с адресом раздачи. Сосед уже собирает пустые ёмкости, считая ступеньки до улицы."
      },
      {
        "when": {"all": [{"v": "$.c7_emptytank.result", "op": "==", "value": "save"}, {"all": []}]},
        "text": "За стеной наполняют чашку по капле. Твои бутылки стоят у кровати, полные."
      },
      {
        "when": {"flag": "w.c3_night_guest"},
        "text": "Человек, которого вы пустили ночью, ещё спит на вашем месте. Ты встаёшь у двери, стараясь не задеть его ботинки. Под своей спиной всё утро чувствуешь край порога."
      }
    ],
    "actions": [
      {
        "id": "c7_tapdry",
        "label": "Открыть и снова закрыть сухой кран",
        "minutes": 4,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_tapdry"}}, {"before": 5100}]},
        "text": "В трубе короткий вздох. Больше ничего. Ты закрываешь кран до конца, чтобы не залило, если подадут воду.",
        "effects": [{"set": "$.c7_tapdry", "value": true}]
      },
      {
        "id": "c7_a_window",
        "label": "Проверить двор из-за занавески",
        "minutes": 6,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_a_window"}}, {"before": 5100}]},
        "text": "Во дворе меньше машин, чем вчера. Под одной сохнет тёмное пятно. Ты не можешь понять с окна, вода это или масло.",
        "effects": [{"set": "$.c7_a_window", "value": true}]
      },
      {
        "id": "c7_a_doorcloth",
        "label": "Сменить ткань под входной дверью",
        "minutes": 6,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_a_doorcloth"}}, {"before": 5100}]},
        "text": "Старая ткань сырая у самого края. Ты убираешь её в таз, сухую сворачиваешь тоньше. Сквозняк перестаёт тянуть по ногам.",
        "effects": [{"set": "$.c7_a_doorcloth", "value": true}]
      },
      {
        "id": "c7_a_glass",
        "label": "Собрать оставшиеся осколки на площадке",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_a_glass"}}, {"before": 5100}]},
        "text": "Самые мелкие видны только под углом к окну. Ты сметаешь их на плотную бумагу. В мусор несёшь вместе с ней.",
        "effects": [{"set": "$.c7_a_glass", "value": true}]
      },
      {
        "id": "c7_a_bottles",
        "label": "Переставить воду от холодной стены",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_a_bottles"}}, {"before": 5100}]},
        "text": "Ты берёшь бутылки по одной. У стены круги от донышек темнее. На новом месте вода не касается штукатурки.",
        "effects": [{"set": "$.c7_a_bottles", "value": true}]
      },
      {
        "id": "c7_a_blanket",
        "label": "Вытряхнуть подстилку в своей комнате",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_a_blanket"}}, {"before": 5100}]},
        "text": "Пыль висит в коротком полосатом свете. Ты сразу открываешь форточку на щель. Подстилку разворачиваешь чистой стороной.",
        "effects": [{"set": "$.c7_a_blanket", "value": true}]
      },
      {
        "id": "c7_a_kit",
        "label": "Убрать аптечку в доступный карман",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_a_kit"}}, {"before": 5100}]},
        "text": "Салфетки смялись у самой молнии. Ты расправляешь упаковку и кладёшь ближе к пальцам. Упаковка теперь сверху.",
        "effects": [{"set": "$.c7_a_kit", "value": true}]
      },
      {
        "id": "c7_a_neighbor",
        "label": "Спросить через дверь про верхний этаж",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_a_neighbor"}}, {"before": 5100}]},
        "text": "Сосед говорит, что сегодня отвечали. Ты просишь не ходить к ним без стука. Он отвечает, что теперь стучит везде.",
        "effects": [{"set": "$.c7_a_neighbor", "value": true}]
      },
      {"id": "c7_landing", "label": "Выйти на площадку", "minutes": 2, "terminal": true, "goto": "c7_landing_A", "effects": []},
      {
        "id": "c7_shutters",
        "label": "Подогнать засов",
        "minutes": 0,
        "activity": "moderate",
        "repeatable": true,
        "combinable": true,
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"not": {"flag": "proj.c3_shutters_a.done"}}, {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}]},
        "text": "Ты подводишь скобу к старым отверстиям. Саморез заходит в целое дерево. На затяжку остаётся один целый саморез.",
        "effects": [{"work": "c3_shutters_a", "hours": 1}]
      },
      {
        "id": "c7_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 4680},
        "effects": [{"sleep": 360}],
        "text": "Кухонный стул упирается в ручку двери. На сиденье лежит полотенце, чтобы дерево не стучало о металл. Ты поправляешь край."
      },
      {
        "id": "c7_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c7_fumes_approach", "label": "Разбудить соседа у входа", "minutes": 1, "terminal": true, "goto": "c7_fumes", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4775}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_fumes.done"}}]}},
      {"id": "c7_emptytank_approach", "label": "Выслушать вернувшихся за водой", "minutes": 1, "terminal": true, "goto": "c7_emptytank", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4970}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_emptytank.done"}}]}},
      {"id": "c7_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c7_cp", "when": {"all": [{"cp": 6}, {"after": 5100}]}}
    ],
    "onEnter": [
      {"if": {"all": [{"flag": "w.c3_night_guest"}, {"not": {"flag": "$.c3_guest_sleep_cost"}}]}, "then": [{"set": "$.c3_guest_sleep_cost", "value": true}, {"body": "sleepDebt", "delta": 2}]}
    ]
  },
  {
    "id": "c7_bflat",
    "for": "any",
    "chapter": "ch3",
    "location": "b_flat",
    "title": "Barmbek",
    "safe": true,
    "text": [
      {"when": {"before": 4680}, "text": "У двери напротив скребёт ключ. Ты ждёшь щелчка замка, но слышишь только, как ключ падает на плитку. Потом тихо."},
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "В это утро у дома меньше голосов. Дверь напротив закрыта, под ней не видно света. На полу под трубой сухое полотенце."
      },
      {
        "when": {"all": [{"after": 5040}, {"before": 5340}]},
        "text": "В подъезде пахнет мокрыми одеялами. Кто-то вытирает лестницу снизу вверх и оставляет тряпку у открытого окна."
      },
      {"when": {"after": 5340}, "text": "За окном гаснет очередной подъезд. В вашей комнате свет ещё отражается от стекла. Ты закрываешь штору до самого края."},
      {
        "when": {"all": [{"all": [{"v": "$.c6_patient.result", "op": "==", "value": "closed"}, {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"npcVar": "okafor", "key": "bitten"}]}]}, {"before": 4860}]},
        "text": "Стул стоит снаружи двери Окафора. Изнутри он спрашивает, на месте ли ты, но открыть не просит."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_patient.result", "op": "==", "value": "care"}, {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"npcVar": "okafor", "key": "bitten"}]}]}, {"before": 4860}]},
        "text": "Твою перевязку забрали. Вода остаётся у порога, хотя из-за двери слышно сухое сглатывание."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_patient.result", "op": "==", "value": "guard"}, {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"npcVar": "okafor", "key": "bitten"}]}]}, {"before": 4860}]},
        "text": "Дежурный записал этаж и фамилию. Когда машина уезжает, ты ищешь глазами знакомую дверь."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_chain.result", "op": "==", "value": "lift"}, {"all": []}]}, {"before": 4860}]},
        "text": "Матрас унесли. Старик пробует закрыть дверь и смотрит на тебя, дождавшись щелчка."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_chain.result", "op": "==", "value": "cut"}, {"all": []}]}, {"before": 4860}]},
        "text": "На пороге клочок разрезанной ткани. Девушка несёт матрас дырой к себе, не оглядываясь."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_chain.result", "op": "==", "value": "inside"}, {"all": []}]}, {"before": 4860}]},
        "text": "Матрас стоит внутри у стены. Чтобы открыть дверь, теперь нужно сначала отодвинуть его."
      },
      {
        "when": {"all": [{"v": "$.c7_silence.result", "op": "==", "value": "closed"}, {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"any": [{"npc": "okafor", "status": "infected"}, {"npc": "okafor", "status": "turned"}]}]}]},
        "text": "Стул у двери сдвигается от удара изнутри. Окафор на своё имя не отвечает. Ты помнишь его просьбу."
      },
      {
        "when": {"all": [{"v": "$.c7_silence.result", "op": "==", "value": "guard"}, {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"any": [{"npc": "okafor", "status": "infected"}, {"npc": "okafor", "status": "turned"}]}]}]},
        "text": "Дежурный просит всех отойти. Наверх он идёт без напарника и останавливается перед последней ступенькой."
      },
      {
        "when": {"all": [{"v": "$.c7_silence.result", "op": "==", "value": "move"}, {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"any": [{"npc": "okafor", "status": "infected"}, {"npc": "okafor", "status": "turned"}]}]}]},
        "text": "У общей стены пусто. Удары слышно и из дальнего угла, но оттуда видно собственную дверь."
      },
      {
        "when": {"all": [{"v": "$.c7_papers.result", "op": "==", "value": "minimum"}, {"all": []}]},
        "text": "Мужчина записал только число жильцов. Уходя, задерживается перед вашей дверью, словно хотел спросить ещё."
      },
      {
        "when": {"all": [{"v": "$.c7_papers.result", "op": "==", "value": "verify"}, {"all": []}]},
        "text": "Соседи не знают этого человека. Он забирает лист и уходит прежде, чем кто-то спускается за дежурным."
      },
      {
        "when": {"all": [{"v": "$.c7_papers.result", "op": "==", "value": "refuse"}, {"all": []}]},
        "text": "Карандаш не коснулся бумаги. На следующем этаже мужчина спрашивает, кто живёт над вами."
      },
      {
        "when": {"all": [{"v": "$.c7_stairwellwater.result", "op": "==", "value": "carry"}, {"not": {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"any": [{"npc": "okafor", "status": "infected"}, {"npc": "okafor", "status": "turned"}]}]}}]},
        "text": "Ведро подняли наверх. Женщина придерживает тебе дверь и сразу отпускает больную руку."
      },
      {
        "when": {"all": [{"v": "$.c7_stairwellwater.result", "op": "==", "value": "split"}, {"not": {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"any": [{"npc": "okafor", "status": "infected"}, {"npc": "okafor", "status": "turned"}]}]}}]},
        "text": "На верхней площадке стоят закрытые бутылки. Женщина делит их с тем, кто раньше не выходил на стук."
      },
      {
        "when": {"all": [{"v": "$.c7_stairwellwater.result", "op": "==", "value": "clear"}, {"not": {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"any": [{"npc": "okafor", "status": "infected"}, {"npc": "okafor", "status": "turned"}]}]}}]},
        "text": "Сверху наконец спустились за водой. Женщина сидит на ступеньке, не пытаясь снова взяться за ручку."
      },
      {
        "when": {"flag": "w.c3_night_guest"},
        "text": "Человек, которого вы пустили ночью, ещё спит на вашем месте. Ты встаёшь у двери, стараясь не задеть его ботинки. Под своей спиной всё утро чувствуешь край порога."
      }
    ],
    "actions": [
      {
        "id": "c7_doorquiet",
        "label": "Послушать площадку до выхода",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_doorquiet"}}, {"before": 5100}]},
        "text": "Ты стоишь у двери, не касаясь глазком лба. По ту сторону только лампа на таймере. Её щелчок слышен через дерево.",
        "effects": [{"set": "$.c7_doorquiet", "value": true}]
      },
      {
        "id": "c7_glovesready",
        "label": "Положить чистые перчатки у двери",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_glovesready"}}, {"before": 5100}]},
        "text": "Упаковку кладёшь отдельно от ключей. Открывать пока не нужно. На бумаге остаётся сухой след большого пальца.",
        "effects": [{"set": "$.c7_glovesready", "value": true}]
      },
      {
        "id": "c7_windowstreet",
        "label": "Посмотреть на раздачу с окна",
        "minutes": 6,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_windowstreet"}}, {"before": 5100}]},
        "text": "Грузовик у перекрёстка стоит боком. За его бортом не видно, наливают ли воду. Люди держат бутылки ещё закрытыми.",
        "effects": [{"set": "$.c7_windowstreet", "value": true}]
      },
      {
        "id": "c7_merledrawer",
        "label": "Убрать пустую упаковку из кухни",
        "minutes": 6,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_merledrawer"}}, {"before": 5100}]},
        "text": "В углу ящика старая упаковка от лекарства. Ты кладёшь её отдельно от еды, не выбрасывая сразу. Место для неё здесь всё ещё есть.",
        "effects": [{"set": "$.c7_merledrawer", "value": true}]
      },
      {
        "id": "c7_shoesdry",
        "label": "Сменить мокрую подкладку в обуви",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_shoesdry"}}, {"before": 5100}]},
        "text": "Ты вынимаешь бумагу из носков ботинок. Один лист сухой, другой прилип. Новую подкладку сминаешь меньше, чтобы осталось место пальцам.",
        "effects": [{"set": "$.c7_shoesdry", "value": true}]
      },
      {
        "id": "c7_safeplug",
        "label": "Проверить, не горячая ли вилка",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_safeplug"}}, {"before": 5100}]},
        "text": "Корпус холодный. Ты не тянешь за провод, только поправляешь его у края стола. На изгибе целая резина.",
        "effects": [{"set": "$.c7_safeplug", "value": true}]
      },
      {
        "id": "c7_dishes",
        "label": "Вымыть одну кружку отдельно",
        "minutes": 7,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_dishes"}}, {"before": 5100}]},
        "text": "Кружку держишь за целую ручку. На дне круг от вчерашнего чая. Смываешь его пальцем через губку и ставишь горлышком вниз.",
        "effects": [{"set": "$.c7_dishes", "value": true}]
      },
      {
        "id": "c7_stepslisten",
        "label": "Ответить соседке с нижнего этажа",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_stepslisten"}}, {"before": 5100}]},
        "text": "Она спрашивает только про воду. Ты отвечаешь тем, что видел{m:|а} из окна, не обещая цистерну. Соседка кивает в закрытую дверь.",
        "effects": [{"set": "$.c7_stepslisten", "value": true}]
      },
      {"id": "c7_landing", "label": "Выйти на площадку", "minutes": 2, "terminal": true, "goto": "c7_landing_B", "effects": []},
      {
        "id": "c7_okafor",
        "label": "Позвать Окафора из-за двери",
        "minutes": 2,
        "terminal": true,
        "goto": "c7_okafor",
        "when": {"npc": "okafor", "at": "b_okafor", "alive": true},
        "effects": []
      },
      {
        "id": "c7_shutters",
        "label": "Подогнать засов",
        "minutes": 0,
        "activity": "moderate",
        "repeatable": true,
        "combinable": true,
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"not": {"flag": "proj.c3_shutters_b.done"}}, {"any": [{"me": "B"}, {"not": {"flag": "w.together"}}]}]},
        "text": "Ты подводишь скобу к старым отверстиям. Саморез заходит в целое дерево. На затяжку остаётся один целый саморез.",
        "effects": [{"work": "c3_shutters_b", "hours": 1}]
      },
      {
        "id": "c7_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 4680},
        "effects": [{"sleep": 360}],
        "text": "У двери напротив скребёт ключ. Ты ждёшь щелчка замка, но слышишь только, как ключ падает на плитку. Потом тихо."
      },
      {
        "id": "c7_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c7_silence_approach", "label": "Прислушаться к двери напротив", "minutes": 1, "terminal": true, "goto": "c7_silence", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4875}, {"before": 5150}, {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"any": [{"npc": "okafor", "status": "infected"}, {"npc": "okafor", "status": "turned"}]}]}, {"not": {"flag": "$.c7_silence.done"}}]}},
      {"id": "c7_papers_approach", "label": "Ответить человеку с домовым списком", "minutes": 1, "terminal": true, "goto": "c7_papers", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4990}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_papers.done"}}]}},
      {"id": "c7_stairwellwater_approach", "label": "Ответить на стук снизу", "minutes": 1, "terminal": true, "goto": "c7_stairwellwater", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4875}, {"before": 5150}, {"not": {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"any": [{"npc": "okafor", "status": "infected"}, {"npc": "okafor", "status": "turned"}]}]}}, {"not": {"flag": "$.c7_stairwellwater.done"}}]}},
      {"id": "c7_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c7_cp", "when": {"all": [{"cp": 6}, {"after": 5100}]}}
    ],
    "onEnter": [
      {"if": {"all": [{"flag": "w.c3_night_guest"}, {"not": {"flag": "$.c3_guest_sleep_cost"}}]}, "then": [{"set": "$.c3_guest_sleep_cost", "value": true}, {"body": "sleepDebt", "delta": 2}]}
    ]
  },
  {
    "id": "c7_landing_A",
    "for": "any",
    "chapter": "ch3",
    "location": "a_stairs",
    "title": "Площадка",
    "safe": true,
    "text": [
      {"when": {"before": 4680}, "text": "Внизу хлопает входная дверь. По перилам дрожь доходит до ладони. Шаги не поднимаются."},
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "У нижнего окна пустые бутылки. В одной на дне листья с улицы. Ты не ставишь рядом свою."
      },
      {"when": {"all": [{"after": 5040}, {"before": 5340}]}, "text": "На площадке двигают стул с треснувшей спинкой. Его ножка оставляет светлую черту на полу."},
      {"when": {"after": 5340}, "text": "Кто-то внизу закрывает замок двумя оборотами. На втором металл скребёт по металлу. Потом нет ни одного звука."}
    ],
    "actions": [
      {
        "id": "c7_listen_A",
        "label": "Послушать этажи, стоя у стены",
        "minutes": 6,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_listen_A"}}, {"before": 5100}]},
        "text": "На верхнем этаже тихо закрывают воду, которой нет. Рычаг крана отзывается в трубе. Ты убираешь ладонь с холодной стены.",
        "effects": [{"set": "$.c7_listen_A", "value": true}]
      },
      {
        "id": "c7_light_A",
        "label": "Освободить подоконник от мокрой бумаги",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_light_A"}}, {"before": 5100}]},
        "text": "Бумага снимается только по кусочкам. Под ней целая краска, чуть светлее остальной. Ты складываешь мокрое в старую газету.",
        "effects": [{"set": "$.c7_light_A", "value": true}]
      },
      {
        "id": "c7_step_A",
        "label": "Убрать вещи со ступеней",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_step_A"}}, {"before": 5100}]},
        "text": "Сдвигаешь пустое ведро за перила. Ручка падает на бок, не загораживая спуск. Шагать теперь можно прямо.",
        "effects": [{"set": "$.c7_step_A", "value": true}]
      },
      {"id": "c7_back", "label": "Вернуться в квартиру", "minutes": 2, "terminal": true, "goto": "c7_aflat", "effects": []},
      {
        "id": "c7_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 4680},
        "effects": [{"sleep": 360}],
        "text": "Внизу хлопает входная дверь. По перилам дрожь доходит до ладони. Шаги не поднимаются."
      },
      {
        "id": "c7_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c7_fumes_approach", "label": "Разбудить соседа у входа", "minutes": 1, "terminal": true, "goto": "c7_fumes", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4775}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_fumes.done"}}]}},
      {"id": "c7_emptytank_approach", "label": "Выслушать вернувшихся за водой", "minutes": 1, "terminal": true, "goto": "c7_emptytank", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4970}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_emptytank.done"}}]}},
      {"id": "c7_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c7_cp", "when": {"all": [{"cp": 6}, {"after": 5100}]}}
    ]
  },
  {
    "id": "c7_landing_B",
    "for": "any",
    "chapter": "ch3",
    "location": "b_stairs",
    "title": "Площадка",
    "safe": true,
    "text": [
      {"when": {"before": 4680}, "text": "В узкой щели двери напротив нет света. У порога стоит нетронутая бутылка. На крышке лежит пыль."},
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "На перилах свежая влага. Кто-то вымыл лестницу, оставив мокрую тряпку на ведре. У двери напротив сухо."
      },
      {
        "when": {"all": [{"after": 5040}, {"before": 5340}]},
        "text": "Лампа включается от чьих-то шагов и гаснет. Между этими щелчками слышно, как внизу переливают воду."
      },
      {
        "when": {"after": 5340},
        "text": "На таймере перестаёт гореть маленькая лампочка. Лестница остаётся освещена только через окна. Дальше нижней площадки ничего не видно."
      }
    ],
    "actions": [
      {
        "id": "c7_listen_B",
        "label": "Послушать этажи, стоя у стены",
        "minutes": 6,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_listen_B"}}, {"before": 5100}]},
        "text": "Из дальней квартиры слышны ложки о чашку. Одна ложка падает, и человек ругается обычным усталым голосом. Ты ждёшь, пока он поднимет её.",
        "effects": [{"set": "$.c7_listen_B", "value": true}]
      },
      {
        "id": "c7_light_B",
        "label": "Освободить подоконник от мокрой бумаги",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_light_B"}}, {"before": 5100}]},
        "text": "На мокром объявлении размыло время. Ты убираешь его ниже, чтобы никто не принял за новую раздачу. На стекле остаётся угол скотча.",
        "effects": [{"set": "$.c7_light_B", "value": true}]
      },
      {
        "id": "c7_step_B",
        "label": "Убрать вещи со ступеней",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_step_B"}}, {"before": 5100}]},
        "text": "На ступеньке маленькая перчатка. Ты кладёшь её на сухой край почтового ящика. На манжете чужое имя, написанное маркером.",
        "effects": [{"set": "$.c7_step_B", "value": true}]
      },
      {"id": "c7_back", "label": "Вернуться в квартиру", "minutes": 2, "terminal": true, "goto": "c7_bflat", "effects": []},
      {
        "id": "c7_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 4680},
        "effects": [{"sleep": 360}],
        "text": "В узкой щели двери напротив нет света. У порога стоит нетронутая бутылка. На крышке лежит пыль."
      },
      {
        "id": "c7_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c7_silence_approach", "label": "Прислушаться к двери напротив", "minutes": 1, "terminal": true, "goto": "c7_silence", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4875}, {"before": 5150}, {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"any": [{"npc": "okafor", "status": "infected"}, {"npc": "okafor", "status": "turned"}]}]}, {"not": {"flag": "$.c7_silence.done"}}]}},
      {"id": "c7_papers_approach", "label": "Ответить человеку с домовым списком", "minutes": 1, "terminal": true, "goto": "c7_papers", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4990}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_papers.done"}}]}},
      {"id": "c7_stairwellwater_approach", "label": "Ответить на стук снизу", "minutes": 1, "terminal": true, "goto": "c7_stairwellwater", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4875}, {"before": 5150}, {"not": {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"any": [{"npc": "okafor", "status": "infected"}, {"npc": "okafor", "status": "turned"}]}]}}, {"not": {"flag": "$.c7_stairwellwater.done"}}]}},
      {"id": "c7_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c7_cp", "when": {"all": [{"cp": 6}, {"after": 5100}]}}
    ]
  },
  {
    "id": "c7_workshop",
    "for": "any",
    "chapter": "ch3",
    "location": "deniz_workshop",
    "title": "Мастерская",
    "safe": true,
    "text": [
      {"when": {"before": 4680}, "text": "За верстаком лежит забытая перчатка Дениза. Её палец торчит из-под ящика. Ты задеваешь её ногой и вздрагиваешь."},
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "На стекле высохли полосы от ладоней. На полу под верстаком лежит тряпка, которой закрывали блестящий ключ. Ты не убираешь её сразу."
      },
      {"when": {"all": [{"after": 5040}, {"before": 5340}]}, "text": "На верстаке чужая квитанция под тяжёлой головкой ключа. От ворот тянет холодным железом."},
      {
        "when": {"after": 5340},
        "text": "На выезде из промзоны один за другим гаснут фонари. Бетон у ворот холодный, внутри ещё пахнет резиной. Заднюю дверь отсюда не видно."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_returned.result", "op": "==", "value": "outside"}, {"all": []}]}, {"before": 4860}]},
        "text": "Домкрат стоит у задней двери. Пустую бутылку вернули рядом, крышку тщательно завернули."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_returned.result", "op": "==", "value": "wipe"}, {"all": []}]}, {"before": 4860}]},
        "text": "На засове след мокрой тряпки. Снаружи её аккуратно сложили, но домкрат не оставили."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_returned.result", "op": "==", "value": "no"}, {"all": []}]}, {"before": 4860}]},
        "text": "Стук прекратился. Когда ты выглядываешь, под дверью лежит записка: «Заберите сами»."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_window.result", "op": "==", "value": "still"}, {"all": []}]}, {"before": 4860}]},
        "text": "По стеклу проходит тень и исчезает. Ты разжимаешь ладонь: ногти оставили четыре ямки."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_window.result", "op": "==", "value": "noise"}, {"all": []}]}, {"before": 4860}]},
        "text": "В пустом боксе слышен удар в железо. Теперь можно пройти к воротам, но туда, где прозвенело, идти нельзя."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_window.result", "op": "==", "value": "rear"}, {"all": []}]}, {"before": 4860}]},
        "text": "Из задней комнаты не видно окна. Каждый стук снаружи приходится угадывать по звуку."
      },
      {
        "when": {"all": [{"v": "$.c7_invoice.result", "op": "==", "value": "push"}, {"all": []}]},
        "text": "Машину вытолкнули к дороге. Человек оставил у ворот своё имя и номер: просит сказать Денизу, что вернётся."
      },
      {
        "when": {"all": [{"v": "$.c7_invoice.result", "op": "==", "value": "tools"}, {"all": []}]},
        "text": "Насос унесли. Чужой автомобиль остаётся перед боксом, но проход для человека свободен."
      },
      {
        "when": {"all": [{"v": "$.c7_invoice.result", "op": "==", "value": "point"}, {"all": []}]},
        "text": "У ворот лежит старая квитанция. Мужчина смотрит через стекло на собственную машину и ждёт хозяина."
      },
      {
        "when": {"all": [{"v": "$.c7_heater.result", "op": "==", "value": "open"}, {"all": []}]},
        "text": "Из бокса выходит мужчина, прикрывая рот рукавом. За твоей спиной захлопывается открытая скоба."
      },
      {
        "when": {"all": [{"v": "$.c7_heater.result", "op": "==", "value": "help"}, {"all": []}]},
        "text": "Пожарные выносят человека вдвоём. Тебя просят держать ворота; ни один не отпускает носилки ради засова."
      },
      {
        "when": {"all": [{"v": "$.c7_heater.result", "op": "==", "value": "air"}, {"all": []}]},
        "text": "Под щелью видны пальцы. Человек дышит у самого пола и просит не уходить."
      },
      {
        "when": {"flag": "w.c3_night_guest"},
        "text": "Человек, которого вы пустили ночью, ещё спит на вашем месте. Ты встаёшь у двери, стараясь не задеть его ботинки. Под своей спиной всё утро чувствуешь край порога."
      },
      {"when": {"flag": "w.c3_jack_lent"}, "text": "Домкрат пока у чужих. Поднимать машину без него никто не берётся."}
    ],
    "actions": [
      {
        "id": "c7_w_prints",
        "label": "Осмотреть окно с внутренней стороны",
        "minutes": 6,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_w_prints"}}, {"before": 5100}]},
        "text": "Стекло целое, следы ладоней снаружи. Ты проводишь пальцем по своей стороне и убираешь руку. Грязь не размазывается.",
        "effects": [{"set": "$.c7_w_prints", "value": true}]
      },
      {
        "id": "c7_w_cord",
        "label": "Снять провод с прохода",
        "minutes": 7,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_w_cord"}}, {"before": 5100}]},
        "text": "Провод цепляет ботинок у самого воротка. Ты подвешиваешь петлю на крюк. Дальше до двери можно пройти с занятыми руками.",
        "effects": [{"set": "$.c7_w_cord", "value": true}]
      },
      {
        "id": "c7_w_drain",
        "label": "Убрать мокрые тряпки в железный поддон",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_w_drain"}}, {"before": 5100}]},
        "text": "Тряпки пахнут маслом. Ты не складываешь их возле картона для сна. Поддон ставишь у наружной стены.",
        "effects": [{"set": "$.c7_w_drain", "value": true}]
      },
      {
        "id": "c7_w_customer",
        "label": "Проверить записку для вернувшегося клиента",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_w_customer"}}, {"before": 5100}]},
        "text": "На квитанции размок край. Ты подкладываешь сухую бумагу, чтобы не прилипла к верстаку. Фамилию переписывать за него не станешь.",
        "effects": [{"set": "$.c7_w_customer", "value": true}]
      },
      {
        "id": "c7_w_roller",
        "label": "Очистить нижний ролик от песка",
        "minutes": 12,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_w_roller"}}, {"before": 5100}]},
        "text": "Песок выходит из паза тонкой полоской. Ты вращаешь ролик рукой, не поднимая всю створку. Один оборот проходит уже без хруста.",
        "effects": [{"set": "$.c7_w_roller", "value": true}, {"body": "fatigue", "delta": 3}]
      },
      {
        "id": "c7_w_wash",
        "label": "Вымыть руки отдельно от посуды",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_w_wash"}}, {"before": 5100}]},
        "text": "Чёрные полосы не уходят с первого раза. Ты растираешь пальцы через мыло, не тратя воду струёй. Ладони становятся светлее.",
        "effects": [{"set": "$.c7_w_wash", "value": true}]
      },
      {
        "id": "c7_w_exit",
        "label": "Проверить заднюю ручку снаружи",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_w_exit"}}, {"before": 5100}]},
        "text": "Ты выходишь только на один шаг. Ручка возвращается в паз без удара. К стене спиной не прислоняешься.",
        "effects": [{"set": "$.c7_w_exit", "value": true}]
      },
      {
        "id": "c7_w_mat",
        "label": "Убрать из подстилки металлическую стружку",
        "minutes": 12,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_w_mat"}}, {"before": 5100}]},
        "text": "Стружка цепляется за ткань и блестит на свету. Ты снимаешь её картоном, не пальцами. На месте для головы больше ничего не колется.",
        "effects": [{"set": "$.c7_w_mat", "value": true}]
      },
      {
        "id": "c7_ws_door",
        "label": "Закончить направляющую ворот",
        "minutes": 0,
        "activity": "moderate",
        "repeatable": true,
        "combinable": true,
        "when": {"all": [{"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"not": {"flag": "proj.c3_ws_door.done"}}, {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}]}, {"any": [{"not": {"flag": "w.c3_jack_lent"}}, {"flag": "w.c3_jack_returned"}]}]},
        "text": "Ты проверяешь ход створки после каждого движения ключа. Створка проходит над бетоном с узким зазором. Ключ убираешь только после обратной проверки.",
        "effects": [{"work": "c3_ws_door", "hours": 1}]
      },
      {"id": "c7_ws_corner", "label": "Проверить заднюю комнату", "minutes": 2, "terminal": true, "goto": "c7_ws_corner", "effects": []},
      {
        "id": "c7_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"all": [{"before": 4680}, {"npc": "deniz", "alive": true, "at": "deniz_workshop"}]},
        "effects": [{"sleep": 360}],
        "text": "За верстаком лежит забытая перчатка Дениза. Её палец торчит из-под ящика. Ты задеваешь её ногой и вздрагиваешь."
      },
      {
        "id": "c7_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c7_invoice_approach", "label": "Выслушать владельца машины", "minutes": 1, "terminal": true, "goto": "c7_invoice", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4840}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_invoice.done"}}]}},
      {"id": "c7_heater_approach", "label": "Проверить обогреватель в соседнем боксе", "minutes": 1, "terminal": true, "goto": "c7_heater", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4955}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_heater.done"}}]}},
      {"id": "c7_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c7_cp", "when": {"all": [{"cp": 6}, {"after": 5100}]}}
    ],
    "onEnter": [
      {"if": {"all": [{"flag": "w.c3_night_guest"}, {"not": {"flag": "$.c3_guest_sleep_cost"}}]}, "then": [{"set": "$.c3_guest_sleep_cost", "value": true}, {"body": "sleepDebt", "delta": 2}]}
    ]
  },
  {
    "id": "c7_ws_corner",
    "for": "any",
    "chapter": "ch3",
    "location": "deniz_workshop",
    "title": "Задняя комната",
    "safe": true,
    "text": [
      {"when": {"before": 4680}, "text": "На задней ручке холодная изолента. Клей остаётся на пальцах. Ты отпускаешь ручку медленно, чтобы не щёлкнула защёлка."},
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "Под дверью чистая полоска пола. Кто-то сдвигал коробки ночью, но не заходил дальше верстака. Ты проверяешь защёлку со своей стороны."
      },
      {
        "when": {"all": [{"after": 5040}, {"before": 5340}]},
        "text": "Снаружи у задней двери пахнет мокрой резиной. Ключ в замке можно повернуть, не отпуская рюкзак."
      },
      {
        "when": {"after": 5340},
        "text": "За стеной тихо, как после выключенного станка. На дверном крюке висит ремень рюкзака. Ты снимаешь его, чтобы не спутать ночью."
      }
    ],
    "actions": [
      {
        "id": "c7_w_boxes",
        "label": "Поставить коробки вдоль стены",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_w_boxes"}}, {"before": 5100}]},
        "text": "Пустые коробки лёгкие и всё время падают. Ты вкладываешь меньшие в большую. У двери остаётся свободное место.",
        "effects": [{"set": "$.c7_w_boxes", "value": true}]
      },
      {
        "id": "c7_w_hook",
        "label": "Проверить шуруп крюка",
        "minutes": 7,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_w_hook"}}, {"before": 5100}]},
        "text": "Шуруп выходит на пол-оборота и снова затягивается. Дерево вокруг целое. Ты не вешаешь на него тяжёлую сумку.",
        "effects": [{"set": "$.c7_w_hook", "value": true}]
      },
      {
        "id": "c7_w_sill",
        "label": "Убрать с порога острую щепку",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_w_sill"}}, {"before": 5100}]},
        "text": "Щепка торчит ровно на высоте подошвы. Ты вытаскиваешь её плоскогубцами. Маленькую дырку в дереве видно даже без фонаря.",
        "effects": [{"set": "$.c7_w_sill", "value": true}]
      },
      {"id": "c7_back", "label": "Вернуться в бокс", "minutes": 2, "terminal": true, "goto": "c7_workshop", "effects": []},
      {
        "id": "c7_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 4680},
        "effects": [{"sleep": 360}],
        "text": "На задней ручке холодная изолента. Клей остаётся на пальцах. Ты отпускаешь ручку медленно, чтобы не щёлкнула защёлка."
      },
      {
        "id": "c7_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c7_invoice_approach", "label": "Выслушать владельца машины", "minutes": 1, "terminal": true, "goto": "c7_invoice", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4840}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_invoice.done"}}]}},
      {"id": "c7_heater_approach", "label": "Проверить обогреватель в соседнем боксе", "minutes": 1, "terminal": true, "goto": "c7_heater", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4955}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_heater.done"}}]}},
      {"id": "c7_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c7_cp", "when": {"all": [{"cp": 6}, {"after": 5100}]}}
    ]
  },
  {
    "id": "c7_ahr",
    "for": "any",
    "chapter": "ch3",
    "location": "ahrensburg",
    "title": "Ahrensburg",
    "safe": true,
    "text": [
      {"when": {"before": 4680}, "text": "Биргит оставила в коридоре чашку с водой. Ты замечаешь её босой ногой и успеваешь остановиться. Вода не пролилась."},
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "У кухонной двери две кружки с разными ручками. Между ними оставлено место для хлеба. На блюдце засохла полоска мёда."
      },
      {
        "when": {"all": [{"after": 5040}, {"before": 5340}]},
        "text": "На плите только одна кастрюля. Биргит размешивает здоровой рукой, другой придерживает край полотенца на запястье."
      },
      {"when": {"after": 5340}, "text": "Гаражная дверь закрыта изнутри. Ключ висит на низком крючке, под старой курткой. На кухне одна лампа над столом."},
      {
        "when": {"all": [{"all": [{"v": "$.c6_knives.result", "op": "==", "value": "carry"}, {"all": [{"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}]}, {"before": 4860}]},
        "text": "Уве вернулся без кастрюли. — Вернут, — говорит он Биргит. Она ставит на плиту меньшую."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_knives.result", "op": "==", "value": "door"}, {"all": [{"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}]}, {"before": 4860}]},
        "text": "Пустую кастрюлю поставили за калиткой. На ручке чужая варежка, забытая второпях."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_knives.result", "op": "==", "value": "keep"}, {"all": [{"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}]}, {"before": 4860}]},
        "text": "Биргит разливает суп своим и отодвигает одну полную миску. За ней никто не приходит."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_cooler.result", "op": "==", "value": "mark"}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}]}, {"before": 4860}]},
        "text": "Мерле закрывает дверцу быстро. — Не морозить. Просто прохладно. Это лекарство, не пельмени."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_cooler.result", "op": "==", "value": "pack"}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}]}, {"before": 4860}]},
        "text": "Сумка Мерле стоит у выхода. Она подкладывает внутрь ткань, чтобы ручки не касались холодного пакета."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_cooler.result", "op": "==", "value": "leave"}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}]}, {"before": 4860}]},
        "text": "За кухонной дверью Мерле спорит с матерью. Фраза «не открывай каждые пять минут» слышна и здесь."
      },
      {
        "when": {"all": [{"v": "$.c7_brokenpen.result", "op": "==", "value": "clean"}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}]},
        "text": "На полу чисто. Мерле считает целые ручки, а пустую коробку с разбитой держит отдельно."
      },
      {
        "when": {"all": [{"v": "$.c7_brokenpen.result", "op": "==", "value": "sit"}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}]},
        "text": "Мерле садится рядом с тобой. — Запасная была. Теперь это та, которую нельзя разбить."
      },
      {
        "when": {"all": [{"v": "$.c7_brokenpen.result", "op": "==", "value": "parents"}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}]},
        "text": "Биргит поднимает осколок через полотенце. Мерле просит её не говорить «ничего страшного»."
      },
      {
        "when": {"all": [{"v": "$.c7_oven.result", "op": "==", "value": "kitchen"}, {"all": [{"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]}]},
        "text": "Биргит сидит у окна с поднятой рукой. Она дважды собирается встать к тебе и дважды остаётся."
      },
      {
        "when": {"all": [{"v": "$.c7_oven.result", "op": "==", "value": "dressing"}, {"all": [{"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]}]},
        "text": "На руке Биргит твоя повязка. Ручку кастрюли теперь берёт Уве, не дожидаясь просьбы."
      },
      {
        "when": {"all": [{"v": "$.c7_oven.result", "op": "==", "value": "floor"}, {"all": [{"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]}]},
        "text": "Пол вытерт. Биргит и Уве работают у плиты вдвоём; она указывает здоровой рукой."
      },
      {
        "when": {"flag": "w.c3_night_guest"},
        "text": "Человек, которого вы пустили ночью, ещё спит на вашем месте. Ты встаёшь у двери, стараясь не задеть его ботинки. Под своей спиной всё утро чувствуешь край порога."
      }
    ],
    "actions": [
      {
        "id": "c7_h_kettle",
        "label": "Налить Биргит воду в чайник",
        "minutes": 7,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c7_h_kettle"}}, {"before": 5100}]}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]},
        "text": "Ты держишь чайник обеими руками. Биргит только показывает, до какого уровня налить. Крышку закрываешь, прежде чем поставить.",
        "effects": [{"set": "$.c7_h_kettle", "value": true}]
      },
      {
        "id": "c7_h_floor",
        "label": "Проверить кухонный пол после стекла",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_h_floor"}}, {"before": 5100}]},
        "text": "Ты светишь вдоль плитки, не сверху. У ножки стула блестит осколок. Его поднимаешь плотной бумагой.",
        "effects": [{"set": "$.c7_h_floor", "value": true}]
      },
      {
        "id": "c7_h_merle",
        "label": "Спросить Мерле, нужна ли помощь",
        "minutes": 12,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c7_h_merle"}}, {"before": 5100}]}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]},
        "text": "— Нужна, но не с этим, — говорит она, убирая лекарство. Протягивает тебе банку с тугой крышкой. Крышку ты открываешь без разговора.",
        "effects": [{"set": "$.c7_h_merle", "value": true}, {"npc": "merle", "trust": 4}]
      },
      {
        "id": "c7_h_uwe",
        "label": "Подержать доску для Уве",
        "minutes": 12,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c7_h_uwe"}}, {"before": 5100}]}, {"npc": "uwe", "alive": true, "at": "ahrensburg"}]},
        "text": "Он показывает линию карандашом и просит держать дальше от зубьев. После распила отдаёт тебе короткий край. Из него получится клин, не мусор.",
        "effects": [{"set": "$.c7_h_uwe", "value": true}, {"npc": "uwe", "trust": 4}]
      },
      {
        "id": "c7_h_towels",
        "label": "Развесить чистую ткань повыше",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c7_h_towels"}}, {"before": 5100}]}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]},
        "text": "Биргит не приходится поднимать больную руку. Ты закрепляешь ткань двумя прищепками. Нижний край не достаёт до батареи.",
        "effects": [{"set": "$.c7_h_towels", "value": true}]
      },
      {
        "id": "c7_h_soup",
        "label": "Разлить еду за Биргит",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c7_h_soup"}}, {"before": 5100}]}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]},
        "text": "Она поправляет тебя только на последней тарелке: себе слишком мало. Ты добавляешь. Биргит накрывает кастрюлю здоровой рукой.",
        "effects": [{"set": "$.c7_h_soup", "value": true}]
      },
      {
        "id": "c7_h_crate",
        "label": "Освободить проход к гаражу",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_h_crate"}}, {"before": 5100}]},
        "text": "Ящик с пустыми банками звенит на каждом шаге. Ты ставишь его у глухой стены. Через дверь снова можно пройти прямо.",
        "effects": [{"set": "$.c7_h_crate", "value": true}]
      },
      {
        "id": "c7_h_window",
        "label": "Закрыть маленькую форточку",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_h_window"}}, {"before": 5100}]},
        "text": "Из кухни уходит запах мокрой ткани. Ты закрываешь форточку, оставляя сухой край занавески снаружи ручки. Ничего не зажато.",
        "effects": [{"set": "$.c7_h_window", "value": true}]
      },
      {"id": "c7_ahr_hall", "label": "Проверить прихожую", "minutes": 2, "terminal": true, "goto": "c7_ahr_hall", "effects": []},
      {
        "id": "c7_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"all": [{"before": 4680}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]},
        "effects": [{"sleep": 360}],
        "text": "Биргит оставила в коридоре чашку с водой. Ты замечаешь её босой ногой и успеваешь остановиться. Вода не пролилась."
      },
      {
        "id": "c7_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c7_brokenpen_approach", "label": "Подойти к звону на кухне", "minutes": 1, "terminal": true, "goto": "c7_brokenpen", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4770}, {"before": 5150}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}, {"not": {"flag": "$.c7_brokenpen.done"}}]}},
      {"id": "c7_oven_approach", "label": "Подойти к Биргит у мойки", "minutes": 1, "terminal": true, "goto": "c7_oven", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 5000}, {"before": 5150}, {"all": [{"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]}, {"not": {"flag": "$.c7_oven.done"}}]}},
      {"id": "c7_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c7_cp", "when": {"all": [{"cp": 6}, {"after": 5100}]}}
    ],
    "onEnter": [
      {"if": {"all": [{"flag": "w.c3_night_guest"}, {"not": {"flag": "$.c3_guest_sleep_cost"}}]}, "then": [{"set": "$.c3_guest_sleep_cost", "value": true}, {"body": "sleepDebt", "delta": 2}]}
    ]
  },
  {
    "id": "c7_ahr_hall",
    "for": "any",
    "chapter": "ch3",
    "location": "ahrensburg",
    "title": "Прихожая",
    "safe": true,
    "text": [
      {"when": {"before": 4680}, "text": "На коврике засох ком земли с чужой подошвы. Ты отодвигаешь его ногой от прохода. Мелочь хрустит слишком громко."},
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "На вешалке чужой свитер поверх старой куртки. Край рукава ещё мокрый. Под ними стоит сумка с фонарём."
      },
      {"when": {"all": [{"after": 5040}, {"before": 5340}]}, "text": "Уве поставил сумку у выхода, не пряча в шкаф. Внутри звякает фонарь о металлическую кружку."},
      {"when": {"after": 5340}, "text": "Коврик у двери сухой только у стены. Ты разворачиваешь обувь носками к выходу. С подошвы отпадает маленький комок земли."}
    ],
    "actions": [
      {
        "id": "c7_h_lock",
        "label": "Повернуть запор при Уве",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c7_h_lock"}}, {"before": 5100}]}, {"npc": "uwe", "alive": true, "at": "ahrensburg"}]},
        "text": "Запор ходит без скрипа. Уве просит ещё раз обратно, медленнее. Ключ остаётся внутри.",
        "effects": [{"set": "$.c7_h_lock", "value": true}]
      },
      {
        "id": "c7_h_bag",
        "label": "Поднять сумку за обе ручки",
        "minutes": 6,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_h_bag"}}, {"before": 5100}]},
        "text": "Шов на одной ручке цел. На второй вылезла нитка. Ты разворачиваешь сумку так, чтобы за неё больше не тянули одной рукой.",
        "effects": [{"set": "$.c7_h_bag", "value": true}]
      },
      {
        "id": "c7_h_mat",
        "label": "Вынести мокрый коврик под навес",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c7_h_mat"}}, {"before": 5100}]}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]},
        "text": "Коврик тяжёлый, но вода с него уже не течёт. Ты вешаешь краем на перила. Биргит не придётся обходить лужу ночью.",
        "effects": [{"set": "$.c7_h_mat", "value": true}]
      },
      {"id": "c7_back", "label": "Вернуться на кухню", "minutes": 2, "terminal": true, "goto": "c7_ahr", "effects": []},
      {
        "id": "c7_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 4680},
        "effects": [{"sleep": 360}],
        "text": "На коврике засох ком земли с чужой подошвы. Ты отодвигаешь его ногой от прохода. Мелочь хрустит слишком громко."
      },
      {
        "id": "c7_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c7_brokenpen_approach", "label": "Подойти к звону на кухне", "minutes": 1, "terminal": true, "goto": "c7_brokenpen", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4770}, {"before": 5150}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}, {"not": {"flag": "$.c7_brokenpen.done"}}]}},
      {"id": "c7_oven_approach", "label": "Подойти к Биргит у мойки", "minutes": 1, "terminal": true, "goto": "c7_oven", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 5000}, {"before": 5150}, {"all": [{"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]}, {"not": {"flag": "$.c7_oven.done"}}]}},
      {"id": "c7_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c7_cp", "when": {"all": [{"cp": 6}, {"after": 5100}]}}
    ]
  },
  {
    "id": "c7_north",
    "for": "any",
    "chapter": "ch3",
    "location": "north_gym",
    "title": "Спортзал",
    "safe": true,
    "text": [
      {"when": {"before": 4680}, "text": "Под кольцом в темноте качается подвешенная куртка. На полу у её рукава лежит детский кроссовок. Никто не подходит."},
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "Под баскетбольным щитом уже заняты вчерашние пустые маты. У двери пахнет автобусом и мокрой одеждой. Хинрихсен держит термометр в открытом кармане."
      },
      {
        "when": {"all": [{"after": 5040}, {"before": 5340}]},
        "text": "У входа развешивают сухие одеяла. Хинрихсен отодвигает их от обогревателя ладонью, проверяя расстояние."
      },
      {"when": {"after": 5340}, "text": "Хинрихсен проходит между матами без верхней куртки. На рукаве след от лямки чужой сумки. Свет выключают по половине зала."},
      {
        "when": {"all": [{"all": [{"v": "$.c6_doorline.result", "op": "==", "value": "shift"}, {"all": []}]}, {"before": 4860}]},
        "text": "На улице холоднее, чем казалось из зала. Дежурная приносит тебе кружку, не спрашивая фамилию."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_doorline.result", "op": "==", "value": "space"}, {"all": []}]}, {"before": 4860}]},
        "text": "Чужая раскладушка вплотную к твоей. Её хозяйка старается не повернуться, чтобы не толкнуть тебя."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_doorline.result", "op": "==", "value": "limit"}, {"all": []}]}, {"before": 4860}]},
        "text": "Людей ведут обратно к автобусу. У двери осталась мокрая детская варежка."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_burner.result", "op": "==", "value": "fair"}, {"all": []}]}, {"before": 4860}]},
        "text": "В каждой миске понемногу. Женщина с последней миской смотрит на половник и кивает тебе."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_burner.result", "op": "==", "value": "give"}, {"all": []}]}, {"before": 4860}]},
        "text": "Твою порцию уносят к дальним матам. Следующая раздача только утром."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_burner.result", "op": "==", "value": "mine"}, {"all": []}]}, {"before": 4860}]},
        "text": "Ты ешь, повернувшись к стене. За спиной спрашивают, осталось ли хоть что-нибудь."
      },
      {
        "when": {"all": [{"v": "$.c7_bus.result", "op": "==", "value": "tent"}, {"all": []}]},
        "text": "Людей ведут под отдельный тент. Женщина из автобуса смотрит на тёплый зал и не отпускает поручень."
      },
      {
        "when": {"all": [{"v": "$.c7_bus.result", "op": "==", "value": "reunite"}, {"all": []}]},
        "text": "Мать и дочь сидят у края мата. Между ними две сумки, но держатся они за руки поверх них."
      },
      {
        "when": {"all": [{"v": "$.c7_bus.result", "op": "==", "value": "door"}, {"all": []}]},
        "text": "Ты держишь дверь вместе с местным. Снаружи кто-то стучит в стекло открытой ладонью."
      },
      {
        "when": {"all": [{"v": "$.c7_socks.result", "op": "==", "value": "cloth"}, {"all": []}]},
        "text": "Твоё полотенце прикрывает мокрое место. Мужчина поднимает глаза, только когда ты отворачиваешься."
      },
      {
        "when": {"all": [{"v": "$.c7_socks.result", "op": "==", "value": "wash"}, {"all": []}]},
        "text": "Бельё сохнет у вентилятора. Женщина из DRK ставит тебе воду без очереди, пока ты отжимаешь последнее."
      },
      {
        "when": {"all": [{"v": "$.c7_socks.result", "op": "==", "value": "wait"}, {"all": []}]},
        "text": "Дежурная принесла пакет. Мужчина ждёт, пока она уйдёт, прежде чем снять грязное бельё."
      },
      {
        "when": {"flag": "w.c3_night_guest"},
        "text": "Человек, которого вы пустили ночью, ещё спит на вашем месте. Ты встаёшь у двери, стараясь не задеть его ботинки. Под своей спиной всё утро чувствуешь край порога."
      }
    ],
    "actions": [
      {
        "id": "c7_n_cable",
        "label": "Убрать провод от мокрых ботинок",
        "minutes": 6,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_n_cable"}}, {"before": 5100}]},
        "text": "Провод идёт вдоль самых мокрых следов. Ты подвешиваешь его на спинку сухого стула. Вилку не трогаешь.",
        "effects": [{"set": "$.c7_n_cable", "value": true}]
      },
      {
        "id": "c7_n_mats",
        "label": "Освободить узкий проход между матами",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_n_mats"}}, {"before": 5100}]},
        "text": "Край мата заходит на соседний. Ты поднимаешь его, а не тянешь по чужим вещам. Мальчик рядом сразу подбирает свою обувь.",
        "effects": [{"set": "$.c7_n_mats", "value": true}]
      },
      {
        "id": "c7_n_jug",
        "label": "Принести пустую ёмкость к умывальнику",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_n_jug"}}, {"before": 5100}]},
        "text": "Дежурная ставит ёмкость под протекающий стык. Капли звонко бьют по дну. Наполняется медленно, но без лужи.",
        "effects": [{"set": "$.c7_n_jug", "value": true}]
      },
      {
        "id": "c7_n_pins",
        "label": "Вернуть прищепки в кухонный ящик",
        "minutes": 6,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_n_pins"}}, {"before": 5100}]},
        "text": "Прищепки развешаны на сухом краю ткани. Ты снимаешь только свободные. Одной рукой дежурная показывает ящик, другой держит крышку котла.",
        "effects": [{"set": "$.c7_n_pins", "value": true}]
      },
      {
        "id": "c7_n_translate",
        "label": "Помочь человеку понять объявление",
        "minutes": 12,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_n_translate"}}, {"before": 5100}]},
        "text": "Ты повторяешь время раздачи медленно, показывая на часы. Он повторяет цифры. На этот раз вы киваете одновременно.",
        "effects": [{"set": "$.c7_n_translate", "value": true}]
      },
      {
        "id": "c7_n_bedleg",
        "label": "Подложить дерево под ножку койки",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_n_bedleg"}}, {"before": 5100}]},
        "text": "Под ножкой зажата сложенная картонка. Человек садится проверить, не глядя на тебя. Потом тихо говорит «держит».",
        "effects": [{"set": "$.c7_n_bedleg", "value": true}]
      },
      {
        "id": "c7_n_plate",
        "label": "Отнести пустые миски к мойке",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_n_plate"}}, {"before": 5100}]},
        "text": "Миски скользят друг по другу. Ты несёшь не стопку до подбородка, а по три. У мойки ждут, пока ты поставишь последнюю.",
        "effects": [{"set": "$.c7_n_plate", "value": true}]
      },
      {
        "id": "c7_n_shawl",
        "label": "Вернуть одеяло со ступеней",
        "minutes": 6,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_n_shawl"}}, {"before": 5100}]},
        "text": "Одеяло цепляется за дверной край. Ты освобождаешь его двумя руками. На ткани остаётся след, но она не рвётся.",
        "effects": [{"set": "$.c7_n_shawl", "value": true}]
      },
      {"id": "c7_north_door", "label": "Выйти к боковой двери", "minutes": 2, "terminal": true, "goto": "c7_north_door", "effects": []},
      {
        "id": "c7_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 4680},
        "effects": [{"sleep": 360}],
        "text": "Под кольцом в темноте качается подвешенная куртка. На полу у её рукава лежит детский кроссовок. Никто не подходит."
      },
      {
        "id": "c7_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c7_bus_approach", "label": "Подойти к прибывшему автобусу", "minutes": 1, "terminal": true, "goto": "c7_bus", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4850}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_bus.done"}}]}},
      {"id": "c7_socks_approach", "label": "Подойти к медику у ширмы", "minutes": 1, "terminal": true, "goto": "c7_socks", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 5020}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_socks.done"}}]}},
      {"id": "c7_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c7_cp", "when": {"all": [{"cp": 6}, {"after": 5100}]}}
    ],
    "onEnter": [
      {"if": {"all": [{"flag": "w.c3_night_guest"}, {"not": {"flag": "$.c3_guest_sleep_cost"}}]}, "then": [{"set": "$.c3_guest_sleep_cost", "value": true}, {"body": "sleepDebt", "delta": 2}]}
    ]
  },
  {
    "id": "c7_north_door",
    "for": "any",
    "chapter": "ch3",
    "location": "north_gym",
    "title": "Боковая дверь",
    "safe": true,
    "text": [
      {"when": {"before": 4680}, "text": "У боковой двери лежат два кирпича. Один сдвинут к петле. Ты возвращаешь его к стене носком ботинка."},
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "У ступенек след автобусной покрышки. На конце следа тёмный песок, высыпанный для нескользкого прохода. Пустые носилки стоят подальше."
      },
      {"when": {"all": [{"after": 5040}, {"before": 5340}]}, "text": "За стеклом стоят пустые носилки. На ручке бирка без имени. Её поворачивает ветер."},
      {"when": {"after": 5340}, "text": "Колокольчик лежит у стула, не висит. Ты поднимаешь его за ремешок. В зале сразу оборачивается дежурная."}
    ],
    "actions": [
      {
        "id": "c7_n_sand",
        "label": "Распределить песок по ступеньке",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_n_sand"}}, {"before": 5100}]},
        "text": "Песок собрался у одного края. Ты разметаешь его жёсткой щёткой. Подошва теперь не скользит по середине.",
        "effects": [{"set": "$.c7_n_sand", "value": true}]
      },
      {
        "id": "c7_n_handle",
        "label": "Проверить, не зажата ли ручка тканью",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_n_handle"}}, {"before": 5100}]},
        "text": "Ткань попала под ручку, пока сушили одеяло. Ты освобождаешь её. Дверь открывается в одну сторону без усилия.",
        "effects": [{"set": "$.c7_n_handle", "value": true}]
      },
      {
        "id": "c7_n_water",
        "label": "Убрать воду из-под стула дежурного",
        "minutes": 7,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_n_water"}}, {"before": 5100}]},
        "text": "Ножки стула уже мокрые. Ты двигаешь его на сухую плитку. Ведро оставляешь так, чтобы не перекрыть дверь.",
        "effects": [{"set": "$.c7_n_water", "value": true}]
      },
      {"id": "c7_back", "label": "Вернуться к матам", "minutes": 2, "terminal": true, "goto": "c7_north", "effects": []},
      {
        "id": "c7_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 4680},
        "effects": [{"sleep": 360}],
        "text": "У боковой двери лежат два кирпича. Один сдвинут к петле. Ты возвращаешь его к стене носком ботинка."
      },
      {
        "id": "c7_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c7_bus_approach", "label": "Подойти к прибывшему автобусу", "minutes": 1, "terminal": true, "goto": "c7_bus", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4850}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_bus.done"}}]}},
      {"id": "c7_socks_approach", "label": "Подойти к медику у ширмы", "minutes": 1, "terminal": true, "goto": "c7_socks", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 5020}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_socks.done"}}]}},
      {"id": "c7_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c7_cp", "when": {"all": [{"cp": 6}, {"after": 5100}]}}
    ]
  },
  {
    "id": "c7_coop",
    "for": "any",
    "chapter": "ch3",
    "location": "farm_coop",
    "title": "Старый курятник",
    "safe": true,
    "text": [
      {
        "when": {"before": 4680},
        "text": "В кирпичной стене потрескивает остывающий шов. Ты меняешь бок и находишь ладонью сухое место под подушкой. За дверью слышно дыхание спящей собаки."
      },
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "На соломе виден тёмный след от вчерашней воды. Сухая половина уже, чем казалась ночью. Под дверью белеет новый мешок."
      },
      {
        "when": {"all": [{"after": 5040}, {"before": 5340}]},
        "text": "За стеной чистят сапоги о край кирпича. Мимо твоей двери проходят несколько раз, не останавливаясь."
      },
      {"when": {"after": 5340}, "text": "Снаружи ставят чистую миску на перевёрнутую дощечку. Ложка лежит ручкой к двери. От неё пахнет горячим металлом."},
      {
        "when": {"all": [{"all": [{"v": "$.c6_voice.result", "op": "==", "value": "wait"}, {"all": [{"npc": "kerem", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]}]}, {"before": 4860}]},
        "text": "За стеной Керем перестаёт плакать. — До утра, — повторяет он. — Ты только брату скажи, чтоб пришёл."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_voice.result", "op": "==", "value": "brother"}, {"all": [{"npc": "kerem", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]}]}, {"before": 4860}]},
        "text": "Братья говорят за дверью вполголоса. Один раз Дениз говорит громко: — Один не пойдёшь."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_voice.result", "op": "==", "value": "secret"}, {"all": [{"npc": "kerem", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]}]}, {"before": 4860}]},
        "text": "Керем обходит кухню стороной. Проходя мимо твоей двери, прикладывает палец к губам."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_candle.result", "op": "==", "value": "water"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}, {"before": 4860}]},
        "text": "Из промоченной соломы тянет холодом. Свечу унесли; свою пустую бутылку ты держишь на коленях."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_candle.result", "op": "==", "value": "lift"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}, {"before": 4860}]},
        "text": "На железном листе чёрная солома. Под рукавом саднит запястье, и ты стараешься не сгибать руку."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_candle.result", "op": "==", "value": "call"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}, {"before": 4860}]},
        "text": "Хенрике приносит ведро и заливает угол. Нары мокрые; сухим осталось только место у двери."
      },
      {
        "when": {"all": [{"v": "$.c7_bedding.result", "op": "==", "value": "self"}, {"all": [{"npc": "pawel", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "На пороге лежит вынесенная солома. Хенрике смотрит на твою повязку: её придётся сменить."
      },
      {
        "when": {"all": [{"v": "$.c7_bedding.result", "op": "==", "value": "ask"}, {"all": [{"npc": "pawel", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "Павел уносит мокрую солому. Старается работать левой рукой, правую держит прижатой к груди."
      },
      {
        "when": {"all": [{"v": "$.c7_bedding.result", "op": "==", "value": "half"}, {"all": [{"npc": "pawel", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "Ты лежишь боком на сухом краю. Перевернуться можно только на мокрое."
      },
      {
        "when": {"all": [{"v": "$.c7_scrape.result", "op": "==", "value": "share"}, {"all": [{"npc": "c3_koehler", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "За досками слышно, как устраивается Кёлер. Сухой подстилки тебе осталось на одно плечо."
      },
      {
        "when": {"all": [{"v": "$.c7_scrape.result", "op": "==", "value": "rule"}, {"all": [{"npc": "c3_koehler", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "Кёлер отходит от двери, услышав твой отказ. Хенрике ведёт её к сараю, не споря при тебе."
      },
      {
        "when": {"all": [{"v": "$.c7_scrape.result", "op": "==", "value": "quiet"}, {"all": [{"npc": "c3_koehler", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "Хенрике сама приносит солому. — Тут не склад, — говорит она Кёлер. — Обойдём с другой стороны."
      }
    ],
    "actions": [
      {
        "id": "c7_c_mattress",
        "label": "Проверить сухую сторону тюфяка",
        "minutes": 6,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_c_mattress"}}, {"before": 5100}]},
        "text": "Ты поднимаешь одеяло только за край. Сухая солома светлее мокрой. На неё перекладываешь вещи, не сам{m:|а} ложишься.",
        "effects": [{"set": "$.c7_c_mattress", "value": true}]
      },
      {
        "id": "c7_c_seam",
        "label": "Заткнуть нижнюю щель в стене",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_c_seam"}}, {"before": 5100}]},
        "text": "Ткань держится между двумя кирпичами. Ткань вздувается от сквозняка снаружи. Верхнюю щель ты оставляешь для воздуха.",
        "effects": [{"set": "$.c7_c_seam", "value": true}]
      },
      {
        "id": "c7_c_cup",
        "label": "Вымыть кружку отдельно от ведра",
        "minutes": 7,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_c_cup"}}, {"before": 5100}]},
        "text": "В кружке осталась на дне травинка. Ты выливаешь воду в ведро, не обратно в бутылку. Чистую кружку ставишь на сухую доску.",
        "effects": [{"set": "$.c7_c_cup", "value": true}]
      },
      {
        "id": "c7_c_coat",
        "label": "Распустить мокрый рукав куртки",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_c_coat"}}, {"before": 5100}]},
        "text": "Манжета слиплась от воды. Ты выворачиваешь край, не разрывая ткань. Рукав перестаёт касаться стены.",
        "effects": [{"set": "$.c7_c_coat", "value": true}]
      },
      {
        "id": "c7_c_message",
        "label": "Сказать Хенрике про холодную стену",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c7_c_message"}}, {"before": 5100}]}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]},
        "text": "Ты объясняешь через дверь, где мокро. Снаружи постукивают по кирпичу. Хенрике велит отодвинуть нары от стены на ладонь.",
        "effects": [{"set": "$.c7_c_message", "value": true}]
      },
      {
        "id": "c7_c_step",
        "label": "Убрать ведро с пути к двери",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_c_step"}}, {"before": 5100}]},
        "text": "Ведро задевает край нар. Ты переставляешь его туда, где можно дотянуться, не спуская ног. У двери остаётся только миска.",
        "effects": [{"set": "$.c7_c_step", "value": true}]
      },
      {
        "id": "c7_c_voice",
        "label": "Поговорить с Павлом снаружи",
        "minutes": 12,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c7_c_voice"}}, {"before": 5100}]}, {"npc": "pawel", "alive": true, "at": "hof_luedemann"}]},
        "text": "Павел рассказывает, как сушил сено в прошлую сырую осень. Голос держит совсем близко к щели. Когда уходит, говорит «до вечера», не «прощай».",
        "effects": [{"set": "$.c7_c_voice", "value": true}, {"npc": "pawel", "trust": 4}]
      },
      {
        "id": "c7_c_breath",
        "label": "Открыть верхнюю щель на несколько минут",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_c_breath"}}, {"before": 5100}]},
        "text": "Свежий воздух сначала пахнет дымом, потом полем. Ты закрываешь щель, когда холод касается лица. Свечу отставляешь раньше сквозняка.",
        "effects": [{"set": "$.c7_c_breath", "value": true}]
      },
      {"id": "c7_coop_wall", "label": "Перейти к сухой стене", "minutes": 2, "terminal": true, "goto": "c7_coop_wall", "effects": []},
      {
        "id": "c7_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 4680},
        "effects": [{"sleep": 360}],
        "text": "В кирпичной стене потрескивает остывающий шов. Ты меняешь бок и находишь ладонью сухое место под подушкой. За дверью слышно дыхание спящей собаки."
      },
      {
        "id": "c7_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c7_bedding_approach", "label": "Ответить на скрип у порога", "minutes": 1, "terminal": true, "goto": "c7_bedding", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4820}, {"before": 5150}, {"all": [{"npc": "pawel", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c7_bedding.done"}}]}},
      {"id": "c7_scrape_approach", "label": "Прислушаться к чужим шагам", "minutes": 1, "terminal": true, "goto": "c7_scrape", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4980}, {"before": 5150}, {"all": [{"npc": "c3_koehler", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c7_scrape.done"}}]}},
      {"id": "c7_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c7_cp", "when": {"all": [{"cp": 6}, {"after": 5100}]}}
    ]
  },
  {
    "id": "c7_coop_wall",
    "for": "any",
    "chapter": "ch3",
    "location": "farm_coop",
    "title": "У сухой стены",
    "safe": true,
    "text": [
      {"when": {"before": 4680}, "text": "Сухой кирпич холодит спину через куртку. Из дверной щели сюда не доходит свет. Ты находишь ремень на ощупь."},
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "На сухом кирпиче светлое пятно от старой полки. Здесь можно прислониться, не намочив куртку. До двери отсюда слышно лучше."
      },
      {"when": {"all": [{"after": 5040}, {"before": 5340}]}, "text": "Через кирпич слышно, как подвигают вёдра. На нарах сухо только с этой стороны."},
      {"when": {"after": 5340}, "text": "На стену ложится узкая полоска из дверной щели. Ты видишь, как мимо проносит сапоги Оле. Он не останавливается."}
    ],
    "actions": [
      {
        "id": "c7_c_board",
        "label": "Подложить сухую доску под вещи",
        "minutes": 7,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_c_board"}}, {"before": 5100}]},
        "text": "На доске старая белая краска. Ты ставишь рюкзак так, чтобы не прижать крошки к молнии. Под ремнём сухая доска.",
        "effects": [{"set": "$.c7_c_board", "value": true}]
      },
      {
        "id": "c7_c_sleeve",
        "label": "Отделить влажную ткань от чистого",
        "minutes": 7,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_c_sleeve"}}, {"before": 5100}]},
        "text": "Мокрую ткань сворачиваешь наружной стороной внутрь. Кладёшь отдельно от перевязок. Кружка остаётся на чистом краю.",
        "effects": [{"set": "$.c7_c_sleeve", "value": true}]
      },
      {
        "id": "c7_c_mark",
        "label": "Запомнить выступающий кирпич",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_c_mark"}}, {"before": 5100}]},
        "text": "Ты касаешься его плечом, потом переступаешь в темноте. До двери теперь можно дойти, не ударившись бедром. Кирпич не шатается.",
        "effects": [{"set": "$.c7_c_mark", "value": true}]
      },
      {"id": "c7_back", "label": "Вернуться к нарам", "minutes": 2, "terminal": true, "goto": "c7_coop", "effects": []},
      {
        "id": "c7_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 4680},
        "effects": [{"sleep": 360}],
        "text": "Сухой кирпич холодит спину через куртку. Из дверной щели сюда не доходит свет. Ты находишь ремень на ощупь."
      },
      {
        "id": "c7_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c7_bedding_approach", "label": "Ответить на скрип у порога", "minutes": 1, "terminal": true, "goto": "c7_bedding", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4820}, {"before": 5150}, {"all": [{"npc": "pawel", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c7_bedding.done"}}]}},
      {"id": "c7_scrape_approach", "label": "Прислушаться к чужим шагам", "minutes": 1, "terminal": true, "goto": "c7_scrape", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4980}, {"before": 5150}, {"all": [{"npc": "c3_koehler", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c7_scrape.done"}}]}},
      {"id": "c7_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c7_cp", "when": {"all": [{"cp": 6}, {"after": 5100}]}}
    ]
  },
  {
    "id": "c7_out",
    "for": "any",
    "chapter": "ch3",
    "title": "Временное укрытие",
    "safe": false,
    "text": [
      {
        "when": {"before": 4680},
        "text": "Под головой жёсткий шов рюкзака. В темноте кто-то проходит мимо укрытия и не останавливается. Ты держишь ладонь на застёжке."
      },
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "Картон у входа смят чужими подошвами. Сухой край под стеной ещё цел. Ты разворачиваешь рюкзак застёжкой к коленям."
      },
      {
        "when": {"all": [{"after": 5040}, {"before": 5340}]},
        "text": "Свет на углу уже не достигает твоего рюкзака. Ты поворачиваешь его застёжкой к себе и подбираешь свободный ремень."
      },
      {
        "when": {"after": 5340},
        "text": "На дороге всё меньше машин и больше шагов. Ремень рюкзака проходит вокруг запястья. Кружку убираешь внутрь, чтобы не звякнула."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_box.result", "op": "==", "value": "wait"}, {"all": []}]}, {"before": 4860}]},
        "text": "Женщина забирает коробку и долго ищет в кармане благодарность. Ты просишь просто убрать её с прохода."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_box.result", "op": "==", "value": "carry"}, {"all": []}]}, {"before": 4860}]},
        "text": "После чужой коробки ремень своего рюкзака режет то же плечо. Женщина машет тебе от следующего дома."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_box.result", "op": "==", "value": "refuse"}, {"all": []}]}, {"before": 4860}]},
        "text": "На месте коробки сухой квадрат. Женщина унесла её сама, волоча угол по земле."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_cold.result", "op": "==", "value": "shelter"}, {"all": []}]}, {"before": 4860}]},
        "text": "Человек спит в твоём сухом углу. Тебе достаётся место ближе к ветру."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_cold.result", "op": "==", "value": "water"}, {"all": []}]}, {"before": 4860}]},
        "text": "Твою бутылку держат под курткой обеими руками. Горлышко человек пока не может открыть."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_cold.result", "op": "==", "value": "service"}, {"all": []}]}, {"before": 4860}]},
        "text": "Дежурный увёл человека под локоть. На бетоне осталась мокрая полоса от его брюк."
      },
      {
        "when": {"all": [{"v": "$.c7_whistle.result", "op": "==", "value": "tool"}, {"all": []}]},
        "text": "Курьер пробует педаль стоя. Поднимает руку тебе, прежде чем выехать из двора."
      },
      {
        "when": {"all": [{"v": "$.c7_whistle.result", "op": "==", "value": "carry"}, {"all": []}]},
        "text": "Чужой пакет тяжёлый только с одного края. Получатель пересчитывает коробки при тебе, не приглашая внутрь."
      },
      {
        "when": {"all": [{"v": "$.c7_whistle.result", "op": "==", "value": "point"}, {"all": []}]},
        "text": "Курьер уходит, ведя велосипед рядом. У показанного тобой двора снова свистит."
      },
      {
        "when": {"all": [{"v": "$.c7_shawl.result", "op": "==", "value": "save"}, {"all": []}]},
        "text": "Шарф лежит в сухой нише. Вернувшийся человек берёт его, долго смотрит на тебя и молча надевает."
      },
      {
        "when": {"all": [{"v": "$.c7_shawl.result", "op": "==", "value": "ask"}, {"all": []}]},
        "text": "У дежурного записано, где остались вещи. Он обещает спросить у следующей смены, но не говорит, что человек жив."
      },
      {
        "when": {"all": [{"v": "$.c7_shawl.result", "op": "==", "value": "leave"}, {"all": []}]},
        "text": "Шарф промок насквозь. Когда поднимается ветер, кружка скатывается с него и звенит."
      }
    ],
    "actions": [
      {
        "id": "c7_o_dry",
        "label": "Отделить сухой картон от мокрого",
        "minutes": 7,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_o_dry"}}, {"before": 5100}]},
        "text": "Мокрый лист прилип к следующему. Ты снимаешь его по краю, не рвёшь оба сразу. Сухое складываешь под спину.",
        "effects": [{"set": "$.c7_o_dry", "value": true}]
      },
      {
        "id": "c7_o_strap",
        "label": "Укоротить свободный ремень",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_o_strap"}}, {"before": 5100}]},
        "text": "Ремень волочится по земле. Ты продеваешь конец обратно в пряжку. Теперь поднять рюкзак можно, не поймав за стену петлёй.",
        "effects": [{"set": "$.c7_o_strap", "value": true}]
      },
      {
        "id": "c7_o_water",
        "label": "Проверить крышку своей бутылки",
        "minutes": 4,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_o_water"}}, {"before": 5100}]},
        "text": "Крышка сухая, кольцо не порвано. Ты ставишь бутылку дальше от холодной стены. На пластике остаётся след от ладони.",
        "effects": [{"set": "$.c7_o_water", "value": true}]
      },
      {
        "id": "c7_o_boots",
        "label": "Расправить носок внутри ботинка",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_o_boots"}}, {"before": 5100}]},
        "text": "Носок собрался складкой под пяткой. Ты расправляешь его, пока нога ещё тёплая. Сразу становится легче поставить стопу ровно.",
        "effects": [{"set": "$.c7_o_boots", "value": true}]
      },
      {
        "id": "c7_o_courier",
        "label": "Запомнить указанный курьером поворот",
        "minutes": 6,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_o_courier"}}, {"before": 5100}]},
        "text": "Поворот отмечен зелёной дверью без вывески. Ты видишь его от стены и не уходишь за него проверять. До темноты этот край ещё различим.",
        "effects": [{"set": "$.c7_o_courier", "value": true}]
      },
      {
        "id": "c7_o_hand",
        "label": "Отмыть грязь с ладоней",
        "minutes": 7,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_o_hand"}}, {"before": 5100}]},
        "text": "Ты вытираешь пальцы по одному чистым краем ткани. Грязь под ногтями остаётся. Не трогаешь ими лицо.",
        "effects": [{"set": "$.c7_o_hand", "value": true}]
      },
      {
        "id": "c7_o_shadow",
        "label": "Проверить тень на подходе",
        "minutes": 6,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_o_shadow"}}, {"before": 5100}]},
        "text": "Тень движется только от ветра, вместе с оборванной тканью. Ты находишь глазами её край. Ладонь понемногу разжимается на пряжке.",
        "effects": [{"set": "$.c7_o_shadow", "value": true}]
      },
      {
        "id": "c7_o_hood",
        "label": "Подтянуть ворот перед ветром",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_o_hood"}}, {"before": 5100}]},
        "text": "Шнурок вытягивается неравномерно. Ты ослабляешь один край, чтобы ткань не давила на горло. Уши наконец под капюшоном.",
        "effects": [{"set": "$.c7_o_hood", "value": true}]
      },
      {"id": "c7_out_corner", "label": "Проверить дальний угол", "minutes": 2, "terminal": true, "goto": "c7_out_corner", "effects": []},
      {
        "id": "c7_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 4680},
        "effects": [{"sleep": 360}],
        "text": "Под головой жёсткий шов рюкзака. В темноте кто-то проходит мимо укрытия и не останавливается. Ты держишь ладонь на застёжке."
      },
      {
        "id": "c7_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c7_whistle_approach", "label": "Откликнуться на свист у дороги", "minutes": 1, "terminal": true, "goto": "c7_whistle", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4825}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_whistle.done"}}]}},
      {"id": "c7_shawl_approach", "label": "Проверить оставленное у стены", "minutes": 1, "terminal": true, "goto": "c7_shawl", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 5025}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_shawl.done"}}]}},
      {"id": "c7_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c7_cp", "when": {"all": [{"cp": 6}, {"after": 5100}]}}
    ]
  },
  {
    "id": "c7_out_corner",
    "for": "any",
    "chapter": "ch3",
    "title": "За углом укрытия",
    "safe": false,
    "text": [
      {"when": {"before": 4680}, "text": "Второй проход виден узкой полосой более светлого неба. Через него проходит кошка. Ты ждёшь, пока стихнут её шаги."},
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "Во втором проходе сухие кирпичи сложены не до конца. Между ними хватит места для человека с рюкзаком. Ты проверяешь ширину плечом."
      },
      {"when": {"all": [{"after": 5040}, {"before": 5340}]}, "text": "Через второй проход несут закрытые канистры. Тебя замечают, но не заговаривают."},
      {
        "when": {"after": 5340},
        "text": "На край стены падает последний свет с дороги. Бутылку на земле лучше убрать, пока видно. Потом её можно будет разбить ногой."
      }
    ],
    "actions": [
      {
        "id": "c7_o_glass",
        "label": "Отодвинуть бутылку из прохода",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_o_glass"}}, {"before": 5100}]},
        "text": "Ты берёшь её за сухое горло. Кладёшь на бок за кирпичами. Катиться обратно ей некуда.",
        "effects": [{"set": "$.c7_o_glass", "value": true}]
      },
      {
        "id": "c7_o_brick",
        "label": "Поставить шаткий кирпич плашмя",
        "minutes": 6,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_o_brick"}}, {"before": 5100}]},
        "text": "Кирпич стоял на ребре. Ты опускаешь его обеими руками, без стука. Узкий проход остаётся свободным.",
        "effects": [{"set": "$.c7_o_brick", "value": true}]
      },
      {
        "id": "c7_o_return",
        "label": "Проверить путь обратно с рюкзаком",
        "minutes": 7,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_o_return"}}, {"before": 5100}]},
        "text": "Ты проходишь до стены и обратно, не снимая лямок. Ни один ремень не цепляется. На повороте теперь достаточно одного шага.",
        "effects": [{"set": "$.c7_o_return", "value": true}]
      },
      {"id": "c7_back", "label": "Вернуться под навес", "minutes": 2, "terminal": true, "goto": "c7_out", "effects": []},
      {
        "id": "c7_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 4680},
        "effects": [{"sleep": 360}],
        "text": "Второй проход виден узкой полосой более светлого неба. Через него проходит кошка. Ты ждёшь, пока стихнут её шаги."
      },
      {
        "id": "c7_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c7_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c7_cp", "when": {"all": [{"cp": 6}, {"after": 5100}]}}
    ]
  },
  {
    "id": "c7_messe",
    "for": "any",
    "chapter": "ch3",
    "location": "messe",
    "title": "Зал B1",
    "safe": false,
    "text": [
      {"when": {"before": 4680}, "text": "Под раскладушкой шуршит пакет. Ты находишь его ногой и прижимаешь. Кто-то через два ряда всё ещё зовёт дежурного."},
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "Над рядами пахнет остывшей кашей. У входа на полу уже следы от переставленной сетки. Солдат держит рацию у самого лица."
      },
      {
        "when": {"all": [{"after": 5040}, {"before": 5340}]},
        "text": "Из служебной двери тянет воздухом. Внутри под потолком всё ещё горят лампы, хотя над рядами уже шум."
      },
      {"when": {"after": 5340}, "text": "В середине зала упала перегородка. Зелёная табличка выхода всё ещё горит. Ты видишь её между чужими плечами."},
      {
        "when": {"all": [{"all": [{"v": "$.c6_feverline.result", "op": "==", "value": "help"}, {"all": []}]}, {"before": 4860}]},
        "text": "Каталка проходит там, где ты убрал{m:|а} сумки. На полу остаётся колёсная дуга."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_feverline.result", "op": "==", "value": "find"}, {"all": []}]}, {"before": 4860}]},
        "text": "Женщина из нужного ряда бежит вслед за каталкой. Её миска осталась на твоей койке."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_feverline.result", "op": "==", "value": "back"}, {"all": []}]}, {"before": 4860}]},
        "text": "Когда ты возвращаешься с едой, человека уже увезли. Соседи спрашивают друг друга, куда."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_latch.result", "op": "==", "value": "clear"}, {"all": []}]}, {"before": 4860}]},
        "text": "Проход к служебной двери свободен. Волонтёр оставил рядом ключ, привязав его к верёвке."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_latch.result", "op": "==", "value": "ask"}, {"all": []}]}, {"before": 4860}]},
        "text": "Дежурный снял проволоку с ручки. Теперь он стоит у двери сам и запоминает твоё лицо."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_latch.result", "op": "==", "value": "leave"}, {"all": []}]}, {"before": 4860}]},
        "text": "У ручки всё та же проволока. Над ней зелёный человечек бежит туда, куда пройти нельзя."
      },
      {
        "when": {"all": [{"v": "$.c7_evacwarning.result", "op": "==", "value": "ready"}, {"all": []}]},
        "text": "Рюкзак уже на плечах. Между твоей койкой и стеной оставлен проход шириной в ступню."
      },
      {
        "when": {"all": [{"v": "$.c7_evacwarning.result", "op": "==", "value": "help"}, {"all": []}]},
        "text": "Сосед стоит, опираясь на твоё плечо. Взять свой рюкзак теперь можно только другой рукой."
      },
      {
        "when": {"all": [{"v": "$.c7_evacwarning.result", "op": "==", "value": "seat"}, {"all": []}]},
        "text": "Ты сидишь, как велели. Когда люди встают одновременно, твоя сумка оказывается под чужими ногами."
      }
    ],
    "actions": [
      {
        "id": "c7_m_bag_messe",
        "label": "Собрать только своё",
        "minutes": 7,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c7_m_bag_messe"}}, {"before": 5100}]}]}]},
        "text": "Одеяло остаётся на раскладушке. Ты берёшь только вещи из-под неё. Чужую сумку отодвигаешь на прежнее место.",
        "effects": [{"set": "$.c7_m_bag_messe", "value": true}]
      },
      {
        "id": "c7_m_shoes_messe",
        "label": "Надеть обувь и завязать шнурки",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c7_m_shoes_messe"}}, {"before": 5100}]}]}]},
        "text": "Ботинки стоят носками в проход. Ты разворачиваешь их к себе, надеваешь сидя. Узел прячешь под верхнюю петлю.",
        "effects": [{"set": "$.c7_m_shoes_messe", "value": true}]
      },
      {
        "id": "c7_m_call_messe",
        "label": "Позвать дежурного, не отходя от места",
        "minutes": 7,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c7_m_call_messe"}}, {"before": 5100}]}]}]},
        "text": "Дежурный идёт вдоль стены. Ты называешь номер своего ряда. Он повторяет его, прежде чем двигаться дальше.",
        "effects": [{"set": "$.c7_m_call_messe", "value": true}]
      },
      {
        "id": "c7_m_water_messe",
        "label": "Закрыть свою воду",
        "minutes": 4,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c7_m_water_messe"}}, {"before": 5100}]}]}]},
        "text": "Крышка катится под матрас. Ты поднимаешь её за край и протираешь снаружи. Вода остаётся внутри бутылки.",
        "effects": [{"set": "$.c7_m_water_messe", "value": true}]
      },
      {
        "id": "c7_m_neighbor_messe",
        "label": "Спросить соседа, слышит ли он",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c7_m_neighbor_messe"}}, {"before": 5100}]}]}]},
        "text": "Сосед поворачивается на голос. Он не спал, просто лежал с закрытыми глазами. На край койки уже поставил свою сумку.",
        "effects": [{"set": "$.c7_m_neighbor_messe", "value": true}]
      },
      {
        "id": "c7_m_floor_messe",
        "label": "Убрать свою вещь с прохода",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c7_m_floor_messe"}}, {"before": 5100}]}]}]},
        "text": "Пакет с едой цепляет чужую ногу. Ты подтягиваешь его к ножке своей раскладушки. Человек проходит, даже не оглянувшись.",
        "effects": [{"set": "$.c7_m_floor_messe", "value": true}]
      },
      {
        "id": "c7_m_light_messe",
        "label": "Посмотреть на служебную дверь",
        "minutes": 4,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c7_m_light_messe"}}, {"before": 5100}]}]}]},
        "text": "Перед дверью два пустых ящика. Между ними ещё можно пройти боком. Ты запоминаешь, с какой стороны.",
        "effects": [{"set": "$.c7_m_light_messe", "value": true}]
      },
      {
        "id": "c7_m_wall_messe",
        "label": "Отойти к стене",
        "minutes": 2,
        "terminal": true,
        "goto": "c7_messe_wall",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]}]},
        "effects": []
      },
      {
        "id": "c7_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"before": 4680}]}]},
        "effects": [{"sleep": 360}],
        "text": "Под раскладушкой шуршит пакет. Ты находишь его ногой и прижимаешь. Кто-то через два ряда всё ещё зовёт дежурного."
      },
      {
        "id": "c7_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку.",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]}]}
      },
      {"id": "c7_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c7_cp", "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"cp": 6}, {"after": 5100}]}]}]}},
      {"id": "c7_evacwarning_approach", "label": "Подойти к дежурному у ряда", "minutes": 1, "terminal": true, "goto": "c7_evacwarning", "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4820}, {"before": 4860}, {"all": []}, {"not": {"flag": "$.c7_evacwarning.done"}}]}]}},
      {"id": "c7_alarm", "label": "Уйти к служебной двери", "minutes": 0, "terminal": true, "goto": "c7_messe_exit", "when": {"flag": "w.c3_messe_outbreak"}}
    ],
    "universal": false
  },
  {
    "id": "c7_q",
    "for": "any",
    "chapter": "ch3",
    "location": "messe_q",
    "title": "Наблюдение",
    "safe": false,
    "text": [
      {"when": {"before": 4680}, "text": "За сеткой проезжает каталка. Одно колесо подпрыгивает на стыке пола. Медсестра придерживает на ней пустое ведро."},
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "Утренний осмотр начался с дальнего ряда. Ближе к ширме медсёстры идут уже вдвоём. Пакет для перчаток стоит раскрытый на стуле."
      },
      {
        "when": {"all": [{"after": 5040}, {"before": 5340}]},
        "text": "У сетки оставлена каталка. Её колесо зажато под деревянным клином, но она всё равно дрожит от шагов."
      },
      {"when": {"after": 5340}, "text": "У ширмы валяется опрокинутый стул. По стене ползёт свет служебной двери. Койки больше не стоят ровными рядами."},
      {
        "when": {"all": [{"all": [{"v": "$.c6_letter.result", "op": "==", "value": "read"}, {"all": []}]}, {"before": 4860}]},
        "text": "Женщина узнаёт ответ по почерку. Бумагу кладёт под подушку, а не в сумку."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_letter.result", "op": "==", "value": "desk"}, {"all": []}]}, {"before": 4860}]},
        "text": "Записка лежит под планшетом регистратора. Он ищет её каждый раз, когда кто-то спрашивает фамилию."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_letter.result", "op": "==", "value": "back"}, {"all": []}]}, {"before": 4860}]},
        "text": "Женщина переписывает адрес крупнее. Карандаш доходит до края, она начинает с новой стороны."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_sleepless.result", "op": "==", "value": "watch"}, {"all": []}]}, {"before": 4860}]},
        "text": "Сосед засыпает, держась за край твоего рукава. Медсестра подходит и тихо просит не будить."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_sleepless.result", "op": "==", "value": "tie"}, {"all": []}]}, {"before": 4860}]},
        "text": "Сумка привязана к койке. Человек тянет её во сне, и металлическая ножка скребёт по полу."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c6_sleepless.result", "op": "==", "value": "nurse"}, {"all": []}]}, {"before": 4860}]},
        "text": "Медсестра задержалась у соседней койки. Тебе воду принесёт другой человек, когда освободится."
      },
      {
        "when": {"all": [{"v": "$.c7_nursehurt.result", "op": "==", "value": "space"}, {"all": []}]},
        "text": "Ты {m:отошёл|отошла} от тележки. Медсестре есть куда отступить, когда за тканью встают."
      },
      {
        "when": {"all": [{"v": "$.c7_nursehurt.result", "op": "==", "value": "gloves"}, {"all": []}]},
        "text": "Медсестра сняла повреждённую перчатку. Твою упаковку прижала к локтю: второй рукой уже некогда."
      },
      {
        "when": {"all": [{"v": "$.c7_nursehurt.result", "op": "==", "value": "stay"}, {"all": []}]},
        "text": "Рюкзак у тебя на коленях. Медсестра протискивается между ним и тележкой боком."
      }
    ],
    "actions": [
      {
        "id": "c7_m_bag_q",
        "label": "Собрать только своё",
        "minutes": 7,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c7_m_bag_q"}}, {"before": 5100}]}]}]},
        "text": "Ты убираешь кружку в сумку горлом вниз. Медицинскую бирку оставляешь на виду. Свободный конец ремня зажат под сумкой.",
        "effects": [{"set": "$.c7_m_bag_q", "value": true}]
      },
      {
        "id": "c7_m_shoes_q",
        "label": "Надеть обувь и завязать шнурки",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c7_m_shoes_q"}}, {"before": 5100}]}]}]},
        "text": "Одна шнуровка ещё влажная. Ты затягиваешь её чуть слабее, чтобы не давило на подъём. Шнурок ложится на мокрый носок ботинка.",
        "effects": [{"set": "$.c7_m_shoes_q", "value": true}]
      },
      {
        "id": "c7_m_call_q",
        "label": "Позвать дежурного, не отходя от места",
        "minutes": 7,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c7_m_call_q"}}, {"before": 5100}]}]}]},
        "text": "Ты поднимаешь руку до плеча. Медсестра замечает только со второго ряда. Подходит сама, не просит идти к ширме.",
        "effects": [{"set": "$.c7_m_call_q", "value": true}]
      },
      {
        "id": "c7_m_water_q",
        "label": "Закрыть свою воду",
        "minutes": 4,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c7_m_water_q"}}, {"before": 5100}]}]}]},
        "text": "Бутылка стояла без крышки. Ты закрываешь её и ставишь между вещей. Не нужно оставлять на полу у чужой койки.",
        "effects": [{"set": "$.c7_m_water_q", "value": true}]
      },
      {
        "id": "c7_m_neighbor_q",
        "label": "Спросить соседа, слышит ли он",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c7_m_neighbor_q"}}, {"before": 5100}]}]}]},
        "text": "Сосед отвечает по имени и показывает на костыль. Ты ставишь его ближе к руке. Самого соседа не поднимаешь.",
        "effects": [{"set": "$.c7_m_neighbor_q", "value": true}]
      },
      {
        "id": "c7_m_floor_q",
        "label": "Убрать свою вещь с прохода",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c7_m_floor_q"}}, {"before": 5100}]}]}]},
        "text": "Твой рукав свесился на пол. Ты поднимаешь его и расправляешь на вещах. Между койками снова проходит тележка.",
        "effects": [{"set": "$.c7_m_floor_q", "value": true}]
      },
      {
        "id": "c7_m_light_q",
        "label": "Посмотреть на служебную дверь",
        "minutes": 4,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c7_m_light_q"}}, {"before": 5100}]}]}]},
        "text": "Ручка у двери горизонтальная. У порога видна полоска серого двора. Кабель к ней не подведён.",
        "effects": [{"set": "$.c7_m_light_q", "value": true}]
      },
      {
        "id": "c7_m_wall_q",
        "label": "Отойти к стене",
        "minutes": 2,
        "terminal": true,
        "goto": "c7_q_wall",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]}]},
        "effects": []
      },
      {
        "id": "c7_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"before": 4680}]}]},
        "effects": [{"sleep": 360}],
        "text": "За сеткой проезжает каталка. Одно колесо подпрыгивает на стыке пола. Медсестра придерживает на ней пустое ведро."
      },
      {
        "id": "c7_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку.",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]}]}
      },
      {"id": "c7_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c7_cp", "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"cp": 6}, {"after": 5100}]}]}]}},
      {"id": "c7_nursehurt_approach", "label": "Ответить медсестре у койки", "minutes": 1, "terminal": true, "goto": "c7_nursehurt", "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4835}, {"before": 4860}, {"all": []}, {"not": {"flag": "$.c7_nursehurt.done"}}]}]}},
      {"id": "c7_alarm", "label": "Уйти к служебной двери", "minutes": 0, "terminal": true, "goto": "c7_messe_exit", "when": {"flag": "w.c3_messe_outbreak"}}
    ],
    "universal": false
  },
  {
    "id": "c7_messe_wall",
    "for": "any",
    "chapter": "ch3",
    "location": "messe",
    "title": "У стены павильона",
    "safe": false,
    "text": [
      {"when": {"before": 4680}, "text": "У стены не лежат вещи. Люди держат сумки у груди и не останавливаются надолго."},
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "К стене прислонены пустые коробки. На одной зелёная стрелка. Настоящая табличка висит выше."
      },
      {"when": {"all": [{"after": 5040}, {"before": 5340}]}, "text": "За дверью светло. До неё идут по узкому проходу, не оглядываясь на койки."},
      {"when": {"after": 5340}, "text": "Вдоль стены двигаются к двери. Никто больше не ставит сумки на пол. Ты придерживаешь свою ремнём."}
    ],
    "actions": [
      {
        "id": "c7_m_box_messe",
        "label": "Убрать коробку от прохода",
        "minutes": 7,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c7_m_box_messe"}}, {"before": 5100}]}]}]},
        "text": "Коробка пустая, но зацепилась за шланг. Ты освобождаешь угол, не тянешь вместе с ним. До ручки теперь видно весь путь.",
        "effects": [{"set": "$.c7_m_box_messe", "value": true}]
      },
      {
        "id": "c7_m_stand_messe",
        "label": "Найти сухое место для ног",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c7_m_stand_messe"}}, {"before": 5100}]}]}]},
        "text": "Под стеной рассыпаны хлебные крошки. Ты выбираешь чистую плитку у самого столба. С неё видно выход.",
        "effects": [{"set": "$.c7_m_stand_messe", "value": true}]
      },
      {
        "id": "c7_back",
        "label": "Вернуться к своему месту",
        "minutes": 2,
        "terminal": true,
        "goto": "c7_messe",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]}]},
        "effects": []
      },
      {
        "id": "c7_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"before": 4680}]}]},
        "effects": [{"sleep": 360}],
        "text": "У стены не лежат вещи. Люди держат сумки у груди и не останавливаются надолго."
      },
      {
        "id": "c7_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку.",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]}]}
      },
      {"id": "c7_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c7_cp", "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"cp": 6}, {"after": 5100}]}]}]}},
      {"id": "c7_evacwarning_approach", "label": "Подойти к дежурному у ряда", "minutes": 1, "terminal": true, "goto": "c7_evacwarning", "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4820}, {"before": 4860}, {"all": []}, {"not": {"flag": "$.c7_evacwarning.done"}}]}]}},
      {"id": "c7_alarm", "label": "Уйти к служебной двери", "minutes": 0, "terminal": true, "goto": "c7_messe_exit", "when": {"flag": "w.c3_messe_outbreak"}}
    ],
    "universal": false
  },
  {
    "id": "c7_q_wall",
    "for": "any",
    "chapter": "ch3",
    "location": "messe_q",
    "title": "У стены павильона",
    "safe": false,
    "text": [
      {"when": {"before": 4680}, "text": "Под стеной мокрый след каталки. Дальше он обрывается у служебной двери."},
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "У стены холоднее, чем между койками. Здесь слышно, как по наружному двору катят пустую тележку."
      },
      {"when": {"all": [{"after": 5040}, {"before": 5340}]}, "text": "Одна ширма лежит на боку. Ткань на ней разорвана внизу. Ты держишь ноги дальше от колёс."},
      {"when": {"after": 5340}, "text": "Люди уже отходят от ширм. На полу стена отражается в пролитой воде. Ты держишься сухого края."}
    ],
    "actions": [
      {
        "id": "c7_m_box_q",
        "label": "Убрать коробку от прохода",
        "minutes": 7,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c7_m_box_q"}}, {"before": 5100}]}]}]},
        "text": "Под коробкой только пыль. Ты ставишь её вертикально, чтобы не мешала колёсам. Свет служебной двери ложится дальше по полу.",
        "effects": [{"set": "$.c7_m_box_q", "value": true}]
      },
      {
        "id": "c7_m_stand_q",
        "label": "Найти сухое место для ног",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c7_m_stand_q"}}, {"before": 5100}]}]}]},
        "text": "На мокром полу следы подошв уходят к ширме. Ты встаёшь дальше от них. Ремень рюкзака держишь выше пола.",
        "effects": [{"set": "$.c7_m_stand_q", "value": true}]
      },
      {
        "id": "c7_back",
        "label": "Вернуться к своему месту",
        "minutes": 2,
        "terminal": true,
        "goto": "c7_q",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]}]},
        "effects": []
      },
      {
        "id": "c7_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"before": 4680}]}]},
        "effects": [{"sleep": 360}],
        "text": "Под стеной мокрый след каталки. Дальше он обрывается у служебной двери."
      },
      {
        "id": "c7_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку.",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]}]}
      },
      {"id": "c7_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c7_cp", "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"cp": 6}, {"after": 5100}]}]}]}},
      {"id": "c7_nursehurt_approach", "label": "Ответить медсестре у койки", "minutes": 1, "terminal": true, "goto": "c7_nursehurt", "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4835}, {"before": 4860}, {"all": []}, {"not": {"flag": "$.c7_nursehurt.done"}}]}]}},
      {"id": "c7_alarm", "label": "Уйти к служебной двери", "minutes": 0, "terminal": true, "goto": "c7_messe_exit", "when": {"flag": "w.c3_messe_outbreak"}}
    ],
    "universal": false
  },
  {
    "id": "c7_messe_yard",
    "for": "any",
    "chapter": "ch3",
    "location": "c3_messe_yard",
    "title": "Служебный двор",
    "safe": false,
    "text": [
      {"when": {"before": 4680}, "text": "Край тента хлопает о стойку. Ты придерживаешь его плечом, пока сосед подтягивает верёвку. Люди у стены не просыпаются."},
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "Первые вышедшие держатся у ограды. Волонтёр разворачивает тент другой стороной, сухой внутрь. Люди проходят под ним, не выпуская сумок."
      },
      {"when": {"all": [{"after": 5040}, {"before": 5340}]}, "text": "У ворот выдают сухие пачки хлеба. Волонтёр держит коробку выше пояса, чтобы её не опрокинули."},
      {
        "when": {"after": 5340},
        "text": "У ворот горит один прожектор. Под тентом его почти не видно, зато каждая чужая тень ложится на ткань. На бетон кладут сухой картон."
      },
      {
        "when": {"all": [{"v": "$.c7_gatepile.result", "op": "==", "value": "passage"}, {"all": []}]},
        "text": "Через оставленный проход несут человека. Волонтёр держит сетку за тот же прут, что и ты."
      },
      {
        "when": {"all": [{"v": "$.c7_gatepile.result", "op": "==", "value": "edge"}, {"all": []}]},
        "text": "У ограды тесно, но тебя не толкают в спину. Из дверей выходят новые люди; до тента ты теперь не дойдёшь прямо."
      },
      {
        "when": {"all": [{"v": "$.c7_gatepile.result", "op": "==", "value": "seat"}, {"all": []}]},
        "text": "Поднятый человек сидит на твоём месте. Твой рюкзак он придерживает ногами, чтобы не затоптали."
      },
      {
        "when": {"all": [{"v": "$.c7_redtag.result", "op": "==", "value": "search"}, {"all": []}]},
        "text": "Дежурный повторяет имя партнёра следующей смене. Ты слышишь его издалека и поднимаешь голову."
      },
      {
        "when": {"all": [{"v": "$.c7_redtag.result", "op": "==", "value": "honest"}, {"all": []}]},
        "text": "Красный браслет оставили на руке. Зато тебе показали место, где медик будет искать тебя снова."
      },
      {
        "when": {"all": [{"v": "$.c7_redtag.result", "op": "==", "value": "stay"}, {"all": []}]},
        "text": "У вещей спокойно. На перекличке приходится спрашивать всё заново: твоего имени в этой группе нет."
      },
      {
        "when": {"flag": "$.c3_exit_helped"},
        "text": "Человек, которого ты вытащил{m:|а}, садится рядом. — Фамилия как? — спрашивает он. — Скажу, если искать будут."
      },
      {"when": {"flag": "$.c3_exit_left_bag"}, "text": "Рюкзак остался за закрытыми воротами. Солдат преграждает дорогу, когда ты поворачиваешься к ним."}
    ],
    "actions": [
      {
        "id": "c7_y_shoes",
        "label": "Убрать стекло от ног сидящих",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_y_shoes"}}, {"before": 5100}]},
        "text": "Осколки от лампы мелкие и прозрачные. Ты сметаешь их плотным картоном. Люди рядом поднимают ноги, не вставая.",
        "effects": [{"set": "$.c7_y_shoes", "value": true}]
      },
      {
        "id": "c7_y_bag",
        "label": "Снять мокрый рюкзак с земли",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_y_bag"}}, {"before": 5100}]},
        "text": "Дно уже намокло. Ты ставишь рюкзак на сухую доску у ограды. Молния остаётся сверху, не в луже.",
        "effects": [{"set": "$.c7_y_bag", "value": true}]
      },
      {
        "id": "c7_y_rope",
        "label": "Подтянуть провисший край тента",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_y_rope"}}, {"before": 5100}]},
        "text": "Верёвка скользит в мокром узле. Ты держишь натяжение, пока волонтёр завязывает второй. Ткань перестаёт касаться чужих голов.",
        "effects": [{"set": "$.c7_y_rope", "value": true}]
      },
      {
        "id": "c7_y_cups",
        "label": "Отнести пустые стаканы к мешку",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_y_cups"}}, {"before": 5100}]},
        "text": "Стаканы приходится собирать друг в друга. Верхние чистые снаружи, нижние в грязи. Ты не смешиваешь их с теми, из которых ещё пьют.",
        "effects": [{"set": "$.c7_y_cups", "value": true}]
      },
      {
        "id": "c7_y_name",
        "label": "Проверить своё имя у дежурного",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_y_name"}}, {"before": 5100}]},
        "text": "Дежурный читает вслух по буквам. Ты поправляешь одну. Дежурный подчёркивает исправленную букву.",
        "effects": [{"set": "$.c7_y_name", "value": true}]
      },
      {
        "id": "c7_y_sleeve",
        "label": "Вытереть мокрый рукав сухой тканью",
        "minutes": 6,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_y_sleeve"}}, {"before": 5100}]},
        "text": "Капли со шва перестают падать на колени. Ты оставляешь рукав расправленным, не закатывая внутрь. Под ним рука холодная, но сухая.",
        "effects": [{"set": "$.c7_y_sleeve", "value": true}]
      },
      {
        "id": "c7_y_partition",
        "label": "Помочь поставить пустой ящик у тента",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_y_partition"}}, {"before": 5100}]},
        "text": "Ящик нужен не для сидения, а чтобы ткань не сносило. Ты поворачиваешь его широкой стороной к ветру. Волонтёр упирает в него стойку.",
        "effects": [{"set": "$.c7_y_partition", "value": true}]
      },
      {
        "id": "c7_y_near",
        "label": "Посидеть с {partner.ins} у ограды",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"flag": "w.together"}, {"all": [{"not": {"flag": "$.c7_y_near"}}, {"before": 5100}]}]},
        "text": "{partner} садится вплотную к тебе. Через ремни рюкзаков ваши руки касаются друг друга.",
        "effects": [{"set": "$.c7_y_near", "value": true}, {"body": "stress", "delta": -8}]
      },
      {"id": "c7_yard_edge", "label": "Отойти к краю ограды", "minutes": 2, "terminal": true, "goto": "c7_yard_edge", "effects": []},
      {
        "id": "c7_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 4680},
        "effects": [{"sleep": 360}],
        "text": "Край тента хлопает о стойку. Ты придерживаешь его плечом, пока сосед подтягивает верёвку. Люди у стены не просыпаются."
      },
      {
        "id": "c7_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c7_gatepile_approach", "label": "Отойти от служебной двери", "minutes": 1, "terminal": true, "goto": "c7_gatepile", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4895}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_gatepile.done"}}]}},
      {"id": "c7_redtag_approach", "label": "Ответить дежурному с ножницами", "minutes": 1, "terminal": true, "goto": "c7_redtag", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 5030}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_redtag.done"}}]}},
      {"id": "c7_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c7_cp", "when": {"all": [{"cp": 6}, {"after": 5100}]}}
    ]
  },
  {
    "id": "c7_yard_edge",
    "for": "any",
    "chapter": "ch3",
    "location": "c3_messe_yard",
    "title": "У ограды",
    "safe": false,
    "text": [
      {"when": {"before": 4680}, "text": "На ограде зацепилась лента от браслета. Ты снимаешь её и комкаешь в кулаке. Клей держит пальцы вместе."},
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "На столбе ограды висит сорванная бумажная стрелка. За ней видна улица, но туда пока не выпускают без дежурного."
      },
      {"when": {"all": [{"after": 5040}, {"before": 5340}]}, "text": "На ограде висят обрывки браслетов. Дежурный снимает их и убирает в пакет, не бросая на землю."},
      {
        "when": {"after": 5340},
        "text": "За оградой проезжает грузовик с закрытым кузовом. Его задний свет на секунду красит тент. Люди под ним перестают разговаривать."
      }
    ],
    "actions": [
      {
        "id": "c7_y_signal",
        "label": "Показать дежурному мешающий провод",
        "minutes": 6,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_y_signal"}}, {"before": 5100}]},
        "text": "Провод зацепился за нижнюю сетку. Дежурный сам снимает его в перчатках. На сетке осталась оборванная изоляция.",
        "effects": [{"set": "$.c7_y_signal", "value": true}]
      },
      {
        "id": "c7_y_dryedge",
        "label": "Подложить сухое под край тента",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_y_dryedge"}}, {"before": 5100}]},
        "text": "Сухой картон сминается у стойки. Ты кладёшь его поверх мокрого, не наоборот. На этом месте сможет сесть ещё один человек.",
        "effects": [{"set": "$.c7_y_dryedge", "value": true}]
      },
      {
        "id": "c7_y_sleeptie",
        "label": "Привязать свободный конец верёвки",
        "minutes": 7,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_y_sleeptie"}}, {"before": 5100}]},
        "text": "Конец бьёт по ткани от ветра. Ты сворачиваешь его кольцом и крепишь выше головы. Узел поскрипывает над головой.",
        "effects": [{"set": "$.c7_y_sleeptie", "value": true}]
      },
      {"id": "c7_back", "label": "Вернуться под тент", "minutes": 2, "terminal": true, "goto": "c7_messe_yard", "effects": []},
      {
        "id": "c7_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 4680},
        "effects": [{"sleep": 360}],
        "text": "На ограде зацепилась лента от браслета. Ты снимаешь её и комкаешь в кулаке. Клей держит пальцы вместе."
      },
      {
        "id": "c7_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c7_gatepile_approach", "label": "Отойти от служебной двери", "minutes": 1, "terminal": true, "goto": "c7_gatepile", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4895}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_gatepile.done"}}]}},
      {"id": "c7_redtag_approach", "label": "Ответить дежурному с ножницами", "minutes": 1, "terminal": true, "goto": "c7_redtag", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 5030}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_redtag.done"}}]}},
      {"id": "c7_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c7_cp", "when": {"all": [{"cp": 6}, {"after": 5100}]}}
    ]
  },
  {
    "id": "c7_okafor",
    "for": "any",
    "chapter": "ch3",
    "location": "b_okafor",
    "title": "У двери Окафора",
    "safe": false,
    "text": [
      {
        "when": {"before": 4680},
        "text": "Под дверью Окафора холодный сквозняк. Из квартиры пахнет антисептиком и давно остывшим чаем. Ты стоишь на своей стороне порога."
      },
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "Ключ лежит возле плинтуса. На полу высох след от бутылки. Ты остаёшься в дверном проёме лестницы, не касаясь замка."
      },
      {"when": {"all": [{"after": 5040}, {"before": 5340}]}, "text": "Дверь Окафора закрыта. В проходе кто-то ставит стул спинкой к стене и уходит вниз."},
      {"when": {"after": 5340}, "text": "Стул у чужого порога поставлен спинкой к двери. От прохода остаётся полметра. Ты обходишь его по своей стороне."}
    ],
    "actions": [
      {
        "id": "c7_k_call",
        "label": "Позвать по имени с площадки",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_k_call"}}, {"before": 5100}]},
        "text": "Ты произносишь имя один раз и ждёшь. Любой ответ сначала нужно дослушать. Руку с ручки собственной двери не убираешь.",
        "effects": [{"set": "$.c7_k_call", "value": true}]
      },
      {
        "id": "c7_k_sound",
        "label": "Отделить шаги от стука в трубы",
        "minutes": 6,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_k_sound"}}, {"before": 5100}]},
        "text": "Труба отзывается высоко, шаги низко у самого пола. Ты слушаешь оба звука отдельно. Потом отходишь от общей стены.",
        "effects": [{"set": "$.c7_k_sound", "value": true}]
      },
      {
        "id": "c7_k_neighbors",
        "label": "Предупредить соседей не трогать ключ",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_k_neighbors"}}, {"before": 5100}]},
        "text": "Ты говоришь через двери, без громкого крика. За одной соглашаются сразу. Из другой только перестают двигать цепочку.",
        "effects": [{"set": "$.c7_k_neighbors", "value": true}]
      },
      {"id": "c7_back", "label": "Вернуться на свою площадку", "minutes": 2, "terminal": true, "goto": "c7_landing_B", "effects": []},
      {
        "id": "c7_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 4680},
        "effects": [{"sleep": 360}],
        "text": "Под дверью Окафора холодный сквозняк. Из квартиры пахнет антисептиком и давно остывшим чаем. Ты стоишь на своей стороне порога."
      },
      {
        "id": "c7_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c7_silence_approach", "label": "Прислушаться к двери напротив", "minutes": 1, "terminal": true, "goto": "c7_silence", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4875}, {"before": 5150}, {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"any": [{"npc": "okafor", "status": "infected"}, {"npc": "okafor", "status": "turned"}]}]}, {"not": {"flag": "$.c7_silence.done"}}]}},
      {"id": "c7_papers_approach", "label": "Ответить человеку с домовым списком", "minutes": 1, "terminal": true, "goto": "c7_papers", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4990}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_papers.done"}}]}},
      {"id": "c7_stairwellwater_approach", "label": "Ответить на стук снизу", "minutes": 1, "terminal": true, "goto": "c7_stairwellwater", "when": {"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4875}, {"before": 5150}, {"not": {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"any": [{"npc": "okafor", "status": "infected"}, {"npc": "okafor", "status": "turned"}]}]}}, {"not": {"flag": "$.c7_stairwellwater.done"}}]}},
      {"id": "c7_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c7_cp", "when": {"all": [{"cp": 6}, {"after": 5100}]}}
    ]
  },
  {
    "id": "c7_messe_exit",
    "for": "any",
    "chapter": "ch3",
    "title": "Служебная дверь",
    "universal": false,
    "text": [
      {
        "text": "Сначала падает перегородка. Потом люди бегут через ряды, переворачивая раскладушки. Над головами слышно «Zurück!», но назад тоже идут люди. Ты держишься ближе к стене."
      },
      {
        "when": {"flag": "w.messe_reported"},
        "text": "Ближний проход свободен: дежурные успели отвести людей из этого ряда. Из соседнего павильона всё равно кричат."
      },
      {"when": {"not": {"flag": "w.messe_reported"}}, "text": "Между койками тесно. Мужчина в жилете пытается развернуть толпу, его больше не видно за плечами."}
    ],
    "actions": [
      {
        "id": "c7_exit_known",
        "label": "Держаться знакомого прохода вдоль стены",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_messe_yard",
        "when": {"flag": "$.messe_exit"},
        "text": "Ты идёшь вдоль стены, не пытаясь обогнать тех, кто впереди. Зелёная табличка, коробки, ручка. За дверью холодно. Ты выходишь и только тогда вспоминаешь вдохнуть.",
        "effects": [{"move": "c3_messe_yard"}, {"body": "stress", "delta": 15}, {"learn": "f_c3_messe_closed"}]
      },
      {
        "id": "c7_exit_staff",
        "label": "Идти за волонтёром к служебной двери",
        "minutes": 25,
        "terminal": true,
        "goto": "c7_messe_yard",
        "text": "Волонтёр поднимает свёрнутый жилет над головой. Ты держишь его в поле зрения. В узком месте сумку прижимает к чужой спине, потом вдруг отпускает. За дверью ты долго не можешь выпрямить пальцы.",
        "effects": [{"move": "c3_messe_yard"}, {"body": "stress", "delta": 24}, {"body": "fatigue", "delta": 8}, {"learn": "f_c3_messe_closed"}]
      },
      {
        "id": "c7_exit_lift",
        "label": "Вытащить упавшего из прохода",
        "minutes": 8,
        "terminal": true,
        "risky": true,
        "goto": "c7_messe_yard",
        "effects": [{"move": "c3_messe_yard"}, {"learn": "f_c3_messe_closed"}, {"set": "$.c3_exit_helped", "value": true}],
        "outcomes": [
          {
            "id": "space",
            "check": {"traits": ["strength", "agility"], "difficulty": 5, "uses": ["strength", "mobility"]},
            "text": "Ты тянешь человека за воротник, пока он не начинает помогать ногами. За дверью он держится за тебя обеими руками. Ты просишь отпустить. Со второго раза слышит.",
            "effects": [{"body": "fatigue", "delta": 12}, {"body": "stress", "delta": 20}]
          },
          {
            "id": "crushed",
            "text": "Сверху падает чужая сумка, потом чья-то нога. Ты держишь человека за куртку и ползёшь к свету, волоча его за собой. За дверью больно наступить на ногу.",
            "effects": [{"injure": "bruise", "site": "leftLeg", "severity": 2}, {"body": "stress", "delta": 28}]
          }
        ]
      },
      {
        "id": "c7_exit_drop",
        "label": "Бросить рюкзак и протиснуться первым",
        "minutes": 3,
        "terminal": true,
        "goto": "c7_messe_yard",
        "text": "Ты выпускаешь лямку. Чужие ноги сразу закрывают рюкзак, и уже не видно, какой из них твой. Снаружи руки свободны. Ты не знаешь, что ими делать.",
        "effects": [{"move": "c3_messe_yard"}, {"drop": "backpack"}, {"set": "$.c3_exit_left_bag", "value": true}, {"body": "stress", "delta": 18}, {"learn": "f_c3_messe_closed"}]
      }
    ]
  },
  {
    "id": "c7_kerem",
    "for": "any",
    "chapter": "ch3",
    "title": "Окликнуть Керема у сарая",
    "universal": false,
    "text": [
      {
        "text": "Керем выходит из сарая с сумкой. На плече ремень, в руке два яблока. На дом он не смотрит.",
        "when": {"all": [{"always": true}, {"npc": "kerem", "at": "hof_luedemann", "alive": true}]}
      },
      {
        "text": "— До дороги, — отвечает он. Потом добавляет: — Дальше видно будет. — Яблоки прячет в карман.",
        "when": {"all": [{"always": true}, {"npc": "kerem", "at": "hof_luedemann", "alive": true}]}
      },
      {
        "when": {"all": [{"flag": "w.c3_bread_split"}, {"npc": "kerem", "at": "hof_luedemann", "alive": true}]},
        "text": "— Вчера за кусок, сегодня за всё, — говорит Керем. — Брату так и скажи. — Он застёгивает сумку."
      },
      {
        "when": {"all": [{"flag": "w.c3_bread_defended"}, {"npc": "kerem", "at": "hof_luedemann", "alive": true}]},
        "text": "— Ты вчера за меня сказал{m:|а}. Сейчас тоже скажи, что я не вор. — Сумку он всё равно не ставит."
      },
      {
        "when": {"not": {"npc": "kerem", "at": "hof_luedemann", "alive": true}},
        "text": "На месте сумки светлый прямоугольник пыли. Шагов у сарая не слышно. Ты опоздал{m:|а} с ответом."
      }
    ],
    "onEnter": [{"set": "$.c7_kerem.started", "value": true}],
    "actions": [
      {
        "id": "c7_kerem_ask",
        "label": "Узнать, говорил ли с братом",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c7_kerem.asked"}}, {"npc": "kerem", "at": "hof_luedemann", "alive": true}]},
        "text": "Он смотрит на тёмное окно сарая. Дениз ещё внутри, или был там совсем недавно. Керем не отвечает. Он показывает два яблока. На одном мягкий бок, на другом ещё висит лист. Сумку не снимает.",
        "effects": [{"set": "$.c7_kerem.asked", "value": true}]
      },
      {
        "id": "c7_kerem_stay",
        "label": "Попросить остаться до разговора с Денизом",
        "minutes": 20,
        "terminal": true,
        "goto": "c7_farm",
        "text": "Керем ставит сумку у стены. Ты зовёшь брата, не объясняя на весь двор. Дениз выходит с одним надетым ботинком и сразу понимает.",
        "effects": [
          {"set": "$.c7_kerem.done", "value": true},
          {"set": "$.c7_kerem.result", "value": "stay"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": [{"set": "w.c3_kerem_stays", "value": true}]},
          {"npc": "kerem", "trust": 5},
          {"npc": "deniz", "trust": 3}
        ],
        "when": {"all": [{"all": [{"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, {"always": true}]}, {"npc": "kerem", "at": "hof_luedemann", "alive": true}]}
      },
      {
        "id": "c7_kerem_food",
        "label": "Дать ему еду в дорогу",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_farm",
        "text": "Ты протягиваешь закрытую пачку. Керем кладёт её рядом с яблоками. — Брату скажи сам{m:|а}, — просит он. Ремень снова поднимается на плечо.",
        "effects": [
          {"set": "$.c7_kerem.done", "value": true},
          {"set": "$.c7_kerem.result", "value": "food"},
          {"take": "crackers"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": [{"set": "w.c3_kerem_road", "value": true}]},
          {"npc": "kerem", "trust": 6}
        ],
        "enabled": {"has": "crackers"},
        "disabledReason": "Нужные вещи сейчас не при тебе",
        "when": {"all": [{"all": [{"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, {"always": true}]}, {"npc": "kerem", "at": "hof_luedemann", "alive": true}]}
      },
      {
        "id": "c7_kerem_henrike",
        "label": "Позвать Хенрике",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_farm",
        "text": "Хенрике выходит на крыльцо. — Яблоки забери. Сумку поставь. Говорим здесь. — Керем останавливается, хотя до ворот уже два шага.",
        "effects": [
          {"set": "$.c7_kerem.done", "value": true},
          {"set": "$.c7_kerem.result", "value": "henrike"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": [{"set": "w.c3_kerem_stays", "value": true}]},
          {"npc": "henrike", "trust": 3},
          {"npc": "kerem", "trust": -4}
        ],
        "when": {"all": [{"all": [{"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, {"always": true}]}, {"npc": "kerem", "at": "hof_luedemann", "alive": true}]}
      },
      {
        "id": "c7_kerem_listen",
        "label": "Выслушать, не обещая за брата",
        "minutes": 10,
        "terminal": true,
        "goto": "c7_farm",
        "when": {"all": [{"not": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}}, {"npc": "kerem", "at": "hof_luedemann", "alive": true}]},
        "text": "Керем говорит про дом, потом сбивается и начинает заново. Ты не обещаешь ему дорогу. Остаёшься рядом, пока он застёгивает сумку.",
        "effects": [{"set": "$.c7_kerem.done", "value": true}, {"set": "$.c7_kerem.result", "value": "listen"}, {"npc": "kerem", "trust": 4}, {"body": "stress", "delta": 4}]
      },
      {
        "id": "c7_kerem_tell",
        "label": "Пойти и позвать Дениза",
        "minutes": 10,
        "terminal": true,
        "goto": "c7_farm",
        "when": {"all": [{"not": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}}, {"npc": "kerem", "at": "hof_luedemann", "alive": true}]},
        "text": "Ты говоришь Денизу, что брат у двери с сумкой. Он кладёт ключ мимо стола. Подбирать не наклоняется.",
        "effects": [{"set": "$.c7_kerem.done", "value": true}, {"set": "$.c7_kerem.result", "value": "tell"}, {"npc": "deniz", "trust": 4}, {"npc": "kerem", "trust": -3}]
      },
      {
        "id": "c7_kerem_gone",
        "label": "Вернуться к дому",
        "minutes": 2,
        "terminal": true,
        "goto": "c7_farm",
        "when": {"not": {"npc": "kerem", "at": "hof_luedemann", "alive": true}},
        "text": "Ты проходишь мимо пустого места у сарая. Кружка стоит на скамейке, до половины полная."
      }
    ],
    "location": "hof_luedemann"
  },
  {
    "id": "c7_trough",
    "for": "any",
    "chapter": "ch3",
    "title": "Подойти к воде у крыльца",
    "universal": false,
    "text": [
      {"text": "Вода от колодца идёт по двору к крыльцу. Оле стоит сапогом в желобе и ругается сквозь зубы. Собака боится перейти лужу."},
      {"text": "Оле показывает на забитую канавку у сарая. В ней солома и два куска коры."}
    ],
    "onEnter": [{"set": "$.c7_trough.started", "value": true}],
    "actions": [
      {
        "id": "c7_trough_dig",
        "label": "Прорыть отвод вдоль забора",
        "minutes": 30,
        "terminal": true,
        "goto": "c7_farm",
        "text": "Ты снимаешь мокрую землю узкой полосой. Вода уходит к полю, минуя колею. Оле молча становится с другой стороны лопаты и подхватывает комья.",
        "effects": [
          {"set": "$.c7_trough.done", "value": true},
          {"set": "$.c7_trough.result", "value": "dig"},
          {"body": "fatigue", "delta": 8},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []},
          {"npc": "ole", "trust": 5},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": [{"set": "w.c7_trough.result", "value": "dig"}]}
        ]
      },
      {
        "id": "c7_trough_buckets",
        "label": "Отчерпать воду из-под стены",
        "minutes": 20,
        "terminal": true,
        "goto": "c7_farm",
        "text": "Ты выносишь воду ведром в канаву дальше от дома. Под стеной светлеет сухой кирпич. Низ рукава остаётся мокрым.",
        "effects": [
          {"set": "$.c7_trough.done", "value": true},
          {"set": "$.c7_trough.result", "value": "buckets"},
          {"body": "fatigue", "delta": 6},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": [{"set": "w.c7_trough.result", "value": "buckets"}]}
        ]
      },
      {
        "id": "c7_trough_road",
        "label": "Освободить короткий сток к дороге",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_farm",
        "text": "Солома выходит одним тяжёлым комом. Вода бежит по колее, оставляя за собой рыжую пену. Оле смотрит ей вслед и перестаёт ругаться.",
        "effects": [
          {"set": "$.c7_trough.done", "value": true},
          {"set": "$.c7_trough.result", "value": "road"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []},
          {"body": "stress", "delta": 3},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": [{"set": "w.c7_trough.result", "value": "road"}]}
        ]
      }
    ],
    "location": "hof_luedemann"
  },
  {
    "id": "c7_bedding",
    "for": "any",
    "chapter": "ch3",
    "title": "Ответить на скрип у порога",
    "universal": false,
    "text": [
      {"text": "К порогу подталкивают сухой мешок. Хенрике говорит, что намокшее сено нужно вынести сегодня. Мешок слишком узкий для всего тюфяка."},
      {"text": "Под одеялом солома влажная от стены. Ты отгибаешь только угол, чтобы не растрясти всё по комнате."}
    ],
    "onEnter": [{"set": "$.c7_bedding.started", "value": true}],
    "actions": [
      {
        "id": "c7_bedding_self",
        "label": "Вынести солому {m:самому|самой}",
        "minutes": 25,
        "terminal": true,
        "goto": "c7_coop",
        "text": "Ты подаёшь комья в мешке, не вынося вещи из комнаты. Павел держит мешок снаружи здоровой рукой. Последний ком пахнет сырой землёй.",
        "effects": [
          {"set": "$.c7_bedding.done", "value": true},
          {"set": "$.c7_bedding.result", "value": "self"},
          {"body": "fatigue", "delta": 7},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []},
          {"npc": "pawel", "trust": 3}
        ]
      },
      {
        "id": "c7_bedding_ask",
        "label": "Позвать того, у кого целы руки",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_coop",
        "text": "Ты зовёшь Оле. Он приходит с вилами и не смотрит на тебя, пока работает. Павел отходит к стене, пряча повязку.",
        "effects": [
          {"set": "$.c7_bedding.done", "value": true},
          {"set": "$.c7_bedding.result", "value": "ask"},
          {"npc": "ole", "trust": -2},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []},
          {"body": "stress", "delta": 4}
        ]
      },
      {
        "id": "c7_bedding_half",
        "label": "Оставить только сухую половину",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_coop",
        "text": "Ты скатываешь мокрую часть к стене. Места для ног меньше, зато сухое не нужно отдавать наружу. Ведро ставишь под каплю у кирпича.",
        "effects": [{"set": "$.c7_bedding.done", "value": true}, {"set": "$.c7_bedding.result", "value": "half"}, {"body": "fatigue", "delta": 3}]
      }
    ],
    "location": "farm_coop"
  },
  {
    "id": "c7_scrape",
    "for": "any",
    "chapter": "ch3",
    "title": "Прислушаться к чужим шагам",
    "universal": false,
    "text": [
      {"text": "Снаружи новые шаги: лёгкие, потом скрежет колеса. Женщина спрашивает, свободно ли это помещение. Ты слышишь ответ Оле: «Нет»."},
      {"text": "Она называет пекарню и имя Кёлер. У стены пахнет мукой, хотя дверь закрыта."},
      {
        "when": {"flag": "w.c3_guest_contract"},
        "text": "Хенрике напоминает про вчерашнее обещание ночлега. — Слово дали. Теперь сухое найдите. — Кёлер молчит рядом."
      },
      {
        "when": {"not": {"flag": "w.c3_guest_contract"}},
        "text": "Кёлер вернулась после ночи за воротами. В волосах солома, на губах трещина. Хенрике не спрашивает, где она спала."
      }
    ],
    "onEnter": [{"set": "$.c7_scrape.started", "value": true}],
    "actions": [
      {
        "id": "c7_scrape_share",
        "label": "Предложить часть своей подстилки",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_coop",
        "text": "Ты подаёшь сухое через дверь. Кёлер благодарит, не пытаясь заглянуть внутрь. Хенрике сама указывает ей другое помещение.",
        "effects": [{"set": "$.c7_scrape.done", "value": true}, {"set": "$.c7_scrape.result", "value": "share"}, {"body": "stress", "delta": 3}, {"npc": "c3_koehler", "trust": 5}]
      },
      {
        "id": "c7_scrape_rule",
        "label": "Попросить оставить изоляцию отдельной",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_coop",
        "text": "Хенрике кивает. — Раздельно, — говорит она Оле. Женщина убирает тележку от твоей двери. Колесо снова скребёт кирпич.",
        "effects": [{"set": "$.c7_scrape.done", "value": true}, {"set": "$.c7_scrape.result", "value": "rule"}, {"npc": "henrike", "trust": 4}]
      },
      {
        "id": "c7_scrape_quiet",
        "label": "Дать хозяйке решить самой",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_coop",
        "text": "Ты отодвигаешься от щели. Снаружи говорят ещё минуту, потом три пары шагов расходятся. Кошка остаётся мяукать у стены.",
        "effects": [{"set": "$.c7_scrape.done", "value": true}, {"set": "$.c7_scrape.result", "value": "quiet"}]
      }
    ],
    "location": "farm_coop"
  },
  {
    "id": "c7_fumes",
    "for": "any",
    "chapter": "ch3",
    "title": "Разбудить соседа у входа",
    "universal": false,
    "text": [
      {"text": "У входа в дом сосед сидит на ступеньке, опустив подбородок на грудь. Рядом генератор, кабель уходит в подъезд. Сосед не отвечает на первый зов."},
      {"text": "Сосед поднимает голову и морщится. Говорит, что просто голова разболелась. Снова опускает глаза."},
      {
        "when": {"flag": "w.c3_generator_outside"},
        "text": "Снаружи мотор стоит там, куда ты помог{m:|ла} его перенести. Дым идёт из соседнего подъезда; хозяин успел притащить второй аппарат."
      }
    ],
    "onEnter": [{"set": "$.c7_fumes.started", "value": true}],
    "actions": [
      {
        "id": "c7_fumes_vent",
        "label": "Помочь вывести его и проветрить",
        "minutes": 25,
        "terminal": true,
        "goto": "c7_aflat",
        "effects": [
          {"set": "$.c7_fumes.done", "value": true},
          {"set": "$.c7_fumes.result", "value": "vent"},
          {"body": "fatigue", "delta": 5},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ],
        "risky": true,
        "outcomes": [
          {
            "id": "careful",
            "check": {"traits": ["agility", "technical"], "difficulty": 4, "uses": ["mobility", "focus"]},
            "text": "Ты держишь дверь открытой снаружи. Сосед выходит, опираясь на стену, и садится у клумбы. Туда выхлоп не доходит."
          },
          {
            "id": "hurt",
            "text": "На лестнице темнеет перед глазами. Ты тянешь человека за рукав и падаешь коленом на край ступени. До открытой двери доползаешь вместе с ним.",
            "effects": [{"injure": "bruise", "site": "leftLeg", "severity": 2, "bleeding": 0}, {"body": "stress", "delta": 12}]
          }
        ]
      },
      {
        "id": "c7_fumes_call",
        "label": "Позвать помощь с улицы",
        "minutes": 20,
        "terminal": true,
        "goto": "c7_aflat",
        "text": "Ты останавливаешь патруль у перекрёстка. Солдат просит всех выйти на воздух. Генератор относят дальше от дома, не запуская.",
        "effects": [
          {"set": "$.c7_fumes.done", "value": true},
          {"set": "$.c7_fumes.result", "value": "call"},
          {"body": "stress", "delta": 7},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c7_fumes_window",
        "label": "Предупредить всех из окна",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_aflat",
        "text": "Ты зовёшь соседей открыть окна и выйти из подъезда. Несколько рам хлопают сразу. Сидящий внизу человек наконец поднимается сам.",
        "effects": [
          {"set": "$.c7_fumes.done", "value": true},
          {"set": "$.c7_fumes.result", "value": "window"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []},
          {"body": "stress", "delta": 5}
        ]
      }
    ],
    "location": "a_flat"
  },
  {
    "id": "c7_emptytank",
    "for": "any",
    "chapter": "ch3",
    "title": "Выслушать вернувшихся за водой",
    "universal": false,
    "text": [
      {"text": "У дома возвращаются люди с пустыми вёдрами. Цистерна не приехала. Сосед с третьего этажа садится на перевёрнутое ведро у входа."},
      {"text": "Люди слышали про следующую улицу. Никто из стоящих там не был, только повторяют друг друга."}
    ],
    "onEnter": [{"set": "$.c7_emptytank.started", "value": true}],
    "actions": [
      {
        "id": "c7_emptytank_share",
        "label": "Отдать одну бутылку наверх",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_aflat",
        "text": "Сосед берёт воду за горлышко. К больной стучит тихо, как будто боится разбудить. Твоё имя не называет.",
        "effects": [{"set": "$.c7_emptytank.done", "value": true}, {"set": "$.c7_emptytank.result", "value": "share"}, {"take": "water_15"}],
        "enabled": {"has": "water_15"},
        "disabledReason": "Нужные вещи сейчас не при тебе"
      },
      {
        "id": "c7_emptytank_check",
        "label": "Проверить слух о соседней улице",
        "minutes": 30,
        "terminal": true,
        "goto": "c7_aflat",
        "text": "Ты доходишь до другого перекрёстка. Там только пустой грузовик и два человека, ждавшие ту же цистерну. Возвращаешься без обещаний.",
        "effects": [{"set": "$.c7_emptytank.done", "value": true}, {"set": "$.c7_emptytank.result", "value": "check"}, {"body": "fatigue", "delta": 7}]
      },
      {
        "id": "c7_emptytank_save",
        "label": "Оставить запас дома",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_aflat",
        "text": "Ты убираешь бутылку от окна. Сосед поднимает ведро и идёт наверх. Листья на дне стучат о пластик.",
        "effects": [{"set": "$.c7_emptytank.done", "value": true}, {"set": "$.c7_emptytank.result", "value": "save"}, {"body": "stress", "delta": 6}]
      }
    ],
    "location": "a_flat"
  },
  {
    "id": "c7_silence",
    "for": "any",
    "chapter": "ch3",
    "title": "Прислушаться к двери напротив",
    "universal": false,
    "text": [
      {
        "text": "Вчера он просил не открывать. Сегодня из-за двери слышно только, как что-то волочат по полу. Ты называешь его по имени. Под ручкой появляются кончики пальцев и медленно уходят обратно."
      }
    ],
    "onEnter": [{"set": "$.c7_silence.started", "value": true}],
    "actions": [
      {
        "id": "c7_silence_closed",
        "label": "Оставить дверь закрытой",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_bflat",
        "text": "Ты отступаешь к своей площадке. Соседям говоришь только про закрытую дверь и отсутствие ответа. Изнутри снова шаркают к порогу.",
        "effects": [
          {"set": "$.c7_silence.done", "value": true},
          {"set": "$.c7_silence.result", "value": "closed"},
          {"if": {"any": [{"me": "B"}, {"not": {"flag": "w.together"}}]}, "then": [{"set": "w.c3_okafor_closed", "value": true}]},
          {"body": "stress", "delta": 12}
        ]
      },
      {
        "id": "c7_silence_guard",
        "label": "Позвать дежурного наверх",
        "minutes": 20,
        "terminal": true,
        "goto": "c7_bflat",
        "text": "Дежурный поднимается и долго слушает. Ключа не берёт. Ставит перед порогом стул, чтобы никто не подошёл случайно.",
        "effects": [
          {"set": "$.c7_silence.done", "value": true},
          {"set": "$.c7_silence.result", "value": "guard"},
          {"if": {"any": [{"me": "B"}, {"not": {"flag": "w.together"}}]}, "then": [{"set": "w.c3_okafor_reported", "value": true}]},
          {"body": "stress", "delta": 8}
        ]
      },
      {
        "id": "c7_silence_move",
        "label": "Убрать свои вещи от общей стены",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_bflat",
        "text": "Ты переносишь рюкзак в дальнюю комнату. Кровать двигается только на полметра. Из-за стены звук становится тише, но не исчезает.",
        "effects": [{"set": "$.c7_silence.done", "value": true}, {"set": "$.c7_silence.result", "value": "move"}, {"body": "fatigue", "delta": 5}]
      }
    ],
    "location": "b_flat"
  },
  {
    "id": "c7_papers",
    "for": "any",
    "chapter": "ch3",
    "title": "Ответить человеку с домовым списком",
    "universal": false,
    "text": [
      {"text": "Внизу ходит мужчина с жилетом жилищной компании. Спрашивает, кто ещё в доме. У его ботинка болтается развязанный шнурок."},
      {"text": "Он держит карточку перед глазком. Фотографию видно, мелкий текст нет. С лица на фото он похож только очками."}
    ],
    "onEnter": [{"set": "$.c7_papers.started", "value": true}],
    "actions": [
      {
        "id": "c7_papers_ask",
        "label": "Спросить, зачем список",
        "minutes": 8,
        "combinable": true,
        "when": {"not": {"flag": "$.c7_papers.asked"}},
        "text": "— Кому воду. Кому эвакуация, — отвечает он. Последнее слово произносит, глядя на следующую дверь. Он отрывает лист без бланка. Пишет время встречи у входа и свою фамилию. Номер телефона не добавляет.",
        "effects": [{"set": "$.c7_papers.asked", "value": true}]
      },
      {
        "id": "c7_papers_minimum",
        "label": "Назвать только число жильцов",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_bflat",
        "text": "Ты говоришь количество через дверь. Ручка коротко скрипит. Мужчина благодарит и идёт к соседям, не получив ключей или номера.",
        "effects": [{"set": "$.c7_papers.done", "value": true}, {"set": "$.c7_papers.result", "value": "minimum"}]
      },
      {
        "id": "c7_papers_verify",
        "label": "Проверить его через соседей",
        "minutes": 20,
        "terminal": true,
        "goto": "c7_bflat",
        "text": "Соседка снизу узнаёт его по голосу. Он действительно приходил чинить доводчик. Про автобус она слышит впервые и так ему и говорит.",
        "effects": [{"set": "$.c7_papers.done", "value": true}, {"set": "$.c7_papers.result", "value": "verify"}, {"body": "fatigue", "delta": 3}]
      },
      {
        "id": "c7_papers_refuse",
        "label": "Отказаться сообщать сведения",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_bflat",
        "text": "Ты просишь оставить лист у входа. Мужчина кладёт его на подоконник. Там бумага остаётся до следующего открытого окна.",
        "effects": [{"set": "$.c7_papers.done", "value": true}, {"set": "$.c7_papers.result", "value": "refuse"}, {"body": "stress", "delta": 4}]
      }
    ],
    "location": "b_flat"
  },
  {
    "id": "c7_invoice",
    "for": "any",
    "chapter": "ch3",
    "title": "Выслушать владельца машины",
    "universal": false,
    "text": [
      {"text": "В ворота стучит мужчина с квитанцией. На бумаге название мастерской. Он требует отдать машину, которой внутри нет."},
      {"text": "На подъёмнике другая машина. Во втором боксе только колёса, сложенные до окна."}
    ],
    "onEnter": [{"set": "$.c7_invoice.started", "value": true}],
    "actions": [
      {
        "id": "c7_invoice_push",
        "label": "Помочь вытолкнуть машину",
        "minutes": 30,
        "terminal": true,
        "goto": "c7_workshop",
        "text": "Ты держишь руль через открытое окно. Мужчина толкает сзади, потом вы меняетесь. Машина выходит на ровное, и он впервые убирает квитанцию в карман.",
        "effects": [
          {"set": "$.c7_invoice.done", "value": true},
          {"set": "$.c7_invoice.result", "value": "push"},
          {"body": "fatigue", "delta": 8},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c7_invoice_tools",
        "label": "Дать насос, оставаясь за воротами",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_workshop",
        "text": "Ты выставляешь насос на площадку. Мужчина качает долго, прислушиваясь к шипению. Возвращает насос рукояткой к тебе.",
        "effects": [
          {"set": "$.c7_invoice.done", "value": true},
          {"set": "$.c7_invoice.result", "value": "tools"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []},
          {"body": "stress", "delta": 3}
        ]
      },
      {
        "id": "c7_invoice_point",
        "label": "Показать место и закрыть ворота",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_workshop",
        "text": "Он забирает квитанцию с бетона. Уходит вдоль стены к своей машине. Ворота за тобой ложатся в паз без удара.",
        "effects": [{"set": "$.c7_invoice.done", "value": true}, {"set": "$.c7_invoice.result", "value": "point"}]
      }
    ],
    "location": "deniz_workshop"
  },
  {
    "id": "c7_heater",
    "for": "any",
    "chapter": "ch3",
    "title": "Проверить обогреватель в соседнем боксе",
    "universal": false,
    "text": [{"text": "Из щели соседнего бокса идёт сизый дым. Снаружи кричат про обогреватель. Железная створка приоткрыта на цепь."}],
    "onEnter": [{"set": "$.c7_heater.started", "value": true}],
    "actions": [
      {
        "id": "c7_heater_open",
        "label": "Сдвинуть скобу снаружи",
        "minutes": 20,
        "terminal": true,
        "goto": "c7_workshop",
        "effects": [
          {"set": "$.c7_heater.done", "value": true},
          {"set": "$.c7_heater.result", "value": "open"},
          {"body": "fatigue", "delta": 7},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ],
        "risky": true,
        "outcomes": [
          {
            "id": "careful",
            "check": {"traits": ["agility", "technical"], "difficulty": 4, "uses": ["mobility", "focus"]},
            "text": "Ты давишь железом в край паза. Скоба выходит, дверь открывается наружу. Человек выползает сам и не может сразу подняться на ноги."
          },
          {
            "id": "hurt",
            "text": "Скоба выскакивает и бьёт по кисти. Ты удерживаешь створку плечом, пока человек выбирается. Пальцы сгибаются не сразу.",
            "effects": [{"injure": "bruise", "site": "hands", "severity": 2, "bleeding": 0}, {"body": "stress", "delta": 12}]
          }
        ]
      },
      {
        "id": "c7_heater_help",
        "label": "Позвать пожарных у дороги",
        "minutes": 25,
        "terminal": true,
        "goto": "c7_workshop",
        "text": "Ты бежишь до дежурной машины. Пожарный идёт к боксам уже в перчатках. У створки просит всех отойти.",
        "effects": [
          {"set": "$.c7_heater.done", "value": true},
          {"set": "$.c7_heater.result", "value": "help"},
          {"body": "fatigue", "delta": 8},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c7_heater_air",
        "label": "Показать ему нижнюю щель",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_workshop",
        "text": "Ты зовёшь человека ближе к земле, где меньше дыма. Он отзывается и двигается на голос. Скобу начинают раскачивать двое подошедших с улицы.",
        "effects": [{"set": "$.c7_heater.done", "value": true}, {"set": "$.c7_heater.result", "value": "air"}, {"body": "stress", "delta": 9}]
      }
    ],
    "location": "deniz_workshop"
  },
  {
    "id": "c7_brokenpen",
    "for": "any",
    "chapter": "ch3",
    "title": "Подойти к звону на кухне",
    "universal": false,
    "text": [
      {"text": "На кухонной плитке лопается тонкое стекло. Мерле стоит над упавшей ручкой. На полу растекается прозрачная жидкость."},
      {"text": "Ты подвигаешь ей тапочки носком ботинка. Она надевает, не сводя глаз с дочери."}
    ],
    "onEnter": [{"set": "$.c7_brokenpen.started", "value": true}],
    "actions": [
      {
        "id": "c7_brokenpen_ask",
        "label": "Спросить Мерле, цела ли рука",
        "minutes": 8,
        "combinable": true,
        "when": {"not": {"flag": "$.c7_brokenpen.asked"}},
        "text": "Она показывает ладони. Крови нет, только дрожь в пальцах. Ручку поднимать не пытается. Мерле сама убирает разбитое в банку. Крышку завинчивает до упора. Уве на пороге не говорит ни слова.",
        "effects": [{"set": "$.c7_brokenpen.asked", "value": true}]
      },
      {
        "id": "c7_brokenpen_clean",
        "label": "Убрать пол, пока она займётся лекарством",
        "minutes": 20,
        "terminal": true,
        "goto": "c7_ahr",
        "text": "Ты протираешь плитку от стены к центру. Мерле берёт новую ручку сама. Пустую банку со стеклом ставишь туда, где её не перепутают с едой.",
        "effects": [
          {"set": "$.c7_brokenpen.done", "value": true},
          {"set": "$.c7_brokenpen.result", "value": "clean"},
          {"npc": "merle", "trust": 6},
          {"body": "fatigue", "delta": 3},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c7_brokenpen_sit",
        "label": "Посидеть с ней без вопросов",
        "minutes": 20,
        "terminal": true,
        "goto": "c7_ahr",
        "text": "Мерле садится на табуретку и держит локти на коленях. Ты садишься рядом. Она первой начинает рассказывать про обычный учебный день, которого уже нет.",
        "effects": [
          {"set": "$.c7_brokenpen.done", "value": true},
          {"set": "$.c7_brokenpen.result", "value": "sit"},
          {"npc": "merle", "trust": 7},
          {"body": "stress", "delta": -4},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c7_brokenpen_parents",
        "label": "Позвать Биргит и Уве",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_ahr",
        "text": "Они остаются с дочерью у стола. Ты отходишь к двери. Слова за спиной становятся тише, когда закрывается створка.",
        "effects": [
          {"set": "$.c7_brokenpen.done", "value": true},
          {"set": "$.c7_brokenpen.result", "value": "parents"},
          {"npc": "birgit", "trust": 3},
          {"npc": "merle", "trust": -2},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      }
    ],
    "location": "ahrensburg"
  },
  {
    "id": "c7_oven",
    "for": "any",
    "chapter": "ch3",
    "title": "Подойти к Биргит у мойки",
    "universal": false,
    "text": [
      {"text": "Биргит держит кисть под холодной водой. Кастрюля на плите наклонена, на полу мокрая дорожка до мойки. Уве зовёт Мерле."},
      {"text": "Биргит показывает запястье. Кольцо на пальце уже теснее обычного, она пытается снять его другой рукой."}
    ],
    "onEnter": [{"set": "$.c7_oven.started", "value": true}],
    "actions": [
      {
        "id": "c7_oven_kitchen",
        "label": "Взять готовку на себя",
        "minutes": 30,
        "terminal": true,
        "goto": "c7_ahr",
        "text": "Биргит садится, не выпуская руку из полотенца. Ты двигаешь кастрюлю на дальнюю конфорку. Она подсказывает только два раза, потом замолкает.",
        "effects": [
          {"set": "$.c7_oven.done", "value": true},
          {"set": "$.c7_oven.result", "value": "kitchen"},
          {"body": "fatigue", "delta": 6},
          {"npc": "birgit", "trust": 6},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c7_oven_dressing",
        "label": "Дать чистую перевязку",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_ahr",
        "text": "Ты раскрываешь упаковку. Мерле помогает матери закрыть запястье, не затягивая. Уве отодвигает с её места пустую тарелку.",
        "effects": [
          {"set": "$.c7_oven.done", "value": true},
          {"set": "$.c7_oven.result", "value": "dressing"},
          {"use": "dressing"},
          {"npc": "birgit", "trust": 7},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ],
        "enabled": {"hasTag": "dressing"},
        "disabledReason": "Нужные вещи сейчас не при тебе"
      },
      {
        "id": "c7_oven_floor",
        "label": "Убрать разлитое и дать семье помочь",
        "minutes": 20,
        "terminal": true,
        "goto": "c7_ahr",
        "text": "Ты вытираешь воду, пока Уве остаётся рядом с Биргит. Мокрую тряпку вывешиваешь снаружи мойки. Теперь никто не поскользнётся у её стула.",
        "effects": [{"set": "$.c7_oven.done", "value": true}, {"set": "$.c7_oven.result", "value": "floor"}, {"body": "fatigue", "delta": 4}, {"npc": "uwe", "trust": 4}]
      }
    ],
    "location": "ahrensburg"
  },
  {
    "id": "c7_bus",
    "for": "any",
    "chapter": "ch3",
    "title": "Подойти к прибывшему автобусу",
    "universal": false,
    "text": [
      {"text": "К спортзалу подъезжает автобус с бумажной табличкой. Внутри люди стоят в проходе. Двери сразу не открывают."},
      {"text": "На переднем сиденье мужчина с одеялом на плечах. Он сидит отдельно от остальных и держит руки под мышками."}
    ],
    "onEnter": [{"set": "$.c7_bus.started", "value": true}],
    "actions": [
      {
        "id": "c7_bus_tent",
        "label": "Помочь разместить людей отдельно",
        "minutes": 25,
        "terminal": true,
        "goto": "c7_north",
        "text": "Ты выносишь коробки и держишь край палатки. Пассажиры выходят по одному после осмотра. Мужчину с одеялом ведёт медик.",
        "effects": [
          {"set": "$.c7_bus.done", "value": true},
          {"set": "$.c7_bus.result", "value": "tent"},
          {"body": "fatigue", "delta": 6},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c7_bus_reunite",
        "label": "Найти дочь женщины в зале",
        "minutes": 20,
        "terminal": true,
        "goto": "c7_north",
        "text": "Ты находишь девочку у стены и зовёшь дежурную. К автобусу её ведут за руку. Встречаются они уже после осмотра, под навесом.",
        "effects": [{"set": "$.c7_bus.done", "value": true}, {"set": "$.c7_bus.result", "value": "reunite"}, {"body": "stress", "delta": -3}]
      },
      {
        "id": "c7_bus_door",
        "label": "Остаться у двери спортзала",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_north",
        "text": "Ты держишь проход свободным, не пуская очередь внутрь без Хинрихсен. Люди сердятся на тебя. Дежурная не просит отойти.",
        "effects": [
          {"set": "$.c7_bus.done", "value": true},
          {"set": "$.c7_bus.result", "value": "door"},
          {"body": "stress", "delta": 8},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      }
    ],
    "location": "north_gym"
  },
  {
    "id": "c7_socks",
    "for": "any",
    "chapter": "ch3",
    "title": "Подойти к медику у ширмы",
    "universal": false,
    "text": [
      {"text": "Медик поднимает чужой носок двумя пальцами. Под ним на мате мокрое пятно. Мужчина на раскладушке отворачивается к стене."},
      {"text": "— Чистое. Сухое. Носки, ткань, — перечисляет медик. Нога мужчины ещё закрыта одеялом."}
    ],
    "onEnter": [{"set": "$.c7_socks.started", "value": true}],
    "actions": [
      {
        "id": "c7_socks_cloth",
        "label": "Отдать своё полотенце",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_north",
        "text": "Медик складывает чистую ткань вдвое. Мужчина перестаёт прятать лицо к стене. Полотенце тебе уже не вернут.",
        "effects": [{"set": "$.c7_socks.done", "value": true}, {"set": "$.c7_socks.result", "value": "cloth"}, {"take": "towel"}],
        "enabled": {"has": "towel"},
        "disabledReason": "Нужные вещи сейчас не при тебе"
      },
      {
        "id": "c7_socks_wash",
        "label": "Помочь выстирать и высушить бельё",
        "minutes": 30,
        "terminal": true,
        "goto": "c7_north",
        "text": "Ты стираешь отдельно от посуды. На верёвке у котла находится место для одной пары. Дежурная приносит вторую прищепку.",
        "effects": [{"set": "$.c7_socks.done", "value": true}, {"set": "$.c7_socks.result", "value": "wash"}, {"body": "fatigue", "delta": 7}]
      },
      {
        "id": "c7_socks_wait",
        "label": "Попросить дежурную решить с пакетом",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_north",
        "text": "Дежурная идёт к семье, которой обещала вещи. Возвращается с одной парой носков. Пакет остаётся у тех, кому был обещан.",
        "effects": [{"set": "$.c7_socks.done", "value": true}, {"set": "$.c7_socks.result", "value": "wait"}, {"body": "stress", "delta": 4}]
      }
    ],
    "location": "north_gym"
  },
  {
    "id": "c7_evacwarning",
    "for": "any",
    "chapter": "ch3",
    "title": "Подойти к дежурному у ряда",
    "universal": false,
    "text": [{"text": "Дежурный просит всем сесть на свои места. Солдаты у входа надевают перчатки поверх рукавов. В соседнем павильоне что-то бьют."}],
    "onEnter": [{"set": "$.c7_evacwarning.started", "value": true}],
    "actions": [
      {
        "id": "c7_evacwarning_ready",
        "label": "Собрать вещи и остаться у края ряда",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_messe",
        "text": "Ты поднимаешь рюкзак на одно плечо. С края ряда видна дверь под табличкой. Дальше проход уже закрывают чужие спины.",
        "effects": [{"set": "$.c7_evacwarning.done", "value": true}, {"set": "$.c7_evacwarning.result", "value": "ready"}, {"set": "$.messe_exit", "value": true}, {"body": "stress", "delta": 6}],
        "when": {"not": {"flag": "w.c3_messe_outbreak"}}
      },
      {
        "id": "c7_evacwarning_help",
        "label": "Помочь соседу встать",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_messe",
        "text": "Ты подаёшь ему край куртки, за который можно держаться. Он поднимается сам, цепляясь за спинку. К проходу вы выходите медленно.",
        "effects": [{"set": "$.c7_evacwarning.done", "value": true}, {"set": "$.c7_evacwarning.result", "value": "help"}, {"body": "fatigue", "delta": 5}],
        "when": {"not": {"flag": "w.c3_messe_outbreak"}}
      },
      {
        "id": "c7_evacwarning_seat",
        "label": "Остаться на месте по приказу",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_messe",
        "text": "Ты садишься с рюкзаком на коленях. В бутылке вода ходит из стороны в сторону. Руки держат её всё крепче.",
        "effects": [{"set": "$.c7_evacwarning.done", "value": true}, {"set": "$.c7_evacwarning.result", "value": "seat"}, {"body": "stress", "delta": 10}],
        "when": {"not": {"flag": "w.c3_messe_outbreak"}}
      },
      {"id": "c7_alarm", "label": "Уйти к служебной двери", "minutes": 0, "terminal": true, "goto": "c7_messe_exit", "when": {"flag": "w.c3_messe_outbreak"}}
    ],
    "location": "messe",
    "safe": false
  },
  {
    "id": "c7_nursehurt",
    "for": "any",
    "chapter": "ch3",
    "title": "Ответить медсестре у койки",
    "universal": false,
    "text": [{"text": "Медсестра у твоей койки держит правую руку выше локтя. Левой ищет ножницы в кармане. На перчатке узкая красная полоска."}],
    "onEnter": [{"set": "$.c7_nursehurt.started", "value": true}],
    "actions": [
      {
        "id": "c7_nursehurt_space",
        "label": "Отойти и освободить проход",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_q",
        "text": "Ты отступаешь к стене с вещами. Медик ведёт коллегу к двери, придерживая её только за плечо. Дверь закрывают за ними.",
        "effects": [{"set": "$.c7_nursehurt.done", "value": true}, {"set": "$.c7_nursehurt.result", "value": "space"}, {"set": "$.messe_exit", "value": true}, {"body": "stress", "delta": 8}],
        "when": {"not": {"flag": "w.c3_messe_outbreak"}}
      },
      {
        "id": "c7_nursehurt_gloves",
        "label": "Показать запас чистых перчаток",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_q",
        "text": "Ты кладёшь упаковку на пустой стул. Медик забирает её, не наклоняясь к твоей койке. На пластике остаётся вмятина от его пальцев.",
        "effects": [{"set": "$.c7_nursehurt.done", "value": true}, {"set": "$.c7_nursehurt.result", "value": "gloves"}, {"take": "nitrile_gloves", "qty": 2}],
        "enabled": {"has": "nitrile_gloves", "qty": 2},
        "disabledReason": "Нужные вещи сейчас не при тебе",
        "when": {"not": {"flag": "w.c3_messe_outbreak"}}
      },
      {
        "id": "c7_nursehurt_stay",
        "label": "Остаться у своих вещей",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_q",
        "text": "Ты прижимаешь сумку к ногам. Кровь на перчатке больше не видна за чужими спинами. Из-за ширмы снова ударяют в металл.",
        "effects": [{"set": "$.c7_nursehurt.done", "value": true}, {"set": "$.c7_nursehurt.result", "value": "stay"}, {"body": "stress", "delta": 12}],
        "when": {"not": {"flag": "w.c3_messe_outbreak"}}
      },
      {"id": "c7_alarm", "label": "Уйти к служебной двери", "minutes": 0, "terminal": true, "goto": "c7_messe_exit", "when": {"flag": "w.c3_messe_outbreak"}}
    ],
    "location": "messe_q",
    "safe": false
  },
  {
    "id": "c7_whistle",
    "for": "any",
    "chapter": "ch3",
    "title": "Откликнуться на свист у дороги",
    "universal": false,
    "text": [
      {"text": "На углу свистит курьер с рюкзаком. Показывает на слетевшую педаль и спрашивает, есть ли здесь инструмент. Одну ногу держит на весу."},
      {"text": "Резьба забита грязью. На конце светлая стружка, как после перекоса."}
    ],
    "onEnter": [{"set": "$.c7_whistle.started", "value": true}],
    "actions": [
      {
        "id": "c7_whistle_tool",
        "label": "Помочь своим инструментом",
        "minutes": 20,
        "terminal": true,
        "goto": "c7_out",
        "text": "Сначала ты вычищаешь резьбу, потом наживляешь педаль рукой. Курьер пробует без веса. Она идёт ровнее, чем ты ожидал{m:|а}.",
        "effects": [{"set": "$.c7_whistle.done", "value": true}, {"set": "$.c7_whistle.result", "value": "tool"}, {"body": "fatigue", "delta": 4}],
        "enabled": {"has": "multitool"},
        "disabledReason": "Нужные вещи сейчас не при тебе"
      },
      {
        "id": "c7_whistle_carry",
        "label": "Отнести один пакет до перекрёстка",
        "minutes": 25,
        "terminal": true,
        "goto": "c7_out",
        "text": "Курьер отдаёт только запечатанный пакет. Дежурный у перекрёстка узнаёт его ещё издали. Ты возвращаешься без пакета и без инструмента в руках.",
        "effects": [{"set": "$.c7_whistle.done", "value": true}, {"set": "$.c7_whistle.result", "value": "carry"}, {"body": "fatigue", "delta": 6}]
      },
      {
        "id": "c7_whistle_point",
        "label": "Показать ближайший открытый двор",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_out",
        "text": "Ты объясняешь про ворота и верстак у стены. Курьер ведёт велосипед рядом. Педаль несёт в кармане, чтобы больше не потерять.",
        "effects": [{"set": "$.c7_whistle.done", "value": true}, {"set": "$.c7_whistle.result", "value": "point"}, {"body": "stress", "delta": 2}]
      }
    ]
  },
  {
    "id": "c7_shawl",
    "for": "any",
    "chapter": "ch3",
    "title": "Проверить оставленное у стены",
    "universal": false,
    "text": [
      {"text": "У стены, где ночью сидел человек, остаётся мокрый шарф. Его сумки нет. На шарфе лежит перевёрнутая кружка."},
      {"text": "Никто не отвечает. За углом шевелится тень от навеса, не от человека."}
    ],
    "onEnter": [{"set": "$.c7_shawl.started", "value": true}],
    "actions": [
      {
        "id": "c7_shawl_save",
        "label": "Убрать оставленное в сухую нишу",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_out",
        "text": "Ты двигаешь хлеб вместе с салфеткой. Кружку ставишь сверху, горлышком вниз. Шарф остаётся на виду, чтобы нашли место.",
        "effects": [{"set": "$.c7_shawl.done", "value": true}, {"set": "$.c7_shawl.result", "value": "save"}, {"body": "stress", "delta": -2}]
      },
      {
        "id": "c7_shawl_ask",
        "label": "Проверить ближайший пункт помощи",
        "minutes": 25,
        "terminal": true,
        "goto": "c7_out",
        "text": "Ты описываешь куртку и шарф дежурному. Он просит оставить описание на столе. Обратно проходишь мимо той же пустой стены.",
        "effects": [{"set": "$.c7_shawl.done", "value": true}, {"set": "$.c7_shawl.result", "value": "ask"}, {"body": "fatigue", "delta": 5}]
      },
      {
        "id": "c7_shawl_leave",
        "label": "Не трогать чужие вещи",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_out",
        "text": "Ты отходишь, стараясь не наступить на край шарфа. Кружка остаётся перевёрнутой. Её дно постепенно темнеет от влаги.",
        "effects": [{"set": "$.c7_shawl.done", "value": true}, {"set": "$.c7_shawl.result", "value": "leave"}, {"body": "stress", "delta": 4}]
      }
    ]
  },
  {
    "id": "c7_gatepile",
    "for": "any",
    "chapter": "ch3",
    "title": "Отойти от служебной двери",
    "universal": false,
    "text": [{"text": "Из служебной двери выносят створку сетки. Люди отступают прямо на тех, кто сидит у тента. Волонтёр кричит оставить проход."}],
    "onEnter": [{"set": "$.c7_gatepile.started", "value": true}],
    "actions": [
      {
        "id": "c7_gatepile_passage",
        "label": "Помочь удержать проход",
        "minutes": 20,
        "terminal": true,
        "goto": "c7_messe_yard",
        "text": "Ты стоишь боком у ограды и показываешь обходить тент. Люди проходят, касаясь твоего рукава. К двери спиной больше не поворачиваешься.",
        "effects": [{"set": "$.c7_gatepile.done", "value": true}, {"set": "$.c7_gatepile.result", "value": "passage"}, {"body": "fatigue", "delta": 6}]
      },
      {
        "id": "c7_gatepile_edge",
        "label": "Уйти с вещами к ограде",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_messe_yard",
        "text": "Ты находишь место у самого столба. Отсюда видно и тент, и ворота. На бетон садиться пока не хочется.",
        "effects": [{"set": "$.c7_gatepile.done", "value": true}, {"set": "$.c7_gatepile.result", "value": "edge"}, {"body": "stress", "delta": 8}]
      },
      {
        "id": "c7_gatepile_seat",
        "label": "Помочь подняться ещё одному человеку",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_messe_yard",
        "text": "Ты подаёшь край ремня. Человек подтягивается, цепляясь за него, и выпрямляется у ограды. На ремне остаются грязные отпечатки пальцев.",
        "effects": [{"set": "$.c7_gatepile.done", "value": true}, {"set": "$.c7_gatepile.result", "value": "seat"}, {"body": "fatigue", "delta": 7}]
      }
    ],
    "location": "c3_messe_yard"
  },
  {
    "id": "c7_redtag",
    "for": "any",
    "chapter": "ch3",
    "title": "Ответить дежурному с ножницами",
    "universal": false,
    "text": [
      {"text": "Дежурный во дворе просит показать браслеты. Красные пока не снимает. Ножницы лежат в прозрачном пакете у него на груди."},
      {"text": "Пластик намок у края. Дежурный читает номер, не поднимая твою руку."}
    ],
    "onEnter": [{"set": "$.c7_redtag.started", "value": true}],
    "actions": [
      {
        "id": "c7_redtag_ask",
        "label": "Спросить, куда переводят",
        "minutes": 8,
        "combinable": true,
        "when": {"not": {"flag": "$.c7_redtag.asked"}},
        "text": "— Пока здесь. Дальше по осмотру, — говорит он. Слово «дальше» повторяет каждому. Имя написано с ошибкой в одной букве. Ты исправляешь вслух, не забирая ручку из его перчатки.",
        "effects": [{"set": "$.c7_redtag.asked", "value": true}]
      },
      {
        "id": "c7_redtag_search",
        "label": "Передать точные сведения о партнёре",
        "minutes": 20,
        "terminal": true,
        "goto": "c7_messe_yard",
        "text": "Ты называешь имя, зал и последнюю точку встречи. Дежурный повторяет каждое слово. На столе для поиска появляется ещё одна бирка.",
        "effects": [{"set": "$.c7_redtag.done", "value": true}, {"set": "$.c7_redtag.result", "value": "search"}, {"body": "stress", "delta": 4}]
      },
      {
        "id": "c7_redtag_honest",
        "label": "Рассказать про красный браслет",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_messe_yard",
        "text": "Ты показываешь запястье целиком, не закрывая рукавом. Дежурный направляет к краю тента, где сидит медик. До ворот пока не идёшь.",
        "effects": [{"set": "$.c7_redtag.done", "value": true}, {"set": "$.c7_redtag.result", "value": "honest"}, {"body": "stress", "delta": 5}]
      },
      {
        "id": "c7_redtag_stay",
        "label": "Остаться рядом со своими вещами",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_messe_yard",
        "text": "Ты запоминаешь стол у ворот. Сумку кладёшь между коленями. К нему ещё можно будет подойти днём.",
        "effects": [{"set": "$.c7_redtag.done", "value": true}, {"set": "$.c7_redtag.result", "value": "stay"}]
      }
    ],
    "location": "c3_messe_yard"
  },
  {
    "id": "c7_stairwellwater",
    "for": "any",
    "chapter": "ch3",
    "title": "Ответить на стук снизу",
    "universal": false,
    "text": [
      {"text": "С нижней площадки зовут помочь с ведром. Женщина держит ручку обеими руками, но не может поднять на следующую ступеньку."},
      {"text": "Женщина показывает на верхнюю дверь. Домофон там не работает, она несёт воду матери соседки."}
    ],
    "onEnter": [{"set": "$.c7_stairwellwater.started", "value": true}],
    "actions": [
      {
        "id": "c7_stairwellwater_carry",
        "label": "Поднять вдвоём",
        "minutes": 20,
        "terminal": true,
        "goto": "c7_bflat",
        "text": "Вы несёте ведро за одну ручку с двух сторон. На повороте приходится остановиться, выдохнуть и снова взяться. Наверху дверь открывают сразу.",
        "effects": [{"set": "$.c7_stairwellwater.done", "value": true}, {"set": "$.c7_stairwellwater.result", "value": "carry"}, {"body": "fatigue", "delta": 6}]
      },
      {
        "id": "c7_stairwellwater_split",
        "label": "Разлить по закрытым бутылкам",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_bflat",
        "text": "Женщина достаёт из сумки пустую тару. Ты придерживаешь ведро, она льёт над миской. По лестнице теперь можно нести по одной бутылке.",
        "effects": [{"set": "$.c7_stairwellwater.done", "value": true}, {"set": "$.c7_stairwellwater.result", "value": "split"}, {"body": "fatigue", "delta": 3}]
      },
      {
        "id": "c7_stairwellwater_clear",
        "label": "Освободить проход и позвать наверху",
        "minutes": 12,
        "terminal": true,
        "goto": "c7_bflat",
        "text": "Ты убираешь коробки и стучишь в верхнюю дверь. Оттуда выходит человек с двумя пустыми бутылками. Ведро остаётся на сухой ступеньке.",
        "effects": [{"set": "$.c7_stairwellwater.done", "value": true}, {"set": "$.c7_stairwellwater.result", "value": "clear"}, {"body": "stress", "delta": -2}]
      }
    ],
    "location": "b_flat"
  }
];

export const morning13Events: WorldEvent[] = [
  {
    "id": "ev_c7_kerem",
    "at": 4780,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4780}, {"before": 5150}, {"all": [{"npc": "kerem", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c7_kerem.done"}}]}, {"at": "hof_luedemann"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Керем выходит из сарая с сумкой. На плече ремень, в руке два яблока. На дом он не смотрит."}]
  },
  {
    "id": "ev_c7_trough",
    "at": 4940,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4940}, {"before": 5150}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"not": {"flag": "$.c7_trough.done"}}]}, {"at": "hof_luedemann"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Вода от колодца идёт по двору к крыльцу. Оле стоит сапогом в желобе и ругается сквозь зубы. Собака боится перейти лужу."}]
  },
  {
    "id": "ev_c7_bedding",
    "at": 4820,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4820}, {"before": 5150}, {"all": [{"npc": "pawel", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c7_bedding.done"}}]}, {"at": "farm_coop"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "К порогу подталкивают сухой мешок. Хенрике говорит, что намокшее сено нужно вынести сегодня. Мешок слишком узкий для всего тюфяка."}]
  },
  {
    "id": "ev_c7_scrape",
    "at": 4980,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4980}, {"before": 5150}, {"all": [{"npc": "c3_koehler", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c7_scrape.done"}}]}, {"at": "farm_coop"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Снаружи новые шаги: лёгкие, потом скрежет колеса. Женщина спрашивает, свободно ли это помещение. Ты слышишь ответ Оле: «Нет»."}]
  },
  {
    "id": "ev_c7_fumes",
    "at": 4775,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4775}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_fumes.done"}}]}, {"any": [{"at": "a_flat"}, {"at": "a_stairs"}]}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "У входа в дом сосед сидит на ступеньке, опустив подбородок на грудь. Рядом генератор, кабель уходит в подъезд. Сосед не отвечает на первый зов."}]
  },
  {
    "id": "ev_c7_emptytank",
    "at": 4970,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4970}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_emptytank.done"}}]}, {"any": [{"at": "a_flat"}, {"at": "a_stairs"}]}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "У дома возвращаются люди с пустыми вёдрами. Цистерна не приехала. Сосед с третьего этажа садится на перевёрнутое ведро у входа."}]
  },
  {
    "id": "ev_c7_silence",
    "at": 4875,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4875}, {"before": 5150}, {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"any": [{"npc": "okafor", "status": "infected"}, {"npc": "okafor", "status": "turned"}]}]}, {"not": {"flag": "$.c7_silence.done"}}]}, {"any": [{"at": "b_flat"}, {"at": "b_stairs"}, {"at": "b_okafor"}]}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "У Окафора глухо падает мебель. Потом вдоль двери тянется медленный скрежет. На твой первый зов никто не отвечает."}]
  },
  {
    "id": "ev_c7_papers",
    "at": 4990,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4990}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_papers.done"}}]}, {"any": [{"at": "b_flat"}, {"at": "b_stairs"}, {"at": "b_okafor"}]}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Внизу ходит мужчина с жилетом жилищной компании. Спрашивает, кто ещё в доме. У его ботинка болтается развязанный шнурок."}]
  },
  {
    "id": "ev_c7_invoice",
    "at": 4840,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4840}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_invoice.done"}}]}, {"at": "deniz_workshop"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "В ворота стучит мужчина с квитанцией. На бумаге название мастерской. Он требует отдать машину, которой внутри нет."}]
  },
  {
    "id": "ev_c7_heater",
    "at": 4955,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4955}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_heater.done"}}]}, {"at": "deniz_workshop"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Из щели соседнего бокса идёт сизый дым. Снаружи кричат про обогреватель. Железная створка приоткрыта на цепь."}]
  },
  {
    "id": "ev_c7_brokenpen",
    "at": 4770,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4770}, {"before": 5150}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}, {"not": {"flag": "$.c7_brokenpen.done"}}]}, {"at": "ahrensburg"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "На кухонной плитке лопается тонкое стекло. Мерле стоит над упавшей ручкой. На полу растекается прозрачная жидкость."}]
  },
  {
    "id": "ev_c7_oven",
    "at": 5000,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 5000}, {"before": 5150}, {"all": [{"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]}, {"not": {"flag": "$.c7_oven.done"}}]}, {"at": "ahrensburg"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Биргит держит кисть под холодной водой. Кастрюля на плите наклонена, на полу мокрая дорожка до мойки. Уве зовёт Мерле."}]
  },
  {
    "id": "ev_c7_bus",
    "at": 4850,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4850}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_bus.done"}}]}, {"at": "north_gym"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "К спортзалу подъезжает автобус с бумажной табличкой. Внутри люди стоят в проходе. Двери сразу не открывают."}]
  },
  {
    "id": "ev_c7_socks",
    "at": 5020,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 5020}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_socks.done"}}]}, {"at": "north_gym"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Медик поднимает чужой носок двумя пальцами. Под ним на мате мокрое пятно. Мужчина на раскладушке отворачивается к стене."}]
  },
  {
    "id": "ev_c7_evacwarning",
    "at": 4820,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4820}, {"before": 4860}, {"all": []}, {"not": {"flag": "$.c7_evacwarning.done"}}]}, {"at": "messe"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Дежурный просит всем сесть на свои места. Солдаты у входа надевают перчатки поверх рукавов. В соседнем павильоне что-то бьют."}]
  },
  {
    "id": "ev_c7_nursehurt",
    "at": 4835,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4835}, {"before": 4860}, {"all": []}, {"not": {"flag": "$.c7_nursehurt.done"}}]}, {"at": "messe_q"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Медсестра у твоей койки держит правую руку выше локтя. Левой ищет ножницы в кармане. На перчатке узкая красная полоска."}]
  },
  {
    "id": "ev_c7_whistle",
    "at": 4825,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4825}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_whistle.done"}}]}, {"scene": "c7_out"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "На углу свистит курьер с рюкзаком. Показывает на слетевшую педаль и спрашивает, есть ли здесь инструмент. Одну ногу держит на весу."}]
  },
  {
    "id": "ev_c7_shawl",
    "at": 5025,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 5025}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_shawl.done"}}]}, {"scene": "c7_out"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "У стены, где ночью сидел человек, остаётся мокрый шарф. Его сумки нет. На шарфе лежит перевёрнутая кружка."}]
  },
  {
    "id": "ev_c7_gatepile",
    "at": 4895,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4895}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_gatepile.done"}}]}, {"at": "c3_messe_yard"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Из служебной двери выносят створку сетки. Люди отступают прямо на тех, кто сидит у тента. Волонтёр кричит оставить проход."}]
  },
  {
    "id": "ev_c7_redtag",
    "at": 5030,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 5030}, {"before": 5150}, {"all": []}, {"not": {"flag": "$.c7_redtag.done"}}]}, {"at": "c3_messe_yard"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Дежурный во дворе просит показать браслеты. Красные пока не снимает. Ножницы лежат в прозрачном пакете у него на груди."}]
  },
  {
    "id": "ev_c7_stairwellwater",
    "at": 4875,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 6}, {"not": {"cp": 7}}, {"after": 4875}, {"before": 5150}, {"not": {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"any": [{"npc": "okafor", "status": "infected"}, {"npc": "okafor", "status": "turned"}]}]}}, {"not": {"flag": "$.c7_stairwellwater.done"}}]}, {"any": [{"at": "b_flat"}, {"at": "b_stairs"}, {"at": "b_okafor"}]}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "С нижней площадки зовут помочь с ведром. Женщина держит ручку обеими руками, но не может поднять на следующую ступеньку."}]
  }
];
