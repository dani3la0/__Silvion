
let lastScrollTop = 0;
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", function () {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop) {
    navbar.style.top = "-100px"; 
  } else {
    navbar.style.top = "20px";
  }

  lastScrollTop = scrollTop;
});







let addItemId = 0;
let totalPrice = 0;


function updateTotal() {
    document.getElementById('total').innerText = `Total: ${totalPrice} Lei`;
}


function saveCart() {
    const cartItems = [];
    document.querySelectorAll('#cart-items .cartImg').forEach(item => {
        const info = item.querySelector('div').innerText.split('\n');
        const [titleQty, priceText] = info;
        const [title, qtyText] = titleQty.split(' x');
        const quantity = parseInt(qtyText);
        const price = parseInt(priceText.replace(/\D/g, ''));
        const imgSrc = item.querySelector('img').src;
        cartItems.push({ title, quantity, price, imgSrc });
    });
    localStorage.setItem('cart', JSON.stringify(cartItems));
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
        updateTotal();
        selectedItem.remove();
        saveCart();
     
    };

    selectedItem.append(img, info, delBtn);
    document.getElementById('cart-items').append(selectedItem);

  showToast("Produs adăugat în coș");
    totalPrice += price * quantity;
    updateTotal();
    saveCart();
  
     
}



function loadCart() {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    totalPrice = 0;
    addItemId = 0;
    const cartContainer = document.getElementById('cart-items');
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
            updateTotal();
            selectedItem.remove();
            saveCart();

            
        };



        selectedItem.append(img, info, delBtn);
        cartContainer.append(selectedItem);

        totalPrice += item.price * item.quantity;
    });

    updateTotal();
}


document.getElementById('cartIcon').addEventListener('click', function() {
    const cart = document.getElementById('cart');
    cart.style.display = (cart.style.display === 'block') ? 'none' : 'block';
});









const orderNowBtn = document.getElementById('orderNowBtn');
const orderModal = document.getElementById('orderModal');
const closeModal = document.querySelector('.close');
const orderForm = document.getElementById('orderForm');
const orderSummary = document.getElementById('orderSummary');

orderNowBtn.addEventListener('click', () => {
  orderModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
  orderModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if(e.target === orderModal) {
    orderModal.style.display = 'none';
  }
});

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
  cartContainer.innerHTML = '';
  localStorage.removeItem('cart'); 
  totalPrice = 0;
  updateTotal();


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

  orderForm.reset();
});






const boxes = document.querySelectorAll('.box');
  const images = document.querySelectorAll('.content-img');

  boxes.forEach(box => {
    box.addEventListener('click', () => {
      boxes.forEach(b => b.classList.remove('active'));
      images.forEach(img => img.classList.remove('active'));

      box.classList.add('active');
      const target = box.dataset.target;
      document.getElementById(target).classList.add('active');
    });
  });






const hamburger = document.getElementById("hamburger");
const navMenu = document.querySelector("#navbar ul");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});



document.addEventListener('DOMContentLoaded', () => {
  loadCart();
});


document.querySelector('.close-cart').addEventListener('click', function() {
    document.getElementById('cart').style.display = 'none';
});



function updateTotal() {
    document.getElementById('total').innerText = `Total: ${totalPrice} Lei`;

    const orderBtn = document.getElementById('orderNowBtn');
    orderBtn.disabled = totalPrice === 0;
    updateTotal();
}  



function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}