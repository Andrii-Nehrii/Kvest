import type { Scene } from '../../engine/content-types';
import { yard14 } from './point14';
import { npc } from './point19';
import { S26, set26, snow26, until26 } from './point26';

// Участок 26, третий круг (16.11): ещё две сцены линии B.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S26({ ...scene, for: 'any', chapter: 'ch3' });
const jest = 'c16_jesteburg';
const pointCamp = { at: jest, stock: 'c3_farm_stock', rest: false } as const;

export const day26YScenes: Scene[] = [
  X({ id: 'c26_y_b_rash', title: 'Сыпь', location: jest, camp: pointCamp, safe: false,
    text: [
      { text: 'Первой в очереди стоит девушка лет восемнадцати с младенцем в слинге. Ребёнок спит, но щёки и шея у него в мелкой красной сыпи. Девушка разворачивает одеяло дрожащими руками.' },
      { text: '— Seit gestern. Ist das… ist das das?\n\nСо вчерашнего дня. Это… это оно?' },
      { text: 'Зандер в школе. Ты не врач. Но ты {m:видел|видела} такую сыпь у соседских детей в Бармбеке каждую зиму.' },
    ],
    actions: [
      { id: 'c26_yr_calm', label: 'Посмотреть и успокоить: это от жары, его перекутали', minutes: 20, terminal: true, goto: 'c26_x_b_hand',
        text: 'Ты расстёгиваешь три слоя: комбинезон, кофта, ещё кофта. Сыпь там, где было жарче всего, на шее и в складках. Ребёнок тёплый, не горячий. Ты показываешь девушке, как одевать: на один слой больше, чем себе, не на три. Она кивает и плачет от облегчения.',
        effects: [set26('yr', 'calm'), until26(8, 45)] },
      { id: 'c26_yr_wait', label: 'Попросить подождать Зандер: тут ошибиться нельзя', minutes: 20, terminal: true, goto: 'c26_x_b_hand',
        text: 'Девушка садится на лавку у стены и качает ребёнка, не переставая. Ты то и дело на неё поглядываешь. Зандер приходит через час, смотрит одну минуту и говорит то, что ты и {m:думал|думала}: перекутали. Девушка уходит, а ты записываешь это в журнал мелко, на полях.',
        effects: [set26('yr', 'wait'), until26(8, 45)] },
      { id: 'c26_yr_temp', label: 'Сначала смерить температуру, потом решать', minutes: 20, terminal: true, goto: 'c26_x_b_hand',
        text: 'Градусник под мышку, пять минут, девушка держит ребёнка неподвижно, как стеклянного. Тридцать семь и одна. Ты показываешь ей цифру. Сыпь от жары, не от болезни. Она смотрит на градусник так, будто он ей что-то пообещал.',
        effects: [set26('yr', 'temp'), until26(8, 45)] },
    ] }),

  X({ id: 'c26_y_b_bread', title: 'Пекарня', camp: yard14, ambient: snow26,
    text: [
      { text: 'У пекарни Кёлер ставит санки к стене и отряхивает руки. Потом смотрит на тебя внимательно, как смотрят на того, кто приходит из пункта.' },
      { text: '— Wie geht es den Kindern da? Man hört so viel. Die kleine Pia, wie geht es ihr?\n\nКак там дети? Столько всего говорят. Маленькая Пия, как она?' },
    ],
    actions: [
      { id: 'c26_yb_tell', label: 'Рассказать, как есть: Пие плохо', minutes: 20, terminal: true, goto: 'c26_b_afternoon',
        text: 'Кёлер слушает, кивая на каждое слово, будто ставит галочки. Потом уходит в пекарню и возвращается с двумя булочками, белыми, из последней муки. «Für das Kind. Und eine für Sie». Для ребёнка. И одна вам. Сплетничать, ты понимаешь, она не будет. Будет печь.',
        effects: [set26('yb', 'tell'), npc('c3_koehler', 1), until26(14, 45)] },
      { id: 'c26_yb_quiet', label: 'Сказать: про больных из пункта не рассказывают', minutes: 15, terminal: true, goto: 'c26_b_afternoon',
        text: 'Кёлер поджимает губы. Потом кивает.\n\n— Recht haben Sie. Bei mir erzählt man auch nicht, wer anschreiben lässt.\n\nПравильно. У меня тоже не рассказывают, кто берёт в долг.\n\nПрощается она теплее, чем здоровалась.',
        effects: [set26('yb', 'quiet'), npc('c3_koehler', 2), until26(14, 45)] },
      { id: 'c26_yb_bake', label: 'Попросить её печь для пункта: детям нужен хлеб', minutes: 20, terminal: true, goto: 'c26_b_afternoon',
        text: '— Mehl habe ich für zehn Tage. Wenn Brandt mir Holz gibt, backe ich jeden Morgen zwei Laibe für den Punkt.\n\nМуки у меня на десять дней. Если Брандт даст дров, буду печь каждое утро две буханки для пункта.\n\nВы жмёте руки на крыльце. Ты не знаешь, даст ли Брандт дров. Но у тебя теперь есть, что ему сказать.',
        effects: [set26('yb', 'bake'), npc('c3_koehler', 1), until26(14, 45)] },
    ] }),
];
