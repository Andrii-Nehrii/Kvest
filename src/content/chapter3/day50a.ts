import type { Scene } from '../../engine/content-types';
import type { Effect } from '../../engine/types';
import { all, flag } from './world3';
import {
  S50, bite50, clean50, door50, jest50, ny50, rain50, rocketsLoud50, set50, slip50, trip50, w50,
} from './point50';
import { brandtHigh, brandtLow } from './standing';

// Участок 50, линия A. Первое утро года: площадь после огня, Брандт (что было ночью и почему), дорога домой мимо колонии.
const X = (scene: Omit<Scene, 'for' | 'chapter'>): Scene => S50({ ...scene, for: 'any', chapter: 'ch3' });
const toFarm: Effect = { move: 'hof_luedemann' };
const toJest: Effect = { move: jest50 };

export const day50AScenes: Scene[] = [
  X({ id: 'c50_na_square', title: 'Площадь после огня', location: jest50, camp: trip50(jest50), ambient: rain50,
    text: [
      { text: 'Площадь у пожарной части в десять утра: чёрный круг на месте кучи, из него под дождём поднимается пар. Лавки перевёрнуты, котёл пустой, в луже плавает бумажный колпак.' },
      { text: 'Брандт с двумя дружинниками ходит по краю площади с блокнотом. Он не спал: это видно по тому, как он держит карандаш.' },
      { when: rocketsLoud50, text: 'У гаража валяются три обгоревших хвоста от ракет. Их никто не убирает. Брандт обходит их стороной, как улики.' },
    ],
    actions: [
      { id: 'c50_ns_clean', label: 'Собрать лавки и отнести их обратно в школу', minutes: 45, terminal: true, goto: 'c50_na_brandt', ambientDuring: rain50, activity: 'moderate',
        text: 'Лавки тяжёлые от воды. Ты носишь их вдвоём с мальчишкой из Йестебурга, который пришёл помогать сам. Двенадцать лавок, двенадцать ходок. На последней мальчишка говорит: «Das war das beste Silvester». Это был лучший Сильвестр. Ему лет десять.', effects: [set50('ns', 'clean'), { body: 'fatigue', delta: 4 }, toJest, ny50(10, 45)] },
      { id: 'c50_ns_count', label: 'Подойти к Брандту и помочь считать', minutes: 45, terminal: true, goto: 'c50_na_brandt', ambientDuring: rain50,
        text: 'Брандт протягивает тебе блокнот: списки постов, кто стоял, кто ушёл раньше, кто не пришёл домой. В последней графе — пусто или одна фамилия. Вы проверяете вдвоём каждую строчку.', effects: [set50('ns', 'count'), w50('a_counted_night', true), toJest, ny50(10, 45)] },
      { id: 'c50_ns_pot', label: 'Отмыть котёл от супа, пока не присох', minutes: 45, terminal: true, goto: 'c50_na_brandt', ambientDuring: rain50,
        text: 'Котёл на двести литров, щётка, дождевая вода. Жена Брандта приносит кипяток и молча помогает. На дне — луковая шелуха хутора Людеманов. Ты отскребаешь её последней.', effects: [set50('ns', 'pot'), toJest, ny50(10, 45)] },
    ] }),

  X({ id: 'c50_na_brandt', title: 'Брандт', location: jest50, camp: trip50(jest50), ambient: rain50,
    text: [
      { when: clean50, text: 'Брандт закрывает блокнот. «Zwei an der Kiesgrube. Keiner verletzt. Keiner». Двое у карьера. Никто не ранен. Никто. Он повторяет «keiner» ещё раз, тише, как будто проверяет, правда ли.' },
      { when: slip50, text: 'Брандт говорит сквозь зубы: четверо вышли на ракеты, троих взяли у карьера, четвёртый дошёл до колонии. «Wegen drei Raketen». Из-за трёх ракет. Он смотрит в сторону дома Лукаса.' },
      { when: all(rocketsLoud50, flag('w.c47_rockets_taken')), text: '— Die Kiste hab ich ihm am Sonntag weggenommen. Die drei hatte er woanders. — Брандт смотрит в блокнот. — Коробку я у него в воскресенье забрал. А эти три он держал в другом месте.' },
      { when: door50, text: 'Брандт говорит: один вышел к колонии, но двери были заперты. «Gut, dass die es wussten». Хорошо, что они знали. Про карьер он узнал поздно и знает, что поздно.' },
      { when: bite50, text: 'Брандт молчит долго. Потом говорит одно слово: «Willi». И ещё: «Ich hab die Kiesgrube nicht gekannt. Keiner hat mir was gesagt». Я не знал про карьер. Никто мне не сказал.' },
      { when: brandtLow, text: 'С вашим двором он говорит последним и коротко. За месяц вы не раз шли ему поперёк, и он этого не забыл.' },
    ],
    actions: [
      { id: 'c50_nbr_pit', label: 'Предложить: карьер — пост до весны, по дворам', minutes: 60, terminal: true, goto: 'c50_na_road', ambientDuring: rain50,
        text: 'Брандт слушает, кивает, записывает. «Jeder Hof eine Nacht pro Woche. Auch eurer». Каждый двор по ночи в неделю. И ваш тоже. Ты понимаешь, что этой ночью предложил{m:|а} себе работу на всю весну.', effects: [set50('nbr', 'pit'), w50('a_pit_plan', true), ny50(11, 45)] },
      { id: 'c50_nbr_lukas', label: 'Заступиться за Лукаса', when: rocketsLoud50, minutes: 60, terminal: true, goto: 'c50_na_road', ambientDuring: rain50,
        text: 'Брандт смотрит на тебя тяжело. «Er ist sechzehn. Mit sechzehn macht man so was. Mit sechzehn muss man dafür auch geradestehen». Ему шестнадцать. В шестнадцать такое делают. В шестнадцать за это и отвечают. Но голос у него уже не такой злой.', effects: [set50('nbr', 'lukas'), w50('a_defended_lukas', true), ny50(11, 45)] },
      { id: 'c50_nbr_fire', label: 'Сказать: огонь был нужен, несмотря ни на что', minutes: 60, terminal: true, goto: 'c50_na_road', ambientDuring: rain50,
        text: 'Брандт поднимает глаза от блокнота. Долго смотрит. Потом говорит: «Danke». И больше ничего. Но в блокноте рядом с твоей фамилией появляется галочка.', effects: [set50('nbr', 'fire'), w50('a_backed_brandt', true), ny50(11, 45)] },
      { id: 'c50_nbr_diesel', label: 'Попросить у Брандта солярки на январь', when: brandtHigh, minutes: 60, terminal: true, goto: 'c50_na_road', ambientDuring: rain50,
        text: 'Брандт долго молчит, потом пишет в блокноте записку для склада: двадцать литров. «Für euren Hof. Ihr habt mehr getan, als ihr musstet». Для вашего двора. Вы сделали больше, чем были должны. Отдаёт записку и отворачивается, пока ты не стал{m:|а} благодарить.', effects: [set50('nbr', 'diesel'), w50('brandt_diesel', true), ny50(11, 45)] },
      { id: 'c50_nbr_quiet', label: 'Ничего не говорить, просто постоять рядом', minutes: 60, terminal: true, goto: 'c50_na_road', ambientDuring: rain50,
        text: 'Вы стоите под дождём у чёрного круга. Брандт курит, первый раз на твоей памяти. Говорит, что бросил десять лет назад. Докуривает до фильтра и бросает окурок в угли.', effects: [set50('nbr', 'quiet'), ny50(11, 45)] },
    ] }),

  X({ id: 'c50_na_road', title: 'Мимо колонии', location: 'c15_garden', camp: trip50('c15_garden'), ambient: rain50,
    text: [
      { text: 'Домой ты идёшь через колонию, по раскисшей тропе вдоль насыпи.' },
      { when: bite50, text: 'За крайними домиками двое копают в мокрой земле. Уте стоит рядом с лопатой в руках и не копает. Синяя шапка висит на колышке забора.' },
      { when: door50, text: 'На двери крайнего домика — глубокие царапины и грязные отпечатки ладоней, до самой ручки. Хозяйка трёт их тряпкой и не может оттереть.' },
      { when: slip50, text: 'Яннес сидит на крыльце в куртке с зашитым рукавом и курит. Кивает тебе, как после смены.' },
      { when: clean50, text: 'У карьера поднимается дым: двоих с ночи жгут на старых шпалах. В колонии по-праздничному тихо, дети бегают по лужам.' },
    ],
    actions: [
      { id: 'c50_nrd_help', label: 'Остановиться и помочь', minutes: 45, terminal: true, goto: 'c50_ny_lunch', ambientDuring: rain50,
        text: 'Ты помогаешь, чем можно: лопата, тряпка, вёдра. Работаете молча. Потом кто-то говорит тебе «danke» и «frohes Neues» в одном предложении, и это не кажется странным.', effects: [set50('nrd', 'help'), { body: 'fatigue', delta: 4 }, toFarm, ny50(12, 30)] },
      { id: 'c50_nrd_jannes', label: 'Посидеть с Яннесом минуту', minutes: 45, terminal: true, goto: 'c50_ny_lunch', ambientDuring: rain50,
        text: 'Яннес говорит мало. «Ich hab es gehört, bevor ich es gesehen hab. Das Schlurfen». Я услышал раньше, чем увидел. Шарканье. Он теперь будет слышать это во сне. Ты тоже, наверное.', effects: [set50('nrd', 'jannes'), toFarm, ny50(12, 30)] },
      { id: 'c50_nrd_home', label: 'Идти домой, не останавливаясь', minutes: 30, terminal: true, goto: 'c50_ny_lunch', ambientDuring: rain50,
        text: 'Ты киваешь всем и идёшь дальше. Под ногами чавкает. До хутора ты доходишь мокрым до колен.', effects: [set50('nrd', 'home'), toFarm, ny50(12, 15)] },
    ] }),
];
