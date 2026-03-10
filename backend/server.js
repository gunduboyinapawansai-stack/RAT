const express = require("express")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server,{
cors:{origin:"*"}
})

app.use(express.json())
app.use(cors())

let users = [
{username:"admin",password:"admin",role:"admin"},
{username:"worker",password:"worker",role:"worker"}
]

let orders = []

app.get("/",(req,res)=>{
res.send("RAT Server Running")
})

app.post("/login",(req,res)=>{

let {username,password}=req.body

let user = users.find(
u => u.username===username && u.password===password
)

if(user){
res.json({success:true,role:user.role})
}else{
res.json({success:false})
}

})

app.post("/order",(req,res)=>{

let order=req.body
orders.push(order)

// 🔴 send order instantly to admin dashboard
io.emit("newOrder",order)

res.json({message:"Order Saved"})
})

app.get("/orders",(req,res)=>{
res.json(orders)
})

io.on("connection",(socket)=>{
console.log("Client connected")
})

server.listen(3000,()=>{
console.log("Server running at http://localhost:3000")
})