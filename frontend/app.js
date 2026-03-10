const API = "https://rat-1-2vvw.onrender.com"; // live server

// ============================
// LOGIN
// ============================

function login() {

const username = document.getElementById("username").value;
const password = document.getElementById("password").value;

fetch(API + "/login", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ username, password })
})
.then(res => res.json())
.then(data => {

if(data.success){

  localStorage.setItem("role", data.role);
  localStorage.setItem("worker_id", data.id || "");
  localStorage.setItem("stall_id", data.stall_id || "");

  if(data.role === "admin")
    window.location = "admin.html";
  else
    window.location = "worker.html";

} else {
  alert("Login Failed");
}

})
.catch(err => {
console.error(err);
alert("Server connection error");
});

}

// ============================
// LOAD MENU
// ============================

let prices = {};

function loadMenu() {

fetch(API + "/menu")
.then(res => res.json())
.then(data => {

  const menuDiv = document.getElementById("menuButtons");
  if(!menuDiv) return;

  menuDiv.innerHTML = "";

  prices = {};

  data.forEach(item => {

    prices[item.name] = item.price;

    const btn = document.createElement("button");

    btn.innerHTML = item.name + " ₹" + item.price;

    btn.onclick = () => addItem(item.name);

    menuDiv.appendChild(btn);

  });

})
.catch(err => console.error(err));

}

// ============================
// CART SYSTEM
// ============================

let cart = {};

function addItem(item){

if(cart[item]) cart[item]++;
else cart[item] = 1;

updateCart();

}

function increase(item){

cart[item]++;
updateCart();

}

function decrease(item){

cart[item]--;

if(cart[item] === 0)
delete cart[item];

updateCart();

}

// ============================
// UPDATE CART DISPLAY
// ============================

function updateCart(){

const list = document.getElementById("cart");
const receipt = document.getElementById("receipt");

let total = 0;

list.innerHTML = "";
receipt.innerHTML = "";

for(let item in cart){

const qty = cart[item];
const price = prices[item] || 0;

const subtotal = qty * price;

total += subtotal;

list.innerHTML +=
  `<li>${item} ₹${price}
  <button onclick="decrease('${item}')">-</button>
  ${qty}
  <button onclick="increase('${item}')">+</button>
  </li>`;

receipt.innerHTML +=
  `<li>${item} x${qty} = ₹${subtotal}</li>`;

}

receipt.innerHTML += `<li><strong>Total: ₹${total}</strong></li>`;

document.getElementById("total").innerText = "Total: ₹" + total;

}

// ============================
// SEND ORDER
// ============================

function sendOrder(){

const payment = document.getElementById("payment").value;

const stall_id = localStorage.getItem("stall_id");
const worker_id = localStorage.getItem("worker_id");

if(Object.keys(cart).length === 0){

alert("Cart is empty!");
return;

}

fetch(API + "/order", {

method: "POST",

headers: { "Content-Type": "application/json" },

body: JSON.stringify({
  items: cart,
  payment_mode: payment,
  stall_id: stall_id,
  worker_id: worker_id
})

})
.then(res => res.json())
.then(() => {

alert("Order Sent");

cart = {};

updateCart();

})
.catch(err => {
console.error(err);
alert("Order failed");
});

}

// ============================
// LOAD ORDERS (ADMIN)
// ============================

function loadOrders(){

fetch(API + "/orders")

.then(res => res.json())

.then(data => {

  const table = document.getElementById("orders");
  if(!table) return;

  let sales = 0;
  let profit = 0;

  table.innerHTML = "";

  data.forEach(o => {

    const items = o.items || {};

    let itemsText = "";

    for(let item in items){

      itemsText += item + " x" + items[item] + ", ";

    }

    itemsText = itemsText.slice(0,-2);

    let total = 0;

    for(let item in items){

      const price = prices[item] || 0;
      total += items[item] * price;

    }

    const orderProfit = total * 0.3;

    sales += total;
    profit += orderProfit;

    const time =
      o.created_at
      ? new Date(o.created_at).toLocaleTimeString()
      : "-";

    table.innerHTML += `
    <tr>
      <td>${o.stall_id || "-"}</td>
      <td>${o.worker_id || "-"}</td>
      <td>${itemsText}</td>
      <td>${o.payment_mode || "-"}</td>
      <td>${time}</td>
      <td>₹${total}</td>
      <td>₹${orderProfit}</td>
    </tr>`;

  });

  if(document.getElementById("sales"))
    document.getElementById("sales").innerText = sales;

  if(document.getElementById("profit"))
    document.getElementById("profit").innerText = profit;

})
.catch(err => console.error(err));

}

// ============================
// AUTO LOAD MENU ON WORKER PAGE
// ============================

if(window.location.pathname.includes("worker.html")){

loadMenu();

}