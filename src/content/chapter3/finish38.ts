import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { any, v } from './point18';
import { aNorth36, bNorth36 } from './point36';
import { P38, kasiaDeparts38, leavePawel38, merleComes38, parentsCome38 } from './point38';

export const finished38: Cond = all(P38, any(flag('A.c38_finished'), flag('B.c38_finished')));
const N = (id: string, when: Cond, text: string): MergeNote => ({ id, when: all(finished38, when), text });
const meA: Cond = { me: 'A' };
// Дома к КТ38 — и те, кого у Лауэнбурга развернули обратно (ветка Павла, этап 13 переделки).
const home: Cond = any(not(leavePawel38), flag('w.c38_east_back'));
const once = (id: string, when: Cond, effects: MergeNote['effects']): MergeNote => ({ id, when: all(finished38, meA, when), effects });

// Сверка десятого, ночью. Мир (кто приехал, кто уехал, что отдали в дорогу) меняется здесь один раз — на линии A.
export const point38Notes: MergeNote[] = [
  once('c38_gift_potatoes', all(home, v('w.c36_gift', 'potatoes'), { stocked: 'potatoes', qty: 25, at: 'c3_farm_stock' }), [{ unstock: 'potatoes', qty: 25, at: 'c3_farm_stock' }]),
  once('c38_gift_ham', all(home, v('w.c36_gift', 'ham'), { stocked: 'c18_ham', qty: 1, at: 'c3_farm_stock' }), [{ unstock: 'c18_ham', qty: 1, at: 'c3_farm_stock' }]),
  once('c38_merle_move', merleComes38, [{ npc: 'merle', moveTo: 'hof_luedemann' }, { set: 'w.c38_merle', value: 'farm' }]),
  once('c38_merle_north', all(home, not(merleComes38), { npc: 'merle', alive: true }), [{ set: 'w.c38_merle', value: 'north' }]),
  once('c38_parents_move', parentsCome38, [{ npc: 'uwe', moveTo: 'hof_luedemann' }, { npc: 'birgit', moveTo: 'hof_luedemann' }, { set: 'w.c38_parents', value: true }]),
  once('c38_pens_back', all(merleComes38, flag('w.c37_pens_okafor')), [{ place: 'c21_insulin', at: 'c3_farm_stock', qty: 2 }]),
  once('c38_kasia_move', kasiaDeparts38, [{ npc: 'kasia', moveTo: 'gone_east' }, { set: 'w.c38_kasia', value: 'east' }]),
  once('c38_pawel_move', { npc: 'pawel', alive: true }, [{ npc: 'pawel', moveTo: 'gone_east' }]),
  N('c38_crossed', all(home, any(bNorth36, aNorth36)), 'Колонна с севера прошла мост без пяти шесть, последней. За ней шлагбаум опустили и поставили бетонный блок.'),
  N('c38_merle', merleComes38, 'Мерле приехала на хутор.'),
  N('c38_parents', parentsCome38, 'С ней приехали её родители, Уве и Биргит Тиссен.'),
  N('c38_merle_stayed', all(home, not(merleComes38), any(bNorth36, aNorth36)), 'Мерле осталась в Аренсбурге, с родителями. Мост закрыт.'),
  N('c38_pens', flag('w.c38_pens_to_merle'), '{B} отдала Мерле ручки инсулина, которые везла с собой.'),
  N('c38_kasia', kasiaDeparts38, 'Кася ушла с колонной поляков на восток.'),
  N('c38_pawel', all(home, { npc: 'pawel', alive: true }), 'Колонна Павла переправилась через Эльбу и ушла на восток.'),
  N('c38_petrol', flag('w.c38_petrol_got'), '{A} выменял в Аренсбурге канистру бензина у армейского заправщика.'),
  N('c38_diesel', flag('w.c38_diesel_from_army'), 'Армейский грузовик застрял на повороте у поля. {A} вытащил его трактором, сержант отдал за это двадцать литров солярки.'),
  N('c38_ilka', flag('w.c38_ilka_told'), 'В спортзале Аренсбурга нашёлся муж той женщины с моста. Ему передали: Илька жива.'),
  N('c38_hanstedt', flag('w.c38_hanstedt_note'), 'Из Аренсбурга привезли записку для одной матери в Ханштедте: дочь и внучка живы.'),
  N('c38_army', any(flag('w.c38_army_early'), flag('w.c38_saw_trucks')), 'Армия уходит уже сейчас, не дожидаясь пятнадцатого: колонны идут на север весь день.'),
  N('c38_post', flag('w.c38_posts_closing'), 'По радио: с пятнадцатого посты Красного Креста к югу от Эльбы закрываются. Пункт в Йестебурге — на усмотрение врача.'),
  N('c38_watch_a', flag('w.c38_a_watch_early'), '{A} сказал Лукасу: ваш двор дежурит у Зеве уже с пятницы.'),
  N('c38_tracks', any(flag('w.c38_tracks_known'), flag('w.c38_lair_found'), flag('w.c38_tracks_marked')), 'У ручья Зеве и у съезда к Гарльсторфу — следы из впадины к дорогам. Медленные, но много.'),
  N('c38_lair', flag('w.c38_lair_found'), 'Под старой ивой у ручья {A} нашёл лёжку: кто-то провёл там ночь и ушёл к впадине.'),
  N('c38_wire', flag('w.c38_second_wire'), 'На тропе от ручья теперь вторая проволока с банками, ближе к сараю.'),
  N('c38_milk', flag('w.c38_milk_neighbor'), 'Соседке с ребёнком Хенрике обещала молоко каждый день.'),
  N('c38_room', any(flag('w.c38_attic_ready'), flag('w.c38_own_room_ready')), 'К приезду Мерле на хуторе приготовили место.'),
  N('c38_zander', any(v('B.c38_fbp', 'work'), v('B.c38_fbp', 'ask')), '{B} полдня помогала Зандер в пункте: Зандер сегодня была одна.'),
  N('c38_reuter', flag('w.c38_reuter_posted'), 'Письмо Ройтера жене отдано на почту Красного Креста в Винзене.'),
  N('c38_flares', any(v('A.c38_fap', 'flares'), v('A.c38_fap', 'look')), 'С брошенного поста у Гарльсторфа {A} привёз три сигнальные ракеты и мешки для песка.'),
  N('c38_east_back', flag('w.c38_east_back'), 'Вы уехали с колонной Павла, но у Лауэнбурга дальше на восток пропускали только с польскими бумагами. Вы вернулись по мосту до шести и к ночи были на хуторе.'),
];

