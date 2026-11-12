import type { JointDecision, MergeNote } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag } from './world3';
import { any, v } from './point18';
import { P20 } from './point19';

export const finished20: Cond = all(P20, flag('A.c20_finished'), flag('B.c20_finished'));
const N = (id: string, when: Cond, text: string): MergeNote => ({ id, when: all(finished20, when), text });
const lue: Cond = { at: 'c18_lueneburg' };

// Сверка в пятницу в половине четвёртого. Видят оба.
export const point20Notes: MergeNote[] = [
  N('c20_convoy', { always: true }, 'Транспорт из Ганновера с десяти сорока стоит на съезде с автобана у Гарльсторфа. Люди на дороге, один грузовик перевернулся. С четверти первого связи нет.'),
  N('c20_p', flag('w.c20_p_known'), '{A} видел в зале списков: напротив всех шестидесяти одной фамилии из Station 4 карандашом стоит «P». Писарь сказал: плазма, все они были в исследовании.'),
  N('c20_ahlers_p', flag('w.c20_ahlers_p'), 'Доктор Алерс не стала отрицать: исследование шло в Бухгольце, пока не пропал ток. «Что было дальше, вы видели в списке».'),
  N('c20_gerd', flag('w.c20_gerd_written'), 'Напротив «Brockmann, Gerd» на стене в Люнебурге теперь написано рукой {A.gen}: «10.11, лестница. Болен».'),
  N('c20_siphon_gave', v('w.c20_siphon', 'gave'), '{A} отлил из Corsa два литра бензина незнакомому отцу: тому надо было довезти жену с ребёнком до Биненбюттеля.'),
  N('c20_siphon_ring', v('w.c20_siphon', 'ring'), '{A} отлил литр бензина незнакомцу за обручальное кольцо. Кольцо у него в кармане.'),
  N('c20_siphon_stop', v('w.c20_siphon', 'stopped'), 'У Corsa под казармой кто-то пытался слить бензин. {A} успел.'),
  N('c20_b_blood', flag('w.c20_b_blood'), '{B} снова сдала пол-литра крови. Сегодня у Оле не взяли.'),
  N('c20_phone', flag('w.c20_phone_back'), 'Телефон {B.gen} снова у неё: комендант отдал его в пятницу, как обещали.'),
  N('c20_lea', flag('w.c20_lea_name'), 'Замену для Оле зовут Лея Хартман, ей двадцать четыре. Сама она не вызывалась.'),
  N('c20_cargo', flag('w.c20_cargo_known'), 'В транспорте три грузовика и две машины сопровождения: плазма, инсулин, солярка, пайки. И она.'),
  N('c20_nights', flag('w.c20_peters_night'), 'Фрау Петерс говорит: ночью из донорского блока выносят. Двоих на этой неделе.'),
  N('c20_hours', flag('w.c20_kids_hours'), 'Сестра детской палаты: если транспорт не придёт, у девочки у окна, может быть, сутки. У маленьких меньше.'),
  N('c20_promise_lea', flag('w.c20_promise_lea'), '{A} пообещал Оле: если поедете мимо Гарльсторфа, посмотрите, что с ней.'),
  N('c20_barrel', flag('w.c20_left_barrel'), 'У отцовского ружья заедает левый ствол.'),
  N('c20_henrike_waits', flag('w.c20_henrike_waits'), 'Хенрике останется в Люнебурге, пока не приедет замена. «Потом приеду. С ним или без».'),
  N('c20_wagons', flag('w.c20_two_wagons'), 'К Гарльсторфу в четыре уходят две армейские машины. Гражданским велено оставаться. Кто поедет, тот на свой страх и риск.'),
  N('c20_list_all', v('w.c20_list', 'all'), 'В список вписаны все, кто живёт в доме.'),
  N('c20_list_lie', v('w.c20_list', 'lie2'), 'Солдату с планшетом второй раз сказали, что гости уезжают. Он что-то дописал в планшет мелко.'),
  N('c20_stretcher', flag('w.c20_stretcher'), 'В сенях стоят носилки: две жерди и мешки из-под картошки.'),
  N('c20_volker_stays', flag('w.c20_volker_stays'), 'Фолькер остаётся до понедельника.'),
  N('c20_volker_truth', flag('w.c20_volker_truth'), 'Фолькер сказал {A.dat} правду: у жены был жар, и он запер её снаружи и ушёл. Потом ушёл и от вас.'),
  N('c20_volker_gone', all(flag('w.c20_volker_gone'), { not: flag('w.c20_volker_truth') }), 'Фолькер ушёл в сторону Тоштедта.'),
  N('c20_barn', flag('w.c20_barn_checked'), 'В длинном сарае одно кольцо шаталось. {A} перебил его в крепкую балку.'),
  N('c20_letter', flag('w.c20_letter_sent'), 'Письмо в Люнебург ушло с фургоном прачечной.'),
  N('c20_road', flag('w.c20_road_warned'), 'Шофёр фургона сказал: под Гарльсторфом со вчерашнего дня пробка и на дороге «ходят». Он ездит через Винзен.'),
  N('c20_refuse', flag('w.c20_refuse_list'), 'Тех, кто откажется ехать в Люнебург, Брандт не заставит. Их просто больше не будет в списке на пайки.'),
  N('c20_brandt_cars', flag('w.c20_brandt_cars'), 'Брандту вечером нужны все машины. «Я не собираюсь возить детей на лошадях».'),
  N('c20_jacket', flag('w.c20_jacket_sewn'), 'Рукав куртки {A.gen} зашит в два слоя.'),
  N('c20_jacket_tape', flag('w.c20_jacket_taped'), 'Рукав куртки {A.gen} заклеен скотчем.'),
  N('c20_kit', flag('w.c20_kit_ready'), 'Нина собрала аптечку и подписала каждую упаковку.'),
  N('c20_gate', flag('w.c20_gate_fixed'), 'На задней калитке второй засов.'),
  N('c20_prints', flag('w.c20_prints'), 'Ночью у задней калитки кто-то стоял: на инее следы босых ног.'),
  N('c20_seed', flag('w.c20_seed_warning'), 'Хенрике велела: семенную картошку, сзади слева, не есть ни при каком голоде. Иначе весной нечего сажать.'),
  N('c20_seed_seen', all(flag('w.c20_seed_seen'), { not: flag('w.c20_seed_warning') }), 'В подвале сзади слева стоят ящики с надписью мелом «Saat». Семенная картошка.'),
  N('c20_nurse', flag('w.c20_nurse_more'), 'Сестра донорского блока тихо сказала {B.dat}: у доноров берут больше, чем можно.'),
  N('c20_walter', flag('w.c20_walter'), 'На соседней с Оле койке лежит Вальтер из Уэльцена, седьмой день. У него внук.'),
  N('c20_more', flag('w.c20_more_each_day'), 'Солдат на вышке казармы: людей в больничных рубашках каждый день больше, все со стороны автобана.'),
  N('c20_drk', any(flag('w.c20_drk_okafor'), flag('w.c20_drk_merle'), flag('w.c20_drk_self')), '{B} оставила записку на столе Красного Креста в Люнебурге. Если кто-то поедет в ту сторону, её передадут.'),
  N('c20_coop', flag('w.c20_coop_fixed'), 'Под сеткой курятника снова был подкоп. {A} завалил его камнями.'),
  N('c20_route', flag('w.c20_field_route'), 'На карте {A.gen} обведена полевая дорога вдоль леса: к автобану чуть севернее съезда у Гарльсторфа, к мосту.'),
  N('c20_steered', flag('w.c20_steered'), 'Двоих из больницы, что шли полем к хутору, {A} увёл стуком по ведру к лесополосе.'),
  N('c20_insulin', flag('w.c20_insulin_given'), '{B} отнесла инсулин женщине на Кирхвег, 4 в Йестебурге. Её муж дал взамен банку мёда.'),
  N('c20_jannes_drives', flag('w.c20_jannes_drives'), 'Яннес проехал на Corsa круг по двору. Не заглох.'),
  N('c20_smoke', flag('w.c20_smoke_seen'), 'Днём над лесом у автобана стоял чёрный дым. Так горит солярка.'),
  N('c20_charge_h', v('w.c20_in_charge', 'henrike'), 'Если вас вечером не будет, хутор на Хенрике.'),
  N('c20_charge_u', v('w.c20_in_charge', 'ute'), 'Если вас вечером не будет, за старшую на хуторе Уте. Задняя дверь закрыта, дети спят наверху.'),
  N('c20_charge_v', v('w.c20_in_charge', 'volker'), 'Если вас вечером не будет, за двором присмотрит Фолькер. Он всё равно не спит по ночам.'),
  N('c20_charge_n', v('w.c20_in_charge', 'nina'), 'Если вас вечером не будет, двор на Нине: она знает, где засовы, фонарь и вилы.'),
  N('c20_second_truck', flag('w.c20_lea_second_truck'), 'Лея ехала во втором грузовике колонны.'),
];

