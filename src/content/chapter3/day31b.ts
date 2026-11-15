import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14 } from './point14';
import { any, ninaFarm, v } from './point18';
import { npc } from './point19';
import { S31, frost31, henrike31, kasia31, lea31, ole31, set31, until31 } from './point31';

// Участок 31, линия B в обычный день: стирка и Нина (школа в Винзене), обход доктора Зандер, сумерки.
const B = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S31({ ...scene, for: 'any', chapter: 'ch3' });
const ninaStayed15: Cond = v('w.c15_nina', 'stay');
const handsCut: Cond = flag('B.c30_hurt2');
const handsSore: Cond = all(flag('B.c30_hurt1'), not(handsCut));
const boy: Cond = flag('w.c30_boy_saved');
const leaPoint: Cond = flag('w.c25_lea_point');

export const day31BScenes: Scene[] = [
  B({ id: 'c31_b_wash', title: 'Стирка', camp: kitchen14,
    text: [
      { text: 'Всё, в чём вы были ночью, мокрое, в саже и соляре. Хенрике греет воду в баке на плите. Ты стираешь в корыте, пока кожа на руках не становится как бумага.' },
      { when: ninaFarm, text: 'Нина развешивает над печью. Носки, рукавицы, штаны колом. Она долго молчит, потом достаёт из кармана сложенный листок.' },
      { when: ninaFarm, text: '— Это от Лены. Из Винзена. Водитель Красного Креста вчера привёз. — Она разворачивает, хотя знает наизусть. — Там школа открылась. Три часа в день, в спортзале, все классы вместе. Учителей двое. Лена пишет, что там тепло.' },
      { when: all(ninaFarm, ninaStayed15), text: 'В ноябре, когда её звали в Винзен, она осталась с вами. Теперь она не просит остаться там. Она просит съездить.' },
      { when: ninaFarm, text: '— В среду туда идёт армейский грузовик. Обратно в четверг. Можно я поеду? С тобой?' },
      { when: not(ninaFarm), text: 'Нины нет: она в Винзене. Но вчера водитель Красного Креста привёз от неё записку, Хенрике отдаёт её тебе только сейчас. Неровный почерк, по-русски:\n\n«Тут открылась школа. Три часа в день. В среду к вам пойдёт армейский грузовик, в четверг обратно. Приезжай, пожалуйста. Я покажу. Н.»' },
    ],
    actions: [
      { id: 'c31_bw_yes', label: 'Сказать: съездим, я поговорю с Хенрике', when: ninaFarm, minutes: 60, terminal: true, goto: 'c31_b_doc',
        text: 'Нина кивает, очень серьёзно, и вешает последнюю рукавицу ровнее, чем все остальные. Потом уходит наверх. Через минуту слышно, как она что-то роняет и смеётся.', effects: [set31('bw', 'yes'), npc('c7_nina', 2, 'c31_b_promised_winsen'), until31(12, 0)] },
      { id: 'c31_bw_later', label: 'Сказать: не сейчас, после такой ночи', when: ninaFarm, minutes: 60, terminal: true, goto: 'c31_b_doc',
        text: 'Нина складывает листок вчетверо и убирает в карман.\n\n— Ладно, — говорит она. — Я понимаю.\n\nПонимает. Ей пятнадцать, и она понимает слишком много. До полудня вы стираете молча.', effects: [set31('bw', 'later'), npc('c7_nina', -1), until31(12, 0)] },
      { id: 'c31_bw_ask', label: 'Спросить, чего ей хочется больше: в школу или к Лене', when: ninaFarm, minutes: 60, terminal: true, goto: 'c31_b_doc',
        text: 'Нина думает дольше, чем ты ожидаешь.\n\n— Чтобы было как раньше. Хотя бы три часа в день. Чтобы кто-нибудь сказал «откройте тетради», и это было самое страшное.\n\nОна выжимает носок так, что вода течёт по локтям.', effects: [set31('bw', 'ask'), npc('c7_nina', 1, 'c31_told_school'), until31(12, 0)] },
      { id: 'c31_bw_note', label: 'Перечитать записку и убрать', when: not(ninaFarm), minutes: 60, terminal: true, goto: 'c31_b_doc',
        text: 'Ты убираешь записку в карман, к своим бумагам. До полудня стираешь. «Я покажу». Как будто школа — её.', effects: [set31('bw', 'note'), until31(12, 0)] },
    ] }),

  B({ id: 'c31_b_doc', title: 'Обход', camp: kitchen14, onEnter: [until31(12, 30)],
    text: [
      { text: 'В половине первого у ворот «Вольф». Доктор Зандер обходит дворы после ночи: обмороженные, порезанные, кто кашляет. Маленькая, в мужском свитере под курткой, с сумкой через плечо.' },
      { when: all(lea31, not(leaPoint)), text: 'Лея выходит к ней из сеней. Они говорят быстро, по-немецки, как коллеги.' },
      { when: leaPoint, text: 'С ней Лея, с повязкой Красного Креста на рукаве, со второй сумкой.' },
      { when: boy, text: '— Der Junge vom Rand lässt grüßen. Seine Mutter hat Brot gebacken. Für euch. — Зандер ставит на стол буханку, завёрнутую в полотенце.\n\nМальчишка с края передаёт привет. Мать испекла хлеб. Для вас.' },
      { when: handsCut, text: 'Она сразу смотрит на твои руки. Повязка, которую ты {m:наложил|наложила} ночью, промокла.' },
      { when: handsSore, text: 'Она смотрит на твои руки. Красные, в ссадинах, но целые.' },
      { text: '— Mir fehlt alles, — говорит она за чаем. — Verbände, Salbe gegen Erfrierungen, Antibiotika. Das DRK in Winsen hat Medikamente bekommen. Am Mittwoch fährt ein Laster hin. Ich brauche jemanden, der die Liste mitnimmt und zurückbringt, was sie geben.\n\nМне не хватает всего. Бинтов, мази от обморожений, антибиотиков. Красному Кресту в Винзене привезли лекарства. В среду туда идёт грузовик. Мне нужен кто-то, кто отвезёт список и привезёт обратно, что дадут.' },
    ],
    actions: [
      { id: 'c31_bd_hands', label: 'Показать руки', when: any(handsCut, handsSore), minutes: 30, terminal: true, goto: 'c31_b_frost',
        text: 'Зандер разматывает повязку, смотрит, промывает. Мазь пахнет рыбьим жиром.\n\n— Sauber. Das heilt. Aber eine Woche keine Wäsche.\n\nЧисто. Заживёт. Но неделю никакой стирки.\n\nОна смотрит на корыто у печи и вздыхает.', effects: [set31('bd', 'hands'), { treat: 'proper' }, until31(13, 30)] },
      { id: 'c31_bd_rounds', label: 'Пойти с ней по дворам до сумерек', minutes: 150, activity: 'moderate', terminal: true, goto: 'c31_b_frost', ambientDuring: frost31,
        text: 'Кёлер, Шульце, двор у насыпи. У одних обмороженные пальцы, у других кашель, у третьих только страх. Ты держишь сумку, светишь фонарём, записываешь фамилии. В последнем дворе старик не пускает Зандер, пока ты не скажешь, что это врач, а не люди Брандта.\n\nНа обратном пути она говорит:\n\n— Sie könnten das. Wenn Sie wollen.\n\nВы бы смогли. Если захотите.', effects: [set31('bd', 'rounds'), set31('did_rounds', true), { body: 'fatigue', delta: 6 }, until31(15, 30)] },
      { id: 'c31_bd_insulin', label: 'Спросить, есть ли в Винзене инсулин', minutes: 30, terminal: true, goto: 'c31_b_frost',
        text: 'Зандер смотрит на тебя внимательно.\n\n— Insulin? Für wen?\n\nТы говоришь про Мерле. За Эльбой, на инсулине. Сколько у неё осталось, ты не знаешь.\n\n— Wenn, dann beim DRK. In Winsen wissen sie, was über die Elbe geht und was nicht. Fragen Sie dort. Fragen Sie nach Kolonnen.\n\nЕсли где-то и есть, то у Красного Креста. В Винзене знают, что идёт за Эльбу, а что нет. Спросите там. Спросите про колонны.', effects: [set31('bd', 'insulin'), set31('asked_insulin', true), until31(13, 30)] },
      { id: 'c31_bd_tea', label: 'Налить ей чаю и не задерживать', minutes: 20, terminal: true, goto: 'c31_b_frost',
        text: 'Она пьёт половину кружки стоя, благодарит и уезжает к следующему двору. В сумке у неё звенят пузырьки.', effects: [set31('bd', 'tea'), until31(13, 15)] },
    ] }),

  B({ id: 'c31_b_dusk', title: 'Сумерки', camp: house14,
    text: [
      { text: 'Короткий день кончается. В четыре над полями синее.' },
      { when: kasia31, text: 'Кася сидит у окна с клеткой Пана Кульки на коленях и смотрит на дорогу, туда, где утром стоял грузовик с сердцем на борту.' },
      { when: ole31, text: 'Оле дремлет на лавке у печи. Хенрике укрывает его своей шалью и стоит так минуту, не убирая руку.' },
    ],
    actions: [
      { id: 'c31_bk_soup', label: 'Помочь Хенрике с супом', when: henrike31, minutes: 90, terminal: true, goto: 'c31_b_pack',
        text: 'Ты чистишь картошку, Хенрике режет лук. Она рассказывает про Хиннерка: как он в семьдесят девятом вытащил её мужа из горящего сарая и потом неделю не мог отмыть бороду.', effects: [set31('bk', 'soup'), npc('henrike', 1), until31(16, 30)] },
      { id: 'c31_bk_kasia', label: 'Сесть рядом с Касей', when: kasia31, minutes: 90, terminal: true, goto: 'c31_b_pack',
        text: 'Кася показывает на дорогу.\n\n— Mama ich komm Weihnachten, — читает она по памяти, с ошибками. — Kommt er?\n\nПриедет он?\n\nТы не знаешь, что ей ответить. Говоришь: не знаю. Она кивает: так честно.', effects: [set31('bk', 'kasia'), npc('kasia', 1), until31(16, 30)] },
      { id: 'c31_bk_list', label: 'Составить список, что нужно пункту', minutes: 90, terminal: true, goto: 'c31_b_pack',
        text: 'На обороте старого календаря ты пишешь по памяти: бинты, мазь, антибиотики, перчатки, физраствор. Потом то, чего не хватает дома. Список выходит на две стороны.', effects: [set31('bk', 'list'), set31('made_list', true), until31(16, 30)] },
      { id: 'c31_bk_sleep', label: 'Лечь на час', minutes: 90, terminal: true, goto: 'c31_b_pack',
        text: 'Ты засыпаешь под стук ножа на кухне и просыпаешься от запаха лука.', effects: [set31('bk', 'sleep'), until31(16, 30, true)] },
    ] }),
];
