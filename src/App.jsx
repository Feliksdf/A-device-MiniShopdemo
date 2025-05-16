import React, { useState, useEffect } from 'react';

const App = () => {
  const [theme, setTheme] = useState('dark');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalImage, setModalImage] = useState(null);

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
        setProducts([
          {
            id: 1,
            name: "iPhone 14 Pro Max",
            price: 60990,
            category: "Телефоны",
            image: "https://placehold.co/400x400?text=iPhone+14+Pro+Max ",
            description: "Идеальное сочетание цены и качества",
            storage: "128 ГБ",
            batteryHealth: "88%",
            condition: "Идеальное"
          },
          {
            id: 2,
            name: "MacBook Air M3",
            price: 119990,
            category: "Ноутбуки",
            image: "https://placehold.co/400x400?text=MacBook+Air+M3 ",
            description: "Легкий и мощный ноутбук Apple на чипе M3",
            storage: "1 ТБ SSD",
            batteryHealth: "100%",
            condition: "Новый"
          }
        ]);
      });
  }, []);

  // Фильтрация товаров
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Все' || product.category === selectedCategory;
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Открытие полноразмерного фото
  const openFullScreen = (url) => {
    setModalImage(url);
  };

  // При клике на товар → открываем карточку
  const openProductDetails = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Шапка магазина */}
      <div className="text-center mb-6 pt-6 flex flex-col items-center justify-center">
        <img src="/logo.gif" alt="Логотип A-Device" className="h-12 w-auto rounded-full mb-2 animate-pulse" />
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

      <div className="flex flex-col md:flex-row gap-6 px-4 max-w-6xl mx-auto">
        {/* Баннеры слева */}
        <div className="md:w-1/4 space-y-4">
          {banners.map((banner, index) => (
            <div
              key={index}
              onClick={() => setSelectedProduct(products.find(p => p.id === banner.linkToProduct))}
              className={`cursor-pointer ${banner.bg} rounded-xl shadow-md p-4 text-white`}
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-32 object-cover rounded-t-xl"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{banner.title}</h2>
                <p className="text-sm opacity-90 mt-1">{banner.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1">
          {/* Категории */}
          <div className="flex overflow-x-auto space-x-2 pb-2 mb-6 no-scrollbar px-4">
            {['Все', 'Iphone', 'Iphone new', 'Аксессуары', 'Ноутбуки', 'Наушники', 'Игровые приставки', 'Часы', 'Красота'].map((category, index) => (
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

          {/* Товары справа */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-gray-900 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  {/* Клик по фото → открывает карточку */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    onClick={() => openProductDetails(product)} // ← клик по фото → открывает карточку
                  />

                  <div className="p-4">
                    <h2 className="font-semibold text-lg">{product.name}</h2>
                    <p className="text-sm opacity-70 mt-1">от {product.price?.toLocaleString()} ₽</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center py-8 opacity-70">🔍 Товары не найдены</p>
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно с полноразмерным фото */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={() => setModalImage(null)}
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
              onClick={() => setSelectedProduct(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl">×</button>

            {/* Клик по фото в карточке → открывает полноразмерное фото */}
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-64 object-cover rounded-lg mb-4 cursor-zoom-in"
              onClick={() => openFullScreen(selectedProduct.image)}
            />

            {/* Дополнительные фото */}
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedProduct.extraImages?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Доп. фото ${i + 1}`}
                  className="w-20 h-20 object-cover rounded cursor-pointer"
                  onClick={() => openFullScreen(img)}
                />
              ))}
            </div>

            <h2 className="text-4xl font-bold mb-2">{selectedProduct.name}</h2>
            <p className="opacity-90 mb-2">💰 Цена: <strong>{selectedProduct.price?.toLocaleString()} ₽</strong></p>

            {selectedProduct.storage && (
              <p className="opacity-90 mb-2">📦 Память: <strong>{selectedProduct.storage}</strong></p>
            )}

            {selectedProduct.batteryHealth && (
              <p className="opacity-90 mb-2">🔋 Батарея: <strong>{selectedProduct.batteryHealth}</strong></p>
            )}

            {selectedProduct.condition && (
              <p className="opacity-90 mb-4">💎 Состояние: <strong>{selectedProduct.condition}</strong></p>
            )}

            <p className="mt-4 opacity-90">{selectedProduct.description}</p>

            {/* Кнопка связи */}
            <button
              onClick={() => {
                const message = encodeURIComponent(
                  `Здравствуйте! Хочу купить: ${selectedProduct.name} за ${selectedProduct.price}₽\n`
                );
                window.open(`https://t.me/feliks_df?text= ${message}`, '_blank');
              }}
              className="mt-4 w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-md transition"
            >
              Связаться
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;