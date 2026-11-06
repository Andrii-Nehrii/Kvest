import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag } from './world3';
import { P12 } from './point12';

export const finished12: Cond = all(P12, flag('A.c12_finished'), flag('B.c12_finished'));

// Сводка не пересказывает, что видел каждый: сверять должны сами игроки.
export const point12Notes: MergeNote[] = [
  { id: 'c12_both_told', when: all(finished12, flag('A.c12_compared'), flag('B.c12_compared')),
    text: 'На крыльце вы ещё раз повторяете друг другу всё, что знаете. Получается слишком много для одного дня.' },
  { id: 'c12_gun', when: all(finished12, flag('A.c12_knows_gun')), text: 'Ружьё Оле стоит за шкафом в доме. Об этом знает {A}.' },
];

export const point12Guests: JointDecision = {
  id: 'c3_new_guests12', checkpoint: 12, canParticipate: P12,
  prompt: { default: 'Маркус просит ночевать вместе с Лео на сеновале: мальчик один не спит. Можно пустить их вместе, развести на ночь или пустить вместе, но дежурить у лестницы по очереди. Разные ответы — вместе, с дежурством.' },
  options: [
    { id: 'together', label: { default: 'Пустить их вместе на сеновал' },
      effects: [{ set: 'w.c12_guests', value: 'together' }, { if: { npc: 'c12_marcus', alive: true }, then: [{ npc: 'c12_marcus', remember: 'c12_they_let_us_together' }] }],
      text: 'Маркус уносит спящего Лео на сеновал. Нина смотрит им вслед с крыльца, потом уходит в дом и хлопает дверью.' },
    { id: 'split', label: { default: 'Лео — в дом, к Нине; Маркуса на ночь запереть в кладовке' },
      effects: [{ set: 'w.c12_guests', value: 'split' }, { if: { npc: 'c12_marcus', alive: true }, then: [{ npc: 'c12_marcus', remember: 'c12_they_locked_me' }] }],
      text: 'Маркус слушает молча. Потом сам идёт к кладовке при сарае.\n\n— Запирайте, — говорит он. — Только скажите ему утром, что я тут.\n\nЗасов задвигает Дениз. Лео спит в доме, на матрасе рядом с Ниной.' },
    { id: 'watch', label: { default: 'Пустить вместе, но дежурить у лестницы по очереди' },
      effects: [{ set: 'w.c12_guests', value: 'watch' }, { if: { npc: 'c12_marcus', alive: true }, then: [{ npc: 'c12_marcus', remember: 'c12_they_watched_us' }] }],
      text: '— Дежурьте, — говорит Маркус и уносит Лео наверх.\n\n{A} берёт фонарь и садится на ящик у лестницы. В час ночи его сменит {B}, под утро — Дениз.' },
  ],
  compromises: [
    { pair: ['together', 'split'], result: 'watch' }, { pair: ['together', 'watch'], result: 'watch' }, { pair: ['split', 'watch'], result: 'watch' },
  ],
  arbiters: [{ id: 'c12_watch', when: P12, winner: 'watch', text: 'Вы не сходитесь. Пускаете их вместе и дежурите по очереди.' }],
  default: 'watch',
};

export const point12PromiseA: JointDecision = {
  id: 'c3_new_promise12a', checkpoint: 12, canParticipate: all(P12, { me: 'A' }),
  soloReason: 'Здесь каждый обещал сам.',
  prompt: { default: 'Маркус просил: если с ним что-нибудь случится, отвести Лео к бабушке в Целле. Что ты ему ответишь? Это решаешь только ты.' },
  options: [
    { id: 'promise', label: { default: 'Пообещать: если что, Лео будет у бабушки' },
      effects: [{ set: 'w.c12_promise_A', value: 'promise' }, { if: { npc: 'c12_marcus', alive: true }, then: [{ npc: 'c12_marcus', remember: 'c12_A_promised' }] }],
      text: '{A} обещает Маркусу: если что, Лео будет у бабушки. Маркус жмёт {A.dat} руку. Левой.' },
    { id: 'no', label: { default: 'Не обещать, пока он не размотает руку' },
      effects: [{ set: 'w.c12_promise_A', value: 'no' }, { if: { npc: 'c12_marcus', alive: true }, then: [{ npc: 'c12_marcus', remember: 'c12_A_refused' }] }],
      text: '{A} говорит Маркусу: сначала рука. Маркус кивает. «Честно», — говорит он. Руку не разматывает.' },
    { id: 'honest', label: { default: 'Сказать честно: обещать не могу, но одного его не бросим' },
      effects: [{ set: 'w.c12_promise_A', value: 'honest' }, { if: { npc: 'c12_marcus', alive: true }, then: [{ npc: 'c12_marcus', remember: 'c12_A_honest' }] }],
      text: '{A} говорит Маркусу честно: обещать не может, но мальчика одного не бросят. Маркус долго молчит. «Это больше, чем я просил», — говорит он.' },
  ],
  arbiters: [{ id: 'c12_a_silent', when: P12, winner: 'no', text: '{A} ничего не обещает.' }],
  default: 'no',
};

export const point12PromiseB: JointDecision = {
  id: 'c3_new_promise12b', checkpoint: 12, canParticipate: all(P12, { me: 'B' }),
  soloReason: 'Здесь каждый обещал сам.',
  prompt: { default: 'Лео шепнул тебе: «Не к нему. Пожалуйста». Что ты ему ответишь? Это решаешь только ты.' },
  options: [
    { id: 'promise', label: { default: 'Пообещать Лео, что не отдашь его Маркусу' },
      effects: [{ set: 'w.c12_promise_B', value: 'promise' }, { if: { npc: 'c12_leo', alive: true }, then: [{ npc: 'c12_leo', remember: 'c12_B_promised' }] }],
      text: '{B} обещает Лео шёпотом. Он кивает и засыпает, держа {B.acc} за палец.' },
    { id: 'no', label: { default: 'Не обещать: сначала понять, что случилось' },
      effects: [{ set: 'w.c12_promise_B', value: 'no' }, { if: { npc: 'c12_leo', alive: true }, then: [{ npc: 'c12_leo', remember: 'c12_B_refused' }] }],
      text: '{B} говорит Лео, что сначала разберётся. Лео отворачивается к стене.' },
    { id: 'honest', label: { default: 'Сказать: решать будут взрослые, но его спросят' },
      effects: [{ set: 'w.c12_promise_B', value: 'honest' }, { if: { npc: 'c12_leo', alive: true }, then: [{ npc: 'c12_leo', remember: 'c12_B_honest' }] }],
      text: '{B} говорит Лео: его спросят. Лео смотрит долго. «Wirklich?» — «Правда».' },
  ],
  arbiters: [{ id: 'c12_b_silent', when: P12, winner: 'no', text: '{B} ничего не обещает.' }],
  default: 'no',
};
