/*
  КАТАЛОГ SOLVANTA — редактируйте товары в массиве PRODUCTS ниже.
  price указывается числом в рублях.
  image — ссылка на фото (можно оставить пустой строкой).
  category: "Панели", "Инверторы", "Аккумуляторы", "Комплектующие", "Комплекты".
  ВАЖНО: замените TELEGRAM_USERNAME на username своего Telegram без символа @.
*/
const TELEGRAM_USERNAME = "islyamdrrrr";

const PRODUCTS = [
  {
    id: "panel-550",
    name: "Солнечная панель 550 Вт",
    category: "Панели",
    price: 12500,
    description: "Монокристаллический модуль для солнечной электростанции.",
    specs: ["550 Вт", "Монокристалл"],
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "inverter-5kw",
    name: "Гибридный инвертор 5 кВт",
    category: "Инверторы",
    price: 68500,
    description: "Для домашних систем с возможностью подключения аккумулятора.",
    specs: ["5 кВт", "Гибридный"],
    image: "https://e-solarpower.ru/images/detailed/7/Sila_vp_5000mh.jpg"
  },
  {
    id: "battery-5kwh",
    name: "Аккумулятор LiFePO₄ 5 кВт·ч",
    category: "Аккумуляторы",
    price: 79000,
    description: "Система хранения энергии для резервного питания.",
    specs: ["5 кВт·ч", "LiFePO₄"],
    image: "https://images.unsplash.com/photo-1594818379496-da1e345b0ded?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "cable-6mm",
    name: "Солнечный кабель 6 мм²",
    category: "Комплектующие",
    price: 95,
    description: "Кабель для подключения компонентов солнечной системы.",
    specs: ["6 мм²", "Цена за метр"],
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=80"
  }
];

// Эти позиции — демонстрационные примеры, не подтверждённые реальные цены.
// Перед публикацией замените их на свои товары, фотографии и актуальные цены.
