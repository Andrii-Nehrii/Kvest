// Участок 5: ночь и утро на хуторе. Общие последствия решает одна линия.
import type { ActionDef, Scene, WorldEvent } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { at } from '../../engine/time';
import { once, cpAction } from './common';
import { all, not, flag, keeper, npcHere } from './world3';

const S = (s: Scene) => s;
const AM = all({ after: at(12, 6) }, { before: at(12, 13) });
const NIGHT: Cond = { before: at(12, 6) };
const C5 = all({ cp: 4 }, not({ cp: 5 }));
const henrikeHere = npcHere('henrike', 'hof_luedemann');
const pawelHere = npcHere('pawel', 'hof_luedemann');
const oleHere = npcHere('ole', 'hof_luedemann');
const keremHere = npcHere('kerem', 'hof_luedemann');
const denizHere = npcHere('deniz', 'hof_luedemann');
const house = { outdoor: false, wet: false, tempC: 18 };
const notDone = (id: string) => not(flag(`$.${id}`));
const result = (id: string, value: string): Cond => ({ v: `$.${id}.result`, op: '==', value });
const spilled = all(C5, { after: at(12, 7, 25) }, { before: at(12, 13) }, pawelHere, oleHere, henrikeHere, notDone('c5_spilled.done'));
const bread = all(C5, { after: at(12, 9, 5) }, { before: at(12, 13) }, oleHere, henrikeHere, keremHere, denizHere, notDone('c5_bread.done'));
const toSpilled: ActionDef = { id: 'c5_spilled_approach', label: 'К Павлу, у колодца', minutes: 1, terminal: true, goto: 'c5_spilled', when: spilled };
const toBread: ActionDef = { id: 'c5_bread_approach', label: 'Войти в спор на кухне', minutes: 1, terminal: true, goto: 'c5_bread', when: bread };
const back: ActionDef = { id: 'c5_back', label: 'Вернуться в дом', minutes: 2, terminal: true, goto: 'c5_farm' };
const wait: ActionDef = { id: 'c5_wait', label: 'Переждать час', minutes: 60, activity: 'rest', repeatable: true, combinable: true };

