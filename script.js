
const products = [
  {id:1,name:"Truffle Bruschetta",category:"Starters",price:12,rating:4.8,image:"https://picsum.photos/400/300?1",description:"Toasted artisan bread with truffle cream."},
  {id:2,name:"Garlic Shrimp",category:"Starters",price:14,rating:4.7,image:"https://picsum.photos/400/300?2",description:"Butter garlic shrimp with herbs."},
  {id:3,name:"Caesar Bites",category:"Starters",price:11,rating:4.6,image:"https://picsum.photos/400/300?3",description:"Mini caesar salad bites."},

  {id:4,name:"Steak Royale",category:"Main Dishes",price:28,rating:4.9,image:"https://picsum.photos/400/300?4",description:"Premium steak with rosemary sauce."},
  {id:5,name:"Creamy Salmon",category:"Main Dishes",price:26,rating:4.8,image:"https://picsum.photos/400/300?5",description:"Salmon fillet in creamy sauce."},
  {id:6,name:"Chicken Alfredo",category:"Main Dishes",price:22,rating:4.7,image:"https://picsum.photos/400/300?6",description:"Italian pasta with creamy alfredo."},
  {id:7,name:"Smoky BBQ Burger",category:"Burgers",price:18,rating:4.7,image:"https://picsum.photos/400/300?7",description:"Double patty with BBQ sauce."},
  {id:8,name:"Classic Cheese Burger",category:"Burgers",price:16,rating:4.6,image:"https://picsum.photos/400/300?8",description:"Loaded with cheddar and pickles."},
  {id:9,name:"Spicy Inferno Burger",category:"Burgers",price:19,rating:4.8,image:"https://picsum.photos/400/300?9",description:"Hot jalapeños and spicy sauce."},

  {id:10,name:"Margherita Pizza",category:"Pizzas",price:21,rating:4.8,image:"https://picsum.photos/400/300?10",description:"Classic Italian margherita pizza."},
  {id:11,name:"Pepperoni Feast",category:"Pizzas",price:24,rating:4.9,image:"https://picsum.photos/400/300?11",description:"Loaded pepperoni pizza."},
  {id:12,name:"Four Cheese Pizza",category:"Pizzas",price:23,rating:4.7,image:"https://picsum.photos/400/300?12",description:"Mozzarella, parmesan and more."},

  {id:13,name:"Berry Mojito",category:"Drinks",price:10,rating:4.5,image:"https://picsum.photos/400/300?13",description:"Refreshing berry mint mojito."},
  {id:14,name:"Citrus Lemonade",category:"Drinks",price:8,rating:4.6,image:"https://picsum.photos/400/300?14",description:"Fresh citrus lemonade."},
  {id:15,name:"Iced Latte",category:"Drinks",price:9,rating:4.7,image:"https://picsum.photos/400/300?15",description:"Cold premium latte."},
  {id:16,name:"Vanilla Milkshake",category:"Drinks",price:11,rating:4.8,image:"https://picsum.photos/400/300?16",description:"Creamy vanilla milkshake."},

  {id:17,name:"Chocolate Lava Cake",category:"Desserts",price:13,rating:4.9,image:"https://picsum.photos/400/300?17",description:"Molten chocolate center."},
  {id:18,name:"Strawberry Cheesecake",category:"Desserts",price:12,rating:4.8,image:"https://picsum.photos/400/300?18",description:"Creamy strawberry cheesecake."},
  {id:19,name:"Tiramisu Deluxe",category:"Desserts",price:14,rating:4.9,image:"https://picsum.photos/400/300?19",description:"Italian coffee dessert."},
  {id:20,name:"Caramel Donuts",category:"Desserts",price:10,rating:4.6,image:"https://picsum.photos/400/300?20",description:"Soft caramel glazed donuts."}
];

const menuContainer = document.getElementById("menuContainer");
const filterBtns = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("searchInput");
const cartBtn = document.getElementById("cartBtn");
const closeCart = document.getElementById("closeCart");
const cartPanel = document.querySelector(".cart-panel");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const favoritesCount = document.getElementById("favoritesCount");
const toastContainer = document.querySelector(".toast-container");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

window.addEventListener("load", ()=>{
  setTimeout(()=>{
    document.querySelector(".loader").classList.add("hide");
  },1500);
});

function renderProducts(list){
  menuContainer.innerHTML = "";

  list.forEach(product=>{
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="card-content">
        <h3>${product.name}</h3>
        <p>${product.description}</p>

        <div class="rating">
          ${"★".repeat(Math.round(product.rating))}
        </div>

        <div class="price">$${product.price}</div>

        <div class="card-buttons">
          <button class="add-btn" onclick="addToCart(${product.id})">Add to Cart</button>
          <button class="fav-btn" onclick="toggleFavorite(${product.id})">
            ${favorites.includes(product.id) ? "❤" : "🤍"}
          </button>
        </div>
      </div>
    `;

    menuContainer.appendChild(card);
  });
}

renderProducts(products);

filterBtns.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");

    const category = btn.dataset.category;

    if(category === "All"){
      renderProducts(products);
    }else{
      renderProducts(products.filter(p=>p.category === category));
    }
  });
});

searchInput.addEventListener("input", e=>{
  const value = e.target.value.toLowerCase();

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(value)
  );

  renderProducts(filtered);
});

function addToCart(id){
  const item = cart.find(i=>i.id === id);

  if(item){
    item.quantity++;
  }else{
    cart.push({...products.find(p=>p.id===id), quantity:1});
  }

  updateCart();
  showToast("Item added to cart");
}

function updateCart(){
  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach(item=>{
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div>
        <h4>${item.name}</h4>
        <p>$${item.price}</p>
      </div>

      <div class="qty-controls">
        <button onclick="changeQty(${item.id}, -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    `;

    cartItems.appendChild(div);
  });

  cartTotal.textContent = total.toFixed(2);

  const count = cart.reduce((acc,item)=>acc+item.quantity,0);
  cartCount.textContent = count;

  localStorage.setItem("cart", JSON.stringify(cart));
}

function changeQty(id, value){
  const item = cart.find(i=>i.id===id);

  if(!item) return;

  item.quantity += value;

  if(item.quantity <=0){
    cart = cart.filter(i=>i.id !== id);
  }

  updateCart();
}

function toggleFavorite(id){
  if(favorites.includes(id)){
    favorites = favorites.filter(f=>f!==id);
    showToast("Removed from favorites");
  }else{
    favorites.push(id);
    showToast("Added to favorites");
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  favoritesCount.textContent = favorites.length;
  renderProducts(products);
}

function showToast(message){
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(()=>{
    toast.remove();
  },3000);
}

cartBtn.addEventListener("click", ()=>{
  cartPanel.classList.add("open");
});

closeCart.addEventListener("click", ()=>{
  cartPanel.classList.remove("open");
});

document.getElementById("themeToggle").addEventListener("click", ()=>{
  document.body.classList.toggle("light-mode");
});

document.querySelector(".hamburger").addEventListener("click", ()=>{
  document.querySelector(".nav-links").classList.toggle("active");
});

favoritesCount.textContent = favorites.length;
updateCart();
