import type { Scene } from '../../engine/content-types';
import { flag, not } from './world3';
import { v } from './point18';
import { S27, set27, snow27, until27, w27 } from './point27';

// Участок 27, переделка (REWORK_PLAN.md, этап 2): семенная картошка КТ26. При обмене A везёт два ящика «Saat» фрау Тимм
// в Люллау; у неё ушёл работник, и она предлагает другую сделку (`w.c27_timm_deal` hands/plain/hay) — отклики до 34-й.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S27({ ...scene, for: 'any', chapter: 'ch3' });
const lullau = 'c26_lullau';
const tractor = flag('w.c16_tractor');

export const day27SScenes: Scene[] = [
  X({ id: 'c27_sd_timm', title: 'Два ящика', location: lullau, camp: { at: lullau, stock: 'c3_farm_stock', rest: false }, safe: false, ambient: snow27,
    text: [
      { when: tractor, text: 'Два ящика с надписью «Saat» ты ставишь в тележку трактора и укрываешь мешковиной, чтобы не прихватило морозом. Двадцать пять килограммов каждый. До Люллау три километра.' },
      { when: not(tractor), text: 'Два ящика с надписью «Saat» ты привязываешь к саням и укрываешь мешковиной. Двадцать пять килограммов каждый. До Люллау три километра по снегу, и сани всё время тянет в колею.' },
      { text: 'Фрау Тимм встречает во дворе с амбарной книгой под мышкой. Снимает мешковину, берёт клубень из верхнего слоя, разламывает, нюхает срез. Берёт второй, из-под низу.\n\n— Gut. Henrike hatte immer gute Saat.\n\nХорошо. У Хенрике всегда была хорошая семенная.' },
      { text: 'Она закрывает книгу и смотрит на тебя, как смотрят на работника на ярмарке.\n\n— Heiner ist weg. Seit Montag. Nach Hamburg, zu seiner Frau. Zwanzig Kühe, und ich habe zwei Hände. Milch kriegt ihr, wie abgemacht. Aber wenn einer von euch zweimal die Woche um fünf zum Melken kommt — doppelt Milch. Und beim Schlachten ein Viertel Schwein.\n\nХайнер ушёл. С понедельника. В Гамбург, к жене. Двадцать коров, а рук у меня две. Молоко вы получите, как договорились. Но если кто-то из вас два раза в неделю будет приходить к пяти утра доить — молока вдвое. И когда буду резать, четверть свиньи.' },
      { when: v('w.c25_road', 'letter'), text: 'Из окна кухни на тебя смотрит мальчишка, внук, которого позавчера привезли из Паттензена. Машет варежкой.' },
    ],
    actions: [
      { id: 'c27_sd_hands', label: 'Согласиться: два утра в неделю — дойка', minutes: 120, terminal: true, goto: 'c27_a_broth',
        text: '— Dienstag und Freitag. Um fünf, nicht um halb sechs.\n\nВторник и пятница. В пять, не в половине шестого.\n\nОна ведёт тебя в доильню и показывает аппарат, который без тока стоит мёртвым, и скамеечки, на которых теперь доят руками. Двадцать коров вдвоём — это два часа. На прощание она наливает тебе бидон, четыре литра, тёплого, с пенкой.',
        effects: [set27('sd', 'hands'), w27('timm_deal', 'hands'), { place: 'c26_milk', at: 'c3_farm_stock', qty: 4 }, { body: 'fatigue', delta: 3 }, until27(13, 0)] },
      { id: 'c27_sd_plain', label: 'Оставить как договорились: ящики за молоко и мясо', minutes: 100, terminal: true, goto: 'c27_a_broth',
        text: 'Фрау Тимм пожимает плечами.\n\n— Wie ihr wollt. Milch jeden dritten Tag, am Tor. Fleisch, wenn ich schlachte.\n\nКак хотите. Молоко каждый третий день, у ворот. Мясо, когда буду резать.\n\nОна наливает два литра в твою флягу и уходит в хлев, не прощаясь. Двадцать коров не ждут.',
        effects: [set27('sd', 'plain'), w27('timm_deal', 'plain'), { place: 'c26_milk', at: 'c3_farm_stock', qty: 2 }, until27(12, 50)] },
      { id: 'c27_sd_hay', label: 'Попросить вместо мяса сено для коровы Хенрике', minutes: 100, terminal: true, goto: 'c27_a_broth',
        text: '— Heu? — Она прищуривается. — Henrike hat zu wenig Heu? Das sagt sie keinem. — Пауза. — Gut. Zwei Fuhren. Holt es selbst, Heiner fährt ja nicht mehr.\n\nСено? У Хенрике мало сена? Она никому не скажет. Хорошо. Два воза. Забирайте сами, Хайнер ведь больше не ездит.\n\nДомой ты везёшь два литра молока и знание, о котором Хенрике не просила.',
        effects: [set27('sd', 'hay'), w27('timm_deal', 'hay'), { place: 'c26_milk', at: 'c3_farm_stock', qty: 2 }, until27(12, 50)] },
    ] }),
];