export const farm5Scenes: Scene[] = [
  S({ id: 'c5_farm', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Кухня хутора', safe: true, ambient: house,
    text: [
      { when: all(NIGHT, henrikeHere), text: 'Хенрике прикрывает заслонку печи. — До шести не топчитесь. Вода в ведре. — Она уносит лампу; свет ещё несколько секунд виден под её дверью.' },
      { when: all(AM, henrikeHere, { before: at(12, 7, 25) }), text: 'Хенрике режет хлеб над своей тарелкой, собирая крошки большим пальцем. — Ешь. Потом к Павлу. — За окном он поднимает ведро обеими руками.' },
      { when: all(AM, henrikeHere, { after: at(12, 7, 25) }), text: 'Хенрике сидит у печи в пальто. Перед ней остывает кофе. — Дверь закрой. Всю улицу греть не стану. — Она ждёт, пока щёлкнет замок.' },
      { when: { after: at(12, 13) }, text: 'К полудню в кухне тесно от принесённых вещей. На твоём стуле лежит куртка. Телефон под ней вибрирует, и этот звук кажется тебе жужжанием мухи.' },
      { when: all(result('c5_spilled', 'dress'), pawelHere), text: 'Павел держит перевязанную руку над коленом. — Жене скажу: об железку. Она сразу спросит, где перчатки. — Он улыбается и смотрит, не проступила ли кровь.' },
      { when: all(result('c5_spilled', 'carry'), pawelHere), text: 'У двери стоят принесённые тобой вёдра. Павел сидит рядом. — Одно утро побуду начальником. — Тряпка на его ладони потемнела.' },
      { when: all(result('c5_spilled', 'chain'), pawelHere), text: 'Павел держит кружку левой рукой. Правая спрятана под столом. Когда он встаёт, на скатерти остаётся красный край ладони.' },
      { when: all(result('c5_bread', 'own'), keremHere), text: 'Керем возвращает пустую упаковку от твоих хлебцев. — Забыл выкинуть. — Он мог оставить её у печи. Вместо этого принёс тебе.' },
      { when: all(result('c5_bread', 'explain'), oleHere), text: 'Оле приносит свой стул из кухни в сени. В проёме он поворачивает его боком и задевает косяк. На тебя не смотрит.' },
      { when: all(result('c5_bread', 'rule'), keremHere), text: 'Керем забирает сумку из-под лавки. — Чтоб потом не искать. — На вопрос Дениза он не отвечает.' },
      { when: all(flag('$.c5_exchange_sack'), henrikeHere), text: 'Хенрике ногой отодвигает приготовленный тобой мешок от печи. — Пять кило. Не даром. — Узел она проверяет сама.' },
      { when: flag('$.c5_chain_failed'), text: 'Оле снимает цепь с ворота. Тебе показывает другую руку: — Эту береги. — Вёдра он ставит у бочки за сараем.' },
      { when: flag('$.c5_water_spilled'), text: 'Павел вытирает воду у порога. Ты говоришь, что сделаешь сам{m:|а}. Он не поднимает головы. — Сядь уже.' },
      { when: result('c5_letter', 'promise'), text: 'Павел смотрит, достаёшь ли ты телефон. Ты показываешь ему сохранённый текст. — Только когда сеть будет, — повторяет он. Торопит всё равно.' },
      { when: result('c5_letter', 'honest'), text: 'Павел перечитывает запись о своей руке. До слова «порез» не дотрагивается, будто от пальца оно сотрётся.' },
      { when: result('c5_letter', 'refuse'), text: 'Павел убирает телефон, когда ты садишься. Через минуту достаёт снова, отвернув экран от тебя.' },
      { when: all(flag('proj.c3_pump.done'), pawelHere), text: 'Павел слышит насос через закрытое окно. — Это ты сделал{m:|а}? — Он ставит кружку и впервые за утро откидывается на спинку.' },
      { when: not(henrikeHere), text: 'На месте хозяйки перевёрнута кружка. Ты отодвигаешь её, чтобы сесть. Нож лежит под ней, лезвием к тебе.' },
    ],
    actions: [
      { id: 'c5_sleep', label: 'Лечь у печи до рассвета', minutes: 0, repeatable: true, when: NIGHT, effects: [{ set: '$.c5_lay_down', value: true }, { sleep: 360 }], text: 'Ты ложишься в одежде. За стенкой кто-то кашляет и долго наливает воду. Когда ведро перестаёт звенеть, слышно дыхание спящих.' },
      { id: 'c5_partner', label: 'Побыть рядом с {partner.ins}', minutes: 25, combinable: true, when: all(flag('w.together'), { partnerAt: 'hof_luedemann' }, notDone('c5_partner')),
        outcomes: [
          { id: 'lying', when: all(NIGHT, flag('$.c5_lay_down')), text: '— Ты спишь? — спрашивает {partner}. Ты качаешь головой, хотя в темноте этого не видно. {pm:Он|Она} находит твою руку под одеялом; пальцы холодные.', effects: once('c5_partner', [{ body: 'stress', delta: -10 }]) },
          { id: 'sitting', text: 'Вы садитесь у печи, касаясь коленями. — Подвинься, — говорит {partner}, хотя места хватает. Ты двигаешься. Некоторое время вы смотрите, как свет проходит через щель заслонки.', effects: once('c5_partner', [{ body: 'stress', delta: -10 }]) },
        ] },
      { id: 'c5_breakfast', label: 'Сесть завтракать с Хенрике', minutes: 25, combinable: true, when: all(AM, henrikeHere, notDone('c5_breakfast')),
        enabled: { stocked: 'oats', qty: 0.25, at: 'c3_farm_stock' }, disabledReason: 'На стол уже нечего положить',
        text: 'Хенрике ставит перед тобой овсянку. — Порцию бери целиком. — Сама ест стоя. Ты подвигаешь ей стул; она ставит на него кастрюлю.',
        effects: once('c5_breakfast', [{ unstock: 'oats', qty: 0.25, at: 'c3_farm_stock' }, { take: 'oats', qty: 0.25 }, { body: 'hunger', delta: -25 }]) },
      toSpilled, toBread,
      { id: 'c5_pawel', label: 'Посидеть с Павлом', minutes: 2, terminal: true, goto: 'c5_pawel_rest', when: all(AM, pawelHere, notDone('c5_pawel'), { any: [{ before: at(12, 7, 25) }, flag('$.c5_spilled.done')] }) },
      { id: 'c5_kerem_after', label: 'Выйти за Керемом', minutes: 15, combinable: true, when: all(AM, keremHere, flag('$.c5_bread.done'), notDone('c5_kerem_after')),
        outcomes: [
          { id: 'rule', when: result('c5_bread', 'rule'), text: '— Ты тоже думаешь, я вор? — Керем затягивает лямку сумки. Пока ты подбираешь слова, он проходит мимо. Сумка бьёт тебя по колену.', effects: once('c5_kerem_after', [{ body: 'stress', delta: 5 }]) },
          { id: 'other', text: 'Керем сидит на ступеньке. — Дениз говорит: потерпи. Он всегда так говорит. — Подвинувшись, Керем освобождает тебе половину доски. — Ты бы остал{m:ся|ась}?', effects: once('c5_kerem_after', [{ npc: 'kerem', trust: 2 }]) },
        ] },
      { id: 'c5_cellar', label: 'Помочь Хенрике в погребе', minutes: 2, terminal: true, goto: 'c5_cellar', when: all(AM, henrikeHere) },
      { id: 'c5_well', label: 'К Павлу и насосу', minutes: 2, terminal: true, goto: 'c5_well', when: AM },
      { id: 'c5_gate', label: 'Выйти к Оле', minutes: 2, terminal: true, goto: 'c5_gate', when: all(AM, oleHere) },
      { id: 'c5_meeting', label: 'Обсудить с Хенрике вторую смену', minutes: 20, combinable: true, when: all(AM, { after: at(12, 10, 30) }, henrikeHere, notDone('c5_meeting')),
        text: '— Павел до вечера с ведром не вытянет. Или вы меняетесь, или добываете шланг, — говорит Хенрике. Она показывает на мешок у лестницы. — Соседу пять кило. Мне — человека на кухню. Решайте между собой.',
        effects: once('c5_meeting', [{ learn: 'f_c3_exchange' }, { learn: 'f_c3_well' }]) },
      wait, cpAction(5),
    ],
  }),
  S({ id: 'c5_pawel_rest', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'На лавке у печи', safe: true, ambient: house,
    text: [
      { when: all(notDone('c5_pawel_photo'), notDone('c5_pawel_draft')), text: 'Павел подвигает телефон. На фотографии женщина отвернулась от камеры. — Злилась, что снимаю. Другой нет. — Он увеличивает лицо. Оно распадается на квадраты. — Запишешь ей пару слов, если твой телефон поймает?' },
      { when: all(flag('$.c5_pawel_photo'), notDone('c5_pawel_draft')), text: 'Павел держит открытой переписку. Последнее сообщение от него — вчерашнее. Он читает его снова, хотя там всего три слова.' },
      { when: flag('$.c5_pawel_draft'), text: 'В черновике написано: «Со мной всё хорошо». Павел просит прочесть вслух. Ты читаешь. — Нормально, — говорит он слишком быстро.' },
    ],
    actions: [
      { id: 'c5_pawel_photo', label: 'Спросить, когда она отвечала', minutes: 8, combinable: true, when: notDone('c5_pawel_photo'), text: '— Вчера утром. Потом я работал. Потом она, наверное, спала. — Павел проверяет часы. Ты говоришь, что сейчас утро и там. Он закрывает фотографию. — Я знаю.', effects: once('c5_pawel_photo') },
      { id: 'c5_pawel_draft', label: 'Помочь написать, где он', minutes: 10, combinable: true, when: notDone('c5_pawel_draft'), text: 'Павел диктует название деревни по буквам. После каждой смотрит тебе в лицо. — Про руку не надо. — Ты спрашиваешь, что тогда писать. — Работа есть. Еда есть. — Про себя он ничего не добавляет.', effects: once('c5_pawel_draft') },
      { id: 'c5_pawel_why', label: 'Спросить, зачем скрывать рану', minutes: 8, combinable: true, when: all(flag('$.c5_spilled.done'), notDone('c5_pawel_why')), text: '— Она скажет: возвращайся. — Павел убирает руку под мышку. — А я не знаю, как. — У двери кашляет Хенрике. Он выпрямляется, словно она позвала работать.', effects: once('c5_pawel_why') },
      { id: 'c5_letter_promise', label: 'Сохранить его слова до появления связи', minutes: 6, terminal: true, goto: 'c5_farm', text: 'Павел диктует: «Я на хуторе. Со мной всё хорошо». Ты сохраняешь текст и номер. Павел сверяет цифры. — Не обещай, что дойдёт. — Ты обещаешь только попробовать. Он просит ещё раз показать номер.', effects: [...once('c5_pawel'), { set: '$.c5_letter.result', value: 'promise' }, { body: 'stress', delta: 3 }] },
      { id: 'c5_letter_honest', label: 'Предложить сказать о руке честно', minutes: 12, terminal: true, goto: 'c5_farm', when: flag('$.c5_spilled.done'), text: '— Пусть знает, — говоришь ты. Павел долго смотрит на строчку. Потом добавляет сам: «Порезал руку. Здесь помогают». Показывает тебе. Ты киваешь. Отправка остаётся ждать связи.', effects: [...once('c5_pawel'), { set: '$.c5_letter.result', value: 'honest' }, { npc: 'pawel', trust: 4 }] },
      { id: 'c5_letter_refuse', label: 'Не брать на себя чужое сообщение', minutes: 3, terminal: true, goto: 'c5_farm', text: 'Ты говоришь, что сам{m:|а} не знаешь, когда будет сеть. — Я тоже. — Павел забирает телефон. На лавке между вами остаётся место, куда он положил его сначала.', effects: [...once('c5_pawel'), { set: '$.c5_letter.result', value: 'refuse' }, { npc: 'pawel', trust: -2 }] },
    ],
  }),
  S({ id: 'c5_cellar', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Погреб', ambient: { outdoor: false, wet: false, tempC: 8 },
    text: [
      { when: henrikeHere, text: 'Хенрике спускается боком, держась за стену. — Лампу выше. — На нижней ступеньке она останавливается перевести дыхание. Тебе делает знак идти перв{m:ым|ой}.' },
      { when: not(henrikeHere), text: 'На нижней ступеньке стоит мешок. Обойти его можно только боком. Ты цепляешься за стену; известка осыпается за ворот.' },
      { when: flag('$.c5_sort'), text: 'У лестницы стоит ведро для кухни. Хенрике велела отнести его наверх. На дне — яблоко, которое она положила отдельно для Павла.' },
    ],
    actions: [
      { id: 'c5_sort', label: 'Час помогать Хенрике с обедом', minutes: 50, combinable: true, when: all(AM, henrikeHere, notDone('c5_sort')),
        text: 'Хенрике чистит картошку быстрее тебя. — Научишься, — говорит она, не глядя. Ты спрашиваешь, сколько людей она кормила прежде. Нож останавливается. — Меньше. — Вторую миску она ставит между вами.',
        effects: once('c5_sort', [{ npc: 'henrike', trust: 4 }, { body: 'fatigue', delta: 3 }]) },
      { id: 'c5_exchange_sack', label: 'Взять пять килограммов для соседа', minutes: 15, combinable: true, when: all(AM, keeper(), henrikeHere, notDone('c5_exchange_sack'), notDone('c5_trade')),
        enabled: { stocked: 'potatoes', qty: 5, at: 'c3_farm_stock' }, disabledReason: 'Пяти килограммов в общем запасе нет',
        text: '— В долг он не даёт, — говорит Хенрике. Весы качаются, ты придерживаешь мешок. Она убирает твою руку. — Дай перевесить. Мне с ним ещё жить.',
        effects: once('c5_exchange_sack', [{ unstock: 'potatoes', qty: 5, at: 'c3_farm_stock' }]) },
      back, toSpilled, toBread, wait, cpAction(5),
    ],
  }),
  S({ id: 'c5_well', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'У колодца', ambient: { outdoor: true },
    text: [
      { when: all(pawelHere, { before: at(12, 7, 25) }), text: 'Павел наваливается на рычаг насоса. Вода бьёт из трещины ему на сапог. — Вот так поливаем, — говорит он. Смеётся один.' },
      { when: all(pawelHere, spilled), text: 'Павел сидит у ворота, прижимая ладонь к животу. — Оле, ну пусти. — Оле молча показывает на руку.' },
      { when: all(pawelHere, flag('$.c5_spilled.done')), text: 'Павел переступает с ноги на ногу у бочки. Когда ты подходишь, он прячет руку за спину. — Ещё одну ходку. Потом сяду.' },
      { when: not(pawelHere), text: 'На вороте висит чужая куртка. Ты зовёшь Павла. Из дома никто не отвечает.' },
      { when: flag('w.c3_chain_safe'), text: 'Оле привязал верёвку к балке. Перед тем как опустить ведро, ты проверяешь узел. Он выдерживает.' },
    ],
    actions: [
      { id: 'c5_pump_look', label: 'Разобраться с Денизом, что сломано', minutes: 20, combinable: true, when: all(AM, denizHere, notDone('c5_pump_look')),
        text: 'Дениз держит шланг, пока ты качаешь. Струя попадает ему в рукав. — Диагностика закончена. Счёт пришлю. — Он обводит конец на картонке и отдаёт тебе. — Этот размер. Не похожий.',
        effects: once('c5_pump_look', [{ learn: 'f_c3_well' }, { set: '$.c3_hose_size', value: true }]) },
      { id: 'c5_water', label: 'Донести воду вместо Павла', minutes: 30, combinable: true, risky: true, when: all(AM, pawelHere, notDone('c5_water')),
        outcomes: [
          { id: 'steady', check: { traits: ['agility'], difficulty: 3, uses: ['mobility'] }, text: 'У порога Павел хватается за ведро. — Тут скользко. — Ты отстраняешь его локтем и переступаешь через мокрый брус. Вода выплёскивается ему на сапоги. Он извиняется перед тобой.', effects: once('c5_water', [{ body: 'fatigue', delta: 5 }, { npc: 'pawel', trust: 3 }]) },
          { id: 'slip', text: 'Нога уходит с порога. Ты садишься на пятку, всё ещё держа ведро. Павел пытается поднять тебя больной рукой. — Пусти, — говоришь ты. Он выпускает ручку. Вода течёт под дверь.', effects: once('c5_water', [{ injure: 'sprain', site: 'leftLeg', severity: 1 }, { body: 'stress', delta: 8 }, { set: '$.c5_water_spilled', value: true }]) },
        ] },
      { id: 'c5_water_together', label: 'Позвать Дениза помочь с водой', minutes: 45, combinable: true, when: all(AM, pawelHere, denizHere, notDone('c5_water')),
        text: 'Дениз бросает куртку на бочку. — По одному ведру. И не геройствуй. — У порога он идёт первым. Павлу оставляет дверь: — Командуй отсюда. — Павел держит её ногой, будто это тоже работа.', effects: once('c5_water', [{ body: 'fatigue', delta: 3 }, { npc: 'pawel', trust: 3 }]) },
      { id: 'c5_pump', label: 'Час менять шланг насоса', minutes: 0, repeatable: true, combinable: true, when: all(AM, not(flag('proj.c3_pump.done')), { any: [{ has: 'c3_hose' }, flag('proj.c3_pump.started')] }),
        text: 'Ты тянешь старую резину со штуцера. За спиной ждут с пустым ведром. — Сейчас, — говоришь ты. Резина рвётся, оставляя на металле ещё одно кольцо.', effects: [{ work: 'c3_pump', hours: 1 }] },
      back, toSpilled, toBread, wait, cpAction(5),
    ],
  }),
  S({ id: 'c5_gate', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'У калитки', ambient: { outdoor: true },
    text: [
      { when: oleHere, text: 'Оле стоит со стороны петель, за столбом. Ты становишься рядом, и он сдвигает тебя локтем. — Не в проёме. — На дороге никого нет.' },
      { when: not(oleHere), text: 'Калитка заперта изнутри. Ты касаешься задвижки, и жестянка на проволоке звенит так громко, что хочется её поймать.' },
      { when: flag('proj.c3_fence.done'), text: 'Поперечина входит в скобы до конца. Оле дёргает калитку с другой стороны. — Годится. — Лишь теперь он выпускает собаку.' },
    ],
    actions: [
      { id: 'c5_ole_talk', label: 'Спросить Оле о соседе', minutes: 15, combinable: true, when: all(AM, oleHere, notDone('c5_ole_talk')),
        text: '— Шланг у него есть. Совесть — нет. — Оле показывает на крышу за деревьями. — Километр. По полю. — Ты спрашиваешь, почему не по дороге. Он кладёт ладонь на задвижку. — По полю.',
        effects: once('c5_ole_talk', [{ learn: 'f_c3_exchange' }, { npc: 'ole', trust: 2 }]) },
      { id: 'c5_fence', label: 'Час помогать Оле с поперечиной', minutes: 0, repeatable: true, combinable: true, when: all(AM, oleHere, not(flag('proj.c3_fence.done'))),
        text: 'Оле держит брус, пока ты снимаешь стружку. Ты спрашиваешь, почему он не идёт в дом. — Вижу лучше. — Он смотрит поверх твоего плеча, на поворот дороги.', effects: [{ work: 'c3_fence', hours: 1 }] },
      { id: 'c5_neighbor', label: 'Идти к соседу по полю', minutes: 18, terminal: true, goto: 'c5_neighbor', when: all(AM, { after: at(12, 8) }, keeper(), { knows: 'f_c3_exchange' }), effects: [{ move: 'c3_neighbor' }] },
      back, toSpilled, toBread, wait, cpAction(5),
    ],
  }),
  S({ id: 'c5_spilled', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Упавшее ведро', universal: false, ambient: { outdoor: true },
    text: [
      { when: notDone('c5_spilled.asked'), text: 'Павел прижимает ладонь к животу. Из-под пальцев капает в грязь. Оле загораживает ему дорогу к дому. — Покажи.' },
      { when: notDone('c5_spilled.asked'), text: '— Железом. Вот же, — говорит Павел. У ворота болтается разогнутое звено. Оле не отходит, и Павел медленно вытягивает руку.' },
      { when: flag('$.c5_spilled.asked'), text: 'Оле стоит у сарая, пропустив Павла к дому. Павел всё ещё держит ладонь открытой. — Ну вот. Я же говорил. — Кровь сбегает к запястью.' },
      { when: notDone('c5_spilled.asked'), text: 'Хенрике держит дверь локтем. — Решайте. У меня вода на дне. — Павел смотрит на открытую дверь, не на рану.' },
    ],
    onEnter: [{ set: '$.c5_spilled.started', value: true }],
    actions: [
      { id: 'c5_spilled_ask', label: 'Спросить Павла, что случилось', minutes: 3, combinable: true, when: notDone('c5_spilled.asked'),
        text: '— Ведро пошло вниз. Я за цепь. — Павел повторяет движение здоровой рукой. Оле смотрит на звено, потом отступает. Павел выдыхает так, будто только сейчас смог.', effects: once('c5_spilled.asked') },
      { id: 'c5_spilled_dress', label: 'Отдать Павлу свою перевязку', minutes: 12, terminal: true, goto: 'c5_farm', enabled: { hasTag: 'dressing' }, disabledReason: 'При тебе нет перевязки',
        text: 'Павел вздрагивает, когда ты промываешь порез. — Это последняя? — спрашивает он про упаковку. Ты затягиваешь узел. Пустую обёртку он берёт у тебя сам.',
        effects: [...once('c5_spilled.done'), { set: '$.c5_spilled.result', value: 'dress' }, { use: 'dressing' }, { if: keeper(), then: [{ npc: 'pawel', trust: 8, set: { c3_hand_treated: true } }] }] },
      { id: 'c5_spilled_carry', label: 'Взять работу Павла на себя', minutes: 55, terminal: true, goto: 'c5_farm',
        text: 'Ты приносишь первое ведро из бочки за сараем. Павел идёт следом с пустым, пока Хенрике не усаживает его на ступеньку. — Сиди. — На третьем круге ты сам{m:|а} хочешь сесть.',
        effects: [...once('c5_spilled.done'), { set: '$.c5_spilled.result', value: 'carry' }, { body: 'fatigue', delta: 7 }, { if: keeper(), then: [{ npc: 'pawel', remember: 'c3_carried_water', set: { c3_hand_rest: true } }] }] },
      { id: 'c5_spilled_chain', label: 'Вернуть воду, оставить рану Павлу', minutes: 20, terminal: true, goto: 'c5_farm', risky: true,
        effects: [...once('c5_spilled.done'), { set: '$.c5_spilled.result', value: 'chain' }],
        outcomes: [
          { id: 'held', check: { traits: ['technical'], difficulty: 3, uses: ['focus'] }, text: 'Ты упираешь рукоять в стойку и разгружаешь цепь. Хенрике подаёт верёвку. Позади Павел рвёт подкладку куртки для повязки. Оле принимает ведро. — Теперь руки убери. — Ты разжимаешь пальцы по одному.', effects: [{ body: 'fatigue', delta: 4 }, { if: keeper(), then: [{ set: 'w.c3_chain_safe', value: true }] }] },
          { id: 'struck', text: 'Рукоять вырывается из ладони. Удар приходится по костяшкам, ведро падает в воду. Оле прижимает тебя плечом к стойке. — Отойди. — Теперь Павел и ты стоите рядом, пряча руки.', effects: [{ injure: 'bruise', site: 'hands', severity: 2 }, { set: '$.c5_chain_failed', value: true }, { body: 'stress', delta: 10 }] },
        ] },
    ],
  }),
  S({ id: 'c5_bread', for: 'any', chapter: 'ch3', location: 'hof_luedemann', title: 'Чужая порция', universal: false, ambient: house,
    text: [
      { text: 'Оле захлопывает хлебницу перед Керемом. Тот отдёргивает пальцы. В другой руке у него кусок хлеба. — Положи.' },
      { text: '— Я Павлу. — Керем кивает на сарай, но Оле не поворачивается. Дениз стоит у двери, не решаясь войти. Хенрике молча берёт нож.' },
      { when: flag('$.c5_bread.asked'), text: 'На тарелке у двери лежит ещё ломоть, которого Керем не заметил. Теперь его видят все. Керем всё равно не кладёт свой.' },
    ],
    onEnter: [{ set: '$.c5_bread.started', value: true }],
    actions: [
      { id: 'c5_bread_ask', label: 'Дать Керему договорить', minutes: 8, combinable: true, when: notDone('c5_bread.asked'),
        text: '— Он с утра не ел. Никто ему не отнёс. — Хенрике показывает ножом на тарелку у двери. — А это кому? — Дениз трёт лицо ладонями. — Семейный завтрак. Как дома.', effects: once('c5_bread.asked') },
      { id: 'c5_bread_own', label: 'Отдать Павлу свои хлебцы', minutes: 12, terminal: true, goto: 'c5_farm', enabled: { has: 'crackers' }, disabledReason: 'У тебя нет хлебцев',
        text: 'Ты кладёшь свою пачку перед Керемом. — Ему отнеси. — Он разжимает пальцы; кусок остаётся на столе. Оле отодвигает хлебницу, чтобы ты мог{m:|ла} сесть.',
        effects: [...once('c5_bread.done'), { set: '$.c5_bread.result', value: 'own' }, { take: 'crackers' }, { npc: 'kerem', trust: 6, remember: 'c3_shared_bread' }, { if: keeper(), then: [{ set: 'w.c5_bread.result', value: 'own' }] }] },
      { id: 'c5_bread_explain', label: 'Заступиться за Керема перед Оле', minutes: 12, terminal: true, goto: 'c5_farm',
        text: 'Ты говоришь, что он нёс еду Павлу. — Слышал, — отвечает Оле. — Взял не своё. — Он выпускает хлебницу. Из кухни выходит боком, не задев тебя плечом.',
        effects: [...once('c5_bread.done'), { set: '$.c5_bread.result', value: 'explain' }, { npc: 'kerem', trust: 5 }, { npc: 'ole', trust: -5 }, { body: 'stress', delta: 3 }, { if: keeper(), then: [{ set: 'w.c3_bread_defended', value: true }, { set: 'w.c5_bread.result', value: 'explain' }] }] },
      { id: 'c5_bread_rule', label: 'Попросить Керема вернуть хлеб', minutes: 12, terminal: true, goto: 'c5_farm',
        text: 'Керем кладёт кусок на стол с твоей стороны. Хенрике режет ещё два, тонких, и передаёт Денизу. Тот протягивает один брату. Керем уже в дверях.',
        effects: [...once('c5_bread.done'), { set: '$.c5_bread.result', value: 'rule' }, { npc: 'henrike', trust: 4 }, { npc: 'kerem', trust: -4 }, { if: keeper(), then: [{ set: 'w.c3_bread_split', value: true }, { set: 'w.c5_bread.result', value: 'rule' }] }] },
    ],
  }),
];

export const farm5Events: WorldEvent[] = [
  { id: 'ev_c5_spilled', at: at(12, 7, 25), scope: 'world', interrupt: true,
    when: all(spilled, { at: 'hof_luedemann' }, notDone('c5_spilled.started')), effects: [],
    news: [{ channel: 'direct', text: 'У колодца гремит ведро. Павел вскрикивает. Оле бежит к нему от калитки; собака бросается следом.' }] },
  { id: 'ev_c5_bread', at: at(12, 9, 5), scope: 'world', interrupt: true,
    when: all(bread, { at: 'hof_luedemann' }, notDone('c5_bread.started')), effects: [],
    news: [{ channel: 'direct', text: 'С кухни слышно: «Положи». Потом стук крышки. Дениз зовёт брата. Керем не отвечает.' }] },
];
