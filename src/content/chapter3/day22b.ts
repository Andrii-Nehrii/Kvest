import type { ActionDef, Scene } from '../../engine/content-types';
import type { Cond, Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { kitchen14, tense14, yard14 } from './point14';
import { meal } from './point12';
import { any, v } from './point18';
import { npc, tableOnly } from './point19';
import {
  S22, bag22, day22, dogHere22, evaHere22, farm22, herChoice, lea22, leaMoves, malte22, search22, set22, until22, w22,
  wayHide, wayJest, wayTobias,
} from './point22';

// Участок 22, линия B: день с Леей (или после неё). Половина правды B: Лея не болела, её кровь никого не лечит (`$.c22_b_truth`).
// В Йестебург B уходит, если повела туда Лею или понесла сумку врачу.
const B = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S22({ ...scene, for: 'any', chapter: 'ch3' });
const jest = 'c16_jesteburg';
const pointCamp = { at: jest, stock: 'c3_farm_stock', rest: false } as const;
const J = (scene: Omit<Scene, 'for' | 'chapter' | 'location'>): Scene => B({ ...scene, location: jest, camp: scene.camp ?? pointCamp, safe: false });
const leaHere: Cond = wayHide;
const bagPoint: Cond = bag22('point');
const truthB = set22('b_truth', true);
const letterOle: Cond = flag('w.c18_ole_letter');
const smokeKey: Cond = v('w.c18_smoke', 'key');
const strips: Cond = v('w.c19_b_stitch', 'strips');
const merle: Cond = any(flag('A.c21_told_merle'), flag('B.c21_told_merle'));
const sabine: Cond = flag('w.c21_mats_mother');
const uteAlive: Cond = { npc: 'c14_ute', alive: true };
const plasmaLeft = (fx: (qty: number) => Effect[]): Effect => ({ if: { v: 'w.c21_plasma_used', op: '==', value: 2 }, then: fx(2),
  else: [{ if: { v: 'w.c21_plasma_used', op: '==', value: 1 }, then: fx(3), else: fx(4) }] });
/** Сумку отдают врачу пункта: из запаса хутора она уходит один раз, на этой линии. */
const bagToSander: Effect[] = [plasmaLeft((qty) => [{ unstock: 'c21_plasma', qty, at: 'c3_farm_stock' }]), { unstock: 'c21_insulin', qty: 10, at: 'c3_farm_stock' }, w22('bag_sander', true)];
const toJest: Effect = { move: jest };
const toFarm: Effect = { move: farm22 };
const afterCard = [{ id: 'j', when: wayJest, goto: 'c22_b_point' }, { id: 'h', when: wayHide, goto: 'c22_b_hair' }, { id: 'f', goto: 'c22_b_nina' }];
/** После Уте: ночлег для Леи или её забытые вещи. */
const afterUte = [{ id: 'b', when: wayHide, goto: 'c22_b_beds' }, { id: 'r', when: all(wayTobias, not(v('B.c22_bw', 'burn'))), goto: 'c22_b_things' }, { id: 'l', goto: 'c22_b_letter' }];
const afterLunch = [{ id: 'c', when: bagPoint, goto: 'c22_b_carry' }, { id: 'v', when: leaHere, goto: 'c22_b_vet' }, { id: 'm', goto: 'c22_b_malte' }];
const toLetter = [{ id: 's', when: wayJest, goto: 'c22_b_school' }, { id: 'j', goto: 'c22_b_letter_j' }];
const afterPoint = [{ id: 'r', when: wayJest, goto: 'c22_b_room' }, { id: 's', goto: 'c22_b_soup' }];
/** В пункте с Леей утром — полчаса; с сумкой после обеда — до без двадцати три. */
const pointTime = (jm: number): Effect => ({ if: wayJest, then: [until22(11, jm)], else: [until22(14, 40)] });
const brandtRoom: Cond = v('w.c22_lea_at', 'brandt');

/** Черновик письма в Люнебург: одни и те же варианты дома и в пункте. */
const letterActions = (pre: string, next: string, home: Effect[]): ActionDef[] => [
  { id: `${pre}_ole`, label: 'Написать Оле: коротко, про дом, про Нину, про кур', minutes: 25, terminal: true, goto: next,
    text: 'Ты пишешь про груши, которые Нина сложила в подвал, про насос, про то, что куры несутся через день. Про Лею и плазму не пишешь. Пока. Получается полстраницы. Ты перечитываешь и не зачёркиваешь ни слова.', effects: [set22('bl', 'ole'), w22('draft', 'ole'), ...home] },
  { id: `${pre}_henrike`, label: 'Написать Хенрике: она прочтёт ему вслух, если надо', minutes: 25, terminal: true, goto: next,
    text: 'Ты пишешь Хенрике, на «Sie», как пишут старшим. Про хутор, про Нину, про то, что всё на месте. Последнюю строчку ты переписываешь трижды: «Wir warten auf euch beide». Мы ждём вас обоих.', effects: [set22('bl', 'henrike'), w22('draft', 'henrike'), npc('henrike', 1), ...home] },
  { id: `${pre}_blank`, label: 'Не писать: решить вечером вдвоём', minutes: 10, terminal: true, goto: next,
    text: 'Ты складываешь чистый лист вчетверо и убираешь в карман. Что писать, вы решите вдвоём. Или не вдвоём.', effects: [set22('bl', 'blank'), ...home] },
];

export const day22BScenes: Scene[] = [
  B({ id: 'c22_b_morning', title: 'До девяти', camp: kitchen14,
    text: [
      { text: 'Без четверти восемь. На кухне пахнет кашей и йодом. Лея сидит на табурете у двери, в кофте Хенрике, и держит кружку обеими руками.' },
      { when: all(wayHide, not(herChoice)), text: 'Вы решили. Её прячут. До девяти час с четвертью, и место надо выбрать сейчас.' },
      { when: all(wayHide, herChoice), text: '— Ich bleibe, — говорит она. Я остаюсь. — Wenn ihr mich lasst. Ich habe die Nacht nachgedacht. Ich kann nicht wieder laufen.\n\nЕсли позволите. Я думала всю ночь. Я не могу снова бежать.' },
      { when: all(wayTobias, not(herChoice)), text: 'Вы решили. В девять за ней приедет Тобиас. Она знает: стена между кухней и швейной комнатой тонкая.' },
      { when: all(wayTobias, herChoice), text: '— Ich gehe zu ihm. Selbst, — говорит она. Я пойду к нему. Сама. — Ich will nicht, dass ihr wegen mir lügt. Und ich will nicht, dass jemand mich hinbringt.\n\nНе хочу, чтобы вы из-за меня врали. И не хочу, чтобы меня кто-то отводил.' },
      { when: all(wayJest, not(herChoice)), text: 'Вы решили. Ты отведёшь её в Йестебург. Брандту нужен свой донор. Она слушает и кивает, будто ей сообщили расписание автобуса.' },
      { when: all(wayJest, herChoice), text: '— Der Soldat hat es ihnen schon gesagt, — говорит она. Солдат им уже сказал. — Dann gehe ich lieber zu der Ärztin. Bevor man mich holt. Bringst du mich?\n\nТогда я лучше пойду к врачу. Пока за мной не пришли. Отведёшь меня?' },
    ],
    actions: [
      { id: 'c22_bm_cellar', label: 'Спрятать её в подвале, в нише за ящиками с картошкой', when: all(wayHide, letterOle), minutes: 20, terminal: true, goto: 'c22_b_hidden',
        text: 'Про нишу написано в листке Оле: «за картошкой, второй ключ». Вы отодвигаете три ящика. За ними дверца в человеческий рост, на ней ржавый замок. Внутри сухо, пахнет яблоками и мышами. Места хватает на двоих.', effects: [set22('bm', 'cellar'), w22('hide', 'cellar'), lea22(2), until22(8, 50)] },
      { id: 'c22_bm_smoke', label: 'Спрятать её в коптильне на чердаке, под ключ', when: all(wayHide, smokeKey), minutes: 20, terminal: true, goto: 'c22_b_hidden',
        outcomes: [
          { id: 'locked_before', when: v('w.c21_lea_bed', 'smoke'), text: 'Она смотрит на железную дверцу и бледнеет.\n\n— Schon wieder?\n\nОпять?\n\nВсё-таки входит. Ты входишь следом и прикрываешь дверцу изнутри: одну её здесь ты не оставишь.', effects: [set22('bm', 'smoke'), w22('hide', 'smoke'), lea22(1)] },
          { id: 'plain', text: 'Коптильня — железный шкаф в человеческий рост, весь в саже. Пахнет копчёным и холодом. Ты входишь с ней: одну её здесь ты не оставишь. Ключ ты отдаёшь Нине: если что, она отопрёт.', effects: [set22('bm', 'smoke'), w22('hide', 'smoke'), lea22(1), npc('c7_nina', 1)] },
        ], effects: [until22(8, 50)] },
      { id: 'c22_bm_loft', label: 'Спрятать её на сеновале, в дальнем углу, под сеном', when: wayHide, minutes: 20, terminal: true, goto: 'c22_b_hidden', ambientDuring: day22,
        text: 'Вы забираетесь в дальний угол, под самую крышу. Сено колется через одежду. Сквозь щель в досках видно ворота и кусок дороги.', effects: [set22('bm', 'loft'), w22('hide', 'loft'), until22(8, 50)] },
      { id: 'c22_bm_cousin', label: 'Не прятать: кузина из Харбурга, на виду, за работой', when: wayHide, minutes: 20, terminal: true, goto: 'c22_b_hidden',
        text: 'Ты повязываешь ей платок Хенрике и даёшь ведро. Лея смотрит на себя в тёмное окно: короткие волосы, платок, кофта не по росту. На донора с фотографии она не похожа. Похожа на девушку, которая всю жизнь кормит кур.\n\n— Wenn er fragt, bin ich stumm, — говорит она. Если спросит, я немая.', effects: [set22('bm', 'cousin'), w22('hide', 'cousin'), lea22(1), until22(8, 50)] },
      { id: 'c22_bm_pack', label: 'Помочь ей собраться', when: wayTobias, minutes: 30, terminal: true, goto: 'c22_b_wolf',
        text: 'Вещей у неё почти нет: парка с повязкой, синяя шапка, учебник без обложки. Ты кладёшь в пакет два яблока, хлеб и вязаные носки Хенрике. Она смотрит на носки дольше, чем на всё остальное.', effects: [set22('bm', 'pack'), lea22(1), until22(8, 55)] },
      { id: 'c22_bm_why', label: 'Спросить, почему она не бежит', when: wayTobias, minutes: 25, terminal: true, goto: 'c22_b_wolf',
        text: '— Wohin? — спрашивает она. Куда? — Bis Hannover sind es hundertzehn Kilometer. Ohne Papiere, ohne Essen. Und dort ist meine Mutter auf einer Liste, die ich nicht verlieren darf.\n\nДо Ганновера сто десять километров. Без документов, без еды. А там моя мать в списке, из которого её нельзя вычеркнуть.\n\nОна допивает чай.', effects: [set22('bm', 'why'), set22('b_hannover', true), until22(8, 55)] },
      { id: 'c22_bm_sit', label: 'Просто сесть рядом до девяти', when: wayTobias, minutes: 30, terminal: true, goto: 'c22_b_wolf',
        text: 'Вы сидите рядом на лавке у печи. Мальте делает вид, что спит. В без пяти девять Лея берёт тебя за руку, коротко, и отпускает.', effects: [set22('bm', 'sit'), lea22(2), until22(8, 55)] },
      { id: 'c22_bm_road', label: 'Собраться и выйти по дороге', when: wayJest, minutes: 20, terminal: true, goto: 'c22_b_road', ambientDuring: day22,
        text: 'Ты надеваешь куртку, она — парку без повязки. Повязку Красного Креста она снимает и кладёт в карман. У ворот она оборачивается на дом один раз.', effects: [set22('bm', 'road'), until22(8, 20)] },
      { id: 'c22_bm_field', label: 'Пойти полем, вдоль лесополосы: меньше глаз', when: wayJest, minutes: 20, terminal: true, goto: 'c22_b_road', ambientDuring: day22,
        text: 'Вы выходите через заднюю калитку. Земля подмёрзла, идти легко. Через десять минут хутор скрывается за лесополосой.', effects: [set22('bm', 'field'), w22('b_field', true), until22(8, 20)] },
    ] }),

  // ───────────── Тайник ─────────────
  B({ id: 'c22_b_hidden', title: 'Сорок минут', camp: tense14,
    text: [
      { when: v('w.c22_hide', 'cousin'), text: 'Девять. Вы обе во дворе. Лея сыплет зерно курам, ты набираешь воду у колонки. Руки у тебя заняты, иначе было бы видно, как они дрожат.' },
      { when: not(v('w.c22_hide', 'cousin')), text: 'Девять. Вы сидите в темноте плечом к плечу. Слышно своё дыхание. Слышно её.' },
      { text: 'У ворот останавливается машина. Голоса. Голос {A.gen}, ровный.' },
      { when: search22, text: 'Потом шаги. В доме открывают двери, одну за другой. Кто-то проходит прямо над вами, останавливается. Скрипит доска. Шаги уходят.' },
      { when: not(search22), text: 'Голоса у ворот долго не стихают. Потом мотор. Потом тишина, но вы не двигаетесь ещё долго.' },
      { text: 'Лея шепчет, не поворачивая головы:\n\n— Ich war nicht krank. Nie. Im Oktober hatte ich Leptospirose, von einer Ratte in der Klinik. Fieber, Gelbsucht, drei Wochen. Der Stabsarzt hat «genesen» in meine Akte geschrieben. Er hat nicht gefragt, wovon.\n\nЯ не болела. Никогда. В октябре у меня был лептоспироз, от крысы в клинике. Жар, желтуха, три недели. Штабной врач записал мне «переболела». Он не спросил, чем.' },
      { text: '— Mein Blut hilft keinem. Kein bisschen. Und wenn sie es merken, sind meine Mutter und Finn ihren Platz in Hannover los. Den haben sie nur, weil ich «Spenderin» bin.\n\nМоя кровь никому не помогает. Ни капли. А если это заметят, мама и Финн потеряют место в Ганновере. Оно у них только потому, что я «донор».' },
    ],
    actions: [
      { id: 'c22_bh_listen', label: 'Слушать, не перебивая', minutes: 40, terminal: true, goto: 'c22_b_card',
        text: 'Ты слушаешь. Она рассказывает шёпотом, как три раза пыталась сказать штабному врачу, и как он трижды не дослушал: у него было двести человек, а она была хорошей новостью. Хорошие новости не переспрашивают.', effects: [set22('bh', 'listen'), truthB, lea22(3, 'c22_listened'), until22(9, 40)] },
      { id: 'c22_bh_ask', label: 'Спросить, почему она не сказала им сама', minutes: 40, terminal: true, goto: 'c22_b_card',
        text: '— Ich habe es gesagt. Dreimal. — Она почти смеётся. — Beim dritten Mal hat er gesagt: «Frau Hartmann, Sie sind die einzige gute Nachricht dieser Woche. Lassen Sie mir die».\n\nЯ говорила. Три раза. На третий он сказал: «Фрау Хартман, вы единственная хорошая новость этой недели. Оставьте мне её».', effects: [set22('bh', 'ask'), truthB, lea22(2), until22(9, 40)] },
      { id: 'c22_bh_doubt', label: 'Сказать: ты это сейчас придумала', minutes: 40, terminal: true, goto: 'c22_b_card',
        text: 'Она не обижается. Расстёгивает парку и достаёт из внутреннего кармана сложенную карточку.\n\n— Dann schau.\n\nТогда смотри.', effects: [set22('bh', 'doubt'), lea22(-1), until22(9, 40)] },
    ] }),

  // ───────────── «Вольф» ─────────────
  B({ id: 'c22_b_wolf', title: '«Вольф»', camp: yard14, ambient: day22,
    text: [
      { text: 'В девять у ворот останавливается «Вольф». Лея идёт к нему ровно, не оглядываясь, с пакетом в руке.' },
      { text: 'У машины она оборачивается и обнимает тебя. Быстро, крепко. И пока обнимает, вкладывает тебе в ладонь сложенный вчетверо листок.\n\n— Lies es, wenn wir weg sind. Und dann entscheide. Nicht vorher.\n\nПрочитай, когда мы уедем. И тогда решай. Не раньше.' },
      { text: 'Дверь хлопает. «Вольф» разворачивается у ворот и уезжает к Йестебургу.' },
    ],
    actions: [
      { id: 'c22_bw_read', label: 'Прочитать сразу, у ворот', minutes: 30, terminal: true, goto: 'c22_b_card',
        text: 'Почерк мелкий, по-немецки, на обороте бланка ветеринарной клиники. Ты читаешь медленно, по слову.\n\n«Ich war nicht krank. Leptospirose im Oktober, von einer Ratte. Der Stabsarzt hat „genesen“ geschrieben. Mein Blut hilft keinem. Wenn sie es merken, verlieren meine Mutter und Finn ihren Platz in Hannover. Sag es nicht den Uniformen. Sag es, wem du willst, nur nicht ihnen. L.»\n\nЯ не болела. Лептоспироз в октябре, от крысы. Штабной врач написал «переболела». Моя кровь никому не помогает. Если это заметят, мама и Финн потеряют место в Ганновере. Не говори людям в форме. Говори кому хочешь, только не им.', effects: [set22('bw', 'read'), truthB, { give: 'c22_lea_note' }, leaMoves, until22(9, 35)] },
      { id: 'c22_bw_later', label: 'Убрать листок и прочитать потом, одной', minutes: 30, terminal: true, goto: 'c22_b_card',
        text: 'Ты убираешь листок в карман и стоишь у ворот, пока шум мотора не стихает совсем. Читаешь потом, в холодной кладовке, у её пустого угла.\n\n«Ich war nicht krank. Leptospirose im Oktober, von einer Ratte. Mein Blut hilft keinem. Wenn sie es merken, verlieren meine Mutter und Finn ihren Platz in Hannover. Sag es nicht den Uniformen. L.»\n\nЯ не болела. Лептоспироз в октябре, от крысы. Моя кровь никому не помогает. Если это заметят, мама и Финн потеряют место в Ганновере. Не говори людям в форме.', effects: [set22('bw', 'later'), truthB, { give: 'c22_lea_note' }, leaMoves, until22(9, 40)] },
      { id: 'c22_bw_burn', label: 'Не читать. Сжечь в печи', minutes: 15, terminal: true, goto: 'c22_b_card',
        text: 'Ты бросаешь листок в печь, не разворачивая. Бумага сворачивается и вспыхивает. Что там было, ты уже не узнаешь. Может быть, так и надо было. А может быть, нет.', effects: [set22('bw', 'burn'), w22('note_burnt', true), leaMoves, until22(9, 20)] },
    ] }),

  // ───────────── Дорога в Йестебург ─────────────
  B({ id: 'c22_b_road', title: 'Четыре километра', camp: tense14, ambient: day22,
    text: [
      { text: 'Первый километр вы молчите. На втором Лея начинает говорить. Глядя под ноги, ровно, как диктует историю болезни.' },
      { text: '— Ich war nicht krank. Im Oktober hatte ich Leptospirose. Von einer Ratte in der Klinik. Der Stabsarzt hat «genesen» geschrieben und mich zur Spenderin gemacht. Mein Blut hilft keinem.\n\nЯ не болела. В октябре у меня был лептоспироз. От крысы в клинике. Штабной врач записал «переболела» и сделал меня донором. Моя кровь никому не помогает.' },
      { text: '— Meine Mutter und mein Bruder Finn haben in Hannover einen Platz in der Halle. Weil ich Spenderin bin. Wenn es rauskommt, stehen sie draußen.\n\nУ мамы и брата Финна в Ганновере место в зале. Потому что я донор. Если это всплывёт, они окажутся на улице.' },
    ],
    actions: [
      { id: 'c22_br_listen', label: 'Слушать и идти рядом', minutes: 50, terminal: true, goto: 'c22_b_station', ambientDuring: day22,
        text: 'Ты слушаешь. На краю Йестебурга она останавливается и в первый раз смотрит на тебя.\n\n— Jetzt weißt du es. Jetzt kannst du entscheiden, wem du mich gibst.\n\nТеперь ты знаешь. Теперь решай, кому меня отдать.', effects: [set22('br', 'listen'), truthB, lea22(3, 'c22_listened'), toJest, until22(9, 25)] },
      { id: 'c22_br_turn', label: 'Остановиться и сказать: тогда пойдём назад', minutes: 50, terminal: true, goto: 'c22_b_station', ambientDuring: day22,
        text: 'Она качает головой.\n\n— Der Soldat hat es gemeldet. Oder wird es melden. Wenn ich zurückgehe, holen sie mich aus eurem Haus. Mit Hunden. Lieber gehe ich selbst.\n\nСолдат доложил. Или доложит. Если я вернусь, меня заберут из вашего дома. С собаками. Лучше я сама.\n\nДальше вы идёте молча.', effects: [set22('br', 'turn'), truthB, lea22(2), toJest, until22(9, 25)] },
      { id: 'c22_br_doubt', label: 'Спросить: чем ты докажешь', minutes: 50, terminal: true, goto: 'c22_b_station', ambientDuring: day22,
        text: 'Она останавливается посреди дороги, расстёгивает парку и достаёт сложенную карточку.\n\n— Damit.\n\nВот этим.\n\nДо Йестебурга вы доходите, не сказав больше ни слова.', effects: [set22('br', 'doubt'), lea22(-1), toJest, until22(9, 25)] },
    ] }),

  J({ id: 'c22_b_station', title: 'Пожарная часть',
    text: [
      { text: 'У пожарной части в Йестебурге очередь за супом. Дружинник с блокнотом записывает каждого. Через открытые ворота гаража видно ряды раскладушек.' },
      { when: herChoice, text: 'Лея идёт мимо очереди прямо к двери с красным крестом.\n\n— Zur Ärztin. Nicht zu Brandt.\n\nК врачу. Не к Брандту.' },
      { when: not(herChoice), text: 'На крыльце стоит Брандт, в каске, сдвинутой на затылок. Он видит вас издалека. И Лею. Он её не знает. Но он знает, кого ждал.' },
      { when: bagPoint, text: 'Синюю сумку несёшь ты. Тяжёлая: лёд ты {m:сменил|сменила} перед выходом.' },
    ],
    actions: [
      { id: 'c22_bs_sander', label: 'Отвести её к доктору Зандер', minutes: 30, terminal: true, goto: 'c22_b_card',
        text: 'Доктор Зандер выходит в мужском свитере под халатом и смотрит на Лею так, как смотрят на инструмент, которого давно не хватало.\n\n— Sie nähen? Gut. Dann nähen Sie. Den Rest klären wir später.\n\nШьёте? Хорошо. Тогда шейте. Остальное выясним потом.\n\nЛея снимает парку и закатывает рукава. Её уже нет рядом с тобой.', effects: [set22('bs', 'sander'), w22('lea_at', 'sander'), leaMoves, { if: bagPoint, then: bagToSander }, until22(10, 0)] },
      { id: 'c22_bs_brandt', label: 'Отвести её к Брандту, как решили', when: not(herChoice), minutes: 30, terminal: true, goto: 'c22_b_card',
        text: 'Брандт слушает тебя, не перебивая. Потом подаёт Лее руку, как взрослому мужчине.\n\n— Willkommen in Jesteburg. Hier wird keiner an die Nadel gebunden. Hier hilft man freiwillig. Doppelte Ration, eigenes Zimmer.\n\nДобро пожаловать в Йестебург. Здесь никого не привязывают к игле. Здесь помогают добровольно. Двойной паёк, своя комната.\n\nЛея смотрит на его руку. Потом пожимает.', effects: [set22('bs', 'brandt'), w22('lea_at', 'brandt'), leaMoves, { if: { npc: 'c16_brandt', alive: true }, then: [{ npc: 'c16_brandt', trust: 2 }] }, { if: bagPoint, then: bagToSander }, until22(10, 0)] },
      { id: 'c22_bs_both', label: 'Сказать Брандту, что она будет помогать врачу, а не лежать под иглой', when: not(herChoice), minutes: 40, terminal: true, goto: 'c22_b_card',
        outcomes: [
          { id: 'ok', check: { traits: ['persuasion'], difficulty: 3, uses: ['focus'] }, text: 'Брандт смотрит на тебя, на Лею, на дверь с красным крестом.\n\n— Bei der Ärztin. Gut. Aber wenn mein Enkel Fieber kriegt, gehört sie mir.\n\nУ врача. Хорошо. Но если у моего внука будет жар, она моя.\n\nЭто больше, чем ты {m:рассчитывал|рассчитывала}.', effects: [set22('bs', 'both'), w22('lea_at', 'sander'), w22('brandt_claim', true)] },
          { id: 'no', text: '— Ich entscheide, wo wer hilft, — говорит Брандт. Где кто помогает, решаю я.\n\nЛея уходит за ним. В дверях она оборачивается и коротко кивает тебе: ты {m:пытался|пыталась}.', effects: [set22('bs', 'both'), w22('lea_at', 'brandt')] },
        ], effects: [leaMoves, { if: bagPoint, then: bagToSander }, until22(10, 10)] },
    ] }),

  // ───────────── Карточка донора: у всех, кто хоть что-то узнал ─────────────
  B({ id: 'c22_b_card', title: 'Две строчки', location: undefined,
    text: [
      { when: leaHere, text: 'Лея разворачивает карточку на колене. Серый картон, печать бундесвера, графы.' },
      { when: wayJest, text: 'Перед тем как уйти за врачом, Лея суёт тебе в руку сложенную карточку.\n\n— Behalt sie. Damit du weißt, dass ich nicht lüge.\n\nОставь себе. Чтобы ты {m:знал|знала}, что я не вру.' },
      { when: all(wayTobias, not(v('B.c22_bw', 'burn'))), text: 'В листок вложена ещё одна бумажка. Серый картон, печать бундесвера, графы.' },
      { when: all(wayTobias, v('B.c22_bw', 'burn')), text: 'Её угол в кладовке пустой. На полу остался мокрый след от сумки и одна длинная светлая волосинка, которую она пропустила.' },
      { when: not(all(wayTobias, v('B.c22_bw', 'burn'))), text: '«Spenderausweis Nr. 3. Hartmann, Lea».\n\nКарточка донора номер три.\n\nВыше две строчки, вписанные другой рукой:\n«Nr. 1 — Bauer, K. — † 14.11.»\n«Nr. 2 — Yilmaz, S. — † 17.11.»' },
      { when: not(all(wayTobias, v('B.c22_bw', 'burn'))), text: 'Номер первый умер четырнадцатого. Номер второй — семнадцатого. Номер третий — она.' },
    ],
    actions: [
      { id: 'c22_bc_promise', label: 'Пообещать: людям в форме ты не скажешь', when: not(all(wayTobias, v('B.c22_bw', 'burn'))), minutes: 15, terminal: true, outcomes: afterCard,
        text: 'Ты говоришь это вслух, хотя её рядом может и не быть. Обещание всё равно её.\n\nПотом думаешь об {A.dat}. Про него ты не {m:обещал|обещала}.', effects: [set22('bc', 'promise'), truthB, w22('b_promised', true), lea22(2, 'c22_promised'), until22(10, 30)] },
      { id: 'c22_bc_finn', label: 'Спросить про мать и Финна', when: not(all(wayTobias, v('B.c22_bw', 'burn'))), minutes: 20, terminal: true, outcomes: afterCard,
        text: 'Финну одиннадцать. Мать работает в зале на Мессе, раздаёт одеяла. Если Лея дойдёт до Ганновера, она заберёт их и уйдёт на юг, к тётке в Хильдесхайм. Сто десять километров пешком. Она уже посчитала: пять дней.\n\nТы думаешь, что она посчитала без снега.', effects: [set22('bc', 'finn'), truthB, set22('b_hannover', true), until22(10, 35)] },
      { id: 'c22_bc_keep', label: 'Убрать карточку к себе', when: not(all(wayTobias, v('B.c22_bw', 'burn'))), minutes: 10, terminal: true, outcomes: afterCard,
        text: 'Ты кладёшь карточку во внутренний карман, к телефону. Две чужие смерти и одна живая девушка весят меньше, чем ты {m:думал|думала}.', effects: [set22('bc', 'keep'), truthB, w22('card_b', true), until22(10, 25)] },
      { id: 'c22_bc_empty', label: 'Подмести угол и закрыть кладовку', when: all(wayTobias, v('B.c22_bw', 'burn')), minutes: 15, terminal: true, outcomes: afterCard,
        text: 'Ты подметаешь угол. Волосинку бросаешь в печь, вслед за листком. Дверь в кладовку закрываешь на крючок, как будто там есть что беречь.', effects: [set22('bc', 'empty'), until22(9, 45)] },
    ] }),

  // ───────────── Хутор: Нина ─────────────
  B({ id: 'c22_b_nina', title: 'Нина спрашивает', camp: kitchen14,
    text: [
      { when: leaHere, text: 'Нина сидит за столом напротив Леи. Учебник по биологии открыт на странице с клеткой, но смотрит Нина не в учебник.\n\n— Mein Vater, — говорит она по-немецки. Мой отец. — War er wie die auf der Straße? Hat er… gewusst, wer er ist? Am Ende?\n\nОн был как те, на дороге? Он… знал, кто он? В конце?' },
      { when: all(leaHere, v('w.c22_lea_hair', 'dyed')), text: 'Нина то и дело поглядывает на тёмную голову Леи, будто за столом сидит кто-то незнакомый.' },
      { when: all(leaHere, v('w.c22_lea_hair', 'scarf')), text: 'Лея так и сидит в Хенрикином платке, хотя от печи жарко.' },
      { when: not(leaHere), text: 'Нина сидит на табурете у двери, там, где вчера сидела Лея.\n\n— Её увезли насовсем? — спрашивает она. — Она мне обещала нарисовать, как устроен глаз. У собаки и у человека. Она сказала, это почти одно и то же.' },
    ],
    actions: [
      { id: 'c22_bn_lea', label: 'Не мешать: пусть Лея ответит', when: leaHere, minutes: 25, terminal: true, goto: 'c22_b_lunch',
        text: 'Лея долго молчит. Потом отвечает честно, как отвечают взрослым: в конце они не узнают никого. Но до самых последних дней узнают. И помнят. И твой отец — помнил, Нина. До последнего.\n\nНина кивает. Потом встаёт и уходит наверх. Через минуту слышно, как она плачет. Лея идёт за ней. Ты не идёшь.', effects: [set22('bn', 'lea'), npc('c7_nina', 2), lea22(1), until22(12, 30)] },
      { id: 'c22_bn_stop', label: 'Остановить Нину: не сейчас', when: leaHere, minutes: 15, terminal: true, goto: 'c22_b_lunch',
        text: '— Ninotschka, — говоришь ты.\n\nНина закрывает учебник. Лея смотрит на тебя так, будто хотела ответить, но благодарна, что не пришлось.', effects: [set22('bn', 'stop'), npc('c7_nina', -1), until22(12, 30)] },
      { id: 'c22_bn_tell', label: 'Рассказать Нине правду: куда и зачем её увезли', when: not(leaHere), minutes: 20, terminal: true, goto: 'c22_b_lunch',
        text: 'Ты рассказываешь. Нина слушает, наклонив голову, как птица.\n\n— Значит, Оле приедет домой, — говорит она. — А она будет лежать вместо него. — Она думает. — Это честно? Или нет?\n\nТы не знаешь, что ответить. Она это видит.', effects: [set22('bn', 'tell'), npc('c7_nina', 1), until22(12, 30)] },
      { id: 'c22_bn_draw', label: 'Сесть рядом и нарисовать глаз самой, как умеешь', when: not(leaHere), minutes: 30, terminal: true, goto: 'c22_b_lunch',
        text: 'Ты рисуешь на обороте Нининой тетради: хрусталик, зрачок, нерв. Получается криво. Нина поправляет и подписывает. Потом пишет сверху по-немецки: «Für Lea». Для Леи. И вырывает лист.', effects: [set22('bn', 'draw'), w22('nina_drawing', true), npc('c7_nina', 2), until22(12, 30)] },
    ] }),

  B({ id: 'c22_b_lunch', title: 'Обед', camp: kitchen14,
    text: [
      { text: 'Обед в половине первого: суп из вчерашней картошки, хлеб Кёлер. Мальте ест лёжа, с тарелки на груди, и не роняет ни капли.' },
      { when: leaHere, text: 'Лея сидит рядом с тобой, ближе к печи и дальше от окна. Ест она быстро и молча.' },
      { when: not(leaHere), text: 'Табурет у двери пустой. Нина поставила на него свою кружку, чтобы место не казалось свободным.' },
    ],
    actions: [
      { id: 'c22_bl2_eat', label: 'Поесть горячего', minutes: 25, terminal: true, outcomes: afterLunch, ...tableOnly,
        text: 'Ты ешь медленно. После бессонной ночи суп кажется самой вкусной едой на свете.', effects: [set22('bl2', 'eat'), meal('eat'), until22(13, 0)] },
      { id: 'c22_bl2_nap', label: 'Лечь на час: ночью ты почти не {m:спал|спала}', minutes: 30, terminal: true, outcomes: afterLunch,
        text: 'Ты засыпаешь сразу, поверх одеяла, в одежде. Тебя никто не будит. Когда открываешь глаза, солнце уже ушло с подоконника.', effects: [set22('bl2', 'nap'), until22(14, 0, true)] },
      { id: 'c22_bl2_tea', label: 'Только чай', minutes: 10, terminal: true, outcomes: afterLunch,
        text: 'Ты пьёшь чай у окна и смотришь на дорогу. Пусто.', effects: [set22('bl2', 'tea'), until22(12, 45)] },
    ] }),

  // ───────────── Хутор после обеда ─────────────
  B({ id: 'c22_b_vet', title: 'Ветеринар', camp: yard14, ambient: day22,
    text: [
      { text: 'После обеда Лея выходит во двор. Ей надо что-то делать руками: это видно по тому, как она трёт ладони.' },
      { when: dogHere22, text: 'Бруно хромает на переднюю лапу. Со вчерашнего дня, а то и раньше.' },
      { text: 'У курятника сидит рыжая несушка и не встаёт. Остальные клюют её в спину.' },
    ],
    actions: [
      { id: 'c22_bv_dog', label: 'Показать ей лапу Бруно', when: dogHere22, minutes: 30, terminal: true, goto: 'c22_b_eva',
        text: 'Лея садится на корточки и берёт лапу так, как берут руку при знакомстве. Бруно не вырывается. В подушечке у него заноза размером с гвоздь. Она вынимает её пинцетом из своей аптечки, одним движением, и промывает.\n\n— So. Brav. Du bist ein guter Hund.\n\nВот так. Умница. Ты хороший пёс.\n\nВ первый раз за два дня ты видишь, как она улыбается.', effects: [set22('bv', 'dog'), w22('lea_vet', true), lea22(2), until22(13, 45)] },
      { id: 'c22_bv_hen', label: 'Показать ей курицу, которая не встаёт', minutes: 30, terminal: true, goto: 'c22_b_eva',
        text: 'Она берёт курицу на руки, щупает зоб, раздвигает перья.\n\n— Legenot. Ein Ei steckt fest. Warmes Wasser, Öl, Geduld.\n\nЯйцо застряло. Тёплая вода, масло, терпение.\n\nЧерез двадцать минут в тазу лежит яйцо, а курица сидит у Леи на коленях, как кошка.', effects: [set22('bv', 'hen'), w22('lea_vet', true), lea22(2), until22(13, 45)] },
      { id: 'c22_bv_teach', label: 'Попросить её научить тебя шить рану', minutes: 40, terminal: true, goto: 'c22_b_eva',
        outcomes: [
          { id: 'strips', when: strips, text: 'Она смотрит, как ты стягиваешь края полосками на куске сала.\n\n— Das kannst du schon. Jetzt der Knoten.\n\nЭто ты уже умеешь. Теперь узел.\n\nК концу урока на сале двенадцать ровных стежков. Она говорит: «Gut». Это много.', effects: [set22('bv', 'teach'), w22('b_sews', true), lea22(2)] },
          { id: 'plain', text: 'Иголка, нитка, кусок сала с кожей. Первые три стежка у тебя расползаются. На пятом она перестаёт поправлять. К концу урока у тебя болят пальцы, а на сале восемь кривых, но держащих стежков.', effects: [set22('bv', 'teach'), w22('b_sews', true), lea22(1)] },
        ], effects: [until22(13, 55)] },
    ] }),

  B({ id: 'c22_b_malte', title: 'Перевязка', camp: kitchen14,
    text: [
      { text: 'После обеда надо перевязать Мальте. Лея вчера показала как и оставила на подоконнике бинты, сложенные стопкой, по порядку.' },
      { text: 'Мальте смотрит на тебя снизу.\n\n— Jetzt bist du die Sanitäterin. Keine Angst. Ich schreie nur ein bisschen.\n\nТеперь санитарка ты. Не бойся. Я кричу совсем чуть-чуть.' },
    ],
    actions: [
      { id: 'c22_bt_dress', label: 'Перевязать, как она показывала', minutes: 30, terminal: true, goto: 'c22_b_eva',
        text: 'Ты разматываешь, промываешь, наматываешь заново. Виток к витку, туго, но не до синевы. Мальте кричит один раз, когда ты задеваешь доску. Потом смотрит на работу и кивает.\n\n— Besser als beim Bund.\n\nЛучше, чем в армии.', effects: [set22('bt', 'dress'), malte22(2), until22(13, 45)] },
      { id: 'c22_bt_talk', label: 'Перевязывать и расспрашивать про колонну', minutes: 35, terminal: true, goto: 'c22_b_eva',
        text: 'Мальте говорит, чтобы не думать о ноге. Про Ганновер, про пустые склады, про то, что колонну собирали два дня по всем подвалам. «Das war alles, was übrig war». Это было всё, что осталось.\n\nТы мотаешь бинт и запоминаешь.', effects: [set22('bt', 'talk'), w22('b_heard_rest', true), malte22(1), until22(13, 50)] },
      { id: 'c22_bt_nina', label: 'Позвать Нину и перевязать вдвоём', minutes: 30, terminal: true, goto: 'c22_b_eva',
        text: 'Нина держит лампу и подаёт бинты. На третьем витке она говорит: «Не так, туже», и оказывается права. Мальте смотрит на вас обеих и смеётся.\n\n— Zwei Schwestern. Ich hab Glück.\n\nДве сестры. Мне везёт.', effects: [set22('bt', 'nina'), malte22(1), npc('c7_nina', 1), until22(13, 45)] },
    ] }),

  B({ id: 'c22_b_eva', title: 'Эва', camp: kitchen14,
    text: [
      { when: all(evaHere22, leaHere), text: 'Эва на кухне чистит картошку на ужин. Лея садится напротив и берёт второй нож, не спрашивая. Они чистят молча, и кожура у обеих падает длинной лентой.\n\n— Ich habe meinen Mann nicht mal begraben, — говорит Эва в картошку. Я даже не похоронила мужа. — Er liegt im Brunnen. Weißt du, wie man damit lebt?\n\nОн лежит в колодце. Ты знаешь, как с этим жить?' },
      { when: all(evaHere22, not(leaHere)), text: 'Эва на кухне чистит картошку на ужин. Ты садишься рядом и берёшь второй нож.\n\n— Die Kleine ist weg, — говорит Эва. Малышка ушла. — Das ist richtig so. Und trotzdem wie bei Helmut. Man sieht jemanden gehen und denkt: ich hätte was sagen sollen.\n\nТак правильно. И всё равно как с Хельмутом. Видишь, как человек уходит, и думаешь: надо было что-то сказать.' },
      { when: not(evaHere22), text: 'На кухне Кёлер выкладывает из корзины две буханки. Она пришла через задний двор, по-соседски.\n\n— Im Dorf sagt man, ihr hattet Besuch von der Kolonne, — говорит она. В деревне говорят, у вас были гости с колонны. — Ich frage nicht. Ich sage nur: im Dorf sagt man es.\n\nЯ не спрашиваю. Я только говорю: в деревне говорят.' },
    ],
    actions: [
      { id: 'c22_be_listen', label: 'Слушать', when: evaHere22, minutes: 30, terminal: true, goto: 'c22_b_bag',
        outcomes: [
          { id: 'lea', when: leaHere, text: 'Лея долго молчит.\n\n— Nein. Ich habe meinen Vater auch nicht begraben. Hannover, im Oktober, Massengrab. Man lebt einfach weiter. Und irgendwann merkt man, dass man lebt.\n\nНет. Я тоже не похоронила отца. Ганновер, октябрь, братская могила. Просто живёшь дальше. И однажды замечаешь, что живёшь.\n\nЭва кивает и отдаёт ей свою почищенную картофелину.', effects: [set22('be', 'listen'), npc('c8_eva', 2), lea22(1)] },
          { id: 'plain', text: 'Ты слушаешь. Эва говорит про Хельмута: как он чинил часы и ставил их на четыре минуты вперёд, чтобы она не опаздывала. Ни одни часы в доме Хенрике не идут вперёд. Все отстают.', effects: [set22('be', 'listen'), npc('c8_eva', 2)] },
        ], effects: [until22(14, 30)] },
      { id: 'c22_be_well', label: 'Сказать Эве: колодец можно засыпать и поставить крест', when: evaHere22, minutes: 25, terminal: true, goto: 'c22_b_bag',
        text: 'Эва перестаёт чистить.\n\n— Ein Kreuz. Ja. Aus Birke. Helmut mochte Birke.\n\nКрест. Да. Из берёзы. Хельмут любил берёзу.\n\nОна повторяет это ещё раз, тише, и снова берётся за нож.', effects: [set22('be', 'well'), w22('eva_cross', true), npc('c8_eva', 3), until22(14, 25)] },
      { id: 'c22_be_koehler', label: 'Сказать Кёлер: гости были и ушли', when: not(evaHere22), minutes: 20, terminal: true, goto: 'c22_b_bag',
        text: '— Gut, — говорит Кёлер. Хорошо. — Dann sage ich das auch, wenn man fragt.\n\nТогда я так и буду говорить, если спросят.\n\nОна уходит тем же путём, через задний двор, и прикрывает за собой калитку.', effects: [set22('be', 'koehler'), npc('c3_koehler', 1), until22(14, 20)] },
      { id: 'c22_be_koehler_truth', label: 'Сказать Кёлер правду', when: not(evaHere22), minutes: 25, terminal: true, goto: 'c22_b_bag',
        text: 'Кёлер слушает, поджав губы.\n\n— Ich habe nichts gehört, — говорит она в конце. Я ничего не слышала. — Aber wenn die Kleine Brot braucht, dann hinterm Ofen, wie immer.\n\nНо если малой нужен хлеб, то за печкой, как всегда.', effects: [set22('be', 'koehler_truth'), w22('koehler_knows', true), npc('c3_koehler', 2), until22(14, 25)] },
    ] }),

  B({ id: 'c22_b_bag', title: 'Кладовка', camp: kitchen14,
    text: [
      { when: bag22('lueneburg'), text: 'Угол в кладовке пуст. Сумку унесли утром. На каменном полу осталось влажное пятно от растаявшего льда.' },
      { when: bag22('keep'), text: 'Плазму забрали утром. Коробка с шприц-ручками стоит на верхней полке кладовки, за банками с огурцами. Десять штук.' },
      { when: bag22('wait'), text: 'Синяя сумка стоит в углу кладовки. Полоска на крышке: два белых окошка, одно зелёное. Лёд в пакетах давно стал водой.' },
      { when: merle, text: 'Ты думаешь о Мерле. Десятого у неё было на девять дней.' },
    ],
    actions: [
      { id: 'c22_bg_ice', label: 'Наколоть льда из бочки у сарая и сменить в сумке', when: bag22('wait'), minutes: 25, terminal: true, outcomes: [{ id: 'u', when: uteAlive, goto: 'c22_b_ute' }, { id: 'l', goto: 'c22_b_letter' }], ambientDuring: day22,
        text: 'В бочке у сарая за ночь намёрз лёд толщиной в палец. Ты колешь его и набиваешь пакеты. Полоска на крышке больше не меняется. До среды плазма доживёт.', effects: [set22('bg', 'ice'), w22('bag_iced', true), until22(15, 0)] },
      { id: 'c22_bg_count', label: 'Пересчитать ручки и посмотреть сроки', when: any(bag22('keep'), bag22('wait')), minutes: 15, terminal: true, outcomes: [{ id: 'u', when: uteAlive, goto: 'c22_b_ute' }, { id: 'l', goto: 'c22_b_letter' }],
        text: 'Десять ручек. Срок годности — март следующего года. На коробке напечатано: хранить при температуре от двух до восьми. В кладовке как раз пять.', effects: [set22('bg', 'count'), w22('insulin_counted', true), until22(14, 50)] },
      { id: 'c22_bg_shut', label: 'Закрыть кладовку и не думать об этом', minutes: 5, terminal: true, outcomes: [{ id: 'u', when: uteAlive, goto: 'c22_b_ute' }, { id: 'l', goto: 'c22_b_letter' }],
        text: 'Ты закрываешь дверь на крючок. Думать об этом всё равно придётся. Но не сейчас.', effects: [set22('bg', 'shut'), until22(14, 40)] },
    ] }),

  B({ id: 'c22_b_ute', title: 'Уте за новостями', camp: yard14, ambient: day22,
    text: [
      { text: 'В три у калитки стоит Уте. В двух платках, без узелка. Новостей она не приносит. Она пришла за ними.' },
      { text: '— Man sagt, die Kolonne ist weg. Und dass ein Bus kommt, am Montag. Für die, die krank waren.\n\nГоворят, колонны больше нет. И что в понедельник придёт автобус. За теми, кто болел.\n\nОна смотрит на тебя внимательно.\n\n— Mein Jannes war im Oktober krank. Drei Tage. Steht er jetzt auf einer Liste?\n\nМой Яннес болел в октябре. Три дня. Он теперь в каком-то списке?' },
    ],
    actions: [
      { id: 'c22_bu_truth', label: 'Сказать, что знаешь: Брандт собирает имена переболевших', minutes: 25, terminal: true, outcomes: afterUte,
        text: 'Уте слушает, не перебивая. Потом поправляет платок.\n\n— Dann war Jannes nicht krank. Er hatte Grippe. Das sage ich jedem, der fragt.\n\nТогда Яннес не болел. У него был грипп. Так я и скажу каждому, кто спросит.\n\nОна уходит быстро, не оглядываясь.', effects: [set22('bu', 'truth'), w22('ute_warned', true), npc('c14_ute', 2), until22(15, 30)] },
      { id: 'c22_bu_unsure', label: 'Сказать: ты не знаешь', minutes: 15, terminal: true, outcomes: afterUte,
        text: '— Keiner weiß was, — говорит Уте. Никто ничего не знает. — Und am Montag wissen es alle.\n\nА в понедельник будут знать все.\n\nОна стоит ещё немного, потом уходит к насыпи.', effects: [set22('bu', 'unsure'), until22(15, 20)] },
      { id: 'c22_bu_tea', label: 'Позвать её в дом, к печи', minutes: 30, terminal: true, outcomes: afterUte,
        text: 'Уте пьёт чай, не снимая платков. Она рассказывает, что ночами слышит, как поёт Кай. Из ямы за теплицей. Тихо, как в детстве, когда не мог уснуть.\n\n— Ich weiß, dass das nicht geht. Aber ich höre es.\n\nЯ знаю, что так не бывает. Но я слышу.', effects: [set22('bu', 'tea'), npc('c14_ute', 2), { body: 'stress', delta: 1 }, until22(15, 35)] },
    ] }),

  B({ id: 'c22_b_letter', title: 'Письмо в Люнебург', camp: kitchen14,
    text: [
      { text: 'В понедельник в Люнебург поедет фургон прачечной. Кёлер обещала передать письмо. Ты садишься за кухонный стол с Нининой тетрадью.' },
      { text: 'Первая строчка не пишется. Ты знаешь то, чего не знает никто в Люнебурге. Может быть, и Оле.' },
      { when: v('w.c22_lea_things', 'letter'), text: 'Конверт с резинкой и ручкой лежит рядом. Его ты отдашь Кёлер вместе с письмом, отдельно.' },
      { when: v('w.c22_lea_sleep', 'nina'), text: 'Сверху, из Нининой комнаты, доносится смех. Пишется под него легче.' },
    ],
    actions: letterActions('c22_bl', 'c22_dusk', [until22(17, 20)]) }),

  // ───────────── Йестебург: сумка и пункт ─────────────
  B({ id: 'c22_b_carry', title: 'С сумкой в Йестебург', camp: tense14, ambient: day22,
    text: [
      { text: 'Вы решили: сумку — врачу в Йестебург. Ты меняешь лёд в пакетах, надеваешь сумку через плечо и выходишь. Четыре километра. Сумка тяжелее, чем выглядит.' },
      { when: leaHere, text: 'Лея провожает тебя до ворот.\n\n— Sag der Ärztin: die Plasma ist von Freitag. Und das Insulin ist kalt geblieben. Das ist wichtig.\n\nСкажи врачу: плазма с пятницы. И инсулин не грелся. Это важно.' },
    ],
    actions: [
      { id: 'c22_bk_road', label: 'Идти по дороге', minutes: 50, terminal: true, goto: 'c22_b_point', ambientDuring: day22,
        text: 'На полпути тебя обгоняет трактор с прицепом: дружинники Брандта везут доски. Один машет. Ты машешь в ответ и прижимаешь сумку локтем.', effects: [set22('bk', 'road'), toJest, until22(14, 0)] },
      { id: 'c22_bk_field', label: 'Идти полем, вдоль лесополосы', minutes: 55, terminal: true, goto: 'c22_b_point', ambientDuring: day22,
        text: 'Поле подмёрзшее, идти легко. Один раз в лесополосе что-то трещит. Ты замираешь. Сорока. Дальше ты идёшь быстрее.', effects: [set22('bk', 'field'), toJest, until22(14, 5)] },
    ] }),

  J({ id: 'c22_b_point', title: 'Задняя комната',
    text: [
      { text: 'В пункте у пожарной части пахнет хлоркой и гороховым супом. Доктор Зандер выходит к тебе, вытирая руки.' },
      { when: all(wayJest, v('w.c22_lea_at', 'sander')), text: 'За её спиной, у стола, работает Лея. Она не поднимает головы, но ты видишь: она знает, что ты здесь.' },
      { when: all(bagPoint, not(wayJest)), text: 'Она открывает сумку прямо на пороге, смотрит полоску, пакеты, коробку с ручками. Долго молчит.\n\n— Woher?\n\nОткуда?' },
      { text: 'В задней комнате, за закрытой дверью, лежат двое. Мужчина и подросток. У обоих забинтованы руки. Оба в жару. Дверь заперта снаружи на щеколду.' },
      { text: '— Zwei Gebissene, — говорит Зандер. Двое укушенных. — Und eine Frau aus der Kirchweg, Diabetikerin, seit Mittwoch ohne Insulin.\n\nИ женщина с Кирхвег, диабетик, со среды без инсулина.' },
    ],
    actions: [
      { id: 'c22_bp_give', label: 'Отдать всё и сказать, откуда', when: all(bagPoint, not(wayJest)), minutes: 25, terminal: true, outcomes: afterPoint,
        text: 'Ты рассказываешь про колонну и про сумку. Про Лею — нет. Доктор Зандер кивает на каждое слово, как будто ставит галочки.\n\n— Die Plasma kriegen die zwei hinten. Das ist eine Woche. Mehr nicht. Das Insulin — die Frau aus der Kirchweg. Das ist ein Winter.\n\nПлазму получат двое в задней комнате. Это неделя. Не больше. Инсулин — женщине с Кирхвег. Это зима.', effects: [set22('bp', 'give'), ...bagToSander, pointTime(10)] },
      { id: 'c22_bp_ask', label: 'Спросить: плазма их вылечит?', minutes: 20, terminal: true, outcomes: afterPoint,
        text: 'Доктор Зандер смотрит на дверь задней комнаты.\n\n— Nein. Sie hält es auf. Sechs Tage, zehn, vierzehn. Das steht in keinem Bericht. Aber ich hab genug gesehen.\n\nНет. Она задерживает. Шесть дней, десять, четырнадцать. Этого нет ни в одном отчёте. Но я видела достаточно.', effects: [set22('bp', 'ask'), w22('b_heard_delay', true), { if: all(bagPoint, not(wayJest)), then: bagToSander }, pointTime(5)] },
      { id: 'c22_bp_help', label: 'Предложить помочь, пока ты здесь', minutes: 40, terminal: true,
        outcomes: [
          { id: 'strips_j', when: all(strips, wayJest), goto: 'c22_b_room', text: 'Зандер узнаёт твои руки раньше лица.\n\n— Die mit den Streifen. Gut. Tisch zwei.\n\nТа, что с полосками. Хорошо. Второй стол.\n\nСорок минут ты стягиваешь порезы и ссадины. Никто не спрашивает, откуда ты.', effects: [set22('bp', 'help'), w22('b_helped_point', true), { if: all(bagPoint, not(wayJest)), then: bagToSander }] },
          { id: 'strips', when: strips, goto: 'c22_b_soup', text: 'Зандер узнаёт твои руки раньше лица.\n\n— Die mit den Streifen. Gut. Tisch zwei.\n\nТа, что с полосками. Хорошо. Второй стол.\n\nСорок минут ты стягиваешь порезы и ссадины. Никто не спрашивает, откуда ты.', effects: [set22('bp', 'help'), w22('b_helped_point', true), { if: all(bagPoint, not(wayJest)), then: bagToSander }] },
          { id: 'plain_j', when: wayJest, goto: 'c22_b_room', text: 'Тебе дают таз, губку и мальчика с разбитым коленом. Потом старика с ожогом. Потом ещё кого-то. Сорок минут проходят, как пять.', effects: [set22('bp', 'help'), w22('b_helped_point', true), { if: all(bagPoint, not(wayJest)), then: bagToSander }] },
          { id: 'plain', goto: 'c22_b_soup', text: 'Тебе дают таз, губку и мальчика с разбитым коленом. Потом старика с ожогом. Потом ещё кого-то. Сорок минут проходят, как пять.', effects: [set22('bp', 'help'), w22('b_helped_point', true), { if: all(bagPoint, not(wayJest)), then: bagToSander }] },
        ], effects: [{ if: wayJest, then: [until22(11, 20)], else: [until22(15, 0)] }] },
    ] }),

  J({ id: 'c22_b_soup', title: 'Суп у пожарной части',
    text: [
      { text: 'У ворот пожарной части раздают суп из бидона. Женщина в пожарной куртке разливает, не глядя в лица.' },
      { when: sabine, text: 'Это Сабина, дочь Брандта. Она узнаёт тебя и наливает полнее.\n\n— Mats hat heute gegessen. Zum ersten Mal seit Sonntag. Ohne Fieber. — Она понижает голос. — Und Vater will trotzdem die Liste.\n\nМатс сегодня поел. Первый раз с воскресенья. Без жара. И отец всё равно хочет список.' },
    ],
    actions: [
      { id: 'c22_bq_eat', label: 'Поесть супа', minutes: 20, terminal: true, outcomes: toLetter,
        text: 'Гороховый суп, густой, с копчёным. Ты ешь стоя, у стены. По улице проезжает трактор с досками: Брандт строит что-то у школы.', effects: [set22('bq', 'eat'), { body: 'hunger', delta: -35 }, { body: 'thirst', delta: -20 }, until22(15, 25)] },
      { id: 'c22_bq_sabine', label: 'Спросить Сабину, что за список', when: sabine, minutes: 25, terminal: true, outcomes: toLetter,
        text: '— Alle, die es überstanden haben. Er will einen eigenen Spender. Für Mats. Für das Dorf. — Она ставит половник в бидон. — Er glaubt daran. Das ist das Schlimmste.\n\nВсе, кто переболел. Он хочет своего донора. Для Матса. Для деревни. Он в это верит. Это хуже всего.', effects: [set22('bq', 'sabine'), w22('b_sabine_list', true), { body: 'hunger', delta: -35 }, until22(15, 30)] },
      { id: 'c22_bq_skip', label: 'Не есть: дома ждут', minutes: 5, terminal: true, outcomes: toLetter,
        text: 'Ты проходишь мимо очереди. Супа хватит не всем. Пусть достанется тем, кому дома ничего не ждёт.', effects: [set22('bq', 'skip'), until22(15, 10)] },
    ] }),

  J({ id: 'c22_b_room', title: 'Комната',
    text: [
      { when: brandtRoom, text: 'Брандт сам показывает Лее «её комнату». Бывшая кладовая общинного дома: кровать, тумбочка, таз, на стене календарь пожарной дружины за прошлый год. Чисто. Тепло.' },
      { when: brandtRoom, text: 'Задвижка на двери снаружи. Новая, ещё блестит.\n\n— Zu ihrer Sicherheit, — говорит Брандт. Для её безопасности. — Hier laufen Leute rum, die verzweifelt sind.\n\nЗдесь ходят отчаявшиеся люди.' },
      { when: not(brandtRoom), text: 'Лея работает за вторым столом пункта, как будто работала здесь всегда. Доктор Зандер подходит к тебе с кружкой и встаёт рядом, глядя на Лею.' },
      { when: not(brandtRoom), text: '— Die näht wie eine Chirurgin und redet wie eine Tierärztin. Wer ist sie wirklich?\n\nШьёт как хирург, а говорит как ветеринар. Кто она на самом деле?' },
    ],
    actions: [
      { id: 'c22_bo_lock', label: 'Попросить Брандта снять задвижку', when: brandtRoom, minutes: 20, terminal: true, goto: 'c22_b_teen',
        outcomes: [
          { id: 'ok', check: { traits: ['persuasion'], difficulty: 4, uses: ['focus'] }, text: 'Ты говоришь, что под замком добровольцами не становятся. Брандт долго смотрит на задвижку, потом достаёт из кармана отвёртку.\n\n— Von innen. Dann entscheidet sie, wer reinkommt.\n\nИзнутри. Пусть сама решает, кого впускать.\n\nЛея смотрит на тебя поверх его плеча. Долго.', effects: [set22('bo', 'lock'), w22('lock_inside', true), lea22(3, 'c22_lock')] },
          { id: 'no', text: '— Die bleibt, — говорит Брандт. Останется. — Wenn sie freiwillig hier ist, stört sie ja nicht.\n\nЕсли она здесь добровольно, она ведь ей не мешает.\n\nЛея садится на кровать и смотрит на календарь за прошлый год.', effects: [set22('bo', 'lock'), lea22(1)] },
        ], effects: [until22(11, 40)] },
      { id: 'c22_bo_back', label: 'Сказать Лее при Брандте: на хуторе для тебя всегда есть место', when: brandtRoom, minutes: 15, terminal: true, goto: 'c22_b_teen',
        text: 'Брандт не перебивает. Только складывает руки на груди.\n\n— Ich weiß, — говорит Лея. Я знаю. — Danke.\n\nБрандт выходит первым. В дверях он оборачивается и смотрит на тебя так, как смотрят на соседа, у которого слишком длинный язык.', effects: [set22('bo', 'back'), w22('lea_door_open', true), lea22(2), { if: { npc: 'c16_brandt', alive: true }, then: [{ npc: 'c16_brandt', trust: -2 }] }, until22(11, 35)] },
      { id: 'c22_bo_quiet', label: 'Промолчать', when: brandtRoom, minutes: 10, terminal: true, goto: 'c22_b_teen',
        text: 'Ты молчишь. Брандт кладёт на тумбочку пачку галет и уходит. Лея берёт галеты, вертит пачку в руках и кладёт обратно.', effects: [set22('bo', 'quiet'), until22(11, 30)] },
      { id: 'c22_bo_vet', label: 'Сказать Зандер правду: ветеринар из Ганновера', when: not(brandtRoom), minutes: 15, terminal: true, goto: 'c22_b_teen',
        text: '— Tierärztin. — Зандер усмехается в кружку. — Ehrlicher als die Hälfte meiner Kollegen.\n\nВетеринар. Честнее половины моих коллег.\n\nБольше она ничего не спрашивает. Но, уходя к столу, кладёт Лее руку на плечо.', effects: [set22('bo', 'vet'), w22('sander_knows', 'vet'), until22(11, 35)] },
      { id: 'c22_bo_cousin', label: 'Сказать: моя кузина из Харбурга, санитарка', when: not(brandtRoom), minutes: 15, terminal: true, goto: 'c22_b_teen',
        text: '— Natürlich, — говорит Зандер. Конечно. — Und ich bin die Königin von Dänemark.\n\nА я королева Дании.\n\nОна допивает и уходит к столу. Спорить ей некогда.', effects: [set22('bo', 'cousin'), w22('sander_knows', 'doubt'), until22(11, 35)] },
      { id: 'c22_bo_ask', label: 'Сказать: спросите её сами', when: not(brandtRoom), minutes: 10, terminal: true, goto: 'c22_b_teen',
        text: '— Später. Wenn sie Zeit hat. Gerade hat sie keine.\n\nПотом. Когда у неё будет время. Сейчас его нет.\n\nЗандер уходит к столу и встаёт рядом с Леей. Через минуту они уже работают в четыре руки.', effects: [set22('bo', 'ask'), until22(11, 30)] },
    ] }),

  J({ id: 'c22_b_teen', title: 'Окошко в двери',
    text: [
      { text: 'В двери задней комнаты есть окошко, заклеенное наполовину бумагой. С той стороны к стеклу прижимается лицо. Подросток, лет четырнадцати. Глаза блестят от жара. Рука в бинтах.' },
      { text: '— Haben Sie Papier? — спрашивает он через стекло. У вас есть бумага? — Ich will meiner Mutter schreiben. Sie ist in Hamburg. Ich weiß, dass es nicht ankommt.\n\nЯ хочу написать маме. Она в Гамбурге. Я знаю, что не дойдёт.' },
    ],
    actions: [
      { id: 'c22_bz_paper', label: 'Отдать ему лист и карандаш через щель под дверью', minutes: 30, terminal: true, goto: 'c22_b_soup',
        text: 'Лист из Нининой тетради проходит под дверью. Карандаш тоже. Подросток садится на пол спиной к двери и пишет долго, стирая пальцем. Потом просовывает лист обратно, сложенный вчетверо.\n\n— Wenn Sie nach Hamburg kommen. Nur wenn.\n\nЕсли будете в Гамбурге. Только если.\n\nНа листке адрес в Бармбеке. В двух улицах от твоей квартиры.', effects: [set22('bz', 'paper'), w22('teen_letter', true), { give: 'c22_teen_letter' }, { body: 'stress', delta: 2 }, until22(12, 20)] },
      { id: 'c22_bz_talk', label: 'Сесть у двери и поговорить с ним', minutes: 30, terminal: true, goto: 'c22_b_soup',
        text: 'Его зовут Йонас. Его укусил отец, на второй день, на кухне. Отец не узнал его. Йонас рассказывает это спокойно, как пересказывают фильм. Ты сидишь на полу у двери, пока он не засыпает с той стороны: слышно, как он сползает по двери.', effects: [set22('bz', 'talk'), { body: 'stress', delta: 3 }, until22(12, 20)] },
      { id: 'c22_bz_away', label: 'Отойти от окошка', minutes: 5, terminal: true, goto: 'c22_b_soup',
        text: 'Ты отходишь. Лицо в окошке смотрит тебе вслед, пока ты не сворачиваешь за угол коридора.', effects: [set22('bz', 'away'), until22(12, 0)] },
    ] }),

  J({ id: 'c22_b_school', title: 'Школа', ambient: day22,
    text: [
      { text: 'По дороге из пункта ты проходишь мимо школы. У входа в спортзал дружинники Брандта сгружают с прицепа кровати. Настоящие, больничные, на колёсиках.' },
      { text: 'Над дверью криво прибита фанерка. Свежей краской: «Spenderstation Jesteburg».\n\nДонорский пункт Йестебурга.' },
      { text: 'Кроватей шесть. У каждой на спинке — пустой листок для фамилии.' },
    ],
    actions: [
      { id: 'c22_bx_ask', label: 'Спросить дружинника, для кого кровати', minutes: 20, terminal: true, goto: 'c22_b_letter_j',
        text: '— Für die Genesenen. Ab Montag. — Дружинник вытирает лоб. — Erst die Freiwilligen. Dann die von der Liste.\n\nДля переболевших. С понедельника. Сначала добровольцы. Потом те, кто в списке.\n\nОн говорит это с гордостью. У него за спиной стоит шестая кровать, ещё без матраса.', effects: [set22('bx', 'ask'), w22('b_school', true), until22(14, 30)] },
      { id: 'c22_bx_help', label: 'Помочь занести кровать: узнать больше изнутри', minutes: 30, activity: 'moderate', terminal: true, goto: 'c22_b_letter_j',
        text: 'Внутри спортзала на шведской стенке висят крюки для капельниц. У стены ящик с иглами и пакетами, армейский. На ящике мелом: «von Lüneburg». Из Люнебурга. Брандт уже получил то, что нужно. Ему не хватает только людей.', effects: [set22('bx', 'help'), w22('b_school', true), w22('b_saw_kit', true), { body: 'fatigue', delta: 3 }, until22(14, 40)] },
      { id: 'c22_bx_go', label: 'Пройти мимо', minutes: 10, terminal: true, goto: 'c22_b_letter_j',
        text: 'Ты идёшь мимо, не замедляя шага. Спиной чувствуешь взгляды дружинников. Им интересно, кто ты. Тебе — нет.', effects: [set22('bx', 'go'), until22(14, 10)] },
    ] }),
  J({ id: 'c22_b_letter_j', title: 'Письмо на подоконнике',
    text: [
      { text: 'Перед уходом ты садишься на подоконник в коридоре пункта. В понедельник в Люнебург пойдёт фургон прачечной. Кёлер обещала передать письмо. В кармане — сложенный лист из Нининой тетради.' },
      { text: 'Первая строчка не пишется. Ты знаешь то, чего не знает никто в Люнебурге. Может быть, и Оле.' },
    ],
    actions: letterActions('c22_blj', 'c22_dusk', [toFarm, until22(17, 20)]) }),
];
