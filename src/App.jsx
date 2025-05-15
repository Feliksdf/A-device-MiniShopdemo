import React, { useState, useEffect } from 'react';

const App = () => {
  const [theme, setTheme] = useState('light');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  // Моковые данные категорий
  const categories = ['Все', 'Телефоны', 'Ноутбуки', 'Планшеты', 'Часы', 'Наушники', 'Аксессуары'];

  // Моковые данные товаров
  const products = [
    { id: 1, name: "iPhone 15 Pro", price: 89990, category: "Телефоны", image: "https://placehold.co/400x400?text=iPhone+15+Pro " },
    { id: 2, name: "MacBook Air M3", price: 119990, category: "Ноутбуки", image: "https://placehold.co/400x400?text=MacBook+Air+M3 " },
    { id: 3, name: "iPad Pro", price: 69990, category: "Планшеты", image: "https://placehold.co/400x400?text=iPad+Pro " },
    { id: 4, name: "Apple Watch Ultra", price: 49990, category: "Часы", image: "https://placehold.co/400x400?text=Watch+Ultra " },
    { id: 5, name: "AirPods Max", price: 29990, category: "Наушники", image: "https://placehold.co/400x400?text=AirPods+Max " },
    { id: 6, name: "PowerBank 20000mAh", price: 2490, category: "Аксессуары", image: "https://placehold.co/400x400?text=PowerBank " },
    { id: 7, name: "Apple Watch Series 9", price: 39990, category: "Часы", image: "https://placehold.co/400x400?text=Watch+Series+9 " },
    { id: 8, name: "iPhone 14", price: 69990, category: "Телефоны", image: "https://placehold.co/400x400?text=iPhone+14 " },
    { id: 9, name: "USB-C Зарядный кабель", price: 1490, category: "Аксессуары", image: "https://placehold.co/400x400?text= Кабель" },
    { id: 10, name: "AirPods Pro", price: 22990, category: "Наушники", image: "https://placehold.co/400x400?text=AirPods+Pro " },
    { id: 11, name: "Mac mini", price: 99990, category: "Ноутбуки", image: "https://placehold.co/400x400?text=Mac+mini " },
    { id: 12, name: "iPad Air", price: 54990, category: "Планшеты", image: "https://placehold.co/400x400?text=iPad+Air " }
  ];

  // Баннеры акций
  const banners = [
    { title: "Новинки уже здесь!", text: "Скидки до 15% на iPhone 15 серии", bg: "bg-gradient-to-r from-blue-500 to-indigo-600" },
    { title: "Акция недели", text: "Рассрочка 0% на всю технику Apple", bg: "bg-gradient-to-r from-green-500 to-teal-500" },
    { title: "Только сегодня!", text: "Подарок при покупке от 50 000 ₽", bg: "bg-gradient-to-r from-purple-500 to-pink-500" }
  ];

  // Определение темы Telegram
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

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Обработчик связи через Telegram
  const handleContact = (product) => {
    const message = encodeURIComponent(`Здравствуйте! Хочу купить: ${product.name} за ${product.price}₽`);
    const botUsername = 'your_bot_username'; // ← замените на ваш username бота
    window.open(`https://t.me/ ${botUsername}?text=${message}`, '_blank');
  };

  return (
    <div className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} transition-colors duration-300`}>
      {/* Шапка магазина */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">A-Device</h1>
        <p className="opacity-70 mt-1">Оригинальная техника Apple и аксессуары</p>
      </div>

      {/* Поиск */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Поиск товаров..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full px-4 py-2 rounded-lg shadow-sm ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
          } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>

      {/* Категории */}
      <div className="flex overflow-x-auto space-x-2 pb-2 mb-6 no-scrollbar">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedCategory(category);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            } transition`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Баннеры акций */}
      <div className="mb-8 space-y-4">
        {banners.map((banner, index) => (
          <div key={index} className={`${banner.bg} rounded-xl shadow-md p-4 text-white`}>
            <h2 className="text-lg font-semibold">{banner.title}</h2>
            <p className="text-sm opacity-90 mt-1">{banner.text}</p>
          </div>
        ))}
      </div>

      {/* Товары */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map(product => (
            <div
              key={product.id}
              className={`${
                theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
              } rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg`}
            >
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="font-semibold text-lg">{product.name}</h2>
                <p className="text-sm opacity-70 mt-1">от {product.price.toLocaleString()} ₽</p>
                <button
                  onClick={() => handleContact(product)}
                  className="mt-3 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
                >
                  Связаться
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center py-8 opacity-70">Товары не найдены</p>
        )}
      </div>

      {/* Пагинация */}
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md ${
            theme === 'dark' ? 'bg-gray-700 disabled:opacity-50' : 'bg-gray-200 disabled:opacity-50'
          }`}
        >
          ←
        </button>
        <span>Страница <strong>{currentPage}</strong> из <strong>{totalPages}</strong></span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${
            theme === 'dark' ? 'bg-gray-700 disabled:opacity-50' : 'bg-gray-200 disabled:opacity-50'
          }`}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default App;