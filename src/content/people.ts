// NPC, факты, сообщения и события мира беты. Скрытые цели — только для сценария.
import type { FactDef, MessageTemplate, NpcDef, WorldEvent } from '../engine/content-types';
import { at } from '../engine/time';

const npc = (d: Omit<NpcDef, 'initial'> & { location: string; vars?: NpcDef['initial']['vars'] }): NpcDef => ({
  id: d.id, name: d.name, intro: d.intro, hidden: d.hidden, agenda: d.agenda,
  initial: { alive: true, location: d.location, status: 'ok', trust: { A: 0, B: 0 }, memory: [], vars: d.vars ?? {} },
});

export const npcs: Record<string, NpcDef> = Object.fromEntries([
  npc({ id: 'ilse', name: 'Ильзе Брокман', location: 'a_brockmann', intro: 'Соседка снизу, 66 лет. Бывшая учительница музыки, говорит быстро, когда волнуется.',
    hidden: { goals: ['довезти мужа до врача'], fears: ['остаться одной'] }, agenda: [] }),
  npc({ id: 'gerd', name: 'Герд Брокман', location: 'a_brockmann', intro: 'Муж Ильзе, 69 лет. До пенсии — крановщик в порту, до сих пор подрабатывает там.',
    hidden: { goals: [], fears: [], secrets: ['укушен в порту 08.11 — сейчас продром, к полудню острая стадия'] },
    vars: { fever: true },
    agenda: [
      { id: 'acute', at: at(10, 11, 30), scope: 'A', effects: [{ npc: 'gerd', status: 'infected', set: { aggressive: true } }] },
    ] }),
  npc({ id: 'merle', name: 'Мерле', location: 'b_flat', intro: 'Соседка по квартире, 24 года, учится на дизайнера. Шутит, когда страшно. Диабет 1 типа.',
    hidden: { goals: ['добраться к родителям в Ahrensburg'], fears: ['остаться без инсулина'] }, agenda: [] }),
  npc({ id: 'okafor', name: 'Эммануэль Окафор', location: 'b_okafor', intro: 'Сосед по площадке, 52 года, медбрат в больнице. Спокойный, вежливый, всегда здоровается первым.',
    hidden: { goals: ['выспаться и решить, вернуться ли на смену'], fears: ['что принёс заразу домой'], secrets: ['видел, как укушенная коллега через сутки напала на врача'] },
    agenda: [] }),
  npc({ id: 'deniz', name: 'Дениз Айдын', location: 'deniz_workshop', intro: 'Хозяин маленькой автомастерской на краю Buchholz.',
    hidden: { goals: ['дождаться брата из Harburg'], fears: ['мародёры'] }, vars: { diesel_l: 40 }, agenda: [] }),
  npc({ id: 'henrike', name: 'Хенрике Людеман', location: 'hof_luedemann', intro: 'Хозяйка фермы под Jesteburg.',
    hidden: { goals: ['сохранить хозяйство и сына'], fears: ['чужие на ферме'] }, agenda: [] }),
  npc({ id: 'ole', name: 'Оле Людеман', location: 'hof_luedemann', intro: 'Сын хозяйки фермы, 27 лет.', hidden: { goals: ['защитить ферму'], fears: ['выглядеть слабым'] }, agenda: [] }),
  npc({ id: 'pawel', name: 'Павел', location: 'hof_luedemann', intro: 'Сезонный работник на ферме, 44 года.', hidden: { goals: ['вернуться домой в Польшу'], fears: [] }, agenda: [] }),
  npc({ id: 'dariusz', name: 'Дариуш Новак', location: 'b_nowak', intro: 'Сосед снизу, водитель фургона доставки.', hidden: { goals: ['увезти семью к родным в Польшу'], fears: ['за сына'] }, agenda: [] }),
  npc({ id: 'kasia', name: 'Кася Новак', location: 'b_nowak', intro: 'Жена Дариуша.', hidden: { goals: ['не бросать соседей'], fears: [] }, agenda: [] }),
].map((n) => [n.id, n]));

const F = (id: string, topic: string, text: string, truth: FactDef['truth'] = 'true'): FactDef => ({ id, topic, text, truth });

