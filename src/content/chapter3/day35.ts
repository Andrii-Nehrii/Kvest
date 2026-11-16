import type { Scene } from '../../engine/content-types';
import { all, flag, not } from './world3';
import { kitchen14, yard14 } from './point14';
import { any, ninaFarm, v } from './point18';
import { npc } from './point19';
import { brothersCome, okaforComes, oleHome33 } from './point33';
import {
  S35, frost35, hall35, henrike35, own35, jannik35, jannikRefused, jannikTaken, jest35, kasia35, lea35, set35, tobias35, until35, ute35, w35,
} from './point35';

// Участок 35: половины. A — Тобиас (армия уходит 15.12, два места; просит молчать) и Янник (первый день A).
// B — доктор Зандер и Окафор (место медсестры в колонне на север, инсулина у Мерле на десять дней) и Хенрике наедине.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S35({ ...scene, for: 'any', chapter: 'ch3' });
const jestCamp = { at: jest35, stock: 'c3_farm_stock', rest: false as const };
const oleDead = flag('w.c27_ole_last');

export const day35Scenes: Scene[] = [
  // ═════════════ A ═════════════
  X({ id: 'c35_a_tobias', title: 'Тобиас', location: jest35, camp: jestCamp, ambient: frost35, onEnter: [until35(9, 30)],
    text: [
      { when: tobias35, text: 'У пожарной части грузят армейские машины: ящики, канистры, раскладушки. Тобиас стоит у последнего грузовика со списком. Увидев тебя, отдаёт список солдату и отводит тебя за угол, к поленнице.' },
      { when: tobias35, text: '— Was ich dir jetzt sage, sagst du keinem. Keinem. Sonst rennen morgen alle. Am Fünfzehnten zieht die Armee aus Lüneburg ab. Über die Elbe. Der Kreis bleibt allein.\n\nТо, что я сейчас скажу, ты никому не скажешь. Никому. Иначе завтра побегут все. Пятнадцатого армия уходит из Люнебурга. За Эльбу. Округ остаётся один.' },
      { when: tobias35, text: '— Ich darf meine Leute mitnehmen. Zwei Plätze. Ich hab an euch gedacht.\n\nМне разрешили взять своих. Два места. Я подумал о вас.' },
      { when: not(tobias35), text: 'У пожарной части грузят армейские машины. Тобиаса нет. Лукас, сын пожарного, отводит тебя за угол и шепчет, что армия уходит пятнадцатого за Эльбу. Отец сказал. И что у Тобиаса для вас было два места в грузовике. Теперь их нет.' },
      { when: tobias35, text: 'Тобиас не брит, под глазами тени. На рукаве его куртки свежая нашивка, которой вчера не было. Он говорит тихо, отвернувшись к машинам.' },
    ],
    actions: [
      { id: 'c35_at_why', label: 'Спросить: почему мы?', when: tobias35, minutes: 45, terminal: true, goto: 'c35_a_jannik',
        text: '— Weil ihr in der Nacht an der Kolonne nicht weggelaufen seid. Weil ihr die Wahrheit gesagt habt, als es keiner wollte. — Он пожимает плечами. — Und weil ich niemanden sonst habe.\n\nПотому что вы не сбежали в ту ночь у колонны. Потому что вы сказали правду, когда её никто не хотел. И потому что у меня больше никого нет.', effects: [set35('at', 'why'), w35('tobias_offer', true), npc('c15_tobias', 1), until35(10, 30)] },
      { id: 'c35_at_brandt', label: 'Спросить: а Брандт? А остальные?', when: tobias35, minutes: 45, terminal: true, goto: 'c35_a_jannik',
        text: '— Brandt weiß es. Brandt bleibt. Er sagt, einer muss. — Тобиас смотрит на дорогу. — Die anderen erfahren es am Vierzehnten. Wenn es zu spät ist zum Rennen.\n\nБрандт знает. Брандт остаётся. Говорит, кто-то должен. Остальные узнают четырнадцатого. Когда бежать будет поздно.', effects: [set35('at', 'brandt'), w35('tobias_offer', true), w35('brandt_stays', true), until35(10, 30)] },
      { id: 'c35_at_promise', label: 'Пообещать молчать', when: tobias35, minutes: 30, terminal: true, goto: 'c35_a_jannik',
        text: 'Ты киваешь. Тобиас смотрит на тебя долго, потом кивает в ответ и уходит к грузовикам. Ответ ему нужен до четырнадцатого.', effects: [set35('at', 'promise'), set35('promised_silence', true), w35('tobias_offer', true), until35(10, 15)] },
      { id: 'c35_at_lukas', label: 'Поблагодарить Лукаса', when: not(tobias35), minutes: 30, terminal: true, goto: 'c35_a_jannik',
        text: 'Лукас пожимает плечами и убегает к отцу. Два места, которых нет. Ты стоишь у поленницы и не можешь решить, легче тебе от этого или нет.', effects: [set35('at', 'lukas'), w35('army_known', true), until35(10, 15)] },
    ] }),

  X({ id: 'c35_a_jannik', title: 'Водитель', location: jest35, camp: jestCamp, ambient: hall35, onEnter: [until35(11, 0)],
    text: [
      { text: 'На площади перед пунктом стоят три белых грузовика Красного Креста из Гестхахта: забирают лежачих, привезли лекарства. Водители курят у кабин.' },
      { when: all(jannik35, jannikRefused), text: 'Один из них, молодой, в куртке Красного Креста не по размеру, смотрит на тебя слишком долго. Потом подходит.\n\n— Wir kennen uns. A7, vor dem Elbtunnel. Zehnter November. Sie haben die Tür nicht aufgemacht.\n\nМы знакомы. A7, перед Эльбским тоннелем. Десятое ноября. Вы не открыли дверь.\n\nЯнник. Рукав тогда был в крови от локтя до кисти.' },
      { when: all(jannik35, jannikTaken), text: 'Один из них, молодой, в куртке Красного Креста не по размеру, бросает сигарету и идёт к тебе с раскрытыми руками.\n\n— Sie! A7, der Tunnel! Sie haben mich mitgenommen!\n\nВы! A7, тоннель! Вы меня подвезли!\n\nЯнник. Он обнимает тебя так, что хрустят рёбра.' },
      { when: all(jannik35, not(any(jannikRefused, jannikTaken))), text: 'Один из водителей, молодой, в куртке не по размеру, просит прикурить. Его зовут Янник, он студент из Харбурга, теперь возит колонны на север. Он спрашивает, правда ли тут, на хуторе, живут люди из Бармбека.' },
      { when: not(jannik35), text: 'Водители курят молча. Старший говорит, что десятого колонна пойдёт на Аренсбург и что места в кабинах считаны: по одному сопровождающему на машину.' },
      { text: 'Площадь перед пунктом истоптана колёсами грузовиков в грязную кашу. Пахнет дизелем и хлоркой. Кто-то из водителей греет руки над выхлопной трубой.' },
    ],
    actions: [
      { id: 'c35_aj_sorry', label: 'Сказать: прости. Я тогда испугался', when: all(jannik35, jannikRefused), minutes: 60, terminal: true, goto: 'c35_a_diesel',
        text: 'Янник долго смотрит на тебя. Потом закуривает.\n\n— Ich hätte mich auch nicht reingelassen. Mit dem Arm. — Он выдыхает дым. — Ich bin dann zu Fuß. Bis Eimsbüttel. Sie war nicht mehr da.\n\nЯ бы и сам себя не впустил. С такой рукой. Я тогда пешком. До Эймсбюттеля. Её там уже не было.\n\nПеред тем как уйти к кабине, он говорит: «Am Zehnten fahre ich den zweiten Wagen. Wenn ihr jemanden habt, der mit muss — ich nehme zwei». Десятого я веду вторую машину. Если у вас кто-то должен ехать — возьму двоих.', effects: [set35('aj', 'sorry'), w35('jannik', true), npc('jannik', 3, 'c35_apologized'), until35(11, 20)] },
      { id: 'c35_aj_excuse', label: 'Объяснить: время было такое, ты бы тоже', when: all(jannik35, jannikRefused), minutes: 60, terminal: true, goto: 'c35_a_diesel',
        text: '— Klar, — говорит Янник. Конечно. — Die Zeit.\n\nОн кивает, вежливо, и возвращается к своей кабине. Больше он в твою сторону не смотрит.', effects: [set35('aj', 'excuse'), npc('jannik', -1), until35(11, 20)] },
      { id: 'c35_aj_girl', label: 'Спросить: ты её нашёл? Ту, в Эймсбюттеле?', when: all(jannik35, jannikRefused), minutes: 60, terminal: true, goto: 'c35_a_diesel',
        text: 'Янник молчит так долго, что ты думаешь — не ответит.\n\n— Nein. Die Wohnung war leer. Ein Zettel: «Bin bei Mama in Lübeck». Lübeck ist zu.\n\nНет. Квартира была пустая. Записка: «Я у мамы в Любеке». Любек закрыт.\n\nПотом он говорит: «Am Zehnten fahre ich den zweiten Wagen. Wenn einer von euch nach Norden muss — zwei passen rein». Десятого я веду вторую машину. Если кому-то из вас на север — двое влезут.', effects: [set35('aj', 'girl'), w35('jannik', true), npc('jannik', 2, 'c35_asked_girl'), until35(11, 20)] },
      { id: 'c35_aj_silent', label: 'Ничего не сказать', when: all(jannik35, jannikRefused), minutes: 30, terminal: true, goto: 'c35_a_diesel',
        text: 'Ты молчишь. Янник ждёт, потом пожимает плечами и уходит к кабине. Ты стоишь на площади ещё долго.', effects: [set35('aj', 'silent'), until35(11, 20)] },
      { id: 'c35_aj_hug', label: 'Обнять его', when: all(jannik35, jannikTaken), minutes: 60, terminal: true, goto: 'c35_a_diesel',
        text: 'Он рассказывает всё сразу: Эймсбюттель, пустую квартиру, записку, Красный Крест. Потом хватает тебя за рукав: «Am Zehnten fahre ich den zweiten Wagen. Für euch ist immer Platz. Für zwei». Десятого я веду вторую машину. Для вас всегда место. Для двоих.', effects: [set35('aj', 'hug'), w35('jannik', true), npc('jannik', 3), until35(11, 20)] },
      { id: 'c35_aj_talk', label: 'Поговорить с ним про колонну', when: all(jannik35, not(any(jannikRefused, jannikTaken))), minutes: 60, terminal: true, goto: 'c35_a_diesel',
        text: 'Янник рассказывает: Гестхахт, мост, посты, Аренсбург. Две недели туда и обратно, если повезёт. «Wenn ihr wen habt, der mit muss — ich hab zwei Plätze». Если у вас кто-то должен ехать — у меня два места.', effects: [set35('aj', 'talk'), w35('jannik', true), until35(11, 20)] },
      { id: 'c35_aj_back', label: 'Возвращаться домой', when: not(jannik35), minutes: 30, terminal: true, goto: 'c35_a_diesel',
        text: 'Ты идёшь домой пешком. Четыре километра думать.', effects: [set35('aj', 'back'), until35(11, 20)] },
    ] }),

  X({ id: 'c35_a_home', title: 'Дома', camp: yard14, ambient: frost35, onEnter: [until35(14, 0)],
    text: [
      { text: 'Дома обед уже съеден. Хенрике оставила тебе миску на плите, под крышкой.' },
      { when: brothersCome, text: 'Дениз ковыряется в тракторе. Увидев тебя, вытирает руки о ветошь:\n\n— Und? Was hat der Soldat gewollt? — Он видел вас за поленницей. Что хотел солдат?' },
      { when: oleHome33, text: 'Оле сидит на крыльце в тулупе. Он смотрит на тебя так, будто уже всё знает.' },
    ],
    actions: [
      { id: 'c35_ah_deniz', label: 'Сказать Денизу: ничего. Про машины', when: brothersCome, minutes: 120, terminal: true, goto: 'c35_a_dusk',
        text: 'Дениз смотрит на тебя, кивает и больше не спрашивает. Вы до сумерек возитесь с трактором вдвоём. Он не верит тебе ни на секунду и ни разу этого не показывает.', effects: [set35('ah', 'deniz'), until35(15, 30)] },
      { id: 'c35_ah_ole', label: 'Сесть рядом с Оле', when: oleHome33, minutes: 120, terminal: true, goto: 'c35_a_dusk', ambientDuring: frost35,
        text: '— Ihr geht, — говорит Оле. Не спрашивает. Вы уходите. — Ist gut. Junge Leute müssen gehen. Aber kommt im Frühling. Zum Säen.\n\nЭто хорошо. Молодым надо уходить. Но приходите весной. К севу.\n\nТы не отвечаешь. Он и не ждёт.', effects: [set35('ah', 'ole'), npc('ole', 1), until35(15, 30)] },
      { id: 'c35_ah_alone', label: 'Поесть и подумать одному', minutes: 120, terminal: true, goto: 'c35_a_dusk',
        text: 'Суп остыл, но ты ешь. Два места за Эльбу. Две недели на север. Хутор. Ты переставляешь это в голове, как кубики, и каждый раз выходит иначе.', effects: [set35('ah', 'alone'), { body: 'hunger', delta: -15 }, until35(15, 30)] },
    ] }),

  X({ id: 'c35_a_dusk', title: 'Сумерки', camp: kitchen14,
    text: [
      { text: 'Сумерки. На кухне Хенрике чистит картошку. {partner} весь день {pm:был|была} в пункте, а потом о чём-то долго {pm:говорил|говорила} с Хенрике наедине.' },
      { when: own35('at', 'promise'), text: 'Ты обещал{m:|а} Тобиасу молчать.' },
      { text: 'Солнце садится за лес, красное, морозное. Тени от изгороди лежат через весь двор.' },
    ],
    actions: [
      { id: 'c35_ad_tell', label: 'Рассказать {partner.dat} про Тобиаса', when: flag('w.c35_tobias_offer'), minutes: 60, terminal: true, goto: 'c35_a_gift',
        text: 'Ты зовёшь {partner.acc} в сени и рассказываешь шёпотом. Про пятнадцатое. Про два места. {partner} слушает и не перебивает. Потом говорит: «Ты обещал{m:|а} молчать». И: «Хорошо, что не смолчал{m:|а}».', effects: [set35('ad', 'tell'), w35('told_tobias', true), until35(17, 0)] },
      { id: 'c35_ad_keep', label: 'Молчать, как обещал{m:|а}', when: flag('w.c35_tobias_offer'), minutes: 60, terminal: true, goto: 'c35_a_gift',
        text: 'Ты помогаешь Хенрике с картошкой и молчишь. {partner} смотрит на тебя через кухню. Видит, что ты что-то носишь в себе. Не спрашивает.', effects: [set35('ad', 'keep'), until35(17, 0)] },
      { id: 'c35_ad_army', label: 'Рассказать {partner.dat} про армию', when: flag('w.c35_army_known'), minutes: 60, terminal: true, goto: 'c35_a_gift',
        text: 'Ты рассказываешь шёпотом, в сенях: пятнадцатого армия уходит. Округ остаётся один. {partner} долго молчит.', effects: [set35('ad', 'army'), w35('told_tobias', true), until35(17, 0)] },
      { id: 'c35_ad_kasia', label: 'Посидеть с Касей', when: all(kasia35, not(any(flag('w.c35_tobias_offer'), flag('w.c35_army_known')))), minutes: 60, terminal: true, goto: 'c35_a_gift',
        text: 'Кася играет на гармошке Тима одну и ту же мелодию, три ноты. Ты слушаешь, пока не начинает получаться четвёртая.', effects: [set35('ad', 'kasia'), npc('kasia', 1), until35(17, 0)] },
      { id: 'c35_ad_wait', label: 'Ждать ужина', when: not(any(flag('w.c35_tobias_offer'), flag('w.c35_army_known'))), minutes: 60, terminal: true, goto: 'c35_a_gift',
        text: 'Ты сидишь у печи и смотришь, как Хенрике чистит картошку одной длинной лентой.', effects: [set35('ad', 'wait'), until35(17, 0)] },
    ] }),

  // ═════════════ B ═════════════
  X({ id: 'c35_b_point', title: 'Пункт', location: jest35, camp: jestCamp, ambient: hall35, onEnter: [until35(9, 30)],
    text: [
      { text: 'В пункте доктор Зандер считает ампулы. Увидев тебя, закрывает шкаф на ключ и зовёт в свой угол за ширмой.' },
      { when: okaforComes, text: 'Окафор уже там, на табурете, шапка в руках.' },
      { text: '— Die Kolonne nach Norden hat eine Schwester verloren. Krank. Sie brauchen Ersatz. Jemand, der Verbände wechseln und Fieber messen kann und nicht in Ohnmacht fällt. Zwei Wochen. Bis Ahrensburg und zurück.\n\nКолонна на север потеряла медсестру. Заболела. Нужна замена. Кто-то, кто умеет менять повязки, мерить температуру и не падает в обморок. Две недели. До Аренсбурга и обратно.' },
      { when: okaforComes, text: '— Ich gehe als Begleiter, — говорит Окафор. Я иду сопровождающим. — Aber eine Schwester nehmen sie nur mit Ausweis vom DRK. Den kann Frau Doktor ausstellen. Für Sie.\n\nНо медсестру берут только с удостоверением Красного Креста. Его может выписать доктор. Для вас.' },
      { when: flag('w.c32_merle_msg'), text: 'Сообщение, которое ты {m:передал|передала} из Винзена, дошло: на него ответили.' },
      { text: '— Und noch etwas, — говорит Зандер тише. И ещё. — Über das DRK kam heute eine Nachricht aus Ahrensburg. Von einer Frau, die nach Ihnen fragt. Merles Mutter. Insulin für zehn Tage. Dann nichts.\n\nЧерез Красный Крест сегодня пришло сообщение из Аренсбурга. От женщины, которая спрашивает о вас. Мама Мерле. Инсулина на десять дней. Потом ничего.' },
      { text: 'В пункте шумно: носят коробки, считают одеяла, кто-то плачет в задней комнате, и никто не останавливается, чтобы спросить почему.' },
      { when: v('$.c35_bs3', 'okafor'), text: 'Про Окафора ты {m:сказал|сказала} Хаазе честно. Тот записал фамилию в планшет и подчеркнул.' },
    ],
    actions: [
      { id: 'c35_bp_what', label: 'Спросить, что именно нужно будет делать', minutes: 60, terminal: true, goto: 'c35_b_radio',
        text: '— Verbände. Fieber. Spritzen, wenn ein Arzt sagt. Und die Leute ruhig halten, wenn der Lastwagen nachts steht und draußen was ist. — Зандер смотрит на тебя поверх очков. — Das können Sie. Ich hab Sie gesehen.\n\nПовязки. Температура. Уколы, если скажет врач. И держать людей спокойными, когда грузовик ночью стоит, а снаружи что-то есть. Вы это умеете. Я вас видела.', effects: [set35('bp', 'what'), w35('nurse_offer', true), until35(10, 0)] },
      { id: 'c35_bp_danger', label: 'Спросить, насколько это опасно', minutes: 60, terminal: true, goto: 'c35_b_radio',
        text: '— Gefährlicher als hier. Weniger gefährlich als zu Fuß. — Зандер пожимает плечами. — Eine Kolonne ist vor zwei Wochen nicht zurückgekommen. Die letzten zwei schon.\n\nОпаснее, чем здесь. Менее опасно, чем пешком. Одна колонна две недели назад не вернулась. Две последние — вернулись.', effects: [set35('bp', 'danger'), w35('nurse_offer', true), until35(10, 0)] },
      { id: 'c35_bp_partner', label: 'Сказать: мне надо поговорить с {partner.ins}', minutes: 45, terminal: true, goto: 'c35_b_radio',
        text: '— Natürlich. — Зандер кивает. Конечно. — Bis Mittwochabend. Dann brauche ich den Namen für den Ausweis.\n\nДо вечера среды. Потом мне нужно имя для удостоверения.', effects: [set35('bp', 'partner'), w35('nurse_offer', true), until35(10, 0)] },
      { id: 'c35_bp_yes', label: 'Сказать: я поеду', minutes: 45, terminal: true, goto: 'c35_b_radio',
        text: 'Зандер не улыбается. Она достаёт бланк, кладёт перед собой и говорит: «Ich schreibe ihn erst am Mittwoch. Bis dahin können Sie es sich anders überlegen». Я выпишу его только в среду. До тех пор вы можете передумать.', effects: [set35('bp', 'yes'), w35('nurse_offer', true), set35('b_said_yes', true), until35(10, 0)] },
    ] }),

  X({ id: 'c35_b_henrike', title: 'Хенрике', camp: kitchen14, onEnter: [until35(13, 0)],
    text: [
      { when: henrike35, text: 'Дома Хенрике ждёт тебя на кухне одна. Остальных она разослала: кого за дровами, кого к Уте. Наливает тебе чаю, себе — нет. Садится напротив.' },
      { when: henrike35, text: '— Ich weiß nicht, wohin ihr wollt. Ich frage auch nicht. Aber wenn ihr geht, sagt es mir vor dem Säen. Nicht danach.\n\nЯ не знаю, куда вы хотите. И не спрашиваю. Но если уйдёте, скажите мне до сева. Не после.' },
      { when: all(henrike35, oleHome33), text: '— Den Hof bekommt Ole. Und wer von euch bleibt — der auch. Das hab ich aufgeschrieben. Beim Pfarrer.\n\nХутор получит Оле. И тот из вас, кто останется, тоже. Я это записала. У пастора.' },
      { when: all(henrike35, oleDead), text: '— Ole ist nicht mehr. Den Hof bekommt, wer bleibt. Ihr. Das hab ich aufgeschrieben. Beim Pfarrer.\n\nОле больше нет. Хутор получит тот, кто останется. Вы. Я это записала. У пастора.' },
      { when: all(henrike35, v('w.c34_a_spring', 'yes')), text: '— Er hat gesagt, er kann pflügen. — Она смотрит в окно, на поле. — Ich habe es aufgeschrieben. Aber ich glaube es erst im März.\n\nОн сказал, что сможет пахать. Я записала. Но поверю только в марте.' },
      { when: all(henrike35, v('w.c34_a_spring', 'honest')), text: '— Er hat gesagt, er weiß nicht, ob ihr im März hier seid. — Она кивает сама себе. — Das war ehrlich. Deshalb frage ich dich jetzt.\n\nОн сказал, что не знает, будете ли вы здесь в марте. Это было честно. Поэтому я спрашиваю тебя сейчас.' },
      { when: not(henrike35), text: 'Дома тихо. Хенрике уехала в Йестебург к пастору и до вечера не вернётся. На столе записка её почерком: «Vor dem Säen. Nicht danach». До сева. Не после.' },
    ],
    actions: [
      { id: 'c35_bh_promise', label: 'Пообещать: до сева скажем', when: henrike35, minutes: 60, terminal: true, goto: 'c35_b_dusk',
        text: 'Хенрике кивает один раз, коротко. Потом встаёт и начинает мыть чистую посуду. Спиной к тебе.', effects: [set35('bh', 'promise'), w35('henrike_promise', true), npc('henrike', 2, 'c35_promised_spring'), until35(14, 30)] },
      { id: 'c35_bh_why', label: 'Спросить: почему нам?', when: henrike35, minutes: 60, terminal: true, goto: 'c35_b_dusk',
        text: '— Weil ihr geblieben seid, als ihr gehen konntet. — Она пожимает плечами. — Und weil ihr meine Hühner nicht gegessen habt, als ihr Hunger hattet. Die meisten hätten.\n\nПотому что вы остались, когда могли уйти. И потому что вы не съели моих кур, когда были голодны. Большинство бы съели.', effects: [set35('bh', 'why'), npc('henrike', 1), until35(14, 30)] },
      { id: 'c35_bh_hug', label: 'Обнять её', when: henrike35, minutes: 45, terminal: true, goto: 'c35_b_dusk',
        text: 'Хенрике каменеет на секунду. Потом гладит тебя по спине, неловко, как гладят чужого ребёнка, который вдруг оказался своим.', effects: [set35('bh', 'hug'), npc('henrike', 2), until35(14, 30)] },
      { id: 'c35_bh_note', label: 'Убрать записку в карман', when: not(henrike35), minutes: 30, terminal: true, goto: 'c35_b_dusk',
        text: 'Ты складываешь записку вчетверо. До сева. До сева четыре месяца.', effects: [set35('bh', 'note'), until35(14, 0)] },
    ] }),

  X({ id: 'c35_b_dusk', title: 'Сумерки', camp: yard14, ambient: frost35,
    text: [
      { text: 'Короткий день кончается. {partner} {pm:вернулся|вернулась} из Йестебурга после обеда и молчит больше обычного.' },
      { when: ninaFarm, text: 'Нина ходит за тобой хвостом, но ничего не спрашивает.' },
      { when: lea35, text: 'Лея колет лучину у сарая, ровно, как хирург.' },
      { when: ute35, text: 'Из колонии пришла Уте с носками для стариков, первыми двумя парами.' },
      { text: 'В доме зажигают лучину вместо лампы: керосин берегут на дорогу, для тех, кто поедет. Пахнет смолой. Тени на стенах дрожат.' },
    ],
    actions: [
      { id: 'c35_bd_tell', label: 'Рассказать {partner.dat} про колонну на север', minutes: 60, terminal: true, goto: 'c35_b_kasia',
        text: 'Ты рассказываешь в сенях: место медсестры, две недели, Аренсбург, десять дней инсулина. {partner} слушает и смотрит в пол. Потом говорит: «Ты уже {m:решил|решила}?» Ты не знаешь, что ответить.', effects: [set35('bd', 'tell'), w35('told_north', true), until35(15, 30)] },
      { id: 'c35_bd_nina', label: 'Взять Нину и пойти посмотреть на кур', when: ninaFarm, minutes: 60, terminal: true, goto: 'c35_b_kasia',
        text: 'В курятнике тепло и пахнет пылью и пером. Нина держит курицу на руках и говорит, глядя на неё, а не на тебя: «Ты вернёшься?» Ты говоришь: да. Она кивает курице.', effects: [set35('bd', 'nina'), npc('c7_nina', 2, 'c35_asked_return'), until35(15, 30)] },
      { id: 'c35_bd_lea', label: 'Помочь Лее с лучиной', when: lea35, minutes: 60, terminal: true, goto: 'c35_b_kasia',
        text: 'Лея колет, ты складываешь. Она говорит, не поднимая головы: «Wenn du nach Norden gehst — nimm mehr Handschuhe mit, als du denkst». Если пойдёшь на север — возьми больше перчаток, чем думаешь.', effects: [set35('bd', 'lea'), npc('c21_lea', 1), until35(15, 30)] },
      { id: 'c35_bd_ute', label: 'Помочь Уте разнести носки', when: ute35, minutes: 60, terminal: true, goto: 'c35_b_kasia', ambientDuring: frost35,
        text: 'Носки толстые, колючие, из шерсти фрау Хаберланд или своей. Петерсен надевает их сразу, поверх своих, и шевелит пальцами.', effects: [set35('bd', 'ute'), npc('c14_ute', 1), until35(15, 30)] },
    ] }),
];
