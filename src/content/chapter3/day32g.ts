import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { v } from './point18';
import { npc } from './point19';
import { S32, cold32, frost32, set32, until32, w32, winsen32, ws32 } from './point32';

// Участок 32, третий проход (до уровня 19–20): письма из своего ящика или фотографии (A, ночь в мастерской), аптека на Брёмер-штрассе
// (A, четверг), мама Лены (B, утро четверга).
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S32({ ...scene, for: 'any', chapter: 'ch3' });
const trip = (at: string) => ({ at, stock: 'c3_farm_stock', rest: false as const });
const letters: Cond = flag('A.c31_home_keys');
const photos: Cond = { has: 'c32_photos' };
const ninaStays: Cond = v('w.c32_nina', 'winsen');

export const day32GScenes: Scene[] = [
  X({ id: 'c32_a_letters', title: 'При буржуйке', location: ws32, camp: trip(ws32), ambient: cold32,
    text: [
      { when: letters, text: 'Пока братья спорят о своём, ты достаёшь из кармана три письма из твоего почтового ящика. Все от десятого ноября. Одно из банка. Одно рекламное. Третье — от руки, почерк знакомый, обратного адреса нет.' },
      { when: all(not(letters), photos), text: 'Пока братья спорят о своём, ты раскладываешь на верстаке фотографии со стены своей квартиры. При свете буржуйки лица на них кажутся моложе, чем были.' },
      { when: all(not(letters), not(photos)), text: 'Пока братья спорят о своём, ты сидишь у буржуйки и смотришь на календарь с девушкой за октябрь. Дениз так и не перевернул лист. Никто не перевернул.' },
      { when: letters, text: 'Конверты помяты, один надорван. Штемпели ноябрьские, первая неделя. Писали тебе, когда всё уже начиналось, и не знали, что начинается.' },
      { when: v('$.c32_an', 'listen'), text: 'Братья спорят о своём. Ты слушаешь и не вмешиваешься. Из их спора ты понимаешь больше, чем они думают.' },
    ],
    actions: [
      { id: 'c32_al7_read', label: 'Прочитать письмо от руки', when: letters, minutes: 20, terminal: true, goto: 'c32_a_sleep',
        text: 'Старый друг, с которым вы не говорили год. Пишет, что переезжает в Киль, зовёт в гости на Рождество, оставляет номер телефона. Написано девятого. Отправлено десятого утром. Ты складываешь письмо и кладёшь во внутренний карман. Телефона больше нет. Киля, может быть, тоже.', effects: [set32('al7', 'read'), w32('kiel_letter', true), until32(32, 21, 0)] },
      { id: 'c32_al7_burn', label: 'Сжечь все три, не читая', when: letters, minutes: 10, terminal: true, goto: 'c32_a_sleep',
        text: 'Ты кладёшь письма в буржуйку. Бумага вспыхивает сразу. Керем смотрит на тебя и ничего не спрашивает. Ты и {m:сам|сама} не знаешь, зачем.', effects: [set32('al7', 'burn'), npc('kerem', 1), until32(32, 20, 50)] },
      { id: 'c32_al7_show', label: 'Показать фотографии братьям', when: all(not(letters), photos), minutes: 20, terminal: true, goto: 'c32_a_sleep',
        text: 'Керем берёт одну, долго смотрит, смеётся над твоей стрижкой. Дениз показывает в ответ фото из бумажника: мать в Анкаре, сестра, мастерская в день открытия. Вы сидите при буржуйке и показываете друг другу людей, которых, может быть, больше нет.', effects: [set32('al7', 'show'), npc('deniz', 1, 'c32_photos'), npc('kerem', 1), until32(32, 21, 0)] },
      { id: 'c32_al7_page', label: 'Перевернуть лист календаря на декабрь', when: all(not(letters), not(photos)), minutes: 10, terminal: true, goto: 'c32_a_sleep',
        text: 'Ты встаёшь и переворачиваешь. Декабрь: девушка в шапке Санта-Клауса. Дениз смотрит на календарь, потом на тебя, и хохочет так, что кашляет. «Richtig. Es ist Dezember». Точно. Декабрь.', effects: [set32('al7', 'page'), npc('deniz', 2, 'c32_calendar'), until32(32, 20, 50)] },
      { id: 'c32_al7_sleep', label: 'Лечь сразу: завтра рано', minutes: 10, terminal: true, goto: 'c32_a_sleep',
        text: 'Ты ложишься на мешки у стены, ближе к буржуйке. Голоса братьев становятся гулом, потом пропадают.', effects: [set32('al7', 'sleep'), until32(32, 20, 40)] },
    ] }),

  X({ id: 'c32_a_pharmacy', title: 'Аптека', location: 'a_street', camp: trip('a_street'), safe: false, ambient: frost32,
    text: [
      { text: 'Аптека на Брёмер-штрассе. Витрина цела, дверь заперта, решётка опущена. Внутри видны полки: пустые сверху, полные внизу. Видимо, грабители искали не то.' },
      { text: 'Дениз глушит мотор и ждёт. Решётку можно поддеть ломом. Это пять минут и много шума.' },
    ],
    actions: [
      { id: 'c32_aph_break', label: 'Поддеть решётку и войти', minutes: 30, activity: 'moderate', risky: true, terminal: true,
        outcomes: [
          { id: 'ok', check: { traits: ['strength'], difficulty: 3 }, goto: 'c32_a_point', text: 'Решётка уходит вверх со скрежетом на всю улицу. Внутри: перевязочные пакеты, мазь от ожогов, две коробки парацетамола, детский сироп, свечи в коробке. Ты сгребаешь всё в сумку. На улице никого. Пока.', effects: [set32('aph', 'break'), w32('pharmacy', 'taken'), { give: 'c32_pharm_bag' }, until32(33, 13, 0)] },
          { id: 'noise', goto: 'c32_a_point', text: 'Решётка не поддаётся сразу. Ты бьёшь ломом, звон на всю улицу. Когда она наконец уходит вверх, из переулка уже идут двое, медленно, на звук. Ты успеваешь схватить только коробку свечей и пакет бинтов. Дениз газует, не дожидаясь, пока ты закроешь дверь.', effects: [set32('aph', 'break'), w32('pharmacy', 'part'), { give: 'c32_candles' }, { body: 'stress', delta: 6 }, until32(33, 13, 0)] },
        ] },
      { id: 'c32_aph_window', label: 'Не ломать: посмотреть через витрину и запомнить, что там', minutes: 15, terminal: true, goto: 'c32_a_point',
        text: 'Ты прижимаешься к стеклу. Внизу коробки с бинтами, мазь, сироп. Ты записываешь в тетрадь: аптека на Брёмер-штрассе, полки внизу полные. Для Зандер. Для следующего раза.', effects: [set32('aph', 'window'), w32('pharmacy', 'noted'), until32(33, 12, 45)] },
      { id: 'c32_aph_go', label: 'Сказать Денизу: едем дальше', minutes: 5, terminal: true, goto: 'c32_a_point',
        text: 'Дениз кивает. Фургон трогается. Аптека остаётся позади с полными нижними полками.', effects: [set32('aph', 'go'), until32(33, 12, 40)] },
    ] }),

  X({ id: 'c32_b_lena_mom', title: 'Мама Лены', location: winsen32, camp: trip(winsen32), ambient: { tempC: 14, outdoor: false, wet: false },
    text: [
      { when: ninaStays, text: 'Утром к радиорубке подходит женщина в пальто поверх домашнего халата. Мама Лены. Она хочет поговорить о Нине: девочка остаётся у них до Рождества, а у них самих четыре рта и паёк на троих.' },
      { when: not(ninaStays), text: 'Утром к радиорубке подходит женщина в пальто поверх домашнего халата. Мама Лены. Она держит свёрток: свитер, который Лена связала для Нины, не успела отдать вчера.' },
      { when: v('$.c32_br2', 'farm'), text: 'Сообщение про хутор ушло в эфир. Радист обещал повторять его каждое утро, пока не ответят.' },
    ],
    actions: [
      { id: 'c32_blm_food', label: 'Пообещать: с каждой оказией будем передавать продукты', when: ninaStays, minutes: 30, terminal: true, goto: 'c32_b_thu',
        text: 'Женщина кивает, устало и с облегчением. Вы договариваетесь: мешок картошки и яйца, когда пойдёт грузовик. Она записывает адрес хутора на ладони, ручкой.', effects: [set32('blm', 'food'), w32('nina_support', 'promised'), until32(33, 8, 0)] },
      { id: 'c32_blm_money', label: 'Отдать ей свои деньги: вдруг ещё где-то берут', when: ninaStays, minutes: 20, terminal: true, goto: 'c32_b_thu',
        text: 'Ты отдаёшь всё, что есть в кошельке. Женщина смотрит на купюры с сомнением: в Винзене за них уже ничего не дают. Но берёт. «Vielleicht. Vielleicht wieder». Может быть. Может быть, снова начнут.', effects: [set32('blm', 'money'), w32('nina_support', 'money'), until32(33, 7, 50)] },
      { id: 'c32_blm_back', label: 'Сказать честно: тогда, может, Нине лучше вернуться', when: ninaStays, minutes: 30, terminal: true, goto: 'c32_b_thu',
        text: 'Женщина качает головой. «Nein. Lena braucht sie. Mehr als Brot». Нет. Она нужна Лене. Больше, чем хлеб. Нина остаётся. Но теперь ты знаешь, чего это стоит.', effects: [set32('blm', 'back'), w32('nina_support', 'none'), until32(33, 8, 0)] },
      { id: 'c32_blm_sweater', label: 'Взять свитер для Нины', when: not(ninaStays), minutes: 20, terminal: true, goto: 'c32_b_thu',
        text: 'Свитер синий, с кривым оленем на груди. Нина наденет его сразу, ещё в кузове, и не снимет до вечера.', effects: [set32('blm', 'sweater'), w32('nina_sweater', true), npc('c7_nina', 1), until32(33, 7, 50)] },
      { id: 'c32_blm_eggs', label: 'Отдать ей в ответ всё, что осталось из еды', when: not(ninaStays), minutes: 20, terminal: true, goto: 'c32_b_thu',
        text: 'Хлеб, сало, два яйца. Женщина отказывается, потом берёт. Свитер она всё равно отдаёт.', effects: [set32('blm', 'eggs'), w32('nina_sweater', true), until32(33, 7, 50)] },
    ] }),
];
