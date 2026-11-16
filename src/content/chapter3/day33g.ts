import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { house14, kitchen14, yard14 } from './point14';
import { ninaFarm, v } from './point18';
import { npc } from './point19';
import { S33, brothersCome, eldersCome, frost33, kasia33, okaforComes, oleHome33, set33, until33, w33 } from './point33';

// Участок 33, третий проход (до уровня 19–20): разговор с Окафором (или счёт ртов), Оле у окна, поздний вечер у обоих; Кася у B.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S33({ ...scene, for: 'any', chapter: 'ch3' });
const deniz: Cond = { npc: 'deniz', alive: true };

export const day33GScenes: Scene[] = [
  X({ id: 'c33_a_talk', title: 'Обед', camp: kitchen14, onEnter: [until33(12, 30)],
    text: [
      { when: okaforComes, text: 'За обедом Окафор садится рядом с тобой. Ест мало, аккуратно, как в больничной столовой. Потом говорит тихо, чтобы не слышали старики.\n\n— Десятого я уйду с колонной. Две недели, если повезёт. Фрау Кёрнер без таблеток, у Петерсена нога. Мне нужно знать, что кто-то будет на них смотреть. Не Хенрике: у неё и так всё. Вы.' },
      { when: not(okaforComes), text: 'За обедом Хенрике кладёт перед тобой тетрадь и карандаш. Брандт велел каждому двору сдать список ртов до понедельника: от этого зависит паёк. «Du schreibst. Ich zähle». Ты пишешь. Я считаю.' },
      { when: okaforComes, text: 'По-немецки он говорит медленно, вставляя английские слова там, где немецких не хватает. Руки у него в трещинах от хлорки, ногти острижены под корень.' },
      { when: v('$.c33_ae2', 'wood'), text: 'Санки дров ты {m:отвёз|отвезла} в колонию ещё до обеда. Фрау Кёрнер махала тебе из окна варежкой, пока ты не {m:скрылся|скрылась} за насыпью.' },
    ],
    actions: [
      { id: 'c33_at_promise', label: 'Пообещать: присмотрю за ними', when: okaforComes, minutes: 30, terminal: true, goto: 'c33_a_brothers',
        text: 'Окафор кивает и пишет тебе на салфетке: утром — пульс у Кёрнер, считать по часам, если больше ста — звать Зандер. Петерсену — бинт через день. Салфетку ты кладёшь в карман рубашки.', effects: [set33('at', 'promise'), w33('a_elders', 'promise'), npc('okafor', 2, 'c33_a_promised_elders'), until33(13, 0)] },
      { id: 'c33_at_honest', label: 'Сказать честно: мы, может быть, тоже уйдём', when: okaforComes, minutes: 30, terminal: true, goto: 'c33_a_brothers',
        text: 'Окафор смотрит на тебя долго. «Тогда скажите Хенрике заранее. Не в последний день». Он не обижается. Он записывает это в голову, как диагноз.', effects: [set33('at', 'honest'), w33('a_elders', 'honest'), npc('okafor', 1), until33(13, 0)] },
      { id: 'c33_at_stay', label: 'Попросить его не уходить: здесь он нужнее', when: okaforComes, minutes: 30, terminal: true, goto: 'c33_a_brothers',
        text: '— Здесь — нужнее, — повторяет он. — А там она одна. И инсулин у неё кончится десятого, плюс-минус. — Он вытирает руки салфеткой. — Я обещал её маме. Вы бы на моём месте остались?', effects: [set33('at', 'stay'), w33('a_elders', 'asked_stay'), until33(13, 0)] },
      { id: 'c33_at_all', label: 'Вписать всех, кто живёт на хуторе и рядом, честно', when: not(okaforComes), minutes: 30, terminal: true, goto: 'c33_a_brothers',
        text: 'Ты пишешь столбиком: Людеманы, вы двое, Нина, Эва, кто ещё есть, старики, братья у насыпи, если они здесь. Хенрике пересчитывает и кивает. «So. Und jetzt sieht Brandt, wie viele wir sind». Пусть Брандт видит, сколько нас.', effects: [set33('at', 'all'), w33('mouths_list', 'all'), until33(13, 0)] },
      { id: 'c33_at_less', label: 'Не вписывать тех, кто живёт не в доме', when: not(okaforComes), minutes: 30, terminal: true, goto: 'c33_a_brothers',
        text: 'Ты пишешь только тех, кто спит под этой крышей. Хенрике смотрит на список, потом на тебя. «Weniger Münder, weniger Fragen. Weniger Brot auch». Меньше ртов — меньше вопросов. И хлеба тоже меньше.', effects: [set33('at', 'less'), w33('mouths_list', 'less'), until33(13, 0)] },
    ] }),

  X({ id: 'c33_a_ole', title: 'У окна', camp: house14, onEnter: [until33(16, 30)],
    text: [
      { when: oleHome33, text: 'Оле зовёт тебя из комнаты. Он сидит на кровати и смотрит в окно, где солнце садится за лес красным, морозным. Просит помочь ему встать: хочет на крыльцо. Хенрике запретила.' },
      { when: not(oleHome33), text: 'Хенрике стоит у окна и смотрит, как садится солнце за лес. Красное, морозное. Она не оборачивается, но говорит: «Ole hat es immer geliebt. Diesen Moment». Оле всегда любил это. Этот миг.' },
      { when: oleHome33, text: 'Оле похудел так, что рубашка висит на нём, как на вешалке. Шутить он начал снова, понемногу: вчера сказал Нине, что сдал столько крови, что теперь в нём течёт один чай.' },
    ],
    actions: [
      { id: 'c33_ao_porch', label: 'Вывести его на крыльцо, укутав в тулуп', when: oleHome33, minutes: 30, terminal: true, goto: 'c33_a_thief', ambientDuring: frost33,
        text: 'Ты почти несёшь его, он почти идёт. Крыльцо, тулуп, валенки. Оле смотрит на закат, пока солнце не уходит совсем. Потом говорит: «Danke. Mama darf das nicht wissen». Маме нельзя знать. Хенрике знает. Она стоит у окна кухни и не выходит.', effects: [set33('ao', 'porch'), npc('ole', 2, 'c33_saw_sunset'), until33(17, 0)] },
      { id: 'c33_ao_window', label: 'Пододвинуть кровать к окну', when: oleHome33, minutes: 30, terminal: true, goto: 'c33_a_thief',
        text: 'Кровать тяжёлая, скрипит. Теперь он видит закат лёжа. Оле смотрит и молчит. «Auch gut», — говорит он потом. Тоже хорошо.', effects: [set33('ao', 'window'), npc('ole', 1), until33(17, 0)] },
      { id: 'c33_ao_henrike', label: 'Позвать Хенрике: пусть решает она', when: oleHome33, minutes: 20, terminal: true, goto: 'c33_a_thief',
        text: 'Хенрике приходит, смотрит на сына, на окно, на тебя. Потом сама укутывает его и выводит на крыльцо. Тебе она ничего не говорит. Но потом, на кухне, кладёт тебе в тарелку больше.', effects: [set33('ao', 'henrike'), npc('henrike', 1, 'c33_called_her'), until33(16, 50)] },
      { id: 'c33_ao_stand', label: 'Встать рядом с Хенрике у окна', when: not(oleHome33), minutes: 30, terminal: true, goto: 'c33_a_thief',
        text: 'Вы стоите вдвоём, пока не темнеет. Она берёт тебя за руку, крепко, как берут детей на переходе. Потом отпускает и зажигает лампу.', effects: [set33('ao', 'stand'), npc('henrike', 1), until33(17, 0)] },
      { id: 'c33_ao_work', label: 'Не мешать ей: пойти доделать дела во дворе', when: not(oleHome33), minutes: 30, terminal: true, goto: 'c33_a_thief', ambientDuring: frost33,
        text: 'Ты выходишь во двор. Когда оглядываешься на окно, Хенрике всё ещё там, тёмный силуэт на красном.', effects: [set33('ao', 'work'), until33(17, 0)] },
    ] }),

  X({ id: 'c33_a_late', title: 'Поздно', camp: yard14, ambient: frost33, onEnter: [until33(19, 0)],
    text: [
      { when: all(brothersCome, deniz), text: 'После совета у ворот стоит Дениз с фонарём. Он хочет проверить пустой двор у насыпи на ночь: там ставни хлопают, и братьям кажется, что кто-то ходит. Зовёт тебя с собой.' },
      { when: not(all(brothersCome, deniz)), text: 'После совета ты выходишь проверить ворота. Мороз, звёзды. У насыпи, в пустом дворе, хлопает ставня. Раз. Ещё раз. Ветра нет.' },
      { when: all(brothersCome, deniz), text: 'Фонарь у Дениза армейский, с красным стеклом, чтобы не слепить. Пар изо рта у вас обоих стоит столбом.\n\n— Ich bin nicht feige, — говорит он. — Aber Kerem schläft schon, und allein geh ich da nicht rein.\n\nЯ не трус. Но Керем уже спит, а один я туда не пойду.' },
      { when: v('$.c33_co', 'eat'), text: 'На совете ты так и не {m:сказал|сказала} ни слова. Решили без тебя, и, может, это к лучшему.' },
    ],
    actions: [
      { id: 'c33_al_go', label: 'Пойти и проверить вдвоём', minutes: 40, terminal: true, outcomes: [{ id: 'n', when: ninaFarm, goto: 'c33_a_nina' }, { id: 'k', goto: 'c33_checkpoint' }], ambientDuring: frost33,
        text: 'Во дворе у насыпи никого. Ставню держит только верхняя петля. Но в сарае следы, свежие, человеческие, и пустая банка из-под тушёнки. Кто-то ночевал здесь вчера. Вы забиваете ставню и дверь сарая.', effects: [set33('al', 'go'), w33('yard_tracks', true), npc('deniz', 1), until33(19, 40)] },
      { id: 'c33_al_shout', label: 'Крикнуть с дороги: кто там? И ждать ответа', minutes: 30, terminal: true, outcomes: [{ id: 'n', when: ninaFarm, goto: 'c33_a_nina' }, { id: 'k', goto: 'c33_checkpoint' }], ambientDuring: frost33,
        text: 'Тишина. Потом из темноты голос, мужской, хриплый: «Nur bis morgen. Ich gehe morgen». Только до утра. Утром уйду. Ты стоишь и не знаешь, что ответить. Утром в сарае у насыпи пусто.', effects: [set33('al', 'shout'), w33('yard_guest', true), until33(19, 30)] },
      { id: 'c33_al_lock', label: 'Запереть свои ворота на цепь и уйти в дом', minutes: 20, terminal: true, outcomes: [{ id: 'n', when: ninaFarm, goto: 'c33_a_nina' }, { id: 'k', goto: 'c33_checkpoint' }],
        text: 'Цепь, замок, засов на калитке. Чужой двор — чужое дело. Ставня хлопает ещё полчаса, потом перестаёт.', effects: [set33('al', 'lock'), until33(19, 20)] },
    ] }),

  X({ id: 'c33_b_kasia', title: 'Кася', camp: kitchen14, onEnter: [until33(14, 30)],
    text: [
      { when: kasia33, text: 'Кася приходит с ножницами Хенрике и садится на табурет спиной к тебе.\n\n— Остриги меня. Коротко. Как Тим. У него волосы вечно лезли в глаза, и мама его так стригла. — Она не оборачивается.' },
      { when: not(kasia33), text: 'Эва зовёт тебя к печке. У неё на коленях клубок шерсти и спицы. Она хочет научить тебя вязать пятку носка: к Рождеству на всех носков не хватит, если вяжет она одна.' },
      { when: kasia33, text: 'Волосы у неё отросли и путаются. Расчёску она не брала в руки с похорон.' },
    ],
    actions: [
      { id: 'c33_bk2_cut', label: 'Остричь, как просит', when: kasia33, minutes: 30, terminal: true, goto: 'c33_y_b_eggs',
        text: 'Ты стрижёшь медленно, прядь за прядью. Светлые волосы падают на газету. Кася смотрит в осколок зеркала и не узнаёт себя. Потом трогает затылок и говорит: «Dobrze». Хорошо. Волосы она заворачивает в газету и уносит.', effects: [set33('bk2', 'cut'), w33('kasia_hair', 'short'), npc('kasia', 2, 'c33_cut_hair'), until33(15, 0)] },
      { id: 'c33_bk2_half', label: 'Подровнять, но не коротко: потом пожалеет', when: kasia33, minutes: 30, terminal: true, goto: 'c33_y_b_eggs',
        text: 'Ты убираешь только концы. Кася смотрит в зеркало, хмурится. «Nie tak». Не так. Но больше не просит. Ножницы ты возвращаешь Хенрике.', effects: [set33('bk2', 'half'), npc('kasia', -1), until33(15, 0)] },
      { id: 'c33_bk2_talk', label: 'Сначала спросить, зачем ей это', when: kasia33, minutes: 30, terminal: true, goto: 'c33_y_b_eggs',
        text: 'Кася молчит, потом говорит: чтобы в зеркале был кто-то другой. Не та, которая держала его за плечи. Ты кладёшь ножницы. Вы сидите вдвоём, пока Хенрике не зовёт на кухню.', effects: [set33('bk2', 'talk'), npc('kasia', 1, 'c33_talked'), until33(15, 0)] },
      { id: 'c33_bk2_knit', label: 'Учиться вязать пятку у Эвы', when: not(kasia33), minutes: 30, terminal: true, goto: 'c33_y_b_eggs',
        text: 'Петля, накид, снять, провязать. У тебя выходит криво. Эва распускает и даёт снова. На третий раз пятка похожа на пятку. Эва кладёт носок к своим, в корзину для Рождества.', effects: [set33('bk2', 'knit'), npc('c8_eva', 1), until33(15, 0)] },
      { id: 'c33_bk2_no', label: 'Сказать Эве: в другой раз', when: not(kasia33), minutes: 15, terminal: true, goto: 'c33_y_b_eggs',
        text: 'Эва кивает и вяжет дальше одна, быстро, не глядя на спицы.', effects: [set33('bk2', 'no'), until33(14, 45)] },
    ] }),

  X({ id: 'c33_b_late', title: 'Поздно', camp: house14, onEnter: [until33(19, 0)],
    text: [
      { when: eldersCome, text: 'После совета фрау Кёрнер не может уснуть. Дышит часто, сидя, держится за грудь. Петерсен шепчет, что это у неё по ночам бывает.' },
      { when: all(eldersCome, okaforComes), text: 'Окафор ночует в колонии. Это недалеко, но ночью, по морозу, — далеко.' },
      { when: not(eldersCome), text: 'После совета дом засыпает. Нина ворочается на своей раскладушке, потом садится: ей снится колонна у Гарльсторфа, третью ночь подряд.' },
      { when: v('$.c33_co', 'eat'), text: 'На совете ты так и не {m:сказал|сказала} ни слова. Решили без тебя, и, может, это к лучшему.' },
      { when: all(eldersCome, flag('w.c33_feather_bed')), text: 'Фрау Кёрнер сидит на перине Хенрикиной матери, обложенная подушками. В комнате пахнет лавандой и нафталином.' },
      { when: all(eldersCome, v('$.c33_br', 'straw')), text: 'Соломенные тюфяки, набитые утром с Ниной, шуршат при каждом движении. Петерсен говорит, что так спал у бабушки в Дитмаршене, и ему нравится.' },
    ],
    actions: [
      { id: 'c33_bl2_sit', label: 'Сидеть с фрау Кёрнер, пока не отпустит', when: eldersCome, minutes: 40, terminal: true, goto: 'c33_checkpoint',
        text: 'Ты подкладываешь ей подушки повыше, открываешь форточку на щель, держишь за руку. Считаешь её дыхание по часам Хенрике. Через сорок минут оно становится реже. Она засыпает сидя. Ты остаёшься до полуночи.', effects: [set33('bl2', 'sit'), w33('korner_night', 'sat'), { body: 'fatigue', delta: 5 }, until33(20, 0)] },
      { id: 'c33_bl2_okafor', risky: true, label: 'Бежать в колонию за Окафором', when: all(eldersCome, okaforComes), minutes: 40, terminal: true, goto: 'c33_checkpoint', ambientDuring: frost33,
        
        outcomes: [
          { id: 'ok', check: { traits: ['agility'], difficulty: 3, uses: ['mobility'] }, text: 'Ты бежишь по снегу через поле. Окафор одевается молча и идёт с тобой. У постели фрау Кёрнер он делает то же, что сделала бы ты, только спокойнее. Потом говорит: «В следующий раз — не бегите. Сидите. Вы умеете». ' },
          { id: 'slip', text: 'На полпути к колонии ты поскальзываешься на дороге и падаешь на руки. Фонарь гаснет. Ты встаёшь и бежишь дальше в темноте, на огонь в окне домика. Ладони содраны. Окафор выходит с сумкой ещё до того, как ты успеваешь постучать: видел, как ты бежишь.', effects: [{ injure: 'scratch', site: 'hands', severity: 1 }, { body: 'stress', delta: 4 }] },
        ], effects: [set33('bl2', 'okafor'), w33('korner_night', 'okafor'), npc('okafor', 1), until33(20, 0)] },
      { id: 'c33_bl2_tea', label: 'Заварить ей мяту и разбудить Хенрике', when: eldersCome, minutes: 40, terminal: true, goto: 'c33_checkpoint',
        text: 'Хенрике встаёт без слов, будто ждала. Мята, тёплое одеяло на плечи, разговор вполголоса по-немецки, про сороковые годы. Фрау Кёрнер засыпает под этот разговор.', effects: [set33('bl2', 'tea'), w33('korner_night', 'henrike'), npc('henrike', 1), until33(19, 50)] },
      { id: 'c33_bl2_nina', label: 'Сесть к Нине и рассказать что-нибудь хорошее', when: all(not(eldersCome), ninaFarm), minutes: 40, terminal: true, goto: 'c33_checkpoint',
        text: 'Ты рассказываешь про море, про то, как летом в детстве {m:ловил|ловила} крабов на камнях. Нина засыпает на середине. Утром она говорит, что ей приснилось море.', effects: [set33('bl2', 'nina'), npc('c7_nina', 1, 'c33_sea_story'), until33(19, 50)] },
      { id: 'c33_bl2_sleep', label: 'Лечь {m:самому|самой}: завтра тоже день', minutes: 20, terminal: true, goto: 'c33_checkpoint',
        text: 'Ты ложишься. Засыпаешь не сразу: в доме много дыхания, чужого и своего.', effects: [set33('bl2', 'sleep'), until33(19, 30)] },
    ] }),
];
