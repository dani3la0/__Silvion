let lastScrollTop = 0;
const navbar = document.getElementById("navbar");

if (navbar) {
  window.addEventListener("scroll", function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
      navbar.style.top = "-100px";
    } else {
      navbar.style.top = "20px";
    }

    lastScrollTop = scrollTop;
  });
}

let addItemId = 0;
let totalPrice = 0;

let cartLoadedOnce = false;
let savingCart = false;
let updatingTotal = false;

function saveCart() {
  if (savingCart) return;
  savingCart = true;

  const cartItems = [];

  document.querySelectorAll('#cart-items .cartImg').forEach(item => {
    const infoDiv = item.children[1];
    if (!infoDiv) return;

    const info = infoDiv.innerText.split('\n');
    const [titleQty, priceText] = info;

    if (!titleQty || !priceText) return;

    const [title, qtyText] = titleQty.split(' x');
    const quantity = parseInt(qtyText);

    const total = parseInt(priceText.replace(/\D/g, ''));
    const price = total / quantity;

    const img = item.querySelector('img');

    cartItems.push({
      title,
      quantity,
      price,
      imgSrc: img ? img.src : ''
    });
  });

  localStorage.setItem('cart', JSON.stringify(cartItems));

  savingCart = false;
}

function addToCart(item) {
  addItemId++;

  const selectedItem = document.createElement('div');
  selectedItem.classList.add('cartImg');
  selectedItem.setAttribute('id', addItemId);

  const img = document.createElement('img');
  img.src = item.querySelector('img').src;

  const title = item.querySelector('.title').innerText;
  const priceText = item.querySelector('.price').innerText;
  const price = parseInt(priceText.replace(/\D/g, ''));
  const quantity = parseInt(item.querySelector('input').value);

  const info = document.createElement('div');
  info.innerText = `${title} x${quantity}\n${price * quantity} Lei`;

  const delBtn = document.createElement('button');
  delBtn.innerText = 'Șterge';

  delBtn.onclick = function () {
    totalPrice -= price * quantity;
    selectedItem.remove();
    updateTotal();
    saveCart();
  };

  selectedItem.append(img, info, delBtn);

  const cartContainer = document.getElementById('cart-items');
  if (cartContainer) cartContainer.append(selectedItem);

  totalPrice += price * quantity;

  showToast("Produs adăugat în coș");

  updateTotal();
  saveCart();
}

function loadCart() {
  if (cartLoadedOnce) return;
  cartLoadedOnce = true;

  const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');

  totalPrice = 0;
  addItemId = 0;

  const cartContainer = document.getElementById('cart-items');
  if (!cartContainer) return;

  cartContainer.innerHTML = '';

  cartItems.forEach(item => {
    addItemId++;

    const selectedItem = document.createElement('div');
    selectedItem.classList.add('cartImg');
    selectedItem.setAttribute('id', addItemId);

    const img = document.createElement('img');
    img.src = item.imgSrc;

    const info = document.createElement('div');
    info.innerText = `${item.title} x${item.quantity}\n${item.price * item.quantity} Lei`;

    const delBtn = document.createElement('button');
    delBtn.innerText = 'Șterge';

    delBtn.onclick = function () {
      totalPrice -= item.price * item.quantity;
      selectedItem.remove();
      updateTotal();
      saveCart();
    };

    selectedItem.append(img, info, delBtn);
    cartContainer.append(selectedItem);

    totalPrice += item.price * item.quantity;
  });

  updateTotal();
}

function updateTotal() {
  if (updatingTotal) return;
  updatingTotal = true;

  const totalEl = document.getElementById('total');
  if (totalEl) {
    totalEl.innerText = `Total: ${totalPrice} Lei`;
  }

  const orderBtn = document.getElementById('orderNowBtn');
  if (orderBtn) {
    orderBtn.disabled = totalPrice <= 0;
  }

  updatingTotal = false;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

const cartIcon = document.getElementById('cartIcon');
if (cartIcon) {
  cartIcon.addEventListener('click', () => {
    const cart = document.getElementById('cart');
    if (cart) {
      cart.style.display = (cart.style.display === 'block') ? 'none' : 'block';
    }
  });
}

const closeCart = document.querySelector('.close-cart');
if (closeCart) {
  closeCart.addEventListener('click', () => {
    const cart = document.getElementById('cart');
    if (cart) cart.style.display = 'none';
  });
}

const orderNowBtn = document.getElementById('orderNowBtn');
const orderModal = document.getElementById('orderModal');
const closeModal = document.querySelector('.close');

if (orderNowBtn && orderModal) {
  orderNowBtn.addEventListener('click', () => {
    orderModal.style.display = 'block';
  });
}

if (closeModal && orderModal) {
  closeModal.addEventListener('click', () => {
    orderModal.style.display = 'none';
  });
}

window.addEventListener('click', (e) => {
  if (orderModal && e.target === orderModal) {
    orderModal.style.display = 'none';
  }
});

const orderForm = document.getElementById('orderForm');
const orderSummary = document.getElementById('orderSummary');

if (orderForm) {
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
      name: orderForm.name.value,
      email: orderForm.email.value,
      phone: orderForm.phone.value,
      address: orderForm.address.value,
      message: orderForm.message.value,
      total: totalPrice
    };

    localStorage.setItem('lastOrder', JSON.stringify(formData));

    const cartContainer = document.getElementById('cart-items');
    if (cartContainer) cartContainer.innerHTML = '';

    localStorage.removeItem('cart');
    totalPrice = 0;

    updateTotal();

    if (orderSummary) {
      orderSummary.innerHTML = `
        <h3>Comanda ta:</h3>
        <p><strong>Nume:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Telefon:</strong> ${formData.phone}</p>
        <p><strong>Adresă:</strong> ${formData.address}</p>
        <p><strong>Mesaj:</strong> ${formData.message}</p>
        <p><strong>Total:</strong> ${formData.total} Lei</p>
        <p style="color:green; font-weight:bold;">Comanda a fost înregistrată!</p>
      `;
    }

    orderForm.reset();
  });
}

const boxes = document.querySelectorAll('.box');
const images = document.querySelectorAll('.content-img');

boxes.forEach(box => {
  box.addEventListener('click', () => {
    boxes.forEach(b => b.classList.remove('active'));
    images.forEach(img => img.classList.remove('active'));

    box.classList.add('active');
    const target = box.dataset.target;
    const targetEl = document.getElementById(target);
    if (targetEl) targetEl.classList.add('active');
  });
});

const hamburger = document.getElementById("hamburger");
const navMenu = document.querySelector("#navbar ul");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
}

window.addEventListener('load', () => {
  loadCart();
});