const carLue: Cond = { itemAt: 'opel_corsa', place: 'c18_lueneburg' };
const carFarm: Cond = { itemAt: 'opel_corsa', place: 'hof_luedemann' };
const canGo: Cond = any(all(lue, carLue, { fuelFor: 'opel_corsa', km: 30 }), all({ at: 'hof_luedemann' }, carFarm, { fuelFor: 'opel_corsa', km: 12 }));

export const point20Convoy: JointDecision = {
  id: 'c3_new_convoy20', checkpoint: 20, canParticipate: P20,
  prompt: { default: 'Колонна из Ганновера стоит у Гарльсторфа, связи нет. Там плазма, инсулин и девушка, которая должна заменить Оле. Можно поехать туда на Corsa, пока не стемнело. Из Люнебурга можно уехать домой в объезд, через Винзен. Можно никуда не ехать до утра. Разные ответы — ближе к осторожному.' },
  options: [
    { id: 'go', label: { default: 'Ехать к колонне у Гарльсторфа' }, when: any(carLue, carFarm), feasible: all({ has: 'car_keys' }, canGo),
      effects: [{ set: 'w.c20_convoy', value: 'go' },
        { if: lue, then: [{ journey: { to: 'c21_convoy', km: 30, minutes: 50, vehicle: 'opel_corsa' } }], else: [{ journey: { to: 'c21_convoy', km: 12, minutes: 25, vehicle: 'opel_corsa' } }] }],
      text: 'Вы выезжаете, пока ещё светло. Последние километры фары выхватывают брошенные машины на обочинах. Над съездом с автобана мигает синим.' },
    { id: 'home', label: { default: 'Ехать домой в объезд, через Винзен' }, when: carLue, feasible: all(lue, { has: 'car_keys' }, carLue, { fuelFor: 'opel_corsa', km: 48 }),
      effects: [{ set: 'w.c20_convoy', value: 'home' }, { journey: { to: 'hof_luedemann', km: 48, minutes: 75, vehicle: 'opel_corsa' } }],
      text: 'Вы едете на север, в объезд, через Винзен. Дорога пустая. Где-то справа, за лесом, над автобаном стоит зарево.' },
    { id: 'wait', label: { default: 'Никуда не ехать до утра' }, effects: [{ set: 'w.c20_convoy', value: 'wait' }],
      text: 'Вы остаётесь там, где есть. Ночь будет длинной.' },
  ],
  compromises: [{ pair: ['go', 'home'], result: 'home' }, { pair: ['go', 'wait'], result: 'wait' }, { pair: ['home', 'wait'], result: 'wait' }],
  arbiters: [{ id: 'c20_convoy_wait', when: P20, winner: 'wait', text: 'Вы не сходитесь. Остаётесь до утра.' }],
  default: 'wait',
};

