import type { Scene } from '../../engine/content-types';
import type { Cond } from '../../engine/types';
import { all, flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { meal } from './point12';
import { any, v } from './point18';
import { npc, tableOnly } from './point19';
import {
  S43, dogs43, felixFate43, felixMet43, felixVouched43, hansenDead43, henrike43, merleTrip43, own43, sat43, set43, sun43,
  until43, w43,
} from './point43';

// Участок 43, линия A. Суббота: облава в лесополосе (Феликс — по КТ42 и по тому, что A сказал Брандту), обход Зеве с Лукасом:
// пустой пост у колонии в ночь оттепели, Яннес признаёт, что ушёл, и молчит почему; обед, Брандт и совет в понедельник, двор,
// встреча автобуса, вечерние дела. Воскресенье: Яннес у ворот, подготовка к кофе, гости, сумерки.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S43({ ...scene, for: 'any', chapter: 'ch3' });
const withUs: Cond = all(felixMet43, any(felixFate43('take'), felixFate43('brandt')));
const inPit: Cond = all(felixMet43, felixFate43('feed'));
const ledAway: Cond = own43('as', 'away');
const found: Cond = any(not(felixMet43), all(inPit, not(ledAway)));
const felixHere: Cond = any(withUs, v('w.c43_felix', 'farm'), v('w.c43_felix', 'ditch'));
const guestsN: Cond = v('w.c42_advent_guests', 'neighbors');
const guestsB: Cond = v('w.c42_advent_guests', 'brothers');

export const day43AScenes: Scene[] = [
  // ═════════════ Суббота ═════════════
  X({ id: 'c43_a_sweep', title: 'У моста', camp: yard14, ambient: sat43,
    text: [
      { text: 'У моста через Зеве восемь мужчин: вилы, палки, два топора. Брандт с блокнотом. Пар изо рта, снег скрипит.' },
      { when: dogs43, text: 'Лукас держит на поводках двух соседских собак. Собаки рвутся к лесополосе.' },
      { when: not(dogs43), text: 'Собак нет. Брандт смотрит на тебя: «Ohne Hunde. Wie besprochen». Без собак. Как договорились.' },
      { when: felixFate43('take'), text: 'Феликс стоит рядом с тобой, в старом свитере Оле. Лесополосу он знает лучше всех: месяц в ней прожил.' },
      { when: felixFate43('brandt'), text: 'Ты {m:привёл|привела} Феликса к мосту сам{m:|а}. Брандт долго смотрит на него, потом пишет в блокноте: имя, возраст, «Graben ab Montag». Ров с понедельника.' },
      { when: inPit, text: 'Феликс сейчас в своей яме под дубом. Ты знаешь где. Брандт — нет.' },
      { when: not(felixMet43), text: '— Im Windschutzstreifen wohnt einer. Klaut Eier seit November. Wir finden ihn und fragen, wer er ist, — говорит Брандт.\n\nВ лесополосе кто-то живёт. С ноября таскает яйца. Найдём и спросим, кто такой.' },
    ],
    actions: [
      { id: 'c43_as_lead', label: 'Пойти первым и вести к дубу самому', when: inPit, minutes: 40, terminal: true, goto: 'c43_a_belt', ambientDuring: sat43,
        text: 'Ты идёшь первым, громко, чтобы под дубом услышали заранее. Цепь идёт за тобой. Ты не оборачиваешься.', effects: [set43('as', 'lead'), until43(49, 7, 40)] },
      { id: 'c43_as_away', label: 'Повести цепь в другой конец лесополосы', when: all(inPit, dogs43), minutes: 40, terminal: true, goto: 'c43_a_belt', ambientDuring: sat43,
        text: 'Ты говоришь: следы видел у канавы, на том конце. Брандт кивает, и цепь поворачивает. Лукас идёт рядом и дважды смотрит на тебя слишком долго.', effects: [set43('as', 'away'), until43(49, 7, 40)] },
      { id: 'c43_as_line', label: 'Идти в цепи со всеми', minutes: 40, terminal: true, goto: 'c43_a_belt', ambientDuring: sat43,
        text: 'Цепь растягивается вдоль канавы, по человеку на десять шагов. Ты идёшь в середине. Под ногами хрустит наст.', effects: [set43('as', 'line'), until43(49, 7, 40)] },
      { id: 'c43_as_dogs', label: 'Попросить Брандта взять собак на короткий поводок: это человек, не зверь', when: dogs43, minutes: 40, terminal: true, goto: 'c43_a_belt', ambientDuring: sat43,
        text: 'Брандт хмурится, потом кивает Лукасу. Собак берут на короткий поводок. «Wenn er wegläuft, lass ich sie los». Если побежит, спущу.', effects: [set43('as', 'dogs'), npc('c16_brandt', -1), until43(49, 7, 40)] },
    ] }),

  X({ id: 'c43_a_belt', title: 'Лесополоса', camp: yard14, ambient: sat43,
    text: [
      { when: withUs, text: 'У поваленного дуба — пустая яма, брезент, скорлупа, чёрный круг кострища. Феликс показывает: здесь спал, здесь грелся, отсюда ходил к курятникам. Мужчины молчат. Один хлопает его по плечу.' },
      { when: ledAway, text: 'Цепь проходит дальний конец лесополосы. Пусто: только заячьи следы. Брандт ругается вполголоса и поворачивает назад. До дуба отсюда триста метров.' },
      { when: all(found, felixMet43, dogs43), text: 'У дуба собаки рвут поводки и захлёбываются лаем. Из-под брезента выбирается Феликс. Руки вверх, лицо белое. Он ищет глазами тебя.' },
      { when: all(found, felixMet43, not(dogs43)), text: 'У дуба кто-то кричит «Hier!». Из-под брезента выбирается Феликс. Руки вверх, лицо белое. Он ищет глазами тебя.' },
      { when: not(felixMet43), text: 'У поваленного дуба кто-то кричит «Hier!». Из-под брезента выбирается парень лет двадцати, в армейских штанах и чужом пуховике. Руки вверх.\n\n— Felix. Felix Riedel. Ich tu nichts.\n\nФеликс. Феликс Ридель. Я ничего не сделаю.' },
      { when: found, text: 'Кто-то поднимает вилы. Брандт пока молчит и смотрит.' },
    ],
    actions: [
      { id: 'c43_ab_between', label: 'Встать между ним и вилами', when: found, minutes: 30, terminal: true, goto: 'c43_a_felix', ambientDuring: sat43,
        text: 'Ты встаёшь перед ним. Вилы опускаются, не сразу. Брандт говорит: «Gut. Dann reden wir». Хорошо. Тогда поговорим.', effects: [set43('ab', 'between'), until43(49, 8, 30)] },
      { id: 'c43_ab_vouch', label: 'Сказать Брандту: этот парень работал бы на рву, если его не травить', when: found, minutes: 30, terminal: true, goto: 'c43_a_felix', ambientDuring: sat43,
        text: 'Брандт смотрит на тебя, потом на парня. «Kannst du graben?» Копать умеешь? Феликс кивает так быстро, что шапка съезжает на глаза.', effects: [set43('ab', 'vouch'), until43(49, 8, 30)] },
      { id: 'c43_ab_watch', label: 'Не вмешиваться: пусть решает Брандт', when: found, minutes: 30, terminal: true, goto: 'c43_a_felix', ambientDuring: sat43,
        text: 'Ты стоишь в стороне. Брандт спрашивает, кто такой, откуда, сколько яиц. Феликс отвечает на всё. На вопрос про ложбину отвечает не сразу.', effects: [set43('ab', 'watch'), until43(49, 8, 30)] },
      { id: 'c43_ab_fill', label: 'Помочь засыпать яму и забрать брезент', when: withUs, minutes: 30, activity: 'moderate', terminal: true, goto: 'c43_a_felix', ambientDuring: sat43,
        text: 'Брезент — в узел, котелок — Феликсу. Яму засыпаете лапником и снегом. Феликс бросает последнюю горсть и не оглядывается.', effects: [set43('ab', 'fill'), until43(49, 8, 30)] },
      { id: 'c43_ab_back', label: 'Вернуться к мосту со всеми', when: any(withUs, ledAway), minutes: 30, terminal: true, goto: 'c43_a_felix', ambientDuring: sat43,
        text: 'Цепь возвращается к мосту молча. Брандт пересчитывает людей. Все на месте.', effects: [set43('ab', 'back'), until43(49, 8, 30)] },
    ] }),

  X({ id: 'c43_a_felix', title: 'У моста, после', camp: yard14, ambient: sat43,
    text: [
      { when: found, text: 'Феликс сидит на парапете моста, ему дали чей-то термос. Брандт пишет в блокнот и говорит, не поднимая головы: где ему спать — решать дворам.' },
      { when: withUs, text: 'У моста Брандт кивает Феликсу: «Montag, sieben Uhr, Graben». Понедельник, семь утра, ров. Феликс отвечает «jawohl» и краснеет: так говорят в армии, а армии больше нет.' },
      { when: ledAway, text: 'У моста Лукас отводит тебя в сторону: «Du wusstest, wo er ist». Ты знал{m:|а}, где он. Это не вопрос. «Ich sag nichts. Aber Brandt ist nicht dumm». Я ничего не скажу. Но Брандт не дурак.' },
    ],
    actions: [
      { id: 'c43_af_farm', label: 'Сказать: пусть ночует у нас в сарае', when: found, minutes: 40, terminal: true, goto: 'c43_a_stream', ambientDuring: sat43,
        text: 'Брандт записывает: «Lüdemann». Феликс смотрит на тебя и не может ничего сказать. Ты отдаёшь ему свой хлеб и показываешь дорогу через поле.', effects: [set43('af', 'farm'), w43('felix', 'farm'), until43(49, 9, 20)] },
      { id: 'c43_af_ditch', label: 'Сказать: пусть ночует при пожарной части, ближе ко рву', when: found, minutes: 40, terminal: true, goto: 'c43_a_stream', ambientDuring: sat43,
        text: 'Брандт кивает: в пожарной части есть топчан и печка. Феликс уходит с Лукасом. На мосту он оборачивается и поднимает руку.', effects: [set43('af', 'ditch'), w43('felix', 'ditch'), until43(49, 9, 20)] },
      { id: 'c43_af_brandt', label: 'Оставить решение Брандту', when: found, minutes: 30, terminal: true, goto: 'c43_a_stream', ambientDuring: sat43,
        text: 'Брандт думает. «Erst die Feuerwehr. Dann sehen wir». Сначала пожарная часть. Потом посмотрим. Феликс уходит с Лукасом, оглядываясь.', effects: [set43('af', 'brandt'), w43('felix', 'ditch'), until43(49, 9, 10)] },
      { id: 'c43_af_thanks', label: 'Поблагодарить Брандта, что без собак', when: all(withUs, felixVouched43), minutes: 30, terminal: true, goto: 'c43_a_stream', ambientDuring: sat43,
        text: 'Брандт пожимает плечами. «Hunde sind für Tote». Собаки — для мёртвых. И уходит к машине.', effects: [set43('af', 'thanks'), npc('c16_brandt', 1), until43(49, 9, 10)] },
      { id: 'c43_af_go', label: 'Пойти дальше с Лукасом: Брандт велел проверить посты на Зеве', minutes: 30, terminal: true, goto: 'c43_a_stream', ambientDuring: sat43,
        text: 'Брандт машет: «Lukas, zeig ihm die Posten». Лукас, покажи ему посты. Вы уходите вдоль ручья.', effects: [set43('af', 'go'), until43(49, 9, 10)] },
      { id: 'c43_af_lukas', label: 'Сказать Лукасу: спасибо, что промолчит', when: ledAway, minutes: 30, terminal: true, goto: 'c43_a_stream', ambientDuring: sat43,
        text: 'Лукас пожимает плечами, совсем как Брандт. «Er hat bei uns Eier geklaut, nicht bei Brandt». Он у нас яйца таскал, не у Брандта. И уводит тебя вдоль ручья.', effects: [set43('af', 'lukas'), until43(49, 9, 10)] },
    ] }),

  X({ id: 'c43_a_stream', title: 'Посты на Зеве', camp: yard14, ambient: sat43,
    text: [
      { text: 'Вдоль Зеве — посты дворов: шалаш, колокол на столбе, пень вместо скамейки. Лукас показывает каждый и называет двор. Ручей подо льдом, лёд толстый.' },
      { text: 'У колонии, на столбе поста, висит фонарь «летучая мышь». Стекло треснуло, фитиль выгорел до жести. Внизу на снегу — старые, вмёрзшие следы: двое тащились через ручей к полю Ханзенов.' },
      { text: '— In der Tauwetternacht bin ich hier um zwei vorbei, — говорит Лукас. — Lampe brannte. Keiner da. Vierzig Minuten später war er wieder da.\n\nВ ночь оттепели я тут проходил в два. Фонарь горел. Никого. Через сорок минут он был на месте.' },
    ],
    actions: [
      { id: 'c43_ast_who', label: 'Спросить, чей это пост', minutes: 30, terminal: true, goto: 'c43_a_jannes', ambientDuring: sat43,
        text: '— Jannes. Kolonie. — Лукас смотрит на следы. — Ich hab Brandt nichts gesagt. Noch nicht.\n\nЯннес. Колония. Я Брандту ничего не говорил. Пока.', effects: [set43('ast', 'who'), set43('knows_post', true), until43(49, 10, 20)] },
      { id: 'c43_ast_tracks', label: 'Пройти по следам до поля Ханзенов', minutes: 40, terminal: true, goto: 'c43_a_jannes', ambientDuring: sat43,
        text: 'Следы идут через ручей, по полю, прямо к дому Ханзенов. У разбитого окна они кончаются. Лукас догоняет и говорит, чей был пост: Яннеса.', effects: [set43('ast', 'tracks'), set43('knows_post', true), until43(49, 10, 30)] },
      { id: 'c43_ast_quiet', label: 'Попросить Лукаса пока никому не говорить', minutes: 30, terminal: true, goto: 'c43_a_jannes', ambientDuring: sat43,
        text: 'Лукас пожимает плечами. «Bis Montag. Dann fragt Brandt jeden». До понедельника. Потом Брандт спросит каждого. И называет имя: Яннес.', effects: [set43('ast', 'quiet'), set43('knows_post', true), until43(49, 10, 20)] },
    ] }),

  X({ id: 'c43_a_jannes', title: 'Яннес', camp: yard14, ambient: sat43,
    text: [
      { text: 'Яннес в колонии колет дрова у домика Уте. Увидев тебя с Лукасом, не останавливается. Колун поднимается и падает ровно, как часы.' },
    ],
    actions: [
      { id: 'c43_aj_ask', label: 'Спросить прямо: это он ушёл с поста в ночь оттепели?', minutes: 40, terminal: true, goto: 'c43_a_lunch', ambientDuring: sat43,
        text: '— Ja. Vierzig Minuten. — Колун опускается. — Warum, ist egal. Der alte Hansen hat dafür bezahlt. Sag Brandt, was du willst.\n\nДа. Сорок минут. Почему — неважно. Ханзены за это заплатили. Скажи Брандту, что хочешь.\n\nОн отворачивается к поленнице.', effects: [set43('aj', 'ask'), w43('a_heard_jannes', true), until43(49, 11, 30)] },
      { id: 'c43_aj_warn', label: 'Предупредить: в понедельник Брандт будет спрашивать имена', minutes: 40, terminal: true, goto: 'c43_a_lunch', ambientDuring: sat43,
        text: '— Ich weiß. — Яннес не поднимает головы. — Dann sag es ihm. Ich lauf nicht weg. Diesmal nicht.\n\nЗнаю. Тогда скажи ему. Я не убегу. На этот раз — нет.', effects: [set43('aj', 'warn'), w43('a_heard_jannes', true), until43(49, 11, 30)] },
      { id: 'c43_aj_help', label: 'Взять второй колун и колоть рядом, ничего не спрашивая', minutes: 50, activity: 'heavy', terminal: true, goto: 'c43_a_lunch', ambientDuring: sat43,
        text: 'Час вы колете молча. Под конец он говорит, глядя в чурбак: «Ich war weg. Das stimmt. Mehr sag ich nicht». Меня не было. Это правда. Больше ничего не скажу. Уте смотрит из окна и прячется, когда ты поднимаешь глаза.', effects: [set43('aj', 'help'), w43('a_heard_jannes', true), npc('c14_jannes', 1), { body: 'fatigue', delta: 6 }, until43(49, 11, 40)] },
    ] }),

  X({ id: 'c43_a_lunch', title: 'Обед', camp: kitchen14, onEnter: [until43(49, 12, 30)],
    text: [
      { text: 'Обед без половины дома: кто-то в Винзене, кто-то у моста. Суп с перловкой.' },
      { when: felixHere, text: 'Феликс ест на краю лавки. Хенрике ставит ему вторую миску, не спрашивая.' },
    ],
    actions: [
      { id: 'c43_al_eat', label: 'Обедать', minutes: 40, terminal: true, goto: 'c43_a_brandt', ...tableOnly,
        text: 'Суп горячий, хлеб вчерашний. Ты ешь и думаешь о фонаре на столбе.', effects: [set43('al', 'eat'), meal('eat'), until43(49, 13, 15)] },
      { id: 'c43_al_henrike', label: 'Спросить Хенрике про Яннеса', when: henrike43, minutes: 40, terminal: true, goto: 'c43_a_brandt', ...tableOnly,
        text: '— Jannes? Guter Junge. Redet wenig. Seit Ute allein ist, hackt er ihr Holz. — Хенрике смотрит на тебя внимательно. — Warum?\n\nЯннес? Хороший парень. Говорит мало. С тех пор как Уте одна, колет ей дрова. А что?\n\nТы не отвечаешь.', effects: [set43('al', 'henrike'), meal('eat'), until43(49, 13, 15)] },
      { id: 'c43_al_bread', label: 'Взять хлеб и пойти во двор', minutes: 25, terminal: true, goto: 'c43_a_brandt',
        text: 'Хлеб в карман, кружку залпом. Думать удобнее с колуном в руках.', effects: [set43('al', 'bread'), { body: 'hunger', delta: -12 }, until43(49, 13, 0)] },
    ] }),

  X({ id: 'c43_a_brandt', title: 'Брандт у ворот', camp: yard14, ambient: sat43, onEnter: [until43(49, 13, 30)],
    text: [
      { text: 'В половине второго у ворот джип пожарной части. Брандт не выходит. Говорит через опущенное стекло.' },
      { text: '— Montag, zehn Uhr, Rat in der Feuerwehr. Jeder Hof sagt, was er weiß. In der Tauwetternacht war einer weg. Deshalb sind sie bis zu Hansens gekommen. Du warst heute mit Lukas am Bach.\n\nПонедельник, десять, совет в пожарной части. Каждый двор говорит, что знает. В ночь оттепели кого-то не было на месте. Поэтому они дошли до Ханзенов. Ты сегодня был с Лукасом на ручье.' },
      { when: hansenDead43, text: 'Старик Ханзен лежит под яблоней. Брандт об этом не говорит. Это и так слышно.' },
    ],
    actions: [
      { id: 'c43_abt_later', label: 'Сказать: что знаю — скажу на совете', minutes: 30, terminal: true, goto: 'c43_a_yard', ambientDuring: sat43,
        text: 'Брандт кивает. «Gut. Montag». Хорошо. В понедельник. Джип уезжает. Ты стоишь у ворот, пока не начинают мёрзнуть руки.', effects: [set43('abt', 'later'), until43(49, 14, 0)] },
      { id: 'c43_abt_nothing', label: 'Сказать: ничего не видел', minutes: 30, terminal: true, goto: 'c43_a_yard', ambientDuring: sat43,
        text: 'Брандт смотрит на тебя чуть дольше, чем нужно. «Lukas sagt was anderes». Лукас говорит другое. Или не говорит, но Брандт делает вид. Джип уезжает.', effects: [set43('abt', 'nothing'), npc('c16_brandt', -1), until43(49, 14, 0)] },
      { id: 'c43_abt_what', label: 'Спросить, что он сделает с тем, кто ушёл', minutes: 30, terminal: true, goto: 'c43_a_yard', ambientDuring: sat43,
        text: '— Raus aus der Wache. Und halbe Ration bis Februar. Für den ganzen Hof. — Брандт смотрит на поле. — Wer weggeht, lässt alle anderen allein.\n\nИз стражи вон. И половина пайка до февраля. Всему двору. Кто уходит с поста, оставляет одних всех остальных.', effects: [set43('abt', 'what'), set43('knows_cost', true), until43(49, 14, 0)] },
    ] }),

  X({ id: 'c43_a_yard', title: 'После обеда', camp: yard14, ambient: sat43,
    text: [
      { when: felixHere, text: 'Феликс не умеет сидеть без дела. Он уже у поленницы с колуном. Колет плохо, как городской, но упрямо.' },
      { when: not(felixHere), text: 'Двор, мороз, низкое солнце. До автобуса два часа. Дел хватает.' },
    ],
    actions: [
      { id: 'c43_ay_teach', label: 'Показать Феликсу, как колоть, чтобы не уставать', when: felixHere, minutes: 60, activity: 'moderate', terminal: true, goto: 'c43_a_gate', ambientDuring: sat43,
        text: 'Ноги шире, не замахиваться из-за головы, бить в трещину. Через полчаса у него получается. Он говорит, что мать всегда боялась, что он отрубит себе ногу. Потом замолкает: про мать он говорит впервые.', effects: [set43('ay', 'teach'), until43(49, 15, 15)] },
      { id: 'c43_ay_letter', label: 'Спросить Феликса про письмо матери', when: all(felixHere, flag('w.c42_jonas_letter')), minutes: 45, terminal: true, goto: 'c43_a_gate', ambientDuring: sat43,
        text: 'Письмо всё ещё у тебя во внутреннем кармане. Феликс просит: если будет почта Красного Креста из Винзена — передать. «Sie soll wissen, dass ich lebe. Alles andere kann warten». Пусть знает, что я жив. Остальное подождёт.', effects: [set43('ay', 'letter'), w43('felix_letter_sent', true), until43(49, 15, 0)] },
      { id: 'c43_ay_wood', label: 'Наколоть и сложить дров на праздники', minutes: 60, activity: 'heavy', terminal: true, goto: 'c43_a_gate', ambientDuring: sat43,
        text: 'Колун, чурбак, полено. Поленница у стены растёт на ряд. Ты колешь и думаешь о фонаре с треснувшим стеклом.', effects: [set43('ay', 'wood'), { body: 'fatigue', delta: 6 }, until43(49, 15, 15)] },
      { id: 'c43_ay_lamp', label: 'Почистить и заправить фонари на ночь', minutes: 45, terminal: true, goto: 'c43_a_gate',
        text: 'Три фонаря, керосин на донышке, тряпка, ножницы для фитиля. Ты подрезаешь фитили ровно. Если ночью придётся бежать к посту, свет будет.', effects: [set43('ay', 'lamp'), until43(49, 15, 0)] },
    ] }),

  X({ id: 'c43_a_gate', title: 'Автобус', camp: yard14, ambient: sat43, onEnter: [until43(49, 15, 50)],
    text: [
      { text: 'Без десяти четыре. Темнеет. По дороге от пожарной части идут люди с сумками: автобус из Винзена вернулся.' },
      { text: '{partner} идёт {pm:первым|первой}, с тяжёлой сумкой через плечо. Увидев тебя у ворот, машет.' },
      { when: merleTrip43, text: 'За {partner.ins} — Мерле. Бледная, но улыбается.' },
    ],
    actions: [
      { id: 'c43_ag_bag', label: 'Забрать сумку и идти домой рядом', minutes: 30, terminal: true, goto: 'c43_a_chores', ambientDuring: sat43,
        text: 'Сумка тяжёлая: банки, бумаги, что-то звякает. Вы идёте по дороге к хутору рядом, плечо к плечу. {partner} рассказывает про Винзен. Не всё, ты это чувствуешь.', effects: [set43('ag', 'bag'), until43(49, 16, 30)] },
      { id: 'c43_ag_ask', label: 'Спросить, как прошло', minutes: 30, terminal: true, goto: 'c43_a_chores', ambientDuring: sat43,
        text: '{partner} отвечает: «Потом, дома». И берёт тебя за руку. Рука холодная.', effects: [set43('ag', 'ask'), until43(49, 16, 30)] },
      { id: 'c43_ag_tell', label: 'Рассказать про облаву и про пост, пока идёте', minutes: 30, terminal: true, goto: 'c43_a_chores', ambientDuring: sat43,
        text: 'Ты рассказываешь про лесополосу, про Феликса или пустую яму, про фонарь на посту. Имени не называешь. {partner} слушает и спрашивает только: «Ты знаешь, кто?» Ты киваешь.', effects: [set43('ag', 'tell'), until43(49, 16, 30)] },
    ] }),

  X({ id: 'c43_a_chores', title: 'Вечерние дела', camp: yard14, ambient: sat43,
    text: [
      { text: 'До ужина — хлев, куры, вода. Мороз крепчает к ночи.' },
    ],
    actions: [
      { id: 'c43_ac_hens', label: 'Закрыть кур и собрать яйца', minutes: 40, terminal: true, goto: 'c43_sat_eve', ambientDuring: sat43,
        text: 'Шесть яиц. Под сеткой новых подкопов нет. Тот, кто таскал яйца, больше не таскает.', effects: [set43('ac', 'hens'), until43(49, 17, 15)] },
      { id: 'c43_ac_water', label: 'Натаскать воды в бак у плиты', minutes: 40, activity: 'moderate', terminal: true, goto: 'c43_sat_eve', ambientDuring: sat43,
        text: 'Шесть вёдер из колодца, лёд у сруба сколоть. Бак полный. Хенрике кивает от плиты.', effects: [set43('ac', 'water'), until43(49, 17, 15)] },
      { id: 'c43_ac_think', label: 'Постоять у изгороди и посмотреть на колонию', minutes: 30, terminal: true, goto: 'c43_sat_eve', ambientDuring: sat43,
        text: 'В колонии одно окно светится: домик Уте. У соседнего дома, где живёт Яннес, темно. Ты стоишь, пока в окне Уте не гаснет свет.', effects: [set43('ac', 'think'), until43(49, 17, 0)] },
    ] }),

  // ═════════════ Воскресенье ═════════════
  X({ id: 'c43_a_sunday', title: 'Яннес у ворот', camp: yard14, ambient: sun43,
    text: [
      { text: 'В девятом часу у ворот стоит Яннес. Без шапки, снег на волосах. В дом не заходит.' },
      { text: '— Hast du es Brandt gesagt?\n\nТы сказал{m:|а} Брандту?' },
    ],
    actions: [
      { id: 'c43_asu_not', label: 'Сказать: ещё нет. До совета решу', minutes: 40, terminal: true, goto: 'c43_a_hall', ambientDuring: sun43,
        text: 'Яннес кивает. «Egal, was du sagst. Ich komme morgen». Что бы ты ни сказал{m:|а}, я приду завтра. Уходит по своей тропе через поле.', effects: [set43('asu', 'not'), until43(50, 9, 30)] },
      { id: 'c43_asu_why', label: 'Спросить ещё раз, почему он ушёл', minutes: 40, terminal: true, goto: 'c43_a_hall', ambientDuring: sun43,
        text: 'Яннес долго молчит.\n\n— Weil ich musste. Und weil ich nicht konnte, beides gleichzeitig. Frag nicht mehr.\n\nПотому что должен был. И потому что не мог иначе. Не спрашивай больше.\n\nОн уходит, и ты видишь, что он хромает: на ноге повязка, под штаниной.', effects: [set43('asu', 'why'), set43('saw_leg', true), until43(50, 9, 30)] },
      { id: 'c43_asu_come', label: 'Позвать его к трём на кофе', minutes: 40, terminal: true, goto: 'c43_a_hall', ambientDuring: sun43,
        text: '— Mit Frau Hansen am Tisch? — Он качает головой. — Nein. Danke.\n\nЗа одним столом с фрау Ханзен? Нет. Спасибо.\n\nОн уходит, не оглядываясь.', effects: [set43('asu', 'come'), until43(50, 9, 30)] },
    ] }),

  X({ id: 'c43_a_hall', title: 'Кухня к празднику', camp: kitchen14,
    text: [
      { text: 'Хенрике раздаёт работу, как на поле: столы, стулья, пол, скатерть. До трёх — успеть.' },
      { when: felixHere, text: 'Феликс носит стулья с чердака по два и ставит их ровно, как в казарме.' },
    ],
    actions: [
      { id: 'c43_ah_tables', label: 'Сдвинуть столы и принести стулья с чердака', minutes: 60, activity: 'moderate', terminal: true, goto: 'c43_sun_lunch',
        text: 'Два стола встык, скатерть поверх, стулья из всех комнат. Получается длинно, как на свадьбе. Хенрике смотрит и говорит: «So war es früher immer». Так раньше было всегда.', effects: [set43('ah', 'tables'), until43(50, 11, 0)] },
      { id: 'c43_ah_floor', label: 'Вымыть пол на кухне и в сенях', minutes: 60, activity: 'moderate', terminal: true, goto: 'c43_sun_lunch',
        text: 'Ведро, тряпка, щётка. Грязь от сапог, опилки, смола. Через час пол светлый, и все ходят по нему на цыпочках.', effects: [set43('ah', 'floor'), until43(50, 11, 0)] },
      { id: 'c43_ah_wreath', label: 'Поправить венок и подрезать свечи', minutes: 45, terminal: true, goto: 'c43_sun_lunch',
        text: 'Ветки к середине, свечи ровно, фитили короче. Венок становится таким, каким был в первый адвент.', effects: [set43('ah', 'wreath'), until43(50, 10, 45)] },
    ] }),

  X({ id: 'c43_a_prep', title: 'Перед гостями', camp: yard14, ambient: sun43,
    text: [
      { when: guestsN, text: 'Фрау Ханзен одна через поле не дойдёт: снег по колено. Уте обещала прийти сама.' },
      { when: guestsB, text: 'Братья придут от насыпи. Дорожку от ворот замело.' },
      { when: all(not(guestsN), not(guestsB)), text: 'Гостей не будет. Но дорожку от ворот замело, а дрова к вечеру нужны.' },
    ],
    actions: [
      { id: 'c43_ap_sled', label: 'Сходить за фрау Ханзен с санками', when: guestsN, minutes: 75, activity: 'moderate', terminal: true, goto: 'c43_coffee', ambientDuring: sun43,
        text: 'Санки, одеяло, через поле. Фрау Ханзен сидит на санках прямо, держа на коленях пирог в полотенце. Всю дорогу молчит. У крыльца говорит: «Danke. Wie früher». Спасибо. Как раньше.', effects: [set43('ap', 'sled'), until43(50, 14, 50)] },
      { id: 'c43_ap_path', label: 'Расчистить дорожку от ворот до крыльца', minutes: 60, activity: 'heavy', terminal: true, goto: 'c43_coffee', ambientDuring: sun43,
        text: 'Лопата, снег мягкий и тяжёлый. Дорожка от ворот до крыльца, потом к сараю. Пот под шапкой, хотя минус.', effects: [set43('ap', 'path'), { body: 'fatigue', delta: 6 }, until43(50, 14, 30)] },
      { id: 'c43_ap_wood', label: 'Принести дров в кухню: сегодня будет жарко', minutes: 45, terminal: true, goto: 'c43_coffee', ambientDuring: sun43,
        text: 'Шесть охапок к печи. Хенрике говорит, что столько не надо. Потом подкладывает в печь сразу две.', effects: [set43('ap', 'wood'), until43(50, 14, 15)] },
    ] }),

  X({ id: 'c43_a_dusk', title: 'После гостей', camp: yard14, ambient: sun43,
    text: [
      { when: guestsN, text: 'Уте уходит первой. У калитки она оглядывается на тебя, как будто хочет что-то сказать, и не говорит.' },
      { when: guestsB, text: 'Дениз и Керем уходят к насыпи, споря о чём-то по-турецки и смеясь.' },
      { text: 'Сумерки. У изгороди колонии, на тропе, стоит тёмная фигура. Яннес. Смотрит на ваши окна. Потом уходит.' },
    ],
    actions: [
      { id: 'c43_ad_follow', label: 'Догнать Яннеса на тропе', minutes: 45, terminal: true, goto: 'c43_sun_eve', ambientDuring: sun43,
        text: 'Ты догоняешь его у канавы. Он не останавливается. Говорит на ходу: «Morgen. Sag, was du sagst. Ich steh dazu». Завтра. Говори что скажешь. Я отвечу за это.', effects: [set43('ad', 'follow'), until43(50, 17, 15)] },
      { id: 'c43_ad_hansen', label: 'Проводить фрау Ханзен домой', when: guestsN, minutes: 60, activity: 'moderate', terminal: true, goto: 'c43_sun_eve', ambientDuring: sun43,
        text: 'Санки, поле, темнота. У её дома она смотрит на заколоченное окно и говорит: «Wenn einer da gewesen wäre…» Если бы кто-то был на месте… Не договаривает.', effects: [set43('ad', 'hansen'), until43(50, 17, 30)] },
      { id: 'c43_ad_chores', label: 'Закрыть кур и сарай', minutes: 30, terminal: true, goto: 'c43_sun_eve', ambientDuring: sun43,
        text: 'Засов, проволока, банки. Всё на месте. Фигура на тропе исчезла.', effects: [set43('ad', 'chores'), until43(50, 17, 0)] },
    ] }),
];
