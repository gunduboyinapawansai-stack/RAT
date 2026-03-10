const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(express.json());
app.use(cors());

let users = [
  {username:"admin", password:"admin", role:"admin"},
  {username:"worker", password:"worker", role:"worker"}
];

let orders = [];

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Login
app.post("/login", (req,res)=>{
  let {username,password} = req.body;
  let user = users.find(u => u.username===username && u.password===password);
  if(user) res.json({success:true, role:user.role});
  else res.json({success:false});
});

// Add order
app.post("/order", (req,res)=>{
  orders.push(req.body);

  // Emit new order to all connected clients
  io.emit("newOrder", req.body);

  res.json({message:"Order Saved"});
});

// Get all orders
app.get("/orders",(req,res)=>{
  res.json(orders);
});

// Start server with Socket.IO
server.listen(3000, ()=>{
  console.log("Server running at http://localhost:3000");
});