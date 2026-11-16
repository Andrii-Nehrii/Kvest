import type { Scene } from '../../engine/content-types';
import { flag, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { ninaFarm, v } from './point18';
import { npc } from './point19';
import { entryJoin } from './point30';
import { S31, brothers31, frost31, henrike31, partnerUp31, set31, until31, w31 } from './point31';

// Участок 31, третий проход (до уровня 19–20): пожарные у ворот (A), вдова Хиннерка и мать мальчишки (B), поздний вечер у обоих.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S31({ ...scene, for: 'any', chapter: 'ch3' });
const boy = flag('w.c30_boy_saved');

export const day31GScenes: Scene[] = [
  X({ id: 'c31_a_uwe', title: 'Пожарные', camp: yard14, ambient: frost31,
    text: [
      { text: 'К воротам подъезжает пожарная машина дружины, старая, красная, с облупленной лестницей. За рулём Уве. Насос у машины замёрз ночью, и шланг лопнул по шву. Без насоса в следующий раз, если загорится сарай, будут носить вёдрами.' },
      { when: entryJoin, text: '— Du warst gestern in der Kette, — говорит Уве. Ты вчера был в цепи. — Hilf uns mit dem Schlauch. Deniz sagt, du hast Hände.\n\nПомоги со шлангом. Дениз говорит, у тебя руки.' },
      { when: not(entryJoin), text: '— Ihr habt den Rand gehalten, — говорит Уве. Вы держали край. — Hilf uns mit dem Schlauch, wenn du kannst.\n\nПомоги со шлангом, если можешь.' },
      { text: 'У Уве руки в саже по локоть, на щеке ожог, свежий, блестящий от мази. Он смотрит на рваный шланг, как на раненую собаку.' },
      { when: v('$.c31_ag', 'no'), text: 'Лукаса ты {m:отправил|отправила} ни с чем. Он ушёл с лопатой на плече, оглядываясь, и тебе это не нравится.' },
    ],
    actions: [
      { id: 'c31_au2_fix', label: 'Чинить шланг: проволока, резина, хомуты', minutes: 40, activity: 'moderate', terminal: true, goto: 'c31_a_deniz',
        text: 'Вы с Уве режете старую камеру от трактора на полосы и бинтуете шов, затягивая проволокой. Потом пробуете водой из бочки. Течёт, но держит. Уве смотрит на тебя и говорит: «Du kannst bei uns anfangen, wenn du willst». Можешь начинать у нас, если хочешь.', effects: [set31('au2', 'fix'), w31('hose_fixed', true), npc('c15_tobias', 1, 'c31_fixed_hose'), until31(12, 30)] },
      { id: 'c31_au2_part', label: 'Отдать им свой шланг из сарая', minutes: 20, terminal: true, goto: 'c31_a_deniz',
        text: 'В сарае у Хенрике висит садовый шланг, свёрнутый с лета. Ты отдаёшь его. Он короче и тоньше, но целый. Уве жмёт тебе руку. Хенрике смотрит из окна и молчит: шланг был мужа.', effects: [set31('au2', 'part'), w31('hose_given', true), npc('henrike', -1), until31(12, 15)] },
      { id: 'c31_au2_no', label: 'Сказать: сегодня никак', minutes: 10, terminal: true, goto: 'c31_a_deniz',
        text: 'Уве кивает и уезжает. Машина дымит на повороте. В следующий раз, если загорится, будут носить вёдрами.', effects: [set31('au2', 'no'), until31(12, 0)] },
    ] }),

  X({ id: 'c31_b_widow', title: 'Вдова', camp: kitchen14, onEnter: [until31(12, 0)],
    text: [
      { text: 'В полдень к калитке подходит женщина в чёрном пальто, без шапки. Гизела Мёллер, жена Хиннерка. Она обходит дворы тех, кто был ночью у впадины или рядом.' },
      { when: entryJoin, text: '— Waren Sie dabei? Am Rand? Haben Sie ihn gesehen? Ich will nur wissen, wie.\n\nВы были там? На краю? Вы его видели? Я хочу только знать, как.' },
      { when: not(entryJoin), text: '— Sie waren nicht am Rand, ich weiß. Aber morgen ist die Beerdigung. Ich brauche Hände für das Essen danach. Wir sind so wenige.\n\nВы не были на краю, я знаю. Но завтра похороны. Мне нужны руки для поминок. Нас так мало.' },
    ],
    actions: [
      { id: 'c31_bw2_truth', label: 'Рассказать, что знаешь: он оттащил Брандта и поскользнулся сам', when: entryJoin, minutes: 30, terminal: true, goto: 'c31_b_doc',
        text: 'Она слушает молча, не плачет. Потом говорит: «Das passt zu ihm. Er hat immer die anderen zuerst». Это на него похоже. Он всегда сначала других. Уходит, выпрямившись, как будто ей стало легче нести.', effects: [set31('bw2', 'truth'), w31('widow', 'told'), until31(12, 30)] },
      { id: 'c31_bw2_soft', label: 'Сказать: всё случилось быстро, он не мучился', when: entryJoin, minutes: 30, terminal: true, goto: 'c31_b_doc',
        text: 'Ты не знаешь, правда ли это. Она кивает, благодарит и обнимает тебя, коротко. Ты стоишь у калитки, пока она не скрывается за поворотом.', effects: [set31('bw2', 'soft'), w31('widow', 'soft'), until31(12, 30)] },
      { id: 'c31_bw2_uwe', label: 'Сказать: спросите Уве, он стоял рядом', when: entryJoin, minutes: 20, terminal: true, goto: 'c31_b_doc',
        text: '— Uwe sagt nichts. Uwe hat nie was gesagt. — Она пожимает плечами и уходит к следующему двору. Ты остаёшься с тем, что не сказал{m:|а}.', effects: [set31('bw2', 'uwe'), until31(12, 20)] },
      { id: 'c31_bw2_cook', label: 'Пообещать прийти завтра и помочь с поминками', when: not(entryJoin), minutes: 30, terminal: true, goto: 'c31_b_doc',
        text: 'Гизела записывает твоё имя на бумажке, где ещё четыре имени. «Kartoffelsalat. Für vierzig». Картофельный салат. На сорок человек. Хенрике, услышав, сразу идёт в подвал.', effects: [set31('bw2', 'cook'), w31('widow', 'cook'), npc('henrike', 1), until31(12, 30)] },
      { id: 'c31_bw2_food', label: 'Отдать ей корзину яиц для поминок', when: not(entryJoin), minutes: 20, terminal: true, goto: 'c31_b_doc',
        text: 'Хенрике отдаёт десяток без слов. Гизела держит корзину обеими руками, как держат ребёнка, и уходит.', effects: [set31('bw2', 'food'), w31('widow', 'eggs'), until31(12, 20)] },
    ] }),

  X({ id: 'c31_b_mother', title: 'Мать', location: 'c16_jesteburg', camp: { at: 'c16_jesteburg', stock: 'c3_farm_stock', rest: false }, safe: false, ambient: { tempC: 12, outdoor: false, wet: false },
    text: [
      { when: boy, text: 'Когда ты выходишь из пункта, у крыльца тебя ждёт женщина. Мать мальчишки из цепи. Она держит в руках вязаные носки, толстые, серые, двойной вязки.' },
      { when: not(boy), text: 'Когда ты выходишь из пункта, у крыльца тебя ждёт женщина. Жена дружинника, которому сегодня сняли пальцы. Она держит в руках вязаные носки, толстые, серые, двойной вязки.' },
      { text: '— Ich habe sie für ihn gestrickt. Er braucht sie jetzt nicht mehr so viele. Nehmen Sie. Bitte.\n\nЯ вязала их для него. Ему теперь столько не нужно. Возьмите. Пожалуйста.' },
    ],
    actions: [
      { id: 'c31_bm2_take', label: 'Взять и поблагодарить', minutes: 20, terminal: true, goto: 'c31_b_list',
        text: 'Носки тёплые, будто их только что сняли со спиц. Она кивает и уходит быстро, не оборачиваясь. В кармане у тебя теперь пара на мороз.', effects: [set31('bm2', 'take'), { give: 'c31_socks' }, until31(15, 40)] },
      { id: 'c31_bm2_back', label: 'Отказаться: пусть ему будут, на смену', minutes: 20, terminal: true, goto: 'c31_b_list',
        text: '— Er hat genug. — Она вкладывает носки тебе в руки силой. Ты отдаёшь их Лее у двери: в пункте носки нужнее всего. Лея кивает, как будто так и было задумано.', effects: [set31('bm2', 'back'), w31('socks_point', true), npc('c21_lea', 1), until31(15, 40)] },
      { id: 'c31_bm2_talk', label: 'Спросить, как он, и посидеть с ней на крыльце', minutes: 40, terminal: true, goto: 'c31_b_list',
        text: 'Вы сидите на холодной ступеньке. Она рассказывает, каким он был в пять лет, в десять. Ты слушаешь. Носки ты берёшь в конце, когда она уже встаёт.', effects: [set31('bm2', 'talk'), { give: 'c31_socks' }, w31('mother_talked', true), until31(15, 45)] },
    ] }),

  X({ id: 'c31_a_late', title: 'Поздно', camp: house14, onEnter: [until31(19, 30)],
    text: [
      { text: 'После ужина дом затихает рано: все ещё спят после ночи. Ты сидишь у печи {m:один|одна}. Завтра в семь Бухгольц.' },
      { when: brothers31, text: 'Во дворе мигает фонарь: Керем пришёл договориться про утро. Стоит у калитки и не заходит.' },
      { when: henrike31, text: 'Хенрике домывает посуду и поглядывает на тебя.' },
      { text: 'Звёзды над насыпью крупные и колючие. Изо рта пар. Где-то далеко, за лесом, гудит мотор и стихает.' },
      { when: v('$.c31_ev', 'partner'), text: 'За ужином вы просидели рядом, плечом к плечу, почти не разговаривая. Этого хватило.' },
      { when: v('$.c31_ev', 'eat'), text: 'После ужина клонит в сон: картошка и чай до краёв сделали своё.' },
    ],
    actions: [
      { id: 'c31_al_kerem', label: 'Выйти к Керему и договориться', when: brothers31, minutes: 20, terminal: true, goto: 'c31_checkpoint', ambientDuring: frost31,
        text: 'Керем говорит, что Дениз хочет выехать в шесть, а не в семь: так меньше постов. Ещё он спрашивает, не страшно ли тебе ехать на свою улицу. Ты пожимаешь плечами. Он кивает: ему тоже было бы.', effects: [set31('al', 'kerem'), w31('early_start', true), npc('kerem', 1), until31(20, 0)] },
      { id: 'c31_al_henrike', label: 'Спросить Хенрике, что привезти ей из Бухгольца', when: henrike31, minutes: 20, terminal: true, goto: 'c31_checkpoint',
        text: 'Она думает долго. Потом говорит: «Kerzen. Und wenn du an der Apotheke vorbeikommst… nein. Kerzen». Свечи. А если будешь мимо аптеки… нет. Свечи. Ты запоминаешь и про аптеку тоже.', effects: [set31('al', 'henrike'), set31('candles', true), npc('henrike', 1), until31(20, 0)] },
      { id: 'c31_al_sleep', label: 'Лечь пораньше', minutes: 20, terminal: true, goto: 'c31_checkpoint',
        text: 'Ты засыпаешь, не дождавшись, пока прогорит печь.', effects: [set31('al', 'sleep'), until31(20, 0, true)] },
    ] }),

  X({ id: 'c31_b_late', title: 'Поздно', camp: house14, onEnter: [until31(19, 30)],
    text: [
      { text: 'После ужина ты собираешь на подоконнике то, что возьмёшь в Винзен. Немного. Тетрадь, список, носки.' },
      { when: partnerUp31, text: '{partner} сидит рядом и смотрит, как ты складываешь.' },
      { when: ninaFarm, text: 'Нина приносит свою шапку и кладёт рядом: «Возьми мою. Она теплее».' },
      { when: v('$.c31_ev', 'partner'), text: 'За ужином вы просидели рядом, плечом к плечу, почти не разговаривая. Этого хватило.' },
      { when: v('$.c31_ev', 'eat'), text: 'После ужина клонит в сон: картошка и чай до краёв сделали своё.' },
      { text: 'За окном тихо. Даже колония за насыпью сегодня молчит.' },
    ],
    actions: [
      { id: 'c31_bl3_hat', label: 'Взять шапку Нины', when: ninaFarm, minutes: 20, terminal: true, goto: 'c31_checkpoint',
        text: 'Шапка мала и пахнет Ниной. Ты надеваешь её, Нина смотрит и смеётся. Утром ты едешь в ней.', effects: [set31('bl3', 'hat'), npc('c7_nina', 2, 'c31_took_hat'), until31(20, 0)] },
      { id: 'c31_bl3_partner', label: 'Посидеть с {partner.ins}, ничего не складывая', when: partnerUp31, minutes: 20, terminal: true, goto: 'c31_checkpoint',
        text: 'Вы сидите плечом к плечу. Двое суток порознь, первые с тех пор, как вы снова вместе. Никто этого вслух не говорит.', effects: [set31('bl3', 'partner'), { body: 'stress', delta: -4 }, until31(20, 0)] },
      { id: 'c31_bl3_list', label: 'Перечитать список Зандер и дописать, что нужно дому', minutes: 20, terminal: true, goto: 'c31_checkpoint',
        text: 'Под списком пункта ты пишешь второй, мелко: йод, мазь, нитки, свечи. Если будет что менять.', effects: [set31('bl3', 'list'), set31('home_list', true), until31(20, 0)] },
    ] }),
];
