import type { Scene } from '../../engine/content-types';
import { not } from './world3';
import { S11, day11, kept11, wound11, yard11 } from './point11';

export const noon11Scenes: Scene[] = [
  S11({ id: 'c11_wake', for: 'any', chapter: 'ch3', title: 'Мама', camp: yard11, ambient: day11,
    onEnter: [{ set: 'w.c11_immune_seen', value: true }],
    text: [{ text: 'Хенрике вдруг вскакивает.\n\n— Он сказал «мама». Вы слышали? Он сказал «мама»!\n\nИз-за двери — слабый, хриплый голос:\n\n— Пить… Мам. Пить дай.\n\nДениз поднимает руку: не открывать. Подходит к щели сам и долго смотрит.\n\n— Оле, — говорит он. — Как меня зовут?\n\nПауза.\n\n— Дениз, — отвечают из-за двери. — Дурак ты, Дениз. Дай пить.' }],
    actions: [
      { id: 'c11_w_open', label: 'Сказать: открывайте, но осторожно', minutes: 4, terminal: true, goto: 'c11_wake2',
        text: 'Дениз встаёт сбоку от двери, ты — с другой стороны. Хенрике отодвигает щеколду. Оле не бросается. Он лежит на соломе и щурится на свет.', effects: [{ set: '$.c11_wake', value: 'open' }, { npc: 'henrike', trust: 2 }] },
      { id: 'c11_w_check', label: 'Попросить сначала задать ему ещё вопросы', minutes: 6, terminal: true, goto: 'c11_wake2',
        text: 'Дениз спрашивает, какой сегодня день. Оле не знает. Спрашивает, кто стоит рядом с ним. Оле называет тебя по имени. Потом Хенрике. Потом говорит: «Нина. Девчонка с ключом». Дениз оборачивается к вам и кивает.', effects: [{ set: '$.c11_wake', value: 'check' }] },
      { id: 'c11_w_water', label: 'Просунуть ему в щель кружку воды', minutes: 4, terminal: true, goto: 'c11_wake2',
        text: 'Ты просовываешь кружку под дверь. Слышно, как он пьёт — жадно, захлёбываясь. Кружка возвращается пустой. Тогда Хенрике открывает дверь, и никто её не останавливает.', effects: [{ set: '$.c11_wake', value: 'water' }, { npc: 'ole', trust: 2 }] },
    ] }),

  S11({ id: 'c11_wake2', for: 'any', chapter: 'ch3', title: 'Жар спал', camp: yard11, ambient: day11,
    text: [
      { text: 'Оле лежит на соломе, мокрый и бледный. Хенрике держит ладонь у него на лбу и плачет без звука: лоб прохладный. Рука распухла до локтя, но пальцами он шевелит.\n\n— Я думал, всё, — говорит Оле. — Думал, я уже.\n\nКерем стоит в дверях и не верит своим глазам. За его спиной — Нина.' },
      { when: wound11('bite'), text: 'Хенрике прижимает к себе сына укушенной рукой. Про свою руку сейчас не думает никто. Кроме тебя.' },
    ],
    actions: [
      { id: 'c11_w2_ole', label: 'Подойти к Оле', minutes: 4, terminal: true, goto: 'c11_nina_why', effects: [{ set: '$.c11_w2', value: 'ole' }, { npc: 'ole', trust: 2 }],
        outcomes: [
          { id: 'promise', when: { v: '$.c10_door', op: '==', value: 'promise' }, text: 'Оле смотрит на тебя снизу вверх.\n\n— Ты обещал{m:|а}, — говорит он. — Про Дениза. Помнишь? — Он слабо усмехается. — Не пригодилось.' },
          { id: 'plain', text: 'Оле смотрит на тебя снизу вверх.\n\n— Ночью я слышал тебя за дверью, — говорит он. — Спасибо, что не открыл{m:|а}.' },
        ] },
      { id: 'c11_w2_air', label: 'Выйти на воздух', minutes: 5, activity: 'rest', terminal: true, goto: 'c11_nina_why',
        text: 'Во дворе ты садишься прямо на землю. Руки трясутся сильнее, чем ночью. {partner} садится рядом и ничего не говорит.', effects: [{ set: '$.c11_w2', value: 'air' }, { body: 'stress', delta: -4 }] },
      { id: 'c11_w2_deniz', label: 'Спросить Дениза, слышал ли он о таком', minutes: 3, terminal: true, goto: 'c11_nina_why',
        text: '— Нет. — Дениз трёт лицо ладонями. — Никто не слышал. Или слышали и не верили.', effects: [{ set: '$.c11_w2', value: 'deniz' }] },
    ] }),

  S11({ id: 'c11_nina_why', for: 'any', chapter: 'ch3', title: 'А папа?', camp: yard11, ambient: day11,
    text: [
      { text: 'Нина выходит из-за спины Керема. Смотрит на Оле, потом на тебя.\n\n— А папа? — спрашивает она тихо. — Почему он, а не папа?' },
      { when: kept11, text: '— Может, папу тоже надо подождать? Может, у него тоже пройдёт?\n\nОна оборачивается к фургону.' },
      { when: not(kept11), text: 'Она смотрит на закрытую дверцу фургона и больше ничего не спрашивает.' },
    ],
    actions: [
      { id: 'c11_nw_truth', label: 'Сказать правду: у её отца это уже случилось, обратно не бывает', minutes: 4, terminal: true, goto: 'c11_after',
        text: 'Нина слушает, не перебивая. Потом говорит:\n\n— Значит, он просто не успел. А Оле успел.\n\nИ уходит к фургону одна.', effects: [{ set: '$.c11_nw', value: 'truth' }, { body: 'stress', delta: 3 }] },
      { id: 'c11_nw_hold', label: 'Обнять её', minutes: 5, terminal: true, goto: 'c11_after',
        text: 'Нина стоит прямо, как палка. Потом утыкается тебе в плечо и плачет — в первый раз за всё время.', effects: [{ set: '$.c11_nw', value: 'hold' }, { npc: 'c7_nina', trust: 3 }] },
      { id: 'c11_nw_dontknow', label: 'Сказать, что не знаешь', minutes: 3, terminal: true, goto: 'c11_after',
        text: '— Никто не знает, — говорит Нина. — Я уже поняла.', effects: [{ set: '$.c11_nw', value: 'dontknow' }] },
    ] }),

  S11({ id: 'c11_after', for: 'any', chapter: 'ch3', title: 'Что теперь', camp: yard11, ambient: day11,
    text: [
      { text: 'Оле перенесли в дом. Он спит, впервые за сутки по-настоящему. Хенрике выходит к вам на крыльцо.\n\n— Я вам врала, — говорит она. — Вчера весь день и ночью. Каждому своё. Можете уйти. Я пойму.\n\nДениз курит у колодца.\n\n— Если в пункте узнают, что он выжил, — говорит он, — его заберут. Изучать. И нас с ним, на всякий случай.\n\nКерем молчит.' },
      { when: { v: '$.c11_patrol', op: '==', value: 'lie' }, text: 'Солдаты обещали вернуться завтра с врачом.' },
      { when: { v: '$.c11_patrol', op: '==', value: 'truth' }, text: 'Солдатам ты уже сказал{m:|а}, что здесь есть укушенный. Завтра они приедут.' },
      { when: wound11('bite'), text: 'А у самой Хенрике на руке полукруг. Об этом пока никто не говорит вслух.' },
    ],
    actions: [
      { id: 'c11_af_partner', label: 'Отойти с {partner.ins} и решить вдвоём', minutes: 3, terminal: true, goto: 'c11_checkpoint', effects: [{ set: '$.c11_finished', value: true }] },
      { id: 'c11_af_henrike', label: 'Сначала ответить Хенрике, что подумаете', minutes: 3, terminal: true, goto: 'c11_checkpoint',
        text: 'Хенрике кивает и уходит к сыну.', effects: [{ set: '$.c11_finished', value: true }, { npc: 'henrike', trust: 1 }] },
      { id: 'c11_af_deniz', label: 'Спросить Дениза, что он сам собирается делать', minutes: 3, terminal: true, goto: 'c11_checkpoint',
        text: '— Я? — Дениз бросает окурок в лужу. — Брата больше не оставлю. Куда он, туда и я. А он отсюда хочет уйти.', effects: [{ set: '$.c11_finished', value: true }, { set: '$.c11_q_deniz', value: true }] },
    ] }),

  S11({ id: 'c11_checkpoint', for: 'any', chapter: 'ch3', title: 'Полдень', checkpoint: 11, universal: false,
    text: [{ text: 'Оле выжил. Теперь нужно решить две вещи: говорить ли о нём в пункте и как вам дальше жить на этом хуторе.' }], actions: [] }),
];
