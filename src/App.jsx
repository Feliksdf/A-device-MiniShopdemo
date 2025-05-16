import React, { useState, useEffect } from 'react';

const App = () => {
  const [theme, setTheme] = useState('dark');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Определение темы Telegram WebApp
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tgTheme = window.Telegram.WebApp.themeParams;
      setTheme(tgTheme.bg_color ? 'dark' : 'light');
    }
  }, []);

  // Загрузка товаров и баннеров
  useEffect(() => {
    fetch('/products.json')
      .then(res => res.json())
      .then(data => {
        setBanners(data.banners || []);
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки:', err);
        setBanners([]);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  // Фильтрация товаров
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Все' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Кнопка связи через Telegram
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
        {['Все', 'Телефоны', 'Ноутбуки', 'Планшеты', 'Часы', 'Наушники', 'Аксессуары'].map((category, index) => (
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
        {banners.map((banner, index) => (
          <div key={index} className={`${banner.bg} rounded-xl shadow-md p-4 text-white`}>
            <h2 className="text-lg font-semibold">{banner.title}</h2>
            <p className="text-sm opacity-90 mt-1">{banner.text}</p>
          </div>
        ))}
      </div>

      {/* Товары */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
        {loading ? (
          <p className="col-span-full text-center py-8 opacity-70">⏳ Загрузка...</p>
        ) : filteredProducts.length > 0 ? (
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