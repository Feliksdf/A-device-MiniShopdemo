import React, { useState, useEffect } from 'react';

const App = () => {
  const [theme, setTheme] = useState('dark');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Товары
  const products = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      price: 89990,
      category: "Телефоны",
      image: "https://placehold.co/400x400?text=iPhone+15+Pro ",
      description: "Новый iPhone 15 Pro с титановой рамкой и улучшенной камерой",
      extraImages: [
        "https://placehold.co/400x400?text= Камера+iPhone",
        "https://placehold.co/400x400?text= Титановая+рамка"
      ]
    },
    {
      id: 2,
      name: "MacBook Air M3",
      price: 119990,
      category: "Ноутбуки",
      image: "https://placehold.co/400x400?text=MacBook+Air+M3 ",
      description: "Легкий и мощный ноутбук Apple на чипе M3",
      extraImages: [
        "https://placehold.co/400x400?text= Макбук+сбоку",
        "https://placehold.co/400x400?text= Работа+на+M3"
      ]
    }
  ];

  // Баннеры акций
  const banners = [
    {
      title: "Новинки уже здесь!",
      text: "Скидки до 15% на iPhone 15 серии",
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

  // Открытие модального окна с товаром
  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Закрытие модального окна
  const closeProductDetails = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Обработчик связи через Telegram
  const handleContact = (product) => {
    const message = encodeURIComponent(`Здравствуйте! Хочу купить: ${product.name} за ${product.price}₽`);
    const botUsername = 'your_bot_username'; // ← замените на ваш бот
    window.open(`https://t.me/ ${botUsername}?text=${message}`, '_blank');
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
          className={`w-full px-4 py-2 rounded-lg shadow-sm ${
            theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white text-black'
          } border focus:outline-none focus:ring-2 focus:ring-cyan-500`}
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
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-gray-900 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg border border-cyan-500 cursor-pointer"
              onClick={() => openProductDetails(product)}
            >
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="font-semibold text-lg">{product.name}</h2>
                <p className="text-sm opacity-70 mt-1">от {product.price.toLocaleString()} ₽</p>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center py-8 opacity-70">🔍 Товары не найдены</p>
        )}
      </div>

      {/* Модальное окно с деталями товара */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <div className="bg-gray-900 rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeProductDetails}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl">×</button>

            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-64 object-cover rounded-lg mb-4" />

            <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
            <p className="opacity-90 mb-4">{selectedProduct.description}</p>

            {/* Дополнительные фото */}
            <div className="flex space-x-2 mb-6 overflow-x-auto no-scrollbar">
              {selectedProduct.extraImages?.map((img, i) => (
                <img key={i} src={img} alt={`Доп. фото ${i + 1}`} className="w-32 h-32 object-cover rounded-lg" />
              ))}
            </div>

            <p className="text-lg mb-6">Цена: <strong>{selectedProduct.price.toLocaleString()} ₽</strong></p>

            <button
              onClick={() => handleContact(selectedProduct)}
              className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-md transition"
            >
              Связаться
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default App;