import React, { useState, useEffect } from 'react';

const App = () => {
  const [theme, setTheme] = useState('dark');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [currentPage, setCurrentPage] = useState(1);

  // Товары
  const products = [
    { id: 1, name: "iPhone 15 Pro", price: 89990, category: "Телефоны", image: "https://placehold.co/400x400?text=iPhone+15+Pro " },
    { id: 2, name: "MacBook Air M3", price: 119990, category: "Ноутбуки", image: "https://placehold.co/400x400?text=MacBook+Air+M3 " },
    { id: 3, name: "iPad Pro", price: 69990, category: "Планшеты", image: "https://placehold.co/400x400?text=iPad+Pro " }
  ];

  // Баннеры акций
  const banners = [
    {
      title: "Новинки уже здесь!",
      text: "Скидки до 15%",
      bg: "bg-gradient-to-r from-cyan-900 via-blue-950 to-cyan-950"
    }
  ];

  // Определение темы Telegram WebApp
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tgTheme = window.Telegram.WebApp.themeParams;
      setTheme(tgTheme.bg_color ? 'dark' : 'light');
    }
  }, []);

  // Фильтрация товаров
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Все' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleContact = (product) => {
    const message = encodeURIComponent(`Здравствуйте! Хочу купить: ${product.name} за ${product.price}₽`);
    const botUsername = 'your_bot_username'; // ← замените на ваш бот
    window.open(`https://t.me/ ${botUsername}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Заголовок */}
      <div className="text-center mb-6 pt-6 px-4">
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
          className={`w-full px-4 py-2 rounded-lg shadow-sm ${
            theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white text-black'
          } border focus:outline-none focus:ring-2 focus:ring-cyan-500`}
        />
      </div>

      {/* Категории */}
      <div className="flex overflow-x-auto space-x-2 pb-2 mb-6 px-4 no-scrollbar">
        {['Все', 'Телефоны', 'Ноутбуки', 'Часы'].map((category, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedCategory(category);
              setCurrentPage(1);
            }}
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

      {/* Товары */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="bg-gray-900 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg border border-cyan-500"
          >
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="font-semibold text-lg">{product.name}</h2>
              <p className="text-sm opacity-70 mt-1">от {product.price.toLocaleString()} ₽</p>
              <button
                onClick={() => handleContact(product)}
                className="mt-3 w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-md transition"
              >
                Связаться
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;