import React, { useState, useEffect } from 'react';

const App = () => {
  const [theme, setTheme] = useState('dark');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);

  // Fallback данные (на случай, если JSON не загрузится)
  const fallbackData = {
    banners: [
      {
        title: "Новинки уже здесь!",
        text: "Скидки до 15% на iPhone 15 серии",
        bg: "bg-gradient-to-r from-cyan-900 via-blue-950 to-cyan-950"
      },
      {
        title: "Рассрочка 0%",
        text: "На всю технику Apple",
        bg: "bg-gradient-to-r from-teal-900 via-black to-teal-950"
      }
    ],
    products: [
      {
        id: 1,
        name: "iPhone 14 Pro max 128gb",
        price: 89990,
        category: "Телефоны",
        image: "https://placehold.co/400x400?text=iPhone+15+Pro "
      },
      {
        id: 2,
        name: "MacBook Air M3",
        price: 119990,
        category: "Ноутбуки",
        image: "https://placehold.co/400x400?text=MacBook+Air+M3 "
      },
      {
        id: 3,
        name: "iPad Pro",
        price: 69990,
        category: "Планшеты",
        image: "https://placehold.co/400x400?text=iPad+Pro "
      },
      {
        id: 4,
        name: "Apple Watch Ultra",
        price: 49990,
        category: "Часы",
        image: "https://placehold.co/400x400?text=Watch+Ultra "
      }
    ]
  };

  // Определение темы Telegram WebApp
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tgTheme = window.Telegram.WebApp.themeParams;
      setTheme(tgTheme.bg_color ? 'dark' : 'light');
    }
  }, []);

  // Загрузка товаров из JSON
  useEffect(() => {
    fetch('/products.json')
      .then(res => res.json())
      .then(data => {
        setBanners(data.banners || fallbackData.banners);
        setProducts(data.products || fallbackData.products);
      })
      .catch(err => {
        console.error('Ошибка загрузки JSON:', err);
        setBanners(fallbackData.banners);
        setProducts(fallbackData.products);
      });
  }, []);
  
  // Категории
  const categories = ['Все', 'Телефоны', 'Ноутбуки', 'Планшеты', 'Часы', 'Наушники', 'Аксессуары'];

  // Фильтрация товаров
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Все' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Обработчик связи через Telegram
  const handleContact = (product) => {
    const message = encodeURIComponent(`Здравствуйте! Хочу купить: ${product.name} за ${product.price}₽`);
    window.open(`https://t.me/feliksdf?text= ${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Заголовок магазина */}
      <div className="text-center mb-6 pt-6">
        <h1 className="text-3xl font-bold">A-Device</h1>
        <p className="opacity-70 mt-1">Оригинальная техника Apple и аксессуары</p>
      </div>

      {/* Поиск */}
      <div className="mb-6 px-4 max-w-3xl mx-auto w-full">
        <input
          type="text"
          placeholder="Поиск товаров..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg shadow-sm bg-gray-900 border-gray-700 border focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {/* Категории */}
      <div className="flex overflow-x-auto space-x-2 pb-2 mb-6 no-scrollbar px-4">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-cyan-500 text-black'
                : 'bg-gray-900 hover:bg-gray-800 text-white'
            } transition`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Баннеры акций */}
      <div className="mb-8 px-4 max-w-4xl mx-auto space-y-4">
        {banners.length > 0 ? (
          banners.map((banner, index) => (
            <div key={index} className={`${banner.bg} rounded-xl shadow-md p-4 text-white`}>
              <h2 className="text-lg font-semibold">{banner.title}</h2>
              <p className="text-sm opacity-90 mt-1">{banner.text}</p>
            </div>
          ))
        ) : (
          <p className="text-center opacity-70">Баннеры не найдены</p>
        )}
      </div>

      {/* Товары */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-gray-900 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="font-semibold text-lg">{product.name}</h2>
                <p className="text-sm opacity-70 mt-1">от {product.price.toLocaleString()} ₽</p>
                <button
                  onClick={() => handleContact(product)}
                  className="mt-3 w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-black rounded-md transition"
                >
                  Связаться
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center py-8 opacity-70">🔍 Товары не найдены</p>
        )}
      </div>
    </div>
  );
};

export default App;