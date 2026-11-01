import type { Scene, WorldEvent } from '../../engine/content-types';

// 12 ноября: день и вечер.
export const afternoon12Scenes: Scene[] = [
  {
    "id": "c6_farm",
    "for": "any",
    "chapter": "ch3",
    "location": "hof_luedemann",
    "title": "Хутор",
    "safe": true,
    "text": [
      {
        "when": {"all": [{"before": 3240}, {"npc": "henrike", "at": "hof_luedemann", "alive": true}]},
        "text": "У печки сохнут две пары сапог. Хенрике переворачивает подошвой к огню только свои. Из сарая один раз кашляет Павел."
      },
      {
        "when": {"all": [{"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"before": 3600}]}, {"npc": "henrike", "at": "hof_luedemann", "alive": true}]},
        "text": "На крыльце стоят вымытые вёдра, ручками в одну сторону. С вечера ничего не исчезло. Хенрике сдвигает миски, чтобы хватило места локтям. — По местам. День короткий."
      },
      {
        "when": {"all": [{"all": [{"after": 3600}, {"before": 3900}]}, {"npc": "henrike", "at": "hof_luedemann", "alive": true}]},
        "text": "На крыльце сохнут вёдра. Керем носит их ручками к стене, чтобы никто не цеплялся. Хенрике проверяет каждый взглядом."
      },
      {"when": {"after": 3900}, "text": "Кухонное окно закрыто одеялом. За ним ходят тени, звякают ложки. Во дворе слышно, как цепь колодца ложится на мокрый борт."},
      {"when": {"flag": "proj.c3_fence.done"}, "text": "Поперечина лежит в скобах. Оле проверяет её плечом и оставляет на месте."},
      {"when": {"flag": "proj.c3_pump.done"}, "text": "У колодца слышен ровный скрип ручного насоса. Вёдра наполняются быстрее."},
      {
        "when": {"v": "base.c3_farm.shortDays", "op": ">=", "value": 1},
        "text": "Хенрике кладёт на стол маленький половник вместо большого. Никто не спрашивает зачем."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_spilled.result", "op": "==", "value": "dress"}, {"all": [{"npc": "pawel", "alive": true, "at": "hof_luedemann"}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]}, {"before": 3780}]},
        "text": "Павел пробует согнуть пальцы под твоей повязкой. — Письмо смогу, — говорит он. Ведро Хенрике ему не даёт."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_spilled.result", "op": "==", "value": "carry"}, {"all": [{"npc": "pawel", "alive": true, "at": "hof_luedemann"}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]}, {"before": 3780}]},
        "text": "У двери стоят принесённые тобой вёдра. Павел поднимается тебе навстречу; на ладони снова открывается рана."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_spilled.result", "op": "==", "value": "chain"}, {"all": [{"npc": "pawel", "alive": true, "at": "hof_luedemann"}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]}, {"before": 3780}]},
        "text": "Верёвка тянется вместо цепи. Оле пробует её всем весом и кивает: — Держит. Павел прячет ладонь от него."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_bread.result", "op": "==", "value": "own"}, {"all": [{"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "kerem", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]}, {"before": 3780}]},
        "text": "Керем ломает твои хлебцы пополам. Одну половину несёт в сарай, другую оставляет на своей тарелке."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_bread.result", "op": "==", "value": "explain"}, {"all": [{"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "kerem", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]}, {"before": 3780}]},
        "text": "Оле ест отдельно, у окна. Керем спрашивает тебя, можно ли поговорить без него."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_bread.result", "op": "==", "value": "rule"}, {"all": [{"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "kerem", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]}, {"before": 3780}]},
        "text": "Керем забирает сумку из кухни. Дениз ловит его за локоть; брат высвобождает руку."
      },
      {
        "when": {"all": [{"v": "$.c6_visitor.result", "op": "==", "value": "exchange"}, {"all": [{"npc": "c3_koehler", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "Кёлер отряхивает пустой мешок у кухни. Восемь поленьев увезены; Хенрике потрогала плечо гостьи, останавливая перед уходом."
      },
      {
        "when": {"all": [{"v": "$.c6_visitor.result", "op": "==", "value": "inspect"}, {"all": [{"npc": "c3_koehler", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "Кёлер опускает рукава после осмотра. — Теперь можно спросить про ночь? — говорит она Хенрике."
      },
      {
        "when": {"all": [{"v": "$.c6_visitor.result", "op": "==", "value": "no"}, {"all": [{"npc": "c3_koehler", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "Кёлер остаётся у тележки. Хенрике закрывает перед Оле дверь кухни: — Я сама выйду."
      },
      {
        "when": {"all": [{"v": "$.c6_rope.result", "op": "==", "value": "fuel"}, {"all": [{"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "Рация коротко хрипит. Оле узнаёт голос и отворачивается от всех, прижав её к уху."
      },
      {
        "when": {"all": [{"v": "$.c6_rope.result", "op": "==", "value": "contacts"}, {"all": [{"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "Дениз нажимает кнопку; лампочка загорается и гаснет. — Провод цел. Бензин из провода пока не делаю."
      },
      {
        "when": {"all": [{"v": "$.c6_rope.result", "op": "==", "value": "keep"}, {"all": [{"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "Оле убирает мёртвую рацию во внутренний карман. Ключи от машины остаются у тебя."
      },
      {"when": {"v": "$.c6_visitor.result", "op": "==", "value": "night"}, "text": "Кёлер ждёт твоего разговора с хозяйкой. С тележки она пока не снимает мешок."},
      {
        "when": {"v": "w.c3_trip5", "op": "==", "value": "relieve"},
        "text": "Павел спит у печки. Хенрике показывает на два пустых ведра. — Договорились. До ужина ваши. — Ты берёшь ручки, пока он не проснулся."
      },
      {
        "when": {"all": [{"npc": "pawel", "alive": true, "at": "hof_luedemann"}, {"npcVar": "pawel", "key": "c3_rest_hand"}]},
        "text": "Павел привязал ложку к ладони полосой ткани. — Так держится, — говорит он. Верёвку колодца сегодня не берёт."
      },
      {
        "when": {"all": [{"npc": "pawel", "alive": true, "at": "hof_luedemann"}, {"npcVar": "pawel", "key": "c3_hand_treated"}]},
        "text": "Павел снимает повязку только у таза. — В Щецине бы уже велели лежать, — говорит он. Хенрике молча показывает на скамейку."
      },
      {
        "when": {"not": {"npc": "henrike", "at": "hof_luedemann", "alive": true}},
        "text": "На кухне свободен стул у края стола. Ты оставляешь на нём вещи, чтобы не занимать чужую миску."
      }
    ],
    "actions": [
      {
        "id": "c6_partner_supper",
        "label": "Поесть рядом с {partner.ins}",
        "minutes": 30,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_partner_supper"}}, {"flag": "w.together"}]},
        "text": "{partner} ждёт, пока ты сядешь. Ложки разные, миски тоже. Вы меняетесь местами: с твоей стороны меньше дует.",
        "effects": [{"set": "$.c6_partner_supper", "value": true}, {"body": "hunger", "delta": -22}, {"body": "stress", "delta": -6}]
      },
      {
        "id": "c6_dry_socks",
        "label": "Отдать Павлу сухое полотенце",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_dry_socks"}}, {"all": [{"npc": "pawel", "alive": true, "at": "hof_luedemann"}, {"has": "towel"}]}]},
        "text": "Павел отказывается, потом показывает сапог: внутри вода. Ты отдаёшь полотенце для ног. — До дома бы в сухом, — говорит он. Мокрые носки складывает аккуратно на ступеньке.",
        "effects": [{"set": "$.c6_dry_socks", "value": true}, {"take": "towel"}, {"npc": "pawel", "trust": 7}]
      },
      {
        "id": "c6_ole_supper",
        "label": "Позвать Оле к ужину",
        "minutes": 12,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_ole_supper"}}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}]},
        "text": "— Потом. — Он не оборачивается. Ты ставишь миску на столб. Через минуту ложка негромко стукает по краю; к кухне он всё-таки не идёт.",
        "effects": [{"set": "$.c6_ole_supper", "value": true}, {"npc": "ole", "trust": 3}]
      },
      {
        "id": "c6_shift_pawel",
        "label": "Сменить Павла у воды",
        "minutes": 40,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_shift_pawel"}}, {"npc": "pawel", "alive": true, "at": "hof_luedemann"}]},
        "text": "Павел держит ведро здоровой рукой. — Ещё одно, — просит он. Ты забираешь ручку. Когда возвращаешься, он спит сидя у сарая, телефон прижат к груди.",
        "effects": [{"set": "$.c6_shift_pawel", "value": true}, {"body": "fatigue", "delta": 7}, {"npc": "pawel", "trust": 6}]
      },
      {
        "id": "c6_cellar",
        "label": "Спуститься в погреб",
        "minutes": 2,
        "terminal": true,
        "goto": "c6_cellar",
        "when": {"all": [{"after": 3240}, {"before": 3900}]},
        "effects": []
      },
      {
        "id": "c6_well",
        "label": "Подойти к колодцу",
        "minutes": 2,
        "terminal": true,
        "goto": "c6_well",
        "when": {"all": [{"after": 3240}, {"before": 3900}]},
        "effects": []
      },
      {"id": "c6_gate", "label": "Выйти к калитке", "minutes": 2, "terminal": true, "goto": "c6_gate", "when": {"after": 3240}, "effects": []},
      {
        "id": "c6_fence",
        "label": "Час работать над поперечиной калитки",
        "minutes": 0,
        "activity": "moderate",
        "repeatable": true,
        "combinable": true,
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"not": {"flag": "proj.c3_fence.done"}}]},
        "text": "Ты подгоняешь брус к двум железным скобам. Первый раз он не входит. Второй — входит и застревает. Приходится снова снимать рубанком тонкую стружку.",
        "effects": [{"work": "c3_fence", "hours": 1}]
      },
      {
        "id": "c6_meeting",
        "label": "Сесть с хозяйкой за стол",
        "minutes": 30,
        "combinable": true,
        "when": {"all": [{"all": [{"not": {"flag": "$.c6_meeting"}}, {"all": [{"after": 3900}, {"npc": "henrike", "at": "hof_luedemann", "alive": true}]}]}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}]},
        "text": "Оле приносит пустую чашку и садится у двери. — Во дворе у соседей сегодня тоже топили, — говорит он. Хенрике кивает. — Завтра зайдём. Днём. Сначала спросим. — Хенрике вешает у двери пустую сумку.",
        "effects": [{"set": "$.c6_meeting", "value": true}, {"npc": "henrike", "trust": 2}]
      },
      {
        "id": "c6_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c6_visitor_approach", "label": "Выйти к женщине у калитки", "minutes": 1, "terminal": true, "goto": "c6_visitor", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3740}, {"before": 4200}, {"all": [{"npc": "c3_koehler", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c6_visitor.done"}}]}},
      {"id": "c6_rope_approach", "label": "Подойти к сараю", "minutes": 1, "terminal": true, "goto": "c6_rope", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3970}, {"before": 4200}, {"all": [{"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c6_rope.done"}}]}},
      {"id": "c6_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c6_cp", "when": {"all": [{"cp": 5}, {"after": 4140}]}}
    ],
    "onEnter": [
      {"if": {"all": [{"v": "w.c3_trip5", "op": "==", "value": "relieve"}, {"not": {"flag": "$.c6_promise_cost"}}]}, "then": [{"set": "$.c6_promise_cost", "value": true}, {"wait": 55, "activity": "moderate"}, {"body": "fatigue", "delta": 8}]}
    ]
  },
  {
    "id": "c6_cellar",
    "for": "any",
    "chapter": "ch3",
    "location": "hof_luedemann",
    "title": "Погреб",
    "safe": true,
    "text": [
      {
        "when": {"before": 3240},
        "text": "Ступени погреба уходят в чёрное. Внизу с полки капает вода. Ты поднимаешь свечу выше, чтобы увидеть край первой ступеньки."
      },
      {
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"before": 3600}]},
        "text": "Внизу пахнет землёй и яблоками. Картошка лежит в деревянных закромах, на верхней ступеньке — весы. На стене карандашом отмечен уровень воды прошлого паводка."
      },
      {"when": {"all": [{"after": 3600}, {"before": 3900}]}, "text": "Сверху слышно, как переставляют тяжёлую кастрюлю. Из погреба тянет холодом прямо в рукава."},
      {"when": {"after": 3900}, "text": "Лампочка над лестницей не горит. Ты держишь свечу в жестяной банке, чтобы не капать воском на ступени."}
    ],
    "actions": [
      {
        "id": "c6_last_pot",
        "label": "Отнести ужин тому, кто дежурит",
        "minutes": 20,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_last_pot"}}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]},
        "text": "Хенрике накрывает миску второй тарелкой. — Не расплескай. Он с утра на ногах. — Пар обжигает запястье, когда ты берёшь горячее.",
        "effects": [{"set": "$.c6_last_pot", "value": true}, {"body": "fatigue", "delta": 3}]
      },
      {"id": "c6_up", "label": "Подняться на кухню", "minutes": 2, "terminal": true, "goto": "c6_farm", "effects": []},
      {
        "id": "c6_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c6_visitor_approach", "label": "Выйти к женщине у калитки", "minutes": 1, "terminal": true, "goto": "c6_visitor", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3740}, {"before": 4200}, {"all": [{"npc": "c3_koehler", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c6_visitor.done"}}]}},
      {"id": "c6_rope_approach", "label": "Подойти к сараю", "minutes": 1, "terminal": true, "goto": "c6_rope", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3970}, {"before": 4200}, {"all": [{"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c6_rope.done"}}]}},
      {"id": "c6_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c6_cp", "when": {"all": [{"cp": 5}, {"after": 4140}]}}
    ]
  },
  {
    "id": "c6_well",
    "for": "any",
    "chapter": "ch3",
    "location": "hof_luedemann",
    "title": "Колодец",
    "safe": true,
    "text": [
      {"when": {"before": 3240}, "text": "Павел обмотал ручку ворота тряпкой. Мокрый край уже схватился льдом. Цепь не звенит, пока её держишь натянутой."},
      {
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"before": 3600}]},
        "text": "У ручного насоса мокрая земля. Трещина в шланге расходится, когда Павел нажимает на рычаг. Рядом целое ведро и ворот с цепью. Воду пока поднимают так."
      },
      {"when": {"all": [{"after": 3600}, {"before": 3900}]}, "text": "Солнце встаёт между ветвями, но воду не греет. На мокром борту ведра блестит потёртая полоса."},
      {"when": {"after": 3900}, "text": "В ведре отражается полоска света из кухни. Цепь холодит ладонь даже через перчатку."}
    ],
    "actions": [
      {
        "id": "c6_pawel_rest",
        "label": "Не дать Павлу поднять ведро",
        "minutes": 25,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_pawel_rest"}}, {"npc": "pawel", "alive": true, "at": "hof_luedemann"}]},
        "text": "Он уже завёл верёвку на здоровую кисть. Ты снимаешь петлю: если сорвётся, второй рукой не поймать. — Dobrze, — говорит он. Садится прямо на мокрую доску.",
        "effects": [{"set": "$.c6_pawel_rest", "value": true}, {"body": "fatigue", "delta": 5}, {"npc": "pawel", "trust": 4}]
      },
      {
        "id": "c6_pump",
        "label": "Час менять шланг ручного насоса",
        "minutes": 0,
        "activity": "moderate",
        "repeatable": true,
        "combinable": true,
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"not": {"flag": "proj.c3_pump.done"}}, {"any": [{"has": "c3_hose"}, {"flag": "proj.c3_pump.started"}]}]},
        "text": "Старая резина прикипела к штуцеру. Ты снимаешь её маленькими кусками, не царапая металл. Новый край приходится подрезать заново.",
        "effects": [{"work": "c3_pump", "hours": 1}]
      },
      {"id": "c6_back", "label": "Вернуться в дом", "minutes": 2, "terminal": true, "goto": "c6_farm", "effects": []},
      {
        "id": "c6_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c6_visitor_approach", "label": "Выйти к женщине у калитки", "minutes": 1, "terminal": true, "goto": "c6_visitor", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3740}, {"before": 4200}, {"all": [{"npc": "c3_koehler", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c6_visitor.done"}}]}},
      {"id": "c6_rope_approach", "label": "Подойти к сараю", "minutes": 1, "terminal": true, "goto": "c6_rope", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3970}, {"before": 4200}, {"all": [{"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c6_rope.done"}}]}},
      {"id": "c6_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c6_cp", "when": {"all": [{"cp": 5}, {"after": 4140}]}}
    ]
  },
  {
    "id": "c6_gate",
    "for": "any",
    "chapter": "ch3",
    "location": "hof_luedemann",
    "title": "У калитки",
    "safe": true,
    "text": [
      {
        "when": {"before": 3240},
        "text": "Жестянка на проволоке чуть поворачивается. Оле стоит за столбом, ружьё стволами вниз. Собака лежит у его сапог и не закрывает глаз."
      },
      {
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"before": 3600}]},
        "text": "За сеткой поле, колея и чужая дорога. На столбе висит пустая жестянка: Оле привязал её тонкой проволокой. Если тронуть калитку, будет слышно в доме."
      },
      {"when": {"all": [{"after": 3600}, {"before": 3900}]}, "text": "Оле проверяет скобу у самой земли. Собака тычется носом ему в локоть и мешает работать."},
      {"when": {"after": 3900}, "text": "Из поля пахнет сырой землёй. Жестянка чуть поворачивается на ветру, не звенит. Ты ловишь себя на том, что ждёшь звона."}
    ],
    "actions": [
      {
        "id": "c6_neighbor",
        "label": "Сходить к соседнему двору",
        "minutes": 18,
        "terminal": true,
        "goto": "c6_neighbor",
        "when": {"all": [{"all": [{"after": 3360}, {"before": 3840}]}, {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, {"knows": "f_c3_exchange"}]},
        "effects": [{"move": "c3_neighbor"}]
      },
      {"id": "c6_home", "label": "Вернуться в дом", "minutes": 2, "terminal": true, "goto": "c6_farm", "effects": []},
      {
        "id": "c6_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c6_visitor_approach", "label": "Выйти к женщине у калитки", "minutes": 1, "terminal": true, "goto": "c6_visitor", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3740}, {"before": 4200}, {"all": [{"npc": "c3_koehler", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c6_visitor.done"}}]}},
      {"id": "c6_rope_approach", "label": "Подойти к сараю", "minutes": 1, "terminal": true, "goto": "c6_rope", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3970}, {"before": 4200}, {"all": [{"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c6_rope.done"}}]}},
      {"id": "c6_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c6_cp", "when": {"all": [{"cp": 5}, {"after": 4140}]}}
    ]
  },
  {
    "id": "c6_neighbor",
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
        "id": "c6_trade",
        "label": "Обменять картошку на шланг",
        "minutes": 20,
        "combinable": true,
        "when": {"all": [{"all": [{"all": [{"not": {"flag": "$.c6_trade"}}, {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}]}]}, {"always": true}]}, {"not": {"flag": "$.c5_trade"}}]},
        "text": "Сосед берёт принесённую картошку за оба конца мешка. — До темноты поставьте, — говорит он, отдавая шланг. Хомуты заворачивает отдельно: в земле потом не найдёте.",
        "effects": [{"set": "$.c6_trade", "value": true}, {"take": "potatoes", "qty": 5}, {"give": "c3_hose"}],
        "enabled": {"has": "potatoes", "qty": 5},
        "disabledReason": "Нужны пять килограммов картошки"
      },
      {
        "id": "c6_back",
        "label": "Вернуться по краю поля",
        "minutes": 18,
        "terminal": true,
        "goto": "c6_farm",
        "effects": [{"move": "hof_luedemann"}],
        "when": {"always": true}
      },
      {
        "id": "c6_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку.",
        "when": {"always": true}
      },
      {"id": "c6_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c6_cp", "when": {"all": [{"cp": 5}, {"after": 4140}]}}
    ]
  },
  {
    "id": "c6_coop",
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
        "when": {"all": [{"all": [{"v": "$.c5_rattle.result", "op": "==", "value": "cloth"}, {"all": [{"npc": "pawel", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]}, {"before": 3780}]},
        "text": "Полотенце возвращается выстиранным, но с розовой полосой. Павел кладёт его на порог и не ждёт благодарности."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_rattle.result", "op": "==", "value": "call"}, {"all": [{"npc": "pawel", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]}, {"before": 3780}]},
        "text": "Павел ставит кружку молча. За спиной у него Хенрике: — Сначала руку покажи."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_rattle.result", "op": "==", "value": "wait"}, {"all": [{"npc": "pawel", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}]}, {"before": 3780}]},
        "text": "Через щель видно белую ткань на ладони Павла. Чистой рукой он придерживает дверь, чтобы тебя не ударило."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_thermometer.result", "op": "==", "value": "honest"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}, {"before": 3780}]},
        "text": "Хенрике спрашивает тебя про голову, не доставая прибор. Теперь ей нужен твой ответ, а не цифра."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_thermometer.result", "op": "==", "value": "doctor"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}, {"before": 3780}]},
        "text": "У двери лежит записка: врача пока нет. Хенрике оставила карандаш, чтобы ты мог{m:|ла} дописать симптомы."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_thermometer.result", "op": "==", "value": "privacy"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]}, {"before": 3780}]},
        "text": "Хенрике ставит миску, не снимая цепочку. Ты слышишь, как она проверяет засов второй раз."
      },
      {
        "when": {"all": [{"v": "$.c6_voice.result", "op": "==", "value": "wait"}, {"all": [{"npc": "kerem", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "За стеной Керем перестаёт плакать. — До утра, — повторяет он. — Ты только брату скажи, чтоб пришёл."
      },
      {
        "when": {"all": [{"v": "$.c6_voice.result", "op": "==", "value": "brother"}, {"all": [{"npc": "kerem", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "Братья говорят за дверью вполголоса. Один раз Дениз говорит громко: — Один не пойдёшь."
      },
      {
        "when": {"all": [{"v": "$.c6_voice.result", "op": "==", "value": "secret"}, {"all": [{"npc": "kerem", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]}]},
        "text": "Керем обходит кухню стороной. Проходя мимо твоей двери, прикладывает палец к губам."
      },
      {
        "when": {"all": [{"v": "$.c6_candle.result", "op": "==", "value": "water"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]},
        "text": "Из промоченной соломы тянет холодом. Свечу унесли; свою пустую бутылку ты держишь на коленях."
      },
      {
        "when": {"all": [{"v": "$.c6_candle.result", "op": "==", "value": "lift"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]},
        "text": "На железном листе чёрная солома. Под рукавом саднит запястье, и ты стараешься не сгибать руку."
      },
      {
        "when": {"all": [{"v": "$.c6_candle.result", "op": "==", "value": "call"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}]},
        "text": "Хенрике приносит ведро и заливает угол. Нары мокрые; сухим осталось только место у двери."
      },
      {
        "when": {"v": "w.c3_trip5", "op": "==", "value": "bed"},
        "text": "На вашем сухом месте лежит тот, кому вы уступили его. Свои вещи ты укладываешь у прохода, подальше от чужих ног."
      }
    ],
    "actions": [
      {
        "id": "c6_tell_partner",
        "label": "Написать о том, что скрывал{m:|а}",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_tell_partner"}}]},
        "text": "Ты начинаешь со слова «плохо», зачёркиваешь. Пишешь, что именно болит и когда началось. Эту записку сминать уже не будешь.",
        "effects": [{"set": "$.c6_tell_partner", "value": true}, {"body": "stress", "delta": -4}]
      },
      {
        "id": "c6_own_bread",
        "label": "Сберечь еду на случай новой ночи",
        "minutes": 12,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_own_bread"}}]},
        "text": "Ты не разворачиваешь последнюю пачку. Кладёшь её под голову, рядом с лекарствами. Горячее у двери быстро остывает.",
        "effects": [{"set": "$.c6_own_bread", "value": true}, {"body": "hunger", "delta": 7}]
      },
      {
        "id": "c6_leave_alone",
        "label": "Попросить никого не присылать",
        "minutes": 5,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_company"}}]},
        "text": "Ты говоришь через дверь, что побудешь в тишине. Шаги отходят. Когда хочется позвать обратно, их уже не слышно.",
        "effects": [{"set": "$.c6_company", "value": true}, {"body": "stress", "delta": 5}]
      },
      {
        "id": "c6_ask_company",
        "label": "Попросить посидеть за дверью",
        "minutes": 25,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_company"}}, {"npc": "pawel", "at": "hof_luedemann", "alive": true}]},
        "text": "Ты зовёшь не громко, чтобы слышали только у сарая. Павел садится снаружи. — Десять минут, — говорит он. Через десять не уходит.",
        "effects": [{"set": "$.c6_company", "value": true}, {"npc": "pawel", "trust": 5}, {"body": "stress", "delta": -7}]
      },
      {
        "id": "c6_voice_home",
        "label": "Рассказать Павлу про свой день",
        "minutes": 20,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_voice_home"}}, {"npc": "pawel", "alive": true, "at": "hof_luedemann"}]},
        "text": "— А у меня жена хлеб печёт в пятницу, — говорит он через дверь. — Если мука есть. — Сегодня четверг. Ты не поправляешь его.",
        "effects": [{"set": "$.c6_voice_home", "value": true}, {"body": "stress", "delta": -5}, {"npc": "pawel", "trust": 3}]
      },
      {
        "id": "c6_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c6_voice_approach", "label": "Прислушаться к голосу за стеной", "minutes": 1, "terminal": true, "goto": "c6_voice", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3790}, {"before": 4200}, {"all": [{"npc": "kerem", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c6_voice.done"}}]}},
      {"id": "c6_candle_approach", "label": "Убрать солому от свечи", "minutes": 1, "terminal": true, "goto": "c6_candle", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 4005}, {"before": 4200}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}, {"not": {"flag": "$.c6_candle.done"}}]}},
      {"id": "c6_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c6_cp", "when": {"all": [{"cp": 5}, {"after": 4140}]}}
    ],
    "onEnter": [
      {"if": {"all": [{"v": "w.c3_trip5", "op": "==", "value": "bed"}, {"not": {"flag": "$.c6_bed_cost"}}]}, "then": [{"set": "$.c6_bed_cost", "value": true}, {"body": "fatigue", "delta": 8}]}
    ]
  },
  {
    "id": "c6_aflat",
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
        "when": {"all": [{"all": [{"v": "$.c5_stairs.result", "op": "==", "value": "bandage"}, {"all": []}]}, {"before": 3780}]},
        "text": "Соседка придерживает дверь для тебя. На тапочке виден край твоей повязки."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_stairs.result", "op": "==", "value": "broom"}, {"all": []}]}, {"before": 3780}]},
        "text": "С лестницы убраны осколки. Женщина спускается вдоль стены; на выметенной ступеньке остаётся кровь."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_stairs.result", "op": "==", "value": "closed"}, {"all": []}]}, {"before": 3780}]},
        "text": "На лестнице стоит забытая тапочка. Из-за нижней двери тебе не отвечают."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_tap.result", "op": "==", "value": "give"}, {"all": []}]}, {"before": 3780}]},
        "text": "Снизу поднимают пустую бутылку на верёвке. К горлышку привязано короткое «спасибо»."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_tap.result", "op": "==", "value": "plumbing"}, {"all": []}]}, {"before": 3780}]},
        "text": "В стене стих свист. Сосед поднимает большой палец, потом показывает на пустой кран."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_tap.result", "op": "==", "value": "save"}, {"all": []}]}, {"before": 3780}]},
        "text": "Сосед уносит пустую канистру мимо твоей двери. Останавливается, но стучать не решается."
      },
      {
        "when": {"all": [{"v": "$.c6_container.result", "op": "==", "value": "bottle"}, {"all": []}]},
        "text": "С третьего этажа спускают твою пустую бутылку. Внутри записка с просьбой постучать, если понадобится помощь."
      },
      {
        "when": {"all": [{"v": "$.c6_container.result", "op": "==", "value": "walk"}, {"all": []}]},
        "text": "Сосед держит тебе дверь локтем. Канистру с соломинкой он оставил в мусоре."
      },
      {
        "when": {"all": [{"v": "$.c6_container.result", "op": "==", "value": "warn"}, {"all": []}]},
        "text": "Сосед уносит грязную канистру вниз. Возвращается без неё и без воды."
      },
      {
        "when": {"all": [{"v": "$.c6_lamp.result", "op": "==", "value": "dark"}, {"all": []}]},
        "text": "В подъезде темно. Снизу негромко ругаются, когда кто-то задевает погашенную переноску."
      },
      {
        "when": {"all": [{"v": "$.c6_lamp.result", "op": "==", "value": "move"}, {"all": []}]},
        "text": "Генератор гудит снаружи у стены. Его хозяин машет на своё сухое место: там теперь стоит мокрый двигатель."
      },
      {
        "when": {"all": [{"v": "$.c6_lamp.result", "op": "==", "value": "stay"}, {"all": []}]},
        "text": "Полоса света всё ещё лежит под твоей дверью. Запах выхлопа проходит даже через замочную скважину."
      },
      {
        "when": {"v": "w.c3_trip5", "op": "==", "value": "door"},
        "text": "У входа тебя сменяет сосед с пустой кастрюлей. Пачка пошла на общий ужин. Теперь твоя очередь держать дверь; за водой он обещал сходить сам."
      }
    ],
    "actions": [
      {
        "id": "c6_partner_evening",
        "label": "Дать {partner.dat} поспать первым",
        "minutes": 50,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_partner_evening"}}, {"flag": "w.together"}]},
        "text": "{partner} ложится поверх одеяла, не разуваясь. Ты садишься у двери. Когда {pm:он|она} просыпается, твой чай уже холодный.",
        "effects": [{"set": "$.c6_partner_evening", "value": true}, {"body": "fatigue", "delta": 7}, {"body": "stress", "delta": -5}]
      },
      {
        "id": "c6_door_shift",
        "label": "Посидеть у двери вместо соседа",
        "minutes": 40,
        "combinable": true,
        "when": {"not": {"flag": "$.c6_door_shift"}},
        "text": "Сосед спускается на два этажа и наконец садится. Ты остаёшься у глазка. Изнутри квартиры теплом касается спины сквозняк; за цепочку никто не берётся.",
        "effects": [{"set": "$.c6_door_shift", "value": true}, {"body": "fatigue", "delta": 6}]
      },
      {
        "id": "c6_evening_soup",
        "label": "Сварить еду из своей пачки",
        "minutes": 35,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_evening_soup"}}, {"has": "oats"}]},
        "text": "Крупа липнет ко дну, пока ты прислушиваешься к лестнице. Приходится мешать всё время. Готовую еду держишь в кастрюле: миску потом тоже нужно мыть.",
        "effects": [{"set": "$.c6_evening_soup", "value": true}, {"take": "oats"}, {"body": "hunger", "delta": -35}]
      },
      {
        "id": "c6_reserve",
        "label": "Отложить из рюкзака пачку крупы",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_reserve"}}]},
        "text": "Ты ставишь пачку к сухой стене, отдельно от рюкзака. На полу уже лежит доска. Бумажный край не намокнет снизу.",
        "effects": [{"set": "$.c6_reserve", "value": true}, {"stock": "oats", "qty": 1, "at": "c3_a_stock"}],
        "enabled": {"has": "oats"},
        "disabledReason": "В рюкзаке нет хлопьев"
      },
      {
        "id": "c6_draw_water",
        "label": "Взять из общего запаса три литра",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_draw_water"}}]},
        "text": "Ты переливаешь воду над тазом. Крышки держишь сухими с внутренней стороны. Полные бутылки ставишь подальше от холодного окна.",
        "effects": [{"set": "$.c6_draw_water", "value": true}, {"unstock": "water_l", "qty": 3, "at": "c3_a_stock"}, {"take": "water_l", "qty": 3}, {"give": "water_15", "qty": 2}],
        "enabled": {"stocked": "water_l", "qty": 3, "at": "c3_a_stock"},
        "disabledReason": "В общем запасе меньше трёх литров"
      },
      {
        "id": "c6_shutters",
        "label": "Час укреплять засов подъезда",
        "minutes": 0,
        "activity": "moderate",
        "repeatable": true,
        "combinable": true,
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"not": {"flag": "proj.c3_shutters_a.done"}}, {"all": [{"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, {"not": {"npc": "ilse", "at": "a_flat", "alive": true, "status": "turned"}}]}]},
        "text": "Ты работаешь у самого выхода, оставив дверь в квартиру на цепочке. Старый шуруп прокручивается. Приходится переставить скобу выше и сверлить вручную.",
        "effects": [{"work": "c3_shutters_a", "hours": 1}]
      },
      {"id": "c6_landing", "label": "Выйти на площадку", "minutes": 1, "terminal": true, "goto": "c6_landing_A", "effects": []},
      {
        "id": "c6_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c6_container_approach", "label": "Открыть окно на голос соседа", "minutes": 1, "terminal": true, "goto": "c6_container", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3755}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_container.done"}}]}},
      {"id": "c6_lamp_approach", "label": "Посмотреть на свет в подъезде", "minutes": 1, "terminal": true, "goto": "c6_lamp", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3980}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_lamp.done"}}]}},
      {"id": "c6_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c6_cp", "when": {"all": [{"cp": 5}, {"after": 4140}]}}
    ],
    "onEnter": [
      {"if": {"all": [{"v": "w.c3_trip5", "op": "==", "value": "door"}, {"not": {"flag": "$.c6_promise_cost"}}]}, "then": [{"set": "$.c6_promise_cost", "value": true}, {"wait": 40, "activity": "rest"}]}
    ]
  },
  {
    "id": "c6_bflat",
    "for": "any",
    "chapter": "ch3",
    "location": "b_flat",
    "title": "Barmbek",
    "safe": true,
    "text": [
      {"when": {"before": 3240}, "text": "Лампа на лестнице щёлкает сквозь дверь. В комнате видна одна полоска от уличного фонаря. Ты закрываешь её рукавом куртки."},
      {
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"before": 3600}]},
        "text": "На кухонном столе — открытые пачки и листок с остатками. Через окно слышно, как внизу тянут что-то тяжёлое по асфальту. Ты отодвигаешь стул от двери, потом придвигаешь обратно."
      },
      {
        "when": {"all": [{"after": 3600}, {"before": 3900}]},
        "text": "На кухонном окне серый след ладони. Внизу медленно проезжает грузовик, но у дома не останавливается."
      },
      {
        "when": {"after": 3900},
        "text": "Стекло отражает комнату вместо улицы. Ты закрываешь занавеску до самого края. В подъезде кто-то долго возится с замком и наконец уходит вниз."
      },
      {
        "when": {"npc": "svenja", "at": "b_flat", "alive": true, "status": "turned"},
        "text": "За внутренней дверью шаркают ноги. Ты проверяешь подпорку, не трогая ручку."
      },
      {"when": {"v": "w.power.hh", "op": "==", "value": "on"}, "text": "Холодильник включается с тихим толчком. Ты прислушиваешься к нему дольше, чем к улице."},
      {"when": {"v": "w.power.hh", "op": "==", "value": "off"}, "text": "Холодильник молчит. Дверцу без нужды не открываешь."},
      {
        "when": {"all": [{"all": [{"v": "$.c5_knock.result", "op": "==", "value": "water"}, {"npc": "okafor", "alive": true, "at": "b_okafor"}]}, {"before": 3780}]},
        "text": "У двери напротив лежит снятое с бутылки кольцо. Окафор просит впредь ставить воду и сразу отходить."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_knock.result", "op": "==", "value": "cloth"}, {"npc": "okafor", "alive": true, "at": "b_okafor"}]}, {"before": 3780}]},
        "text": "Твоё полотенце висит на внутренней ручке. Окафор придерживает им дверь, чтобы не касаться металла рукой."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_knock.result", "op": "==", "value": "medical"}, {"npc": "okafor", "alive": true, "at": "b_okafor"}]}, {"before": 3780}]},
        "text": "Во дворе медик смотрит вверх, потом на очередь у машины. До вашего этажа он ещё не дошёл."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_yard.result", "op": "==", "value": "pay"}, {"all": []}]}, {"before": 3780}]},
        "text": "Женщина катит починенный велосипед через двор. Ребёнок в кресле держит твои пять евро — мастер вернул деньги ему."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_yard.result", "op": "==", "value": "talk"}, {"all": []}]}, {"before": 3780}]},
        "text": "Мужчина принимает предложенную работу вместо оплаты. Женщина задерживается у подъезда: ждёт, когда он отпустит раму."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_yard.result", "op": "==", "value": "apart"}, {"all": []}]}, {"before": 3780}]},
        "text": "Велосипед лежит у стены. Женщина ведёт ребёнка пешком, мужчина остался с колесом в руках."
      },
      {
        "when": {"all": [{"v": "$.c6_patient.result", "op": "==", "value": "closed"}, {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"npcVar": "okafor", "key": "bitten"}]}]},
        "text": "Стул стоит снаружи двери Окафора. Изнутри он спрашивает, на месте ли ты, но открыть не просит."
      },
      {
        "when": {"all": [{"v": "$.c6_patient.result", "op": "==", "value": "care"}, {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"npcVar": "okafor", "key": "bitten"}]}]},
        "text": "Твою перевязку забрали. Вода остаётся у порога, хотя из-за двери слышно сухое сглатывание."
      },
      {
        "when": {"all": [{"v": "$.c6_patient.result", "op": "==", "value": "guard"}, {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"npcVar": "okafor", "key": "bitten"}]}]},
        "text": "Дежурный записал этаж и фамилию. Когда машина уезжает, ты ищешь глазами знакомую дверь."
      },
      {
        "when": {"all": [{"v": "$.c6_chain.result", "op": "==", "value": "lift"}, {"all": []}]},
        "text": "Матрас унесли. Старик пробует закрыть дверь и смотрит на тебя, дождавшись щелчка."
      },
      {
        "when": {"all": [{"v": "$.c6_chain.result", "op": "==", "value": "cut"}, {"all": []}]},
        "text": "На пороге клочок разрезанной ткани. Девушка несёт матрас дырой к себе, не оглядываясь."
      },
      {
        "when": {"all": [{"v": "$.c6_chain.result", "op": "==", "value": "inside"}, {"all": []}]},
        "text": "Матрас стоит внутри у стены. Чтобы открыть дверь, теперь нужно сначала отодвинуть его."
      },
      {
        "when": {"v": "w.c3_trip5", "op": "==", "value": "door"},
        "text": "У входа тебя сменяет сосед с пустой кастрюлей. Пачка пошла на общий ужин. Теперь твоя очередь держать дверь; за водой он обещал сходить сам."
      },
      {
        "when": {"v": "$.c6_medicine.result", "op": "==", "value": "sit"},
        "text": "Женщина приносит тебе стул к собственной двери. — Вам теперь посидеть, — говорит она. Коробка таблеток у неё всё ещё пустая."
      },
      {
        "when": {"v": "$.c6_medicine.result", "op": "==", "value": "ask"},
        "text": "Дежурный поднимается на третий этаж. Женщина открывает ему до стука: увидела твою руку в окне."
      },
      {"when": {"v": "$.c6_medicine.result", "op": "==", "value": "no"}, "text": "С третьего этажа зовут по имени женщину, которая ушла. Ответить некому."},
      {
        "when": {"v": "$.c6_patient.result", "op": "==", "value": "support"},
        "text": "Ты держишься подальше от чужой ручки. Окафор просил напомнить ему самому, зачем дверь закрыта."
      },
      {"when": {"v": "$.c6_patient.result", "op": "==", "value": "leave"}, "text": "Ты готовишь слова для партнёра. У двери напротив всё ещё стоит стул."}
    ],
    "actions": [
      {
        "id": "c6_partner_evening",
        "label": "Дать {partner.dat} поспать первым",
        "minutes": 50,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_partner_evening"}}, {"flag": "w.together"}]},
        "text": "{partner} ложится поверх одеяла, не разуваясь. Ты садишься у двери. Когда {pm:он|она} просыпается, твой чай уже холодный.",
        "effects": [{"set": "$.c6_partner_evening", "value": true}, {"body": "fatigue", "delta": 7}, {"body": "stress", "delta": -5}]
      },
      {
        "id": "c6_door_shift",
        "label": "Посидеть у двери вместо соседа",
        "minutes": 40,
        "combinable": true,
        "when": {"not": {"flag": "$.c6_door_shift"}},
        "text": "Сосед спускается на два этажа и наконец садится. Ты остаёшься у глазка. Изнутри квартиры теплом касается спины сквозняк; за цепочку никто не берётся.",
        "effects": [{"set": "$.c6_door_shift", "value": true}, {"body": "fatigue", "delta": 6}]
      },
      {
        "id": "c6_evening_soup",
        "label": "Сварить еду из своей пачки",
        "minutes": 35,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_evening_soup"}}, {"has": "oats"}]},
        "text": "Крупа липнет ко дну, пока ты прислушиваешься к лестнице. Приходится мешать всё время. Готовую еду держишь в кастрюле: миску потом тоже нужно мыть.",
        "effects": [{"set": "$.c6_evening_soup", "value": true}, {"take": "oats"}, {"body": "hunger", "delta": -35}]
      },
      {
        "id": "c6_reserve",
        "label": "Отложить из рюкзака пачку крупы",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_reserve"}}]},
        "text": "На полке освобождается место рядом с общей кастрюлей. Ты убираешь туда пачку, закрыв прищепкой открытый край. Прищепка едва держится на толстом краю.",
        "effects": [{"set": "$.c6_reserve", "value": true}, {"stock": "oats", "qty": 1, "at": "c3_b_stock"}],
        "enabled": {"has": "oats"},
        "disabledReason": "В рюкзаке нет хлопьев"
      },
      {
        "id": "c6_draw_water",
        "label": "Взять из общего запаса три литра",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_draw_water"}}]},
        "text": "На кухне хватает места только для двух бутылок. Ты наполняешь одну, закрываешь, потом берёшь вторую. Кружка остаётся рядом с общим запасом.",
        "effects": [{"set": "$.c6_draw_water", "value": true}, {"unstock": "water_l", "qty": 3, "at": "c3_b_stock"}, {"take": "water_l", "qty": 3}, {"give": "water_15", "qty": 2}],
        "enabled": {"stocked": "water_l", "qty": 3, "at": "c3_b_stock"},
        "disabledReason": "В общем запасе меньше трёх литров"
      },
      {
        "id": "c6_shutters",
        "label": "Час укреплять засов подъезда",
        "minutes": 0,
        "activity": "moderate",
        "repeatable": true,
        "combinable": true,
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"not": {"flag": "proj.c3_shutters_b.done"}}, {"all": [{"any": [{"me": "B"}, {"not": {"flag": "w.together"}}]}, {"not": {"npc": "svenja", "at": "b_flat", "alive": true, "status": "turned"}}]}]},
        "text": "Ты работаешь у самого выхода, оставив дверь в квартиру на цепочке. Старый шуруп прокручивается. Приходится переставить скобу выше и сверлить вручную.",
        "effects": [{"work": "c3_shutters_b", "hours": 1}]
      },
      {
        "id": "c6_okafor",
        "label": "Тихо постучать к Окафору",
        "minutes": 2,
        "terminal": true,
        "goto": "c6_okafor",
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"npc": "okafor", "at": "b_okafor", "alive": true}]},
        "effects": []
      },
      {"id": "c6_landing", "label": "Выйти на площадку", "minutes": 1, "terminal": true, "goto": "c6_landing_B", "effects": []},
      {
        "id": "c6_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c6_patient_approach", "label": "Ответить у двери Окафора", "minutes": 1, "terminal": true, "goto": "c6_patient", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3720}, {"before": 4200}, {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"npcVar": "okafor", "key": "bitten"}]}, {"not": {"flag": "$.c6_patient.done"}}]}},
      {"id": "c6_chain_approach", "label": "Спуститься на зов снизу", "minutes": 1, "terminal": true, "goto": "c6_chain", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3940}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_chain.done"}}]}},
      {"id": "c6_medicine_approach", "label": "Ответить женщине с коробкой", "minutes": 1, "terminal": true, "goto": "c6_medicine", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3725}, {"before": 4140}, {"not": {"npcVar": "okafor", "key": "bitten"}}, {"not": {"flag": "$.c6_medicine.done"}}]}},
      {"id": "c6_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c6_cp", "when": {"all": [{"cp": 5}, {"after": 4140}]}}
    ],
    "onEnter": [
      {"if": {"all": [{"v": "w.c3_trip5", "op": "==", "value": "door"}, {"not": {"flag": "$.c6_promise_cost"}}]}, "then": [{"set": "$.c6_promise_cost", "value": true}, {"wait": 40, "activity": "rest"}]}
    ]
  },
  {
    "id": "c6_landing_A",
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
      {"id": "c6_back", "label": "Вернуться в квартиру", "minutes": 2, "terminal": true, "goto": "c6_aflat", "effects": []},
      {
        "id": "c6_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c6_container_approach", "label": "Открыть окно на голос соседа", "minutes": 1, "terminal": true, "goto": "c6_container", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3755}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_container.done"}}]}},
      {"id": "c6_lamp_approach", "label": "Посмотреть на свет в подъезде", "minutes": 1, "terminal": true, "goto": "c6_lamp", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3980}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_lamp.done"}}]}},
      {"id": "c6_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c6_cp", "when": {"all": [{"cp": 5}, {"after": 4140}]}}
    ]
  },
  {
    "id": "c6_landing_B",
    "for": "any",
    "chapter": "ch3",
    "location": "b_stairs",
    "title": "Площадка",
    "safe": true,
    "text": [
      {"when": {"before": 3240}, "text": "На кнопке таймера засох отпечаток грязного пальца. Ты не нажимаешь. Сверху кто-то тяжело дышит через сон."},
      {
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"before": 3600}]},
        "text": "Почтовые ящики раскрыты, реклама валяется у стены. На двери кто-то написал время последней раздачи воды. Ниже другим почерком: «Это было вчера»."
      },
      {"when": {"all": [{"after": 3600}, {"before": 3900}]}, "text": "Дверь напротив закрыта. На плитке у стены стоит забытая чашка, ручкой к твоему порогу."},
      {"when": {"after": 3900}, "text": "Света на лестнице нет. Ты стоишь у перил и слушаешь, не двигаясь. От нижнего пролёта тянет холодом."},
      {
        "when": {"v": "$.c6_medicine.result", "op": "==", "value": "sit"},
        "text": "Женщина приносит тебе стул к собственной двери. — Вам теперь посидеть, — говорит она. Коробка таблеток у неё всё ещё пустая."
      },
      {
        "when": {"v": "$.c6_medicine.result", "op": "==", "value": "ask"},
        "text": "Дежурный поднимается на третий этаж. Женщина открывает ему до стука: увидела твою руку в окне."
      },
      {"when": {"v": "$.c6_medicine.result", "op": "==", "value": "no"}, "text": "С третьего этажа зовут по имени женщину, которая ушла. Ответить некому."}
    ],
    "actions": [
      {"id": "c6_back", "label": "Вернуться в квартиру", "minutes": 2, "terminal": true, "goto": "c6_bflat", "effects": []},
      {
        "id": "c6_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c6_patient_approach", "label": "Ответить у двери Окафора", "minutes": 1, "terminal": true, "goto": "c6_patient", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3720}, {"before": 4200}, {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"npcVar": "okafor", "key": "bitten"}]}, {"not": {"flag": "$.c6_patient.done"}}]}},
      {"id": "c6_chain_approach", "label": "Спуститься на зов снизу", "minutes": 1, "terminal": true, "goto": "c6_chain", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3940}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_chain.done"}}]}},
      {"id": "c6_medicine_approach", "label": "Ответить женщине с коробкой", "minutes": 1, "terminal": true, "goto": "c6_medicine", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3725}, {"before": 4140}, {"not": {"npcVar": "okafor", "key": "bitten"}}, {"not": {"flag": "$.c6_medicine.done"}}]}},
      {"id": "c6_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c6_cp", "when": {"all": [{"cp": 5}, {"after": 4140}]}}
    ]
  },
  {
    "id": "c6_workshop",
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
        "when": {"all": [{"all": [{"v": "$.c5_rollers.result", "op": "==", "value": "lend"}, {"all": []}]}, {"before": 3780}]},
        "text": "На месте домкрата голый бетон. Под тяжёлую машину теперь нечего подставить."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_rollers.result", "op": "==", "value": "help"}, {"all": []}]}, {"before": 3780}]},
        "text": "У выезда освободилось место. Мужчина из машины машет тебе; на ладони грязная повязка."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_rollers.result", "op": "==", "value": "refuse"}, {"all": []}]}, {"before": 3780}]},
        "text": "У ворот остаётся железный прут. Снаружи слышно, как машину толкают без домкрата."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_spark.result", "op": "==", "value": "sand"}, {"all": []}]}, {"before": 3780}]},
        "text": "Песок под зарядкой потемнел. Человек у соседнего бокса перестаёт курить, увидев, что ты вынес{m:|ла}."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_spark.result", "op": "==", "value": "air"}, {"all": []}]}, {"before": 3780}]},
        "text": "Из открытого бокса слышат голоса с дороги. Кто-то останавливается у ворот и запоминает вывеску."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_spark.result", "op": "==", "value": "backroom"}, {"all": []}]}, {"before": 3780}]},
        "text": "Из щели задней комнаты тянет бензином. Придётся проходить мимо разлива, если понадобится выйти."
      },
      {
        "when": {"all": [{"v": "$.c6_returned.result", "op": "==", "value": "outside"}, {"all": []}]},
        "text": "Домкрат стоит у задней двери. Пустую бутылку вернули рядом, крышку тщательно завернули."
      },
      {
        "when": {"all": [{"v": "$.c6_returned.result", "op": "==", "value": "wipe"}, {"all": []}]},
        "text": "На засове след мокрой тряпки. Снаружи её аккуратно сложили, но домкрат не оставили."
      },
      {
        "when": {"all": [{"v": "$.c6_returned.result", "op": "==", "value": "no"}, {"all": []}]},
        "text": "Стук прекратился. Когда ты выглядываешь, под дверью лежит записка: «Заберите сами»."
      },
      {
        "when": {"all": [{"v": "$.c6_window.result", "op": "==", "value": "still"}, {"all": []}]},
        "text": "По стеклу проходит тень и исчезает. Ты разжимаешь ладонь: ногти оставили четыре ямки."
      },
      {
        "when": {"all": [{"v": "$.c6_window.result", "op": "==", "value": "noise"}, {"all": []}]},
        "text": "В пустом боксе слышен удар в железо. Теперь можно пройти к воротам, но туда, где прозвенело, идти нельзя."
      },
      {
        "when": {"all": [{"v": "$.c6_window.result", "op": "==", "value": "rear"}, {"all": []}]},
        "text": "Из задней комнаты не видно окна. Каждый стук снаружи приходится угадывать по звуку."
      },
      {
        "when": {"v": "w.c3_trip5", "op": "==", "value": "jack"},
        "text": "Чужая машина заняла бокс. Её хозяин просит закрыть ворота изнутри. До задней комнаты ты идёшь мимо незнакомого человека, который уже разулся."
      },
      {"when": {"flag": "w.c3_jack_lent"}, "text": "Домкрат пока у чужих. Поднимать машину без него никто не берётся."}
    ],
    "actions": [
      {
        "id": "c6_answer_note",
        "label": "Оставить ответ хозяину ворот",
        "minutes": 15,
        "combinable": true,
        "when": {"not": {"flag": "$.c6_answer_note"}},
        "text": "Ты пишешь, кому давал{m:|а} инструмент и кто обещал вернуться. Бумагу подкладываешь под тяжёлый ключ. Пустую строку для имени хозяина не заполняешь.",
        "effects": [{"set": "$.c6_answer_note", "value": true}]
      },
      {
        "id": "c6_late_meal",
        "label": "Поесть у холодного верстака",
        "minutes": 20,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_late_meal"}}, {"has": "crackers"}]},
        "text": "Ты снимаешь с верстака грязную тряпку и кладёшь туда хлеб. Ворота звенят от ветра. Каждый кусок приходится сначала отломить, чтобы не хрустнуть на весь бокс.",
        "effects": [{"set": "$.c6_late_meal", "value": true}, {"take": "crackers"}, {"body": "hunger", "delta": -25}]
      },
      {
        "id": "c6_reserve",
        "label": "Отложить из рюкзака пачку крупы",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_reserve"}}]},
        "text": "Ты кладёшь пачку на чистый верстак, подальше от масла. Между едой и инструментом ставишь пустую коробку. Крошкам теперь некуда сыпаться на железо.",
        "effects": [{"set": "$.c6_reserve", "value": true}, {"stock": "oats", "qty": 1, "at": "c3_ws_stock"}],
        "enabled": {"has": "oats"},
        "disabledReason": "В рюкзаке нет хлопьев"
      },
      {
        "id": "c6_draw_water",
        "label": "Взять из общего запаса три литра",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_draw_water"}}]},
        "text": "Воду наливаешь подальше от железного поддона. Бутылки поднимаешь за горлышки, чтобы не зацепить масло с верстака. Крышки завинчиваются с первого раза.",
        "effects": [{"set": "$.c6_draw_water", "value": true}, {"unstock": "water_l", "qty": 3, "at": "c3_ws_stock"}, {"take": "water_l", "qty": 3}, {"give": "water_15", "qty": 2}],
        "enabled": {"stocked": "water_l", "qty": 3, "at": "c3_ws_stock"},
        "disabledReason": "В общем запасе меньше трёх литров"
      },
      {
        "id": "c6_ws_door",
        "label": "Час подгонять направляющую ворот",
        "minutes": 0,
        "activity": "moderate",
        "repeatable": true,
        "combinable": true,
        "when": {"all": [{"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"not": {"flag": "proj.c3_ws_door.done"}}, {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}]}, {"any": [{"not": {"flag": "w.c3_jack_lent"}}, {"flag": "w.c3_jack_returned"}]}]},
        "text": "Ты снимаешь грязь со старого ролика и крутишь его пальцем. Подшипник заедает. Выправлять паз приходится понемногу, каждый раз проверяя ход створки.",
        "effects": [{"work": "c3_ws_door", "hours": 1}]
      },
      {"id": "c6_ws_corner", "label": "Проверить место у аварийного выхода", "minutes": 2, "terminal": true, "goto": "c6_ws_corner", "effects": []},
      {
        "id": "c6_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c6_returned_approach", "label": "Ответить у задней двери", "minutes": 1, "terminal": true, "goto": "c6_returned", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3810}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_returned.done"}}]}},
      {"id": "c6_window_approach", "label": "Проверить свет за окном", "minutes": 1, "terminal": true, "goto": "c6_window", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 4035}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_window.done"}}]}},
      {"id": "c6_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c6_cp", "when": {"all": [{"cp": 5}, {"after": 4140}]}}
    ],
    "onEnter": [
      {"if": {"all": [{"v": "w.c3_trip5", "op": "==", "value": "jack"}, {"not": {"flag": "$.c6_promise_cost"}}]}, "then": [{"set": "$.c6_promise_cost", "value": true}, {"body": "stress", "delta": 8}]}
    ]
  },
  {
    "id": "c6_ws_corner",
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
      {"id": "c6_back", "label": "Вернуться к верстаку", "minutes": 2, "terminal": true, "goto": "c6_workshop", "effects": []},
      {
        "id": "c6_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c6_returned_approach", "label": "Ответить у задней двери", "minutes": 1, "terminal": true, "goto": "c6_returned", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3810}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_returned.done"}}]}},
      {"id": "c6_window_approach", "label": "Проверить свет за окном", "minutes": 1, "terminal": true, "goto": "c6_window", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 4035}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_window.done"}}]}},
      {"id": "c6_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c6_cp", "when": {"all": [{"cp": 5}, {"after": 4140}]}}
    ]
  },
  {
    "id": "c6_ahr",
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
        "when": {"all": [{"all": [{"v": "$.c5_merle.result", "op": "==", "value": "stay"}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}]}, {"before": 3780}]},
        "text": "Мерле ещё раз смотрит на прибор. — Можешь идти. Я уже умею быть скучной. — Стакан она не отдаёт."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_merle.result", "op": "==", "value": "mother"}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}]}, {"before": 3780}]},
        "text": "Биргит сидит на краю кровати. Мерле отвечает ей коротко, глядя на пустое место, где ты стоял{m:|а}."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_merle.result", "op": "==", "value": "respect"}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}]}, {"before": 3780}]},
        "text": "Мерле спускается сама. Перед последней ступенькой останавливается и обеими руками берётся за перила."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_socket.result", "op": "==", "value": "cook"}, {"all": [{"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]}]}, {"before": 3780}]},
        "text": "Биргит ставит приготовленное мясо в холодную кастрюлю. — Сегодня съедим. Завтра суп, — говорит она Уве."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_socket.result", "op": "==", "value": "repair"}, {"all": [{"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]}]}, {"before": 3780}]},
        "text": "Уве вешает снятую вилку на гвоздь. — Так безопасно. Холодильник туда не включать."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_socket.result", "op": "==", "value": "ice"}, {"all": [{"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}, {"npc": "merle", "alive": true, "at": "ahrensburg"}]}]}, {"before": 3780}]},
        "text": "На освобождённой полке лежит лекарство. Биргит уносит мясо и смотрит на него дольше, чем на тебя."
      },
      {
        "when": {"all": [{"v": "$.c6_knives.result", "op": "==", "value": "carry"}, {"all": [{"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}]},
        "text": "Уве вернулся без кастрюли. — Вернут, — говорит он Биргит. Она ставит на плиту меньшую."
      },
      {
        "when": {"all": [{"v": "$.c6_knives.result", "op": "==", "value": "door"}, {"all": [{"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}]},
        "text": "Пустую кастрюлю поставили за калиткой. На ручке чужая варежка, забытая второпях."
      },
      {
        "when": {"all": [{"v": "$.c6_knives.result", "op": "==", "value": "keep"}, {"all": [{"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}]},
        "text": "Биргит разливает суп своим и отодвигает одну полную миску. За ней никто не приходит."
      },
      {
        "when": {"all": [{"v": "$.c6_cooler.result", "op": "==", "value": "mark"}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}]},
        "text": "Мерле закрывает дверцу быстро. — Не морозить. Просто прохладно. Это лекарство, не пельмени."
      },
      {
        "when": {"all": [{"v": "$.c6_cooler.result", "op": "==", "value": "pack"}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}]},
        "text": "Сумка Мерле стоит у выхода. Она подкладывает внутрь ткань, чтобы ручки не касались холодного пакета."
      },
      {
        "when": {"all": [{"v": "$.c6_cooler.result", "op": "==", "value": "leave"}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}]},
        "text": "За кухонной дверью Мерле спорит с матерью. Фраза «не открывай каждые пять минут» слышна и здесь."
      },
      {
        "when": {"v": "w.c3_trip5", "op": "==", "value": "shift"},
        "text": "Дежурный передаёт тебе место и кружку. Он уходит к своим вещам, не дожидаясь, пока ты устроишься. Отказаться можно было до разговора."
      },
      {
        "when": {"v": "w.c3_trip5", "op": "==", "value": "bed"},
        "text": "На вашем сухом месте лежит тот, кому вы уступили его. Свои вещи ты укладываешь у прохода, подальше от чужих ног."
      }
    ],
    "actions": [
      {
        "id": "c6_quiet_room",
        "label": "Дать Мерле побыть одной",
        "minutes": 12,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_quiet_room"}}, {"npc": "merle", "at": "ahrensburg", "alive": true}]},
        "text": "Она закрывает дверь не до конца. — Не запираюсь, видишь? — Ты говоришь, что видишь, и уходишь вниз. Через минуту наверху включают музыку совсем тихо.",
        "effects": [{"set": "$.c6_quiet_room", "value": true}, {"npc": "merle", "trust": 5}]
      },
      {
        "id": "c6_uwe_wire",
        "label": "Держать фонарь для Уве",
        "minutes": 25,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_uwe_wire"}}, {"npc": "uwe", "alive": true, "at": "ahrensburg"}]},
        "text": "Уве снимает клемму, потом просит повернуть свет. — Вот так. — Наконец отпускает твой рукав. Под ногами остаётся снятый предохранитель, чёрный с одного края.",
        "effects": [{"set": "$.c6_uwe_wire", "value": true}, {"npc": "uwe", "trust": 4}]
      },
      {
        "id": "c6_birgit_supper",
        "label": "Подменить Биргит у плиты",
        "minutes": 35,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_birgit_supper"}}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]},
        "text": "— Соль там, — говорит Биргит уже с лестницы. Через минуту возвращается проверить. Ты показываешь на стул. Она садится, но продолжает подсказывать.",
        "effects": [{"set": "$.c6_birgit_supper", "value": true}, {"npc": "birgit", "trust": 5}, {"body": "fatigue", "delta": 4}]
      },
      {"id": "c6_ahr_hall", "label": "Проверить дверь со стороны прихожей", "minutes": 2, "terminal": true, "goto": "c6_ahr_hall", "effects": []},
      {
        "id": "c6_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c6_knives_approach", "label": "Подойти к спору у плиты", "minutes": 1, "terminal": true, "goto": "c6_knives", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3765}, {"before": 4200}, {"all": [{"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}, {"not": {"flag": "$.c6_knives.done"}}]}},
      {"id": "c6_cooler_approach", "label": "Проверить открытый холодильник", "minutes": 1, "terminal": true, "goto": "c6_cooler", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3950}, {"before": 4200}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}, {"not": {"flag": "$.c6_cooler.done"}}]}},
      {"id": "c6_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c6_cp", "when": {"all": [{"cp": 5}, {"after": 4140}]}}
    ],
    "onEnter": [
      {"if": {"all": [{"v": "w.c3_trip5", "op": "==", "value": "shift"}, {"not": {"flag": "$.c6_promise_cost"}}]}, "then": [{"set": "$.c6_promise_cost", "value": true}, {"wait": 50, "activity": "moderate"}, {"body": "fatigue", "delta": 6}]},
      {"if": {"all": [{"v": "w.c3_trip5", "op": "==", "value": "bed"}, {"not": {"flag": "$.c6_bed_cost"}}]}, "then": [{"set": "$.c6_bed_cost", "value": true}, {"body": "fatigue", "delta": 8}]}
    ]
  },
  {
    "id": "c6_ahr_hall",
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
      {"id": "c6_back", "label": "Вернуться на кухню", "minutes": 2, "terminal": true, "goto": "c6_ahr", "effects": []},
      {
        "id": "c6_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c6_knives_approach", "label": "Подойти к спору у плиты", "minutes": 1, "terminal": true, "goto": "c6_knives", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3765}, {"before": 4200}, {"all": [{"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}, {"not": {"flag": "$.c6_knives.done"}}]}},
      {"id": "c6_cooler_approach", "label": "Проверить открытый холодильник", "minutes": 1, "terminal": true, "goto": "c6_cooler", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3950}, {"before": 4200}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}, {"not": {"flag": "$.c6_cooler.done"}}]}},
      {"id": "c6_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c6_cp", "when": {"all": [{"cp": 5}, {"after": 4140}]}}
    ]
  },
  {
    "id": "c6_north",
    "for": "any",
    "chapter": "ch3",
    "location": "north_gym",
    "title": "Спортзал",
    "safe": true,
    "text": [
      {
        "when": {"before": 3240},
        "text": "Над матами горит зелёный прямоугольник выхода. Кто-то во сне тянет на себя одеяло, и раскладушка скрипит. Через ряд отвечают таким же скрипом."
      },
      {
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"before": 3600}]},
        "text": "На стене новый лист: дежурства, вода, кухня. Три фамилии вычеркнуты. Возле каждой подписано «уехали», хотя машины у зала стоят те же."
      },
      {
        "when": {"all": [{"after": 3600}, {"before": 3900}]},
        "text": "На стене спортзала ползёт прямоугольник света. Люди под ним сушат носки, повернувшись к окну спиной."
      },
      {
        "when": {"after": 3900},
        "text": "Светят только лампы у выходов. На баскетбольном щите висит куртка, сохнет после стирки. Под ней кто-то чинит лямку детского рюкзака."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_child.result", "op": "==", "value": "portion"}, {"all": []}]}, {"before": 3780}]},
        "text": "Мальчик ест твою порцию, закрыв миску локтем. Тебе у котла показывают на пустой противень."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_child.result", "op": "==", "value": "search"}, {"all": []}]}, {"before": 3780}]},
        "text": "Женщина с найденным ребёнком садится у выхода. На всякий случай держит его за капюшон."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_child.result", "op": "==", "value": "crackers"}, {"all": []}]}, {"before": 3780}]},
        "text": "От пачки осталась обёртка. Мальчик разглаживает её и прячет к себе, будто там ещё что-то есть."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_local.result", "op": "==", "value": "work"}, {"all": []}]}, {"before": 3780}]},
        "text": "Мужчина пропускает раскладушку через вымытый тобой вход. — Только одну, — говорит уже тише."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_local.result", "op": "==", "value": "talk"}, {"all": []}]}, {"before": 3780}]},
        "text": "Хинрихсен ставит стул в дверях и сама проверяет каждого. Мужчина в свитере ушёл внутрь."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_local.result", "op": "==", "value": "support"}, {"all": []}]}, {"before": 3780}]},
        "text": "Чужую раскладушку уносят обратно. За стеклом остаётся женщина с сумкой; в зале стало тише."
      },
      {
        "when": {"all": [{"v": "$.c6_doorline.result", "op": "==", "value": "shift"}, {"all": []}]},
        "text": "На улице холоднее, чем казалось из зала. Дежурная приносит тебе кружку, не спрашивая фамилию."
      },
      {
        "when": {"all": [{"v": "$.c6_doorline.result", "op": "==", "value": "space"}, {"all": []}]},
        "text": "Чужая раскладушка вплотную к твоей. Её хозяйка старается не повернуться, чтобы не толкнуть тебя."
      },
      {
        "when": {"all": [{"v": "$.c6_doorline.result", "op": "==", "value": "limit"}, {"all": []}]},
        "text": "Людей ведут обратно к автобусу. У двери осталась мокрая детская варежка."
      },
      {
        "when": {"all": [{"v": "$.c6_burner.result", "op": "==", "value": "fair"}, {"all": []}]},
        "text": "В каждой миске понемногу. Женщина с последней миской смотрит на половник и кивает тебе."
      },
      {
        "when": {"all": [{"v": "$.c6_burner.result", "op": "==", "value": "give"}, {"all": []}]},
        "text": "Твою порцию уносят к дальним матам. Следующая раздача только утром."
      },
      {
        "when": {"all": [{"v": "$.c6_burner.result", "op": "==", "value": "mine"}, {"all": []}]},
        "text": "Ты ешь, повернувшись к стене. За спиной спрашивают, осталось ли хоть что-нибудь."
      },
      {
        "when": {"v": "w.c3_trip5", "op": "==", "value": "shift"},
        "text": "Дежурный передаёт тебе место и кружку. Он уходит к своим вещам, не дожидаясь, пока ты устроишься. Отказаться можно было до разговора."
      },
      {
        "when": {"v": "w.c3_trip5", "op": "==", "value": "bed"},
        "text": "На вашем сухом месте лежит тот, кому вы уступили его. Свои вещи ты укладываешь у прохода, подальше от чужих ног."
      }
    ],
    "actions": [
      {
        "id": "c6_ask_woman",
        "label": "Спросить женщину про того, кого ждёт",
        "minutes": 20,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_ask_woman"}}]},
        "text": "Она достаёт фотографию с треснувшего телефона. Мужчина на ней улыбается. Ты запоминаешь лицо, а она впервые за разговор опускает плечи.",
        "effects": [{"set": "$.c6_ask_woman", "value": true}, {"body": "stress", "delta": 4}]
      },
      {
        "id": "c6_crowd_supper",
        "label": "Дождаться конца спора у кухни",
        "minutes": 25,
        "combinable": true,
        "when": {"not": {"flag": "$.c6_crowd_supper"}},
        "text": "Люди спорят, пока еда остывает. Дежурная ставит половник и садится на ящик. Тогда первый из очереди подходит сам: — Давайте я.",
        "effects": [{"set": "$.c6_crowd_supper", "value": true}, {"body": "hunger", "delta": 8}]
      },
      {
        "id": "c6_sleeping_child",
        "label": "Укрыть ребёнка своим полотенцем",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_sleeping_child"}}, {"has": "towel"}]},
        "text": "Женщина придерживает голову мальчика, чтобы ты подложил{m:|а} ткань. — Верну утром, — шепчет она. Рука у неё тоже дрожит от холода.",
        "effects": [{"set": "$.c6_sleeping_child", "value": true}, {"take": "towel"}, {"body": "stress", "delta": -3}]
      },
      {"id": "c6_north_door", "label": "Проверить боковой выход", "minutes": 2, "terminal": true, "goto": "c6_north_door", "effects": []},
      {
        "id": "c6_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c6_doorline_approach", "label": "Подойти к людям у входа", "minutes": 1, "terminal": true, "goto": "c6_doorline", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3825}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_doorline.done"}}]}},
      {"id": "c6_burner_approach", "label": "Удержать очередь от котла", "minutes": 1, "terminal": true, "goto": "c6_burner", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3990}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_burner.done"}}]}},
      {"id": "c6_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c6_cp", "when": {"all": [{"cp": 5}, {"after": 4140}]}}
    ],
    "onEnter": [
      {"if": {"all": [{"v": "w.c3_trip5", "op": "==", "value": "shift"}, {"not": {"flag": "$.c6_promise_cost"}}]}, "then": [{"set": "$.c6_promise_cost", "value": true}, {"wait": 50, "activity": "moderate"}, {"body": "fatigue", "delta": 6}]},
      {"if": {"all": [{"v": "w.c3_trip5", "op": "==", "value": "bed"}, {"not": {"flag": "$.c6_bed_cost"}}]}, "then": [{"set": "$.c6_bed_cost", "value": true}, {"body": "fatigue", "delta": 8}]}
    ]
  },
  {
    "id": "c6_north_door",
    "for": "any",
    "chapter": "ch3",
    "location": "north_gym",
    "title": "Боковая дверь",
    "safe": true,
    "text": [
      {
        "when": {"before": 3240},
        "text": "От стеклянной двери тянет холодом. Снаружи на ступеньке прилипла мокрая газета. Ты отступаешь за светящуюся полосу на полу."
      },
      {
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"before": 3600}]},
        "text": "За стеклом спортивная площадка и складные столы. Дверь открывается наружу. Перед ней аккуратно оставлена свободная полоса."
      },
      {
        "when": {"all": [{"after": 3600}, {"before": 3900}]},
        "text": "На площадке у двери раскладные столы. Дежурный берёт один и ставит вдоль стены, освобождая выход."
      },
      {"when": {"after": 3900}, "text": "В стекле видно зал, на улице ничего. Ты прикрываешь ладонью отражение и смотришь ещё раз."}
    ],
    "actions": [
      {"id": "c6_back", "label": "Вернуться в зал", "minutes": 2, "terminal": true, "goto": "c6_north", "effects": []},
      {
        "id": "c6_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c6_doorline_approach", "label": "Подойти к людям у входа", "minutes": 1, "terminal": true, "goto": "c6_doorline", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3825}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_doorline.done"}}]}},
      {"id": "c6_burner_approach", "label": "Удержать очередь от котла", "minutes": 1, "terminal": true, "goto": "c6_burner", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3990}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_burner.done"}}]}},
      {"id": "c6_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c6_cp", "when": {"all": [{"cp": 5}, {"after": 4140}]}}
    ]
  },
  {
    "id": "c6_out",
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
        "when": {"all": [{"all": [{"v": "$.c5_cart.result", "op": "==", "value": "fix"}, {"all": []}]}, {"before": 3780}]},
        "text": "Женщина прокатывает тележку через порог без рывка. Одну канистру придерживает для тебя, чтобы не задела ногу."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_cart.result", "op": "==", "value": "carry"}, {"all": []}]}, {"before": 3780}]},
        "text": "На месте твоих пальцев чистые полосы на канистре. Женщина ставит её рядом с другой и садится на землю."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_cart.result", "op": "==", "value": "space"}, {"all": []}]}, {"before": 3780}]},
        "text": "Женщина задремала рядом с тележкой. Выйти тихо теперь можно только через дальний проход."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_glass.result", "op": "==", "value": "food"}, {"all": []}]}, {"before": 3780}]},
        "text": "У банки мелькает кошачий хвост. Мужчина гасит фонарь и садится ждать без света."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_glass.result", "op": "==", "value": "distance"}, {"all": []}]}, {"before": 3780}]},
        "text": "Мужчина ползёт между машинами туда, куда ты показал{m:|а}. Его фонарь светит прямо в чужое окно."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_glass.result", "op": "==", "value": "leave"}, {"all": []}]}, {"before": 3780}]},
        "text": "Из дальнего угла видно, как свет ищет под машинами. Твоих вещей в проходе уже не видно."
      },
      {
        "when": {"all": [{"v": "$.c6_box.result", "op": "==", "value": "wait"}, {"all": []}]},
        "text": "Женщина забирает коробку и долго ищет в кармане благодарность. Ты просишь просто убрать её с прохода."
      },
      {
        "when": {"all": [{"v": "$.c6_box.result", "op": "==", "value": "carry"}, {"all": []}]},
        "text": "После чужой коробки ремень своего рюкзака режет то же плечо. Женщина машет тебе от следующего дома."
      },
      {
        "when": {"all": [{"v": "$.c6_box.result", "op": "==", "value": "refuse"}, {"all": []}]},
        "text": "На месте коробки сухой квадрат. Женщина унесла её сама, волоча угол по земле."
      },
      {
        "when": {"all": [{"v": "$.c6_cold.result", "op": "==", "value": "shelter"}, {"all": []}]},
        "text": "Человек спит в твоём сухом углу. Тебе достаётся место ближе к ветру."
      },
      {
        "when": {"all": [{"v": "$.c6_cold.result", "op": "==", "value": "water"}, {"all": []}]},
        "text": "Твою бутылку держат под курткой обеими руками. Горлышко человек пока не может открыть."
      },
      {
        "when": {"all": [{"v": "$.c6_cold.result", "op": "==", "value": "service"}, {"all": []}]},
        "text": "Дежурный увёл человека под локоть. На бетоне осталась мокрая полоса от его брюк."
      }
    ],
    "actions": [
      {
        "id": "c6_keep_corner",
        "label": "Остаться в своём сухом углу",
        "minutes": 10,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_keep_corner"}}]},
        "text": "Ты убираешь ноги, чтобы человек мог пройти мимо. Садится он дальше, на мокрое. Когда снимает ботинки, ты отворачиваешься.",
        "effects": [{"set": "$.c6_keep_corner", "value": true}, {"body": "stress", "delta": 6}]
      },
      {
        "id": "c6_dry_corner",
        "label": "Отдать свой сухой угол на час",
        "minutes": 45,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_dry_corner"}}]},
        "text": "Человек ложится сразу, не спрашивая, где будешь ты. Ты садишься у стены. Через час его приходится будить; он извиняется, не открыв глаз.",
        "effects": [{"set": "$.c6_dry_corner", "value": true}, {"body": "fatigue", "delta": 7}]
      },
      {
        "id": "c6_share_wall",
        "label": "Потесниться для чужой сумки",
        "minutes": 20,
        "combinable": true,
        "when": {"not": {"flag": "$.c6_share_wall"}},
        "text": "Человек придвигает сумку к стене. Сам остаётся снаружи. Ты показываешь на свободный край; он садится, держа ручку обеими руками.",
        "effects": [{"set": "$.c6_share_wall", "value": true}, {"body": "stress", "delta": -4}]
      },
      {"id": "c6_out_corner", "label": "Проверить второй выход из укрытия", "minutes": 2, "terminal": true, "goto": "c6_out_corner", "effects": []},
      {
        "id": "c6_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c6_box_approach", "label": "Ответить женщине с коробкой", "minutes": 1, "terminal": true, "goto": "c6_box", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3830}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_box.done"}}]}},
      {"id": "c6_cold_approach", "label": "Прислушаться к кашлю рядом", "minutes": 1, "terminal": true, "goto": "c6_cold", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 4060}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_cold.done"}}]}},
      {"id": "c6_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c6_cp", "when": {"all": [{"cp": 5}, {"after": 4140}]}}
    ]
  },
  {
    "id": "c6_out_corner",
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
      {"id": "c6_back", "label": "Вернуться к вещам", "minutes": 2, "terminal": true, "goto": "c6_out", "effects": []},
      {
        "id": "c6_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c6_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c6_cp", "when": {"all": [{"cp": 5}, {"after": 4140}]}}
    ]
  },
  {
    "id": "c6_okafor",
    "for": "any",
    "chapter": "ch3",
    "location": "b_okafor",
    "title": "Дверь напротив",
    "safe": false,
    "text": [
      {"when": {"before": 3240}, "text": "У порога Окафора лежит одна тапочка. Другая видна глубже в коридоре. Ты не двигаешь дверь."},
      {
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"before": 3600}]},
        "text": "Ты стучишь тихо, костяшкой пальца. За дверью что-то двигается. Нужно подождать, прежде чем стучать ещё."
      },
      {"when": {"all": [{"after": 3600}, {"before": 3900}]}, "text": "На пороге напротив тень от перил. Ключ лежит внутри тени, не блестит."},
      {"when": {"after": 3900}, "text": "Дверь напротив остаётся закрытой. На полу высохла узкая полоса воды. Ты не наступаешь на неё."},
      {
        "when": {"v": "$.c6_medicine.result", "op": "==", "value": "sit"},
        "text": "Женщина приносит тебе стул к собственной двери. — Вам теперь посидеть, — говорит она. Коробка таблеток у неё всё ещё пустая."
      },
      {
        "when": {"v": "$.c6_medicine.result", "op": "==", "value": "ask"},
        "text": "Дежурный поднимается на третий этаж. Женщина открывает ему до стука: увидела твою руку в окне."
      },
      {"when": {"v": "$.c6_medicine.result", "op": "==", "value": "no"}, "text": "С третьего этажа зовут по имени женщину, которая ушла. Ответить некому."}
    ],
    "actions": [
      {"id": "c6_back", "label": "Вернуться к себе на площадку", "minutes": 1, "terminal": true, "goto": "c6_landing_B", "effects": []},
      {
        "id": "c6_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c6_patient_approach", "label": "Ответить у двери Окафора", "minutes": 1, "terminal": true, "goto": "c6_patient", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3720}, {"before": 4200}, {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"npcVar": "okafor", "key": "bitten"}]}, {"not": {"flag": "$.c6_patient.done"}}]}},
      {"id": "c6_chain_approach", "label": "Спуститься на зов снизу", "minutes": 1, "terminal": true, "goto": "c6_chain", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3940}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_chain.done"}}]}},
      {"id": "c6_medicine_approach", "label": "Ответить женщине с коробкой", "minutes": 1, "terminal": true, "goto": "c6_medicine", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3725}, {"before": 4140}, {"not": {"npcVar": "okafor", "key": "bitten"}}, {"not": {"flag": "$.c6_medicine.done"}}]}},
      {"id": "c6_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c6_cp", "when": {"all": [{"cp": 5}, {"after": 4140}]}}
    ]
  },
  {
    "id": "c6_messe",
    "for": "any",
    "chapter": "ch3",
    "location": "messe",
    "title": "Зал B1",
    "safe": true,
    "text": [
      {
        "when": {"before": 3240},
        "text": "В соседнем ряду на телефоне смотрят видео без звука. Синее лицо появляется и пропадает над краем одеяла. Ты отворачиваешься к колонне."
      },
      {
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"before": 3600}]},
        "text": "Кто-то мелом подписал номер ряда прямо на полу. На колонне бумага отходит от скотча, лист шевелится от каждого проходящего. У кухни очередь из людей с пустыми кружками."
      },
      {"when": {"all": [{"after": 3600}, {"before": 3900}]}, "text": "У кухни моют пустые котлы. Ложки ударяют о металл чаще, чем слышны голоса."},
      {
        "when": {"after": 3900},
        "text": "Одеяла на раскладушках похожи друг на друга. Ты узнаёшь своё место по ботинкам, поставленным рядом. В дальнем конце зала долго не гасят свет."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_blanket.result", "op": "==", "value": "facts"}, {"all": []}]}, {"before": 3780}]},
        "text": "У дрожащего человека теперь отдельный стул и медик рядом. Соседи сдвигают койки сами."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_blanket.result", "op": "==", "value": "insist"}, {"all": []}]}, {"before": 3780}]},
        "text": "Дежурный помнит твой голос. Прежде чем говорить с тобой, зовёт второго сотрудника."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_blanket.result", "op": "==", "value": "quiet"}, {"all": []}]}, {"before": 3780}]},
        "text": "Соседняя раскладушка стоит вплотную к твоей. Теперь дрожит и её спинка."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_locker.result", "op": "==", "value": "sort"}, {"all": []}]}, {"before": 3780}]},
        "text": "Женщина нашла свои таблетки. Она показывает дежурному твою койку: — Вот кто видел."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_locker.result", "op": "==", "value": "guard"}, {"all": []}]}, {"before": 3780}]},
        "text": "Оба рюкзака под столом солдата. Их хозяева ждут разрешения взять даже воду."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_locker.result", "op": "==", "value": "own"}, {"all": []}]}, {"before": 3780}]},
        "text": "Твой рюкзак застёгнут. Рядом женщина на коленях ищет таблетку под чужой обувью."
      },
      {
        "when": {"all": [{"v": "$.c6_feverline.result", "op": "==", "value": "help"}, {"all": []}]},
        "text": "Каталка проходит там, где ты убрал{m:|а} сумки. На полу остаётся колёсная дуга."
      },
      {
        "when": {"all": [{"v": "$.c6_feverline.result", "op": "==", "value": "find"}, {"all": []}]},
        "text": "Женщина из нужного ряда бежит вслед за каталкой. Её миска осталась на твоей койке."
      },
      {
        "when": {"all": [{"v": "$.c6_feverline.result", "op": "==", "value": "back"}, {"all": []}]},
        "text": "Когда ты возвращаешься с едой, человека уже увезли. Соседи спрашивают друг друга, куда."
      },
      {
        "when": {"all": [{"v": "$.c6_latch.result", "op": "==", "value": "clear"}, {"all": []}]},
        "text": "Проход к служебной двери свободен. Волонтёр оставил рядом ключ, привязав его к верёвке."
      },
      {
        "when": {"all": [{"v": "$.c6_latch.result", "op": "==", "value": "ask"}, {"all": []}]},
        "text": "Дежурный снял проволоку с ручки. Теперь он стоит у двери сам и запоминает твоё лицо."
      },
      {
        "when": {"all": [{"v": "$.c6_latch.result", "op": "==", "value": "leave"}, {"all": []}]},
        "text": "У ручки всё та же проволока. Над ней зелёный человечек бежит туда, куда пройти нельзя."
      },
      {
        "when": {"v": "w.c3_trip5", "op": "==", "value": "shift"},
        "text": "Дежурный передаёт тебе место и кружку. Он уходит к своим вещам, не дожидаясь, пока ты устроишься. Отказаться можно было до разговора."
      },
      {
        "when": {"v": "w.c3_trip5", "op": "==", "value": "bed"},
        "text": "На вашем сухом месте лежит тот, кому вы уступили его. Свои вещи ты укладываешь у прохода, подальше от чужих ног."
      }
    ],
    "actions": [
      {
        "id": "c6_borrow_chair",
        "label": "Уступить стул женщине у регистрации",
        "minutes": 15,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_borrow_chair"}}]},
        "text": "Она держит на коленях документы всех, с кем приехала. Сидя, раскладывает их ровнее. Тебе приходится ждать своей очереди стоя.",
        "effects": [{"set": "$.c6_borrow_chair", "value": true}, {"body": "fatigue", "delta": 4}]
      },
      {
        "id": "c6_late_number",
        "label": "Помочь соседке найти её ряд",
        "minutes": 25,
        "combinable": true,
        "when": {"not": {"flag": "$.c6_late_number"}},
        "text": "Она показывает браслет, называет другое число и снова показывает браслет. Ты идёшь с ней до дежурного. Обратно она возвращается уже с человеком в жилете.",
        "effects": [{"set": "$.c6_late_number", "value": true}, {"body": "fatigue", "delta": 4}]
      },
      {
        "id": "c6_messe_corridor",
        "label": "Отойти к перегородке",
        "minutes": 2,
        "terminal": true,
        "goto": "c6_messe_corridor",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]},
        "effects": []
      },
      {
        "id": "c6_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку.",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]}
      },
      {
        "id": "c6_alarm",
        "label": "Уйти от падающей перегородки",
        "minutes": 0,
        "terminal": true,
        "goto": "c6_messe_exit",
        "when": {"flag": "w.c3_messe_outbreak"},
        "effects": []
      },
      {"id": "c6_feverline_approach", "label": "Посмотреть на остановившуюся очередь", "minutes": 1, "terminal": true, "goto": "c6_feverline", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3770}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_feverline.done"}}]}},
      {"id": "c6_latch_approach", "label": "Подойти к запасной двери", "minutes": 1, "terminal": true, "goto": "c6_latch", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3965}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_latch.done"}}]}},
      {"id": "c6_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c6_cp", "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"cp": 5}, {"after": 4140}]}]}}
    ],
    "onEnter": [
      {"if": {"all": [{"v": "w.c3_trip5", "op": "==", "value": "shift"}, {"not": {"flag": "$.c6_promise_cost"}}]}, "then": [{"set": "$.c6_promise_cost", "value": true}, {"wait": 50, "activity": "moderate"}, {"body": "fatigue", "delta": 6}]},
      {"if": {"all": [{"v": "w.c3_trip5", "op": "==", "value": "bed"}, {"not": {"flag": "$.c6_bed_cost"}}]}, "then": [{"set": "$.c6_bed_cost", "value": true}, {"body": "fatigue", "delta": 8}]}
    ]
  },
  {
    "id": "c6_q",
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
        "when": {"all": [{"all": [{"v": "$.c5_curtain.result", "op": "==", "value": "space"}, {"all": []}]}, {"before": 3780}]},
        "text": "У ширмы свободен проход. Медсестра откатывает тележку туда, где ты убрал{m:|а} вещи."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_curtain.result", "op": "==", "value": "gloves"}, {"all": []}]}, {"before": 3780}]},
        "text": "Медсестра поднимает ладонь в твоих перчатках. На манжете ещё виден след от упаковки."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_curtain.result", "op": "==", "value": "cot"}, {"all": []}]}, {"before": 3780}]},
        "text": "Твоя койка заслоняет обзор. За тканью снова зовут второго человека, громче прежнего."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_bracelet.result", "op": "==", "value": "message"}, {"all": []}]}, {"before": 3780}]},
        "text": "Дежурный приносит ответ от мужа. Женщина разглаживает бумагу под красным браслетом."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_bracelet.result", "op": "==", "value": "report"}, {"all": []}]}, {"before": 3780}]},
        "text": "Возле соседки поставили стул для наблюдателя. Она отворачивается, когда ты проходишь."
      },
      {
        "when": {"all": [{"all": [{"v": "$.c5_bracelet.result", "op": "==", "value": "silent"}, {"all": []}]}, {"before": 3780}]},
        "text": "Женщина перестаёт дёргать браслет при тебе. Под рукавом слышен сухой треск пластика."
      },
      {
        "when": {"all": [{"v": "$.c6_letter.result", "op": "==", "value": "read"}, {"all": []}]},
        "text": "Женщина узнаёт ответ по почерку. Бумагу кладёт под подушку, а не в сумку."
      },
      {
        "when": {"all": [{"v": "$.c6_letter.result", "op": "==", "value": "desk"}, {"all": []}]},
        "text": "Записка лежит под планшетом регистратора. Он ищет её каждый раз, когда кто-то спрашивает фамилию."
      },
      {
        "when": {"all": [{"v": "$.c6_letter.result", "op": "==", "value": "back"}, {"all": []}]},
        "text": "Женщина переписывает адрес крупнее. Карандаш доходит до края, она начинает с новой стороны."
      },
      {
        "when": {"all": [{"v": "$.c6_sleepless.result", "op": "==", "value": "watch"}, {"all": []}]},
        "text": "Сосед засыпает, держась за край твоего рукава. Медсестра подходит и тихо просит не будить."
      },
      {
        "when": {"all": [{"v": "$.c6_sleepless.result", "op": "==", "value": "tie"}, {"all": []}]},
        "text": "Сумка привязана к койке. Человек тянет её во сне, и металлическая ножка скребёт по полу."
      },
      {
        "when": {"all": [{"v": "$.c6_sleepless.result", "op": "==", "value": "nurse"}, {"all": []}]},
        "text": "Медсестра задержалась у соседней койки. Тебе воду принесёт другой человек, когда освободится."
      },
      {
        "when": {"v": "w.c3_trip5", "op": "==", "value": "bed"},
        "text": "На вашем сухом месте лежит тот, кому вы уступили его. Свои вещи ты укладываешь у прохода, подальше от чужих ног."
      }
    ],
    "actions": [
      {
        "id": "c6_tell_truth",
        "label": "Не скрывать новый симптом на осмотре",
        "minutes": 12,
        "combinable": true,
        "when": {"all": [{"not": {"flag": "$.c6_tell_truth"}}]},
        "text": "Ты описываешь, когда начала болеть голова. Медсестра меняет время следующего осмотра на более раннее. — Зови, если сильнее, — говорит она, уже глядя на следующую койку.",
        "effects": [{"set": "$.c6_tell_truth", "value": true}, {"body": "stress", "delta": 4}]
      },
      {
        "id": "c6_night_check",
        "label": "Дождаться вечернего осмотра",
        "minutes": 20,
        "combinable": true,
        "when": {"not": {"flag": "$.c6_night_check"}},
        "text": "Медик просит смотреть на свет. Ты щуришься. Он убирает фонарь сразу: — Теперь скажите, где вы. — Сосед отвечает раньше тебя и неправильно.",
        "effects": [{"set": "$.c6_night_check", "value": true}, {"body": "stress", "delta": 5}]
      },
      {
        "id": "c6_q_screen",
        "label": "Подойти к перегородке",
        "minutes": 2,
        "terminal": true,
        "goto": "c6_q_screen",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]},
        "effects": []
      },
      {
        "id": "c6_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку.",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]}
      },
      {
        "id": "c6_alarm",
        "label": "Уйти от падающей перегородки",
        "minutes": 0,
        "terminal": true,
        "goto": "c6_messe_exit",
        "when": {"flag": "w.c3_messe_outbreak"},
        "effects": []
      },
      {"id": "c6_letter_approach", "label": "Подойти к медсестре с конвертом", "minutes": 1, "terminal": true, "goto": "c6_letter", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3800}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_letter.done"}}]}},
      {"id": "c6_sleepless_approach", "label": "Ответить соседу у койки", "minutes": 1, "terminal": true, "goto": "c6_sleepless", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 4030}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_sleepless.done"}}]}},
      {"id": "c6_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c6_cp", "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"cp": 5}, {"after": 4140}]}]}}
    ],
    "onEnter": [
      {"if": {"all": [{"v": "w.c3_trip5", "op": "==", "value": "bed"}, {"not": {"flag": "$.c6_bed_cost"}}]}, "then": [{"set": "$.c6_bed_cost", "value": true}, {"body": "fatigue", "delta": 8}]}
    ]
  },
  {
    "id": "c6_messe_corridor",
    "for": "any",
    "chapter": "ch3",
    "location": "messe",
    "title": "У перегородки",
    "safe": true,
    "text": [
      {"when": {"before": 3240}, "text": "Кабель у сетки тёплый. Ты замечаешь, что стоишь на нём подошвой, и переступаешь. Солдат смотрит, но ничего не говорит."},
      {
        "when": {"all": [{"all": [{"after": 3240}, {"before": 3900}]}, {"before": 3600}]},
        "text": "За двойной сеткой видны чужие койки. Солдат стоит боком, чтобы видеть оба прохода. Говорить с той стороной разрешает только издали."
      },
      {
        "when": {"all": [{"after": 3600}, {"before": 3900}]},
        "text": "Люди у сетки передают номера рядов через дежурного. Он повторяет каждый номер, прежде чем записать."
      },
      {"when": {"after": 3900}, "text": "За сеткой горит дежурный свет. Лиц почти не различить, только движения над белыми простынями."}
    ],
    "actions": [
      {
        "id": "c6_back",
        "label": "Вернуться в свой ряд",
        "minutes": 2,
        "terminal": true,
        "goto": "c6_messe",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]},
        "effects": []
      },
      {
        "id": "c6_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку.",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]}
      },
      {
        "id": "c6_alarm",
        "label": "Уйти от падающей перегородки",
        "minutes": 0,
        "terminal": true,
        "goto": "c6_messe_exit",
        "when": {"flag": "w.c3_messe_outbreak"},
        "effects": []
      },
      {"id": "c6_feverline_approach", "label": "Посмотреть на остановившуюся очередь", "minutes": 1, "terminal": true, "goto": "c6_feverline", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3770}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_feverline.done"}}]}},
      {"id": "c6_latch_approach", "label": "Подойти к запасной двери", "minutes": 1, "terminal": true, "goto": "c6_latch", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3965}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_latch.done"}}]}},
      {"id": "c6_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c6_cp", "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"cp": 5}, {"after": 4140}]}]}}
    ]
  },
  {
    "id": "c6_q_screen",
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
        "id": "c6_back",
        "label": "Вернуться к раскладушке",
        "minutes": 2,
        "terminal": true,
        "goto": "c6_q",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]},
        "effects": []
      },
      {
        "id": "c6_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку.",
        "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}]}
      },
      {
        "id": "c6_alarm",
        "label": "Уйти от падающей перегородки",
        "minutes": 0,
        "terminal": true,
        "goto": "c6_messe_exit",
        "when": {"flag": "w.c3_messe_outbreak"},
        "effects": []
      },
      {"id": "c6_letter_approach", "label": "Подойти к медсестре с конвертом", "minutes": 1, "terminal": true, "goto": "c6_letter", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3800}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_letter.done"}}]}},
      {"id": "c6_sleepless_approach", "label": "Ответить соседу у койки", "minutes": 1, "terminal": true, "goto": "c6_sleepless", "when": {"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 4030}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_sleepless.done"}}]}},
      {"id": "c6_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c6_cp", "when": {"all": [{"not": {"flag": "w.c3_messe_outbreak"}}, {"all": [{"cp": 5}, {"after": 4140}]}]}}
    ]
  },
  {
    "id": "c6_messe_exit",
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
        "id": "c6_exit_known",
        "label": "Держаться знакомого прохода вдоль стены",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_messe_yard",
        "when": {"flag": "$.messe_exit"},
        "text": "Ты идёшь вдоль стены, не пытаясь обогнать тех, кто впереди. Зелёная табличка, коробки, ручка. За дверью холодно. Ты выходишь и только тогда вспоминаешь вдохнуть.",
        "effects": [{"move": "c3_messe_yard"}, {"body": "stress", "delta": 15}, {"learn": "f_c3_messe_closed"}]
      },
      {
        "id": "c6_exit_staff",
        "label": "Идти за волонтёром к служебной двери",
        "minutes": 25,
        "terminal": true,
        "goto": "c6_messe_yard",
        "text": "Волонтёр поднимает свёрнутый жилет над головой. Ты держишь его в поле зрения. В узком месте сумку прижимает к чужой спине, потом вдруг отпускает. За дверью ты долго не можешь выпрямить пальцы.",
        "effects": [{"move": "c3_messe_yard"}, {"body": "stress", "delta": 24}, {"body": "fatigue", "delta": 8}, {"learn": "f_c3_messe_closed"}]
      },
      {
        "id": "c6_exit_lift",
        "label": "Вытащить упавшего из прохода",
        "minutes": 8,
        "terminal": true,
        "risky": true,
        "goto": "c6_messe_yard",
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
        "id": "c6_exit_drop",
        "label": "Бросить рюкзак и протиснуться первым",
        "minutes": 3,
        "terminal": true,
        "goto": "c6_messe_yard",
        "text": "Ты выпускаешь лямку. Чужие ноги сразу закрывают рюкзак, и уже не видно, какой из них твой. Снаружи руки свободны. Ты не знаешь, что ими делать.",
        "effects": [{"move": "c3_messe_yard"}, {"drop": "backpack"}, {"set": "$.c3_exit_left_bag", "value": true}, {"body": "stress", "delta": 18}, {"learn": "f_c3_messe_closed"}]
      }
    ]
  },
  {
    "id": "c6_messe_yard",
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
      {"when": {"flag": "$.c3_exit_left_bag"}, "text": "Рюкзак остался за закрытыми воротами. Солдат преграждает дорогу, когда ты поворачиваешься к ним."},
      {
        "when": {"v": "w.c3_trip5", "op": "==", "value": "shift"},
        "text": "Дежурный передаёт тебе место и кружку. Он уходит к своим вещам, не дожидаясь, пока ты устроишься. Отказаться можно было до разговора."
      },
      {
        "when": {"v": "w.c3_trip5", "op": "==", "value": "bed"},
        "text": "На вашем сухом месте лежит тот, кому вы уступили его. Свои вещи ты укладываешь у прохода, подальше от чужих ног."
      }
    ],
    "actions": [
      {"id": "c6_yard_edge", "label": "Проверить край тента у ограды", "minutes": 2, "terminal": true, "goto": "c6_yard_edge", "effects": []},
      {
        "id": "c6_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c6_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c6_cp", "when": {"all": [{"cp": 5}, {"after": 4140}]}}
    ],
    "onEnter": [
      {"if": {"all": [{"v": "w.c3_trip5", "op": "==", "value": "shift"}, {"not": {"flag": "$.c6_promise_cost"}}]}, "then": [{"set": "$.c6_promise_cost", "value": true}, {"wait": 50, "activity": "moderate"}, {"body": "fatigue", "delta": 6}]},
      {"if": {"all": [{"v": "w.c3_trip5", "op": "==", "value": "bed"}, {"not": {"flag": "$.c6_bed_cost"}}]}, "then": [{"set": "$.c6_bed_cost", "value": true}, {"body": "fatigue", "delta": 8}]}
    ]
  },
  {
    "id": "c6_yard_edge",
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
      {"id": "c6_back", "label": "Вернуться к людям под тентом", "minutes": 2, "terminal": true, "goto": "c6_messe_yard", "effects": []},
      {
        "id": "c6_wait",
        "label": "Переждать час",
        "minutes": 60,
        "activity": "rest",
        "repeatable": true,
        "combinable": true,
        "text": "Ты ждёшь. Минуты тянутся; прислушиваешься к каждому звуку."
      },
      {"id": "c6_go", "label": "Ночь. Устроиться на ночлег", "minutes": 5, "terminal": true, "goto": "c6_cp", "when": {"all": [{"cp": 5}, {"after": 4140}]}}
    ]
  },
  {
    "id": "c6_visitor",
    "for": "any",
    "chapter": "ch3",
    "title": "Выйти к женщине у калитки",
    "universal": false,
    "text": [
      {
        "text": "— Сначала обмен, — говорит Кёлер. — Потом спрошу. — На тележке четыре пачки хлопьев. Оле держит калитку закрытой. Кёлер смотрит на тёмную дорогу: ей ещё нужен ночлег."
      },
      {"text": "— Кёлер. Элке, — говорит она. — Из пекарни у старой дороги. — Показывает муку на подоле куртки."}
    ],
    "onEnter": [{"set": "$.c6_visitor.started", "value": true}],
    "actions": [
      {
        "id": "c6_visitor_ask",
        "label": "Позвать Хенрике",
        "minutes": 8,
        "combinable": true,
        "when": {"not": {"flag": "$.c6_visitor.asked"}},
        "text": "Она разворачивает пустой мешок, чтобы показать дно. — В пекарне печь остывает быстро. Я думала, до утра хватит. — Хенрике спрашивает, кто остался там. Кёлер не отвечает.",
        "effects": [{"set": "$.c6_visitor.asked", "value": true}]
      },
      {
        "id": "c6_visitor_exchange",
        "label": "Помочь с обменом дров на хлопья",
        "minutes": 25,
        "terminal": true,
        "goto": "c6_farm",
        "text": "Хенрике сама выбирает сухие поленья. Ты подаёшь их через сетку, Кёлер снимает пачки с тележки. Кошку приходится отодвинуть вместе с мешком.",
        "effects": [
          {"set": "$.c6_visitor.done", "value": true},
          {"set": "$.c6_visitor.result", "value": "exchange"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": [{"unstock": "firewood", "qty": 8, "at": "c3_farm_stock"}, {"take": "firewood", "qty": 8}, {"place": "oats", "qty": 4, "at": "c3_farm_stock"}]},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": [{"set": "w.c3_koehler_met", "value": true}]}
        ],
        "enabled": {"stocked": "firewood", "qty": 8, "at": "c3_farm_stock"},
        "disabledReason": "Нужные вещи сейчас не при тебе"
      },
      {
        "id": "c6_visitor_inspect",
        "label": "Предложить осмотреть её руки",
        "minutes": 20,
        "text": "Кёлер закатывает рукава сама. На руках ожоги от противней и старая царапина. Хенрике подходит на шаг. — Вечером поговорим, — повторяет уже тише.",
        "effects": [
          {"set": "$.c6_visitor.inspected", "value": true},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": [{"set": "w.c3_guest_checked", "value": true}, {"set": "w.c3_koehler_met", "value": true}]},
          {"npc": "c3_koehler", "trust": 4}
        ],
        "combinable": true,
        "when": {"not": {"flag": "$.c6_visitor.inspected"}}
      },
      {
        "id": "c6_visitor_no",
        "label": "Поддержать Оле",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_farm",
        "text": "Оле встаёт ближе к калитке. Кёлер перестаёт держать тележку двумя руками. — Я поняла, — говорит она. Кошка спрыгивает в поле, и ей приходится ждать.",
        "effects": [
          {"set": "$.c6_visitor.done", "value": true},
          {"set": "$.c6_visitor.result", "value": "no"},
          {"npc": "ole", "trust": 3},
          {"npc": "henrike", "trust": -3},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c6_visitor_night",
        "label": "Позвать хозяйку решать про ночлег",
        "minutes": 10,
        "terminal": true,
        "goto": "c6_farm",
        "text": "— Вот теперь спрашивай, — говорит Хенрике. Кёлер прижимает к животу пустой мешок. — До утра. Мне только до утра. — Хозяйка смотрит на тебя: одной ей кормить всех не хочется.",
        "effects": [
          {"set": "$.c6_visitor.done", "value": true},
          {"set": "$.c6_visitor.result", "value": "night"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": [{"set": "w.c3_koehler_met", "value": true}]},
          {"body": "stress", "delta": 5}
        ]
      }
    ],
    "location": "hof_luedemann"
  },
  {
    "id": "c6_rope",
    "for": "any",
    "chapter": "ch3",
    "title": "Подойти к сараю",
    "universal": false,
    "text": [
      {"text": "У сарая Оле спорит с Денизом. Между ними на козлах разобранный генератор. Дениз держит пустую бензиновую канистру."},
      {"text": "— Дизель не станет бензином от твоего желания, — говорит он. — А мотор станет железным ящиком. Это умею обещать."}
    ],
    "onEnter": [{"set": "$.c6_rope.started", "value": true}],
    "actions": [
      {
        "id": "c6_rope_fuel",
        "label": "Отдать литр бензина на рацию",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_farm",
        "text": "Ты сам{m:|а} отмеряешь бензин в чистую тару. Дениз переливает без воронки, не пролив капли. — На рацию. Не на гирлянду, — говорит он Оле.",
        "effects": [
          {"set": "$.c6_rope.done", "value": true},
          {"set": "$.c6_rope.result", "value": "fuel"},
          {"if": {"me": "A"}, "then": [{"siphon": "opel_corsa", "liters": 1}, {"set": "w.c3_radio_charged", "value": true}]},
          {"npc": "ole", "trust": 5}
        ],
        "enabled": {"fuelIn": "opel_corsa", "liters": 1},
        "disabledReason": "Нужные вещи сейчас не при тебе"
      },
      {
        "id": "c6_rope_contacts",
        "label": "Помочь Денизу проверить контакты",
        "minutes": 25,
        "terminal": true,
        "goto": "c6_farm",
        "text": "Ты держишь стакан, Дениз чистит пружины. Рация всё ещё молчит, зато разъём больше не шатается. Оле берёт её осторожнее, чем ружьё.",
        "effects": [
          {"set": "$.c6_rope.done", "value": true},
          {"set": "$.c6_rope.result", "value": "contacts"},
          {"body": "fatigue", "delta": 4},
          {"npc": "deniz", "trust": 5},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c6_rope_keep",
        "label": "Оставить бензин на дорогу",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_farm",
        "text": "Ты убираешь ключи глубже в карман. Хенрике кивает один раз. Оле ставит зарядку на верстак так резко, что Дениз придерживает генератор.",
        "effects": [{"set": "$.c6_rope.done", "value": true}, {"set": "$.c6_rope.result", "value": "keep"}, {"npc": "ole", "trust": -4}]
      }
    ],
    "location": "hof_luedemann"
  },
  {
    "id": "c6_voice",
    "for": "any",
    "chapter": "ch3",
    "title": "Прислушаться к голосу за стеной",
    "universal": false,
    "text": [
      {"text": "За кирпичной стеной кто-то тихо плачет. Потом слышен голос Керема: просит не звать Оле. В дверь никто не стучит."},
      {"text": "Он подходит ближе. — Ничего. Проехали, — говорит. Но не уходит. Ты слышишь его дыхание через щель."}
    ],
    "onEnter": [{"set": "$.c6_voice.started", "value": true}],
    "actions": [
      {
        "id": "c6_voice_wait",
        "label": "Уговорить его дождаться утра",
        "minutes": 20,
        "terminal": true,
        "goto": "c6_coop",
        "text": "Ты просишь хотя бы переночевать. Керем молчит, потом ведро скрипит снова. — До утра, — говорит он. Шаги к дороге не уходят.",
        "effects": [
          {"set": "$.c6_voice.done", "value": true},
          {"set": "$.c6_voice.result", "value": "wait"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": [{"npc": "kerem", "trust": 5, "set": {"c3_waits": true}}]},
          {"body": "stress", "delta": 3},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": [{"set": "w.c3_kerem_stays", "value": true}]}
        ]
      },
      {
        "id": "c6_voice_brother",
        "label": "Позвать Дениза",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_coop",
        "text": "Ты зовёшь через двор. Керем встаёт, но остаётся у стены. Братья разговаривают так тихо, что ты слышишь только скрип ведра под их ногами.",
        "effects": [
          {"set": "$.c6_voice.done", "value": true},
          {"set": "$.c6_voice.result", "value": "brother"},
          {"npc": "kerem", "trust": -4},
          {"npc": "deniz", "trust": 4},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": [{"set": "w.c3_kerem_stays", "value": true}]}
        ]
      },
      {
        "id": "c6_voice_secret",
        "label": "Пообещать не рассказывать",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_coop",
        "text": "Керем благодарит и уходит к сараю. Ведро остаётся у стены, открытым дном вверх. Ты не слышишь, в какую сторону потом уходят шаги.",
        "effects": [
          {"set": "$.c6_voice.done", "value": true},
          {"set": "$.c6_voice.result", "value": "secret"},
          {"npc": "kerem", "trust": 6},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": [{"set": "w.c3_kerem_road", "value": true}]}
        ]
      }
    ],
    "location": "farm_coop"
  },
  {
    "id": "c6_candle",
    "for": "any",
    "chapter": "ch3",
    "title": "Убрать солому от свечи",
    "universal": false,
    "text": [{"text": "Свеча у порога наклоняется в мягком воске. В соломе чернеет тонкая дорожка. Дым поднимается прямо к нарам."}],
    "onEnter": [{"set": "$.c6_candle.started", "value": true}],
    "actions": [
      {
        "id": "c6_candle_water",
        "label": "Промочить весь тлеющий угол",
        "minutes": 3,
        "terminal": true,
        "goto": "c6_coop",
        "text": "Ты выливаешь оставшуюся воду вдоль кирпича. Солома перестаёт трещать. Хенрике открывает дверь, но держит тебя у самого порога, пока не вынесут мокрое.",
        "effects": [
          {"set": "$.c6_candle.done", "value": true},
          {"set": "$.c6_candle.result", "value": "water"},
          {"takeTag": "drink"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []},
          {"body": "stress", "delta": 6}
        ],
        "enabled": {"hasTag": "drink"},
        "disabledReason": "Нужные вещи сейчас не при тебе"
      },
      {
        "id": "c6_candle_lift",
        "label": "Вынести солому на железном листе",
        "minutes": 2,
        "terminal": true,
        "goto": "c6_coop",
        "effects": [
          {"set": "$.c6_candle.done", "value": true},
          {"set": "$.c6_candle.result", "value": "lift"},
          {"body": "fatigue", "delta": 6},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ],
        "risky": true,
        "outcomes": [
          {
            "id": "careful",
            "check": {"traits": ["agility", "technical"], "difficulty": 4, "uses": ["mobility", "focus"]},
            "text": "Ты подсовываешь лист под обугленное место. Хенрике держит дверь, Павел подставляет ведро снаружи. Последний ком гаснет уже на земле."
          },
          {
            "id": "hurt",
            "text": "Лист режет кисть, когда ты берёшься ближе к горячему краю. Солома уже снаружи. Ты зажимаешь руку под мышкой и зовёшь через дверь.",
            "effects": [{"injure": "cut", "site": "hands", "severity": 2, "bleeding": 1}, {"body": "stress", "delta": 12}]
          }
        ]
      },
      {
        "id": "c6_candle_call",
        "label": "Отступить и ждать помощи у порога",
        "minutes": 6,
        "terminal": true,
        "goto": "c6_coop",
        "text": "Ты прижимаешься к щели. Дверь открывается, Хенрике протягивает мокрое одеяло. Солому тушат за твоей спиной, нары обливают вместе с подушкой.",
        "effects": [
          {"set": "$.c6_candle.done", "value": true},
          {"set": "$.c6_candle.result", "value": "call"},
          {"body": "stress", "delta": 12},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": [{"set": "w.c3_coop_bedding_wet", "value": true}]}
        ]
      }
    ],
    "location": "farm_coop"
  },
  {
    "id": "c6_container",
    "for": "any",
    "chapter": "ch3",
    "title": "Открыть окно на голос соседа",
    "universal": false,
    "text": [
      {"text": "Сосед снизу зовёт у окна. В руках у него канистра, из горлышка торчит соломинка. Просит помочь поднять воду на третий этаж."},
      {"text": "Он показывает обе пустые руки. Пакет у ноги насквозь мокрый, бутылки в нём без крышек. До вечера очередь разойдётся."}
    ],
    "onEnter": [{"set": "$.c6_container.started", "value": true}],
    "actions": [
      {
        "id": "c6_container_bottle",
        "label": "Отдать закрытую воду",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_aflat",
        "text": "Ты передаёшь бутылку через окно на верёвке. Сосед поднимает её к лицу, читает этикетку и прячет под куртку от холода. Канистру не поднимает.",
        "effects": [{"set": "$.c6_container.done", "value": true}, {"set": "$.c6_container.result", "value": "bottle"}, {"take": "water_15"}, {"set": "$.c3_third_floor_water", "value": true}],
        "enabled": {"has": "water_15"},
        "disabledReason": "Нужные вещи сейчас не при тебе"
      },
      {
        "id": "c6_container_walk",
        "label": "Сходить с ним за чистой водой",
        "minutes": 35,
        "terminal": true,
        "goto": "c6_aflat",
        "text": "Ты несёшь ведро с одного края, он с другого. У цистерны дают долить последним. На лестнице вода дрожит у самого края, но не выливается.",
        "effects": [{"set": "$.c6_container.done", "value": true}, {"set": "$.c6_container.result", "value": "walk"}, {"body": "fatigue", "delta": 8}]
      },
      {
        "id": "c6_container_warn",
        "label": "Предупредить и оставить свою воду",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_aflat",
        "text": "Ты ещё раз говоришь, что эту канистру нельзя пить. Сосед кивает и уносит её в сторону баков. Возвращаться к окну не становится.",
        "effects": [{"set": "$.c6_container.done", "value": true}, {"set": "$.c6_container.result", "value": "warn"}, {"body": "stress", "delta": 5}]
      }
    ],
    "location": "a_flat"
  },
  {
    "id": "c6_lamp",
    "for": "any",
    "chapter": "ch3",
    "title": "Посмотреть на свет в подъезде",
    "universal": false,
    "text": [
      {"text": "Внизу вдруг загорается яркая переноска. Чужие голоса смеются у распахнутой входной двери. Свет идёт по перилам до твоего этажа."},
      {"text": "— Зарядить телефоны, — отвечают. У соседа маленький генератор во дворе. Его уже слышно через открытую дверь."}
    ],
    "onEnter": [{"set": "$.c6_lamp.started", "value": true}],
    "actions": [
      {
        "id": "c6_lamp_dark",
        "label": "Попросить выключить свет и закрыть дверь",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_aflat",
        "text": "Сосед вытягивает шнур. Переноска гаснет, голоса стихают. Человек с улицы останавливается за стеклом, не сразу понимая, куда идти дальше.",
        "effects": [
          {"set": "$.c6_lamp.done", "value": true},
          {"set": "$.c6_lamp.result", "value": "dark"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []},
          {"body": "stress", "delta": 5}
        ]
      },
      {
        "id": "c6_lamp_move",
        "label": "Помочь отнести генератор от дома",
        "minutes": 25,
        "terminal": true,
        "goto": "c6_aflat",
        "text": "Вы берёте ручку через два сложенных полотенца. Генератор ставят у глухой стены дальше от дверей. В подъезде понемногу перестаёт пахнуть бензином.",
        "effects": [
          {"set": "$.c6_lamp.done", "value": true},
          {"set": "$.c6_lamp.result", "value": "move"},
          {"body": "fatigue", "delta": 7},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": [{"set": "w.c3_generator_outside", "value": true}]}
        ]
      },
      {
        "id": "c6_lamp_stay",
        "label": "Запереться в квартире",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_aflat",
        "text": "Ты закрываешь свою дверь и подкладываешь ткань внизу. Свет остаётся полосой по краю. Из коридора слышно, как генератор берёт нагрузку.",
        "effects": [{"set": "$.c6_lamp.done", "value": true}, {"set": "$.c6_lamp.result", "value": "stay"}, {"body": "stress", "delta": 8}]
      }
    ],
    "location": "a_flat"
  },
  {
    "id": "c6_patient",
    "for": "any",
    "chapter": "ch3",
    "title": "Ответить у двери Окафора",
    "universal": false,
    "text": [
      {
        "text": "— Поставь стул снаружи, — говорит Окафор. — Если я попрошу открыть, не открывай. — Ключи падают второй раз. Ты видишь их под дверью, но его руки уже не видно."
      },
      {"text": "За дверью царапают ножки табурета. Он всё-таки садится у себя. Ты слышишь, как спина ударяется о дерево."}
    ],
    "onEnter": [{"set": "$.c6_patient.started", "value": true}],
    "actions": [
      {
        "id": "c6_patient_ask",
        "label": "Спросить про температуру",
        "minutes": 8,
        "combinable": true,
        "when": {"not": {"flag": "$.c6_patient.asked"}},
        "text": "— Боль при глотании. Свет. Тридцать девять и четыре, — перечисляет он. Потом спрашивает, который час. Ты отвечаешь; через минуту он спрашивает снова.",
        "effects": [{"set": "$.c6_patient.asked", "value": true}]
      },
      {
        "id": "c6_patient_closed",
        "label": "Пообещать не открывать",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_bflat",
        "text": "Ты говоришь, что понял{m:|а}. Окафор просит повторить вслух. Ты повторяешь. Ключи остаются по его сторону двери.",
        "effects": [
          {"set": "$.c6_patient.done", "value": true},
          {"set": "$.c6_patient.result", "value": "closed"},
          {"if": {"any": [{"me": "B"}, {"not": {"flag": "w.together"}}]}, "then": [{"set": "w.c3_okafor_closed", "value": true}]},
          {"npc": "okafor", "trust": 5},
          {"body": "stress", "delta": 7},
          {"npc": "okafor", "remember": "c3_door_promise"}
        ],
        "when": {"all": [{"any": [{"me": "B"}, {"not": {"flag": "w.together"}}]}, {"always": true}]}
      },
      {
        "id": "c6_patient_care",
        "label": "Подать воду через приоткрытую дверь",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_bflat",
        "effects": [
          {"set": "$.c6_patient.done", "value": true},
          {"set": "$.c6_patient.result", "value": "care"},
          {"takeTag": "drink"},
          {"use": "dressing"},
          {"npc": "okafor", "trust": 7},
          {"if": {"any": [{"me": "B"}, {"not": {"flag": "w.together"}}]}, "then": [{"set": "w.c3_okafor_closed", "value": true}]}
        ],
        "enabled": {"all": [{"hasTag": "drink"}, {"hasTag": "dressing"}]},
        "risky": true,
        "disabledReason": "Нужные вещи сейчас не при тебе",
        "outcomes": [
          {
            "id": "careful",
            "check": {"traits": ["agility", "technical"], "difficulty": 4, "uses": ["mobility", "focus"]},
            "text": "Ты ставишь ногу у створки и проталкиваешь бутылку. Пальцы Окафора сжимают твой рукав. Он отпускает после второго «больно». Дверь закрываешь плечом."
          },
          {
            "id": "hurt",
            "text": "Его пальцы соскальзывают с ткани на кожу. Ты выдёргиваешь руку; на запястье выступает кровь. Из-за двери он сразу начинает извиняться.",
            "effects": [{"injure": "scratch", "site": "leftArm", "severity": 2, "bleeding": 1, "exposure": 0.15}, {"body": "stress", "delta": 12}]
          }
        ],
        "when": {"all": [{"any": [{"me": "B"}, {"not": {"flag": "w.together"}}]}, {"always": true}]}
      },
      {
        "id": "c6_patient_guard",
        "label": "Сообщить дежурному у машины",
        "minutes": 25,
        "terminal": true,
        "goto": "c6_bflat",
        "text": "Дежурный записывает номер двери на запястье маркером. Медика сейчас нет. Ты возвращаешься наверх один{m:|а}, и ключи всё ещё лежат за порогом.",
        "effects": [
          {"set": "$.c6_patient.done", "value": true},
          {"set": "$.c6_patient.result", "value": "guard"},
          {"if": {"any": [{"me": "B"}, {"not": {"flag": "w.together"}}]}, "then": [{"set": "w.c3_okafor_reported", "value": true}]},
          {"body": "fatigue", "delta": 4}
        ],
        "when": {"all": [{"any": [{"me": "B"}, {"not": {"flag": "w.together"}}]}, {"always": true}]}
      },
      {
        "id": "c6_patient_support",
        "label": "Поддержать его просьбу не открывать",
        "minutes": 10,
        "terminal": true,
        "goto": "c6_bflat",
        "when": {"not": {"any": [{"me": "B"}, {"not": {"flag": "w.together"}}]}},
        "text": "Ты говоришь Окафору, что слышал{m:|а} его просьбу. За дверью долго молчат. Потом тихо отвечают: — Спасибо. Напомни, если забуду.",
        "effects": [{"set": "$.c6_patient.done", "value": true}, {"set": "$.c6_patient.result", "value": "support"}, {"body": "stress", "delta": 8}]
      },
      {
        "id": "c6_patient_leave",
        "label": "Вернуться и предупредить {partner.acc}",
        "minutes": 10,
        "terminal": true,
        "goto": "c6_bflat",
        "when": {"not": {"any": [{"me": "B"}, {"not": {"flag": "w.together"}}]}},
        "text": "Ты отходишь от двери, не касаясь стула. {partner} должен{pm:|на} знать, что здесь происходит. Слова сначала приходится проговорить про себя.",
        "effects": [{"set": "$.c6_patient.done", "value": true}, {"set": "$.c6_patient.result", "value": "leave"}, {"body": "stress", "delta": 5}]
      }
    ],
    "location": "b_flat"
  },
  {
    "id": "c6_chain",
    "for": "any",
    "chapter": "ch3",
    "title": "Спуститься на зов снизу",
    "universal": false,
    "text": [
      {"text": "У входа в дом старик держит дверь, пока девушка пытается вынести матрас. Матрас застрял поперёк прохода. С улицы уже кричат."},
      {"text": "Девушка отпускает и сразу садится на матрас. — Одна не могу, — говорит. Из рукава у неё торчит бинт."}
    ],
    "onEnter": [{"set": "$.c6_chain.started", "value": true}],
    "actions": [
      {
        "id": "c6_chain_lift",
        "label": "Поднять угол вместе с девушкой",
        "minutes": 20,
        "terminal": true,
        "goto": "c6_bflat",
        "text": "Вы разворачиваете матрас на ребро. Проволока выходит из косяка, старик выдыхает. Матрас оказывается на тележке, дверь можно наконец закрыть.",
        "effects": [
          {"set": "$.c6_chain.done", "value": true},
          {"set": "$.c6_chain.result", "value": "lift"},
          {"body": "fatigue", "delta": 6},
          {"if": {"any": [{"me": "B"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c6_chain_cut",
        "label": "Помочь срезать зацепившуюся ткань",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_bflat",
        "text": "Девушка сама держит нож. Ты натягиваешь ткань подальше от её пальцев. Матрас сходит с косяка, оставляя клок шерсти на щепке.",
        "effects": [
          {"set": "$.c6_chain.done", "value": true},
          {"set": "$.c6_chain.result", "value": "cut"},
          {"body": "stress", "delta": 4},
          {"if": {"any": [{"me": "B"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c6_chain_inside",
        "label": "Попросить вернуть матрас в подъезд",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_bflat",
        "text": "Вы заталкиваете матрас на первый пролёт. Девушка остаётся рядом с ним. Старик запирает вход и долго не отпускает ручку.",
        "effects": [
          {"set": "$.c6_chain.done", "value": true},
          {"set": "$.c6_chain.result", "value": "inside"},
          {"if": {"any": [{"me": "B"}, {"not": {"flag": "w.together"}}]}, "then": [{"set": "w.c3_bdoor_blocked", "value": true}]},
          {"body": "stress", "delta": 5}
        ]
      }
    ],
    "location": "b_flat"
  },
  {
    "id": "c6_returned",
    "for": "any",
    "chapter": "ch3",
    "title": "Ответить у задней двери",
    "universal": false,
    "text": [
      {"text": "В заднюю дверь стучат рукояткой. Снаружи двое, один просит пустить умыться. Рядом на земле домкрат."},
      {"text": "Они отступают на шаг. Домкрат остаётся перед дверью, как обещанная плата."},
      {"when": {"flag": "w.c3_jack_lent"}, "text": "Ты узнаёшь свой домкрат. Утром его просили на десять минут; прошло полдня."},
      {"when": {"not": {"flag": "w.c3_jack_lent"}}, "text": "Домкрат чужой. Мужчина показывает на него: — Возьмите в залог. Только воды дайте."}
    ],
    "onEnter": [{"set": "$.c6_returned.started", "value": true}],
    "actions": [
      {
        "id": "c6_returned_outside",
        "label": "Передать воду наружу",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_workshop",
        "text": "Ты выставляешь воду и отходишь. Мужчина моет руки прямо над землёй. Домкрат оставляют тебе у крюка.",
        "effects": [
          {"set": "$.c6_returned.done", "value": true},
          {"set": "$.c6_returned.result", "value": "outside"},
          {"take": "water_15"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": [{"set": "w.c3_jack_returned", "value": true}]}
        ],
        "enabled": {"has": "water_15"},
        "disabledReason": "Нужные вещи сейчас не при тебе"
      },
      {
        "id": "c6_returned_wipe",
        "label": "Подать тряпку, сохранив запор",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_workshop",
        "text": "Тряпку забирают за край. Мужчина стирает кровь с костяшек, не глядя на друга. Ты не снимаешь крюк.",
        "effects": [{"set": "$.c6_returned.done", "value": true}, {"set": "$.c6_returned.result", "value": "wipe"}, {"body": "stress", "delta": 5}]
      },
      {
        "id": "c6_returned_no",
        "label": "Отказать обоим",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_workshop",
        "text": "Они уносят домкрат вместе с собой. Один придерживает его за ручку, другой за основание. До улицы молчат.",
        "effects": [{"set": "$.c6_returned.done", "value": true}, {"set": "$.c6_returned.result", "value": "no"}, {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}]
      }
    ],
    "location": "deniz_workshop"
  },
  {
    "id": "c6_window",
    "for": "any",
    "chapter": "ch3",
    "title": "Проверить свет за окном",
    "universal": false,
    "text": [{"text": "В боковое окно светят фонарём. На стекле появляется ладонь, потом вторая. Никто не зовёт."}],
    "onEnter": [{"set": "$.c6_window.started", "value": true}],
    "actions": [
      {
        "id": "c6_window_still",
        "label": "Ждать в темноте",
        "minutes": 25,
        "terminal": true,
        "goto": "c6_workshop",
        "text": "Ты сидишь за верстаком, пока кисть не исчезает из окна. Фонарь ещё лежит снаружи. За ним возвращаются позже.",
        "effects": [{"set": "$.c6_window.done", "value": true}, {"set": "$.c6_window.result", "value": "still"}, {"body": "stress", "delta": 10}]
      },
      {
        "id": "c6_window_noise",
        "label": "Отвлечь звуком в пустом боксе",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_workshop",
        "text": "Ты катишь гайку через щель к соседнему железу. Ладонь с окна исчезает. Снаружи шаркают туда, где звякнуло.",
        "effects": [
          {"set": "$.c6_window.done", "value": true},
          {"set": "$.c6_window.result", "value": "noise"},
          {"body": "stress", "delta": 8},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c6_window_rear",
        "label": "Укрыться за задней дверью",
        "minutes": 20,
        "terminal": true,
        "goto": "c6_workshop",
        "text": "Ты уносишь рюкзак в заднюю комнату. Дверь прикрываешь медленно, без щелчка. К светящемуся окну больше не подходишь.",
        "effects": [{"set": "$.c6_window.done", "value": true}, {"set": "$.c6_window.result", "value": "rear"}, {"body": "fatigue", "delta": 4}]
      }
    ],
    "location": "deniz_workshop"
  },
  {
    "id": "c6_knives",
    "for": "any",
    "chapter": "ch3",
    "title": "Подойти к спору у плиты",
    "universal": false,
    "text": [
      {"text": "Биргит ставит перед Уве полную кастрюлю. Он отодвигает свою тарелку. Мерле уносит со стола ножи."},
      {"text": "Он хочет вынести часть соседям. Биргит не хочет открывать дверь незнакомым."}
    ],
    "onEnter": [{"set": "$.c6_knives.started", "value": true}],
    "actions": [
      {
        "id": "c6_knives_carry",
        "label": "Отнести еду вместе с Уве",
        "minutes": 30,
        "terminal": true,
        "goto": "c6_ahr",
        "text": "Ты держишь калитку, пока Уве ставит кастрюлю на порог соседей. В дверь отвечают живым голосом. Назад вы несёте пустые руки.",
        "effects": [
          {"set": "$.c6_knives.done", "value": true},
          {"set": "$.c6_knives.result", "value": "carry"},
          {"npc": "uwe", "trust": 5},
          {"body": "fatigue", "delta": 4},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c6_knives_door",
        "label": "Передать еду только у калитки",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_ahr",
        "text": "Уве зовёт через ограду. Кастрюлю забирают, не заходя во двор. Биргит стоит у окна, пока калитка не закрывается.",
        "effects": [
          {"set": "$.c6_knives.done", "value": true},
          {"set": "$.c6_knives.result", "value": "door"},
          {"npc": "birgit", "trust": 4},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c6_knives_keep",
        "label": "Предложить оставить своим",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_ahr",
        "text": "Биргит плотно закрывает крышку. Уве встаёт из-за стола. Его тарелка так и остаётся пустой.",
        "effects": [
          {"set": "$.c6_knives.done", "value": true},
          {"set": "$.c6_knives.result", "value": "keep"},
          {"npc": "uwe", "trust": -5},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      }
    ],
    "location": "ahrensburg"
  },
  {
    "id": "c6_cooler",
    "for": "any",
    "chapter": "ch3",
    "title": "Проверить открытый холодильник",
    "universal": false,
    "text": [
      {"text": "Мерле стоит перед холодильником с пустой коробкой. На полке, где лежали ручки, банки с остывающим мясом."},
      {"text": "Мерле называет мать, но без злости. Биргит отвечает из кладовки, что всё положила наверх."}
    ],
    "onEnter": [{"set": "$.c6_cooler.started", "value": true}],
    "actions": [
      {
        "id": "c6_cooler_ask",
        "label": "Проверить верхнюю полку",
        "minutes": 8,
        "combinable": true,
        "when": {"not": {"flag": "$.c6_cooler.asked"}},
        "text": "Там за миской действительно коробка. Одна ручка упирается в заднюю стенку. Биргит подходит с полотенцем. — Я не знала. — Мерле долго не поднимает головы.",
        "effects": [{"set": "$.c6_cooler.asked", "value": true}]
      },
      {
        "id": "c6_cooler_mark",
        "label": "Выделить полку только для лекарства",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_ahr",
        "text": "Ты освобождаешь небольшой угол, не касаясь ручек. Мерле ставит коробку туда сама. Биргит проверяет, что горячих банок рядом больше нет.",
        "effects": [
          {"set": "$.c6_cooler.done", "value": true},
          {"set": "$.c6_cooler.result", "value": "mark"},
          {"npc": "merle", "trust": 5},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c6_cooler_pack",
        "label": "Помочь подготовить переноску",
        "minutes": 20,
        "terminal": true,
        "goto": "c6_ahr",
        "text": "Мерле сама укладывает лекарство, ты подбираешь холодные бутылки. Между ними ткань. Ничего не касается ледяной стенки.",
        "effects": [
          {"set": "$.c6_cooler.done", "value": true},
          {"set": "$.c6_cooler.result", "value": "pack"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": [{"npc": "merle", "set": {"cooler": true}, "trust": 4}]},
          {"body": "fatigue", "delta": 3}
        ]
      },
      {
        "id": "c6_cooler_leave",
        "label": "Дать им разобраться самим",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_ahr",
        "text": "Ты закрываешь шкаф и выходишь из кухни. За дверью Мерле говорит тише. Биргит отвечает уже без оправданий.",
        "effects": [{"set": "$.c6_cooler.done", "value": true}, {"set": "$.c6_cooler.result", "value": "leave"}]
      }
    ],
    "location": "ahrensburg"
  },
  {
    "id": "c6_doorline",
    "for": "any",
    "chapter": "ch3",
    "title": "Подойти к людям у входа",
    "universal": false,
    "text": [
      {"text": "У дверей спортзала ещё трое с сумками. Дежурная просит назвать свободные места. Из зала кто-то отвечает: «Никаких»."},
      {"text": "Она показывает на складную ширму. За ней можно поставить ещё мат, но дальше некуда."}
    ],
    "onEnter": [{"set": "$.c6_doorline.started", "value": true}],
    "actions": [
      {
        "id": "c6_doorline_shift",
        "label": "Взять наружное дежурство",
        "minutes": 30,
        "terminal": true,
        "goto": "c6_north",
        "text": "Ты помогаешь перенести коробки и остаёшься у палатки. Приезжие снимают сумки только внутри. В зал ты возвращаешься уже после раздачи.",
        "effects": [
          {"set": "$.c6_doorline.done", "value": true},
          {"set": "$.c6_doorline.result", "value": "shift"},
          {"body": "fatigue", "delta": 8},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c6_doorline_space",
        "label": "Потесниться у своей раскладушки",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_north",
        "text": "Ты сдвигаешь вещи к стене. Для одного мата хватает. Двое других остаются у ширмы, но уже внутри.",
        "effects": [
          {"set": "$.c6_doorline.done", "value": true},
          {"set": "$.c6_doorline.result", "value": "space"},
          {"body": "stress", "delta": 5},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c6_doorline_limit",
        "label": "Поддержать отказ в ночлеге",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_north",
        "text": "Дежурная выносит одеяла на ступеньки. Трое забирают их по одному. Дверь закрывают до того, как они уходят.",
        "effects": [
          {"set": "$.c6_doorline.done", "value": true},
          {"set": "$.c6_doorline.result", "value": "limit"},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []},
          {"body": "stress", "delta": 7}
        ]
      }
    ],
    "location": "north_gym"
  },
  {
    "id": "c6_burner",
    "for": "any",
    "chapter": "ch3",
    "title": "Удержать очередь от котла",
    "universal": false,
    "text": [
      {"text": "У полевой кухни гаснет горелка. Пожарный отпихивает людей от шланга и кричит закрыть вентиль. Из-под котла шипит."},
      {"text": "Очередь двигается неохотно. Слышно больше ложек, чем голосов."}
    ],
    "onEnter": [{"set": "$.c6_burner.started", "value": true}],
    "actions": [
      {
        "id": "c6_burner_fair",
        "label": "Помочь разделить остаток поровну",
        "minutes": 25,
        "terminal": true,
        "goto": "c6_north",
        "text": "Ты подаёшь по одной пачке. Пожарный режет сосиски на одинаковые части. Твою порцию откладывают последней.",
        "effects": [
          {"set": "$.c6_burner.done", "value": true},
          {"set": "$.c6_burner.result", "value": "fair"},
          {"body": "fatigue", "delta": 5},
          {"if": {"any": [{"me": "A"}, {"not": {"flag": "w.together"}}]}, "then": []}
        ]
      },
      {
        "id": "c6_burner_give",
        "label": "Отдать свою порцию тем, кто ждал",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_north",
        "text": "Ты отходишь от стола без миски. Женщина за спиной двигает тебе стул, не зная зачем. Ты садишься.",
        "effects": [{"set": "$.c6_burner.done", "value": true}, {"set": "$.c6_burner.result", "value": "give"}, {"body": "hunger", "delta": 15}]
      },
      {
        "id": "c6_burner_mine",
        "label": "Взять свой паёк и уйти",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_north",
        "text": "Ты берёшь закрытую пачку. За спиной спорят про очередь, но на твою порцию никто не тянется.",
        "effects": [{"set": "$.c6_burner.done", "value": true}, {"set": "$.c6_burner.result", "value": "mine"}, {"give": "crackers"}, {"body": "stress", "delta": 4}]
      }
    ],
    "location": "north_gym"
  },
  {
    "id": "c6_feverline",
    "for": "any",
    "chapter": "ch3",
    "title": "Посмотреть на остановившуюся очередь",
    "universal": false,
    "text": [
      {"text": "У кухни очередь встаёт. Человек с миской сел прямо на пол, не дойдя до стола. Миску держит ровно."},
      {"text": "Он кивает и пытается улыбнуться. Ложка стучит о миску от дрожи."}
    ],
    "onEnter": [{"set": "$.c6_feverline.started", "value": true}],
    "actions": [
      {
        "id": "c6_feverline_help",
        "label": "Помочь освободить проход",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_messe",
        "text": "Ты убираешь чужие сумки от ножек носилок. К человеку не прикасаешься. После него на полу мокрый квадрат одежды.",
        "effects": [{"set": "$.c6_feverline.done", "value": true}, {"set": "$.c6_feverline.result", "value": "help"}, {"body": "fatigue", "delta": 4}]
      },
      {
        "id": "c6_feverline_find",
        "label": "Найти его ряд и передать весть",
        "minutes": 20,
        "terminal": true,
        "goto": "c6_messe",
        "text": "Ты находишь женскую куртку на названной койке. Её хозяйка слушает, затем берёт сумку. Спасибо говорит уже на ходу.",
        "effects": [{"set": "$.c6_feverline.done", "value": true}, {"set": "$.c6_feverline.result", "value": "find"}, {"body": "stress", "delta": 5}]
      },
      {
        "id": "c6_feverline_back",
        "label": "Вернуться за своей порцией",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_messe",
        "text": "Очередь пропускает тебя без спора. На раздаче дают миску. Ты не ставишь её там, где стояла чужая.",
        "effects": [{"set": "$.c6_feverline.done", "value": true}, {"set": "$.c6_feverline.result", "value": "back"}, {"body": "hunger", "delta": -20}, {"body": "stress", "delta": 6}]
      }
    ],
    "location": "messe"
  },
  {
    "id": "c6_latch",
    "for": "any",
    "chapter": "ch3",
    "title": "Подойти к запасной двери",
    "universal": false,
    "text": [
      {"text": "Солдат привязывает запасную дверь лентой. За ней выкатывают мусорные баки. Волонтёр пытается ему что-то объяснить."},
      {"text": "Солдат показывает на холодный сквозняк. Волонтёр показывает на зелёную табличку над дверью."}
    ],
    "onEnter": [{"set": "$.c6_latch.started", "value": true}],
    "actions": [
      {
        "id": "c6_latch_clear",
        "label": "Помочь расчистить проход",
        "minutes": 25,
        "terminal": true,
        "goto": "c6_messe",
        "text": "Ты двигаешь коробки к стене. Старший велит оставить ручку свободной. Лента остаётся только на баках, не на двери.",
        "effects": [{"set": "$.c6_latch.done", "value": true}, {"set": "$.c6_latch.result", "value": "clear"}, {"body": "fatigue", "delta": 6}, {"set": "$.messe_exit", "value": true}]
      },
      {
        "id": "c6_latch_ask",
        "label": "Настаивать на свободной ручке",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_messe",
        "text": "Ты просишь проверить дверь изнутри. Старший сам нажимает ручку и кивает солдату. Ленту перерезают у петли.",
        "effects": [{"set": "$.c6_latch.done", "value": true}, {"set": "$.c6_latch.result", "value": "ask"}, {"body": "stress", "delta": 7}, {"set": "$.messe_exit", "value": true}]
      },
      {
        "id": "c6_latch_leave",
        "label": "Оставить спор дежурным",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_messe",
        "text": "Ты возвращаешься в ряд. По пути приходится дважды перелезть через чужие сумки. Их хозяева не просыпаются.",
        "effects": [{"set": "$.c6_latch.done", "value": true}, {"set": "$.c6_latch.result", "value": "leave"}]
      }
    ],
    "location": "messe"
  },
  {
    "id": "c6_letter",
    "for": "any",
    "chapter": "ch3",
    "title": "Подойти к медсестре с конвертом",
    "universal": false,
    "text": [
      {"text": "Медсестра стоит в проходе с незапечатанным конвертом. Спрашивает, кто умеет разобрать почерк на мокром листке."},
      {"text": "Имя короткое, фамилия длиннее строки. Ты произносишь по слогам, медсестра повторяет."}
    ],
    "onEnter": [{"set": "$.c6_letter.started", "value": true}],
    "actions": [
      {
        "id": "c6_letter_read",
        "label": "Помочь найти адресата через дежурного",
        "minutes": 25,
        "terminal": true,
        "goto": "c6_q",
        "text": "Медсестра сверяет улицу с регистрацией. Письмо уходит в другой ряд, к живой руке. Женщина там прижимает бумагу к груди.",
        "effects": [{"set": "$.c6_letter.done", "value": true}, {"set": "$.c6_letter.result", "value": "read"}, {"body": "stress", "delta": -4}]
      },
      {
        "id": "c6_letter_desk",
        "label": "Предложить оставить у регистратора",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_q",
        "text": "Конверт кладут в прозрачную папку. Медсестра пишет снаружи найденную улицу. На прозрачной папке отпечаток мокрого пальца.",
        "effects": [{"set": "$.c6_letter.done", "value": true}, {"set": "$.c6_letter.result", "value": "desk"}]
      },
      {
        "id": "c6_letter_back",
        "label": "Вернуться к своему месту",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_q",
        "text": "Ты говоришь, что дальше не разберёшь. Медсестра благодарит и переставляет конверт в сухой карман. На форме остаётся мокрое пятно.",
        "effects": [{"set": "$.c6_letter.done", "value": true}, {"set": "$.c6_letter.result", "value": "back"}, {"body": "stress", "delta": 3}]
      }
    ],
    "location": "messe_q"
  },
  {
    "id": "c6_sleepless",
    "for": "any",
    "chapter": "ch3",
    "title": "Ответить соседу у койки",
    "universal": false,
    "text": [
      {"text": "Сосед с бинтом на ноге просит разбудить его перед следующим осмотром. Уже второй раз за пять минут спрашивает, который час."},
      {"text": "Боится, что заберут вещи. Его сумка лежит прямо под больной ногой."}
    ],
    "onEnter": [{"set": "$.c6_sleepless.started", "value": true}],
    "actions": [
      {
        "id": "c6_sleepless_watch",
        "label": "Посидеть рядом до осмотра",
        "minutes": 25,
        "terminal": true,
        "goto": "c6_q",
        "text": "Ты садишься так, чтобы видеть его сумку. Сосед наконец засыпает. Разбудить приходится с третьего зова, не касаясь плеча.",
        "effects": [{"set": "$.c6_sleepless.done", "value": true}, {"set": "$.c6_sleepless.result", "value": "watch"}, {"body": "fatigue", "delta": 5}]
      },
      {
        "id": "c6_sleepless_tie",
        "label": "Помочь привязать сумку к койке",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_q",
        "text": "Он сам продевает ремень вокруг ножки. Ты придерживаешь край матраса. Теперь сумку не забрать без него.",
        "effects": [{"set": "$.c6_sleepless.done", "value": true}, {"set": "$.c6_sleepless.result", "value": "tie"}, {"body": "stress", "delta": -2}]
      },
      {
        "id": "c6_sleepless_nurse",
        "label": "Оставить это медсестре",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_q",
        "text": "Медсестра двигает сумку к изголовью. Сосед смотрит ей вслед и снова спрашивает время. Ты отвечаешь ещё раз.",
        "effects": [{"set": "$.c6_sleepless.done", "value": true}, {"set": "$.c6_sleepless.result", "value": "nurse"}]
      }
    ],
    "location": "messe_q"
  },
  {
    "id": "c6_box",
    "for": "any",
    "chapter": "ch3",
    "title": "Ответить женщине с коробкой",
    "universal": false,
    "text": [
      {"text": "Женщина ставит у твоего укрытия коробку и просит последить. Говорит, что вернётся через пять минут. Уже поворачивается уходить."},
      {"text": "— Посуда. Бумаги. — Она отвечает слишком быстро. Коробка перевязана обычным шпагатом."}
    ],
    "onEnter": [{"set": "$.c6_box.started", "value": true}],
    "actions": [
      {
        "id": "c6_box_wait",
        "label": "Подождать её с коробкой",
        "minutes": 30,
        "terminal": true,
        "goto": "c6_out",
        "text": "Ты сдвигаешь коробку от прохода и остаёшься рядом. Женщина возвращается с водой, запыхавшись. Коробку уносит, не ставя снова на землю.",
        "effects": [{"set": "$.c6_box.done", "value": true}, {"set": "$.c6_box.result", "value": "wait"}, {"body": "fatigue", "delta": 4}]
      },
      {
        "id": "c6_box_carry",
        "label": "Пойти с ней и помочь нести",
        "minutes": 25,
        "terminal": true,
        "goto": "c6_out",
        "text": "Ты берёшь коробку, она канистру. У раздачи держитесь рядом. Шпагат оставляет на ладони тонкую красную полосу.",
        "effects": [{"set": "$.c6_box.done", "value": true}, {"set": "$.c6_box.result", "value": "carry"}, {"body": "fatigue", "delta": 7}]
      },
      {
        "id": "c6_box_refuse",
        "label": "Отказаться отвечать за чужое",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_out",
        "text": "Женщина снова берёт коробку. Канистру цепляет пальцами за край ручки. Уходит медленнее, чем пришла.",
        "effects": [{"set": "$.c6_box.done", "value": true}, {"set": "$.c6_box.result", "value": "refuse"}, {"body": "stress", "delta": 4}]
      }
    ]
  },
  {
    "id": "c6_cold",
    "for": "any",
    "chapter": "ch3",
    "title": "Прислушаться к кашлю рядом",
    "universal": false,
    "text": [
      {"text": "У соседней стены кашляет человек в тонкой куртке. Он сел недавно и уже не держит голову прямо. Сумка у него раскрыта."},
      {"text": "Имя слышно с первого раза. Потом он называет город, хотя ты не спрашиваешь."}
    ],
    "onEnter": [{"set": "$.c6_cold.started", "value": true}],
    "actions": [
      {
        "id": "c6_cold_shelter",
        "label": "Уступить ему сухой угол",
        "minutes": 20,
        "terminal": true,
        "goto": "c6_out",
        "text": "Ты помогаешь перенести сумку, не касаясь лица. Он садится на картон и прячет руки под мышки. Твой рюкзак теперь ближе к ветру.",
        "effects": [{"set": "$.c6_cold.done", "value": true}, {"set": "$.c6_cold.result", "value": "shelter"}, {"body": "stress", "delta": 6}]
      },
      {
        "id": "c6_cold_water",
        "label": "Дать закрытую бутылку",
        "minutes": 12,
        "terminal": true,
        "goto": "c6_out",
        "text": "Он берёт её обеими руками. Крышку откручивает долго, не прося помочь. Документы всё это время держит локтем.",
        "effects": [{"set": "$.c6_cold.done", "value": true}, {"set": "$.c6_cold.result", "value": "water"}, {"take": "water_05"}],
        "enabled": {"has": "water_05"},
        "disabledReason": "Нужные вещи сейчас не при тебе"
      },
      {
        "id": "c6_cold_service",
        "label": "Позвать дежурного с улицы",
        "minutes": 25,
        "terminal": true,
        "goto": "c6_out",
        "text": "Дежурного приходится искать за перекрёстком. Ты возвращаешься с ним, показываешь стену и отходишь. Человек всё ещё отвечает на имя.",
        "effects": [{"set": "$.c6_cold.done", "value": true}, {"set": "$.c6_cold.result", "value": "service"}, {"body": "fatigue", "delta": 6}]
      }
    ]
  },
  {
    "id": "c6_medicine",
    "for": "any",
    "chapter": "ch3",
    "location": "b_flat",
    "title": "У нижней двери",
    "universal": false,
    "text": [
      {
        "text": "Женщина снизу ставит на ступеньку пустую коробку таблеток. — Отец на третьем. Он сам не спустится. — Она просит посидеть с ним, пока сходит к дежурным. Дверь внизу остаётся открытой."
      }
    ],
    "actions": [
      {
        "id": "c6_medicine_sit",
        "label": "Посидеть с ним до её возвращения",
        "minutes": 45,
        "terminal": true,
        "goto": "c6_bflat",
        "text": "Мужчина спрашивает, который час, и извиняется за холод. Ты сидишь у двери, пока на лестнице не появляются знакомые шаги. Женщина вернулась без таблеток.",
        "effects": [{"set": "$.c6_medicine.result", "value": "sit"}, {"body": "fatigue", "delta": 5}, {"set": "$.c6_medicine.done", "value": true}]
      },
      {
        "id": "c6_medicine_ask",
        "label": "Сходить за дежурным вместо неё",
        "minutes": 35,
        "terminal": true,
        "goto": "c6_bflat",
        "text": "Ты находишь дежурного у машины. Он записывает название с коробки и обещает подойти после очереди. Женщина остаётся с отцом; за окном уже сумерки.",
        "effects": [{"set": "$.c6_medicine.result", "value": "ask"}, {"body": "fatigue", "delta": 7}, {"set": "$.c6_medicine.done", "value": true}]
      },
      {
        "id": "c6_medicine_no",
        "label": "Отказаться уходить от своей двери",
        "minutes": 3,
        "terminal": true,
        "goto": "c6_bflat",
        "text": "Женщина поднимает коробку. — Я ненадолго, — говорит она уже отцу, а не тебе. Шаги вниз быстрые, вверх он не идёт.",
        "effects": [{"set": "$.c6_medicine.result", "value": "no"}, {"body": "stress", "delta": 7}, {"set": "$.c6_medicine.done", "value": true}]
      }
    ]
  }
];

export const afternoon12Events: WorldEvent[] = [
  {
    "id": "ev_c6_visitor",
    "at": 3740,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3740}, {"before": 4200}, {"all": [{"npc": "c3_koehler", "alive": true, "at": "hof_luedemann"}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}, {"npc": "ole", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c6_visitor.done"}}]}, {"at": "hof_luedemann"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "У сетки женщина с велосипедной тележкой. На мешке сидит белая от пыли кошка. Женщина просит позвать хозяйку."}]
  },
  {
    "id": "ev_c6_rope",
    "at": 3970,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3970}, {"before": 4200}, {"all": [{"npc": "ole", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c6_rope.done"}}]}, {"at": "hof_luedemann"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "У сарая Оле спорит с Денизом. Между ними на козлах разобранный генератор. Дениз держит пустую бензиновую канистру."}]
  },
  {
    "id": "ev_c6_voice",
    "at": 3790,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3790}, {"before": 4200}, {"all": [{"npc": "kerem", "alive": true, "at": "hof_luedemann"}, {"npc": "deniz", "alive": true, "at": "hof_luedemann"}]}, {"not": {"flag": "$.c6_voice.done"}}]}, {"at": "farm_coop"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "За кирпичной стеной кто-то тихо плачет. Потом слышен голос Керема: просит не звать Оле. В дверь никто не стучит."}]
  },
  {
    "id": "ev_c6_candle",
    "at": 4005,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 4005}, {"before": 4200}, {"npc": "henrike", "alive": true, "at": "hof_luedemann"}, {"not": {"flag": "$.c6_candle.done"}}]}, {"at": "farm_coop"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Свеча у порога наклоняется в мягком воске. В соломе чернеет тонкая дорожка. Дым поднимается прямо к нарам."}]
  },
  {
    "id": "ev_c6_container",
    "at": 3755,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3755}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_container.done"}}]}, {"any": [{"at": "a_flat"}, {"at": "a_stairs"}]}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Сосед снизу зовёт у окна. В руках у него канистра, из горлышка торчит соломинка. Просит помочь поднять воду на третий этаж."}]
  },
  {
    "id": "ev_c6_lamp",
    "at": 3980,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3980}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_lamp.done"}}]}, {"any": [{"at": "a_flat"}, {"at": "a_stairs"}]}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Внизу вдруг загорается яркая переноска. Чужие голоса смеются у распахнутой входной двери. Свет идёт по перилам до твоего этажа."}]
  },
  {
    "id": "ev_c6_patient",
    "at": 3720,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3720}, {"before": 4200}, {"all": [{"npc": "okafor", "alive": true, "at": "b_okafor"}, {"npcVar": "okafor", "key": "bitten"}]}, {"not": {"flag": "$.c6_patient.done"}}]}, {"any": [{"at": "b_flat"}, {"at": "b_stairs"}, {"at": "b_okafor"}]}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Окафор дважды роняет связку ключей. Потом просит через дверь поставить стул на площадке. Голос у него ломается на гласных."}]
  },
  {
    "id": "ev_c6_chain",
    "at": 3940,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3940}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_chain.done"}}]}, {"any": [{"at": "b_flat"}, {"at": "b_stairs"}, {"at": "b_okafor"}]}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "У входа в дом старик держит дверь, пока девушка пытается вынести матрас. Матрас застрял поперёк прохода. С улицы уже кричат."}]
  },
  {
    "id": "ev_c6_returned",
    "at": 3810,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3810}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_returned.done"}}]}, {"at": "deniz_workshop"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "В заднюю дверь стучат рукояткой. Снаружи двое, один просит пустить умыться. Рядом на земле домкрат."}]
  },
  {
    "id": "ev_c6_window",
    "at": 4035,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 4035}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_window.done"}}]}, {"at": "deniz_workshop"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "В боковое окно светят фонарём. На стекле появляется ладонь, потом вторая. Никто не зовёт."}]
  },
  {
    "id": "ev_c6_knives",
    "at": 3765,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3765}, {"before": 4200}, {"all": [{"npc": "uwe", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}, {"not": {"flag": "$.c6_knives.done"}}]}, {"at": "ahrensburg"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Биргит ставит перед Уве полную кастрюлю. Он отодвигает свою тарелку. Мерле уносит со стола ножи."}]
  },
  {
    "id": "ev_c6_cooler",
    "at": 3950,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3950}, {"before": 4200}, {"all": [{"npc": "merle", "alive": true, "at": "ahrensburg"}, {"npc": "birgit", "alive": true, "at": "ahrensburg"}]}, {"not": {"flag": "$.c6_cooler.done"}}]}, {"at": "ahrensburg"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Мерле стоит перед холодильником с пустой коробкой. На полке, где лежали ручки, банки с остывающим мясом."}]
  },
  {
    "id": "ev_c6_doorline",
    "at": 3825,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3825}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_doorline.done"}}]}, {"at": "north_gym"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "У дверей спортзала ещё трое с сумками. Дежурная просит назвать свободные места. Из зала кто-то отвечает: «Никаких»."}]
  },
  {
    "id": "ev_c6_burner",
    "at": 3990,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3990}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_burner.done"}}]}, {"at": "north_gym"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "У полевой кухни гаснет горелка. Пожарный отпихивает людей от шланга и кричит закрыть вентиль. Из-под котла шипит."}]
  },
  {
    "id": "ev_c6_feverline",
    "at": 3770,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3770}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_feverline.done"}}]}, {"at": "messe"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "У кухни очередь встаёт. Человек с миской сел прямо на пол, не дойдя до стола. Миску держит ровно."}]
  },
  {
    "id": "ev_c6_latch",
    "at": 3965,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3965}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_latch.done"}}]}, {"at": "messe"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Солдат привязывает запасную дверь лентой. За ней выкатывают мусорные баки. Волонтёр пытается ему что-то объяснить."}]
  },
  {
    "id": "ev_c6_letter",
    "at": 3800,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3800}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_letter.done"}}]}, {"at": "messe_q"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Медсестра стоит в проходе с незапечатанным конвертом. Спрашивает, кто умеет разобрать почерк на мокром листке."}]
  },
  {
    "id": "ev_c6_sleepless",
    "at": 4030,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 4030}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_sleepless.done"}}]}, {"at": "messe_q"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Сосед с бинтом на ноге просит разбудить его перед следующим осмотром. Уже второй раз за пять минут спрашивает, который час."}]
  },
  {
    "id": "ev_c6_box",
    "at": 3830,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3830}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_box.done"}}]}, {"scene": "c6_out"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "Женщина ставит у твоего укрытия коробку и просит последить. Говорит, что вернётся через пять минут. Уже поворачивается уходить."}]
  },
  {
    "id": "ev_c6_cold",
    "at": 4060,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 4060}, {"before": 4200}, {"all": []}, {"not": {"flag": "$.c6_cold.done"}}]}, {"scene": "c6_out"}]},
    "effects": [],
    "news": [{"channel": "direct", "text": "У соседней стены кашляет человек в тонкой куртке. Он сел недавно и уже не держит голову прямо. Сумка у него раскрыта."}]
  },
  {
    "id": "ev_c6_medicine",
    "at": 3725,
    "scope": "world",
    "interrupt": true,
    "when": {"all": [{"all": [{"cp": 5}, {"not": {"cp": 6}}, {"after": 3725}, {"before": 4140}, {"not": {"npcVar": "okafor", "key": "bitten"}}, {"not": {"flag": "$.c6_medicine.done"}}]}, {"any": [{"at": "b_flat"}, {"at": "b_stairs"}, {"at": "b_okafor"}]}]},
    "news": [{"channel": "direct", "text": "На лестнице женщина спрашивает, кто может посидеть с её отцом. Он наверху, сам не спускается."}]
  }
];
