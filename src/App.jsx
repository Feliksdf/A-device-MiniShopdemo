import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react'; // ✅ Убедитесь, что установлен
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // Объединенная функция открытия товара
  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    requestAnimationFrame(() => {
      setModalAnimation("opacity-100 scale-100");
    });
  };

  // Закрытие карточки товара
  const closeProductDetails = () => {
    setModalAnimation("opacity-0 scale-95");
    setTimeout(() => {
      setIsModalOpen(false);
      setSelectedProduct(null);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ...остальной код шапки, поиска и товаров... */}

      {/* Товары */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div
              key={product.id}
              className="bg-gray-900 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
              onClick={() => openProductDetails(product)}
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

      {/* Модальное окно с галереей и слайдером */}
      {isModalOpen && selectedProduct && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={closeProductDetails}
        >
          <div 
            className={`bg-gray-900 rounded-xl shadow-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto relative transform ${modalAnimation}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeProductDetails}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-4xl transition-colors duration-300 z-50"
            >
              ×
            </button>

            {/* Слайдер с изображениями */}
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              loop={true}
              navigation
              pagination={{ clickable: true }}
              className="h-64 mb-4 rounded-lg overflow-hidden"
            >
              {/* Основное фото */}
              {selectedProduct.image && (
                <SwiperSlide>
                  <img
                    src={selectedProduct.image?.trim()}
                    alt={selectedProduct.name}
                    className="w-full h-64 object-cover"
                  />
                </SwiperSlide>
              )}

              {/* Дополнительные фото */}
              {selectedProduct.extraImages && selectedProduct.extraImages.map((imgUrl, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={imgUrl.trim()}
                    alt={`Доп фото ${idx + 1}`}
                    className="w-full h-64 object-cover"
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