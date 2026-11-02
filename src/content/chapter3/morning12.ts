import { messe5Scenes, messe5Events } from './messe5';
import { north5Scenes, north5Events } from './north5';
import { bflat5Scenes, bflat5Events } from './bflat5';
import { farm5Scenes, farm5Events } from './farm5';
import type { Scene, WorldEvent } from '../../engine/content-types';

// 12 ноября: утро.
export const morning12Scenes: Scene[] = [
  ...messe5Scenes,
  ...north5Scenes,
  ...farm5Scenes,
  ...bflat5Scenes,
  {
    "id": "c5_neighbor",
    "for": "any",
    "chapter": "ch3",
    "location": "c3_neighbor",
    "title": "Чужой двор",
    "safe": false,
    "text": [
      {
        "when": {"before": 3240},
        "text": "За чужими воротами светится полоска под дверью гаража. Мотор на козлах накрыт брезентом. В доме трижды звонит телефон, никто не берёт."
      },
      {
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"before": 3600}]},
        "text": "Мужчина в ватнике стоит за закрытыми воротами. Во дворе два велосипеда без передних колёс и лодочный мотор на козлах. — Не ближе, — говорит он. Ты останавливаешься."
      },
      {"when": {"all": [{"after": 3600}, {"before": 3900}]}, "text": "Из гаража стучат по металлу. Хозяин не выходит сразу, оставляя тебя ждать снаружи ворот."},
      {"when": {"after": 3900}, "text": "Из-под ворот тянет светом. Мужчина уже не выходит во двор. Разговор приходится вести через закрытую створку."}
    ],
    "actions": [
      {
        "id": "c5_neighbor_talk",
        "label": "Сказать, от кого ты",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c5_neighbor_talk"}}, {"all": [{"after": 3240}, {"before": 3900}]}]}, {"always": true}]},
        "text": "— От Хенрике? — Он смотрит на мешок, потом на твои руки. — Она хоть сама здорова? — Ты киваешь. Он отходит и возвращается с коробкой резины. Не открывает.",
        "effects": [{"set": "$.c5_neighbor_talk", "value": true}, {"body": "stress", "delta": -2}]
      },
      {
        "id": "c5_trade",
        "label": "Обменять картошку на шланг",
        "minutes": 20,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c5_trade"}}, {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}]}]}, {"always": true}]},
        "text": "Мешок проходит под воротами. В ответ выкатывается бухта шланга с двумя хомутами. Мужчина проверяет вес, ты — резину. Никто не говорит «спасибо». Потом он всё же говорит: — Хенрике привет.",
        "effects": [{"set": "$.c5_trade", "value": true}, {"take": "potatoes", "qty": 5}, {"give": "c3_hose"}],
        "enabled": {"has": "potatoes", "qty": 5},
        "disabledReason": "Нужны пять килограммов картошки"
      },
      {
        "id": "c5_measure",
        "label": "Сверить шланг с картонкой",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_measure"}}, {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"flag": "$.c3_hose_size"}]}]},
        "text": "Ты подсовываешь картонку под ворота. Мужчина долго возится с коробкой и возвращает две разные трубки. Одна садится в обведённый круг. Теперь хотя бы понятно, что просить.",
        "effects": [{"set": "$.c5_measure", "value": true}]
      },
      {
        "id": "c5_listen_neighbor",
        "label": "Спросить про дорогу",
        "minutes": 12,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_listen_neighbor"}}, {"all": [{"after": 3240}, {"before": 3900}]}]},
        "text": "— До моста не езди. Вернёшься с пустым баком. — Мужчина мнёт угол ватника. За его спиной в доме кто-то зовёт. Он не отвечает тебе на второй вопрос.",
        "effects": [{"set": "$.c5_listen_neighbor", "value": true}, {"learn": "f_fuel_ban", "kind": "rumor"}]
      },
      {
        "id": "c5_back",
        "label": "Вернуться по краю поля",
        "minutes": 18,
        "terminal": true,
        "goto": "c5_farm",
        "effects": [{"move": "hof_luedemann"}],
        "when": {"always": true}
      },
      {
        "id": "c5_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 3240},
        "effects": [{"sleep": 360}],
        "text": "За чужими воротами светится полоска под дверью гаража. Мотор на козлах накрыт брезентом. В доме трижды звонит телефон, никто не берёт."
      },
      {
        "id": "c5_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку.",
        "when": {"always": true}
      },
      {"id": "c5_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c5_cp", "when": {"all": [{"cp": 4}, {"after": 3660}]}}
    ]
  },
  {
    "id": "c5_coop",
    "for": "any",
    "chapter": "ch3",
    "location": "farm_coop",
    "title": "Старый курятник",
    "safe": true,
    "text": [
      {"when": {"before": 3240}, "text": "Солома колется через одеяло. За дверью звякает ведро, но засов не трогают. Тёплая миска оставлена у самой щели."},
      {
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"before": 3600}]},
        "text": "Под дверью шуршит бумага: Хенрике записывает время и температуру. Потом ставит воду. — Пока здесь, — говорит она. Ты слышишь, как она уходит к дому."
      },
      {"when": {"all": [{"after": 3600}, {"before": 3900}]}, "text": "Свет под дверью стал узким и белым. По двору носят тяжёлое, каждый раз скрипит та же тележка."},
      {"when": {"after": 3900}, "text": "Снаружи пахнет ужином. Между досками стены виден свет, но не видно людей. На миске у двери лежит чистое полотенце."},
      {
        "when": {"all": [{"v": "$.c5_rattle.result", "op": "==", "value": "cloth"}, {"all": [{"npc": "pawel", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "Полотенце возвращается выстиранным, но с розовой полосой. Павел кладёт его на порог и не ждёт благодарности."
      },
      {
        "when": {"all": [{"v": "$.c5_rattle.result", "op": "==", "value": "call"}, {"all": [{"npc": "pawel", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "Павел ставит кружку молча. За спиной у него Хенрике: — Сначала руку покажи."
      },
      {
        "when": {"all": [{"v": "$.c5_rattle.result", "op": "==", "value": "wait"}, {"all": [{"npc": "pawel", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "Через щель видно белую ткань на ладони Павла. Чистой рукой он придерживает дверь, чтобы тебя не ударило."
      },
      {
        "when": {"all": [{"v": "$.c5_thermometer.result", "op": "==", "value": "honest"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]},
        "text": "Хенрике спрашивает тебя про голову, не доставая прибор. Теперь ей нужен твой ответ, а не цифра."
      },
      {
        "when": {"all": [{"v": "$.c5_thermometer.result", "op": "==", "value": "doctor"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]},
        "text": "У двери лежит записка: врача пока нет. Хенрике оставила карандаш, чтобы ты мог{m:|ла} дописать симптомы."
      },
      {
        "when": {"all": [{"v": "$.c5_thermometer.result", "op": "==", "value": "privacy"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]},
        "text": "Хенрике ставит миску, не снимая цепочку. Ты слышишь, как она проверяет засов второй раз."
      }
    ],
    "actions": [
      {
        "id": "c5_coop_check",
        "label": "Попросить проверить повязку и лоб",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c5_coop_check"}}, {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"npc": "henrike", "at": "hof_luedemann", "alive": true}]}]}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]},
        "text": "Дверь открывается на длину цепочки. Хенрике смотрит на руку, потом на цифры градусника. — Завтра ещё раз. — Ты спрашиваешь, сколько ещё. Она убирает градусник в карман.",
        "effects": [{"set": "$.c5_coop_check", "value": true}, {"body": "stress", "delta": 3}]
      },
      {
        "id": "c5_coop_air",
        "label": "Проветрить через верхнюю щель",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_coop_air"}}, {"all": [{"after": 3240}, {"before": 3900}]}]},
        "text": "Ты сдвигаешь доску на ширину двух пальцев. Пахнет сырой соломой, потом полем. Закрываешь, когда начинает тянуть по ногам.",
        "effects": [{"set": "$.c5_coop_air", "value": true}, {"body": "stress", "delta": -3}]
      },
      {
        "id": "c5_coop_sort",
        "label": "Перебрать вещи на нарах",
        "minutes": 20,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_coop_sort"}}, {"all": [{"after": 3240}, {"before": 3900}]}]},
        "text": "Сухое — в одну сторону, мокрое — в другую. Лекарства кладёшь ближе к краю, чтобы достать, не вставая. Под повязкой саднит, когда тянешь молнию.",
        "effects": [{"set": "$.c5_coop_sort", "value": true}]
      },
      {
        "id": "c5_coop_pawel",
        "label": "Поговорить через дверь с Павлом",
        "minutes": 25,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c5_coop_pawel"}}, {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"npc": "pawel", "at": "hof_luedemann", "alive": true}]}]}, {"npc": "pawel", "alive": true, "at": "hof_luedemann"}]},
        "text": "Павел ставит ведро и не уходит сразу. — Я тогда думал, навсегда, — говорит он. — А утром меня выпустили. — Он сидит по другую сторону двери, пока его не зовут.",
        "effects": [{"set": "$.c5_coop_pawel", "value": true}, {"body": "stress", "delta": -6}, {"npc": "pawel", "trust": 4}]
      },
      {
        "id": "c5_coop_food",
        "label": "Забрать миску с порога",
        "minutes": 20,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c5_coop_food"}}, {"all": [{"after": 3900}, {"npc": "henrike", "at": "hof_luedemann", "alive": true}]}]}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]},
        "text": "Ты подтягиваешь миску за край полотенца. Горячее пахнет луком. На обороте бумажки с температурой — слово «есть». Бумагу Хенрике оставляет сухой стороной вверх.",
        "effects": [{"set": "$.c5_coop_food", "value": true}, {"body": "hunger", "delta": -20}, {"body": "thirst", "delta": -15}]
      },
      {
        "id": "c5_coop_note",
        "label": "Написать записку для {partner.gen}",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_coop_note"}}]},
        "text": "Ты пишешь крупно: как рука, как спалось, что нужно принести. Потом зачёркиваешь последнюю строку. Сгибаешь бумагу вчетверо и оставляешь под миской.",
        "effects": [{"set": "$.c5_coop_note", "value": true}, {"body": "stress", "delta": -3}]
      },
      {
        "id": "c5_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 3240},
        "effects": [{"sleep": 360}],
        "text": "Солома колется через одеяло. За дверью звякает ведро, но засов не трогают. Тёплая миска оставлена у самой щели."
      },
      {
        "id": "c5_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c5_rattle_approach", "label": "Ответить у нижней щели", "minutes": 1, "terminal": true, "goto": "c5_rattle", "when": {"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3350}, {"before": 3710}, {"all": [{"npc": "pawel", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c5_rattle.done"}}]}},
      {"id": "c5_thermometer_approach", "label": "Ответить Хенрике", "minutes": 1, "terminal": true, "goto": "c5_thermometer", "when": {"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3520}, {"before": 3710}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}, {"not": {"flag": "$.c5_thermometer.done"}}]}},
      {"id": "c5_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c5_cp", "when": {"all": [{"cp": 4}, {"after": 3660}]}}
    ]
  },
  {
    "id": "c5_aflat",
    "for": "any",
    "chapter": "ch3",
    "location": "a_flat",
    "title": "Buchholz",
    "safe": true,
    "text": [
      {"when": {"before": 3240}, "text": "Внизу за трубой кто-то двигает мебель. Вода в бутылке у окна ледяная на ощупь. Ты ставишь её ближе к кровати."},
      {
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"before": 3600}]},
        "text": "Кран плюётся воздухом. На столе стоят пустые бутылки; полные ты прячешь от окна, чтобы не путать. Из нижней квартиры доносится короткий стук, потом ничего."
      },
      {
        "when": {"all": [{"after": 3600}, {"before": 3900}]},
        "text": "В квартире тихо настолько, что слышно, как остывает металл крана. Под окном сохнет чужая простыня."
      },
      {
        "when": {"after": 3900},
        "text": "Стекло отражает комнату вместо улицы. Ты закрываешь занавеску до самого края. В подъезде кто-то долго возится с замком и наконец уходит вниз."
      },
      {
        "when": {"npc": "ilse", "at": "a_flat", "alive": true, "status": "turned"},
        "text": "За внутренней дверью шаркают ноги. Ты проверяешь подпорку, не трогая ручку."
      },
      {
        "when": {"all": [{"v": "$.c5_stairs.result", "op": "==", "value": "bandage"}, {"all": []}]},
        "text": "Соседка придерживает дверь для тебя. На тапочке виден край твоей повязки."
      },
      {
        "when": {"all": [{"v": "$.c5_stairs.result", "op": "==", "value": "broom"}, {"all": []}]},
        "text": "С лестницы убраны осколки. Женщина спускается вдоль стены; на выметенной ступеньке остаётся кровь."
      },
      {
        "when": {"all": [{"v": "$.c5_stairs.result", "op": "==", "value": "closed"}, {"all": []}]},
        "text": "На лестнице стоит забытая тапочка. Из-за нижней двери тебе не отвечают."
      },
      {
        "when": {"all": [{"v": "$.c5_tap.result", "op": "==", "value": "give"}, {"all": []}]},
        "text": "Снизу поднимают пустую бутылку на верёвке. К горлышку привязано короткое «спасибо»."
      },
      {
        "when": {"all": [{"v": "$.c5_tap.result", "op": "==", "value": "plumbing"}, {"all": []}]},
        "text": "В стене стих свист. Сосед поднимает большой палец, потом показывает на пустой кран."
      },
      {
        "when": {"all": [{"v": "$.c5_tap.result", "op": "==", "value": "save"}, {"all": []}]},
        "text": "Сосед уносит пустую канистру мимо твоей двери. Останавливается, но стучать не решается."
      }
    ],
    "actions": [
      {
        "id": "c5_reserve",
        "label": "Отложить из рюкзака пачку крупы",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_reserve"}}]},
        "text": "Ты ставишь пачку к сухой стене, отдельно от рюкзака. На полу уже лежит доска. Бумажный край не намокнет снизу.",
        "effects": [{"set": "$.c5_reserve", "value": true}, {"stock": "oats", "qty": 1, "at": "c3_a_stock"}],
        "enabled": {"has": "oats"},
        "disabledReason": "В рюкзаке нет хлопьев"
      },
      {
        "id": "c5_draw_water",
        "label": "Взять из общего запаса три литра",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_draw_water"}}]},
        "text": "Ты переливаешь воду над тазом. Крышки держишь сухими с внутренней стороны. Полные бутылки ставишь подальше от холодного окна.",
        "effects": [{"set": "$.c5_draw_water", "value": true}, {"unstock": "water_l", "qty": 3, "at": "c3_a_stock"}, {"take": "water_l", "qty": 3}, {"give": "water_15", "qty": 2}],
        "enabled": {"stocked": "water_l", "qty": 3, "at": "c3_a_stock"},
        "disabledReason": "В общем запасе меньше трёх литров"
      },
      {
        "id": "c5_window",
        "label": "Убрать свет от окна",
        "minutes": 20,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_window"}}, {"all": [{"after": 3240}, {"before": 3900}]}]},
        "text": "Ты закрепляешь плотную ткань так, чтобы её можно было снять одним движением. С улицы окно должно остаться чёрным. В комнате сразу становится теснее.",
        "effects": [{"set": "$.c5_window", "value": true}, {"body": "stress", "delta": -2}]
      },
      {
        "id": "c5_shutters",
        "label": "Час укреплять засов подъезда",
        "minutes": 0,
        "activity": "moderate",
        "repeatable": true,
        "combinable": true,
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"not": {"flag": "proj.c3_shutters_a.done"}}, {"all": [{"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, {"not": {"npc": "ilse", "at": "a_flat", "alive": true, "status": "turned"}}]}]},
        "text": "Ты работаешь у самого выхода, оставив дверь в квартиру на цепочке. Старый шуруп прокручивается. Приходится переставить скобу выше и сверлить вручную.",
        "effects": [{"work": "c3_shutters_a", "hours": 1}]
      },
      {
        "id": "c5_water_queue",
        "label": "Сходить с бутылками к раздаче",
        "minutes": 75,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_water_queue"}}, {"all": [{"all": [{"after": 3360}, {"before": 3840}]}, {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, {"not": {"npc": "ilse", "at": "a_flat", "alive": true, "status": "turned"}}]}]},
        "text": "У ратуши очередь огибает клумбу. В цистерне осталось немного, и солдат делит остаток на всех. Ты несёшь домой шесть литров и думаешь о лестнице.",
        "effects": [{"set": "$.c5_water_queue", "value": true}, {"place": "water_l", "qty": 6, "at": "c3_a_stock"}, {"body": "fatigue", "delta": 6}]
      },
      {
        "id": "c5_neighbors",
        "label": "Поговорить с соседями через дверь",
        "minutes": 20,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_neighbors"}}, {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"not": {"npc": "ilse", "at": "a_flat", "alive": true, "status": "turned"}}]}]},
        "text": "Дверь открывают на цепочку. Чужая рука протягивает карандаш: записать, кто ещё в доме. Ты пишешь только имена. Про еду никто не спрашивает первым.",
        "effects": [{"set": "$.c5_neighbors", "value": true}, {"body": "stress", "delta": -2}]
      },
      {
        "id": "c5_warm",
        "label": "Устроить одно тёплое место",
        "minutes": 30,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_warm"}}, {"all": [{"after": 3240}, {"before": 3900}]}]},
        "text": "Матрас от стены, одеяло под спину, сухое полотенце к ногам. Ты проверяешь щель у окна ладонью. От неё тянет, и ты снова сворачиваешь край ткани.",
        "effects": [{"set": "$.c5_warm", "value": true}, {"body": "stress", "delta": -4}]
      },
      {
        "id": "c5_partner",
        "label": "Посидеть с {partner.ins} на кухне",
        "minutes": 30,
        "combinable": true,
        "when": {"all": [{"flag": "w.together"}, {"all": [{"not": {"flag": "$.c5_partner"}}, {"flag": "w.together"}]}]},
        "text": "На две кружки одно блюдце. Вы переставляете его друг к другу, хотя класть туда нечего. {partner} касается твоей руки под столом. В подъезде хлопает дверь, и вы одновременно оборачиваетесь.",
        "effects": [{"set": "$.c5_partner", "value": true}, {"body": "stress", "delta": -8}]
      },
      {
        "id": "c5_listen",
        "label": "Послушать дом у двери",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_listen"}}, {"after": 3900}]},
        "text": "Ты не касаешься глазком лба: металл холодный. На нижней площадке гаснет фонарь, слышно, как кто-то считает ступени. До вашей двери не поднимаются.",
        "effects": [{"set": "$.c5_listen", "value": true}, {"body": "stress", "delta": 3}]
      },
      {"id": "c5_landing", "label": "Выйти на площадку", "minutes": 1, "terminal": true, "goto": "c5_landing_A", "effects": []},
      {
        "id": "c5_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 3240},
        "effects": [{"sleep": 360}],
        "text": "Внизу за трубой кто-то двигает мебель. Вода в бутылке у окна ледяная на ощупь. Ты ставишь её ближе к кровати."
      },
      {
        "id": "c5_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c5_stairs_approach", "label": "Прислушаться к лестнице", "minutes": 1, "terminal": true, "goto": "c5_stairs", "when": {"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3365}, {"before": 3710}, {"all": []}, {"not": {"flag": "$.c5_stairs.done"}}]}},
      {"id": "c5_tap_approach", "label": "Проверить стук в трубе", "minutes": 1, "terminal": true, "goto": "c5_tap", "when": {"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3505}, {"before": 3710}, {"all": []}, {"not": {"flag": "$.c5_tap.done"}}]}},
      {"id": "c5_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c5_cp", "when": {"all": [{"cp": 4}, {"after": 3660}]}}
    ]
  },
  {
    "id": "c5_landing_A",
    "for": "any",
    "chapter": "ch3",
    "location": "a_stairs",
    "title": "Площадка",
    "safe": true,
    "text": [
      {"when": {"before": 3240}, "text": "Лестничное окно без шторы. В нём отражается твоя свеча. Ты гасишь её прежде, чем спуститься на ступеньку."},
      {
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"before": 3600}]},
        "text": "Почтовые ящики раскрыты, реклама валяется у стены. На двери кто-то написал время последней раздачи воды. Ниже другим почерком: «Это было вчера»."
      },
      {"when": {"all": [{"after": 3600}, {"before": 3900}]}, "text": "У нижнего окна составлены пустые бутылки. До одной не хватает крышки, и на дне уже пыль."},
      {"when": {"after": 3900}, "text": "Света на лестнице нет. Ты стоишь у перил и слушаешь, не двигаясь. От нижнего пролёта тянет холодом."}
    ],
    "actions": [
      {
        "id": "c5_landing_A_listen",
        "label": "Прислушаться у нижнего пролёта",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_landing_A_listen"}}]},
        "text": "Снизу доносится скрежет. Потом звякает стекло и кто-то тихо ругается. Ты отступаешь к своей двери, чтобы видеть лестницу целиком.",
        "effects": [{"set": "$.c5_landing_A_listen", "value": true}, {"body": "stress", "delta": 3}]
      },
      {"id": "c5_back", "label": "Вернуться в квартиру", "minutes": 2, "terminal": true, "goto": "c5_aflat", "effects": []},
      {
        "id": "c5_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 3240},
        "effects": [{"sleep": 360}],
        "text": "Лестничное окно без шторы. В нём отражается твоя свеча. Ты гасишь её прежде, чем спуститься на ступеньку."
      },
      {
        "id": "c5_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c5_stairs_approach", "label": "Прислушаться к лестнице", "minutes": 1, "terminal": true, "goto": "c5_stairs", "when": {"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3365}, {"before": 3710}, {"all": []}, {"not": {"flag": "$.c5_stairs.done"}}]}},
      {"id": "c5_tap_approach", "label": "Проверить стук в трубе", "minutes": 1, "terminal": true, "goto": "c5_tap", "when": {"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3505}, {"before": 3710}, {"all": []}, {"not": {"flag": "$.c5_tap.done"}}]}},
      {"id": "c5_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c5_cp", "when": {"all": [{"cp": 4}, {"after": 3660}]}}
    ]
  },
  {
    "id": "c5_workshop",
    "for": "any",
    "chapter": "ch3",
    "location": "deniz_workshop",
    "title": "Мастерская",
    "safe": true,
    "text": [
      {"when": {"before": 3240}, "text": "Железо в боксах остывает со щелчками. Под воротами светятся фары проезжающей машины. Полоска ползёт по полу и уходит."},
      {
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"before": 3600}]},
        "text": "На верстаке обведено место, где лежал инструмент. Почти все контуры пустые. Ворота цепляют нижней кромкой бетон; если толкнуть сильнее, звук уходит через всю промзону."
      },
      {
        "when": {"all": [{"after": 3600}, {"before": 3900}]},
        "text": "Ворота отбрасывают на бетон узкую решётку света. На ней видна гайка, которую утром никто не поднял."
      },
      {
        "when": {"after": 3900},
        "text": "Ты сидишь между подъёмниками, где не видно из щели ворот. В металле иногда что-то щёлкает само по себе. Каждый раз приходится напоминать себе об этом."
      },
      {
        "when": {"all": [{"v": "$.c5_rollers.result", "op": "==", "value": "lend"}, {"all": []}]},
        "text": "На месте домкрата голый бетон. Под тяжёлую машину теперь нечего подставить."
      },
      {
        "when": {"all": [{"v": "$.c5_rollers.result", "op": "==", "value": "help"}, {"all": []}]},
        "text": "У выезда освободилось место. Мужчина из машины машет тебе; на ладони грязная повязка."
      },
      {
        "when": {"all": [{"v": "$.c5_rollers.result", "op": "==", "value": "refuse"}, {"all": []}]},
        "text": "У ворот остаётся железный прут. Снаружи слышно, как машину толкают без домкрата."
      },
      {
        "when": {"all": [{"v": "$.c5_spark.result", "op": "==", "value": "sand"}, {"all": []}]},
        "text": "Песок под зарядкой потемнел. Человек у соседнего бокса перестаёт курить, увидев, что ты вынес{m:|ла}."
      },
      {
        "when": {"all": [{"v": "$.c5_spark.result", "op": "==", "value": "air"}, {"all": []}]},
        "text": "Из открытого бокса слышат голоса с дороги. Кто-то останавливается у ворот и запоминает вывеску."
      },
      {
        "when": {"all": [{"v": "$.c5_spark.result", "op": "==", "value": "backroom"}, {"all": []}]},
        "text": "Из щели задней комнаты тянет бензином. Придётся проходить мимо разлива, если понадобится выйти."
      }
    ],
    "actions": [
      {
        "id": "c5_reserve",
        "label": "Отложить из рюкзака пачку крупы",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_reserve"}}]},
        "text": "Ты кладёшь пачку на чистый верстак, подальше от масла. Между едой и инструментом ставишь пустую коробку. Крошкам теперь некуда сыпаться на железо.",
        "effects": [{"set": "$.c5_reserve", "value": true}, {"stock": "oats", "qty": 1, "at": "c3_ws_stock"}],
        "enabled": {"has": "oats"},
        "disabledReason": "В рюкзаке нет хлопьев"
      },
      {
        "id": "c5_draw_water",
        "label": "Взять из общего запаса три литра",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_draw_water"}}]},
        "text": "Воду наливаешь подальше от железного поддона. Бутылки поднимаешь за горлышки, чтобы не зацепить масло с верстака. Крышки завинчиваются с первого раза.",
        "effects": [{"set": "$.c5_draw_water", "value": true}, {"unstock": "water_l", "qty": 3, "at": "c3_ws_stock"}, {"take": "water_l", "qty": 3}, {"give": "water_15", "qty": 2}],
        "enabled": {"stocked": "water_l", "qty": 3, "at": "c3_ws_stock"},
        "disabledReason": "В общем запасе меньше трёх литров"
      },
      {
        "id": "c5_ws_door",
        "label": "Час подгонять направляющую ворот",
        "minutes": 0,
        "activity": "moderate",
        "repeatable": true,
        "combinable": true,
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"not": {"flag": "proj.c3_ws_door.done"}}, {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}]},
        "text": "Ты снимаешь грязь со старого ролика и крутишь его пальцем. Подшипник заедает. Выправлять паз приходится понемногу, каждый раз проверяя ход створки.",
        "effects": [{"work": "c3_ws_door", "hours": 1}]
      },
      {
        "id": "c5_ws_mat",
        "label": "Утеплить место между подъёмниками",
        "minutes": 35,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_ws_mat"}}, {"all": [{"after": 3240}, {"before": 3900}]}]},
        "text": "Ты настилаешь картон в два слоя, сверху кладёшь чехлы от сидений. У стены тепло от твоего дыхания. На бетоне остаётся тёмный прямоугольник пыли.",
        "effects": [{"set": "$.c5_ws_mat", "value": true}, {"body": "stress", "delta": -4}]
      },
      {
        "id": "c5_ws_notice",
        "label": "Оставить записку для Дениза",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c5_ws_notice"}}, {"all": [{"after": 3240}, {"before": 3900}]}]}, {"npc": "deniz", "alive": true, "at": "deniz_workshop"}]},
        "text": "Ты пишешь, что трогали и что осталось. Про ворота — отдельной строкой. Магнит держит лист у самого входа. Хочется добавить дату возвращения. Добавлять нечего.",
        "effects": [{"set": "$.c5_ws_notice", "value": true}]
      },
      {
        "id": "c5_ws_exchange",
        "label": "Обменяться с соседом по боксу",
        "minutes": 35,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_ws_exchange"}}, {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"has": "water_15"}]}]},
        "text": "Мужчина за стенкой просит воды для жены. Ты передаёшь бутылку через приоткрытые ворота. В ответ он оставляет на бетоне хлебцы и сразу уходит. Голоса за стеной стихают.",
        "effects": [{"set": "$.c5_ws_exchange", "value": true}, {"take": "water_15"}, {"give": "crackers", "qty": 2}]
      },
      {
        "id": "c5_ws_walk",
        "label": "Осмотреть двор из-за створки",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_ws_walk"}}, {"all": [{"after": 3360}, {"before": 3840}]}]},
        "text": "За воротами один след велосипеда и следы тяжёлых ботинок к пустому боксу. С улицы запах горелой резины. Ты закрываешь щель, не выходя.",
        "effects": [{"set": "$.c5_ws_walk", "value": true}, {"body": "stress", "delta": 2}]
      },
      {
        "id": "c5_ws_watch",
        "label": "Дежурить у закрытых ворот",
        "minutes": 60,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_ws_watch"}}, {"after": 3900}]},
        "text": "Сначала слышно только ветер. Потом по улице проходит тележка: одно колесо гремит чаще остальных. Ты ждёшь, пока звук совсем не исчезнет.",
        "effects": [{"set": "$.c5_ws_watch", "value": true}, {"body": "fatigue", "delta": 4}]
      },
      {"id": "c5_ws_corner", "label": "Проверить место у аварийного выхода", "minutes": 2, "terminal": true, "goto": "c5_ws_corner", "effects": []},
      {
        "id": "c5_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 3240},
        "effects": [{"sleep": 360}],
        "text": "Железо в боксах остывает со щелчками. Под воротами светятся фары проезжающей машины. Полоска ползёт по полу и уходит."
      },
      {
        "id": "c5_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c5_rollers_approach", "label": "Проверить ворота", "minutes": 1, "terminal": true, "goto": "c5_rollers", "when": {"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3375}, {"before": 3710}, {"all": []}, {"not": {"flag": "$.c5_rollers.done"}}]}},
      {"id": "c5_spark_approach", "label": "Разобраться с запахом бензина", "minutes": 1, "terminal": true, "goto": "c5_spark", "when": {"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3545}, {"before": 3710}, {"all": []}, {"not": {"flag": "$.c5_spark.done"}}]}},
      {"id": "c5_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c5_cp", "when": {"all": [{"cp": 4}, {"after": 3660}]}}
    ]
  },
  {
    "id": "c5_ws_corner",
    "for": "any",
    "chapter": "ch3",
    "location": "deniz_workshop",
    "title": "Задняя дверь",
    "safe": true,
    "text": [
      {"when": {"before": 3240}, "text": "За задней дверью шуршит мусорный мешок. Ты прижимаешь ухо к дереву. Шуршание двигается вместе с ветром."},
      {
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"before": 3600}]},
        "text": "За старой покрышкой маленькая дверь, ручка перемотана изолентой. Ты убираешь от неё пустые коробки. Снаружи узкий проход между боксами."
      },
      {"when": {"all": [{"after": 3600}, {"before": 3900}]}, "text": "У задней двери светлее, чем в боксе. На стене виден отпечаток снятого огнетушителя."},
      {"when": {"after": 3900}, "text": "Ты различаешь ручку только на ощупь. Оставляешь к ней свободную дорожку, чтобы не искать её в темноте."}
    ],
    "actions": [
      {
        "id": "c5_ws_clear",
        "label": "Освободить проход от коробок",
        "minutes": 20,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_ws_clear"}}]},
        "text": "Коробки мокрые снизу и разваливаются в руках. Ты складываешь их у другой стены. Теперь до ручки можно дойти, не глядя под ноги.",
        "effects": [{"set": "$.c5_ws_clear", "value": true}, {"body": "fatigue", "delta": 2}]
      },
      {"id": "c5_back", "label": "Вернуться к верстаку", "minutes": 2, "terminal": true, "goto": "c5_workshop", "effects": []},
      {
        "id": "c5_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 3240},
        "effects": [{"sleep": 360}],
        "text": "За задней дверью шуршит мусорный мешок. Ты прижимаешь ухо к дереву. Шуршание двигается вместе с ветром."
      },
      {
        "id": "c5_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c5_rollers_approach", "label": "Проверить ворота", "minutes": 1, "terminal": true, "goto": "c5_rollers", "when": {"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3375}, {"before": 3710}, {"all": []}, {"not": {"flag": "$.c5_rollers.done"}}]}},
      {"id": "c5_spark_approach", "label": "Разобраться с запахом бензина", "minutes": 1, "terminal": true, "goto": "c5_spark", "when": {"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3545}, {"before": 3710}, {"all": []}, {"not": {"flag": "$.c5_spark.done"}}]}},
      {"id": "c5_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c5_cp", "when": {"all": [{"cp": 4}, {"after": 3660}]}}
    ]
  },
  {
    "id": "c5_ahr",
    "for": "any",
    "chapter": "ch3",
    "location": "ahrensburg",
    "title": "Ahrensburg",
    "safe": true,
    "text": [
      {"when": {"before": 3240}, "text": "Уве ходит по первому этажу в одних носках. Каждая третья доска скрипит. Из комнаты Мерле доносится короткий писк прибора."},
      {
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"before": 3600}]},
        "text": "Биргит кладёт на стол пустые банки, крышки отдельно. Уве считает что-то на обороте рекламного листка. Из комнаты Мерле слышно, как закрывается молния сумки."
      },
      {"when": {"all": [{"after": 3600}, {"before": 3900}]}, "text": "Биргит сушит вымытые крышки на полотенце. Уве в гараже долго подгоняет одну и ту же доску."},
      {
        "when": {"after": 3900},
        "text": "Уве проверяет дверь гаража за собой дважды. Биргит оставляет на плите одну кастрюлю. Остальное убрано по местам, будто утром всё будет как прежде."
      },
      {
        "when": {"all": [{"v": "$.c5_merle.result", "op": "==", "value": "stay"}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}]},
        "text": "Мерле ещё раз смотрит на прибор. — Можешь идти. Я уже умею быть скучной. — Стакан она не отдаёт."
      },
      {
        "when": {"all": [{"v": "$.c5_merle.result", "op": "==", "value": "mother"}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}]},
        "text": "Биргит сидит на краю кровати. Мерле отвечает ей коротко, глядя на пустое место, где ты стоял{m:|а}."
      },
      {
        "when": {"all": [{"v": "$.c5_merle.result", "op": "==", "value": "respect"}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}]},
        "text": "Мерле спускается сама. Перед последней ступенькой останавливается и обеими руками берётся за перила."
      },
      {
        "when": {"all": [{"v": "$.c5_socket.result", "op": "==", "value": "cook"}, {"all": [{"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]}]},
        "text": "Биргит ставит приготовленное мясо в холодную кастрюлю. — Сегодня съедим. Завтра суп, — говорит она Уве."
      },
      {
        "when": {"all": [{"v": "$.c5_socket.result", "op": "==", "value": "repair"}, {"all": [{"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]}]},
        "text": "Уве вешает снятую вилку на гвоздь. — Так безопасно. Холодильник туда не включать."
      },
      {
        "when": {"all": [{"v": "$.c5_socket.result", "op": "==", "value": "ice"}, {"all": [{"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]}]},
        "text": "На освобождённой полке лежит лекарство. Биргит уносит мясо и смотрит на него дольше, чем на тебя."
      }
    ],
    "actions": [
      {
        "id": "c5_ahr_stores",
        "label": "Помочь Биргит разобрать кладовку",
        "minutes": 40,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c5_ahr_stores"}}, {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"npc": "birgit", "at": "ahrensburg", "alive": true}]}]}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]},
        "text": "Биргит помнит, что куплено раньше, без наклеек. Ты ставишь старые банки впереди. Одну она откладывает: вздулась крышка. — Эту даже не открываем, — говорит она.",
        "effects": [{"set": "$.c5_ahr_stores", "value": true}, {"npc": "birgit", "trust": 4}]
      },
      {
        "id": "c5_ahr_uwe",
        "label": "Проверить с Уве запасные батареи",
        "minutes": 25,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c5_ahr_uwe"}}, {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"npc": "uwe", "at": "ahrensburg", "alive": true}]}]}, {"npc": "uwe", "alive": true, "at": "ahrensburg"}]},
        "text": "Уве складывает батарейки в два ряда. На одной ставит крест карандашом. — Эта ещё годится для часов. Для фонаря уже нет. — Он не выбрасывает ни одной.",
        "effects": [{"set": "$.c5_ahr_uwe", "value": true}, {"npc": "uwe", "trust": 3}]
      },
      {
        "id": "c5_ahr_merle",
        "label": "Спросить Мерле про запас",
        "minutes": 20,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c5_ahr_merle"}}, {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"npc": "merle", "at": "ahrensburg", "alive": true}]}]}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]},
        "text": "Мерле считает ручки, не вынимая из коробки. — Девять дней или двадцать — всё равно когда-то последний, — говорит она. Убирает коробку. — Давай сегодня без последнего.",
        "effects": [{"set": "$.c5_ahr_merle", "value": true}, {"npc": "merle", "trust": 3}]
      },
      {
        "id": "c5_ahr_cold",
        "label": "Подготовить сумку на случай отключения",
        "minutes": 30,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c5_ahr_cold"}}, {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"npc": "merle", "at": "ahrensburg", "alive": true}]}]}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]},
        "text": "Ты ставишь закрытые бутылки с водой в холодильник, оставляя место между ними. Они сохранят прохладу дольше воздуха. Замораживать лекарство Мерле не даёт: качает головой и переставляет коробку выше.",
        "effects": [{"set": "$.c5_ahr_cold", "value": true}, {"npc": "merle", "set": {"cooler": true}}]
      },
      {
        "id": "c5_ahr_glass",
        "label": "Закрепить картон на подвальном окне",
        "minutes": 45,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c5_ahr_glass"}}, {"all": [{"all": [{"after": 3360}, {"before": 3840}]}, {"npc": "uwe", "at": "ahrensburg", "alive": true}]}]}, {"npc": "uwe", "alive": true, "at": "ahrensburg"}]},
        "text": "Ты держишь лист, пока Уве размечает отверстия. На этот раз он не поправляет. Когда всё держится, молча подаёт тебе следующий.",
        "effects": [{"set": "$.c5_ahr_glass", "value": true}, {"npc": "uwe", "trust": 5}, {"body": "fatigue", "delta": 4}]
      },
      {
        "id": "c5_ahr_food",
        "label": "Помочь накрыть на стол",
        "minutes": 25,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c5_ahr_food"}}, {"all": [{"after": 3900}, {"npc": "birgit", "at": "ahrensburg", "alive": true}]}]}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]},
        "text": "Биргит режет хлеб на одинаковые ломти. Один край тоньше остальных, она берёт его себе. Ты замечаешь и ничего не говоришь.",
        "effects": [{"set": "$.c5_ahr_food", "value": true}, {"body": "hunger", "delta": -30}, {"body": "thirst", "delta": -20}]
      },
      {
        "id": "c5_ahr_radio",
        "label": "Сверить записи Уве с эфиром",
        "minutes": 20,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c5_ahr_radio"}}, {"all": [{"after": 3240}, {"before": 3900}]}]}, {"npc": "uwe", "alive": true, "at": "ahrensburg"}]},
        "text": "В блокноте время и частота, потом пустая строка. Радио повторяет старую запись. Уве ставит рядом вопросительный знак. — Если повторяют, это ещё не значит, что работает.",
        "effects": [{"set": "$.c5_ahr_radio", "value": true}]
      },
      {
        "id": "c5_ahr_sit",
        "label": "Посидеть в тишине на лестнице",
        "minutes": 20,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_ahr_sit"}}]},
        "text": "На ступеньке тепло от трубы. Ты сидишь, пока внизу моют посуду. Кто-то ставит рядом чистую кружку, не начиная разговора.",
        "effects": [{"set": "$.c5_ahr_sit", "value": true}, {"body": "stress", "delta": -7}]
      },
      {"id": "c5_ahr_hall", "label": "Проверить дверь со стороны прихожей", "minutes": 2, "terminal": true, "goto": "c5_ahr_hall", "effects": []},
      {
        "id": "c5_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"all": [{"before": 3240}, {"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "uwe", "alive": true, "at": "ahrensburg"}]},
        "effects": [{"sleep": 360}],
        "text": "Уве ходит по первому этажу в одних носках. Каждая третья доска скрипит. Из комнаты Мерле доносится короткий писк прибора."
      },
      {
        "id": "c5_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c5_merle_approach", "label": "Проверить, почему Мерле не встаёт", "minutes": 1, "terminal": true, "goto": "c5_merle", "when": {"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3345}, {"before": 3710}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}, {"not": {"flag": "$.c5_merle.done"}}]}},
      {"id": "c5_socket_approach", "label": "Подойти к Уве в гараже", "minutes": 1, "terminal": true, "goto": "c5_socket", "when": {"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3510}, {"before": 3710}, {"all": [{"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]}, {"not": {"flag": "$.c5_socket.done"}}]}},
      {"id": "c5_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c5_cp", "when": {"all": [{"cp": 4}, {"after": 3660}]}}
    ]
  },
  {
    "id": "c5_ahr_hall",
    "for": "any",
    "chapter": "ch3",
    "location": "ahrensburg",
    "title": "Прихожая",
    "safe": true,
    "text": [
      {"when": {"before": 3240}, "text": "В прихожей пахнет яблоками из подвала. Две сумки стоят ручками вверх. Уве проверяет их, не включая свет."},
      {
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"before": 3600}]},
        "text": "На коврике стоят сапоги носками к двери. Рядом сумка с одеялом и документами. Уве больше не убирает её в шкаф."
      },
      {"when": {"all": [{"after": 3600}, {"before": 3900}]}, "text": "Дверь в гараж оставлена на узкую щель. Через неё слышно радио, но не разобрать слова."},
      {"when": {"after": 3900}, "text": "Свет с кухни лежит узкой полосой под дверью. Ты проверяешь засов, стараясь не звякнуть ключами."}
    ],
    "actions": [
      {
        "id": "c5_ahr_bag",
        "label": "Проверить, что сумку можно поднять",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_ahr_bag"}}, {"all": [{"after": 3240}, {"before": 3900}]}]},
        "text": "Поднимаешь за обе ручки. Одна трещит по шву. Ты перекладываешь тяжёлое на дно второй сумки и ставишь их рядом. Теперь хотя бы не рассыплется на пороге.",
        "effects": [{"set": "$.c5_ahr_bag", "value": true}]
      },
      {"id": "c5_back", "label": "Вернуться на кухню", "minutes": 2, "terminal": true, "goto": "c5_ahr", "effects": []},
      {
        "id": "c5_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"all": [{"before": 3240}, {"npc": "uwe", "alive": true, "at": "ahrensburg"}]},
        "effects": [{"sleep": 360}],
        "text": "В прихожей пахнет яблоками из подвала. Две сумки стоят ручками вверх. Уве проверяет их, не включая свет."
      },
      {
        "id": "c5_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c5_merle_approach", "label": "Проверить, почему Мерле не встаёт", "minutes": 1, "terminal": true, "goto": "c5_merle", "when": {"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3345}, {"before": 3710}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}, {"not": {"flag": "$.c5_merle.done"}}]}},
      {"id": "c5_socket_approach", "label": "Подойти к Уве в гараже", "minutes": 1, "terminal": true, "goto": "c5_socket", "when": {"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3510}, {"before": 3710}, {"all": [{"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]}, {"not": {"flag": "$.c5_socket.done"}}]}},
      {"id": "c5_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c5_cp", "when": {"all": [{"cp": 4}, {"after": 3660}]}}
    ]
  },
  {
    "id": "c5_out",
    "for": "any",
    "chapter": "ch3",
    "title": "Временное укрытие",
    "safe": false,
    "text": [
      {"when": {"before": 3240}, "text": "Рюкзак упирается в бок. Из-за угла тянет выхлопом, потом сырой стеной. Ты подтягиваешь колени под куртку."},
      {
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"before": 3600}]},
        "text": "Ты находишь сухой угол, откуда видно выход. Складываешь вещи так, чтобы унести всё сразу. На постоянное место это не похоже. На сегодняшнее — придётся."
      },
      {"when": {"all": [{"after": 3600}, {"before": 3900}]}, "text": "В укрытии светло только у самого входа. На сухом пятачке больше следов обуви, чем утром."},
      {"when": {"after": 3900}, "text": "Ты держишь рюкзак под головой, ремень вокруг запястья. Снаружи редкие шаги. По звуку не понять, кто идёт."},
      {
        "when": {"all": [{"v": "$.c5_cart.result", "op": "==", "value": "fix"}, {"all": []}]},
        "text": "Женщина прокатывает тележку через порог без рывка. Одну канистру придерживает для тебя, чтобы не задела ногу."
      },
      {
        "when": {"all": [{"v": "$.c5_cart.result", "op": "==", "value": "carry"}, {"all": []}]},
        "text": "На месте твоих пальцев чистые полосы на канистре. Женщина ставит её рядом с другой и садится на землю."
      },
      {
        "when": {"all": [{"v": "$.c5_cart.result", "op": "==", "value": "space"}, {"all": []}]},
        "text": "Женщина задремала рядом с тележкой. Выйти тихо теперь можно только через дальний проход."
      },
      {
        "when": {"all": [{"v": "$.c5_glass.result", "op": "==", "value": "food"}, {"all": []}]},
        "text": "У банки мелькает кошачий хвост. Мужчина гасит фонарь и садится ждать без света."
      },
      {
        "when": {"all": [{"v": "$.c5_glass.result", "op": "==", "value": "distance"}, {"all": []}]},
        "text": "Мужчина ползёт между машинами туда, куда ты показал{m:|а}. Его фонарь светит прямо в чужое окно."
      },
      {
        "when": {"all": [{"v": "$.c5_glass.result", "op": "==", "value": "leave"}, {"all": []}]},
        "text": "Из дальнего угла видно, как свет ищет под машинами. Твоих вещей в проходе уже не видно."
      }
    ],
    "actions": [
      {
        "id": "c5_out_water",
        "label": "Найти дневную раздачу воды",
        "minutes": 80,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_out_water"}}, {"all": [{"after": 3360}, {"before": 3840}]}]},
        "text": "Ты идёшь туда, откуда возвращаются с полными бутылками. В конце улицы очередь уже расходится. Тебе хватает остатка, но назад приходится нести всё в руках.",
        "effects": [{"set": "$.c5_out_water", "value": true}, {"give": "water_15", "qty": 2}, {"body": "fatigue", "delta": 5}]
      },
      {
        "id": "c5_out_shelter",
        "label": "Закрыть щель от ветра",
        "minutes": 25,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_out_shelter"}}, {"all": [{"after": 3240}, {"before": 3900}]}]},
        "text": "Ты подкладываешь картон, прижимаешь пустым ящиком. Ветер сразу стихает у самой спины. Если понадобится уходить, ящик придётся переступить.",
        "effects": [{"set": "$.c5_out_shelter", "value": true}, {"body": "stress", "delta": -4}]
      },
      {
        "id": "c5_out_people",
        "label": "Расспросить людей о ближайшем ночлеге",
        "minutes": 25,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_out_people"}}, {"all": [{"after": 3240}, {"before": 3900}]}]},
        "text": "Люди показывают в разные стороны. Одна женщина останавливается и объясняет, где не запирают навес на ночь. Ты запоминаешь поворот, не обещая прийти.",
        "effects": [{"set": "$.c5_out_people", "value": true}, {"body": "stress", "delta": -2}]
      },
      {
        "id": "c5_out_watch",
        "label": "Проверить подходы, не выходя далеко",
        "minutes": 20,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_out_watch"}}, {"all": [{"after": 3240}, {"before": 3900}]}]},
        "text": "Ты проходишь до угла и обратно. За углом стоит тележка с чужими вещами. Трогать её не хочется. Лучше видеть её отсюда.",
        "effects": [{"set": "$.c5_out_watch", "value": true}, {"body": "stress", "delta": 2}]
      },
      {
        "id": "c5_out_dry",
        "label": "Просушить стельки и размять ноги",
        "minutes": 25,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_out_dry"}}, {"all": [{"after": 3240}, {"before": 3900}]}]},
        "text": "Носки холодные, но не мокрые. Ты растираешь ступни через ткань и ждёшь, пока вернётся чувствительность. Потом снова обуваешься.",
        "effects": [{"set": "$.c5_out_dry", "value": true}, {"body": "fatigue", "delta": -4}]
      },
      {
        "id": "c5_out_note",
        "label": "Записать пройденный путь",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_out_note"}}, {"after": 3900}]},
        "text": "Повороты вспоминаются по мелочам: зелёная дверь, разбитый щит, запах булочной. Ты записываешь их в обратном порядке. Завтра память может подвести.",
        "effects": [{"set": "$.c5_out_note", "value": true}]
      },
      {
        "id": "c5_out_sit",
        "label": "Пересидеть вечер без света",
        "minutes": 50,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_out_sit"}}, {"after": 3900}]},
        "text": "Темнота сначала давит на глаза, потом в ней проступают края вещей. Ты держишь ладонь на застёжке рюкзака. Ничего не происходит. Час проходит и так.",
        "effects": [{"set": "$.c5_out_sit", "value": true}, {"body": "stress", "delta": 3}]
      },
      {"id": "c5_out_corner", "label": "Проверить второй выход из укрытия", "minutes": 2, "terminal": true, "goto": "c5_out_corner", "effects": []},
      {
        "id": "c5_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 3240},
        "effects": [{"sleep": 360}],
        "text": "Рюкзак упирается в бок. Из-за угла тянет выхлопом, потом сырой стеной. Ты подтягиваешь колени под куртку."
      },
      {
        "id": "c5_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c5_cart_approach", "label": "Проверить тележку у укрытия", "minutes": 1, "terminal": true, "goto": "c5_cart", "when": {"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3405}, {"before": 3710}, {"all": []}, {"not": {"flag": "$.c5_cart.done"}}]}},
      {"id": "c5_glass_approach", "label": "Посмотреть, кто у прохода", "minutes": 1, "terminal": true, "goto": "c5_glass", "when": {"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3570}, {"before": 3710}, {"all": []}, {"not": {"flag": "$.c5_glass.done"}}]}},
      {"id": "c5_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c5_cp", "when": {"all": [{"cp": 4}, {"after": 3660}]}}
    ]
  },
  {
    "id": "c5_out_corner",
    "for": "any",
    "chapter": "ch3",
    "title": "За углом",
    "safe": false,
    "text": [
      {"when": {"before": 3240}, "text": "За углом ударяет о стену жестяная крышка. Ты придерживаешь её куском кирпича. На пальцах остаётся рыжая крошка."},
      {
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"before": 3600}]},
        "text": "Ты отходишь на несколько шагов, не теряя из виду вещи. Отсюда виден второй проход. Узкий, но без завала."
      },
      {
        "when": {"all": [{"after": 3600}, {"before": 3900}]},
        "text": "За поворотом сохнет клок бумаги. Когда кто-то проходит, бумага поднимается и снова липнет к стене."
      },
      {"when": {"after": 3900}, "text": "Ты проводишь ладонью по стене, чтобы запомнить расстояние до поворота. Считать шаги в темноте трудно."}
    ],
    "actions": [
      {
        "id": "c5_out_mark",
        "label": "Запомнить проход на ощупь",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_out_mark"}}, {"all": [{"after": 3240}, {"before": 3900}]}]},
        "text": "Три шага вдоль стены, потом край ящика. Ты переставляешь его дальше и проходишь обратно. У ящика смялся угол от твоего ботинка.",
        "effects": [{"set": "$.c5_out_mark", "value": true}]
      },
      {"id": "c5_back", "label": "Вернуться к вещам", "minutes": 2, "terminal": true, "goto": "c5_out", "effects": []},
      {
        "id": "c5_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 3240},
        "effects": [{"sleep": 360}],
        "text": "За углом ударяет о стену жестяная крышка. Ты придерживаешь её куском кирпича. На пальцах остаётся рыжая крошка."
      },
      {
        "id": "c5_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c5_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c5_cp", "when": {"all": [{"cp": 4}, {"after": 3660}]}}
    ]
  },
  {
    "id": "c5_q",
    "for": "any",
    "chapter": "ch3",
    "location": "messe_q",
    "title": "Наблюдение",
    "safe": true,
    "text": [
      {
        "when": {"before": 3240},
        "text": "Медсестра светит фонариком на номер койки. Луч задерживается на твоей руке и уходит. На пластиковой бирке остаётся жёлтое пятно в глазах."
      },
      {
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"before": 3600}]},
        "text": "У номера койки новая бумажка с температурой. Медсестра меняет перчатки между раскладушками. У одной бумажки цифра подчёркнута дважды."
      },
      {"when": {"all": [{"after": 3600}, {"before": 3900}]}, "text": "Медсёстры меняются у прохода. Одна снимает перчатки внутрь наружу и сразу прячет в мешок."},
      {"when": {"after": 3900}, "text": "За перегородкой громче обычного скрипят колёса каталки. Ты считаешь, сколько раз она проезжает мимо, пока не сбиваешься."},
      {
        "when": {"all": [{"v": "$.c5_curtain.result", "op": "==", "value": "space"}, {"all": []}]},
        "text": "У ширмы свободен проход. Медсестра откатывает тележку туда, где ты убрал{m:|а} вещи."
      },
      {
        "when": {"all": [{"v": "$.c5_curtain.result", "op": "==", "value": "gloves"}, {"all": []}]},
        "text": "Медсестра поднимает ладонь в твоих перчатках. На манжете ещё виден след от упаковки."
      },
      {
        "when": {"all": [{"v": "$.c5_curtain.result", "op": "==", "value": "cot"}, {"all": []}]},
        "text": "Твоя койка заслоняет обзор. За тканью снова зовут второго человека, громче прежнего."
      },
      {
        "when": {"all": [{"v": "$.c5_bracelet.result", "op": "==", "value": "message"}, {"all": []}]},
        "text": "Дежурный приносит ответ от мужа. Женщина разглаживает бумагу под красным браслетом."
      },
      {
        "when": {"all": [{"v": "$.c5_bracelet.result", "op": "==", "value": "report"}, {"all": []}]},
        "text": "Возле соседки поставили стул для наблюдателя. Она отворачивается, когда ты проходишь."
      },
      {
        "when": {"all": [{"v": "$.c5_bracelet.result", "op": "==", "value": "silent"}, {"all": []}]},
        "text": "Женщина перестаёт дёргать браслет при тебе. Под рукавом слышен сухой треск пластика."
      }
    ],
    "actions": [
      {
        "id": "c5_q_time",
        "label": "Уточнить время следующего осмотра",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c5_q_time"}}, {"all": [{"after": 3240}, {"before": 3900}]}]}]},
        "text": "Медсестра смотрит на браслет. — Двое суток от регистрации, если всё спокойно. — На слове «если» она не делает паузы. Просто ты слышишь именно его.",
        "effects": [{"set": "$.c5_q_time", "value": true}]
      },
      {
        "id": "c5_q_wound",
        "label": "Показать повязку, не снимая её руками",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c5_q_wound"}}, {"all": [{"after": 3240}, {"before": 3900}]}]}]},
        "text": "Ты вытягиваешь руку и ждёшь. Медсестра осматривает край ткани, записывает время. Новая повязка шуршит, когда ты сгибаешь локоть.",
        "effects": [{"set": "$.c5_q_wound", "value": true}, {"body": "stress", "delta": -2}]
      },
      {
        "id": "c5_q_space",
        "label": "Отодвинуть свои вещи от прохода",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c5_q_space"}}, {"all": [{"after": 3240}, {"before": 3900}]}]}]},
        "text": "Проход между кроватями слишком узкий для каталки. Ты убираешь сумку под ноги. Сосед делает то же, не поднимая глаз.",
        "effects": [{"set": "$.c5_q_space", "value": true}]
      },
      {
        "id": "c5_q_nurse",
        "label": "Позвать медсестру к соседней койке",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c5_q_nurse"}}, {"all": [{"after": 3240}, {"before": 3900}]}]}]},
        "text": "Человек под одеялом дышит часто и не отзывается. Ты зовёшь, не подходя ближе. Двое медиков встают между койками так, чтобы оставался проход к двери.",
        "effects": [{"set": "$.c5_q_nurse", "value": true}, {"body": "stress", "delta": 4}]
      },
      {
        "id": "c5_q_window",
        "label": "Посмотреть на двор из прохода",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c5_q_window"}}, {"all": [{"after": 3240}, {"before": 3900}]}]}]},
        "text": "Служебная дверь выходит во двор с мусорными контейнерами. Там стоит погрузчик, ключ оставлен в замке. Солдат просит тебя вернуться к номеру.",
        "effects": [{"set": "$.c5_q_window", "value": true}, {"set": "$.messe_exit", "value": true}]
      },
      {
        "id": "c5_q_talk",
        "label": "Поговорить с женщиной у перегородки",
        "minutes": 20,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c5_q_talk"}}, {"all": [{"after": 3240}, {"before": 3900}]}]}]},
        "text": "Она показывает неповреждённую руку: вчера поцарапала кошка. Потом опускает рукав и молчит. На соседнюю койку вы стараетесь не смотреть.",
        "effects": [{"set": "$.c5_q_talk", "value": true}, {"body": "stress", "delta": -2}]
      },
      {
        "id": "c5_q_water",
        "label": "Попросить закрытую бутылку",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c5_q_water"}}, {"all": [{"after": 3240}, {"before": 3900}]}]}]},
        "text": "Медсестра ставит бутылку на край койки. Ты проверяешь кольцо под крышкой. Оно щёлкает впервые. От этого почему-то легче.",
        "effects": [{"set": "$.c5_q_water", "value": true}, {"give": "water_05"}]
      },
      {
        "id": "c5_q_food",
        "label": "Поесть из принесённого контейнера",
        "minutes": 25,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c5_q_food"}}, {"after": 3900}]}]},
        "text": "Крышку трудно открыть одной рукой. Ты зажимаешь контейнер коленями, поддеваешь край. Пар на секунду закрывает лицо.",
        "effects": [{"set": "$.c5_q_food", "value": true}, {"body": "hunger", "delta": -30}, {"body": "thirst", "delta": -15}]
      },
      {
        "id": "c5_q_screen",
        "label": "Подойти к перегородке",
        "minutes": 2,
        "terminal": true,
        "goto": "c5_q_screen",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]},
        "effects": []
      },
      {
        "id": "c5_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"before": 3240}]},
        "effects": [{"sleep": 360}],
        "text": "Медсестра светит фонариком на номер койки. Луч задерживается на твоей руке и уходит. На пластиковой бирке остаётся жёлтое пятно в глазах."
      },
      {
        "id": "c5_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку.",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]}
      },
      {
        "id": "c5_alarm",
        "label": "Уйти от падающей перегородки",
        "minutes": 0,
        "terminal": true,
        "goto": "c5_messe_exit",
        "when": {"flag": "w.c3_messe_outbreak"},
        "effects": []
      },
      {"id": "c5_curtain_approach", "label": "Позвать медсестру к ширме", "minutes": 1, "terminal": true, "goto": "c5_curtain", "when": {"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3370}, {"before": 3710}, {"all": []}, {"not": {"flag": "$.c5_curtain.done"}}]}},
      {"id": "c5_bracelet_approach", "label": "Выслушать соседку с браслетом", "minutes": 1, "terminal": true, "goto": "c5_bracelet", "when": {"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3565}, {"before": 3710}, {"all": []}, {"not": {"flag": "$.c5_bracelet.done"}}]}},
      {"id": "c5_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c5_cp", "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"cp": 4}, {"after": 3660}]}]}}
    ]
  },
  {
    "id": "c5_q_screen",
    "for": "any",
    "chapter": "ch3",
    "location": "messe_q",
    "title": "У сетки",
    "safe": true,
    "text": [
      {"when": {"before": 3240}, "text": "Свет из общего зала режет сетку на квадраты. На одном висит нитка от бинта. Она двигается, хотя ветра нет."},
      {
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"before": 3600}]},
        "text": "Через сетку видно большой зал. Люди проходят мимо, не задерживаясь у перегородки. Вдоль пола идёт толстый кабель."
      },
      {
        "when": {"all": [{"after": 3600}, {"before": 3900}]},
        "text": "У перегородки пахнет антисептиком. На перилах сохнет маленькая капля с перевёрнутого дозатора."
      },
      {"when": {"after": 3900}, "text": "В проходе оставили одну лампу. Она светит тебе в глаза и ничего не освещает по ту сторону."}
    ],
    "actions": [
      {
        "id": "c5_q_note",
        "label": "Передать дежурному номер для записки",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"not": {"flag": "$.c5_q_note"}}]}]},
        "text": "Дежурный записывает имя на краю списка. Ты повторяешь ещё раз, медленнее. Он кивает и прячет лист под планшет.",
        "effects": [{"set": "$.c5_q_note", "value": true}, {"body": "stress", "delta": -2}]
      },
      {
        "id": "c5_back",
        "label": "Вернуться к раскладушке",
        "minutes": 2,
        "terminal": true,
        "goto": "c5_q",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]},
        "effects": []
      },
      {
        "id": "c5_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"before": 3240}]},
        "effects": [{"sleep": 360}],
        "text": "Свет из общего зала режет сетку на квадраты. На одном висит нитка от бинта. Она двигается, хотя ветра нет."
      },
      {
        "id": "c5_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку.",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]}
      },
      {
        "id": "c5_alarm",
        "label": "Уйти от падающей перегородки",
        "minutes": 0,
        "terminal": true,
        "goto": "c5_messe_exit",
        "when": {"flag": "w.c3_messe_outbreak"},
        "effects": []
      },
      {"id": "c5_curtain_approach", "label": "Позвать медсестру к ширме", "minutes": 1, "terminal": true, "goto": "c5_curtain", "when": {"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3370}, {"before": 3710}, {"all": []}, {"not": {"flag": "$.c5_curtain.done"}}]}},
      {"id": "c5_bracelet_approach", "label": "Выслушать соседку с браслетом", "minutes": 1, "terminal": true, "goto": "c5_bracelet", "when": {"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3565}, {"before": 3710}, {"all": []}, {"not": {"flag": "$.c5_bracelet.done"}}]}},
      {"id": "c5_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c5_cp", "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"cp": 4}, {"after": 3660}]}]}}
    ]
  },
  {
    "id": "c5_messe_exit",
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
        "id": "c5_exit_known",
        "label": "Держаться знакомого прохода вдоль стены",
        "minutes": 12,
        "terminal": true,
        "goto": "c5_messe_yard",
        "when": {"flag": "$.messe_exit"},
        "text": "Ты идёшь вдоль стены, не пытаясь обогнать тех, кто впереди. Зелёная табличка, коробки, ручка. За дверью холодно. Ты выходишь и только тогда вспоминаешь вдохнуть.",
        "effects": [{"move": "c3_messe_yard"}, {"body": "stress", "delta": 15}, {"learn": "f_c3_messe_closed"}]
      },
      {
        "id": "c5_exit_staff",
        "label": "Идти за волонтёром к служебной двери",
        "minutes": 25,
        "terminal": true,
        "goto": "c5_messe_yard",
        "text": "Волонтёр поднимает свёрнутый жилет над головой. Ты держишь его в поле зрения. В узком месте сумку прижимает к чужой спине, потом вдруг отпускает. За дверью ты долго не можешь выпрямить пальцы.",
        "effects": [{"move": "c3_messe_yard"}, {"body": "stress", "delta": 24}, {"body": "fatigue", "delta": 8}, {"learn": "f_c3_messe_closed"}]
      },
      {
        "id": "c5_exit_lift",
        "label": "Вытащить упавшего из прохода",
        "minutes": 8,
        "terminal": true,
        "risky": true,
        "goto": "c5_messe_yard",
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
        "id": "c5_exit_drop",
        "label": "Бросить рюкзак и протиснуться первым",
        "minutes": 3,
        "terminal": true,
        "goto": "c5_messe_yard",
        "text": "Ты выпускаешь лямку. Чужие ноги сразу закрывают рюкзак, и уже не видно, какой из них твой. Снаружи руки свободны. Ты не знаешь, что ими делать.",
        "effects": [{"move": "c3_messe_yard"}, {"drop": "backpack"}, {"set": "$.c3_exit_left_bag", "value": true}, {"body": "stress", "delta": 18}, {"learn": "f_c3_messe_closed"}]
      }
    ]
  },
  {
    "id": "c5_messe_yard",
    "for": "any",
    "chapter": "ch3",
    "location": "c3_messe_yard",
    "title": "За павильонами",
    "safe": false,
    "text": [
      {
        "when": {"before": 3240},
        "text": "Под тентом пар от чужого дыхания. Кто-то накрывает фонарь ладонью, чтобы было темнее спать. На бетоне холодно даже через два слоя картона."
      },
      {
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"before": 3600}]},
        "text": "Людей собирают за низкой оградой, подальше от дверей. Волонтёр выдаёт по бутылке и просит не расходиться. Из зала слышно то грохот, то тишину."
      },
      {"when": {"all": [{"after": 3600}, {"before": 3900}]}, "text": "Во дворе подвигают тент к ограде. На старом месте картон уже мокрый насквозь."},
      {"when": {"after": 3900}, "text": "Во дворе растянули тент. По краям прижали его ящиками, под ним тесно сидят люди. Ворота к павильонам закрыты."},
      {
        "when": {"flag": "$.c3_exit_helped"},
        "text": "Человек, которого ты вытащил{m:|а}, садится рядом. — Фамилия как? — спрашивает он. — Скажу, если искать будут."
      },
      {"when": {"flag": "$.c3_exit_left_bag"}, "text": "Рюкзак остался за закрытыми воротами. Солдат преграждает дорогу, когда ты поворачиваешься к ним."}
    ],
    "actions": [
      {
        "id": "c5_yard_water",
        "label": "Взять воду у волонтёра",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_yard_water"}}]},
        "text": "Волонтёр держит коробку на колене, чтобы не ставить на землю. Ты берёшь одну бутылку. Он кивает на следующего, уже не глядя на тебя.",
        "effects": [{"set": "$.c5_yard_water", "value": true}, {"give": "water_15"}]
      },
      {
        "id": "c5_yard_names",
        "label": "Назвать дежурному имя {partner.gen}",
        "minutes": 20,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_yard_names"}}]},
        "text": "Он листает мокрый список. Ты произносишь имя по буквам и называешь свой номер. Дежурный повторяет вслух, чтобы проверить. Обещать ничего не берётся.",
        "effects": [{"set": "$.c5_yard_names", "value": true}]
      },
      {
        "id": "c5_yard_help",
        "label": "Помочь натянуть край тента",
        "minutes": 30,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_yard_help"}}]},
        "text": "Ты держишь верёвку, пока мужчина в каске вяжет узел. Край перестаёт хлопать. Несколько человек под ним наконец опускают плечи.",
        "effects": [{"set": "$.c5_yard_help", "value": true}, {"body": "fatigue", "delta": 4}]
      },
      {
        "id": "c5_yard_news",
        "label": "Выслушать дежурного у ворот",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_yard_news"}}]},
        "text": "— В залы не возвращаться. Даже за вещами. — Дежурный говорит это каждому, кто подходит. — Ночью здесь. Дальше скажут утром. — Он закрывает створку перед следующим вопросом.",
        "effects": [{"set": "$.c5_yard_news", "value": true}, {"learn": "f_c3_messe_closed"}]
      },
      {
        "id": "c5_yard_rest",
        "label": "Устроить подстилку под тентом",
        "minutes": 25,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_yard_rest"}}]},
        "text": "На бетон кладут сухую сторону картона. Ты прижимаешь край рюкзаком, садишься и проверяешь руки. Они дрожат, но слушаются.",
        "effects": [{"set": "$.c5_yard_rest", "value": true}, {"body": "stress", "delta": -5}]
      },
      {
        "id": "c5_yard_food",
        "label": "Получить хлеб на вечерней раздаче",
        "minutes": 30,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_yard_food"}}, {"after": 3900}]},
        "text": "Половина буханки и закрытая банка. На этот раз без ложки. Ты убираешь банку, хлеб ешь маленькими кусками, не отрываясь от прохода.",
        "effects": [{"set": "$.c5_yard_food", "value": true}, {"give": "canned_beans"}, {"body": "hunger", "delta": -20}]
      },
      {"id": "c5_yard_edge", "label": "Проверить край тента у ограды", "minutes": 2, "terminal": true, "goto": "c5_yard_edge", "effects": []},
      {
        "id": "c5_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 3240},
        "effects": [{"sleep": 360}],
        "text": "Под тентом пар от чужого дыхания. Кто-то накрывает фонарь ладонью, чтобы было темнее спать. На бетоне холодно даже через два слоя картона."
      },
      {
        "id": "c5_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c5_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c5_cp", "when": {"all": [{"cp": 4}, {"after": 3660}]}}
    ]
  },
  {
    "id": "c5_yard_edge",
    "for": "any",
    "chapter": "ch3",
    "location": "c3_messe_yard",
    "title": "Ограда",
    "safe": false,
    "text": [
      {"when": {"before": 3240}, "text": "За оградой отъезжает грузовик. Задние фонари освещают мокрые кабели. Потом снова видно только ограду."},
      {
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"before": 3600}]},
        "text": "Ограда по пояс, за ней служебный проезд. Солдат не даёт подходить к воротам, но здесь стоять разрешает."
      },
      {"when": {"all": [{"after": 3600}, {"before": 3900}]}, "text": "Край ограды тёплый только там, где на него падает свет. Ты не прислоняешь к нему лицо."},
      {"when": {"after": 3900}, "text": "Ты отступаешь под край тента. Вода с верёвки капает мимо картонки, в одно и то же место."}
    ],
    "actions": [
      {
        "id": "c5_yard_sit",
        "label": "Сесть под край тента",
        "minutes": 20,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c5_yard_sit"}}]},
        "text": "Отсюда видно вход и не видно залов. Ты кладёшь рюкзак между коленями. Лучше так.",
        "effects": [{"set": "$.c5_yard_sit", "value": true}, {"body": "stress", "delta": -3}]
      },
      {"id": "c5_back", "label": "Вернуться к людям под тентом", "minutes": 2, "terminal": true, "goto": "c5_messe_yard", "effects": []},
      {
        "id": "c5_sleep",
        "label": "Попытаться поспать до рассвета",
        "minutes": 0,
        "repeatable": true,
        "when": {"before": 3240},
        "effects": [{"sleep": 360}],
        "text": "За оградой отъезжает грузовик. Задние фонари освещают мокрые кабели. Потом снова видно только ограду."
      },
      {
        "id": "c5_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c5_go", "label": "Полдень. Связаться", "minutes": 5, "terminal": true, "goto": "c5_cp", "when": {"all": [{"cp": 4}, {"after": 3660}]}}
    ]
  },
  {
    "id": "c5_rattle",
    "for": "any",
    "chapter": "ch3",
    "title": "Ответить у нижней щели",
    "universal": false,
    "text": [
      {"text": "Под дверью курятника скребёт металл. В щель просовывают кружку без ручки. Из неё пахнет горячей водой."},
      {"text": "Кружка цепляет край кирпича. Ты ставишь её ровно двумя пальцами. Снаружи Павел тихо ругается по-польски."}
    ],
    "onEnter": [{"set": "$.c5_rattle.started", "value": true}],
    "actions": [
      {
        "id": "c5_rattle_cloth",
        "label": "Отдать своё полотенце",
        "minutes": 12,
        "terminal": true,
        "goto": "c5_coop",
        "text": "Ты проталкиваешь полотенце под дверь. Павел тянет бережно, чтобы не зацепить кирпич. — Верну, — говорит он. Кружку оставляет тебе.",
        "effects": [{"set": "$.c5_rattle.done", "value": true}, {"set": "$.c5_rattle.result", "value": "cloth"}, {"take": "towel"}, {"npc": "pawel", "trust": 8}],
        "enabled": {"has": "towel"},
        "disabledReason": "Нужные вещи сейчас не при тебе"
      },
      {
        "id": "c5_rattle_call",
        "label": "Позвать Хенрике",
        "minutes": 12,
        "terminal": true,
        "goto": "c5_coop",
        "text": "Хенрике приходит на второй зов. — Опять прятал? Руку сюда. — Павел переступает с ноги на ногу. Ты слышишь, как она разворачивает чистую ткань.",
        "effects": [
          {"set": "$.c5_rattle.done", "value": true},
          {"set": "$.c5_rattle.result", "value": "call"},
          {"npc": "henrike", "trust": 2},
          {"npc": "pawel", "trust": -2},
          {"body": "stress", "delta": 3}
        ]
      },
      {
        "id": "c5_rattle_wait",
        "label": "Попросить чистую ткань у дома",
        "minutes": 20,
        "terminal": true,
        "goto": "c5_coop",
        "text": "Павел ставит ведро и идёт к дому. Возвращается с полоской простыни на ладони. Показывает через щель у петли, как ребёнок. Уже белое.",
        "effects": [{"set": "$.c5_rattle.done", "value": true}, {"set": "$.c5_rattle.result", "value": "wait"}, {"body": "fatigue", "delta": 3}]
      }
    ],
    "location": "farm_coop"
  },
  {
    "id": "c5_thermometer",
    "for": "any",
    "chapter": "ch3",
    "title": "Ответить Хенрике",
    "universal": false,
    "text": [
      {"text": "Засов сдвигается на ладонь. Хенрике держит градусник и смотрит на тебя из-под поднятого воротника. — Рука. Потом лоб."},
      {"text": "Она просит повернуть кисти. Смотрит между пальцами, под рукавом, снова на лицо. Градусник ещё у неё в кармане."}
    ],
    "onEnter": [{"set": "$.c5_thermometer.started", "value": true}],
    "actions": [
      {
        "id": "c5_thermometer_ask",
        "label": "Спросить про срок",
        "minutes": 8,
        "combinable": true,
        "when": {"not": {"flag": "$.c5_thermometer.asked"}},
        "text": "— Не часы лечат, — говорит Хенрике. — Смотрю, меняется ли. — Она вынимает прибор и протирает его тканью. — Чтобы ты {m:вышел|вышла} отсюда и завалился у меня на кухне, — отвечает она. Потом поправляется: — Чтоб никто. — Засов в её руке скрипит.",
        "effects": [{"set": "$.c5_thermometer.asked", "value": true}]
      },
      {
        "id": "c5_thermometer_honest",
        "label": "Рассказать обо всех симптомах",
        "minutes": 12,
        "terminal": true,
        "goto": "c5_coop",
        "text": "Ты вспоминаешь даже то, что хотелось забыть. Хенрике кивает и ставит воду ближе к порогу. — Так и говори. Без героизма.",
        "effects": [{"set": "$.c5_thermometer.done", "value": true}, {"set": "$.c5_thermometer.result", "value": "honest"}, {"npc": "henrike", "trust": 6}]
      },
      {
        "id": "c5_thermometer_doctor",
        "label": "Попросить другого осмотреть рану",
        "minutes": 12,
        "terminal": true,
        "goto": "c5_coop",
        "text": "Хенрике убирает прибор. — Есть у нас врач? — спрашивает она в сторону двора. Никто не отвечает. Она ждёт ещё, уже без тебя.",
        "effects": [{"set": "$.c5_thermometer.done", "value": true}, {"set": "$.c5_thermometer.result", "value": "doctor"}, {"body": "stress", "delta": 7}]
      },
      {
        "id": "c5_thermometer_privacy",
        "label": "Отказаться показывать тело",
        "minutes": 12,
        "terminal": true,
        "goto": "c5_coop",
        "text": "Ты опускаешь рукав. Хенрике смотрит секунду, другую. — Тогда дверь закрыта. — Засов возвращается в паз без удара.",
        "effects": [
          {"set": "$.c5_thermometer.done", "value": true},
          {"set": "$.c5_thermometer.result", "value": "privacy"},
          {"npc": "henrike", "trust": -8},
          {"set": "$.c3_check_refused", "value": true}
        ]
      }
    ],
    "location": "farm_coop"
  },
  {
    "id": "c5_stairs",
    "for": "any",
    "chapter": "ch3",
    "title": "Прислушаться к лестнице",
    "universal": false,
    "text": [
      {"text": "На лестнице падает что-то стеклянное. Женский голос снизу зовёт на помощь, но не поднимается к твоей двери."},
      {"text": "— Я с первого, — отвечает женщина. — Бутыль уронила. Нога. — Она втягивает воздух сквозь зубы."}
    ],
    "onEnter": [{"set": "$.c5_stairs.started", "value": true}],
    "actions": [
      {
        "id": "c5_stairs_bandage",
        "label": "Передать чистую перевязку",
        "minutes": 12,
        "terminal": true,
        "goto": "c5_aflat",
        "text": "Ты протягиваешь бинт через перила, не спускаясь в воду. Женщина перевязывает пятку поверх носка. — Спасибо, — говорит она в стену.",
        "effects": [{"set": "$.c5_stairs.done", "value": true}, {"set": "$.c5_stairs.result", "value": "bandage"}, {"use": "dressing"}, {"set": "$.c3_neighbor_helped", "value": true}],
        "enabled": {"hasTag": "dressing"},
        "disabledReason": "Нужные вещи сейчас не при тебе"
      },
      {
        "id": "c5_stairs_broom",
        "label": "Расчистить сухой проход",
        "minutes": 20,
        "terminal": true,
        "goto": "c5_aflat",
        "text": "Ты выметаешь стекло от верхней ступеньки вниз. Женщина идёт вдоль стены за твоей спиной. Метёлку потом оставляешь снаружи.",
        "effects": [{"set": "$.c5_stairs.done", "value": true}, {"set": "$.c5_stairs.result", "value": "broom"}, {"body": "fatigue", "delta": 5}]
      },
      {
        "id": "c5_stairs_closed",
        "label": "Остаться за дверью",
        "minutes": 12,
        "terminal": true,
        "goto": "c5_aflat",
        "text": "Ты говоришь, где лежит старый веник у выхода. Женщина отвечает «знаю» и замолкает. Через минуту слышно, как она волочит тапочку вниз.",
        "effects": [{"set": "$.c5_stairs.done", "value": true}, {"set": "$.c5_stairs.result", "value": "closed"}, {"body": "stress", "delta": 6}]
      }
    ],
    "location": "a_flat"
  },
  {
    "id": "c5_tap",
    "for": "any",
    "chapter": "ch3",
    "title": "Проверить стук в трубе",
    "universal": false,
    "text": [
      {"text": "В кухонной трубе грохот и свист. Из крана вылетает бурый плевок, потом ещё один. Снизу кто-то кричит закрыть воду."},
      {"text": "Ручка тугая. Ты берёшься через полотенце и поворачиваешь понемногу. Шум остаётся в стене."}
    ],
    "onEnter": [{"set": "$.c5_tap.started", "value": true}],
    "actions": [
      {
        "id": "c5_tap_give",
        "label": "Передать закрытую бутылку",
        "minutes": 12,
        "terminal": true,
        "goto": "c5_aflat",
        "text": "Ты привязываешь свою бутылку вместо пустой и медленно спускаешь. Внизу придерживают обеими руками. Верёвка возвращается уже без груза.",
        "effects": [{"set": "$.c5_tap.done", "value": true}, {"set": "$.c5_tap.result", "value": "give"}, {"take": "water_15"}, {"set": "$.c3_water_shared", "value": true}],
        "enabled": {"has": "water_15"},
        "disabledReason": "Нужные вещи сейчас не при тебе"
      },
      {
        "id": "c5_tap_plumbing",
        "label": "Помочь перекрыть подвал",
        "minutes": 25,
        "terminal": true,
        "goto": "c5_aflat",
        "text": "Ты спускаешься только до наружного люка. Сосед показывает нужный вентиль. Вдвоём хватает силы. В трубе наконец стихает свист.",
        "effects": [
          {"set": "$.c5_tap.done", "value": true},
          {"set": "$.c5_tap.result", "value": "plumbing"},
          {"body": "fatigue", "delta": 7},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c5_tap_save",
        "label": "Оставить воду своим",
        "minutes": 12,
        "terminal": true,
        "goto": "c5_aflat",
        "text": "Ты качаешь головой в окно. Сосед снимает верёвку, стараясь не смотреть вверх. Вода под краном уже прозрачнее, но пить её ты не пробуешь.",
        "effects": [{"set": "$.c5_tap.done", "value": true}, {"set": "$.c5_tap.result", "value": "save"}, {"body": "stress", "delta": 5}]
      }
    ],
    "location": "a_flat"
  },
  {
    "id": "c5_rollers",
    "for": "any",
    "chapter": "ch3",
    "title": "Проверить ворота",
    "universal": false,
    "text": [
      {"text": "Створка ворот поднимается снизу на ладонь. В щели чужие пальцы и конец железного прута. Снаружи спрашивают, есть ли кто."},
      {"text": "— Домкрат нужен, — говорят снаружи. — Машину на выезде бросили, люди не проходят. — Прут перестаёт двигаться."}
    ],
    "onEnter": [{"set": "$.c5_rollers.started", "value": true}],
    "actions": [
      {
        "id": "c5_rollers_ask",
        "label": "Попросить показать руки",
        "minutes": 8,
        "combinable": true,
        "when": {"not": {"flag": "$.c5_rollers.asked"}},
        "text": "Перчатки кладут на землю перед щелью. Ладони в мозолях, на одном пальце синяя изолента. Руку дальше не просовывают. Мужчина сидит на корточках снаружи. Прут уже лежит поперёк коленей. — Не заберу, верну, — говорит он. Ты видишь только рот.",
        "effects": [{"set": "$.c5_rollers.asked", "value": true}]
      },
      {
        "id": "c5_rollers_lend",
        "label": "Дать домкрат через щель",
        "minutes": 12,
        "terminal": true,
        "goto": "c5_workshop",
        "text": "Домкрат проходит боком. Мужчина прижимает его к груди и уходит к выезду. Рукоятку ты оставляешь у себя до его возвращения.",
        "effects": [
          {"set": "$.c5_rollers.done", "value": true},
          {"set": "$.c5_rollers.result", "value": "lend"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": [{"set": "w.c3_jack_lent", "value": true}]},
          {"body": "stress", "delta": 3}
        ]
      },
      {
        "id": "c5_rollers_help",
        "label": "Помочь с машиной у выезда",
        "minutes": 30,
        "terminal": true,
        "goto": "c5_workshop",
        "text": "Ты работаешь с одной стороны машины, они с другой. «Гольф» сходит с колеса и тяжело катится к обочине. Мужчина возвращает прут под ворота вместе с домкратом.",
        "effects": [
          {"set": "$.c5_rollers.done", "value": true},
          {"set": "$.c5_rollers.result", "value": "help"},
          {"body": "fatigue", "delta": 7},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c5_rollers_refuse",
        "label": "Оставить ворота закрытыми",
        "minutes": 12,
        "terminal": true,
        "goto": "c5_workshop",
        "text": "Ты говоришь, что инструмент чужой. Мужчина долго сидит у щели. Потом надевает перчатки и вытаскивает прут. Створка ложится на бетон.",
        "effects": [{"set": "$.c5_rollers.done", "value": true}, {"set": "$.c5_rollers.result", "value": "refuse"}, {"body": "stress", "delta": 5}]
      }
    ],
    "location": "deniz_workshop"
  },
  {
    "id": "c5_spark",
    "for": "any",
    "chapter": "ch3",
    "title": "Разобраться с запахом бензина",
    "universal": false,
    "text": [
      {"text": "От стены с полками резко пахнет бензином. Под старым зарядным устройством разливается лужица. Шнур уходит в тёмный удлинитель."},
      {"text": "Удлинитель воткнут в стену. Лампочка не горит, но это ещё не значит, что напряжения нет. Ты ищешь щиток."}
    ],
    "onEnter": [{"set": "$.c5_spark.started", "value": true}],
    "actions": [
      {
        "id": "c5_spark_sand",
        "label": "Засыпать разлив песком",
        "minutes": 20,
        "terminal": true,
        "goto": "c5_workshop",
        "text": "Ты приносишь песок из ведра у ворот. Засыпаешь от краёв к середине и собираешь всё в металлический поддон. Запах остаётся на рукавах.",
        "effects": [
          {"set": "$.c5_spark.done", "value": true},
          {"set": "$.c5_spark.result", "value": "sand"},
          {"body": "fatigue", "delta": 5},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c5_spark_air",
        "label": "Открыть бокс и проветрить",
        "minutes": 25,
        "terminal": true,
        "goto": "c5_workshop",
        "text": "Ты поднимаешь ворота выше колен. Снаружи видно весь пол и твою обувь. Воздух понемногу выносит запах в промзону.",
        "effects": [
          {"set": "$.c5_spark.done", "value": true},
          {"set": "$.c5_spark.result", "value": "air"},
          {"body": "stress", "delta": 7},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c5_spark_backroom",
        "label": "Уйти в заднюю комнату",
        "minutes": 12,
        "terminal": true,
        "goto": "c5_workshop",
        "text": "Ты закрываешь внутреннюю дверь и подкладываешь под неё тряпку. Бутылка остаётся на поддоне. Спать в боксе теперь не хочется.",
        "effects": [
          {"set": "$.c5_spark.done", "value": true},
          {"set": "$.c5_spark.result", "value": "backroom"},
          {"body": "stress", "delta": 10},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      }
    ],
    "location": "deniz_workshop"
  },
  {
    "id": "c5_merle",
    "for": "any",
    "chapter": "ch3",
    "title": "Проверить, почему Мерле не встаёт",
    "universal": false,
    "text": [
      {"text": "Биргит зовёт Мерле к столу третий раз. Из комнаты никто не отвечает. На лестнице лежит открытый чехол от прибора."},
      {"text": "Она открывает на ширину лица. Волосы прилипли ко лбу. В руке прибор с незастёгнутым ремешком."}
    ],
    "onEnter": [{"set": "$.c5_merle.started", "value": true}],
    "actions": [
      {
        "id": "c5_merle_ask",
        "label": "Спросить про сахар",
        "minutes": 8,
        "combinable": true,
        "when": {"not": {"flag": "$.c5_merle.asked"}},
        "text": "Она смотрит на экран и не поворачивает его к тебе. — Проверяла, — говорит. Биргит стоит на нижней ступеньке. Ты подставляешь стул. Мерле садится мимо подушки и тихо смеётся. На этот раз никто не улыбается в ответ.",
        "effects": [{"set": "$.c5_merle.asked", "value": true}]
      },
      {
        "id": "c5_merle_stay",
        "label": "Остаться до повторного измерения",
        "minutes": 25,
        "terminal": true,
        "goto": "c5_ahr",
        "text": "Ты ждёшь рядом, пока Мерле пьёт сок и снова проверяет сахар. Руки больше не дрожат. — Ладно, — говорит она. — Завтрак отменять глупо.",
        "effects": [
          {"set": "$.c5_merle.done", "value": true},
          {"set": "$.c5_merle.result", "value": "stay"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": [{"npc": "merle", "trust": 6, "set": {"c3_checked": true}}]},
          {"body": "stress", "delta": 3}
        ]
      },
      {
        "id": "c5_merle_mother",
        "label": "Позвать Биргит и уступить место",
        "minutes": 12,
        "terminal": true,
        "goto": "c5_ahr",
        "text": "Биргит садится рядом с дочерью. Мерле морщится, но прибор отдаёт ей. Ты закрываешь дверь не до конца. За ней наконец начинают разговаривать.",
        "effects": [{"set": "$.c5_merle.done", "value": true}, {"set": "$.c5_merle.result", "value": "mother"}, {"npc": "birgit", "trust": 5}, {"npc": "merle", "trust": -2}]
      },
      {
        "id": "c5_merle_respect",
        "label": "Оставить сок и выйти",
        "minutes": 12,
        "terminal": true,
        "goto": "c5_ahr",
        "text": "Ты ставишь сок на тумбочку и выходишь. Мерле благодарит уже в закрытую дверь. На лестнице Уве смотрит на тебя, не задавая вопроса.",
        "effects": [{"set": "$.c5_merle.done", "value": true}, {"set": "$.c5_merle.result", "value": "respect"}, {"body": "stress", "delta": 5}]
      }
    ],
    "location": "ahrensburg"
  },
  {
    "id": "c5_socket",
    "for": "any",
    "chapter": "ch3",
    "title": "Подойти к Уве в гараже",
    "universal": false,
    "text": [
      {"text": "В гараже хлопает автомат. Уве держит белый провод за вилку, Биргит зовёт его по имени так, будто он снова полез на крышу."},
      {"text": "— Контакт, — говорит он. Вилка у него в руке подплавлена с одной стороны. Он поворачивает её обугленным боком вниз."}
    ],
    "onEnter": [{"set": "$.c5_socket.started", "value": true}],
    "actions": [
      {
        "id": "c5_socket_cook",
        "label": "Помочь Биргит готовить",
        "minutes": 30,
        "terminal": true,
        "goto": "c5_ahr",
        "text": "Ты режешь и подаёшь, Биргит ставит первую кастрюлю на плиту. Уве отходит от морозильника только на запах. В руках у него всё ещё вилка.",
        "effects": [
          {"set": "$.c5_socket.done", "value": true},
          {"set": "$.c5_socket.result", "value": "cook"},
          {"npc": "birgit", "trust": 5},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []},
          {"body": "fatigue", "delta": 4}
        ]
      },
      {
        "id": "c5_socket_repair",
        "label": "Помочь Уве обесточить гараж",
        "minutes": 25,
        "terminal": true,
        "goto": "c5_ahr",
        "text": "Ты держишь фонарь, пока Уве снимает розетку. Обгоревший контакт рассыпается на газете. — Больше не включать, — говорит он Биргит. На этот раз она кивает.",
        "effects": [
          {"set": "$.c5_socket.done", "value": true},
          {"set": "$.c5_socket.result", "value": "repair"},
          {"npc": "uwe", "trust": 6},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []},
          {"body": "fatigue", "delta": 4}
        ]
      },
      {
        "id": "c5_socket_ice",
        "label": "Освободить место в холодильнике",
        "minutes": 20,
        "terminal": true,
        "goto": "c5_ahr",
        "text": "Ты вынимаешь закрытые бутылки и ставишь в таз. Для мяса освобождается нижняя полка. Инсулин остаётся наверху, в своей коробке.",
        "effects": [
          {"set": "$.c5_socket.done", "value": true},
          {"set": "$.c5_socket.result", "value": "ice"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []},
          {"npc": "merle", "trust": 2}
        ]
      }
    ],
    "location": "ahrensburg"
  },
  {
    "id": "c5_curtain",
    "for": "any",
    "chapter": "ch3",
    "title": "Позвать медсестру к ширме",
    "universal": false,
    "text": [
      {"text": "За ширмой падает стул. Медсестра держит край ткани и зовёт второго медика. Из-за ткани тянут её рукав."},
      {"text": "Солдат от входа сначала не понимает, куда смотреть. Ты указываешь на ширму. Он берёт рацию с груди."}
    ],
    "onEnter": [{"set": "$.c5_curtain.started", "value": true}],
    "actions": [
      {
        "id": "c5_curtain_space",
        "label": "Освободить место медикам",
        "minutes": 12,
        "terminal": true,
        "goto": "c5_q",
        "text": "Ты оттаскиваешь тележку к стене. Медики выводят человека через освободившуюся дверь. Его ноги скользят по полу, носками внутрь.",
        "effects": [{"set": "$.c5_curtain.done", "value": true}, {"set": "$.c5_curtain.result", "value": "space"}, {"body": "fatigue", "delta": 5}, {"set": "$.messe_exit", "value": true}]
      },
      {
        "id": "c5_curtain_gloves",
        "label": "Предложить свои перчатки",
        "minutes": 12,
        "terminal": true,
        "goto": "c5_q",
        "text": "Ты раскрываешь упаковку, не касаясь внутренней стороны. Медсестра берёт новые перчатки и прячет дрожащие пальцы. Благодарит только кивком.",
        "effects": [{"set": "$.c5_curtain.done", "value": true}, {"set": "$.c5_curtain.result", "value": "gloves"}, {"take": "nitrile_gloves", "qty": 2}],
        "enabled": {"has": "nitrile_gloves", "qty": 2},
        "disabledReason": "Нужные вещи сейчас не при тебе"
      },
      {
        "id": "c5_curtain_cot",
        "label": "Вернуться к своей койке",
        "minutes": 12,
        "terminal": true,
        "goto": "c5_q",
        "text": "Ты садишься, не снимая обуви. Рядом освобождается место, куда раньше нельзя было пройти. Солдат перестаёт смотреть на вход и смотрит в зал.",
        "effects": [{"set": "$.c5_curtain.done", "value": true}, {"set": "$.c5_curtain.result", "value": "cot"}, {"body": "stress", "delta": 10}]
      }
    ],
    "location": "messe_q"
  },
  {
    "id": "c5_bracelet",
    "for": "any",
    "chapter": "ch3",
    "title": "Выслушать соседку с браслетом",
    "universal": false,
    "text": [
      {"text": "Соседка пытается снять красный браслет зубами. Пластик не поддаётся. Она смотрит на дверь в общий зал."},
      {"text": "В общем зале её муж. Он не может сам ходить к кухне. Она показывает на дверь, не на рану."}
    ],
    "onEnter": [{"set": "$.c5_bracelet.started", "value": true}],
    "actions": [
      {
        "id": "c5_bracelet_message",
        "label": "Попросить проведать её мужа",
        "minutes": 20,
        "terminal": true,
        "goto": "c5_q",
        "text": "Ты передаёшь номер койки и объясняешь про еду. Медсестра записывает на бумаге, отдельно от осмотров. Соседка перестаёт дёргать браслет.",
        "effects": [{"set": "$.c5_bracelet.done", "value": true}, {"set": "$.c5_bracelet.result", "value": "message"}, {"body": "stress", "delta": 3}]
      },
      {
        "id": "c5_bracelet_report",
        "label": "Сказать о попытке уйти",
        "minutes": 12,
        "terminal": true,
        "goto": "c5_q",
        "text": "Медсестра приседает возле соседки. Они говорят тихо, потом браслет меняют на более свободный. На тебя соседка не смотрит.",
        "effects": [{"set": "$.c5_bracelet.done", "value": true}, {"set": "$.c5_bracelet.result", "value": "report"}, {"body": "stress", "delta": 7}]
      },
      {
        "id": "c5_bracelet_silent",
        "label": "Оставить разговор при себе",
        "minutes": 12,
        "terminal": true,
        "goto": "c5_q",
        "text": "Ты спрашиваешь у медсестры только про воду. Когда возвращаешься, соседка уже лежит лицом к стене. Браслет закрыт рукавом.",
        "effects": [{"set": "$.c5_bracelet.done", "value": true}, {"set": "$.c5_bracelet.result", "value": "silent"}]
      }
    ],
    "location": "messe_q"
  },
  {
    "id": "c5_cart",
    "for": "any",
    "chapter": "ch3",
    "title": "Проверить тележку у укрытия",
    "universal": false,
    "text": [
      {"text": "В укрытие вкатывается детская тележка с двумя канистрами. Следом женщина тянет её за сломанное крепление. Одно колесо волочится."},
      {"text": "Она показывает рукой за угол. Не город, не улицу. Просто угол. Другой рукой всё ещё держит тележку."}
    ],
    "onEnter": [{"set": "$.c5_cart.started", "value": true}],
    "actions": [
      {
        "id": "c5_cart_fix",
        "label": "Помочь закрепить колесо",
        "minutes": 20,
        "terminal": true,
        "goto": "c5_out",
        "text": "Ты разгибаешь проволоку и просовываешь её обратно. Колесо всё ещё косит, но крутится. Женщина проезжает три шага и пробует снова, уже сама.",
        "effects": [{"set": "$.c5_cart.done", "value": true}, {"set": "$.c5_cart.result", "value": "fix"}, {"body": "fatigue", "delta": 5}]
      },
      {
        "id": "c5_cart_carry",
        "label": "Отнести одну канистру до угла",
        "minutes": 25,
        "terminal": true,
        "goto": "c5_out",
        "text": "Ручка врезается в ладонь. За углом вход во двор, там уже ждут с пустыми кастрюлями. Ты ставишь канистру и сразу идёшь к своим вещам.",
        "effects": [{"set": "$.c5_cart.done", "value": true}, {"set": "$.c5_cart.result", "value": "carry"}, {"body": "fatigue", "delta": 7}]
      },
      {
        "id": "c5_cart_space",
        "label": "Дать ей передохнуть и остаться рядом",
        "minutes": 15,
        "terminal": true,
        "goto": "c5_out",
        "text": "Ты двигаешь рюкзак к ногам и садишься у выхода. Женщина держит канистру между коленями. Через четверть часа снова берётся за тележку.",
        "effects": [{"set": "$.c5_cart.done", "value": true}, {"set": "$.c5_cart.result", "value": "space"}, {"body": "stress", "delta": -2}]
      }
    ]
  },
  {
    "id": "c5_glass",
    "for": "any",
    "chapter": "ch3",
    "title": "Посмотреть, кто у прохода",
    "universal": false,
    "text": [
      {"text": "У прохода стоит человек с фонариком, хотя уже светло. Светит под машины и зовёт кого-то шёпотом. Не уходит."},
      {"text": "Человек повторяет одну кличку. Потом свистит коротко, в два пальца. Под машиной тихо мяукает кошка."}
    ],
    "onEnter": [{"set": "$.c5_glass.started", "value": true}],
    "actions": [
      {
        "id": "c5_glass_food",
        "label": "Оставить кошке немного еды",
        "minutes": 12,
        "terminal": true,
        "goto": "c5_out",
        "text": "Ты кладёшь еду у переднего колеса и отходишь. Кошка вылезает не сразу, припадая к земле. Мужчина гасит фонарь, когда видит её целиком.",
        "effects": [{"set": "$.c5_glass.done", "value": true}, {"set": "$.c5_glass.result", "value": "food"}, {"take": "canned_beans"}],
        "enabled": {"has": "canned_beans"},
        "disabledReason": "Нужные вещи сейчас не при тебе"
      },
      {
        "id": "c5_glass_distance",
        "label": "Показать, откуда слышен кот",
        "minutes": 12,
        "terminal": true,
        "goto": "c5_out",
        "text": "Ты показываешь на второе колесо, не выходя к нему. Мужчина кивает, ложится на бок прямо в грязь. Свет теперь лежит под машиной.",
        "effects": [{"set": "$.c5_glass.done", "value": true}, {"set": "$.c5_glass.result", "value": "distance"}, {"body": "stress", "delta": 3}]
      },
      {
        "id": "c5_glass_leave",
        "label": "Перенести вещи в дальний угол",
        "minutes": 15,
        "terminal": true,
        "goto": "c5_out",
        "text": "Ты поднимаешь рюкзак и проходишь за стену. Отсюда человека не видно. Свет фонаря остаётся узкой полоской на земле.",
        "effects": [{"set": "$.c5_glass.done", "value": true}, {"set": "$.c5_glass.result", "value": "leave"}, {"body": "fatigue", "delta": 4}]
      }
    ]
  }
];

export const morning12Events: WorldEvent[] = [
  ...messe5Events,
  ...north5Events,
  ...farm5Events,
  ...bflat5Events,
  {
    "id": "ev_c5_rattle",
    "at": 3350,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3350}, {"before": 3710}, {"all": [{"npc": "pawel", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c5_rattle.done"}}]}, {"at": "farm_coop"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Под дверью курятника скребёт металл. В щель просовывают кружку без ручки. Из неё пахнет горячей водой."}]
  },
  {
    "id": "ev_c5_thermometer",
    "at": 3520,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3520}, {"before": 3710}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}, {"not": {"flag": "$.c5_thermometer.done"}}]}, {"at": "farm_coop"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Засов сдвигается на ладонь. Хенрике держит градусник и смотрит на тебя из-под поднятого воротника. — Рука. Потом лоб."}]
  },
  {
    "id": "ev_c5_stairs",
    "at": 3365,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3365}, {"before": 3710}, {"all": []}, {"not": {"flag": "$.c5_stairs.done"}}]}, {"any": [{"at": "a_flat"}, {"at": "a_stairs"}]}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "На лестнице падает что-то стеклянное. Женский голос снизу зовёт на помощь, но не поднимается к твоей двери."}]
  },
  {
    "id": "ev_c5_tap",
    "at": 3505,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3505}, {"before": 3710}, {"all": []}, {"not": {"flag": "$.c5_tap.done"}}]}, {"any": [{"at": "a_flat"}, {"at": "a_stairs"}]}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "В кухонной трубе грохот и свист. Из крана вылетает бурый плевок, потом ещё один. Снизу кто-то кричит закрыть воду."}]
  },
  {
    "id": "ev_c5_rollers",
    "at": 3375,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3375}, {"before": 3710}, {"all": []}, {"not": {"flag": "$.c5_rollers.done"}}]}, {"at": "deniz_workshop"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Створка ворот поднимается снизу на ладонь. В щели чужие пальцы и конец железного прута. Снаружи спрашивают, есть ли кто."}]
  },
  {
    "id": "ev_c5_spark",
    "at": 3545,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3545}, {"before": 3710}, {"all": []}, {"not": {"flag": "$.c5_spark.done"}}]}, {"at": "deniz_workshop"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "От стены с полками резко пахнет бензином. Под старым зарядным устройством разливается лужица. Шнур уходит в тёмный удлинитель."}]
  },
  {
    "id": "ev_c5_merle",
    "at": 3345,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3345}, {"before": 3710}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}, {"not": {"flag": "$.c5_merle.done"}}]}, {"at": "ahrensburg"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Биргит зовёт Мерле к столу третий раз. Из комнаты никто не отвечает. На лестнице лежит открытый чехол от прибора."}]
  },
  {
    "id": "ev_c5_socket",
    "at": 3510,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3510}, {"before": 3710}, {"all": [{"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]}, {"not": {"flag": "$.c5_socket.done"}}]}, {"at": "ahrensburg"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "В гараже хлопает автомат. Уве держит белый провод за вилку, Биргит зовёт его по имени так, будто он снова полез на крышу."}]
  },
  {
    "id": "ev_c5_curtain",
    "at": 3370,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3370}, {"before": 3710}, {"all": []}, {"not": {"flag": "$.c5_curtain.done"}}]}, {"at": "messe_q"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "За ширмой падает стул. Медсестра держит край ткани и зовёт второго медика. Из-за ткани тянут её рукав."}]
  },
  {
    "id": "ev_c5_bracelet",
    "at": 3565,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3565}, {"before": 3710}, {"all": []}, {"not": {"flag": "$.c5_bracelet.done"}}]}, {"at": "messe_q"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Соседка пытается снять красный браслет зубами. Пластик не поддаётся. Она смотрит на дверь в общий зал."}]
  },
  {
    "id": "ev_c5_cart",
    "at": 3405,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3405}, {"before": 3710}, {"all": []}, {"not": {"flag": "$.c5_cart.done"}}]}, {"scene": "c5_out"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "В укрытие вкатывается детская тележка с двумя канистрами. Следом женщина тянет её за сломанное крепление. Одно колесо волочится."}]
  },
  {
    "id": "ev_c5_glass",
    "at": 3570,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 4}, {"not": {"cp": 5}}, {"after": 3570}, {"before": 3710}, {"all": []}, {"not": {"flag": "$.c5_glass.done"}}]}, {"scene": "c5_out"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "У прохода стоит человек с фонариком, хотя уже светло. Светит под машины и зовёт кого-то шёпотом. Не уходит."}]
  }
];