export const facts: Record<string, FactDef> = Object.fromEntries([
  F('f_alert', 'новости', 'В 03:52 пришло экстренное оповещение: «опасная обстановка» в Гамбурге и окрестностях, оставаться в помещении, «избегать контакта с …» — дальше текст оборван.'),
  F('f_sirens', 'новости', 'Ночью сирены почти не замолкали.'),
  F('f_hospital_attacks', 'новости', 'Новости: ночью нападения в нескольких больницах Гамбурга. Полиция: признаков теракта нет, «ситуация под контролем».', 'partial'),
  F('f_schools_closed', 'новости', 'Все школы Гамбурга сегодня закрыты — без объяснения причин.'),
  F('f_power_out_a', 'место', 'В твоей части Buchholz нет тока с раннего утра.'),
  F('f_ambulance', 'место', 'У соседнего дома стоит скорая с распахнутыми дверями — и никого рядом.'),
  F('f_gerd_fever', 'люди', 'У Герда Брокмана с вечера жар и путаная речь. Ильзе думает, что это грипп.'),
  F('f_gerd_wound', 'люди', 'На предплечье у Герда повязка: позавчера в порту его укусил «какой-то пьяный».'),
  F('f_merle_insulin', 'люди', 'У Мерле диабет 1 типа. Инсулина примерно на 9 дней, ручки нужно держать в холоде.'),
  F('f_okafor_night', 'люди', 'Окафор: ночью в приёмном отделении пациенты нападали на персонал — кусались. Несколько коллег ранены.'),
  F('f_barmbek_shooting', 'новости', 'Стрельба у больницы в Barmbek, полиция перекрыла квартал.'),
  F('f_rail_stopped', 'транспорт', 'Поезда между Гамбургом, Harburg и Buchholz остановлены из-за «полицейской операции».'),
  F('f_elbe_jam', 'транспорт', 'На Elbbrücken и трассах на юг — многокилометровый затор.'),
  F('f_partner_ok', 'связь', '{partner} {pm:написал|написала}: в порядке.'),
  F('f_partner_worried', 'связь', '{partner} спрашивает, где ты.'),
  F('f_partner_says_stay', 'связь', '{partner} просит тебя никуда не выходить.'),
  F('f_partner_coming', 'связь', '{partner} пишет, что едет к тебе.'),
  F('f_partner_warns', 'связь', '{partner} предупреждает: там, где {pm:он|она}, творится что-то плохое.'),
].map((f) => [f.id, f]));

export const messages: MessageTemplate[] = [
  { id: 'ok', label: 'Я в порядке', text: 'Я в порядке. Тут странно, но держусь.', learn: 'f_partner_ok' },
  { id: 'where', label: 'Где ты?', text: 'Где ты? Ответь, как сможешь.', learn: 'f_partner_worried' },
  { id: 'stay', label: 'Сиди дома', text: 'Никуда не выходи, сиди дома. Я на связи.', learn: 'f_partner_says_stay' },
  { id: 'coming', label: 'Еду к тебе', text: 'Я к тебе. Жди и не открывай чужим.', learn: 'f_partner_coming' },
  { id: 'warn', label: 'Будь осторожнее', text: 'Здесь происходит что-то плохое. Будь очень {pm:осторожен|осторожна}.', learn: 'f_partner_warns' },
];

const inBuchholzHome = { any: [{ at: 'a_flat' }, { at: 'a_stairs' }, { at: 'a_brockmann' }, { at: 'a_yard' }] };

export const events: WorldEvent[] = [
  { id: 'ev_knock', at: at(10, 6, 50), scope: 'A', when: inBuchholzHome, interrupt: true,
    effects: [{ set: '$.knock', value: true }],
    news: [{ channel: 'direct', text: 'В дверь стучат — часто, сбивчиво. Звонок без тока молчит. Женский голос: «Hallo? Sind Sie wach? Bitte…»' }] },
  { id: 'ev_schools', at: at(10, 7, 15), scope: 'world',
    news: [{ channel: 'phone', text: 'Push: «Schulbehörde — alle Hamburger Schulen bleiben heute geschlossen.»', learn: 'f_schools_closed' },
      { channel: 'radio', text: 'Радио: школы Гамбурга сегодня закрыты, причины не называют.', learn: 'f_schools_closed' }] },
  { id: 'ev_okafor_home', at: at(10, 7, 20), scope: 'B', when: { at: 'b_flat' }, interrupt: true,
    effects: [{ set: '$.okafor_knock', value: true }],
    news: [{ channel: 'direct', text: 'На площадке тяжёлые шаги, звякают ключи — долго, мимо замка. Потом глухой удар, будто кто-то привалился к двери напротив.' }] },
  { id: 'ev_barmbek_shooting', at: at(10, 9, 40), scope: 'world', effects: [{ set: 'w.barmbek_hospital', value: 'incident' }],
    news: [{ channel: 'radio', text: 'Радио: «…Schüsse vor einer Klinik in Barmbek, die Polizei hat das Gebiet weiträumig abgesperrt…»', learn: 'f_barmbek_shooting' },
      { channel: 'phone', text: 'Push: «Polizeieinsatz an Klinik in Barmbek — Anwohner sollen Fenster und Türen geschlossen halten.»', learn: 'f_barmbek_shooting' }] },
  { id: 'ev_rail_stop', at: at(10, 11, 40), scope: 'world', effects: [{ set: 'w.rail', value: 'stopped' }],
    news: [{ channel: 'radio', text: 'Радио: поезда между Гамбургом и Harburg остановлены, «полицейская операция».', learn: 'f_rail_stopped' },
      { channel: 'phone', text: 'Push DB: «Zugverkehr Hamburg–Harburg–Buchholz eingestellt.»', learn: 'f_rail_stopped' }] },
  { id: 'ev_power_back_a', at: at(10, 11, 50), scope: 'world', effects: [{ set: 'w.power.buchholz', value: 'on' }] },
  { id: 'ev_power_back_a_notice', at: at(10, 11, 50), scope: 'A', when: inBuchholzHome,
    news: [{ channel: 'direct', text: 'Где-то в квартире щёлкает, холодильник вздрагивает и начинает гудеть. Ток вернулся.' }] },
  { id: 'ev_elbe_jam', at: at(10, 12, 10), scope: 'world', effects: [{ set: 'w.elbe_jam', value: true }],
    news: [{ channel: 'radio', text: 'Радио: на Elbbrücken и на A1/A7 на юг — затор на много километров.', learn: 'f_elbe_jam' }] },
];