export const point38Bed: JointDecision = {
  id: 'c3_new_bed38', checkpoint: 38, canParticipate: all(P38, merleComes38, home),
  prompt: { default: 'Где будет жить Мерле (и её родители, если приехали): в вашей комнате — а вы в кухне на лавке, на чердаке у трубы — тесно и холодно, или в домике в колонии у Уте — своё место, но через поле. Разные ответы — чердак.' },
  options: [
    { id: 'room', label: { default: 'Отдать нашу комнату' }, effects: [{ set: 'w.c38_bed', value: 'room' }],
      text: 'Мерле — в вашей комнате. Вы — на лавке в кухне, у печки.' },
    { id: 'attic', label: { default: 'На чердаке, у трубы' }, effects: [{ set: 'w.c38_bed', value: 'attic' }],
      text: 'Мерле — на чердаке, у тёплой трубы.' },
    { id: 'colony', label: { default: 'В домике в колонии' }, effects: [{ set: 'w.c38_bed', value: 'colony' }],
      text: 'Мерле — в домике в колонии, через поле. Своя дверь, своя печка.' },
  ],
  compromises: [{ pair: ['room', 'attic'], result: 'attic' }, { pair: ['room', 'colony'], result: 'attic' }, { pair: ['attic', 'colony'], result: 'attic' }],
  arbiters: [{ id: 'c38_bed_attic', when: P38, winner: 'attic', text: 'Вы не сходитесь. Пока — чердак.' }],
  default: 'attic',
};

export const point38Watch: JointDecision = {
  id: 'c3_new_watch38', checkpoint: 38, canParticipate: all(P38, home),
  prompt: { default: 'Армия снимает посты раньше срока. Брандт просит дворы выходить на ночные дежурства у ручьёв уже с завтрашней ночи. С завтрашней, с пятнадцатого, как договаривались, — или вовсе не выходить, смотреть только за своим двором. Разные ответы — с пятнадцатого.' },
  options: [
    { id: 'tomorrow', label: { default: 'С завтрашней ночи' }, effects: [{ set: 'w.c38_watch', value: 'tomorrow' }],
      text: 'С завтрашней ночи ваш двор дежурит у Зеве.' },
    { id: 'from15', label: { default: 'С пятнадцатого, как договаривались' }, effects: [{ set: 'w.c38_watch', value: 'from15' }],
      text: 'Дежурить у Зеве вы начнёте с пятнадцатого.' },
    { id: 'no', label: { default: 'Не выходить: только свой двор' }, effects: [{ set: 'w.c38_watch', value: 'no' }],
      text: 'На дежурства вы не выходите. Смотрите за своим двором.' },
  ],
  compromises: [{ pair: ['tomorrow', 'from15'], result: 'from15' }, { pair: ['tomorrow', 'no'], result: 'from15' }, { pair: ['from15', 'no'], result: 'from15' }],
  arbiters: [{ id: 'c38_watch_from15', when: P38, winner: 'from15', text: 'Вы не сходитесь. С пятнадцатого.' }],
  default: 'from15',
};