export const point20Ole: JointDecision = {
  id: 'c3_new_ole20', checkpoint: 20, canParticipate: P20,
  prompt: { default: 'Оле не уйдёт из Люнебурга, пока нет замены. Хенрике ждёт от вас слова. Можно пообещать: как только замена будет, вы сами привезёте его домой. Можно сказать, что решать ему. Можно сказать Хенрике: хватит, пусть едет домой с заменой или без. Разные ответы — решать ему.' },
  options: [
    { id: 'promise', label: { default: 'Обещать: привезём его, как только будет замена' },
      effects: [{ set: 'w.c20_ole', value: 'promise' }, { if: { npc: 'henrike', alive: true }, then: [{ npc: 'henrike', trust: 2, remember: 'c20_they_will_bring_him' }] }],
      text: 'Вы обещаете. Обещание висит в воздухе тяжелее, чем вы ожидали.' },
    { id: 'his', label: { default: 'Сказать: решать ему самому' },
      effects: [{ set: 'w.c20_ole', value: 'his' }, { if: { npc: 'ole', alive: true }, then: [{ npc: 'ole', trust: 2 }] }],
      text: 'Это его кровь и его обещание детям. Вы не будете решать за него.' },
    { id: 'enough', label: { default: 'Сказать Хенрике: хватит, пусть едет домой' },
      effects: [{ set: 'w.c20_ole', value: 'enough' }, { if: { npc: 'henrike', alive: true }, then: [{ npc: 'henrike', trust: 1 }] }, { if: { npc: 'ole', alive: true }, then: [{ npc: 'ole', trust: -1 }] }],
      text: 'Вы говорите это вслух. Хенрике кивает, будто ждала, что кто-то скажет это за неё.' },
  ],
  compromises: [{ pair: ['promise', 'his'], result: 'his' }, { pair: ['promise', 'enough'], result: 'promise' }, { pair: ['his', 'enough'], result: 'his' }],
  arbiters: [{ id: 'c20_ole_his', when: P20, winner: 'his', text: 'Вы не сходитесь. Решать Оле.' }],
  default: 'his',
};
