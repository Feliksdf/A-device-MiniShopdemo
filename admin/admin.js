const firebaseUrl = 'https://a-device-firebase-shop-default-rtdb.firebaseio.com/products ';

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
        list.innerHTML = '<p class="text-center opacity-70