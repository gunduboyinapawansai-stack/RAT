const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
app.use(cors());

// ============================
// PostgreSQL connection
// ============================

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// ============================
// HTTP + SOCKET SERVER
// ============================

const server = http.createServer(app);

const io = new Server(server,{
  cors:{ origin:"*" }
});

io.on("connection",(socket)=>{
  console.log("Client connected:",socket.id);
});

// ============================
// TEST ROUTE
// ============================

app.get("/",(req,res)=>{
  res.send("RAT Server Running");
});

// ============================
// LOGIN
// ============================

app.post("/login",async(req,res)=>{

  const { username,password } = req.body;

  try{

    const result = await pool.query(
      "SELECT id,role,stall_id FROM users WHERE username=$1 AND password=$2",
      [username,password]
    );

    if(result.rows.length>0){

      const user = result.rows[0];

      res.json({
        success:true,
        role:user.role,
        worker_id:user.id,
        stall_id:user.stall_id
      });

    }else{
      res.json({ success:false });
    }

  }catch(err){
    console.error(err);
    res.status(500).json({ success:false });
  }

});

// ============================
// MENU ITEMS
// ============================

app.get("/menu",async(req,res)=>{

  try{

    const result = await pool.query(
      "SELECT id,item_name AS name,price FROM menu_items ORDER BY id"
    );

    res.json(result.rows);

  }catch(err){
    console.error(err);
    res.status(500).json([]);
  }

});

// ============================
// ADD ORDER
// ============================

app.post("/order",async(req,res)=>{

  const { items,payment_mode,stall_id,worker_id } = req.body;

  if(!items || Object.keys(items).length===0){
    return res.status(400).json({ message:"No items in order" });
  }

  try{

    await pool.query(
      "INSERT INTO orders(items,payment_mode,stall_id,worker_id) VALUES($1,$2,$3,$4)",
      [items,payment_mode,stall_id,worker_id]
    );

    const orderData={
      items,
      payment_mode,
      stall_id,
      worker_id,
      time:new Date().toLocaleTimeString()
    };

    io.emit("newOrder",orderData);

    res.json({ message:"Order Saved" });

  }catch(err){
    console.error(err);
    res.status(500).json({ message:"Server Error" });
  }

});

// ============================
// GET ORDERS
// ============================

app.get("/orders",async(req,res)=>{

  try{

    const result = await pool.query(`
      SELECT 
        orders.id,
        orders.items,
        orders.payment_mode,
        orders.stall_id,
        orders.worker_id,
        users.username AS worker_name,
        orders.created_at
      FROM orders
      LEFT JOIN users ON users.id = orders.worker_id
      ORDER BY orders.created_at DESC
    `);

    res.json(result.rows);

  }catch(err){
    console.error(err);
    res.status(500).json([]);
  }

});

// ============================
// CREATE WORKER
// ============================

app.post("/create-worker",async(req,res)=>{

  const { username,password,stall_id } = req.body;

  try{

    await pool.query(
      "INSERT INTO users(username,password,role,stall_id) VALUES($1,$2,'worker',$3)",
      [username,password,stall_id]
    );

    res.json({ message:"Worker Created" });

  }catch(err){
    console.error(err);
    res.status(500).json({ message:"Error creating worker" });
  }

});

// ============================
// SERVER START
// ============================

const PORT = process.env.PORT || 3000;

server.listen(PORT,()=>{
  console.log("Server running on port",PORT);
});