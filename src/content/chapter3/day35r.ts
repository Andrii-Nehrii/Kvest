import type { Scene } from '../../engine/content-types';
import { yard14 } from './point14';
import { S35, frost35, jest35, set35, until35, w35 } from './point35';

// Участок 35, переработка 16.11 (до уровня 17–20).
// A: Янник просит помочь слить солярку из третьего грузовика у Гарльсторфа (риск; нить 26/29/30 и отношение Янника).
// B: радио Красного Креста в пункте — весть из Аренсбурга про Мерле; на обратной дороге дети с санками и обращённый в поле (риск).
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S35({ ...scene, for: 'any', chapter: 'ch3' });

export const day35RScenes: Scene[] = [
  X({ id: 'c35_a_diesel', title: 'Третий грузовик', location: jest35, camp: { at: jest35, stock: 'c3_farm_stock', rest: false }, safe: false, ambient: frost35,
    text: [
      { text: 'Янник догоняет тебя у пожарной части. В руках у него канистры, две, пустые.' },
      { text: '— Unsere Kolonne hat zu wenig Diesel für Geesthacht. Am Garlstorfer Rastplatz steht ein LKW mit Fässern. Nach der Nacht ist da kaum noch einer. Kommst du mit? Zu zweit geht es schneller.\n\nНашей колонне не хватает солярки до Гестхахта. На стоянке у Гарльсторфа стоит грузовик с бочками. После той ночи там почти никого. Пойдёшь со мной? Вдвоём быстрее.' },
      { text: 'Минус шесть. Впадина выжжена наполовину. «Почти никого» — это не никого.' },
    ],
    actions: [
      { id: 'c35_ad4_go', label: 'Пойти с ним', minutes: 90, activity: 'heavy', risky: true, terminal: true, goto: 'c35_a_brandt', ambientDuring: frost35,
        outcomes: [
          { id: 'ok', check: { traits: ['agility', 'strength'], difficulty: 3, uses: ['mobility'] }, text: 'Вы идёте вдоль отбойника, мимо чёрных пятен кострищ. Трое вялых стоят у кювета и не поворачиваются. Третий грузовик: тент сорван, бочки на месте. Шланг, канистры, сорок литров на двоих. Обратно идёте быстро, не разговаривая. У пожарной части Янник ставит канистры и протягивает тебе руку. В первый раз.', effects: [set35('ad4', 'go'), w35('jannik_diesel', 'together'), { if: { npc: 'jannik', alive: true }, then: [{ npc: 'jannik', trust: 3 }] }] },
          { id: 'grab', text: 'У грузовика один из вялых, которого вы приняли за мёртвого, хватает Янника за штанину из-под колеса. Ты бьёшь канистрой, ещё, ещё, пока рука не разжимается. Янник сидит в снегу белый. Канистры вы наполняете всё равно. Обратно он идёт, держась за твоё плечо.', effects: [set35('ad4', 'grab'), w35('jannik_diesel', 'together'), { if: { npc: 'jannik', alive: true }, then: [{ npc: 'jannik', trust: 4 }] }, { injure: 'bruise', site: 'hands', severity: 1 }, { body: 'stress', delta: 6 }] },
        ], effects: [until35(12, 50)] },
      { id: 'c35_ad4_tell', label: 'Рассказать, где бочки и как подойти, но не идти', minutes: 20, terminal: true, goto: 'c35_a_brandt',
        text: 'Ты рисуешь ему на снегу палкой: отбойник, три грузовика, тент у третьего, подходить с леса. Янник смотрит на рисунок, потом на тебя. «Danke». Уходит один. Через два часа ты видишь его у колонны с полными канистрами.',
        effects: [set35('ad4', 'tell'), w35('jannik_diesel', 'told'), { if: { npc: 'jannik', alive: true }, then: [{ npc: 'jannik', trust: 1 }] }, until35(11, 40)] },
      { id: 'c35_ad4_no', label: 'Отказать: туда больше не ходят', minutes: 10, terminal: true, goto: 'c35_a_brandt',
        text: 'Янник кивает. Он не удивлён. «Wie damals auf der Autobahn». Как тогда на автобане. И уходит искать кого-нибудь другого.',
        effects: [set35('ad4', 'no'), w35('jannik_diesel', 'refused'), { if: { npc: 'jannik', alive: true }, then: [{ npc: 'jannik', trust: -1 }] }, until35(11, 30)] },
    ] }),

  X({ id: 'c35_b_radio', title: 'Радио', location: jest35, camp: { at: jest35, stock: 'c3_farm_stock', rest: false }, ambient: { tempC: 14, outdoor: false, wet: false },
    text: [
      { text: 'В задней комнате пункта у Зандер стоит рация Красного Креста. Раз в день, в десять, связь с Гестхахтом и дальше по цепочке. Сегодня у рации Окафор.' },
      { text: 'Он снимает наушники и протягивает тебе листок, на котором записал карандашом:\n\n«Ahrensburg, Sporthalle. Thiessen, Merle. Lebt. Insulin bis 15.12., wenn sparsam. Fragt nach Barmbek».\n\nАренсбург, спортзал. Тиссен, Мерле. Жива. Инсулин до 15.12, если экономить. Спрашивает про Бармбек.' },
      { text: '— Wir können antworten. Ein Satz. Mehr lassen sie nicht durch.\n\nМожем ответить. Одна фраза. Больше не пропускают.' },
    ],
    actions: [
      { id: 'c35_br2_come', label: 'Передать: «Держись. Мы придём»', minutes: 15, terminal: true, goto: 'c35_b_okafor2',
        text: 'Окафор повторяет в микрофон, медленно, по буквам: «Halt durch. Wir kommen». Держись. Мы придём. Потом снимает наушники и смотрит на тебя. Ты только что {m:пообещал|пообещала}. Вслух. В эфир.',
        effects: [set35('br2', 'come'), w35('merle_promised', true), until35(10, 50)] },
      { id: 'c35_br2_alive', label: 'Передать: «Мы живы. Хутор у Йестебурга»', minutes: 15, terminal: true, goto: 'c35_b_okafor2',
        text: 'Окафор передаёт. Короткое шипение в ответ. Мерле узнает, что вы живы и где. Больше ничего ты не {m:обещал|обещала}. Пока.',
        effects: [set35('br2', 'alive'), w35('merle_knows_where', true), until35(10, 45)] },
      { id: 'c35_br2_okafor', label: 'Пусть передаст Окафор: он лучше знает, что ей сказать', minutes: 15, terminal: true, goto: 'c35_b_okafor2',
        text: 'Окафор думает секунду и говорит в микрофон: «Merle, hier Okafor. Iss regelmäßig. Spar nicht am Essen, spar am Laufen». Мерле, это Окафор. Ешь регулярно. Экономь не на еде, на беготне. Ты не понимаешь, почему именно это. Он объясняет потом: сахар.',
        effects: [set35('br2', 'okafor'), { if: { npc: 'okafor', alive: true }, then: [{ npc: 'okafor', trust: 1 }] }, until35(10, 45)] },
    ] }),

  X({ id: 'c35_b_sled', title: 'Санки', camp: yard14, ambient: frost35,
    text: [
      { text: 'По дороге домой, у поля за Йестебургом, дети катаются с горки на санках: трое, лет по восемь. Визг на всё поле.' },
      { text: 'С другой стороны поля, от лесополосы, к горке идёт человек. Медленно, неровно, по колено в снегу. Дети его не видят: они смотрят вниз, на свою горку.' },
      { text: 'До горки ему метров двести. Тебе — сто.' },
    ],
    actions: [
      { id: 'c35_bsl_run', label: 'Бежать к детям и уводить их к дороге', minutes: 20, activity: 'heavy', risky: true, terminal: true, goto: 'c35_b_henrike', ambientDuring: frost35,
        outcomes: [
          { id: 'ok', check: { traits: ['agility'], difficulty: 3, uses: ['mobility'] }, text: 'Ты бежишь по снегу, крича по-немецки одно слово: «Weg! Weg!» Дети поворачиваются, видят его и бегут к дороге, бросив санки. Ты бежишь {m:последним|последней}. На дороге уже стоит кто-то из дружины с вилами. Санки остаются на горке.', effects: [set35('bsl', 'run'), w35('b_kids_saved', true)] },
          { id: 'fall', text: 'На середине поля ты проваливаешься в занесённую канаву по пояс. Кричишь оттуда. Дети слышат, видят его и бегут к дороге. Ты выбираешься, когда он уже в тридцати шагах, и бежишь, проваливаясь. На дороге дружинник с вилами пропускает тебя за спину.', effects: [set35('bsl', 'fell'), w35('b_kids_saved', true), { body: 'fatigue', delta: 8 }, { body: 'stress', delta: 6 }] },
        ], effects: [until35(13, 0)] },
      { id: 'c35_bsl_shout', label: 'Кричать с дороги изо всех сил', minutes: 15, terminal: true, goto: 'c35_b_henrike', ambientDuring: frost35,
        text: 'Ты кричишь, и Окафор рядом кричит тоже. Дети оборачиваются не сразу: ветер. Потом видят. Бегут к дороге, бросив санки. Человек доходит до горки, стоит над санками и смотрит вниз, туда, где только что был визг.',
        effects: [set35('bsl', 'shout'), w35('b_kids_saved', true), until35(12, 55)] },
      { id: 'c35_bsl_wehr', label: 'Бежать за дружинниками к пожарной части', minutes: 25, terminal: true, goto: 'c35_b_henrike', ambientDuring: frost35,
        text: 'Ты бежишь назад, к пожарной части, и машешь руками ещё издалека. Двое с вилами выбегают сразу. Когда вы возвращаетесь, дети уже на дороге: кто-то из них увидел сам. Санки остались на горке. Человек стоит над ними.',
        effects: [set35('bsl', 'wehr'), until35(13, 0)] },
    ] }),
];
