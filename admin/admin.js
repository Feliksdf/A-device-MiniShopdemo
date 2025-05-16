const productsJsonUrl = '/products.json';

// Загрузка товаров
function loadProducts() {
  fetch(productsJsonUrl)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('productsList');
      list.innerHTML = '';
      data.forEach((product, index) => {
        list.innerHTML += `
          <div class="bg-gray-900 p-4 rounded border border-gray-700">
            <h3 class="font-bold">${product.name}</h3>
            <p>${product.price} ₽</p>
            <img src="${product.image}" alt="${product.name}" class="w-full h-32 object-cover mt-2" />
            <button onclick='deleteProduct(${index})' class="text-red-500 mt-2">Удалить</button>
          </div>
        `;
      });
    })
    .catch(err => console.error('Ошибка загрузки JSON:', err));
}

// Добавление товара
document.getElementById('productForm').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;

  const newProduct = {
    name: form.name.value,
    price: parseInt(form.price.value),
    image: form.image.value,
    category: form.category.value
  };

  // Получаем текущий список
  fetch(productsJsonUrl)
    .then(res => res.json())
    .then(data => {
      data.push(newProduct);
      saveProducts(data);
      form.reset();
      loadProducts();
    });
});

// Удаление товара (по индексу)
window.deleteProduct = function(index) {
  fetch(productsJsonUrl)
    .then(res => res.json())
    .then(data => {
      data.splice(index, 1);
      saveProducts(data);
      loadProducts();
    });
};

// Сохранение обратно в JSON (локально)
function saveProducts(data) {
  alert('Для сохранения в JSON нужно сделать коммит в GitHub → Vercel не поддерживает запись файлов онлайн'
}

loadProducts();