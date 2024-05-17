const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const userRoutes=require("./routes/userRoutes"); 
const app=express();
const socket= require("socket.io");
const messageRoute=require("./routes/messageRoute")
require('dotenv').config();

// CORS in node. js stands for Cross-Origin Resource Sharing. It is a mechanism by which resources are shared across different servers. Single-origin policy is important for safety however, blocks external requests. We need CORS to bypass this feature.
app.use(cors());
// The express.json() function is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser. 
app.use(express.json());
app.use("/api/auth",userRoutes)
app.use("/api/messages",messageRoute)
app.get('/favicon.ico', (req, res) => {
    // Send a 200 status code
    res.status(200).end();
  });
  app.get('/', (req, res) => {
    // Send a 200 status code
    res.status(200).end();
  });

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{ 
    console.log("DB connection successful");
}).catch((err)=>{
    console.log(err.message);
})

const server=app.listen(process.env.PORT,()=>{
    console.log(`Server is running at port ${process.env.PORT}`);
})


const io=socket(server,{
    cors:{
        origin:"process.env.ORIGIN",
        credentials:true,
    },
});

global.onlineUsers= new Map();
io.on("connection",(socket)=> {
    global.chatSocket = socket;
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId,socket.id);
    });
    socket.on("send-msg",(data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve",data.message);
        }
    }); 
});