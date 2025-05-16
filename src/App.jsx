import React, { useState, useEffect } from 'react';

const App = () => {
  const [theme, setTheme] = useState('dark');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
        setBanners(data.banners || []);
        setProducts(data.products || []);
      })
      .catch(err => {
        console.error('Ошибка загрузки JSON:', err);
        setBanners([]);
        setProducts([]);
      });
  }, []);

  // Фильтрация товаров
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Все' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Открытие карточки товара
  const openProductDetails = (product) => {
    setSelectedProduct(product);
  };

  // Закрытие карточки товара
  const closeProductDetails = () => {
    setSelectedProduct(null);
  };

  // Открытие фото на весь экран
  const openFullScreen = (url) => {
    setModalImage(url);
  };

  const closeFullScreen = () => {
    setModalImage(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Шапка магазина */}
      <div className="text-center mb-6 pt-6">
        <h1 className="text-3xl font-bold">📱 A-Device</h1>
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

      {/* Баннеры сверху */}
      <div className="mb-8 px-4 max-w-4xl mx-auto space-y-4">
        {banners.map((banner, index) => (
          <div
            key={index}
            onClick={() => openProductDetails(products.find(p => p.id === banner.linkToProduct))}
            className={`cursor-pointer ${banner.bg} rounded-xl shadow-md p-4 text-white`}
          >
            <img src={banner.image} alt={banner.title} className="w-full h-32 object-cover rounded-t-xl" />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{banner.title}</h2>
              <p className="text-sm opacity-90 mt-1">{banner.text}</p>
            </div>
          </div>
        ))}
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

      {/* Товары */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-gray-900 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
              onClick={() => openProductDetails(product)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover cursor-zoom-in"
                onClick={(e) => {
                  e.stopPropagation(); // Не открываем карточку при клике на фото
                  openFullScreen(product.image);
                }}
              />

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

      {/* Модальное окно с полноразмерным фото */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={closeFullScreen}
        >
          <img
            src={modalImage}
            alt="Полноразмерное фото"
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Информация о товаре */}
      {selectedProduct && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-90">
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 max-w-md w-full relative">
            <button
              onClick={closeProductDetails}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl">×</button>

            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-64 object-cover rounded-lg mb-4 cursor-zoom-in"
              onClick={() => openFullScreen(selectedProduct.image)}
            />

            <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>

            <p className="opacity-90 mb-2">💰 Цена: <strong>{selectedProduct.price.toLocaleString()} ₽</strong></p>

            {selectedProduct.storage && (
              <p className="opacity-90 mb-2">📦 Память: <strong>{selectedProduct.storage}</strong></p>
            )}

            {selectedProduct.batteryHealth && (
              <p className="opacity-90 mb-2">🔋 Батарея: <strong>{selectedProduct.batteryHealth}</strong></p>
            )}

            {selectedProduct.condition && (
              <p className="opacity-90 mb-4">💎 Состояние: <strong>{selectedProduct.condition}</strong></p>
            )}

            {selectedProduct.description && (
              <p className="opacity-90 mb-4">{selectedProduct.description}</p>
            )}

            <button
              onClick={() => {
                const message = encodeURIComponent(
                  `Здравствуйте! Хочу купить: ${selectedProduct.name} за ${selectedProduct.price}₽\n\nTelegram: @feliksdf`
                );
                window.open(`https://t.me/feliks_df?text= ${message}`, '_blank');
              }}
              className="mt-3 w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-md transition"
            >
              Связаться с @feliksdf
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;