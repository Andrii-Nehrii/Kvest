import type { ActionDef, Scene, TextBlock } from '../../engine/content-types';
import type { Effect } from '../../engine/types';
import { all, flag, not } from './world3';

const C6 = all({ cp: 5 }, not({ cp: 6 }));
const waterSteps = new Set(['c6_r_a_work', 'c6_r_a_return', 'c6_r_b_water_p', 'c6_r_b_company', 'c6_r_b_water_h', 'c6_r_b_terms']);
const sleepPlaces = new Set(['c6_start', 'c6_r_kitchen', 'c6_r_evening', 'c6_l_a_inside', 'c6_l_b_inside', 'c6_camp_supper']);
const kitchenPlaces = new Set(['c6_start', 'c6_r_kitchen', 'c6_r_a_account', 'c6_r_a_after_pay', 'c6_r_pawel', 'c6_r_host', 'c6_r_b_after', 'c6_r_evening', 'c6_r_night',
  'c6_l_b_name', 'c6_l_b_call', 'c6_l_b_consent', 'c6_l_b_food', 'c6_l_b_pawel', 'c6_l_b_message', 'c6_l_b_mother', 'c6_l_b_watch', 'c6_l_a_inside', 'c6_l_b_inside', 'c6_camp_supper']);
const urgent = new Set(['c6_l_a_forget', 'c6_l_a_door', 'c6_l_a_barrier', 'c6_l_a_road', 'c6_l_a_noise', 'c6_l_a_price',
  'c6_l_b_window', 'c6_l_b_gate', 'c6_l_return', 'c6_l_b_dark', 'c6_l_b_van', 'c6_l_b_price', 'c6_l_last']);

const afterSupper: TextBlock[] = [{ text: 'Вы возвращаетесь к разговору о ночи. Оле всё ещё стоит у окна. Павел кладёт свёрток на пол между ног и наконец развязывает куртку: достаёт телефон, проверяет экран, убирает обратно.\n\nЙенс дважды стучит по кабине. Хенрике приоткрывает окно и говорит, что слышит. Он спрашивает, утро ли уже. Она отвечает, что вечер.\n\n— Тогда почему едете? — спрашивает Йенс.\n\nВы никуда не едете. Оле оборачивается к дороге и выключает свет в коридоре, чтобы не мешал смотреть.\n\nПо обочине к фургону идут двое. Один придерживается за плечо другого, но тот не помогает ему: тащит руку за собой. Лица в свете кухонного окна видны плохо. Они останавливаются, когда Йенс снова стучит, и поворачиваются к машине.\n\n— Люди? — спрашивает Павел.\n\nХенрике зовёт из окна. Ни один не отвечает. Тот, кто шёл сзади, подходит к фургону и проводит ладонью по стеклу. Второй встаёт рядом. Йенс садится и пытается рассмотреть их через лобовое.\n\nПро этих двоих ничего не известно, но подходить к ним как к обычным прохожим нельзя. Они пришли на звук. И теперь между ними и больным Йенсом только двери его машины.' }];

// Новые варианты получают новые id. Старые остаются дословно для журналов, записанных до исправления.
function careVersion(a: ActionDef, replacement: Partial<ActionDef>): ActionDef[] {
  return [{ ...a, replayOnly: true }, { ...a, id: `${a.id}_care`, ...replacement }];
}

