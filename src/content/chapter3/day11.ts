import type { Scene } from '../../engine/content-types';
import { at } from '../../engine/time';
import type { Effect } from '../../engine/types';
import { all, flag, not } from './world3';
import { A11, S11, day11, kept11, kitchen11, ole11, once11, wound11, yard11 } from './point11';

const meal = (mode: 'eat' | 'pack') => ({ camp: { kind: 'meal' as const, mode, communal: true } });
const toPatrol: Effect = { restUntil: at(14, 9, 30) };
const toNoon: Effect = { restUntil: at(14, 10, 40) };
const next = [{ id: 'a', when: A11, goto: 'c11_a_coop' }, { id: 'b', goto: 'c11_b_henrike' }];
const indoor = { tempC: 16, outdoor: false, wet: false };
const patrolSaid = (v: string) => ({ v: '$.c11_patrol', op: '==' as const, value: v });

export const day11Scenes: Scene[] = [
  S11({ id: 'c11_breakfast', for: 'any', chapter: 'ch3', title: 'Каша', camp: kitchen11,
    text: [{ text: 'Хенрике к столу не выходит. Кашу варит Нина: молча, сосредоточенно, как будто от этого что-то зависит. Дениз режет хлеб. Керем греет руки о кружку и не поднимает глаз.\n\nИз окна виден курятник. Оттуда изредка доносится удар, и все за столом замирают.' }],
    actions: [
      { id: 'c11_bf_eat', label: 'Поесть со всеми', minutes: 15, terminal: true, outcomes: next, enabled: { camp: 'tableMeal' }, disabledReason: 'Своя порция уже использована или не выделена',
        text: 'Каша пригорела снизу. Её всё равно доедают до дна.', effects: [meal('eat')] },
      { id: 'c11_bf_pack', label: 'Взять свою порцию с собой', minutes: 3, terminal: true, outcomes: next, enabled: { camp: 'tableMeal' }, disabledReason: 'Своя порция уже использована или не выделена',
        text: 'Нина накладывает кашу в банку и молча протягивает тебе.', effects: [meal('pack')] },
      { id: 'c11_bf_hen', label: 'Отнести тарелку Хенрике к курятнику', minutes: 5, terminal: true, outcomes: next,
        text: 'Хенрике берёт тарелку и ставит рядом с собой на землю. Есть она не будет. Но тарелку не отодвигает.', effects: [{ set: '$.c11_bf', value: 'henrike' }, { npc: 'henrike', trust: 1 }] },
      { id: 'c11_bf_nina', label: 'Похвалить Нинину кашу', minutes: 1, combinable: true, when: once11('praise'),
        text: 'Нина пожимает плечами. — Папа говорил, у меня руки не оттуда. — Она почти улыбается.', effects: [{ set: '$.c11_praise', value: true }, { npc: 'c7_nina', trust: 1 }] },
    ] }),

  // Линия A: курятник, фургон, патруль, Керем.
  S11({ id: 'c11_a_coop', for: 'A', chapter: 'ch3', title: 'Караул', camp: yard11, ambient: day11,
    text: [{ text: 'Ты сменяешь Хенрике у курятника. Дениз садится рядом на перевёрнутое ведро. Хенрике уходит в дом, но через каждые десять минут выглядывает в окно.\n\nЗа дверью то тихо, то Оле бросается на неё всем телом, и щеколда звякает.' }],
    actions: [
      { id: 'c11_a_c_gap', label: 'Посмотреть в щель', minutes: 5, terminal: true, goto: 'c11_a_hinge',
        text: 'Оле лежит на соломе. Грудь ходит часто-часто. Глаза открыты и смотрят в потолок. Когда ты наклоняешься, он рывком бросается к двери. Ты отшатываешься.\n\n— Не надо, — говорит Дениз. — Я уже смотрел.', effects: [{ set: '$.c11_coop', value: 'gap' }, { body: 'stress', delta: 4 }] },
      { id: 'c11_a_c_deniz', label: 'Поговорить с Денизом', minutes: 20, activity: 'rest', terminal: true, goto: 'c11_a_hinge',
        text: '— Знаешь, что самое паршивое? — говорит Дениз. — Я ей верил. Если бы она сейчас вышла и сказала, что это порез, — я бы, может, и сейчас поверил.\n\nОн долго молчит.\n\n— Я бы на её месте тоже врал. Вот что паршиво.', effects: [{ set: '$.c11_coop', value: 'deniz' }, { npc: 'deniz', trust: 2 }] },
      { id: 'c11_a_c_quiet', label: 'Сидеть молча и считать удары', minutes: 20, activity: 'rest', terminal: true, goto: 'c11_a_hinge',
        text: 'Ты считаешь. Двадцать за первые десять минут. Двенадцать за следующие. Шесть. Дениз тоже считает: ты видишь, как шевелятся его губы.', effects: [{ set: '$.c11_coop', value: 'count' }] },
    ] }),

  S11({ id: 'c11_a_hinge', for: 'A', chapter: 'ch3', title: 'Петля', camp: yard11, ambient: day11,
    text: [{ text: 'После очередного удара Дениз поднимает голову.\n\n— Слышишь? Верхняя петля.\n\nТы слышишь. Когда Оле бьётся в дверь, верхняя петля отвечает уже не скрипом, а хрустом. Шурупы выходят из старого дерева. Ещё час таких ударов — и дверь повиснет на одной нижней.' }],
    actions: [
      { id: 'c11_ah_board', label: 'Прибить доску поперёк двери', minutes: 25, activity: 'heavy', terminal: true, goto: 'c11_a_van',
        text: 'Дениз держит доску, ты бьёшь. На третьем гвозде Оле бросается на дверь изнутри, прямо под твоими руками. Молоток соскальзывает и приходится по пальцам.\n\nДоска держится. Дверь больше не ходит.', effects: [{ set: '$.c11_hinge', value: 'board' }, { injure: 'bruise', site: 'hands', severity: 1 }, { body: 'stress', delta: 3 }] },
      { id: 'c11_ah_prop', label: 'Подпереть дверь тележкой и кольями', minutes: 20, activity: 'moderate', terminal: true, goto: 'c11_a_van',
        text: 'Вы подкатываете тележку, упираете её оглоблями в дверь и забиваете в землю два кола. Когда Оле бьётся снова, тележка вздрагивает, но стоит. Удар выходит глухим.', effects: [{ set: '$.c11_hinge', value: 'prop' }] },
      { id: 'c11_ah_screw', label: 'Подтянуть петлю, пока он затих', minutes: 15, activity: 'light', risky: true, terminal: true, goto: 'c11_a_van',
        text: 'Ты ждёшь паузы и подходишь вплотную. Отвёртка, шуруп, второй. В щели у петли — глаз. Совсем близко, в ладони от твоих пальцев. Он не моргает.\n\nТы заканчиваешь и отходишь. Руки трясутся только потом.', effects: [{ set: '$.c11_hinge', value: 'screw' }, { body: 'stress', delta: 5 }] },
    ] }),

  S11({ id: 'c11_a_van', for: 'A', chapter: 'ch3', title: 'Фургон днём', camp: yard11, ambient: day11,
    text: [
      { when: kept11, text: 'Ты обходишь фургон. Доски на окне кабины держатся, но нижняя треснула вдоль, по волокну. На ней изнутри бурые полосы.\n\nЙенс стоит за досками. В щель видно щеку, ухо, воротник рабочей куртки. Он не бьётся. Стоит и слушает двор.' },
      { when: all(kept11, flag('w.c9_three_boards')), text: 'Третья доска, которую ты прибил вчера, целая. Без неё трещина пришлась бы на всё окно.' },
      { when: not(kept11), text: 'Ты обходишь фургон. Йенс лежит в кабине, накрытый курткой Дениза. Нина просила его не трогать, пока она не решит. От кабины тянет сладким.\n\nУ колеса стоит Нинин чурбак. На нём её одеяло.' },
    ],
    actions: [
      { id: 'c11_av_board', label: 'Заменить треснувшую доску', when: kept11, minutes: 30, activity: 'moderate', risky: true, terminal: true, goto: 'c11_a_patrol',
        text: 'Ты отдираешь треснувшую доску и сразу прибиваешь новую, внахлёст. Пока окна нет, Йенс поворачивается к тебе всем лицом. Глаза мутные, как у рыбы на прилавке.\n\nНовая доска встаёт на место. Ты не сразу выпускаешь молоток.', effects: [{ set: '$.c11_van', value: 'board' }, { body: 'stress', delta: 4 }, toPatrol] },
      { id: 'c11_av_wire', label: 'Стянуть доски проволокой, не открывая', when: kept11, minutes: 25, activity: 'light', terminal: true, goto: 'c11_a_patrol',
        text: 'Ты обматываешь доски проволокой с изгороди, крест-накрест, и закручиваешь концы пассатижами. Некрасиво. Держит.', effects: [{ set: '$.c11_van', value: 'wire' }, toPatrol] },
      { id: 'c11_av_nina', label: 'Сказать Нине, чтобы не подходила к этой доске', when: kept11, minutes: 10, terminal: true, goto: 'c11_a_patrol',
        text: 'Нина слушает и кивает. Потом приносит свой чурбак и садится ровно напротив треснувшей доски. В двух шагах. Не ближе.', effects: [{ set: '$.c11_van', value: 'nina' }, toPatrol] },
      { id: 'c11_av_cold', label: 'Перенести тело в холодный сарай', when: not(kept11), minutes: 30, activity: 'heavy', terminal: true, goto: 'c11_a_patrol',
        text: 'Вдвоём с Денизом вы переносите его на брезенте. Он тяжёлый и неудобный. В сарае холодно и пахнет известью. Дениз накрывает лицо Йенса мешком и стоит над ним минуту.', effects: [{ set: '$.c11_van', value: 'cold' }, { npc: 'c7_nina', trust: -1 }, { body: 'stress', delta: 3 }, toPatrol] },
      { id: 'c11_av_wait', label: 'Ничего не трогать до Нины', when: not(kept11), minutes: 5, terminal: true, goto: 'c11_a_patrol',
        text: 'Ты плотнее прикрываешь дверцу кабины и подкладываешь под неё камень. Остальное решать Нине.', effects: [{ set: '$.c11_van', value: 'wait' }, toPatrol] },
      { id: 'c11_av_tree', label: 'Присмотреть место под яблоней', when: not(kept11), minutes: 20, activity: 'light', terminal: true, goto: 'c11_a_patrol',
        text: 'За домом старая яблоня. Ты втыкаешь лопату и проверяешь землю: на полштыка — корни, дальше пойдёт. Если Нина захочет здесь.', effects: [{ set: '$.c11_van', value: 'tree' }, toPatrol] },
    ] }),

  S11({ id: 'c11_a_patrol', for: 'A', chapter: 'ch3', title: 'Патруль', camp: yard11, ambient: day11,
    text: [{ text: 'В половине десятого у калитки останавливается армейский внедорожник. Из него выходит солдат с планшетом. Второй остаётся за рулём.\n\n— Хутор Людеманов? — Солдат сверяется с планшетом. — Пункт в Йестебурге принимает раненых и укушенных. Есть у вас такие? Укрывать запрещено.\n\nДениз смотрит на тебя. Хенрике в окне замерла.' }],
    actions: [
      { id: 'c11_p_lie', label: 'Сказать, что больных нет', minutes: 4, terminal: true, goto: 'c11_a_window',
        text: 'Солдат смотрит на курятник, на тебя. Записывает что-то.\n\n— Завтра вернёмся с врачом. Проверим всех, — говорит он и садится в машину.', effects: [{ set: '$.c11_patrol', value: 'lie' }, { npc: 'henrike', trust: 3 }] },
      { id: 'c11_p_truth', label: 'Сказать, что есть укушенный, и попросить врача', minutes: 5, terminal: true, goto: 'c11_a_window',
        text: 'Солдат отступает на шаг от калитки.\n\n— Привезите сами. Или завтра заберём. — Он медлит. — Если ещё будет кого.\n\nХенрике в окне отворачивается.', effects: [{ set: '$.c11_patrol', value: 'truth' }, { npc: 'henrike', trust: -4 }] },
      { id: 'c11_p_ask', label: 'Спросить, что с укушенными делают в пункте', minutes: 5, terminal: true, goto: 'c11_a_window',
        text: '— Изолируют. Наблюдают. — Солдат пожимает плечами. — Лечить нечем. Говорят, у кого-то жар проходит сам. Один на двадцать, может. Врачи сами не верят.\n\nОн ждёт ответа на свой вопрос. Ты молчишь. Он записывает название хутора и уезжает.', effects: [{ set: '$.c11_patrol', value: 'ask' }, { set: '$.c11_heard_one_in_twenty', value: true }] },
    ] }),

  S11({ id: 'c11_a_window', for: 'A', chapter: 'ch3', title: 'После машины', camp: yard11, ambient: day11,
    text: [{ text: 'Машина уезжает. Через минуту на крыльцо выходит Хенрике, без куртки, рукава закатаны, как утром у Дениза.\n\nОна идёт прямо к тебе. Останавливается в шаге.' }],
    actions: [
      { id: 'c11_aw_explain', label: 'Объяснить, почему ответил так', minutes: 5, terminal: true, goto: 'c11_a_kerem',
        effects: [{ set: '$.c11_window', value: 'explain' }],
        outcomes: [
          { id: 'lie', when: patrolSaid('lie'), text: '— Зачем ты за меня соврал? — спрашивает Хенрике. — Теперь ты такой же, как я.\n\nОна смотрит на курятник.\n\n— Спасибо. Не люблю это слово.' },
          { id: 'truth', when: patrolSaid('truth'), text: '— Ты правильно сказал, — говорит Хенрике ровно. — Я бы тоже сказала. Если бы не он.\n\nОна уходит в дом и закрывает за собой дверь. Тихо, без стука.' },
          { id: 'ask', text: 'Ты пересказываешь, что говорил солдат. Хенрике слушает, не перебивая.\n\n— Один на двадцать, — повторяет она. — Один на двадцать.\n\nОна садится на ступеньку крыльца, прямо на холодный камень.' },
        ] },
      { id: 'c11_aw_all', label: 'Сказать, что решать о нём будете вместе', minutes: 4, terminal: true, goto: 'c11_a_kerem',
        text: '— Вместе, — повторяет Хенрике. — Вчера я решала одна. Видишь, что вышло.\n\nОна кивает на курятник и уходит.', effects: [{ set: '$.c11_window', value: 'all' }, { npc: 'henrike', trust: 1 }] },
      { id: 'c11_aw_silent', label: 'Промолчать', minutes: 4, terminal: true, goto: 'c11_a_kerem',
        text: 'Хенрике стоит рядом, пока у неё не начинают мёрзнуть руки. Потом спрашивает:\n\n— Он смотрел на курятник?\n\n— Смотрел.\n\nОна уходит, так и не опустив рукавов.', effects: [{ set: '$.c11_window', value: 'silent' }] },
    ] }),

  S11({ id: 'c11_a_kerem', for: 'A', chapter: 'ch3', title: 'Капот', camp: yard11, ambient: day11,
    text: [{ text: 'Керем ждёт тебя у Corsa. Ведёт ладонью по пыльному капоту, оставляя чистую полосу.\n\n— Бензин есть? — спрашивает он. — Не сейчас. Завтра, послезавтра. В Буххольце у Дениза мастерская, там подвал. Отвезёшь нас? Пешком я его не уведу. Он через каждый километр назад оглядываться будет.' }],
    actions: [
      { id: 'c11_ak_yes', label: 'Пообещать отвезти, если хватит бензина', minutes: 4, terminal: true, goto: 'c11_quarrel',
        text: '— Хватит, — говорит Керем. — Тут двадцать километров.\n\nОн впервые за утро улыбается.', effects: [{ set: '$.c11_brothers', value: 'yes' }, { npc: 'kerem', trust: 2 }, toNoon] },
      { id: 'c11_ak_stay', label: 'Попросить остаться, пока всё не прояснится', minutes: 4, terminal: true, goto: 'c11_quarrel',
        text: '— Что прояснится? — Керем убирает руку с капота. — Он проснётся и снова будет орать мне про ворота? Или не проснётся. Мне оба не нравятся.', effects: [{ set: '$.c11_brothers', value: 'stay' }, toNoon] },
      { id: 'c11_ak_ask', label: 'Сказать, что сначала решишь с {B.ins}', minutes: 3, terminal: true, goto: 'c11_quarrel',
        text: '— Решай, — кивает Керем. — Вы двое хоть друг другу не врёте.', effects: [{ set: '$.c11_brothers', value: 'ask' }, toNoon] },
    ] }),

  // Линия B: Хенрике, котёл, комната Оле, окно, Нина, Керем.
  S11({ id: 'c11_b_henrike', for: 'B', chapter: 'ch3', title: 'Табурет у курятника', camp: yard11, ambient: day11,
    text: [
      { text: 'Хенрике снова сидит у курятника, на табурете из кухни. Ты садишься рядом на ящик.\n\n— Ты меня презираешь, — говорит она. Это не вопрос.' },
      { when: wound11('bite'), text: 'Укушенную руку она держит на коленях, обмотанную полотенцем.' },
      { when: wound11('scratch'), text: 'На тыльной стороне ладони у неё три красные полосы.' },
    ],
    actions: [
      { id: 'c11_b_h_honest', label: 'Сказать честно: тебе было страшно из-за её вранья', minutes: 5, terminal: true, goto: 'c11_b_wash',
        text: 'Хенрике кивает.\n\n— Мне тоже. Только я врала, а ты нет. Вот и вся разница.', effects: [{ set: '$.c11_bh', value: 'honest' }, { npc: 'henrike', trust: 1 }] },
      { id: 'c11_b_h_mother', label: 'Сказать, что понимаешь: он её сын', minutes: 5, terminal: true, goto: 'c11_b_wash',
        text: '— Понимаешь, — повторяет Хенрике. — У тебя детей нет. Не понимаешь. — Она тут же касается твоей руки. — Прости. Спасибо, что сидишь.', effects: [{ set: '$.c11_bh', value: 'mother' }, { npc: 'henrike', trust: 2 }] },
      { id: 'c11_b_h_wound', label: 'Предложить перевязать ей руку в перчатках', when: not(wound11('none')), minutes: 15, terminal: true, goto: 'c11_b_wash',
        enabled: { has: 'nitrile_gloves' }, disabledReason: 'Нужны свои перчатки',
        text: 'Ты надеваешь перчатки и перевязываешь руку заново. Хенрике смотрит, как ты работаешь.\n\n— Если это то же самое, — говорит она, — то меня туда же. К нему. Не спорь.', effects: [{ take: 'nitrile_gloves', qty: 1 }, { set: '$.c11_bh', value: 'wound' }, { npc: 'henrike', trust: 3 }] },
      { id: 'c11_b_h_quiet', label: 'Ничего не отвечать и посидеть рядом', minutes: 20, activity: 'rest', terminal: true, goto: 'c11_b_wash',
        text: 'Вы сидите молча. Удары за дверью становятся реже. Хенрике считает их шёпотом.', effects: [{ set: '$.c11_bh', value: 'quiet' }] },
    ] }),

  S11({ id: 'c11_b_wash', for: 'B', chapter: 'ch3', title: 'Котёл', camp: kitchen11, ambient: indoor,
    text: [
      { when: not(ole11('coop')), text: 'На плите стоит вчерашний котёл. Вода в нём остыла и подёрнулась плёнкой. Рядом на полу — ком: одеяло, в которое заматывали Оле, его рубашка, полотенца.' },
      { when: ole11('coop'), text: 'На плите стоит вчерашний котёл. Вода в нём остыла и подёрнулась плёнкой. Рядом на полу — ком: простыни Оле, мокрые от ночного пота, полотенца, его старая повязка.' },
      { when: { v: '$.c10_water', op: '==', value: 'carry' }, text: 'Ты сама носила эту воду вчера, ведро за ведром.' },
      { text: 'Хенрике проходит мимо и на ком не смотрит.\n\n— Для этого и грела, — говорит она. — Думала, понадобится. Понадобилось.' },
    ],
    actions: [
      { id: 'c11_bw_boil', label: 'Разогреть котёл и прокипятить всё', minutes: 40, activity: 'light', terminal: true, goto: 'c11_b_room',
        text: 'Ты растапливаешь плиту и перекладываешь вещи в котёл ручкой от швабры. Голыми руками не трогаешь. Пар пахнет хозяйственным мылом и чужим потом.\n\nХенрике заглядывает на кухню, смотрит на котёл и молча ставит рядом таз для отжима.', effects: [{ set: '$.c11_wash', value: 'boil' }, { npc: 'henrike', trust: 1 }] },
      { id: 'c11_bw_burn', label: 'Сжечь всё за сараем', minutes: 30, activity: 'light', terminal: true, goto: 'c11_b_room',
        text: 'Ты относишь ком на старое кострище за сараем и поджигаешь спичками с плиты. Шерсть горит плохо, чадит. Дениз приносит охапку сухих веток и подбрасывает в огонь. Что горит, он не спрашивает.', effects: [{ set: '$.c11_wash', value: 'burn' }] },
      { id: 'c11_bw_hands', label: 'Оставить это Хенрике и вымыть руки', minutes: 10, terminal: true, goto: 'c11_b_room',
        text: 'Ты моешь руки ледяной водой с хозяйственным мылом. Долго, до локтей. Потом ещё раз. Когда оборачиваешься, Хенрике уже сама тащит ком к котлу.', effects: [{ set: '$.c11_wash', value: 'hands' }] },
    ] }),

  S11({ id: 'c11_b_room', for: 'B', chapter: 'ch3', title: 'Комната Оле', camp: house11(), ambient: indoor,
    text: [
      { text: 'Хенрике просит снять постель в комнате сына. Сама она туда не заходит.\n\nВ комнате пахнет потом и свечой. На табурете кружка с водой, которую он так и не допил.' },
      { when: ole11('door'), text: 'На полу валяется засов с вырванным винтом.' },
      { when: ole11('sleep'), text: 'У порога на половике бурое пятно. Его уже пытались затереть.' },
      { text: 'Ты стаскиваешь простыню, и из-под подушки падает телефон. Экран загорается от удара.\n\nНа нём неотправленное сообщение. Первое слово: «Керем».' },
    ],
    actions: [
      { id: 'c11_br_read', label: 'Прочитать сообщение', minutes: 3, terminal: true, goto: 'c11_b_window',
        text: '«Керем. Прости за ворота. Ты был прав, а я орал. Если со мной что — скажи Денизу, чтобы мать не»\n\nДальше ничего. Внизу мелко: «Не отправлено».\n\nТы гасишь экран.', effects: [{ set: '$.c11_phone', value: 'read' }, toPatrol] },
      { id: 'c11_br_give', label: 'Отнести телефон Керему, не читая', minutes: 8, terminal: true, goto: 'c11_b_window',
        text: 'Керем на сеновале. Ты протягиваешь ему телефон экраном вверх. Он читает, и лицо у него становится совсем мальчишеским.\n\n— Дурак, — говорит он. — Сам скажет.\n\nТелефон он прячет во внутренний карман.', effects: [{ set: '$.c11_phone', value: 'kerem' }, { npc: 'kerem', trust: 2 }, toPatrol] },
      { id: 'c11_br_sill', label: 'Положить телефон на подоконник', minutes: 3, terminal: true, goto: 'c11_b_window',
        text: 'Ты кладёшь телефон на подоконник экраном вниз. Простыню уносишь на кухню, к котлу.', effects: [{ set: '$.c11_phone', value: 'sill' }, toPatrol] },
    ] }),

  S11({ id: 'c11_b_window', for: 'B', chapter: 'ch3', title: 'Из окна', camp: house11(), ambient: indoor,
    text: [{ text: 'В половине десятого Хенрике хватает тебя за локоть. Пальцы у неё ледяные и сильные.\n\nУ калитки стоит армейский внедорожник. Солдат с планшетом говорит с {A.ins}. Слов не слышно. Дениз стоит у курятника, руки в карманах.\n\n— Что он говорит? — шепчет Хенрике. — Что он им говорит?' }],
    actions: [
      { id: 'c11_bwin_hold', label: 'Удержать Хенрике в доме', minutes: 6, terminal: true, goto: 'c11_b_nina',
        text: 'Хенрике дёргается к двери. Ты не отпускаешь. Она сильнее тебя, но вырывается не всерьёз. Так вы и стоите, пока солдат не садится в машину.', effects: [{ set: '$.c11_bwin', value: 'hold' }, { npc: 'henrike', trust: 1 }] },
      { id: 'c11_bwin_out', label: 'Выйти во двор самой', minutes: 4, terminal: true, goto: 'c11_b_nina',
        text: 'Когда ты выходишь на крыльцо, солдат уже садится в машину. {A} смотрит ей вслед и не оборачивается. Что было сказано, ты не слышала.', effects: [{ set: '$.c11_bwin', value: 'out' }] },
      { id: 'c11_bwin_watch', label: 'Смотреть и запоминать', minutes: 6, terminal: true, goto: 'c11_b_nina',
        text: 'Солдат молодой, в очках, на рукаве нашивка с номером части. Он что-то записывает. Смотрит на курятник. Записывает ещё.\n\nХенрике рядом перестаёт дышать.', effects: [{ set: '$.c11_bwin', value: 'watch' }] },
    ] }),

  S11({ id: 'c11_b_nina', for: 'B', chapter: 'ch3', title: 'Домой', camp: yard11, ambient: day11,
    text: [
      { text: 'Нина находит тебя у колодца.\n\n— Я сегодня домой поеду, — говорит она. — Мне тут нечего делать.' },
      { when: kept11, text: '— А папа пусть стоит. Я потом. Я не могу сейчас.' },
      { when: not(kept11), text: '— Папу надо домой отвезти. В сад. Вы же обещали помочь? Кто-нибудь обещал.' },
      { text: 'Она смотрит на курятник.\n\n— В чате писали: бывает, проходит. Может, у него пройдёт?' },
    ],
    actions: [
      { id: 'c11_b_n_stay', label: 'Попросить её остаться хотя бы до завтра', minutes: 5, terminal: true, goto: 'c11_b_kerem',
        text: '— До завтра, — повторяет Нина. — Ладно. До завтра.', effects: [{ set: '$.c11_bn', value: 'stay' }, { npc: 'c7_nina', trust: 1 }] },
      { id: 'c11_b_n_drive', label: 'Пообещать уговорить остальных отвезти её завтра', minutes: 4, terminal: true, goto: 'c11_b_kerem',
        text: 'Нина кивает и впервые за утро смотрит тебе прямо в глаза.\n\n— Вы правда спросите? Не как взрослые?', effects: [{ set: '$.c11_bn', value: 'drive' }, { npc: 'c7_nina', trust: 2 }] },
      { id: 'c11_b_n_hope', label: 'Сказать, что не знаешь, проходит ли', minutes: 3, terminal: true, goto: 'c11_b_kerem',
        text: '— Никто не знает, — говорит Нина. — Все только делают вид.', effects: [{ set: '$.c11_bn', value: 'hope' }] },
    ] }),

  S11({ id: 'c11_b_kerem', for: 'B', chapter: 'ch3', title: 'Сеновал', camp: yard11, ambient: day11,
    text: [
      { text: 'Керем на сеновале укладывает рюкзак. Вещей у него мало, а укладывает он долго: вынимает, складывает, вынимает снова.\n\n— Мы с Денизом уйдём, — говорит он, не оборачиваясь. — Как только тут кончится. В любую сторону.' },
      { when: { v: '$.c11_phone', op: '==', value: 'kerem' }, text: 'Телефон Оле торчит у него из нагрудного кармана.' },
      { text: '— И вам советую. Она вам ещё соврёт. Не со зла. Ей надо, чтобы вы остались. Одна она хозяйство не вытянет. С ним — тем более.' },
    ],
    actions: [
      { id: 'c11_bk_deniz', label: 'Попросить остаться ради Дениза', minutes: 5, terminal: true, goto: 'c11_quarrel',
        text: '— Ради Дениза я и ухожу, — говорит Керем. — Он тут вчера гвозди забивал, пока… — Он замолкает. — Ладно. Он сам решит.', effects: [{ set: '$.c11_bk', value: 'deniz' }, toNoon] },
      { id: 'c11_bk_fear', label: 'Сказать, что она врала от страха', minutes: 4, terminal: true, goto: 'c11_quarrel',
        text: '— От страха, — соглашается Керем. — А в следующий раз будет от страха за хозяйство. Какая разница, от чего.', effects: [{ set: '$.c11_bk', value: 'fear' }, toNoon] },
      { id: 'c11_bk_help', label: 'Помочь ему уложить рюкзак', minutes: 12, terminal: true, goto: 'c11_quarrel',
        text: 'Ты сворачиваешь его свитер тугим валиком, потом куртку, и рюкзак сразу становится вдвое меньше. Керем смотрит и смеётся, впервые за два дня.\n\n— Дениз так не умеет.', effects: [{ set: '$.c11_bk', value: 'help' }, { npc: 'kerem', trust: 2 }, toNoon] },
    ] }),

  S11({ id: 'c11_quarrel', for: 'any', chapter: 'ch3', title: 'При всех', camp: yard11, ambient: day11,
    text: [{ text: 'Ближе к одиннадцати Керем подходит к курятнику. Хенрике поднимает на него глаза.\n\n— Вы меня заставили молчать, — говорит Керем громко, чтобы слышали все. — Я ночевал в будке с крысами. А он тут мог кого угодно…\n\n— Мог, — говорит Хенрике. — Не смог. Вы его заперли.\n\nДениз встаёт между ними, но смотрит на вас: скажите что-нибудь.' }],
    actions: [
      { id: 'c11_q_kerem', label: 'Встать на сторону Керема: он имел право знать', minutes: 4, terminal: true, goto: 'c11_noon',
        text: 'Керем кивает тебе и отходит к колодцу. Хенрике отворачивается к двери курятника.', effects: [{ set: '$.c11_q', value: 'kerem' }, { npc: 'kerem', trust: 3 }, { npc: 'henrike', trust: -2 }, { restUntil: at(14, 11) }] },
      { id: 'c11_q_henrike', label: 'Сказать Керему, что сейчас не время', minutes: 4, terminal: true, goto: 'c11_noon',
        text: '— Не время, — повторяет Керем. — У вас никогда не время. — Он уходит в сарай. Хенрике смотрит тебе вслед, но ничего не говорит.', effects: [{ set: '$.c11_q', value: 'henrike' }, { npc: 'kerem', trust: -2 }, { npc: 'henrike', trust: 2 }, { restUntil: at(14, 11) }] },
      { id: 'c11_q_both', label: 'Сказать: виноваты все, кто молчал, и мы тоже', minutes: 5, terminal: true, goto: 'c11_noon',
        text: 'Становится тихо. Керем смотрит на тебя, потом на Хенрике. Хенрике первой опускает глаза.\n\n— Ладно, — говорит Керем. — Ладно.', effects: [{ set: '$.c11_q', value: 'both' }, { npc: 'kerem', trust: 1 }, { npc: 'henrike', trust: 1 }, { restUntil: at(14, 11) }] },
    ] }),

  S11({ id: 'c11_noon', for: 'any', chapter: 'ch3', title: 'Тишина', camp: yard11, ambient: day11,
    text: [
      { text: 'К одиннадцати удары в курятнике стихают. Совсем.\n\nХенрике сидит у двери, не шевелясь. Дениз встаёт с ведра.\n\n— Тишина — это хорошо или плохо? — спрашивает Керем.\n\nНикто не знает.' },
      { when: flag('$.c11_heard_one_in_twenty'), text: 'Ты вспоминаешь солдата у калитки. «Один на двадцать, может».' },
    ],
    actions: [
      { id: 'c11_noon_go', label: 'Подойти к курятнику', minutes: 3, terminal: true, goto: 'c11_wake', effects: [{ set: '$.c11_noon', value: 'go' }, { restUntil: at(14, 11, 10) }] },
      { id: 'c11_noon_partner', label: 'Встать рядом с {partner.ins}', minutes: 3, terminal: true, goto: 'c11_wake', effects: [{ set: '$.c11_noon', value: 'partner' }, { body: 'stress', delta: -1 }, { restUntil: at(14, 11, 10) }] },
      { id: 'c11_noon_nina', label: 'Увести Нину подальше от двери', minutes: 3, terminal: true, goto: 'c11_wake', effects: [{ set: '$.c11_noon', value: 'nina' }, { npc: 'c7_nina', trust: 1 }, { restUntil: at(14, 11, 10) }] },
    ] }),
];

function house11(): NonNullable<Scene['camp']> { return { at: 'hof_luedemann', stock: 'c3_farm_stock', rest: 'brief' }; }
