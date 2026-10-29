// Каталог предметов беты. Вес — граммы за единицу, калорийность — на единицу.
import type { ItemType } from '../engine/content-types';

const list: ItemType[] = [
  // Вода и еда
  { id: 'water_05', name: 'вода, бутылка 0,5 л', weight: 520, tags: ['drink'], food: { thirst: 22 } },
  { id: 'water_15', name: 'вода, бутылка 1,5 л', weight: 1550, tags: ['drink'], food: { thirst: 60 } },
  { id: 'water_l', name: 'вода, литр (канистра/ёмкость)', weight: 1000, tags: ['water_bulk'] },
  { id: 'bread', name: 'хлеб, полбуханки', weight: 400, tags: ['food', 'staple'], food: { hunger: 30, kcal: 1000, minutes: 10 }, spoilsAfter: 4 * 1440 },
  { id: 'sandwich', name: 'бутерброд', weight: 180, tags: ['food'], food: { hunger: 18, kcal: 450, minutes: 5 }, spoilsAfter: 1440 },
  { id: 'canned_ravioli', name: 'консервы, равиоли 800 г', weight: 850, tags: ['food', 'staple', 'reserve'], food: { hunger: 40, thirst: -3, kcal: 650, minutes: 15 } },
  { id: 'canned_beans', name: 'консервы, фасоль 400 г', weight: 430, tags: ['food', 'staple', 'reserve'], food: { hunger: 25, kcal: 350, minutes: 10 } },
  { id: 'canned_tomatoes', name: 'консервы, томаты 400 г', weight: 430, tags: ['food', 'staple'], food: { hunger: 8, thirst: 6, kcal: 90, minutes: 5 } },
  { id: 'pasta', name: 'макароны, 500 г', weight: 500, tags: ['food', 'staple', 'needs_cooking'], food: { kcal: 1800 } },
  { id: 'rice', name: 'рис, 1 кг', weight: 1000, tags: ['food', 'staple', 'needs_cooking'], food: { kcal: 3600 } },
  { id: 'oats', name: 'овсяные хлопья, 500 г', weight: 500, tags: ['food', 'staple'], food: { hunger: 20, kcal: 1850, minutes: 10 } },
  { id: 'crackers', name: 'хлебцы, пачка', weight: 250, tags: ['food', 'staple'], food: { hunger: 15, thirst: -4, kcal: 950, minutes: 5 } },
  { id: 'apple', name: 'яблоко', weight: 180, tags: ['food'], food: { hunger: 5, thirst: 4, kcal: 90, minutes: 3 }, spoilsAfter: 14 * 1440 },
  { id: 'chocolate', name: 'шоколад, плитка 100 г', weight: 100, tags: ['food', 'reserve'], food: { hunger: 10, kcal: 540, minutes: 3 } },
  { id: 'eggs', name: 'яйца, 6 шт.', weight: 380, tags: ['food', 'needs_cooking'], food: { kcal: 470 }, spoilsAfter: 10 * 1440 },
  { id: 'milk', name: 'молоко, 1 л', weight: 1040, tags: ['food', 'drink'], food: { hunger: 8, thirst: 25, kcal: 640, minutes: 3 }, spoilsAfter: 3 * 1440 },
  { id: 'coffee', name: 'кофе молотый, 250 г', weight: 250, tags: ['comfort'] },
  { id: 'potatoes', name: 'картофель, кг', weight: 1000, tags: ['food', 'staple', 'needs_cooking'], food: { kcal: 770 }, spoilsAfter: 60 * 1440 },

  // Связь и свет
  { id: 'phone', name: 'смартфон', weight: 200, tags: ['phone'], battery: { drainPerHour: 14, idleDrainPerHour: 1.6 } },
  { id: 'charger', name: 'зарядка с кабелем', weight: 70, tags: ['charger'] },
  { id: 'powerbank', name: 'пауэрбанк 10 000 мА·ч', weight: 220, tags: ['powerbank'], battery: { drainPerHour: 0, idleDrainPerHour: 0.05 } },
  { id: 'flashlight', name: 'фонарик', weight: 160, tags: ['light'], battery: { drainPerHour: 12, idleDrainPerHour: 0 } },
  { id: 'batteries_aa', name: 'батарейки AA, 4 шт.', weight: 100, tags: ['batteries'] },
  { id: 'candles', name: 'свечи, 3 шт.', weight: 150, tags: ['light'] },
  { id: 'lighter', name: 'зажигалка', weight: 20, tags: ['fire'] },
  { id: 'radio', name: 'радиоприёмник на батарейках', weight: 350, tags: ['radio'], battery: { drainPerHour: 2, idleDrainPerHour: 0 } },

  // Медицина
  { id: 'first_aid', name: 'автомобильная аптечка (бинты)', weight: 450, tags: ['dressing'], medical: { treats: 'basic', uses: 4 } },
  { id: 'plasters', name: 'пластыри и марля', weight: 60, tags: ['dressing'] },
  { id: 'disinfectant', name: 'антисептик для ран', weight: 130, tags: ['antiseptic'], battery: { drainPerHour: 0, idleDrainPerHour: 0 } },
  { id: 'ibuprofen', name: 'ибупрофен 400 мг, доза', weight: 2, tags: ['painkiller'] },
  { id: 'paracetamol', name: 'парацетамол 500 мг, доза', weight: 2, tags: ['painkiller'] },
  { id: 'insulin_pen', name: 'инсулиновая ручка', weight: 30, tags: ['medicine', 'needs_cold'], description: 'Одна ручка — примерно на 3 дня. Без холода портится за несколько недель, в тепле — быстрее.' },

  // Одежда (утепление по слотам, защита от укуса)
  { id: 'hoodie', name: 'худи', weight: 600, tags: ['clothing'], clothing: { warmth: 1.5, biteProtection: 1, slot: 'outer' } },
  { id: 'winter_jacket', name: 'зимняя куртка', weight: 1400, tags: ['clothing'], clothing: { warmth: 4, biteProtection: 2, slot: 'outer' } },
  { id: 'rain_jacket', name: 'дождевик', weight: 350, tags: ['clothing', 'waterproof'], clothing: { warmth: 1, biteProtection: 0.5, slot: 'outer' } },
  { id: 'jeans', name: 'джинсы', weight: 700, tags: ['clothing'], clothing: { warmth: 1.5, biteProtection: 2, slot: 'legs' } },
  { id: 'boots', name: 'ботинки', weight: 1300, tags: ['clothing'], clothing: { warmth: 1.5, biteProtection: 2, slot: 'feet' } },
  { id: 'sneakers', name: 'кроссовки', weight: 700, tags: ['clothing'], clothing: { warmth: 0.5, biteProtection: 0.5, slot: 'feet' } },
  { id: 'gloves', name: 'перчатки', weight: 120, tags: ['clothing'], clothing: { warmth: 1, biteProtection: 1, slot: 'hands' } },
  { id: 'beanie', name: 'шапка', weight: 80, tags: ['clothing'], clothing: { warmth: 1, biteProtection: 0, slot: 'head' } },

  // Инструменты и прочее
  { id: 'backpack', name: 'рюкзак 30 л', weight: 900, tags: ['bag'] },
  { id: 'kitchen_knife', name: 'кухонный нож', weight: 150, tags: ['tool', 'blade'] },
  { id: 'multitool', name: 'мультитул', weight: 240, tags: ['tool'] },
  { id: 'hammer', name: 'молоток', weight: 600, tags: ['tool', 'blunt'] },
  { id: 'duct_tape', name: 'армированный скотч', weight: 200, tags: ['repair'] },
  { id: 'rope', name: 'верёвка, 10 м', weight: 500, tags: ['tool'] },
  { id: 'trash_bags', name: 'мешки для мусора, рулон', weight: 300, tags: ['cloth', 'waterproof'] },
  { id: 'towel', name: 'полотенце', weight: 400, tags: ['cloth'] },
  { id: 'cash_eur', name: 'наличные, €', weight: 1, tags: ['money'] },
  { id: 'bank_card', name: 'банковская карта', weight: 5, tags: ['card'] },
  { id: 'keys_home', name: 'ключи от квартиры', weight: 60, tags: ['keys'] },
  { id: 'car_keys', name: 'ключи от машины', weight: 40, tags: ['keys'] },

  // Глава 1: то, что можно найти, купить или получить в первый день
  { id: 'nitrile_gloves', name: 'одноразовые перчатки, пара', weight: 10, tags: ['ppe'] },
  { id: 'bandages', name: 'бинты и стерильные салфетки', weight: 120, tags: ['dressing'], medical: { treats: 'basic', uses: 3 } },
  { id: 'road_map', name: 'бумажная карта области', weight: 120, tags: ['map'] },
  { id: 'city_map', name: 'бумажный план Гамбурга', weight: 80, tags: ['map'] },
  { id: 'leaflet', name: 'листовка из больницы', weight: 5, tags: ['paper'],
    description: '«Hinweise für Angehörige»: избегайте контакта с кровью и слюной людей с высокой температурой, спутанностью или агрессией; при укусе — промыть рану и позвонить 112; не привозить таких больных без предупреждения.' },
  { id: 'headlamp', name: 'налобный фонарик', weight: 90, tags: ['light'], battery: { drainPerHour: 10, idleDrainPerHour: 0 } },
  { id: 'cooler_bag', name: 'термосумка с аккумулятором холода', weight: 400, tags: ['cooler'] },
  { id: 'bike_pump', name: 'велосипедный насос', weight: 300, tags: ['tool'] },
  { id: 'bike_helmet', name: 'велошлем Мерле', weight: 300, tags: ['clothing'], clothing: { warmth: 0.5, biteProtection: 1, slot: 'head' } },
  { id: 'health_card', name: 'страховая карточка Мерле', weight: 5, tags: ['card'] },
  { id: 'pen_needles', name: 'иглы для шприц-ручек, упаковка', weight: 40, tags: ['medicine'] },
  { id: 'okafor_key', name: 'ключ Окафора (брелок-рыбка)', weight: 20, tags: ['keys'] },
  { id: 'kerem_note', name: 'записка Керема для Дениза', weight: 2, tags: ['paper'] },

  // Транспорт и топливо
  { id: 'opel_corsa', name: 'Opel Corsa (2011, бензин)', weight: 1100000, tags: ['vehicle'], vehicle: { fuel: 'petrol', tankL: 45, per100km: 6.4, seats: 5, cargoL: 285 } },
  { id: 'bicycle', name: 'велосипед', weight: 14000, tags: ['bike'] },
  { id: 'can_petrol_10', name: 'канистра для бензина 10 л', weight: 900, tags: ['fuel_can'], fuelCan: { fuel: 'petrol', capacityL: 10 } },
  { id: 'can_diesel_20', name: 'канистра для дизеля 20 л', weight: 1600, tags: ['fuel_can'], fuelCan: { fuel: 'diesel', capacityL: 20 } },
  { id: 'firewood', name: 'дрова, кг', weight: 1000, tags: ['firewood'] },
];

export const items: Record<string, ItemType> = Object.fromEntries(list.map((i) => [i.id, i]));
