import type { Scene } from '../../engine/content-types';
import { S32, set32, until32, winsen32 } from './point32';

// Участок 32, третий круг (16.11): ещё две сцены линии B в Винзене.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S32({ ...scene, for: 'any', chapter: 'ch3' });
const trip = (at: string) => ({ at, stock: 'c3_farm_stock', rest: false as const });
const hall = { tempC: 14, outdoor: false, wet: false };

export const day32YScenes: Scene[] = [
  X({ id: 'c32_y_b_photos', title: 'Выпускной класс', location: winsen32, camp: trip(winsen32), ambient: hall,
    text: [
      { text: 'Фрау Витхён достаёт из шкафа альбом в бархатной обложке. Фотографии классов, год за годом: её муж в центре, всегда в одном и том же пиджаке, дети вокруг всё время разные.' },
      { text: 'На последней странице выпускной класс прошлого года. Она показывает пальцем на мальчика с краю, высокого, в очках.' },
      { text: '— Mein Enkel. Bei der Bundeswehr, seit Oktober. Er heißt Jonas Withöhn. Vielleicht hören Sie etwas, im Funk.\n\nМой внук. В бундесвере, с октября. Его зовут Йонас Витхён. Может, услышите что-нибудь, по рации.' },
    ],
    actions: [
      { id: 'c32_yp_write', label: 'Записать имя и обещать спросить радиста утром', minutes: 30, terminal: true, goto: 'c32_b_sleep',
        text: 'Ты пишешь в тетрадь: «Jonas Withöhn, Bundeswehr, seit Okt.». Фрау Витхён смотрит, как ты пишешь, и кивает на каждую букву. Потом закрывает альбом и долго держит на нём ладонь.',
        effects: [set32('yp', 'write'), until32(32, 20, 0)] },
      { id: 'c32_yp_look', label: 'Смотреть с ней все фотографии, класс за классом', minutes: 40, terminal: true, goto: 'c32_b_sleep',
        text: 'Восемьдесят первый год, девяносто четвёртый, две тысячи девятый. Она помнит каждого: этот стал пекарем, эта уехала в Канаду, этот разбился на мотоцикле. Ты слушаешь, пока не начинают слипаться глаза. Ей это было нужнее, чем тебе сон.',
        effects: [set32('yp', 'look'), { body: 'stress', delta: -2 }, until32(32, 20, 30)] },
      { id: 'c32_yp_honest', label: 'Сказать честно: по рации имён солдат не передают', minutes: 20, terminal: true, goto: 'c32_b_sleep',
        text: 'Фрау Витхён кивает, будто знала. «Ich weiß. Aber man fragt trotzdem». Знаю. Но всё равно спрашиваешь. Она убирает альбом и наливает тебе чаю из термоса, последний, тёплый.',
        effects: [set32('yp', 'honest'), until32(32, 20, 0)] },
    ] }),

  X({ id: 'c32_y_b_kitchen', title: 'Школьная кухня', location: winsen32, camp: trip(winsen32), ambient: hall,
    text: [
      { text: 'До грузовика три часа. На школьной кухне повариха в синем фартуке разрывается между котлом и очередью. Двести человек на обед, три помощницы, одна из них заболела.' },
      { text: '— Sie da! Können Sie Kartoffeln schälen? Oder Flaschen machen? Die Babys schreien seit sechs.\n\nВы! Чистить картошку умеете? Или бутылочки делать? Младенцы орут с шести утра.' },
    ],
    actions: [
      { id: 'c32_yk_peel', label: 'Встать к картошке', minutes: 60, terminal: true, goto: 'c32_b_back',
        text: 'Нож тупой, картошка мелкая, ведро бездонное. Женщины вокруг говорят, не переставая: в Гестхахте лагерь на десять тысяч, десятого придут колонны, в Люнебурге закрыли больницу. Половина — слухи. Ты запоминаешь всё, что можно проверить.',
        effects: [set32('yk', 'peel'), { body: 'fatigue', delta: 3 }, until32(33, 10, 30)] },
      { id: 'c32_yk_bottles', label: 'Делать бутылочки для младенцев', minutes: 60, terminal: true, goto: 'c32_b_back',
        text: 'Сухая смесь, кипяток, остудить на снегу за дверью, проверить на запястье. Двенадцать бутылочек. Матери забирают их у двери с таким лицом, как будто ты им что-то {m:спас|спасла}. Может, и {m:спас|спасла}.',
        effects: [set32('yk', 'bottles'), until32(33, 10, 30)] },
      { id: 'c32_yk_rest', label: 'Извиниться и посидеть перед дорогой', minutes: 30, terminal: true, goto: 'c32_b_back',
        text: 'Повариха машет рукой и кричит кому-то ещё. Ты садишься в коридоре на подоконник и смотришь на школьный двор, где дети катают снежную бабу из грязного снега. Голова у бабы получается больше туловища.',
        effects: [set32('yk', 'rest'), { body: 'fatigue', delta: -3 }, until32(33, 10, 30)] },
    ] }),
];
