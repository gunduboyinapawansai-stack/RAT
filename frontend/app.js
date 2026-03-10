const API = "http://localhost:3000";

function login() {

let username = document.getElementById("username").value;
let password = document.getElementById("password").value;

fetch(API + "/login", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({ username, password })
})
.then(res => res.json())
.then(data => {

if (data.success) {

if (data.role === "admin") {
window.location = "admin.html";
} else {
window.location = "worker.html";
}

} else {
alert("Login Failed");
}

});

}

function loadMenu() {

fetch(API + "/menu")
.then(res => res.json())
.then(data => {

let select = document.getElementById("item");
select.innerHTML = "";

data.forEach(item => {

let option = document.createElement("option");
option.value = item.id;
option.text = item.name;

select.appendChild(option);

});

});

}

function sendOrder() {

let itemId = document.getElementById("item").value;
let quantity = document.getElementById("qty").value;
let payment = document.getElementById("payment").value;

fetch(API + "/order", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({ itemId, quantity, payment })
})
.then(res => res.json())
.then(() => {
alert("Order Added");
});

}

function loadOrders() {

fetch(API + "/orders")
.then(res => res.json())
.then(data => {

let table = document.getElementById("orders");

let sales = 0;
let profit = 0;

table.innerHTML = "";

data.forEach(o => {

sales += o.total;
profit += o.profit;

table.innerHTML += `
<tr>
<td>${o.item}</td>
<td>${o.quantity}</td>
<td>${o.payment}</td>
<td>${o.total}</td>
<td>${o.profit}</td>
</tr>
`;

});

document.getElementById("sales").innerText = sales;
document.getElementById("profit").innerText = profit;

});

}

if (window.location.pathname.includes("worker.html")) {
loadMenu();
}