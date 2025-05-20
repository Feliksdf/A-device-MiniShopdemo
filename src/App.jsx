import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react'; // ✅ Импорт Swiper
import 'swiper/css'; // ✅ Базовые стили
import 'swiper/css/pagination'; // ✅ Пагинация

const App = () => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false); // ✅ Отдельный стейт для галереи
  const [modalImage, setModalImage] = useState(null); // ✅ Для полноразмерного фото
  const [modalAnimation, setModalAnimation] = useState("opacity-0 scale-95");
  const [theme, setTheme] = useState('dark');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
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
        setProducts([
          {
            id: 1,
            name: "iPhone 14 Pro Max",
            price: 60990,
            category: "Телефоны",
            image: "/images/14pmf1.jpg",
            description: "Идеальное сочетание цены и качества",
            storage: "128 ГБ",
            batteryHealth: "88%",
            condition: "Идеальное",
            extraImages: [
              "/images/14pmf2.jpg",
              "/images/14pmb.jpg"
            ]
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
    setIsGalleryOpen(false); // ✅ Закрываем галерею
  };

  // Открытие галереи
  const openGallery = (product) => {
    setSelectedProduct(product);
    setIsGalleryOpen(true);
    requestAnimationFrame(() => {
      setModalAnimation("opacity-100 scale-100");
    });
  };

  // Закрытие галереи
  const closeGallery = () => {
    setModalAnimation("opacity-0 scale-95");
    setTimeout(() => {
      setIsGalleryOpen(false);
      setSelectedProduct(null);
    }, 200);
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
              className={`cursor-pointer ${banner.bg} rounded-xl shadow-md p-4 text-white transition-all duration-300 hover:scale-105`}
              onClick={() => {
                if (!banner.linkToProduct) return;
                if (banner.type === "external") {
                  window.open(banner.linkToProduct.trim(), '_blank');
                } else {
                  const product = products.find(p => p.id === banner.linkToProduct);
                  if (product) openGallery(product);
                }
              }}
            >
              <img
                src={banner.image?.trim() || "/images/default.jpg"}
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

        {/* Товары справа */}
        <div className="flex-1">
          {/* Категории */}
          <div className="flex overflow-x-auto space-x-2 pb-2 mb-6 no-scrollbar px-4">
            {['Все', 'iPhone', 'New iPhone', 'Аксессуары', 'Macbook', 'Наушники', 'Игровые приставки', 'Часы', 'Красота'].map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-cyan-500 text-black'
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                } transition-all duration-300`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Сетка товаров */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-gray-900 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                  onClick={() => openGallery(product)}
                >
                  <img
                    src={product.image?.trim()}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="font-semibold text-lg">{product.name}</h2>
                    <p className="text-sm opacity-70 mt-1">{product.price?.toLocaleString()} ₽</p>
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
            className="max-w-[90vw] max-h-[90vh] object-contain transform transition-all duration-300 hover:scale-105"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Модальное окно с галереей и слайдером */}
      {isGalleryOpen && selectedProduct && (
        <div 
          className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-90"
          onClick={closeGallery}
        >
          <div 
            className={`bg-gray-900 rounded-xl shadow-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto relative transform ${modalAnimation}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeGallery}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-4xl transition-colors duration-300 z-50"
            >
              ×
            </button>

            {/* Слайдер с изображениями */}
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              loop={true}
              pagination={{ clickable: true }}
              className="h-64 mb-4 rounded-lg overflow-hidden"
            >
              {/* Основное фото */}
              <SwiperSlide>
                <img
                  src={selectedProduct.image?.trim()}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover cursor-zoom-in"
                  onClick={() => openFullScreen(selectedProduct.image)}
                />
              </SwiperSlide>

              {/* Дополнительные фото */}
              {selectedProduct.extraImages && selectedProduct.extraImages.map((imgUrl, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={imgUrl.trim()}
                    alt={`Доп фото ${idx + 1}`}
                    className="w-full h-64 object-cover cursor-zoom-in"
                    onClick={() => openFullScreen(imgUrl)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Описание товара */}
            <h2 className="text-2xl font-bold mb-2">{selectedProduct.name}</h2>
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

            <button
              onClick={(e) => {
                e.stopPropagation();
                const message = encodeURIComponent(
                  `Здравствуйте! Хочу купить: ${selectedProduct.name} за ${selectedProduct.price}₽`
                );
                window.open(`https://t.me/feliks_df?text= ${message}`, '_blank');
              }}
              className="mt-4 w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-md transition-all duration-300 hover:shadow-lg"
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