// ini file javascript untuk nyimpen data menu, logika nambahin ke keranjang 
// dan juga bikin elemen baru di html berupa product card 
// kalo misalkan nanti mau bikin logika get data dari DB juga bisa dari sini,
//  tinggal ubah aja menudata nya jadi get api


// --- DATA MENU ---
const menuData = {
  food: [
    { 
      id: 1, 
      name: 'Nasi Goreng', 
      price: 28000, 
      description: 'Nasi goreng dengan bumbu rempah spesial dan telur mata sapi.', 
      image: 'img/nasigoreng.jpg' 
    },
    { 
      id: 2, 
      name: 'Mie Ayam', 
      price: 20000, 
      description: 'Mie kenyal, potongan ayam melimpah, dan pangsit renyah.', 
      image: 'img/mieayam.jpg' 
    },
    { 
      id: 3, 
      name: 'Bakso Urat', 
      price: 18000, 
      description: 'Bakso urat super pedas dengan kuah kaldu gurih.', 
      image: 'img/bakso.jpg' 
      
    },
    { 
      id: 4, 
      name: 'Nasi Ayam Betutu', 
      price: 25000, 
      description: 'Nasi ayam betutu khas Bali.', 
      image: 'img/betutu.jpg' 
      
    },
    // bisa nambahin menu makanan yg lainnya kalo mau disini, ikutin struktur yg udah ada
  ],
  drink: [
    { 
      id: 5, 
      name: 'Es Teh Manis', 
      price: 8000, 
      description: 'Teh segar dengan gula alami.', 
      image: 'img/esteh.jpg' 
    },
    { 
      id: 6, 
      name: 'Es Jeruk Nipis', 
      price: 12000, 
      description: 'Perasan jeruk nipis asli, menyegarkan dan kaya vitamin.', 
      image: 'img/esjeruk.jpg' 
    },
    // bisa tambahin menu minuman yg lainnya kalo mau disini, ikutin struktur yg udah ada
  ]
};

// --- FUNGSI UTAMA RENDERING CARD ---
function createMenuCard(item) {
  return `
    <div class="menu-card" data-id="${item.id}">
      <div class="card-image-wrapper">
        <img src="${item.image}" alt="${item.name}" class="card-image">
        ${item.badge ? `<span class="card-badge">${item.badge}</span>` : ''}
      </div>
      <div class="card-content">
        <h3 class="card-title">${item.name}</h3>
        <p class="card-description">${item.description}</p>
        <div class="card-price">Rp ${item.price.toLocaleString('id-ID')}</div>
        <div class="card-actions">
          <button 
            class="add-to-cart-btn" 
            onclick="addToCart(${item.id}, '${item.name}', ${item.price}, '${item.image}')">
            <i class="fas fa-cart-plus"></i> Tambah
          </button>
          <button class="favorite-btn" aria-label="Tambahkan ke Favorit">
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderMenu() {
  const foodContainer = document.getElementById('food-menu');
  const drinkContainer = document.getElementById('drink-menu');

  foodContainer.innerHTML = menuData.food.map(createMenuCard).join('');
  drinkContainer.innerHTML = menuData.drink.map(createMenuCard).join('');
}

// --- FUNGSI KERANJANG & MODAL ---
function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById('cart-count').textContent = totalItems;
}

function showModal(itemName) {
  document.getElementById('modal-item-name').textContent = itemName;
  const modal = document.getElementById('cart-modal');
  modal.classList.add('is-visible');
}

function closeModal() {
  const modal = document.getElementById('cart-modal');
  modal.classList.remove('is-visible');
}

function addToCart(id, name, price, image) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, name, price, image, quantity: 1 });
  }

  saveCart(cart);
  showModal(name);
}

// Panggil render menu dan update keranjang saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  updateCartCount();
});

// === WELCOME POPUP LOGIC (muncul saat pertama buka & setiap refresh, tapi gak pas balik dari cart) ===
document.addEventListener("DOMContentLoaded", () => {
  const welcomeScreen = document.getElementById("welcome-screen");
  const welcomeBtn = document.getElementById("welcome-btn");

  // cek apakah user datang dari halaman cart
  const fromCart = document.referrer.includes("cart.html");

  // kalau datang dari cart, jangan tampilkan popup
  if (fromCart) {
    welcomeScreen.style.display = "none";
    return;
  }

  // hapus flag popup tiap kali halaman direfresh
  window.addEventListener("beforeunload", () => {
    sessionStorage.removeItem("hasSeenPopup");
  });

  // cek apakah user udah lihat popup di sesi ini
  const hasSeenPopup = sessionStorage.getItem("hasSeenPopup");

  if (hasSeenPopup) {
    // kalau udah lihat → langsung sembunyikan popup
    welcomeScreen.style.display = "none";
  } else {
    // kalau belum → tampilkan popup
    welcomeScreen.style.display = "flex";
  }

  // tombol "Oke, Lanjut"
  welcomeBtn.addEventListener("click", () => {
    welcomeScreen.classList.add("hidden");
    sessionStorage.setItem("hasSeenPopup", "true");
    setTimeout(() => {
      welcomeScreen.style.display = "none";
    }, 400);
  });
});