export function withFarmCare(scene: Scene): Scene {
  if (scene.checkpoint !== undefined || !(/^c6_[rl]_/.test(scene.id) || ['c6_start', 'c6_camp_supper'].includes(scene.id))) return scene;
  const alarm = urgent.has(scene.id);
  const camp: NonNullable<Scene['camp']> = {
    at: 'hof_luedemann', stock: 'c3_farm_stock', kitchen: !alarm && kitchenPlaces.has(scene.id), rest: alarm ? false : sleepPlaces.has(scene.id) ? 'sleep' : 'brief',
    ...(!alarm ? { car: 'opel_corsa' } : {}),
    ...(['c6_start', 'c6_r_kitchen', 'c6_r_ole', 'c6_r_evening'].includes(scene.id) ? { well: true } : {}),
  };
  const actions = scene.actions.flatMap((a): ActionDef[] => {
    if (scene.id === 'c6_camp_supper' && a.id !== 'c6_camp_supper_skip') return careVersion(a, {
      enabled: { camp: 'tableMeal' }, disabledReason: 'Своя порция уже использована или не выделена', effects: a.effects?.map(e => 'camp' in e && e.camp.kind === 'meal' ? { camp: { ...e.camp, communal: true } } : e),
    });
    if (a.id === 'c6_rev_begin') return careVersion(a, {
      effects: [{ camp: { kind: 'prepare' } }],
      text: 'Хенрике разрешает отложить доступную долю крупы и топлива на свою еду. Ты проверяешь, что осталось, прежде чем что-то брать.',
    });
    if (waterSteps.has(a.id)) return careVersion(a, {
      effects: [...(a.effects ?? []), { camp: { kind: 'deliverWater', liters: 10 } }],
      ...(/_work$|_water_[ph]$/.test(a.id) ? { ambientDuring: { tempC: 9, outdoor: true } } : {}),
    });
    if (a.id === 'c6_r_rest') return careVersion(a, {
      text: 'Вы устраиваетесь рядом и некоторое время сидите, касаясь плечами. Потом Хенрике зовёт вас по именам.',
      outcomes: [{ id: 'water', when: { camp: 'water' }, text: 'Ты наливаешь пол-литра из доступной воды. Запас уменьшается.' },
        { id: 'dry', text: 'Доступной воды не осталось. Отдых согревает, но жажду не утоляет.' }],
      effects: [{ camp: { kind: 'prepare' } }, { camp: { kind: 'drink', liters: 0.5 } }, { body: 'stress', delta: -5 }],
    });
    if (a.id === 'c6_l_b_own_food') return careVersion(a, {
      when: C6, enabled: { camp: 'portion' }, disabledReason: 'Своя отложенная порция уже съедена или отдана',
      effects: [{ camp: { kind: 'meal', mode: 'give' } }, { set: '$.c6_l_food', value: 'own' }],
    });
    if (a.id === 'c6_l_b_extra_food') return careVersion(a, {
      when: C6, enabled: { camp: 'cook' }, disabledReason: 'Нужны свои 250 г крупы, 0,5 л воды и возможность готовить',
      text: 'Ты предлагаешь сварить добавку из своей выделенной крупы. Хенрике разрешает воспользоваться печью. Ты сама отмеряешь 250 г, добавляешь воду и остаёшься у кастрюли.\n\nКогда еду выносят, ты говоришь Йенсу, что кружку сегодня обратно не ждут. Своя отложенная порция у тебя осталась, но крупы и воды стало меньше.',
      effects: [{ camp: { kind: 'cook', mode: 'give' } }, { set: '$.c6_l_food', value: 'stock' }],
    });
    if (a.id === 'c6_l_b_water_only') return careVersion(a, {
      effects: [], text: undefined,
      outcomes: [{ id: 'host', when: { camp: 'hostMeal' }, text: 'Ты говоришь Хенрике, что свою порцию не отдашь. Йенсу отвечаешь, что пока у него будет вода. Не говоришь, будто горячее ему запретил врач.\n\nХенрике откладывает половину своей порции. Ты не останавливаешь её. Твоя еда осталась тебе, но хозяйке сегодня достанется меньше.',
        effects: [{ camp: { kind: 'meal', mode: 'host' } }, { set: '$.c6_l_food', value: 'host' }, { npc: 'henrike', remember: 'c6_l_fed_driver_from_own_plate' }] },
      { id: 'none', text: 'Ты не отдаёшь свою еду. У Хенрике свободной порции тоже не осталось. Йенсу пока достаётся только вода; вы не говорите ему, будто еду запретил врач.', effects: [{ set: '$.c6_l_food', value: 'none' }] }],
    });
    if (['c6_l_a_inside', 'c6_l_b_inside'].includes(scene.id) && a.goto === 'c6_l_return')
      return careVersion(a, { goto: 'c6_camp_supper' });
    return [a];
  });
  const onEnter: Effect[] = [...(scene.onEnter ?? [])];
  if (scene.id === 'c6_l_b_call') onEnter.push({ if: flag('B.camp5.ready'), then: [
    { if: { phoneUsable: true }, then: [{ set: 'B.c6_camp_own_call', value: true }, { charge: 'phone', delta: -1 }],
      else: [{ set: 'B.c6_camp_own_call', value: false }, { log: 'Свой телефон разряжен или недоступен. Для попытки вызова {B} просит телефон у Хенрике.' }] },
  ] });
  let text = scene.text;
  if (scene.id === 'c6_l_return') text = [
    ...scene.text.map(t => ({ ...t, when: all(t.when ?? { always: true }, not(flag('$.camp5.ready'))) })),
    ...afterSupper.map(t => ({ ...t, when: flag('$.camp5.ready') })),
  ];
  if (scene.id === 'c6_l_b_call') text = [
    ...scene.text.map(t => ({ ...t, when: all(t.when ?? { always: true }, not(flag('B.camp5.ready'))) })),
    { when: all(flag('B.camp5.ready'), flag('B.c6_camp_own_call')), text: 'Ты начинаешь вызов помощи со своего телефона. Поиск сети расходует заряд, но до разговора с диспетчером не доходит. Хенрике предлагает попробовать её телефон. Результат тот же.' },
    { when: all(flag('B.camp5.ready'), not(flag('B.c6_camp_own_call'))), text: 'Свой телефон разряжен или недоступен. Ты просишь Хенрике дать её аппарат для вызова помощи. Она набирает номер при тебе и передаёт телефон. До разговора с диспетчером не доходит.' },
    { when: flag('B.camp5.ready'), text: '— Скажите, я сам доеду до дороги, если они туда приедут, — просит Йенс.\n\nТы отвечаешь, что сначала нужно получить ответ. Он снова спрашивает, когда будет машина. Хенрике просит тебя прямо объяснить: помощь пока никто не подтвердил.\n\nМожно сделать ещё одну попытку с её телефона, записать сведения для следующего звонка или остаться разговаривать с Йенсом. Ты видишь {partner.acc} за оградой. Ему тоже нужно сказать, удалось ли связаться с кем-нибудь.' },
  ];
  return { ...scene, text, universal: true, camp, actions, ...(onEnter.length ? { onEnter } : {}) };
}

