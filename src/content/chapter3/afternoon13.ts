import type { Scene, WorldEvent } from '../../engine/content-types';

// 13 ноября: день и вечер.
export const afternoon13Scenes: Scene[] = [

  {
    "id": "c8_cellar",
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
        "id": "c8_bring_up",
        "label": "Отнести последнюю кастрюлю наверх",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_bring_up"}}, {"npc": "henrike", "at": "hof_luedemann", "alive": true}]},
        "text": "В погребе после ужина темнее, чем во дворе. Ты берёшь кастрюлю за обе ручки. Наверху Хенрике ждёт у лестницы: — Не ставь на ступеньку, сюда.",
        "effects": [{"set": "$.c8_bring_up", "value": true}, {"npc": "henrike", "trust": 2}]
      },
      {"id": "c8_back", "label": "Подняться в дом", "minutes": 2, "terminal": true, "goto": "c8_farm", "effects": []},
      {
        "id": "c8_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c8_neighborroad_approach", "label": "Подойти к соседу за калиткой", "minutes": 1, "terminal": true, "goto": "c8_neighborroad", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5200}, {"before": 5640}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"not": {"flag": "$.c8_neighborroad.done"}}]}},
      {"id": "c8_lampmeal_approach", "label": "Остановиться у кухонного стола", "minutes": 1, "terminal": true, "goto": "c8_lampmeal", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5435}, {"before": 5640}, {"all": [{"npc": "henrike", "alive": true, "at": "hof_luedemann"}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "pawel", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c8_lampmeal.done"}}]}},
      {"id": "c8_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c8_cp", "when": {"all": [{"cp": 7}, {"after": 5580}]}}
    ]
  },
  {
    "id": "c8_well",
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
        "id": "c8_empty_rope",
        "label": "Снять ведро до ночного мороза",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_empty_rope"}}, {"npc": "ole", "at": "hof_luedemann", "alive": true}]},
        "text": "Верёвка мокрая. Ты оставляешь её под навесом, ведро переворачиваешь рядом. Оле касается края: — Утром не отрывать хоть.",
        "effects": [{"set": "$.c8_empty_rope", "value": true}, {"npc": "ole", "trust": 2}]
      },
      {
        "id": "c8_pump",
        "label": "Закончить работу над насосом",
        "minutes": 0,
        "activity": "moderate",
        "repeatable": true,
        "combinable": true,
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"not": {"flag": "proj.c3_pump.done"}}, {"any": [{"has": "c3_hose"}, {"flag": "proj.c3_pump.started"}]}]},
        "text": "Ты снимаешь заусенец с края штуцера. Резина входит без залома. Хомут пока держишь только пальцами.",
        "effects": [{"work": "c3_pump", "hours": 1}]
      },
      {"id": "c8_back", "label": "Вернуться к печке", "minutes": 2, "terminal": true, "goto": "c8_farm", "effects": []},
      {
        "id": "c8_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c8_neighborroad_approach", "label": "Подойти к соседу за калиткой", "minutes": 1, "terminal": true, "goto": "c8_neighborroad", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5200}, {"before": 5640}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"not": {"flag": "$.c8_neighborroad.done"}}]}},
      {"id": "c8_lampmeal_approach", "label": "Остановиться у кухонного стола", "minutes": 1, "terminal": true, "goto": "c8_lampmeal", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5435}, {"before": 5640}, {"all": [{"npc": "henrike", "alive": true, "at": "hof_luedemann"}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "pawel", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c8_lampmeal.done"}}]}},
      {"id": "c8_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c8_cp", "when": {"all": [{"cp": 7}, {"after": 5580}]}}
    ]
  },
  {
    "id": "c8_gate",
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
        "id": "c8_ole_shift",
        "label": "Дать Оле посидеть у сетки",
        "minutes": 30,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_ole_shift"}}, {"npc": "ole", "at": "hof_luedemann", "alive": true}]},
        "text": "Он садится на ящик с ружьём между колен. — Не сплю, — говорит сразу. Ты встаёшь так, чтобы видеть дорогу вместо него.",
        "effects": [{"set": "$.c8_ole_shift", "value": true}, {"body": "fatigue", "delta": 5}, {"npc": "ole", "trust": 4}]
      },
      {"id": "c8_back", "label": "Зайти в дом", "minutes": 2, "terminal": true, "goto": "c8_farm", "effects": []},
      {
        "id": "c8_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c8_neighborroad_approach", "label": "Подойти к соседу за калиткой", "minutes": 1, "terminal": true, "goto": "c8_neighborroad", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5200}, {"before": 5640}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"not": {"flag": "$.c8_neighborroad.done"}}]}},
      {"id": "c8_lampmeal_approach", "label": "Остановиться у кухонного стола", "minutes": 1, "terminal": true, "goto": "c8_lampmeal", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5435}, {"before": 5640}, {"all": [{"npc": "henrike", "alive": true, "at": "hof_luedemann"}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "pawel", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c8_lampmeal.done"}}]}},
      {"id": "c8_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c8_cp", "when": {"all": [{"cp": 7}, {"after": 5580}]}}
    ]
  },
  {
    "id": "c8_aflat",
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
        "when": {"all": [{"all": [{"v": "$.c7_fumes.result", "op": "==", "value": "vent"}, {"all": []}]}, {"before": 5220}]},
        "text": "Сосед сидит у открытой двери, не удерживая голову. Свежий воздух проходит через квартиру; одеяло приходится держать на плечах."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_fumes.result", "op": "==", "value": "call"}, {"all": []}]}, {"before": 5220}]},
        "text": "Люди с улицы выводят соседа. Один возвращается за твоим именем: нужно записать, кто позвал."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_fumes.result", "op": "==", "value": "window"}, {"all": []}]}, {"before": 5220}]},
        "text": "Внизу открывают окна. Кто-то спрашивает про человека у генератора; ответа из подвала нет."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_emptytank.result", "op": "==", "value": "share"}, {"all": []}]}, {"before": 5220}]},
        "text": "Сверху спускают пустую бутылку. На верёвке новый узел: короткую часть оставили тебе для следующего раза."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_emptytank.result", "op": "==", "value": "check"}, {"all": []}]}, {"before": 5220}]},
        "text": "Ты возвращаешься с адресом раздачи. Сосед уже собирает пустые ёмкости, считая ступеньки до улицы."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_emptytank.result", "op": "==", "value": "save"}, {"all": []}]}, {"before": 5220}]},
        "text": "За стеной наполняют чашку по капле. Твои бутылки стоят у кровати, полные."
      },
      {
        "when": {"all": [{"v": "$.c8_notebag.result", "op": "==", "value": "take"}, {"any": [{"flag": "$.c3_neighbor_helped"}, {"flag": "$.c3_water_shared"}, {"flag": "$.c3_third_floor_water"}]}]},
        "text": "Свечи у тебя на столе. Сосед снизу стучит дважды, когда закрывает общий вход."
      },
      {
        "when": {"all": [{"v": "$.c8_notebag.result", "op": "==", "value": "return"}, {"any": [{"flag": "$.c3_neighbor_helped"}, {"flag": "$.c3_water_shared"}, {"flag": "$.c3_third_floor_water"}]}]},
        "text": "Яблоко забрали. Из пакета высыпалась записка: «На ночь дверь придержу»."
      },
      {
        "when": {"all": [{"v": "$.c8_notebag.result", "op": "==", "value": "later"}, {"any": [{"flag": "$.c3_neighbor_helped"}, {"flag": "$.c3_water_shared"}, {"flag": "$.c3_third_floor_water"}]}]},
        "text": "Пакет стоит закрытый. Сосед спрашивает с лестницы, не зря ли оставил его здесь."
      },
      {
        "when": {"all": [{"v": "$.c8_stairsnight.result", "op": "==", "value": "quiet"}, {"all": []}]},
        "text": "Дверь закрылась после долгого ожидания. Тень ещё раз проходит по стеклу, уже снаружи."
      },
      {
        "when": {"all": [{"v": "$.c8_stairsnight.result", "op": "==", "value": "together"}, {"all": []}]},
        "text": "Засов входит в паз под двумя руками. Сосед отпускает его первым и сразу садится на ступеньку."
      },
      {
        "when": {"all": [{"v": "$.c8_stairsnight.result", "op": "==", "value": "flat"}, {"all": []}]},
        "text": "Входная дверь хлопает до самой ночи. Каждый раз кажется, что хлопок стал на этаж ближе."
      },
      {
        "when": {"v": "w.c3_trip7", "op": "==", "value": "isolate"},
        "text": "Ваше тёплое место занято. Ты укладываешься у прохода, где каждый идущий задевает подстилку. За закрытой дверью кашляют; отвечать первым теперь тебе."
      }
    ],
    "actions": [
      {
        "id": "c8_a_candle",
        "label": "Поставить свечу в устойчивую банку",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_a_candle"}}, {"after": 5100}]},
        "text": "Свеча не качается, когда двигаешь стол. До занавески далеко. Ты убираешь бумагу от горячего стекла.",
        "effects": [{"set": "$.c8_a_candle", "value": true}]
      },
      {
        "id": "c8_a_chair",
        "label": "Проверить стул у ручки",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_a_chair"}}, {"after": 5100}]},
        "text": "Спинка держит под нужным углом. Ты подкладываешь ткань под дерево. Теперь металл не стучит, если тянуть снаружи.",
        "effects": [{"set": "$.c8_a_chair", "value": true}]
      },
      {
        "id": "c8_a_coat",
        "label": "Высушить ворот куртки",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_a_coat"}}, {"after": 5100}]},
        "text": "Ворот расправляешь на спинке второго стула. Не у огня, которого нет. Под ним остаётся полотенце, сухой стороной вверх.",
        "effects": [{"set": "$.c8_a_coat", "value": true}]
      },
      {
        "id": "c8_a_route",
        "label": "Убрать вещи с пути к выходу",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_a_route"}}, {"after": 5100}]},
        "text": "Коробку придвигаешь к стене. В темноте можно пройти, не поднимая колен. Край коврика прижат коробкой.",
        "effects": [{"set": "$.c8_a_route", "value": true}]
      },
      {
        "id": "c8_a_supper",
        "label": "Отделить завтрашнюю порцию от ужина",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_a_supper"}}, {"after": 5100}]},
        "text": "Открытую пачку закрываешь плотно. Для ужина берёшь только из неё. Нож возвращаешь туда, где лежал.",
        "effects": [{"set": "$.c8_a_supper", "value": true}]
      },
      {
        "id": "c8_a_socks",
        "label": "Проверить сухость носков",
        "minutes": 6,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_a_socks"}}, {"after": 5100}]},
        "text": "Сухие прячешь в рюкзак сразу. Влажную пару оставляешь развёрнутой, не сворачивая комком. На шве ещё холодно.",
        "effects": [{"set": "$.c8_a_socks", "value": true}]
      },
      {
        "id": "c8_a_partner",
        "label": "Присесть рядом с {partner.ins}",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"flag": "w.together"}, {"all": [{"not": {"flag": "$.c8_a_partner"}}, {"after": 5100}]}]},
        "text": "Вы садитесь на край кровати, лицом к двери. {partner} расправляет одеяло у твоей спины. Ты не замечаешь, когда перестаёшь сжимать кружку.",
        "effects": [{"set": "$.c8_a_partner", "value": true}, {"body": "stress", "delta": -7}]
      },
      {
        "id": "c8_a_windowdark",
        "label": "Проверить окно перед сном",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_a_windowdark"}}, {"after": 5100}]},
        "text": "К стеклу не подходишь вплотную. Между домами темно, только у входа чужой короткий луч. Он гаснет прежде, чем доходит до твоего окна.",
        "effects": [{"set": "$.c8_a_windowdark", "value": true}]
      },
      {"id": "c8_landing", "label": "Выйти на площадку", "minutes": 2, "terminal": true, "goto": "c8_landing_A", "effects": []},
      {
        "id": "c8_shutters",
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
        "id": "c8_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c8_notebag_approach", "label": "Проверить пакет под дверью", "minutes": 1, "terminal": true, "goto": "c8_notebag", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5220}, {"before": 5640}, {"not": {"flag": "$.c8_notebag.done"}}]}},
      {"id": "c8_stairsnight_approach", "label": "Проверить, почему открыта дверь внизу", "minutes": 1, "terminal": true, "goto": "c8_stairsnight", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5470}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_stairsnight.done"}}]}},
      {"id": "c8_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c8_cp", "when": {"all": [{"cp": 7}, {"after": 5580}]}}
    ],
    "onEnter": [
      {"if": {"all": [{"v": "w.c3_trip7", "op": "==", "value": "isolate"}, {"not": {"flag": "$.c8_promise_cost"}}]}, "then": [{"set": "$.c8_promise_cost", "value": true}, {"body": "fatigue", "delta": 7}, {"body": "stress", "delta": 5}]}
    ]
  },
  {
    "id": "c8_bflat",
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
        "when": {"all": [{"all": [{"v": "$.c7_silence.result", "op": "==", "value": "closed"}, {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"any": [{"npc": "okafor", "status": "infected"}, {"npc": "okafor", "status": "turned"}]}]}]}, {"before": 5220}]},
        "text": "Стул у двери сдвигается от удара изнутри. Окафор на своё имя не отвечает. Ты помнишь его просьбу."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_silence.result", "op": "==", "value": "guard"}, {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"any": [{"npc": "okafor", "status": "infected"}, {"npc": "okafor", "status": "turned"}]}]}]}, {"before": 5220}]},
        "text": "Дежурный просит всех отойти. Наверх он идёт без напарника и останавливается перед последней ступенькой."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_silence.result", "op": "==", "value": "move"}, {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"any": [{"npc": "okafor", "status": "infected"}, {"npc": "okafor", "status": "turned"}]}]}]}, {"before": 5220}]},
        "text": "У общей стены пусто. Удары слышно и из дальнего угла, но оттуда видно собственную дверь."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_papers.result", "op": "==", "value": "minimum"}, {"all": []}]}, {"before": 5220}]},
        "text": "Мужчина записал только число жильцов. Уходя, задерживается перед вашей дверью, словно хотел спросить ещё."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_papers.result", "op": "==", "value": "verify"}, {"all": []}]}, {"before": 5220}]},
        "text": "Соседи не знают этого человека. Он забирает лист и уходит прежде, чем кто-то спускается за дежурным."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_papers.result", "op": "==", "value": "refuse"}, {"all": []}]}, {"before": 5220}]},
        "text": "Карандаш не коснулся бумаги. На следующем этаже мужчина спрашивает, кто живёт над вами."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_stairwellwater.result", "op": "==", "value": "carry"}, {"not": {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"any": [{"npc": "okafor", "status": "infected"}, {"npc": "okafor", "status": "turned"}]}]}}]}, {"before": 5220}]},
        "text": "Ведро подняли наверх. Женщина придерживает тебе дверь и сразу отпускает больную руку."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_stairwellwater.result", "op": "==", "value": "split"}, {"not": {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"any": [{"npc": "okafor", "status": "infected"}, {"npc": "okafor", "status": "turned"}]}]}}]}, {"before": 5220}]},
        "text": "На верхней площадке стоят закрытые бутылки. Женщина делит их с тем, кто раньше не выходил на стук."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_stairwellwater.result", "op": "==", "value": "clear"}, {"not": {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"any": [{"npc": "okafor", "status": "infected"}, {"npc": "okafor", "status": "turned"}]}]}}]}, {"before": 5220}]},
        "text": "Сверху наконец спустились за водой. Женщина сидит на ступеньке, не пытаясь снова взяться за ручку."
      },
      {
        "when": {"all": [{"v": "$.c8_escort.result", "op": "==", "value": "facts"}, {"all": [{"npcVar": "okafor", "key": "bitten"}, {"flag": "w.c3_okafor_reported"}]}]},
        "text": "Медик повторяет сказанное тобой напарнику. Теперь за дверью зовут человека, зная, когда он перестал отвечать."
      },
      {
        "when": {"all": [{"v": "$.c8_escort.result", "op": "==", "value": "name"}, {"all": [{"npcVar": "okafor", "key": "bitten"}, {"flag": "w.c3_okafor_reported"}]}]},
        "text": "— Господин Окафор, — говорит медик. Пауза длится долго. Второй человек опускает щит, потом снова поднимает."
      },
      {
        "when": {"all": [{"v": "$.c8_escort.result", "op": "==", "value": "leave"}, {"all": [{"npcVar": "okafor", "key": "bitten"}, {"flag": "w.c3_okafor_reported"}]}]},
        "text": "Твои вещи у дальней двери. Когда в общей стене ударяет, ты хватаешь рюкзак за обе лямки."
      },
      {
        "when": {"all": [{"v": "$.c8_lightless.result", "op": "==", "value": "unplug"}, {"all": []}]},
        "text": "Удлинитель лежит с вынутой вилкой. Телефон заряжается только от того, что осталось в переносной батарее."
      },
      {
        "when": {"all": [{"v": "$.c8_lightless.result", "op": "==", "value": "neighbor"}, {"all": []}]},
        "text": "Соседи вытаскивают вилки из розеток. Кто-то спрашивает, можно ли оставить холодильник, и ждёт ответа."
      },
      {
        "when": {"all": [{"v": "$.c8_lightless.result", "op": "==", "value": "pack"}, {"all": []}]},
        "text": "Рюкзак закрыт. Телефон лежит сверху, провод болтается отдельно — в темноте его легко потерять."
      },
      {
        "when": {"all": [{"v": "$.c8_medbag.result", "op": "==", "value": "carry"}, {"not": {"all": [{"npcVar": "okafor", "key": "bitten"}, {"npc": "okafor", "alive": true, "at": "b_okafor"}]}}]},
        "text": "Сумку забрали наверху. Через минуту оттуда передают пустую упаковку: просят не выбрасывать, чтобы помнить название."
      },
      {
        "when": {"all": [{"v": "$.c8_medbag.result", "op": "==", "value": "wait"}, {"not": {"all": [{"npcVar": "okafor", "key": "bitten"}, {"npc": "okafor", "alive": true, "at": "b_okafor"}]}}]},
        "text": "Сосед спустился за лекарством сам. На обратном пути ты слышишь, как он делает паузу перед каждой ступенькой."
      },
      {
        "when": {"all": [{"v": "$.c8_medbag.result", "op": "==", "value": "call"}, {"not": {"all": [{"npcVar": "okafor", "key": "bitten"}, {"npc": "okafor", "alive": true, "at": "b_okafor"}]}}]},
        "text": "Женщина донесла сумку без тебя. Теперь сидит у входа и просит просто дать ей отдышаться."
      },
      {
        "when": {"v": "w.c3_trip7", "op": "==", "value": "isolate"},
        "text": "Ваше тёплое место занято. Ты укладываешься у прохода, где каждый идущий задевает подстилку. За закрытой дверью кашляют; отвечать первым теперь тебе."
      }
    ],
    "actions": [
      {
        "id": "c8_b_lamp",
        "label": "Отнести лампу от окна",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_b_lamp"}}, {"after": 5100}]},
        "text": "Свет ложится на противоположную стену. На улице больше не видно силуэта за столом. Ты проверяешь это отражением в стекле.",
        "effects": [{"set": "$.c8_b_lamp", "value": true}]
      },
      {
        "id": "c8_b_towel",
        "label": "Вывесить сухую ткань у двери",
        "minutes": 6,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_b_towel"}}, {"after": 5100}]},
        "text": "Крючок держится на одном саморезе. Ты вешаешь ткань ближе к стене, чтобы не выломать его. Край не касается пола.",
        "effects": [{"set": "$.c8_b_towel", "value": true}]
      },
      {
        "id": "c8_b_trash",
        "label": "Убрать мусор в закрытый пакет",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_b_trash"}}, {"after": 5100}]},
        "text": "Пакет завязываешь двойным узлом. На лестницу пока не выносишь. Кладёшь там, где не споткнуться ночью.",
        "effects": [{"set": "$.c8_b_trash", "value": true}]
      },
      {
        "id": "c8_b_keys",
        "label": "Подготовить свои ключи отдельно",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_b_keys"}}, {"after": 5100}]},
        "text": "Связки похожи в темноте. Ты оставляешь свою на шнурке внутри кармана. Шнурок от ключей трётся о запястье.",
        "effects": [{"set": "$.c8_b_keys", "value": true}]
      },
      {
        "id": "c8_b_food",
        "label": "Приготовить еду без лишней посуды",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_b_food"}}, {"after": 5100}]},
        "text": "Ты греешь маленькую порцию, не весь запас. Крышка подходит от другой кастрюли. На столе остаётся место для второй кружки.",
        "effects": [{"set": "$.c8_b_food", "value": true}]
      },
      {
        "id": "c8_b_mat",
        "label": "Освободить пол у входа",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_b_mat"}}, {"after": 5100}]},
        "text": "Обувь вдоль стены, рюкзак застёжкой к руке. Дверь открывается на полную ширину. Ты проверяешь один раз, без стука.",
        "effects": [{"set": "$.c8_b_mat", "value": true}]
      },
      {
        "id": "c8_b_partner",
        "label": "Посидеть с {partner.ins} у стола",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"flag": "w.together"}, {"all": [{"not": {"flag": "$.c8_b_partner"}}, {"after": 5100}]}]},
        "text": "Вы держите кружки, хотя чай уже остыл. {partner} пододвигает твою обувь ближе к сухому месту. Ты ставишь рядом свою кружку.",
        "effects": [{"set": "$.c8_b_partner", "value": true}, {"body": "stress", "delta": -7}]
      },
      {
        "id": "c8_b_curtain",
        "label": "Закрыть щель у шторы",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_b_curtain"}}, {"after": 5100}]},
        "text": "Внизу ходят с фонарём. Ты закрепляешь край ткани прищепкой, не поднимая её целиком. Луч проходит мимо.",
        "effects": [{"set": "$.c8_b_curtain", "value": true}]
      },
      {"id": "c8_landing", "label": "Выйти на площадку", "minutes": 2, "terminal": true, "goto": "c8_landing_B", "effects": []},
      {
        "id": "c8_okafor",
        "label": "Позвать Окафора из-за двери",
        "minutes": 2,
        "terminal": true,
        "goto": "c8_okafor",
        "when": {"npc": "okafor", "at": "b_okafor", "alive": true},
        "effects": []
      },
      {
        "id": "c8_shutters",
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
        "id": "c8_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c8_escort_approach", "label": "Ответить дежурному на площадке", "minutes": 1, "terminal": true, "goto": "c8_escort", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5230}, {"before": 5640}, {"all": [{"npcVar": "okafor", "key": "bitten"}, {"flag": "w.c3_okafor_reported"}]}, {"not": {"flag": "$.c8_escort.done"}}]}},
      {"id": "c8_lightless_approach", "label": "Остановиться у потемневшего окна", "minutes": 1, "terminal": true, "goto": "c8_lightless", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5415}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_lightless.done"}}]}},
      {"id": "c8_medbag_approach", "label": "Подойти к сумке у соседней двери", "minutes": 1, "terminal": true, "goto": "c8_medbag", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5230}, {"before": 5640}, {"not": {"flag": "$.c8_medbag.done"}}, {"not": {"all": [{"npcVar": "okafor", "key": "bitten"}, {"flag": "w.c3_okafor_reported"}]}}]}},
      {"id": "c8_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c8_cp", "when": {"all": [{"cp": 7}, {"after": 5580}]}}
    ],
    "onEnter": [
      {"if": {"all": [{"v": "w.c3_trip7", "op": "==", "value": "isolate"}, {"not": {"flag": "$.c8_promise_cost"}}]}, "then": [{"set": "$.c8_promise_cost", "value": true}, {"body": "fatigue", "delta": 7}, {"body": "stress", "delta": 5}]}
    ]
  },
  {
    "id": "c8_landing_A",
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
      {"id": "c8_back", "label": "Вернуться в квартиру", "minutes": 2, "terminal": true, "goto": "c8_aflat", "effects": []},
      {
        "id": "c8_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c8_notebag_approach", "label": "Проверить пакет под дверью", "minutes": 1, "terminal": true, "goto": "c8_notebag", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5220}, {"before": 5640}, {"not": {"flag": "$.c8_notebag.done"}}]}},
      {"id": "c8_stairsnight_approach", "label": "Проверить, почему открыта дверь внизу", "minutes": 1, "terminal": true, "goto": "c8_stairsnight", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5470}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_stairsnight.done"}}]}},
      {"id": "c8_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c8_cp", "when": {"all": [{"cp": 7}, {"after": 5580}]}}
    ]
  },
  {
    "id": "c8_landing_B",
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
      {"id": "c8_back", "label": "Вернуться в квартиру", "minutes": 2, "terminal": true, "goto": "c8_bflat", "effects": []},
      {
        "id": "c8_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c8_escort_approach", "label": "Ответить дежурному на площадке", "minutes": 1, "terminal": true, "goto": "c8_escort", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5230}, {"before": 5640}, {"all": [{"npcVar": "okafor", "key": "bitten"}, {"flag": "w.c3_okafor_reported"}]}, {"not": {"flag": "$.c8_escort.done"}}]}},
      {"id": "c8_lightless_approach", "label": "Остановиться у потемневшего окна", "minutes": 1, "terminal": true, "goto": "c8_lightless", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5415}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_lightless.done"}}]}},
      {"id": "c8_medbag_approach", "label": "Подойти к сумке у соседней двери", "minutes": 1, "terminal": true, "goto": "c8_medbag", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5230}, {"before": 5640}, {"not": {"flag": "$.c8_medbag.done"}}, {"not": {"all": [{"npcVar": "okafor", "key": "bitten"}, {"flag": "w.c3_okafor_reported"}]}}]}},
      {"id": "c8_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c8_cp", "when": {"all": [{"cp": 7}, {"after": 5580}]}}
    ]
  },
  {
    "id": "c8_workshop",
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
        "when": {"all": [{"all": [{"v": "$.c7_invoice.result", "op": "==", "value": "push"}, {"all": []}]}, {"before": 5220}]},
        "text": "Машину вытолкнули к дороге. Человек оставил у ворот своё имя и номер: просит сказать Денизу, что вернётся."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_invoice.result", "op": "==", "value": "tools"}, {"all": []}]}, {"before": 5220}]},
        "text": "Насос унесли. Чужой автомобиль остаётся перед боксом, но проход для человека свободен."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_invoice.result", "op": "==", "value": "point"}, {"all": []}]}, {"before": 5220}]},
        "text": "У ворот лежит старая квитанция. Мужчина смотрит через стекло на собственную машину и ждёт хозяина."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_heater.result", "op": "==", "value": "open"}, {"all": []}]}, {"before": 5220}]},
        "text": "Из бокса выходит мужчина, прикрывая рот рукавом. За твоей спиной захлопывается открытая скоба."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_heater.result", "op": "==", "value": "help"}, {"all": []}]}, {"before": 5220}]},
        "text": "Пожарные выносят человека вдвоём. Тебя просят держать ворота; ни один не отпускает носилки ради засова."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_heater.result", "op": "==", "value": "air"}, {"all": []}]}, {"before": 5220}]},
        "text": "Под щелью видны пальцы. Человек дышит у самого пола и просит не уходить."
      },
      {
        "when": {"all": [{"v": "$.c8_toolsback.result", "op": "==", "value": "keep"}, {"all": []}]},
        "text": "Чужая сумка под верстаком. На ней имя Дениза; уходя, придётся решить, кто её понесёт."
      },
      {
        "when": {"all": [{"v": "$.c8_toolsback.result", "op": "==", "value": "exchange"}, {"all": []}]},
        "text": "Взятый за хранение ключ лежит отдельно. Владелец сумки переспросил твоё имя и записал его на квитанции."
      },
      {
        "when": {"all": [{"v": "$.c8_toolsback.result", "op": "==", "value": "refuse"}, {"all": []}]},
        "text": "Человек ушёл со своей сумкой. У ворот остался возвращённый насос, никем не прикрытый от дождя."
      },
      {
        "when": {"all": [{"v": "$.c8_trailer.result", "op": "==", "value": "outside"}, {"all": []}]},
        "text": "Прицеп стоит снаружи вдоль забора. Из машины кто-то смотрит на твоё окно, прежде чем лечь."
      },
      {
        "when": {"all": [{"v": "$.c8_trailer.result", "op": "==", "value": "no"}, {"all": []}]},
        "text": "Машина отъехала, прицеп остался у дороги. Тебе слышно, как в нём ворочаются люди."
      },
      {
        "when": {"all": [{"v": "$.c8_trailer.result", "op": "==", "value": "papers"}, {"all": []}]},
        "text": "Документы убрали, когда ты вернул{m:|а} их. Водитель ждёт решения у закрытых ворот, не заводя мотор."
      },
      {
        "when": {"v": "w.c3_trip7", "op": "==", "value": "isolate"},
        "text": "Ваше тёплое место занято. Ты укладываешься у прохода, где каждый идущий задевает подстилку. За закрытой дверью кашляют; отвечать первым теперь тебе."
      },
      {"when": {"flag": "w.c3_jack_lent"}, "text": "Домкрат пока у чужих. Поднимать машину без него никто не берётся."}
    ],
    "actions": [
      {
        "id": "c8_shared_crackers",
        "label": "Отдать хлебцы тем, кто у прицепа",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_shared_crackers"}}, {"has": "crackers"}]},
        "text": "Ты передаёшь пачку через створку. Человек снаружи не берёт её, пока не переспросит: — Это всем? — Потом разворачивается к прицепу.",
        "effects": [{"set": "$.c8_shared_crackers", "value": true}, {"take": "crackers"}, {"body": "stress", "delta": -3}]
      },
      {
        "id": "c8_hold_backroom",
        "label": "Остаться в задней комнате",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_night_place"}}]},
        "text": "Ты проверяешь путь до ворот с закрытыми глазами. На третьем шаге коленом задеваешь коробку и переставляешь её. Спать будешь здесь, рядом с чужими вещами.",
        "effects": [{"set": "$.c8_night_place", "value": true}, {"body": "stress", "delta": -3}]
      },
      {
        "id": "c8_sleep_car",
        "label": "Устроиться у машины на ночь",
        "minutes": 20,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_night_place"}}]},
        "text": "Сиденье откидывается не до конца. Ты подкладываешь рукав под шею и оставляешь ключи в кармане. От ворот машину закрывает подъёмник.",
        "effects": [{"set": "$.c8_night_place", "value": true}, {"body": "fatigue", "delta": -4}]
      },
      {
        "id": "c8_tell_deniz",
        "label": "Передать Денизу, кому давал{m:|а} инструмент",
        "minutes": 20,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_tell_deniz"}}, {"npc": "deniz", "at": "deniz_workshop", "alive": true}]},
        "text": "Дениз слушает без вопросов, пока ты не заканчиваешь. — Хорошо. Завтра спросим с них. — Он снимает свою куртку с единственного целого стула и предлагает тебе сесть.",
        "effects": [{"set": "$.c8_tell_deniz", "value": true}, {"npc": "deniz", "trust": 4}]
      },
      {
        "id": "c8_keep_tools",
        "label": "Оставить сумку до разговора с Денизом",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_keep_tools"}}, {"all": [{"flag": "w.c3_tools_held"}, {"not": {"flag": "w.c3_tools_returned"}}]}]},
        "text": "Ты показываешь на имя у ручки. — Он просил, — говорит человек снаружи. Ты отвечаешь, что и вернуть должен он. Сумку убираешь подальше от ворот.",
        "effects": [{"set": "$.c8_keep_tools", "value": true}, {"body": "stress", "delta": 7}]
      },
      {
        "id": "c8_wait_owner",
        "label": "Дождаться хозяина чужой сумки",
        "minutes": 30,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_wait_owner"}}, {"flag": "w.c3_tools_held"}]},
        "text": "Владелец приходит за инструментом раньше темноты. Ты просишь назвать, что внутри. Он перечисляет, не глядя на сумку, и только потом тянет руку.",
        "effects": [{"set": "$.c8_wait_owner", "value": true}, {"set": "w.c3_tools_returned", "value": true}]
      },
      {
        "id": "c8_ws_door",
        "label": "Закончить направляющую ворот",
        "minutes": 0,
        "activity": "moderate",
        "repeatable": true,
        "combinable": true,
        "when": {"all": [{"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"not": {"flag": "proj.c3_ws_door.done"}}, {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}]}, {"any": [{"not": {"flag": "w.c3_jack_lent"}}, {"flag": "w.c3_jack_returned"}]}]},
        "text": "Ты проверяешь ход створки после каждого движения ключа. Створка проходит над бетоном с узким зазором. Ключ убираешь только после обратной проверки.",
        "effects": [{"work": "c3_ws_door", "hours": 1}]
      },
      {"id": "c8_ws_corner", "label": "Проверить заднюю комнату", "minutes": 2, "terminal": true, "goto": "c8_ws_corner", "effects": []},
      {
        "id": "c8_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c8_toolsback_approach", "label": "Ответить человеку с инструментом", "minutes": 1, "terminal": true, "goto": "c8_toolsback", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5210}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_toolsback.done"}}]}},
      {"id": "c8_trailer_approach", "label": "Проверить стук у ворот", "minutes": 1, "terminal": true, "goto": "c8_trailer", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5480}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_trailer.done"}}]}},
      {"id": "c8_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c8_cp", "when": {"all": [{"cp": 7}, {"after": 5580}]}}
    ],
    "onEnter": [
      {"if": {"all": [{"v": "w.c3_trip7", "op": "==", "value": "isolate"}, {"not": {"flag": "$.c8_promise_cost"}}]}, "then": [{"set": "$.c8_promise_cost", "value": true}, {"body": "fatigue", "delta": 7}, {"body": "stress", "delta": 5}]}
    ]
  },
  {
    "id": "c8_ws_corner",
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
      {"id": "c8_back", "label": "Вернуться в бокс", "minutes": 2, "terminal": true, "goto": "c8_workshop", "effects": []},
      {
        "id": "c8_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c8_toolsback_approach", "label": "Ответить человеку с инструментом", "minutes": 1, "terminal": true, "goto": "c8_toolsback", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5210}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_toolsback.done"}}]}},
      {"id": "c8_trailer_approach", "label": "Проверить стук у ворот", "minutes": 1, "terminal": true, "goto": "c8_trailer", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5480}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_trailer.done"}}]}},
      {"id": "c8_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c8_cp", "when": {"all": [{"cp": 7}, {"after": 5580}]}}
    ]
  },
  {
    "id": "c8_ahr",
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
        "when": {"all": [{"all": [{"v": "$.c7_brokenpen.result", "op": "==", "value": "clean"}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}]}, {"before": 5220}]},
        "text": "На полу чисто. Мерле считает целые ручки, а пустую коробку с разбитой держит отдельно."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_brokenpen.result", "op": "==", "value": "sit"}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}]}, {"before": 5220}]},
        "text": "Мерле садится рядом с тобой. — Запасная была. Теперь это та, которую нельзя разбить."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_brokenpen.result", "op": "==", "value": "parents"}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}]}, {"before": 5220}]},
        "text": "Биргит поднимает осколок через полотенце. Мерле просит её не говорить «ничего страшного»."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_oven.result", "op": "==", "value": "kitchen"}, {"all": [{"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]}]}, {"before": 5220}]},
        "text": "Биргит сидит у окна с поднятой рукой. Она дважды собирается встать к тебе и дважды остаётся."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_oven.result", "op": "==", "value": "dressing"}, {"all": [{"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]}]}, {"before": 5220}]},
        "text": "На руке Биргит твоя повязка. Ручку кастрюли теперь берёт Уве, не дожидаясь просьбы."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_oven.result", "op": "==", "value": "floor"}, {"all": [{"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]}]}, {"before": 5220}]},
        "text": "Пол вытерт. Биргит и Уве работают у плиты вдвоём; она указывает здоровой рукой."
      },
      {
        "when": {"all": [{"v": "$.c8_radio.result", "op": "==", "value": "garage"}, {"all": [{"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]}]},
        "text": "В гараже постелено для чужого человека. Биргит ставит у двери чашку и спрашивает Уве, когда ждать."
      },
      {
        "when": {"all": [{"v": "$.c8_radio.result", "op": "==", "value": "phone"}, {"all": [{"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]}]},
        "text": "Мерле перечитывает короткое сообщение. — Тут не сказано, что все вышли, — говорит она и больше не шутит."
      },
      {
        "when": {"all": [{"v": "$.c8_radio.result", "op": "==", "value": "home"}, {"all": [{"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]}]},
        "text": "Уве вешает ключи обратно. Биргит отводит глаза от него, когда убирает лишнюю тарелку."
      },
      {
        "when": {"all": [{"v": "$.c8_gatebasket.result", "op": "==", "value": "take"}, {"all": [{"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "uwe", "alive": true, "at": "ahrensburg"}]}]},
        "text": "Соседка уходит с пустой корзиной. У калитки оборачивается: завтра принесёт то, о чём договорились."
      },
      {
        "when": {"all": [{"v": "$.c8_gatebasket.result", "op": "==", "value": "return"}, {"all": [{"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "uwe", "alive": true, "at": "ahrensburg"}]}]},
        "text": "Муку забрали обратно. Биргит убирает со стола приготовленную для теста миску."
      },
      {
        "when": {"all": [{"v": "$.c8_gatebasket.result", "op": "==", "value": "door"}, {"all": [{"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "uwe", "alive": true, "at": "ahrensburg"}]}]},
        "text": "Уве пробует условленный стук на калитке. Соседка отвечает с другой стороны улицы."
      },
      {
        "when": {"v": "w.c3_trip7", "op": "==", "value": "isolate"},
        "text": "Ваше тёплое место занято. Ты укладываешься у прохода, где каждый идущий задевает подстилку. За закрытой дверью кашляют; отвечать первым теперь тебе."
      },
      {
        "when": {"v": "w.c3_trip7", "op": "==", "value": "escort"},
        "text": "Люди, которых вы взялись сопровождать, движутся медленно. Ты несёшь чужую сумку и останавливаешься всякий раз, когда они останавливаются. Твой сухой угол уже занят."
      }
    ],
    "actions": [
      {
        "id": "c8_insulin_bag",
        "label": "Убрать лекарство туда, где не замёрзнет",
        "minutes": 12,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_insulin_bag"}}, {"npc": "merle", "at": "ahrensburg", "alive": true}]},
        "text": "Мерле забирает коробку из слишком холодного угла. — Холодно — хорошо. Лёд — плохо. — Ты освобождаешь место повыше. Она сама ставит туда ручки.",
        "effects": [{"set": "$.c8_insulin_bag", "value": true}, {"npc": "merle", "trust": 3}]
      },
      {
        "id": "c8_stay_inside",
        "label": "Помочь Биргит закончить ужин",
        "minutes": 25,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_night_watch"}}, {"npc": "birgit", "at": "ahrensburg", "alive": true}]},
        "text": "Биргит режет хлеб здоровой рукой. Ты подставляешь доску ближе и держишь, пока она не закончит. — Уве позовите, — просит она, садясь.",
        "effects": [{"set": "$.c8_night_watch", "value": true}, {"body": "hunger", "delta": -20}, {"npc": "birgit", "trust": 4}]
      },
      {
        "id": "c8_uwe_watch",
        "label": "Сменить Уве у калитки",
        "minutes": 45,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_night_watch"}}, {"npc": "uwe", "at": "ahrensburg", "alive": true}]},
        "text": "Уве отдаёт тебе фонарь выключенным. — Кнопка здесь. На дорогу не светить. — Он уходит в дом; через окно видно, как Биргит берёт его за плечи.",
        "effects": [{"set": "$.c8_night_watch", "value": true}, {"body": "fatigue", "delta": 6}, {"npc": "uwe", "trust": 5}]
      },
      {
        "id": "c8_merle_parents",
        "label": "Поговорить с Биргит о ночном осмотре",
        "minutes": 20,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_merle_evening"}}, {"all": [{"npc": "birgit", "at": "ahrensburg", "alive": true}, {"npc": "merle", "at": "ahrensburg", "alive": true}]}]},
        "text": "Биргит спрашивает, будить ли дочь ночью. Ты предлагаешь сначала спросить её саму. — Тогда скажет, чтоб отстала, — отвечает мать. Всё-таки идёт наверх без градусника.",
        "effects": [{"set": "$.c8_merle_evening", "value": true}, {"npc": "birgit", "trust": 5}, {"npc": "merle", "trust": -2}]
      },
      {
        "id": "c8_merle_private",
        "label": "Поговорить с Мерле без родителей",
        "minutes": 25,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_merle_evening"}}, {"npc": "merle", "at": "ahrensburg", "alive": true}]},
        "text": "— Все спрашивают про уколы, — говорит она. — Будто я теперь только это. — Ты спрашиваешь про её комнату в Barmbek. Она отвечает сразу, но к концу рассказа голос становится тише.",
        "effects": [{"set": "$.c8_merle_evening", "value": true}, {"npc": "merle", "trust": 8}]
      },
      {"id": "c8_ahr_hall", "label": "Проверить прихожую", "minutes": 2, "terminal": true, "goto": "c8_ahr_hall", "effects": []},
      {
        "id": "c8_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c8_radio_approach", "label": "Подойти к Уве у радио", "minutes": 1, "terminal": true, "goto": "c8_radio", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5175}, {"before": 5640}, {"all": [{"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]}, {"not": {"flag": "$.c8_radio.done"}}]}},
      {"id": "c8_gatebasket_approach", "label": "Ответить у садовой калитки", "minutes": 1, "terminal": true, "goto": "c8_gatebasket", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5375}, {"before": 5640}, {"all": [{"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "uwe", "alive": true, "at": "ahrensburg"}]}, {"not": {"flag": "$.c8_gatebasket.done"}}]}},
      {"id": "c8_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c8_cp", "when": {"all": [{"cp": 7}, {"after": 5580}]}}
    ],
    "onEnter": [
      {"if": {"all": [{"v": "w.c3_trip7", "op": "==", "value": "isolate"}, {"not": {"flag": "$.c8_promise_cost"}}]}, "then": [{"set": "$.c8_promise_cost", "value": true}, {"body": "fatigue", "delta": 7}, {"body": "stress", "delta": 5}]},
      {"if": {"all": [{"v": "w.c3_trip7", "op": "==", "value": "escort"}, {"not": {"flag": "$.c8_promise_cost"}}]}, "then": [{"set": "$.c8_promise_cost", "value": true}, {"wait": 45, "activity": "moderate"}, {"body": "fatigue", "delta": 8}]}
    ]
  },
  {
    "id": "c8_ahr_hall",
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
      {"id": "c8_back", "label": "Вернуться на кухню", "minutes": 2, "terminal": true, "goto": "c8_ahr", "effects": []},
      {
        "id": "c8_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c8_radio_approach", "label": "Подойти к Уве у радио", "minutes": 1, "terminal": true, "goto": "c8_radio", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5175}, {"before": 5640}, {"all": [{"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]}, {"not": {"flag": "$.c8_radio.done"}}]}},
      {"id": "c8_gatebasket_approach", "label": "Ответить у садовой калитки", "minutes": 1, "terminal": true, "goto": "c8_gatebasket", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5375}, {"before": 5640}, {"all": [{"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "uwe", "alive": true, "at": "ahrensburg"}]}, {"not": {"flag": "$.c8_gatebasket.done"}}]}},
      {"id": "c8_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c8_cp", "when": {"all": [{"cp": 7}, {"after": 5580}]}}
    ]
  },
  {
    "id": "c8_north",
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
        "when": {"all": [{"all": [{"v": "$.c7_bus.result", "op": "==", "value": "tent"}, {"all": []}]}, {"before": 5220}]},
        "text": "Людей ведут под отдельный тент. Женщина из автобуса смотрит на тёплый зал и не отпускает поручень."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_bus.result", "op": "==", "value": "reunite"}, {"all": []}]}, {"before": 5220}]},
        "text": "Мать и дочь сидят у края мата. Между ними две сумки, но держатся они за руки поверх них."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_bus.result", "op": "==", "value": "door"}, {"all": []}]}, {"before": 5220}]},
        "text": "Ты держишь дверь вместе с местным. Снаружи кто-то стучит в стекло открытой ладонью."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_socks.result", "op": "==", "value": "cloth"}, {"all": []}]}, {"before": 5220}]},
        "text": "Твоё полотенце прикрывает мокрое место. Мужчина поднимает глаза, только когда ты отворачиваешься."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_socks.result", "op": "==", "value": "wash"}, {"all": []}]}, {"before": 5220}]},
        "text": "Бельё сохнет у вентилятора. Женщина из DRK ставит тебе воду без очереди, пока ты отжимаешь последнее."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_socks.result", "op": "==", "value": "wait"}, {"all": []}]}, {"before": 5220}]},
        "text": "Дежурная принесла пакет. Мужчина ждёт, пока она уйдёт, прежде чем снять грязное бельё."
      },
      {
        "when": {"all": [{"v": "$.c8_names.result", "op": "==", "value": "copy"}, {"all": []}]},
        "text": "Старый лист теперь под новым. Женщина водит пальцем по имени мужа, убеждаясь, что его не закрыли."
      },
      {
        "when": {"all": [{"v": "$.c8_names.result", "op": "==", "value": "cover"}, {"all": []}]},
        "text": "Пакет шуршит на ветру. Через него ещё можно разобрать почерк и старые номера телефонов."
      },
      {
        "when": {"all": [{"v": "$.c8_names.result", "op": "==", "value": "desk"}, {"all": []}]},
        "text": "Хинрихсен говорит с женщиной у стола. Очередь за ними растёт, но никто не просит поторопиться."
      },
      {
        "when": {"all": [{"v": "$.c8_firewatch.result", "op": "==", "value": "shift"}, {"all": []}]},
        "text": "Пожарный уснул на твоём мате. Его сапоги стоят рядом, носками к выходу."
      },
      {
        "when": {"all": [{"v": "$.c8_firewatch.result", "op": "==", "value": "split"}, {"all": []}]},
        "text": "Через полчаса тебя сменяют. Человек с мата приносит второй стул, не спрашивая, нужен ли он."
      },
      {
        "when": {"all": [{"v": "$.c8_firewatch.result", "op": "==", "value": "duty"}, {"all": []}]},
        "text": "Дежурная назначила смену сама. Человек с мата отворачивается от тебя, проходя к двери."
      },
      {
        "when": {"v": "w.c3_trip7", "op": "==", "value": "isolate"},
        "text": "Ваше тёплое место занято. Ты укладываешься у прохода, где каждый идущий задевает подстилку. За закрытой дверью кашляют; отвечать первым теперь тебе."
      },
      {
        "when": {"v": "w.c3_trip7", "op": "==", "value": "escort"},
        "text": "Люди, которых вы взялись сопровождать, движутся медленно. Ты несёшь чужую сумку и останавливаешься всякий раз, когда они останавливаются. Твой сухой угол уже занят."
      }
    ],
    "actions": [
      {
        "id": "c8_eat_last",
        "label": "Поесть после последней раздачи",
        "minutes": 25,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_eat_last"}}, {"flag": "$.c8_firewatch.done"}]},
        "text": "Пожарный оставил тебе закрытую миску. Еда остыла, но её достаточно. Ты ешь, сидя рядом с его сапогами, и стараешься не задеть их.",
        "effects": [{"set": "$.c8_eat_last", "value": true}, {"body": "hunger", "delta": -25}]
      },
      {
        "id": "c8_wake_duty",
        "label": "Разбудить назначенную смену",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_wake_duty"}}]},
        "text": "Человек на мате просит ещё пять минут. Ты остаёшься стоять. Он садится, ругается вполголоса и натягивает сапоги не на ту ногу.",
        "effects": [{"set": "$.c8_wake_duty", "value": true}, {"body": "stress", "delta": 4}]
      },
      {
        "id": "c8_keep_mat",
        "label": "Оставить свой мат за собой",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_mat"}}]},
        "text": "Ты раскладываешь вещи по краям мата. Женщина смотрит на них и проходит дальше, не спрашивая. Ребёнок идёт за ней, цепляясь за рукав.",
        "effects": [{"set": "$.c8_mat", "value": true}, {"body": "stress", "delta": 7}]
      },
      {
        "id": "c8_give_mat",
        "label": "Отдать свой мат женщине с ребёнком",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_mat"}}]},
        "text": "Ты вытаскиваешь мат из-под вещей. Мальчик ложится сразу, головой на её колени. Свои вещи ты переносишь на голый пол.",
        "effects": [{"set": "$.c8_mat", "value": true}, {"body": "fatigue", "delta": 8}, {"body": "stress", "delta": -3}]
      },
      {
        "id": "c8_read_names",
        "label": "Прочитать новые имена тем, кто не видит",
        "minutes": 20,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_read_names"}}]},
        "text": "Женщина без очков держит палец на краю листа. Ты читаешь по одному имени. На третьем она останавливает тебя: ей нужно услышать ещё раз.",
        "effects": [{"set": "$.c8_read_names", "value": true}, {"body": "stress", "delta": 4}]
      },
      {"id": "c8_north_door", "label": "Выйти к боковой двери", "minutes": 2, "terminal": true, "goto": "c8_north_door", "effects": []},
      {
        "id": "c8_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c8_names_approach", "label": "Посмотреть на лист у выхода", "minutes": 1, "terminal": true, "goto": "c8_names", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5260}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_names.done"}}]}},
      {"id": "c8_firewatch_approach", "label": "Подойти к спорящим дежурным", "minutes": 1, "terminal": true, "goto": "c8_firewatch", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5490}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_firewatch.done"}}]}},
      {"id": "c8_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c8_cp", "when": {"all": [{"cp": 7}, {"after": 5580}]}}
    ],
    "onEnter": [
      {"if": {"all": [{"v": "w.c3_trip7", "op": "==", "value": "isolate"}, {"not": {"flag": "$.c8_promise_cost"}}]}, "then": [{"set": "$.c8_promise_cost", "value": true}, {"body": "fatigue", "delta": 7}, {"body": "stress", "delta": 5}]},
      {"if": {"all": [{"v": "w.c3_trip7", "op": "==", "value": "escort"}, {"not": {"flag": "$.c8_promise_cost"}}]}, "then": [{"set": "$.c8_promise_cost", "value": true}, {"wait": 45, "activity": "moderate"}, {"body": "fatigue", "delta": 8}]}
    ]
  },
  {
    "id": "c8_north_door",
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
      {"id": "c8_back", "label": "Вернуться к матам", "minutes": 2, "terminal": true, "goto": "c8_north", "effects": []},
      {
        "id": "c8_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c8_names_approach", "label": "Посмотреть на лист у выхода", "minutes": 1, "terminal": true, "goto": "c8_names", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5260}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_names.done"}}]}},
      {"id": "c8_firewatch_approach", "label": "Подойти к спорящим дежурным", "minutes": 1, "terminal": true, "goto": "c8_firewatch", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5490}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_firewatch.done"}}]}},
      {"id": "c8_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c8_cp", "when": {"all": [{"cp": 7}, {"after": 5580}]}}
    ]
  },
  {
    "id": "c8_coop",
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
        "when": {"all": [{"all": [{"v": "$.c7_bedding.result", "op": "==", "value": "self"}, {"all": [{"npc": "pawel", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]}, {"before": 5220}]},
        "text": "На пороге лежит вынесенная солома. Хенрике смотрит на твою повязку: её придётся сменить."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_bedding.result", "op": "==", "value": "ask"}, {"all": [{"npc": "pawel", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]}, {"before": 5220}]},
        "text": "Павел уносит мокрую солому. Старается работать левой рукой, правую держит прижатой к груди."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_bedding.result", "op": "==", "value": "half"}, {"all": [{"npc": "pawel", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]}, {"before": 5220}]},
        "text": "Ты лежишь боком на сухом краю. Перевернуться можно только на мокрое."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_scrape.result", "op": "==", "value": "share"}, {"all": [{"npc": "c3_koehler", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]}, {"before": 5220}]},
        "text": "За досками слышно, как устраивается Кёлер. Сухой подстилки тебе осталось на одно плечо."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_scrape.result", "op": "==", "value": "rule"}, {"all": [{"npc": "c3_koehler", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]}, {"before": 5220}]},
        "text": "Кёлер отходит от двери, услышав твой отказ. Хенрике ведёт её к сараю, не споря при тебе."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_scrape.result", "op": "==", "value": "quiet"}, {"all": [{"npc": "c3_koehler", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]}, {"before": 5220}]},
        "text": "Хенрике сама приносит солому. — Тут не склад, — говорит она Кёлер. — Обойдём с другой стороны."
      },
      {
        "when": {"all": [{"v": "$.c8_keys.result", "op": "==", "value": "lift"}, {"all": [{"npc": "henrike", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "Дверь приподнята на петлях. Когда её закрывают, ты невольно придерживаешь больное плечо."
      },
      {
        "when": {"all": [{"v": "$.c8_keys.result", "op": "==", "value": "plane"}, {"all": [{"npc": "henrike", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "Свежая стружка под порогом. Сквозь новую щель тянет по ногам, зато засов двигается пальцем."
      },
      {
        "when": {"all": [{"v": "$.c8_keys.result", "op": "==", "value": "wait"}, {"all": [{"npc": "henrike", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "Хенрике оставила дверь приоткрытой, дежурного посадила снаружи. Заснуть под его взглядом трудно."
      },
      {
        "when": {"all": [{"v": "$.c8_supperdoor.result", "op": "==", "value": "thanks"}, {"all": [{"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "Оле пододвигает миску носком сапога. — Ешь, — говорит он и остаётся, пока ты её не заберёшь."
      },
      {
        "when": {"all": [{"v": "$.c8_supperdoor.result", "op": "==", "value": "ask"}, {"all": [{"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "Хенрике приходит сама. Оле отходит к сараю, не дождавшись конца вашего разговора."
      },
      {
        "when": {"all": [{"v": "$.c8_supperdoor.result", "op": "==", "value": "share"}, {"all": [{"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "Оле садится по другую сторону двери. Ложкой он стучит по краю миски в том же ритме, что ты."
      }
    ],
    "actions": [
      {
        "id": "c8_tell_partner",
        "label": "Написать о том, что скрывал{m:|а}",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_tell_partner"}}]},
        "text": "Ты начинаешь со слова «плохо», зачёркиваешь. Пишешь, что именно болит и когда началось. Эту записку сминать уже не будешь.",
        "effects": [{"set": "$.c8_tell_partner", "value": true}, {"body": "stress", "delta": -4}]
      },
      {
        "id": "c8_own_bread",
        "label": "Сберечь еду на случай новой ночи",
        "minutes": 12,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_own_bread"}}]},
        "text": "Ты не разворачиваешь последнюю пачку. Кладёшь её под голову, рядом с лекарствами. Горячее у двери быстро остывает.",
        "effects": [{"set": "$.c8_own_bread", "value": true}, {"body": "hunger", "delta": 7}]
      },
      {
        "id": "c8_leave_alone",
        "label": "Попросить никого не присылать",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_company"}}]},
        "text": "Ты говоришь через дверь, что побудешь в тишине. Шаги отходят. Когда хочется позвать обратно, их уже не слышно.",
        "effects": [{"set": "$.c8_company", "value": true}, {"body": "stress", "delta": 5}]
      },
      {
        "id": "c8_ask_company",
        "label": "Попросить посидеть за дверью",
        "minutes": 25,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_company"}}, {"npc": "pawel", "at": "hof_luedemann", "alive": true}]},
        "text": "Ты зовёшь не громко, чтобы слышали только у сарая. Павел садится снаружи. — Десять минут, — говорит он. Через десять не уходит.",
        "effects": [{"set": "$.c8_company", "value": true}, {"npc": "pawel", "trust": 5}, {"body": "stress", "delta": -7}]
      },
      {"id": "c8_coop_wall", "label": "Перейти к сухой стене", "minutes": 2, "terminal": true, "goto": "c8_coop_wall", "effects": []},
      {
        "id": "c8_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c8_keys_approach", "label": "Подойти к ключу в замке", "minutes": 1, "terminal": true, "goto": "c8_keys", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5240}, {"before": 5640}, {"all": [{"npc": "henrike", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c8_keys.done"}}]}},
      {"id": "c8_supperdoor_approach", "label": "Ответить на стук миски", "minutes": 1, "terminal": true, "goto": "c8_supperdoor", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5460}, {"before": 5640}, {"all": [{"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c8_supperdoor.done"}}]}},
      {"id": "c8_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c8_cp", "when": {"all": [{"cp": 7}, {"after": 5580}]}}
    ]
  },
  {
    "id": "c8_coop_wall",
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
      {"id": "c8_back", "label": "Вернуться к нарам", "minutes": 2, "terminal": true, "goto": "c8_coop", "effects": []},
      {
        "id": "c8_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c8_keys_approach", "label": "Подойти к ключу в замке", "minutes": 1, "terminal": true, "goto": "c8_keys", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5240}, {"before": 5640}, {"all": [{"npc": "henrike", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c8_keys.done"}}]}},
      {"id": "c8_supperdoor_approach", "label": "Ответить на стук миски", "minutes": 1, "terminal": true, "goto": "c8_supperdoor", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5460}, {"before": 5640}, {"all": [{"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c8_supperdoor.done"}}]}},
      {"id": "c8_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c8_cp", "when": {"all": [{"cp": 7}, {"after": 5580}]}}
    ]
  },
  {
    "id": "c8_out",
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
        "when": {"all": [{"all": [{"v": "$.c7_whistle.result", "op": "==", "value": "tool"}, {"all": []}]}, {"before": 5220}]},
        "text": "Курьер пробует педаль стоя. Поднимает руку тебе, прежде чем выехать из двора."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_whistle.result", "op": "==", "value": "carry"}, {"all": []}]}, {"before": 5220}]},
        "text": "Чужой пакет тяжёлый только с одного края. Получатель пересчитывает коробки при тебе, не приглашая внутрь."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_whistle.result", "op": "==", "value": "point"}, {"all": []}]}, {"before": 5220}]},
        "text": "Курьер уходит, ведя велосипед рядом. У показанного тобой двора снова свистит."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_shawl.result", "op": "==", "value": "save"}, {"all": []}]}, {"before": 5220}]},
        "text": "Шарф лежит в сухой нише. Вернувшийся человек берёт его, долго смотрит на тебя и молча надевает."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_shawl.result", "op": "==", "value": "ask"}, {"all": []}]}, {"before": 5220}]},
        "text": "У дежурного записано, где остались вещи. Он обещает спросить у следующей смены, но не говорит, что человек жив."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_shawl.result", "op": "==", "value": "leave"}, {"all": []}]}, {"before": 5220}]},
        "text": "Шарф промок насквозь. Когда поднимается ветер, кружка скатывается с него и звенит."
      },
      {
        "when": {"all": [{"v": "$.c8_sheltertarpaulin.result", "op": "==", "value": "wide"}, {"all": []}]},
        "text": "Под растянутым навесом помещаются чужие сумки. Твоё плечо осталось снаружи, и ткань куртки тяжелеет."
      },
      {
        "when": {"all": [{"v": "$.c8_sheltertarpaulin.result", "op": "==", "value": "fix"}, {"all": []}]},
        "text": "Прежний край привязан. Мужчина переносит мокрые сумки одну за другой и не смотрит в твою сторону."
      },
      {
        "when": {"all": [{"v": "$.c8_sheltertarpaulin.result", "op": "==", "value": "move"}, {"all": []}]},
        "text": "Твои вещи сухие у стены. Снаружи человек держит верёвку уже двумя руками."
      },
      {
        "when": {"all": [{"v": "$.c8_lastbus.result", "op": "==", "value": "water"}, {"all": []}]},
        "text": "Бутылка остаётся в твоём рюкзаке. Последний автобус уходит, и на остановке сразу становится слышно ветер."
      },
      {
        "when": {"all": [{"v": "$.c8_lastbus.result", "op": "==", "value": "confirm"}, {"all": []}]},
        "text": "Дежурный подтвердил адрес. Водитель уехал до конца разговора; теперь ты знаешь, куда, но не на чём."
      },
      {
        "when": {"all": [{"v": "$.c8_lastbus.result", "op": "==", "value": "share"}, {"all": []}]},
        "text": "Твою воду делят перед посадкой. Один пассажир пытается оставить тебе крышку, потом понимает и убирает руку."
      }
    ],
    "actions": [
      {
        "id": "c8_prepare_walk",
        "label": "Собрать вещи для выхода в темноте",
        "minutes": 20,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_prepare_walk"}}]},
        "text": "Ты складываешь всё в том порядке, в каком будешь брать. Чужая ладонь помогает затянуть ремень. Обернувшись, ты видишь только рукав — человек уже лёг.",
        "effects": [{"set": "$.c8_prepare_walk", "value": true}, {"body": "stress", "delta": -3}]
      },
      {
        "id": "c8_ask_return",
        "label": "Спросить про ушедшего утром",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_ask_return"}}]},
        "text": "Женщина говорит, что видела похожую куртку у автобуса. Потом добавляет: лицо не разглядела. Ты благодаришь именно за это уточнение.",
        "effects": [{"set": "$.c8_ask_return", "value": true}, {"body": "stress", "delta": 3}]
      },
      {
        "id": "c8_share_food",
        "label": "Разделить хлебцы с человеком у стены",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_share_food"}}, {"has": "crackers"}]},
        "text": "Он ломает хлебец на три части, одну протягивает тебе. Ты показываешь, что уже ел{m:|а}. Тогда он заворачивает третью часть отдельно, на утро.",
        "effects": [{"set": "$.c8_share_food", "value": true}, {"take": "crackers"}, {"body": "stress", "delta": -4}]
      },
      {
        "id": "c8_refuse_watch",
        "label": "Отказаться караулить за всех",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_watch"}}]},
        "text": "Ты показываешь на свои дрожащие руки. Мужчина смотрит и кивает: останется сам. После этого тебе труднее лечь к нему спиной.",
        "effects": [{"set": "$.c8_watch", "value": true}, {"body": "stress", "delta": 6}]
      },
      {
        "id": "c8_take_watch",
        "label": "Взять первую смену у прохода",
        "minutes": 60,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_watch"}}]},
        "text": "Человек под навесом обещает сменить через час. Через час он спит. Ты видишь его открытый рот и не знаешь, стоит ли будить.",
        "effects": [{"set": "$.c8_watch", "value": true}, {"body": "fatigue", "delta": 9}]
      },
      {"id": "c8_out_corner", "label": "Проверить дальний угол", "minutes": 2, "terminal": true, "goto": "c8_out_corner", "effects": []},
      {
        "id": "c8_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c8_sheltertarpaulin_approach", "label": "Подойти к сорванному навесу", "minutes": 1, "terminal": true, "goto": "c8_sheltertarpaulin", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5290}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_sheltertarpaulin.done"}}]}},
      {"id": "c8_lastbus_approach", "label": "Выслушать людей у остановки", "minutes": 1, "terminal": true, "goto": "c8_lastbus", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5505}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_lastbus.done"}}]}},
      {"id": "c8_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c8_cp", "when": {"all": [{"cp": 7}, {"after": 5580}]}}
    ]
  },
  {
    "id": "c8_out_corner",
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
      {"id": "c8_back", "label": "Вернуться под навес", "minutes": 2, "terminal": true, "goto": "c8_out", "effects": []},
      {
        "id": "c8_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c8_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c8_cp", "when": {"all": [{"cp": 7}, {"after": 5580}]}}
    ]
  },
  {
    "id": "c8_messe",
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
        "when": {"all": [{"all": [{"v": "$.c7_evacwarning.result", "op": "==", "value": "ready"}, {"all": []}]}, {"before": 5220}]},
        "text": "Рюкзак уже на плечах. Между твоей койкой и стеной оставлен проход шириной в ступню."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_evacwarning.result", "op": "==", "value": "help"}, {"all": []}]}, {"before": 5220}]},
        "text": "Сосед стоит, опираясь на твоё плечо. Взять свой рюкзак теперь можно только другой рукой."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_evacwarning.result", "op": "==", "value": "seat"}, {"all": []}]}, {"before": 5220}]},
        "text": "Ты сидишь, как велели. Когда люди встают одновременно, твоя сумка оказывается под чужими ногами."
      }
    ],
    "actions": [
      {
        "id": "c8_m_wall_messe",
        "label": "Отойти к стене",
        "minutes": 2,
        "terminal": true,
        "goto": "c8_messe_wall",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]}]},
        "effects": []
      },
      {
        "id": "c8_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку.",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]}]}
      },
      {"id": "c8_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c8_cp", "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"cp": 7}, {"after": 5580}]}]}]}},
      {"id": "c8_alarm", "label": "Уйти к служебной двери", "minutes": 0, "terminal": true, "goto": "c8_messe_exit", "when": {"flag": "w.c3_messe_outbreak"}}
    ],
    "universal": false
  },
  {
    "id": "c8_q",
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
        "when": {"all": [{"all": [{"v": "$.c7_nursehurt.result", "op": "==", "value": "space"}, {"all": []}]}, {"before": 5220}]},
        "text": "Ты {m:отошёл|отошла} от тележки. Медсестре есть куда отступить, когда за тканью встают."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_nursehurt.result", "op": "==", "value": "gloves"}, {"all": []}]}, {"before": 5220}]},
        "text": "Медсестра сняла повреждённую перчатку. Твою упаковку прижала к локтю: второй рукой уже некогда."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_nursehurt.result", "op": "==", "value": "stay"}, {"all": []}]}, {"before": 5220}]},
        "text": "Рюкзак у тебя на коленях. Медсестра протискивается между ним и тележкой боком."
      }
    ],
    "actions": [
      {
        "id": "c8_m_wall_q",
        "label": "Отойти к стене",
        "minutes": 2,
        "terminal": true,
        "goto": "c8_q_wall",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]}]},
        "effects": []
      },
      {
        "id": "c8_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку.",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]}]}
      },
      {"id": "c8_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c8_cp", "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"cp": 7}, {"after": 5580}]}]}]}},
      {"id": "c8_alarm", "label": "Уйти к служебной двери", "minutes": 0, "terminal": true, "goto": "c8_messe_exit", "when": {"flag": "w.c3_messe_outbreak"}}
    ],
    "universal": false
  },
  {
    "id": "c8_messe_wall",
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
        "id": "c8_back",
        "label": "Вернуться к своему месту",
        "minutes": 2,
        "terminal": true,
        "goto": "c8_messe",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]}]},
        "effects": []
      },
      {
        "id": "c8_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку.",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]}]}
      },
      {"id": "c8_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c8_cp", "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"cp": 7}, {"after": 5580}]}]}]}},
      {"id": "c8_alarm", "label": "Уйти к служебной двери", "minutes": 0, "terminal": true, "goto": "c8_messe_exit", "when": {"flag": "w.c3_messe_outbreak"}}
    ],
    "universal": false
  },
  {
    "id": "c8_q_wall",
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
        "id": "c8_back",
        "label": "Вернуться к своему месту",
        "minutes": 2,
        "terminal": true,
        "goto": "c8_q",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]}]},
        "effects": []
      },
      {
        "id": "c8_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку.",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]}]}
      },
      {"id": "c8_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c8_cp", "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"cp": 7}, {"after": 5580}]}]}]}},
      {"id": "c8_alarm", "label": "Уйти к служебной двери", "minutes": 0, "terminal": true, "goto": "c8_messe_exit", "when": {"flag": "w.c3_messe_outbreak"}}
    ],
    "universal": false
  },
  {
    "id": "c8_messe_yard",
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
        "when": {"all": [{"all": [{"v": "$.c7_gatepile.result", "op": "==", "value": "passage"}, {"all": []}]}, {"before": 5220}]},
        "text": "Через оставленный проход несут человека. Волонтёр держит сетку за тот же прут, что и ты."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_gatepile.result", "op": "==", "value": "edge"}, {"all": []}]}, {"before": 5220}]},
        "text": "У ограды тесно, но тебя не толкают в спину. Из дверей выходят новые люди; до тента ты теперь не дойдёшь прямо."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_gatepile.result", "op": "==", "value": "seat"}, {"all": []}]}, {"before": 5220}]},
        "text": "Поднятый человек сидит на твоём месте. Твой рюкзак он придерживает ногами, чтобы не затоптали."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_redtag.result", "op": "==", "value": "search"}, {"all": []}]}, {"before": 5220}]},
        "text": "Дежурный повторяет имя партнёра следующей смене. Ты слышишь его издалека и поднимаешь голову."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_redtag.result", "op": "==", "value": "honest"}, {"all": []}]}, {"before": 5220}]},
        "text": "Красный браслет оставили на руке. Зато тебе показали место, где медик будет искать тебя снова."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c7_redtag.result", "op": "==", "value": "stay"}, {"all": []}]}, {"before": 5220}]},
        "text": "У вещей спокойно. На перекличке приходится спрашивать всё заново: твоего имени в этой группе нет."
      },
      {
        "when": {"all": [{"v": "$.c8_headcount.result", "op": "==", "value": "facts"}, {"all": []}]},
        "text": "Дежурный вычеркнул одну ошибку. На соседнем имени остановился и попросил тебя повторить ещё раз."
      },
      {
        "when": {"all": [{"v": "$.c8_headcount.result", "op": "==", "value": "search"}, {"all": []}]},
        "text": "Имя партнёра произносят в рацию. Ты ждёшь ответа и слышишь только чужое дыхание."
      },
      {
        "when": {"all": [{"v": "$.c8_headcount.result", "op": "==", "value": "shelter"}, {"all": []}]},
        "text": "Твою фамилию отметили. На следующей перекличке зовут тех, кого никто не видел."
      },
      {
        "when": {"all": [{"v": "$.c8_thinblanket.result", "op": "==", "value": "half"}, {"all": []}]},
        "text": "Подстилки хватает обоим только сидя. Сосед старается дышать в другую сторону."
      },
      {
        "when": {"all": [{"v": "$.c8_thinblanket.result", "op": "==", "value": "boxes"}, {"all": []}]},
        "text": "Разобранные коробки раздают по одному листу. Волонтёр придержал для тебя кусок без мокрого угла."
      },
      {
        "when": {"all": [{"v": "$.c8_thinblanket.result", "op": "==", "value": "keep"}, {"all": []}]},
        "text": "Твоя подстилка целая. Рядом человек накрывает ноги пустым мешком из-под одеял."
      },
      {
        "when": {"flag": "$.c3_exit_helped"},
        "text": "Человек, которого ты вытащил{m:|а}, садится рядом. — Фамилия как? — спрашивает он. — Скажу, если искать будут."
      },
      {"when": {"flag": "$.c3_exit_left_bag"}, "text": "Рюкзак остался за закрытыми воротами. Солдат преграждает дорогу, когда ты поворачиваешься к ним."},
      {
        "when": {"v": "w.c3_trip7", "op": "==", "value": "escort"},
        "text": "Люди, которых вы взялись сопровождать, движутся медленно. Ты несёшь чужую сумку и останавливаешься всякий раз, когда они останавливаются. Твой сухой угол уже занят."
      }
    ],
    "actions": [
      {
        "id": "c8_last_food",
        "label": "Разделить полученный хлеб",
        "minutes": 25,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_last_food"}}, {"has": "canned_beans"}]},
        "text": "Соседу нечем открыть банку. Ты помогаешь, придерживая скользкий край. Хлеб кладёте на чистую сторону бумаги и едите, не поднимая глаз на двери.",
        "effects": [{"set": "$.c8_last_food", "value": true}, {"take": "canned_beans"}, {"body": "hunger", "delta": -25}]
      },
      {
        "id": "c8_pair_wait",
        "label": "Дождаться {partner.gen} у ограды",
        "minutes": 20,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_pair_wait"}}, {"flag": "w.together"}]},
        "text": "Ты остаёшься у столба, где договорились встретиться. {partner} подходит с пустыми руками. Вы стоите рядом, пока волонтёр не зовёт внутрь ограды.",
        "effects": [{"set": "$.c8_pair_wait", "value": true}, {"body": "stress", "delta": -7}]
      },
      {
        "id": "c8_give_coat",
        "label": "Накрыть сидящего своей курткой",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_give_coat"}}, {"hasTag": "outer"}]},
        "text": "Ты снимаешь куртку и кладёшь ему на плечи. Через ткань видно, как дрожь становится реже. Теперь холодно тебе.",
        "effects": [{"set": "$.c8_give_coat", "value": true}, {"takeTag": "outer"}, {"body": "fatigue", "delta": 7}]
      },
      {
        "id": "c8_write_address",
        "label": "Оставить адрес, куда сообщить",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_names"}}]},
        "text": "Дежурный просит продиктовать медленнее. Ты повторяешь и смотришь, как он пишет. Телефонного номера мало: связи может не быть.",
        "effects": [{"set": "$.c8_names", "value": true}, {"set": "$.c3_address_left", "value": true}]
      },
      {
        "id": "c8_join_names",
        "label": "Остаться рядом с потерявшей мужа",
        "minutes": 30,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_names"}}]},
        "text": "Она каждый раз встаёт на чужое похожее имя. Ты держишь её сумку, пока она идёт к воротам. Возвращается и просит пока не уходить.",
        "effects": [{"set": "$.c8_names", "value": true}, {"body": "stress", "delta": 6}]
      },
      {"id": "c8_yard_edge", "label": "Отойти к краю ограды", "minutes": 2, "terminal": true, "goto": "c8_yard_edge", "effects": []},
      {
        "id": "c8_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c8_headcount_approach", "label": "Подойти к воротам на перекличку", "minutes": 1, "terminal": true, "goto": "c8_headcount", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5245}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_headcount.done"}}]}},
      {"id": "c8_thinblanket_approach", "label": "Подойти к раздаче одеял", "minutes": 1, "terminal": true, "goto": "c8_thinblanket", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5465}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_thinblanket.done"}}]}},
      {"id": "c8_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c8_cp", "when": {"all": [{"cp": 7}, {"after": 5580}]}}
    ],
    "onEnter": [
      {"if": {"all": [{"v": "w.c3_trip7", "op": "==", "value": "escort"}, {"not": {"flag": "$.c8_promise_cost"}}]}, "then": [{"set": "$.c8_promise_cost", "value": true}, {"wait": 45, "activity": "moderate"}, {"body": "fatigue", "delta": 8}]}
    ]
  },
  {
    "id": "c8_yard_edge",
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
      {"id": "c8_back", "label": "Вернуться под тент", "minutes": 2, "terminal": true, "goto": "c8_messe_yard", "effects": []},
      {
        "id": "c8_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c8_headcount_approach", "label": "Подойти к воротам на перекличку", "minutes": 1, "terminal": true, "goto": "c8_headcount", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5245}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_headcount.done"}}]}},
      {"id": "c8_thinblanket_approach", "label": "Подойти к раздаче одеял", "minutes": 1, "terminal": true, "goto": "c8_thinblanket", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5465}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_thinblanket.done"}}]}},
      {"id": "c8_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c8_cp", "when": {"all": [{"cp": 7}, {"after": 5580}]}}
    ]
  },
  {
    "id": "c8_okafor",
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
      {"id": "c8_back", "label": "Вернуться на свою площадку", "minutes": 2, "terminal": true, "goto": "c8_landing_B", "effects": []},
      {
        "id": "c8_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c8_escort_approach", "label": "Ответить дежурному на площадке", "minutes": 1, "terminal": true, "goto": "c8_escort", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5230}, {"before": 5640}, {"all": [{"npcVar": "okafor", "key": "bitten"}, {"flag": "w.c3_okafor_reported"}]}, {"not": {"flag": "$.c8_escort.done"}}]}},
      {"id": "c8_lightless_approach", "label": "Остановиться у потемневшего окна", "minutes": 1, "terminal": true, "goto": "c8_lightless", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5415}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_lightless.done"}}]}},
      {"id": "c8_medbag_approach", "label": "Подойти к сумке у соседней двери", "minutes": 1, "terminal": true, "goto": "c8_medbag", "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5230}, {"before": 5640}, {"not": {"flag": "$.c8_medbag.done"}}, {"not": {"all": [{"npcVar": "okafor", "key": "bitten"}, {"flag": "w.c3_okafor_reported"}]}}]}},
      {"id": "c8_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c8_cp", "when": {"all": [{"cp": 7}, {"after": 5580}]}}
    ]
  },
  {
    "id": "c8_messe_exit",
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
        "id": "c8_exit_known",
        "label": "Держаться знакомого прохода вдоль стены",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_messe_yard",
        "when": {"flag": "$.messe_exit"},
        "text": "Ты идёшь вдоль стены, не пытаясь обогнать тех, кто впереди. Зелёная табличка, коробки, ручка. За дверью холодно. Ты выходишь и только тогда вспоминаешь вдохнуть.",
        "effects": [{"move": "c3_messe_yard"}, {"body": "stress", "delta": 15}, {"learn": "f_c3_messe_closed"}]
      },
      {
        "id": "c8_exit_staff",
        "label": "Идти за волонтёром к служебной двери",
        "minutes": 25,
        "terminal": true,
        "goto": "c8_messe_yard",
        "text": "Волонтёр поднимает свёрнутый жилет над головой. Ты держишь его в поле зрения. В узком месте сумку прижимает к чужой спине, потом вдруг отпускает. За дверью ты долго не можешь выпрямить пальцы.",
        "effects": [{"move": "c3_messe_yard"}, {"body": "stress", "delta": 24}, {"body": "fatigue", "delta": 8}, {"learn": "f_c3_messe_closed"}]
      },
      {
        "id": "c8_exit_lift",
        "label": "Вытащить упавшего из прохода",
        "minutes": 8,
        "terminal": true,
        "risky": true,
        "goto": "c8_messe_yard",
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
        "id": "c8_exit_drop",
        "label": "Бросить рюкзак и протиснуться первым",
        "minutes": 3,
        "terminal": true,
        "goto": "c8_messe_yard",
        "text": "Ты выпускаешь лямку. Чужие ноги сразу закрывают рюкзак, и уже не видно, какой из них твой. Снаружи руки свободны. Ты не знаешь, что ими делать.",
        "effects": [{"move": "c3_messe_yard"}, {"drop": "backpack"}, {"set": "$.c3_exit_left_bag", "value": true}, {"body": "stress", "delta": 18}, {"learn": "f_c3_messe_closed"}]
      }
    ]
  },
  {
    "id": "c8_neighbor",
    "for": "any",
    "chapter": "ch3",
    "location": "c3_neighbor",
    "title": "Соседний двор",
    "safe": false,
    "text": [
      {"when": {"before": 4680}, "text": "На тележке соседа висит пустой мешок. Ветер выворачивает его, как рукав. За воротами слышно дыхание собаки."},
      {
        "when": {"all": [{"all": [{"after": 4680}, {"before": 5340}]}, {"before": 5040}]},
        "text": "У ворот стоит машина с грязным передним колесом. На земле две мокрые доски. Хозяин не выходит, пока ты не зовёшь второй раз."
      },
      {
        "when": {"all": [{"after": 5040}, {"before": 5340}]},
        "text": "У соседской стены снято колесо. Рядом две доски, одна треснула поперёк. От дороги слышны голоса."
      },
      {"when": {"after": 5340}, "text": "Сосед закрывает гараж на внутренний крюк. Ворота во двор ещё открыты для разговора. На светлой полосе лежит твой мешок."}
    ],
    "actions": [
      {
        "id": "c8_neighbor_greet",
        "label": "Назвать себя у ворот",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_neighbor_greet"}}]},
        "text": "Хозяин вспоминает раньше твоего последнего слова. Смотрит на мешок, потом на сапоги. До калитки всё-таки подходит.",
        "effects": [{"set": "$.c8_neighbor_greet", "value": true}]
      },
      {
        "id": "c8_neighbor_road",
        "label": "Спросить про машину в колее",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_neighbor_road"}}]},
        "text": "Он показывает на грязное колесо. — Вышла, — говорит. По доскам видны следы, кто помогал толкать.",
        "effects": [{"set": "$.c8_neighbor_road", "value": true}]
      },
      {
        "id": "c8_neighbor_parts",
        "label": "Попросить показать крепёж",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_neighbor_parts"}}]},
        "text": "Он выносит железо в старой кастрюле. Две скобы ещё с краской, остальные рыжие. Выбирать разрешает глазами, не руками.",
        "effects": [{"set": "$.c8_neighbor_parts", "value": true}]
      },
      {
        "id": "c8_neighbor_measure",
        "label": "Проверить размер до обмена",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_neighbor_measure"}}]},
        "text": "Ты прикладываешь картон к одной скобе. Расстояние не совпадает. Сосед меняет её на другую, не споря.",
        "effects": [{"set": "$.c8_neighbor_measure", "value": true}]
      },
      {
        "id": "c8_neighbor_trade",
        "label": "Обменять принесённую картошку",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_neighbor_trade"}}]},
        "text": "Сосед берёт мешок за дно. Шланг с хомутами выкладывает с другой стороны ворот. Ты проверяешь резину до того, как убираешь в рюкзак.",
        "effects": [{"set": "$.c8_neighbor_trade", "value": true}, {"take": "potatoes", "qty": 5}, {"give": "c3_hose"}],
        "enabled": {"has": "potatoes", "qty": 5},
        "disabledReason": "Картошка осталась у того, кто её несёт"
      },
      {
        "id": "c8_neighbor_wire",
        "label": "Попросить обрезок проволоки",
        "minutes": 6,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_neighbor_wire"}}]},
        "text": "Он отрезает короткий кусок от бухты. Концы загибает сам. На твою ладонь кладёт только после этого.",
        "effects": [{"set": "$.c8_neighbor_wire", "value": true}]
      },
      {
        "id": "c8_neighbor_news",
        "label": "Спросить, видели ли чужих у дороги",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_neighbor_news"}}]},
        "text": "Он называет только машины, которые видел сам. Про грузовик слышал от других, так и говорит. На дорогу ни разу не оборачивается.",
        "effects": [{"set": "$.c8_neighbor_news", "value": true}]
      },
      {
        "id": "c8_neighbor_return",
        "label": "Договориться вернуть одолженное",
        "minutes": 8,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c8_neighbor_return"}}]},
        "text": "Ты называешь доски и день. Сосед поднимает ладонь, словно останавливает торг. — Целыми, — говорит вместо срока.",
        "effects": [{"set": "$.c8_neighbor_return", "value": true}]
      },
      {
        "id": "c8_neighbor_back",
        "label": "Вернуться к хутору",
        "minutes": 18,
        "terminal": true,
        "goto": "c8_farm",
        "effects": [{"move": "hof_luedemann"}],
        "when": {"always": true}
      },
      {
        "id": "c8_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку.",
        "when": {"always": true}
      },
      {"id": "c8_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c8_cp", "when": {"all": [{"cp": 7}, {"after": 5580}]}}
    ]
  },
  {
    "id": "c8_neighborroad",
    "for": "any",
    "chapter": "ch3",
    "title": "Подойти к соседу за калиткой",
    "universal": false,
    "text": [
      {"text": "Сосед из двора у дороги приходит пешком. На сапогах мокрая глина. Он показывает на колею и требует позвать Оле."},
      {"text": "Машина просела передним колесом там, где ночью стекала вода. Он показывает налипшую глину на клине."},
      {
        "when": {"v": "w.c7_trough.result", "op": "==", "value": "road"},
        "text": "— Вчера к вам ходил, сегодня у вас вода моя дорога! — Он показывает на прорезанный сток. Колея чёрная до самого поворота."
      }
    ],
    "onEnter": [{"set": "$.c8_neighborroad.started", "value": true}],
    "actions": [
      {
        "id": "c8_neighborroad_help",
        "label": "Помочь вытащить вместе с Оле",
        "minutes": 30,
        "terminal": true,
        "goto": "c8_farm",
        "text": "Вы укладываете доски под колесо. Сосед трогается на малом газу, не бросая сцепление. Машина выходит из колеи и останавливается сразу за вами.",
        "effects": [
          {"set": "$.c8_neighborroad.done", "value": true},
          {"set": "$.c8_neighborroad.result", "value": "help"},
          {"body": "fatigue", "delta": 9},
          {"npc": "ole", "trust": 5},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c8_neighborroad_boards",
        "label": "Передать доски и остаться",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_farm",
        "text": "Сосед забирает доски через сетку. Несёт обе под одной рукой, клин держит зубами. На прощание уже не кричит.",
        "effects": [
          {"set": "$.c8_neighborroad.done", "value": true},
          {"set": "$.c8_neighborroad.result", "value": "boards"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []},
          {"body": "stress", "delta": 3}
        ]
      },
      {
        "id": "c8_neighborroad_no",
        "label": "Оставить помощь на утро",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_farm",
        "text": "Сосед опускает клин. — Утром там ещё глубже, — говорит он и уходит. Оле остаётся у забора, глядя на твои сапоги.",
        "effects": [
          {"set": "$.c8_neighborroad.done", "value": true},
          {"set": "$.c8_neighborroad.result", "value": "no"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []},
          {"npc": "ole", "trust": -3}
        ]
      }
    ],
    "location": "hof_luedemann"
  },
  {
    "id": "c8_lampmeal",
    "for": "any",
    "chapter": "ch3",
    "title": "Остановиться у кухонного стола",
    "universal": false,
    "text": [
      {"text": "За столом оставлено лишнее место. Хенрике держит пустую миску, Оле не даёт поставить её рядом со своей. Павел стоит у печки."},
      {"text": "— Пока ест с нами, — говорит Хенрике. Оле смотрит не на неё, а на полку с хлебом."},
      {"when": {"flag": "w.c3_guest_contract"}, "text": "Кёлер стоит с миской за спиной Хенрике. Оле кивает на неё: — Обещали. Чем кормить будете?"}
    ],
    "onEnter": [{"set": "$.c8_lampmeal.started", "value": true}],
    "actions": [
      {
        "id": "c8_lampmeal_portion",
        "label": "Отдать часть своей порции",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_farm",
        "text": "Ты отодвигаешь половину картошки к пустой миске. Оле смотрит на тарелку и наконец садится. Хенрике ставит миску рядом с его рукой.",
        "effects": [
          {"set": "$.c8_lampmeal.done", "value": true},
          {"set": "$.c8_lampmeal.result", "value": "portion"},
          {"body": "hunger", "delta": 12},
          {"npc": "henrike", "trust": 5},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c8_lampmeal_work",
        "label": "Предложить завтра заменить чужое дежурство",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_farm",
        "text": "Хенрике смотрит тебе в лицо, потом кивает. Оле убирает локоть с пустого места. Завтра спать на три часа меньше.",
        "effects": [{"set": "$.c8_lampmeal.done", "value": true}, {"set": "$.c8_lampmeal.result", "value": "work"}, {"npc": "henrike", "trust": 4}, {"body": "stress", "delta": 3}]
      },
      {
        "id": "c8_lampmeal_rule",
        "label": "Оставить решение хозяйке",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_farm",
        "text": "Ты подвигаешь ей свободную миску. Хенрике накладывает сама, не меняя лица. Оле ест, не поднимая глаз.",
        "effects": [{"set": "$.c8_lampmeal.done", "value": true}, {"set": "$.c8_lampmeal.result", "value": "rule"}, {"npc": "henrike", "trust": 2}]
      }
    ],
    "location": "hof_luedemann"
  },
  {
    "id": "c8_keys",
    "for": "any",
    "chapter": "ch3",
    "title": "Подойти к ключу в замке",
    "universal": false,
    "text": [
      {"text": "Снаружи крутят ключ, но дверь не открывается. Хенрике просит не тянуть ручку. Засов упирается в разбухшее дерево."},
      {"text": "Ключ поворачивается до половины. Хенрике держит его через край фартука, чтобы не сломать."}
    ],
    "onEnter": [{"set": "$.c8_keys.started", "value": true}],
    "actions": [
      {
        "id": "c8_keys_lift",
        "label": "Приподнять дверь вместе снаружи",
        "minutes": 20,
        "terminal": true,
        "goto": "c8_coop",
        "text": "Ты берёшься под ручку через ткань. Снаружи Дениз подсовывает плоский край железа. Дверь поднимается и впервые открывается без скрежета.",
        "effects": [
          {"set": "$.c8_keys.done", "value": true},
          {"set": "$.c8_keys.result", "value": "lift"},
          {"body": "fatigue", "delta": 6},
          {"npc": "deniz", "trust": 4},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c8_keys_plane",
        "label": "Дать срезать разбухший край",
        "minutes": 25,
        "terminal": true,
        "goto": "c8_coop",
        "text": "Ты держишь дверь, не помогая давить. Стружка сыплется к твоим ботинкам. Хенрике не уходит, пока засов не начинает двигаться ровно.",
        "effects": [
          {"set": "$.c8_keys.done", "value": true},
          {"set": "$.c8_keys.result", "value": "plane"},
          {"body": "fatigue", "delta": 4},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c8_keys_wait",
        "label": "Подождать с вещами на нарах",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_coop",
        "text": "Ты садишься повыше, чтобы не мешать. Снаружи работают вдвоём. Металл то скрипит, то стихает; ключ наконец выходит целым.",
        "effects": [{"set": "$.c8_keys.done", "value": true}, {"set": "$.c8_keys.result", "value": "wait"}, {"body": "stress", "delta": 6}]
      }
    ],
    "location": "farm_coop"
  },
  {
    "id": "c8_supperdoor",
    "for": "any",
    "chapter": "ch3",
    "title": "Ответить на стук миски",
    "universal": false,
    "text": [
      {"text": "Оле ставит миску у двери слишком далеко от щели. Просит подождать, пока принесёт ещё воды. Шаги уже уходят к колодцу."},
      {"text": "— Не дотянешься? — спрашивает Оле. Смотрит на расстояние и переставляет миску ближе сапогом."}
    ],
    "onEnter": [{"set": "$.c8_supperdoor.started", "value": true}],
    "actions": [
      {
        "id": "c8_supperdoor_thanks",
        "label": "Поблагодарить и не продолжать спор",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_coop",
        "text": "Оле подаёт миску в руки. Пальцы его далеко от твоих. За водой возвращается молча, но приносит полную бутылку.",
        "effects": [{"set": "$.c8_supperdoor.done", "value": true}, {"set": "$.c8_supperdoor.result", "value": "thanks"}, {"npc": "ole", "trust": 5}, {"body": "stress", "delta": -4}]
      },
      {
        "id": "c8_supperdoor_ask",
        "label": "Попросить позвать Хенрике",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_coop",
        "text": "Он ставит миску на порог и выпрямляется. Хенрике приходит сама, открывает шире и спрашивает, что случилось. Оле остаётся у колодца.",
        "effects": [{"set": "$.c8_supperdoor.done", "value": true}, {"set": "$.c8_supperdoor.result", "value": "ask"}, {"npc": "ole", "trust": -4}]
      },
      {
        "id": "c8_supperdoor_share",
        "label": "Предложить ему часть ужина",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_coop",
        "text": "Ты показываешь на свободный край миски. Оле качает головой, но садится на перевёрнутое ведро снаружи. Пока ты ешь, он не уходит.",
        "effects": [{"set": "$.c8_supperdoor.done", "value": true}, {"set": "$.c8_supperdoor.result", "value": "share"}, {"body": "hunger", "delta": 6}, {"npc": "ole", "trust": 7}]
      }
    ],
    "location": "farm_coop"
  },
  {
    "id": "c8_notebag",
    "for": "any",
    "chapter": "ch3",
    "title": "Проверить пакет под дверью",
    "universal": false,
    "text": [
      {
        "when": {"any": [{"flag": "$.c3_neighbor_helped"}, {"flag": "$.c3_water_shared"}, {"flag": "$.c3_third_floor_water"}]},
        "text": "Под дверью шуршит бумажный пакет. Сосед снизу говорит «взамен» и уходит. В пакете что-то перекатывается."
      },
      {"text": "Он отвечает, что это свечи. Старые, из шкафа, зато сухие. Снова подниматься не хочет."},
      {
        "when": {"not": {"any": [{"flag": "$.c3_neighbor_helped"}, {"flag": "$.c3_water_shared"}, {"flag": "$.c3_third_floor_water"}]}},
        "text": "Сосед держит пакет при себе. — Две свечи. За еду, — говорит он. — Можете закрытую пачку? — Он не протягивает пакет, пока ты не ответишь."
      }
    ],
    "onEnter": [{"set": "$.c8_notebag.started", "value": true}],
    "actions": [
      {
        "id": "c8_notebag_take",
        "label": "Принять и поблагодарить через дверь",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_aflat",
        "text": "Ты принимаешь пакет после разговора. Свечи завёрнуты отдельно от яблока. Сосед ещё раз благодарит и спускается, придерживаясь за стену.",
        "effects": [
          {"set": "$.c8_notebag.done", "value": true},
          {"set": "$.c8_notebag.result", "value": "take"},
          {"give": "candles", "qty": 2},
          {"give": "apple"},
          {"if": {"not": {"any": [{"flag": "$.c3_neighbor_helped"}, {"flag": "$.c3_water_shared"}, {"flag": "$.c3_third_floor_water"}]}}, "then": [{"take": "oats"}]}
        ],
        "enabled": {"any": [{"any": [{"flag": "$.c3_neighbor_helped"}, {"flag": "$.c3_water_shared"}, {"flag": "$.c3_third_floor_water"}]}, {"has": "oats"}]},
        "disabledReason": "Сосед просит закрытую пачку еды"
      },
      {
        "id": "c8_notebag_return",
        "label": "Вернуть яблоко, оставить свечи",
        "minutes": 15,
        "terminal": true,
        "goto": "c8_aflat",
        "text": "Ты принимаешь пакет после разговора. Свечи завёрнуты отдельно от яблока. Сосед ещё раз благодарит и спускается, придерживаясь за стену.",
        "effects": [
          {"set": "$.c8_notebag.done", "value": true},
          {"set": "$.c8_notebag.result", "value": "return"},
          {"give": "candles", "qty": 2},
          {"body": "stress", "delta": -2},
          {"if": {"not": {"any": [{"flag": "$.c3_neighbor_helped"}, {"flag": "$.c3_water_shared"}, {"flag": "$.c3_third_floor_water"}]}}, "then": [{"take": "oats"}]}
        ],
        "enabled": {"any": [{"any": [{"flag": "$.c3_neighbor_helped"}, {"flag": "$.c3_water_shared"}, {"flag": "$.c3_third_floor_water"}]}, {"has": "oats"}]},
        "disabledReason": "Сосед просит закрытую пачку еды"
      },
      {
        "id": "c8_notebag_later",
        "label": "Оставить пакет закрытым до разговора",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_aflat",
        "text": "Ты ставишь пакет у стены, отдельно от еды. Когда шуршит бумага, сначала вздрагиваешь. Это яблоко откатывается к краю.",
        "effects": [{"set": "$.c8_notebag.done", "value": true}, {"set": "$.c8_notebag.result", "value": "later"}]
      }
    ],
    "location": "a_flat"
  },
  {
    "id": "c8_stairsnight",
    "for": "any",
    "chapter": "ch3",
    "title": "Проверить, почему открыта дверь внизу",
    "universal": false,
    "text": [{"text": "Входная дверь бьёт о косяк от ветра. С лестницы выдувает тёплый воздух. Внизу за дверью стоит тень и не входит."}],
    "onEnter": [{"set": "$.c8_stairsnight.started", "value": true}],
    "actions": [
      {
        "id": "c8_stairsnight_quiet",
        "label": "Ждать, пока тень уйдёт от двери",
        "minutes": 25,
        "terminal": true,
        "goto": "c8_aflat",
        "text": "Ты сидишь на верхней ступеньке без света. Далеко хлопает железо, и тень поворачивается туда. Сосед внизу наконец захлопывает вход.",
        "effects": [
          {"set": "$.c8_stairsnight.done", "value": true},
          {"set": "$.c8_stairsnight.result", "value": "quiet"},
          {"body": "stress", "delta": 11},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c8_stairsnight_together",
        "label": "Помочь соседу закрыть изнутри",
        "minutes": 20,
        "terminal": true,
        "goto": "c8_aflat",
        "effects": [
          {"set": "$.c8_stairsnight.done", "value": true},
          {"set": "$.c8_stairsnight.result", "value": "together"},
          {"body": "fatigue", "delta": 6},
          {"body": "stress", "delta": 8},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ],
        "risky": true,
        "outcomes": [
          {
            "id": "careful",
            "check": {"traits": ["agility", "technical"], "difficulty": 4, "uses": ["mobility", "focus"]},
            "text": "Ты держишь верхний край швабры, сосед толкает ею дверь снизу. Створка проходит мимо тени и встаёт на защёлку. Вы не выглядываете проверить."
          },
          {
            "id": "hurt",
            "text": "Снаружи толкают дверь раньше, чем вы успеваете закрыть. Край защемляет твою кисть. Сосед давит плечом до щелчка, не заметив её.",
            "effects": [{"injure": "bruise", "site": "hands", "severity": 2, "bleeding": 0}, {"body": "stress", "delta": 12}]
          }
        ]
      },
      {
        "id": "c8_stairsnight_flat",
        "label": "Остаться за своей дверью",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_aflat",
        "text": "Ты запираешь квартиру и убираешь свет из щелей. Внизу дверь ещё несколько раз бьёт о косяк. Ты держишь руку на внутренней ручке.",
        "effects": [{"set": "$.c8_stairsnight.done", "value": true}, {"set": "$.c8_stairsnight.result", "value": "flat"}, {"body": "stress", "delta": 12}]
      }
    ],
    "location": "a_flat"
  },
  {
    "id": "c8_escort",
    "for": "any",
    "chapter": "ch3",
    "title": "Ответить дежурному на площадке",
    "universal": false,
    "text": [
      {
        "text": "На площадку поднимаются двое в масках. Старший спрашивает про дверь напротив и просит всем остаться в квартирах. Стул перед порогом сдвигают к стене."
      },
      {"text": "Он называет номер дома, не твоё имя. Информацию передали от патруля у входа."}
    ],
    "onEnter": [{"set": "$.c8_escort.started", "value": true}],
    "actions": [
      {
        "id": "c8_escort_ask",
        "label": "Рассказать про последние звуки",
        "minutes": 8,
        "combinable": true,
        "when": {"not": {"flag": "$.c8_escort.asked"}},
        "text": "Ты называешь время и отсутствие ответа. Старший просит отделить увиденное от того, что тебе кажется. — Закрыть. До нашего стука не открывать. — Старший ждёт, пока твоя дверь действительно закроется.",
        "effects": [{"set": "$.c8_escort.asked", "value": true}]
      },
      {
        "id": "c8_escort_facts",
        "label": "Передать всё известное и закрыться",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_bflat",
        "text": "Ты повторяешь про воду и просьбу не входить. Старший кивает. Цепочку снимаешь только затем, чтобы закрыть замок полностью.",
        "effects": [{"set": "$.c8_escort.done", "value": true}, {"set": "$.c8_escort.result", "value": "facts"}, {"body": "stress", "delta": 8}]
      },
      {
        "id": "c8_escort_name",
        "label": "Попросить назвать его по имени",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_bflat",
        "text": "Ты говоришь, что он медбрат и всегда отвечает на имя. Старший записывает имя на перчатке. За закрытой дверью ты слышишь, как его произносят.",
        "effects": [{"set": "$.c8_escort.done", "value": true}, {"set": "$.c8_escort.result", "value": "name"}, {"body": "stress", "delta": 10}]
      },
      {
        "id": "c8_escort_leave",
        "label": "Убрать вещи от общей стены",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_bflat",
        "text": "Ты уходишь в дальнюю комнату с рюкзаком. Садишься так, чтобы видеть свою дверь. Дальние голоса становятся глухими, потом стихает и скрежет.",
        "effects": [{"set": "$.c8_escort.done", "value": true}, {"set": "$.c8_escort.result", "value": "leave"}, {"body": "fatigue", "delta": 4}]
      }
    ],
    "location": "b_flat"
  },
  {
    "id": "c8_lightless",
    "for": "any",
    "chapter": "ch3",
    "title": "Остановиться у потемневшего окна",
    "universal": false,
    "text": [
      {"text": "В доме напротив разом гаснут окна. В вашей квартире свет пока есть, но из розетки доносится сухой щелчок. На кухне пахнет нагретой пылью."},
      {"text": "Одна вилка нагрета сильнее остальных. Пластик целый, возле провода темнее."}
    ],
    "onEnter": [{"set": "$.c8_lightless.started", "value": true}],
    "actions": [
      {
        "id": "c8_lightless_unplug",
        "label": "Оставить удлинитель отключённым",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_bflat",
        "text": "Ты убираешь вилку на сухой подоконник. Больше в неё ничего не подключаешь. Тёплый запах понемногу исчезает.",
        "effects": [
          {"set": "$.c8_lightless.done", "value": true},
          {"set": "$.c8_lightless.result", "value": "unplug"},
          {"if": {"any": [{"me": "B"}, {"not": {"flag": "w.together"}}]}, "then": []},
          {"body": "stress", "delta": 3}
        ]
      },
      {
        "id": "c8_lightless_neighbor",
        "label": "Предупредить соседей о розетке",
        "minutes": 20,
        "terminal": true,
        "goto": "c8_bflat",
        "text": "Ты говоришь через закрытые двери. За одной тут же вынимают вилку, за другой отвечают «спасибо». В щиток ты не лезешь.",
        "effects": [{"set": "$.c8_lightless.done", "value": true}, {"set": "$.c8_lightless.result", "value": "neighbor"}, {"body": "fatigue", "delta": 3}]
      },
      {
        "id": "c8_lightless_pack",
        "label": "Убрать телефон и подготовить вещи",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_bflat",
        "text": "Телефон уходит в сухой карман. Документы и вода лежат сверху. Горячая вилка остывает отдельно от вещей.",
        "effects": [{"set": "$.c8_lightless.done", "value": true}, {"set": "$.c8_lightless.result", "value": "pack"}, {"body": "stress", "delta": 4}]
      }
    ],
    "location": "b_flat"
  },
  {
    "id": "c8_toolsback",
    "for": "any",
    "chapter": "ch3",
    "title": "Ответить человеку с инструментом",
    "universal": false,
    "text": [
      {"text": "К воротам возвращают насос. Рядом ставят чужую сумку с ключами и просят сохранить для Дениза. Человек уже отходит к дороге."},
      {"text": "Набор головок и длинный вороток. Он открывает молнию сам, чтобы ты не {m:искал|искала} на ощупь."}
    ],
    "onEnter": [{"set": "$.c8_toolsback.started", "value": true}],
    "actions": [
      {
        "id": "c8_toolsback_keep",
        "label": "Принять на хранение",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_workshop",
        "text": "Ты ставишь сумку у внутренней стены. Квитанцию кладёшь в наружный карман. Человек уходит с более прямой спиной.",
        "effects": [
          {"set": "$.c8_toolsback.done", "value": true},
          {"set": "$.c8_toolsback.result", "value": "keep"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []},
          {"body": "stress", "delta": 4}
        ]
      },
      {
        "id": "c8_toolsback_exchange",
        "label": "Попросить оставить один ключ за хранение",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_workshop",
        "text": "Он выбирает старый ключ из бокового кармана. Кладёт отдельно, чтобы не спутать с набором. Остальное убираешь с его согласия.",
        "effects": [
          {"set": "$.c8_toolsback.done", "value": true},
          {"set": "$.c8_toolsback.result", "value": "exchange"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c8_toolsback_refuse",
        "label": "Отказаться от чужой ответственности",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_workshop",
        "text": "Он закрывает молнию и поднимает сумку двумя руками. Долго примеряет ремень на плечо. Насос всё равно оставляет.",
        "effects": [{"set": "$.c8_toolsback.done", "value": true}, {"set": "$.c8_toolsback.result", "value": "refuse"}, {"body": "stress", "delta": 3}]
      }
    ],
    "location": "deniz_workshop"
  },
  {
    "id": "c8_trailer",
    "for": "any",
    "chapter": "ch3",
    "title": "Проверить стук у ворот",
    "universal": false,
    "text": [
      {"text": "К воротам подкатывают пустой прицеп. Двое просят поставить его во дворе на ночь. За ними стоит ещё одна машина с выключенными фарами."},
      {"text": "Один показывает номер на раме. Документы обещает потом, когда достанет из машины."}
    ],
    "onEnter": [{"set": "$.c8_trailer.started", "value": true}],
    "actions": [
      {
        "id": "c8_trailer_ask",
        "label": "Попросить документы сначала",
        "minutes": 8,
        "combinable": true,
        "when": {"not": {"flag": "$.c8_trailer.asked"}},
        "text": "Он идёт к машине, второй остаётся у ворот. Смотрит внутрь через щель, будто уже выбирает место. Она ещё не заглушена. Из выхлопной трубы идёт пар, хотя фары не горят.",
        "effects": [{"set": "$.c8_trailer.asked", "value": true}]
      },
      {
        "id": "c8_trailer_outside",
        "label": "Разрешить только снаружи, не перекрывая выход",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_workshop",
        "text": "Ты показываешь место вдоль глухой стены. Они откатывают прицеп туда. Задняя дверь остаётся свободной.",
        "effects": [
          {"set": "$.c8_trailer.done", "value": true},
          {"set": "$.c8_trailer.result", "value": "outside"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []},
          {"body": "stress", "delta": 5}
        ]
      },
      {
        "id": "c8_trailer_no",
        "label": "Отказать и не открывать",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_workshop",
        "text": "Они переглядываются и тянут прицеп обратно. Машина включает фары только на повороте. Свет проходит по твоим воротам и уходит.",
        "effects": [
          {"set": "$.c8_trailer.done", "value": true},
          {"set": "$.c8_trailer.result", "value": "no"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []},
          {"body": "stress", "delta": 8}
        ]
      },
      {
        "id": "c8_trailer_papers",
        "label": "Дождаться документов у закрытых ворот",
        "minutes": 20,
        "terminal": true,
        "goto": "c8_workshop",
        "text": "Документы всё-таки приносят. Номер совпадает, имя для тебя чужое. Ты разрешаешь оставить прицеп у стены, снаружи двора.",
        "effects": [
          {"set": "$.c8_trailer.done", "value": true},
          {"set": "$.c8_trailer.result", "value": "papers"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []},
          {"body": "fatigue", "delta": 3}
        ]
      }
    ],
    "location": "deniz_workshop"
  },
  {
    "id": "c8_radio",
    "for": "any",
    "chapter": "ch3",
    "title": "Подойти к Уве у радио",
    "universal": false,
    "text": [
      {"text": "Уве прибавляет громкость на слове «Messe». Биргит останавливается с тарелками в руках. Ведущий просит больше не ехать к выставочным залам."},
      {"text": "Уве не называет имён. Мерле убирает телефон экраном вниз и садится ближе к приёмнику."}
    ],
    "onEnter": [{"set": "$.c8_radio.started", "value": true}],
    "actions": [
      {
        "id": "c8_radio_ask",
        "label": "Проверить время передачи",
        "minutes": 8,
        "combinable": true,
        "when": {"not": {"flag": "$.c8_radio.asked"}},
        "text": "Между повторами меняется прогноз погоды. Значит, это не та же запись, что утром. Матрас ещё под лестницей. Если вынести его в гараж, проход к котлу станет уже.",
        "effects": [{"set": "$.c8_radio.asked", "value": true}]
      },
      {
        "id": "c8_radio_garage",
        "label": "Подготовить отдельное место в гараже",
        "minutes": 25,
        "terminal": true,
        "goto": "c8_ahr",
        "text": "Ты сдвигаешь коробки и стелешь сухое под матрас. Уве проверяет, что выхлопа в гараже нет. Ключ от внутренней двери оставляет у себя.",
        "effects": [
          {"set": "$.c8_radio.done", "value": true},
          {"set": "$.c8_radio.result", "value": "garage"},
          {"body": "fatigue", "delta": 6},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c8_radio_phone",
        "label": "Проверить сообщения вместе с Мерле",
        "minutes": 20,
        "terminal": true,
        "goto": "c8_ahr",
        "text": "Сеть появляется короткой полоской. Мерле отправляет одно сообщение и убирает телефон. Второго раза не тратит заряд.",
        "effects": [
          {"set": "$.c8_radio.done", "value": true},
          {"set": "$.c8_radio.result", "value": "phone"},
          {"npc": "merle", "trust": 4},
          {"charge": "phone", "delta": -2},
          {"learn": "f_c3_messe_closed"}
        ]
      },
      {
        "id": "c8_radio_home",
        "label": "Предложить никого не везти сегодня",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_ahr",
        "text": "Уве отходит от ключей. Биргит ставит тарелки на стол. Радио остаётся включённым, хотя все уже слышали сводку.",
        "effects": [
          {"set": "$.c8_radio.done", "value": true},
          {"set": "$.c8_radio.result", "value": "home"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []},
          {"npc": "uwe", "trust": -2}
        ]
      }
    ],
    "location": "ahrensburg"
  },
  {
    "id": "c8_gatebasket",
    "for": "any",
    "chapter": "ch3",
    "title": "Ответить у садовой калитки",
    "universal": false,
    "text": [
      {"text": "За калиткой соседка с пустой корзиной. Просит вернуть кастрюлю, которую вчера принесла Биргит. Внутрь не заходит."},
      {"text": "Кастрюлю хотят вернуть чистой. Соседка держит её внутри корзины, прикрыв полотенцем."}
    ],
    "onEnter": [{"set": "$.c8_gatebasket.started", "value": true}],
    "actions": [
      {
        "id": "c8_gatebasket_take",
        "label": "Принять и помочь донести",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_ahr",
        "text": "Ты несёшь кастрюлю за обе ручки. Биргит забирает маленький пакет здоровой рукой. Соседка уходит только когда калитка закрыта.",
        "effects": [
          {"set": "$.c8_gatebasket.done", "value": true},
          {"set": "$.c8_gatebasket.result", "value": "take"},
          {"npc": "birgit", "trust": 4},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c8_gatebasket_return",
        "label": "Оставить муку соседке",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_ahr",
        "text": "Биргит берёт только свою кастрюлю. Пакет остаётся в корзине. Соседка не сразу поднимает её обратно.",
        "effects": [
          {"set": "$.c8_gatebasket.done", "value": true},
          {"set": "$.c8_gatebasket.result", "value": "return"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []},
          {"body": "stress", "delta": 3}
        ]
      },
      {
        "id": "c8_gatebasket_door",
        "label": "Договориться о стуке на случай беды",
        "minutes": 20,
        "terminal": true,
        "goto": "c8_ahr",
        "text": "Уве выходит к калитке. Они выбирают простой стук и повторяют его по дереву. Звук слышно из кухни, даже с закрытым окном.",
        "effects": [
          {"set": "$.c8_gatebasket.done", "value": true},
          {"set": "$.c8_gatebasket.result", "value": "door"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []},
          {"npc": "uwe", "trust": 4}
        ]
      }
    ],
    "location": "ahrensburg"
  },
  {
    "id": "c8_names",
    "for": "any",
    "chapter": "ch3",
    "title": "Посмотреть на лист у выхода",
    "universal": false,
    "text": [
      {"text": "У выхода снимают лист с именами. Женщина держит край и не даёт оторвать. На листе имя её мужа, которого в зале нет."},
      {"text": "Нужен новый лист, старый размок у окна. Выбрасывать его никто не собирался."}
    ],
    "onEnter": [{"set": "$.c8_names.started", "value": true}],
    "actions": [
      {
        "id": "c8_names_copy",
        "label": "Помочь перенести имена, сохранив старый лист",
        "minutes": 25,
        "terminal": true,
        "goto": "c8_north",
        "text": "Ты читаешь по одной строке, дежурная переписывает. Женщина держит старый лист перед собой. Не отпускает до последней буквы.",
        "effects": [{"set": "$.c8_names.done", "value": true}, {"set": "$.c8_names.result", "value": "copy"}, {"body": "fatigue", "delta": 4}]
      },
      {
        "id": "c8_names_cover",
        "label": "Закрыть старый лист прозрачным пакетом",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_north",
        "text": "Ты придерживаешь бумагу за сухой край. Пакет натягивается поверх надрыва. Имя мужа снова видно от входа.",
        "effects": [{"set": "$.c8_names.done", "value": true}, {"set": "$.c8_names.result", "value": "cover"}, {"body": "stress", "delta": -3}]
      },
      {
        "id": "c8_names_desk",
        "label": "Отвести женщину к Хинрихсен",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_north",
        "text": "Хинрихсен освобождает край стола для старого листа. Женщина садится рядом, всё ещё держа бумагу. Дежурная идёт за новым скотчем.",
        "effects": [{"set": "$.c8_names.done", "value": true}, {"set": "$.c8_names.result", "value": "desk"}]
      }
    ],
    "location": "north_gym"
  },
  {
    "id": "c8_firewatch",
    "for": "any",
    "chapter": "ch3",
    "title": "Подойти к спорящим дежурным",
    "universal": false,
    "text": [
      {"text": "У боковой двери спорят из-за смены. Пожарный в сапогах говорит, что стоит с утра. Приезжий на мате делает вид, что не слышит."},
      {"text": "У него дома маленький ребёнок. В зале просят ещё час, уже третий подряд."}
    ],
    "onEnter": [{"set": "$.c8_firewatch.started", "value": true}],
    "actions": [
      {
        "id": "c8_firewatch_shift",
        "label": "Заменить его на час",
        "minutes": 60,
        "terminal": true,
        "goto": "c8_north",
        "text": "Пожарный застёгивает куртку и уходит почти сразу. Ты остаёшься у боковой двери с колокольчиком. В зале по одной гаснут лампы.",
        "effects": [{"set": "$.c8_firewatch.done", "value": true}, {"set": "$.c8_firewatch.result", "value": "shift"}, {"body": "fatigue", "delta": 10}]
      },
      {
        "id": "c8_firewatch_split",
        "label": "Поделить час с человеком на мате",
        "minutes": 30,
        "terminal": true,
        "goto": "c8_north",
        "text": "Он соглашается на полчаса и ставит ботинки ближе к себе. Ты сидишь {m:первым|первой}. Когда сменяется, сам приносит твой стул обратно.",
        "effects": [{"set": "$.c8_firewatch.done", "value": true}, {"set": "$.c8_firewatch.result", "value": "split"}, {"body": "fatigue", "delta": 6}]
      },
      {
        "id": "c8_firewatch_duty",
        "label": "Позвать дежурную назначить смену",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_north",
        "text": "Дежурная выслушивает обоих и ставит стул поперёк взгляда на маты. Спящего зовёт по имени. Пожарного отпускает без спора.",
        "effects": [{"set": "$.c8_firewatch.done", "value": true}, {"set": "$.c8_firewatch.result", "value": "duty"}, {"body": "stress", "delta": 5}]
      }
    ],
    "location": "north_gym"
  },
  {
    "id": "c8_sheltertarpaulin",
    "for": "any",
    "chapter": "ch3",
    "title": "Подойти к сорванному навесу",
    "universal": false,
    "text": [
      {"text": "С навеса срывается край брезента. Под ним мокнут чужие сумки. Мужчина держит верёвку одной рукой и зовёт не по имени, просто «помоги»."},
      {"text": "Брезент тяжёлый от воды. Стоит поднять выше, как с края льётся целое ведро."}
    ],
    "onEnter": [{"set": "$.c8_sheltertarpaulin.started", "value": true}],
    "actions": [
      {
        "id": "c8_sheltertarpaulin_wide",
        "label": "Растянуть навес на всех",
        "minutes": 25,
        "terminal": true,
        "goto": "c8_out",
        "text": "Ты тянешь верёвку к стене и просишь прижать узел кирпичом. Люди двигаются под новый край. Твой рюкзак приходится держать на коленях.",
        "effects": [{"set": "$.c8_sheltertarpaulin.done", "value": true}, {"set": "$.c8_sheltertarpaulin.result", "value": "wide"}, {"body": "fatigue", "delta": 7}]
      },
      {
        "id": "c8_sheltertarpaulin_fix",
        "label": "Закрепить прежний край",
        "minutes": 20,
        "terminal": true,
        "goto": "c8_out",
        "text": "Ты берёшь следующую целую петлю. Навес снова держит, но за его краем двое остаются под дождём. Мужчина не говорит спасибо сразу.",
        "effects": [{"set": "$.c8_sheltertarpaulin.done", "value": true}, {"set": "$.c8_sheltertarpaulin.result", "value": "fix"}, {"body": "fatigue", "delta": 5}]
      },
      {
        "id": "c8_sheltertarpaulin_move",
        "label": "Перенести свои вещи под стену",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_out",
        "text": "Ты убираешь рюкзак из-под навеса. У стены теснее, зато никто не тянет ткань над головой. Верёвка остаётся в чужой руке.",
        "effects": [{"set": "$.c8_sheltertarpaulin.done", "value": true}, {"set": "$.c8_sheltertarpaulin.result", "value": "move"}, {"body": "stress", "delta": 6}]
      }
    ]
  },
  {
    "id": "c8_lastbus",
    "for": "any",
    "chapter": "ch3",
    "title": "Выслушать людей у остановки",
    "universal": false,
    "text": [
      {"text": "У остановки говорят о последнем автобусе. Водитель машины с жёлтым жилетом обещает подвезти только до следующего пункта. За место просит воду."},
      {"text": "Он называет перекрёсток, не пункт помощи. На повторный вопрос отвечает тем же перекрёстком."}
    ],
    "onEnter": [{"set": "$.c8_lastbus.started", "value": true}],
    "actions": [
      {
        "id": "c8_lastbus_water",
        "label": "Оставить воду, отказаться от поездки",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_out",
        "text": "Ты убираешь бутылку в рюкзак. Водитель пожимает плечами и закрывает заднюю дверь. Машина уходит без тебя.",
        "effects": [{"set": "$.c8_lastbus.done", "value": true}, {"set": "$.c8_lastbus.result", "value": "water"}, {"body": "stress", "delta": 4}]
      },
      {
        "id": "c8_lastbus_confirm",
        "label": "Попросить дежурного подтвердить адрес",
        "minutes": 20,
        "terminal": true,
        "goto": "c8_out",
        "text": "Дежурный у угла знает названный перекрёсток, но не машину. Ты возвращаешься, когда водитель уже трогается. Жилет всё ещё на сиденье.",
        "effects": [{"set": "$.c8_lastbus.done", "value": true}, {"set": "$.c8_lastbus.result", "value": "confirm"}, {"body": "fatigue", "delta": 5}]
      },
      {
        "id": "c8_lastbus_share",
        "label": "Дать пассажирам воду без поездки",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_out",
        "text": "Ты передаёшь бутылку сидящей сзади женщине. Она пытается освободить тебе место, но ты качаешь головой. Бутылку она больше не протягивает обратно.",
        "effects": [{"set": "$.c8_lastbus.done", "value": true}, {"set": "$.c8_lastbus.result", "value": "share"}, {"take": "water_15"}],
        "enabled": {"has": "water_15"},
        "disabledReason": "Нужные вещи сейчас не при тебе"
      }
    ]
  },
  {
    "id": "c8_headcount",
    "for": "any",
    "chapter": "ch3",
    "title": "Подойти к воротам на перекличку",
    "universal": false,
    "text": [
      {"text": "У ворот зовут людей по именам. На некоторых именах никто не отвечает, на других поднимаются две руки. Солдат просит не перебивать."},
      {"text": "Его повторяют с ошибкой. Ты исправляешь и ждёшь, пока повторят правильно."}
    ],
    "onEnter": [{"set": "$.c8_headcount.started", "value": true}],
    "actions": [
      {
        "id": "c8_headcount_facts",
        "label": "Передать только точное",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_messe_yard",
        "text": "Ты называешь ряд и место, где видел{m:|а} человека последним. Дежурный ставит отметку отдельно от списка живых во дворе. Эти колонки он не смешивает.",
        "effects": [{"set": "$.c8_headcount.done", "value": true}, {"set": "$.c8_headcount.result", "value": "facts"}, {"body": "stress", "delta": 5}]
      },
      {
        "id": "c8_headcount_search",
        "label": "Повторить запрос о партнёре",
        "minutes": 20,
        "terminal": true,
        "goto": "c8_messe_yard",
        "text": "Бирку переносят ближе к краю стола. Дежурный сверяет имя по буквам ещё раз. Ты не уходишь, пока не заканчивает.",
        "effects": [{"set": "$.c8_headcount.done", "value": true}, {"set": "$.c8_headcount.result", "value": "search"}, {"body": "stress", "delta": 7}]
      },
      {
        "id": "c8_headcount_shelter",
        "label": "Вернуться к своим вещам",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_messe_yard",
        "text": "Ты поднимаешь руку, когда ещё раз называют твоё имя. Потом садишься у рюкзака. Чужие имена продолжают звучать над тентом.",
        "effects": [{"set": "$.c8_headcount.done", "value": true}, {"set": "$.c8_headcount.result", "value": "shelter"}, {"body": "fatigue", "delta": -3}]
      }
    ],
    "location": "c3_messe_yard"
  },
  {
    "id": "c8_thinblanket",
    "for": "any",
    "chapter": "ch3",
    "title": "Подойти к раздаче одеял",
    "universal": false,
    "text": [
      {"text": "Одеял не хватает на последний ряд. Волонтёр держит пустой мешок, у его ног человек делит свой картон надвое."},
      {"text": "Двое сидят у крайней стойки. На одном тонкая рубашка, второй укрыл только ноги."}
    ],
    "onEnter": [{"set": "$.c8_thinblanket.started", "value": true}],
    "actions": [
      {
        "id": "c8_thinblanket_half",
        "label": "Поделиться сухой подстилкой",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_messe_yard",
        "text": "Ты подаёшь половину листов. Человек в рубашке прижимает их к земле ладонями. Твоё место становится жёстче и холоднее.",
        "effects": [{"set": "$.c8_thinblanket.done", "value": true}, {"set": "$.c8_thinblanket.result", "value": "half"}, {"body": "stress", "delta": -3}, {"body": "fatigue", "delta": 6}]
      },
      {
        "id": "c8_thinblanket_boxes",
        "label": "Помочь разобрать сухие коробки",
        "minutes": 25,
        "terminal": true,
        "goto": "c8_messe_yard",
        "text": "Ты режешь скотч, волонтёр расплющивает коробки. На двоих у стойки набирается по слою. Нож он сразу возвращает рукояткой вперёд.",
        "effects": [{"set": "$.c8_thinblanket.done", "value": true}, {"set": "$.c8_thinblanket.result", "value": "boxes"}, {"body": "fatigue", "delta": 7}]
      },
      {
        "id": "c8_thinblanket_keep",
        "label": "Оставить своё место целым",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_messe_yard",
        "text": "Ты возвращаешься на прежний картон. Люди у стойки придвигаются друг к другу. Край твоего одеяла не достаёт до их ног.",
        "effects": [{"set": "$.c8_thinblanket.done", "value": true}, {"set": "$.c8_thinblanket.result", "value": "keep"}, {"body": "stress", "delta": 7}]
      }
    ],
    "location": "c3_messe_yard"
  },
  {
    "id": "c8_medbag",
    "for": "any",
    "chapter": "ch3",
    "title": "Подойти к сумке у соседней двери",
    "universal": false,
    "text": [
      {"text": "У соседней двери ставят сумку с медицинским крестом. Женщина с улицы просит поднять её на верхний этаж. В ручку продета чистая перчатка."},
      {"text": "Женщина показывает наклейку пункта помощи. Имени врача не называет, говорит «дежурная»."}
    ],
    "onEnter": [{"set": "$.c8_medbag.started", "value": true}],
    "actions": [
      {
        "id": "c8_medbag_carry",
        "label": "Поднять закрытую сумку",
        "minutes": 15,
        "terminal": true,
        "goto": "c8_bflat",
        "text": "Ты несёшь за ручку через чистую ткань. Наверху сумку забирают обеими руками. На обратном пути женщине говоришь только, что передано.",
        "effects": [{"set": "$.c8_medbag.done", "value": true}, {"set": "$.c8_medbag.result", "value": "carry"}, {"body": "fatigue", "delta": 4}]
      },
      {
        "id": "c8_medbag_wait",
        "label": "Остаться с сумкой, пока придут за ней",
        "minutes": 20,
        "terminal": true,
        "goto": "c8_bflat",
        "text": "С верхней квартиры спускается сосед. Ты показываешь на закрытую застёжку. Он благодарит и забирает, не ставя на пол снова.",
        "effects": [{"set": "$.c8_medbag.done", "value": true}, {"set": "$.c8_medbag.result", "value": "wait"}, {"body": "fatigue", "delta": 3}]
      },
      {
        "id": "c8_medbag_call",
        "label": "Попросить доставившую подняться самой",
        "minutes": 12,
        "terminal": true,
        "goto": "c8_bflat",
        "text": "Женщина берёт сумку и идёт наверх. На второй площадке останавливается перевести дыхание. Ты держишь для неё сухой проход.",
        "effects": [{"set": "$.c8_medbag.done", "value": true}, {"set": "$.c8_medbag.result", "value": "call"}, {"body": "stress", "delta": 3}]
      }
    ],
    "location": "b_flat"
  }
];

export const afternoon13Events: WorldEvent[] = [


  {
    "id": "ev_c8_keys",
    "at": 5240,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5240}, {"before": 5640}, {"all": [{"npc": "henrike", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c8_keys.done"}}]}, {"at": "farm_coop"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Снаружи крутят ключ, но дверь не открывается. Хенрике просит не тянуть ручку. Засов упирается в разбухшее дерево."}]
  },
  {
    "id": "ev_c8_supperdoor",
    "at": 5460,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5460}, {"before": 5640}, {"all": [{"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c8_supperdoor.done"}}]}, {"at": "farm_coop"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Оле ставит миску у двери слишком далеко от щели. Просит подождать, пока принесёт ещё воды. Шаги уже уходят к колодцу."}]
  },
  {
    "id": "ev_c8_notebag",
    "at": 5220,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"before": 5640}, {"any": [{"at": "a_flat"}, {"at": "a_stairs"}]}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Сосед снизу стучит с бумажным пакетом в руках. Просит поговорить через дверь."}]
  },
  {
    "id": "ev_c8_stairsnight",
    "at": 5470,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5470}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_stairsnight.done"}}]}, {"any": [{"at": "a_flat"}, {"at": "a_stairs"}]}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Входная дверь бьёт о косяк от ветра. С лестницы выдувает тёплый воздух. Внизу за дверью стоит тень и не входит."}]
  },
  {
    "id": "ev_c8_escort",
    "at": 5230,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5230}, {"before": 5640}, {"all": [{"npcVar": "okafor", "key": "bitten"}, {"flag": "w.c3_okafor_reported"}]}, {"not": {"flag": "$.c8_escort.done"}}]}, {"any": [{"at": "b_flat"}, {"at": "b_stairs"}, {"at": "b_okafor"}]}]},
    "effects": [],
    "news": [
      {
        "channel": "direct",
        "text": "На площадку поднимаются двое в масках. Старший спрашивает про дверь напротив и просит всем остаться в квартирах. Стул перед порогом сдвигают к стене."
      }
    ]
  },
  {
    "id": "ev_c8_lightless",
    "at": 5415,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5415}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_lightless.done"}}]}, {"any": [{"at": "b_flat"}, {"at": "b_stairs"}, {"at": "b_okafor"}]}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "В доме напротив разом гаснут окна. В вашей квартире свет пока есть, но из розетки доносится сухой щелчок. На кухне пахнет нагретой пылью."}]
  },
  {
    "id": "ev_c8_toolsback",
    "at": 5210,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5210}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_toolsback.done"}}]}, {"at": "deniz_workshop"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "К воротам возвращают насос. Рядом ставят чужую сумку с ключами и просят сохранить для Дениза. Человек уже отходит к дороге."}]
  },
  {
    "id": "ev_c8_trailer",
    "at": 5480,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5480}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_trailer.done"}}]}, {"at": "deniz_workshop"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "К воротам подкатывают пустой прицеп. Двое просят поставить его во дворе на ночь. За ними стоит ещё одна машина с выключенными фарами."}]
  },
  {
    "id": "ev_c8_radio",
    "at": 5175,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5175}, {"before": 5640}, {"all": [{"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]}, {"not": {"flag": "$.c8_radio.done"}}]}, {"at": "ahrensburg"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Уве прибавляет громкость на слове «Messe». Биргит останавливается с тарелками в руках. Ведущий просит больше не ехать к выставочным залам."}]
  },
  {
    "id": "ev_c8_gatebasket",
    "at": 5375,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5375}, {"before": 5640}, {"all": [{"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "uwe", "alive": true, "at": "ahrensburg"}]}, {"not": {"flag": "$.c8_gatebasket.done"}}]}, {"at": "ahrensburg"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "За калиткой соседка с пустой корзиной. Просит вернуть кастрюлю, которую вчера принесла Биргит. Внутрь не заходит."}]
  },
  {
    "id": "ev_c8_names",
    "at": 5260,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5260}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_names.done"}}]}, {"at": "north_gym"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "У выхода снимают лист с именами. Женщина держит край и не даёт оторвать. На листе имя её мужа, которого в зале нет."}]
  },
  {
    "id": "ev_c8_firewatch",
    "at": 5490,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5490}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_firewatch.done"}}]}, {"at": "north_gym"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "У боковой двери спорят из-за смены. Пожарный в сапогах говорит, что стоит с утра. Приезжий на мате делает вид, что не слышит."}]
  },
  {
    "id": "ev_c8_sheltertarpaulin",
    "at": 5290,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5290}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_sheltertarpaulin.done"}}]}, {"scene": "c8_out"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "С навеса срывается край брезента. Под ним мокнут чужие сумки. Мужчина держит верёвку одной рукой и зовёт не по имени, просто «помоги»."}]
  },
  {
    "id": "ev_c8_lastbus",
    "at": 5505,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5505}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_lastbus.done"}}]}, {"scene": "c8_out"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "У остановки говорят о последнем автобусе. Водитель машины с жёлтым жилетом обещает подвезти только до следующего пункта. За место просит воду."}]
  },
  {
    "id": "ev_c8_headcount",
    "at": 5245,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5245}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_headcount.done"}}]}, {"at": "c3_messe_yard"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "У ворот зовут людей по именам. На некоторых именах никто не отвечает, на других поднимаются две руки. Солдат просит не перебивать."}]
  },
  {
    "id": "ev_c8_thinblanket",
    "at": 5465,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 7}, {"not": {"cp": 8}}, {"after": 5465}, {"before": 5640}, {"all": []}, {"not": {"flag": "$.c8_thinblanket.done"}}]}, {"at": "c3_messe_yard"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Одеял не хватает на последний ряд. Волонтёр держит пустой мешок, у его ног человек делит свой картон надвое."}]
  },
  {
    "id": "ev_c8_medbag",
    "at": 5230,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"cp": 7}, {"not": {"cp": 8}}, {"before": 5640}, {"any": [{"at": "b_flat"}, {"at": "b_stairs"}, {"at": "b_okafor"}]}, {"not": {"all": [{"npcVar": "okafor", "key": "bitten"}, {"flag": "w.c3_okafor_reported"}]}}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "У соседней двери ставят сумку с медицинским крестом. Женщина с улицы просит поднять её на верхний этаж. В ручку продета чистая перчатка."}]
  }
];
