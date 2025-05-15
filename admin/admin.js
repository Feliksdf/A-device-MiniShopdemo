// 🔗 Замените это на ваш Firebase URL
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
            <div class="bg-gray-900 p-4 rounded border border-gray-700">
              <h3 class="font-bold">${product.name}</h3>
              <p>${product.price} ₽</p>
              <img src="${product.image}" alt="${product.name}" class="w-full h-32 object-cover mt-2" />
              <button onclick='deleteProduct("${key}")' class="text-red-500 mt-2">Удалить</button>
            </div>
          `;
        }
      } else {
        list.innerHTML = '<p class="text-center opacity-70">Нет товаров</p>';
      }
    });
}

// Форма добавления
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

// Удаление товара
function deleteProduct(key) {
  fetch(`${firebaseUrl}/${key}.json`, {
    method: 'DELETE'
  }).then(loadProducts);
}

loadProducts();