export const farm6CareScenes: Scene[] = [{
  id: 'c6_camp_supper', for: 'any', chapter: 'ch3', title: 'Своя порция', location: 'hof_luedemann',
  safe: true, ambient: { tempC: 16, wet: false, outdoor: false },
  text: [
    { when: { camp: 'tableMeal' }, text: 'Хенрике ставит на стол горячую еду и зовёт вас ужинать.\n\n— Здесь поешь или с собой возьмёшь? — спрашивает она.\n\n{partner} садится рядом. Можно поесть сейчас, сохранить готовую еду или оставить её общему столу.' },
    { when: not({ camp: 'tableMeal' }), text: 'Хенрике зовёт всех к столу. Свободной порции для тебя нет: свою ты уже {m:использовал|использовала} или {m:распорядился|распорядилась} ею раньше.\n\n{partner} садится рядом. Можно остаться за столом и поесть своё, если еда ещё осталась.' },
  ],
  actions: [
    { id: 'c6_camp_supper_eat', label: 'Поужинать со всеми', when: C6, enabled: { camp: 'meal' }, disabledReason: 'Нет доступной порции или воды', minutes: 10, terminal: true, goto: 'c6_l_return',
      text: 'Ты ешь за общим столом. Закончив, отставляешь пустую тарелку.', effects: [{ camp: { kind: 'meal', mode: 'eat' } }] },
    { id: 'c6_camp_supper_pack', label: 'Взять готовую порцию с собой и поесть позже', when: C6, enabled: { camp: 'meal' }, disabledReason: 'Эта порция уже использована или не выделена', minutes: 3, terminal: true, goto: 'c6_l_return',
      text: 'Ты упаковываешь готовую еду. Она остаётся при тебе; сытнее от этого пока не стало.', effects: [{ camp: { kind: 'meal', mode: 'pack' } }] },
    { id: 'c6_camp_supper_return', label: 'Оставить свою порцию общему столу', when: C6, enabled: { camp: 'meal' }, disabledReason: 'Нет порции, которую можно передать', minutes: 3, terminal: true, goto: 'c6_l_return',
      text: 'Ты говоришь Хенрике, что свою порцию сегодня оставляешь дому. Она убирает её отдельно. Своей еды от этого у тебя не прибавилось.', effects: [{ camp: { kind: 'meal', mode: 'return' } }] },
    { id: 'c6_camp_supper_skip', label: 'Пока не есть и остаться рядом с партнёром', when: C6, minutes: 3, activity: 'rest', terminal: true, goto: 'c6_l_return',
      text: 'Ты пока не берёшь еду. Вы садитесь рядом, пока остальные заканчивают свои дела. Это передышка, а не ужин.', effects: [{ body: 'stress', delta: -1 }] },
  ],
}];
