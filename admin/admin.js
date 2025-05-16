// 🔗 Замените на ваш Firebase URL
const firebaseUrl = 'https://your-firebase.firebaseio.com/products ';

// Функция загрузки товаров
function loadProducts() {
  fetch(`${firebaseUrl}.json`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('productsList');
      list.innerHTML = '';
      
      if (data) {
        for (let key in data) {
          const product = data[key];
          list.innerHTML += `
            <div class="bg-gray-900 p-4 rounded border border-gray-700 relative">
              <h3 class="font-bold">${product.name}</h3>
              <p>${product.price} ₽</p>
              <img src="${product.image}" alt="${product.name}" class="w-full h-32 object-cover mt-2" />
              
              <div class="flex space-x-2 mt-4">
                <button onclick='openEditModal("${key}", ${JSON.stringify(product).replace(/"/g, '&quot;')})' 
                        class="bg-yellow-500 hover:bg-yellow-600 text-black py-1 px-3 rounded text-sm">Редактировать</button>
                <button onclick='deleteProduct("${key}")' class="bg-red-500 hover:bg-red-600 text-black py-1 px-3 rounded text-sm">Удалить</button>
              </div>
            </div>
          `;
        }
      } else {
        list.innerHTML = '<p class="text-center opacity-70">Нет товаров</p>';
      }
    });
}

// Форма добавления товара
document.getElementById('productForm').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;

  const newProduct = {
    name: form.name.value,
    price: parseInt(form.price.value),
    image: form.image.value || "https://placehold.co/400x400?text=No+Image ",
    category: form.category.value,
    description: form.description.value || ""
  };

  fetch(firebaseUrl + '.json', {
    method: 'POST',
    body: JSON.stringify(newProduct)
  }).then(() => {
    form.reset();
    loadProducts();
  });
});

// Форма редактирования
document.getElementById('editProductForm').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  const productId = form.dataset.productId;

  const updatedProduct = {
    name: form.name.value,
    price: parseInt(form.price.value),
    image: form.image.value,
    category: form.category.value,
    description: form.description.value
  };

  fetch(`${firebaseUrl}/${productId}.json`, {
    method: 'PUT',
    body: JSON.stringify(updatedProduct)
  }).then(() => {
    closeEditModal();
    loadProducts();
  });
});

// Открытие модального окна редактирования
window.openEditModal = (key, productJson) => {
  const product = JSON.parse(productJson.replace(/&quot;/g, '"'));

  const modal = document.getElementById('editModal');
  const form = document.getElementById('editProductForm');
  form.dataset.productId = key;

  form.name.value = product.name;
  form.price.value = product.price;
  form.image.value = product.image || "";
  form.category.value = product.category || "Телефоны";
  form.description.value = product.description || "";

  modal.classList.remove('hidden');
};

// Закрытие модального окна
window.closeEditModal = () => {
  const modal = document.getElementById('editModal');
  modal.classList.add('hidden');

  const form = document.getElementById('editProductForm');
  form.name.value = '';
  form.price.value = '';
  form.image.value = '';
  form.category.value = 'Телефоны';
  form.description.value = '';
  delete form.dataset.productId;
};

// Удаление товара
function deleteProduct(key) {
  fetch(`${firebaseUrl}/${key}.json`, { method: 'DELETE' })
    .then(loadProducts);
}

// Автозагрузка при открытии
loadProducts();