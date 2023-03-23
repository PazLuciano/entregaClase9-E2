const { log } = require("console");
const express = require("express");
const routerProducts = require("./routes/productsRouter");
const routerCarts = require("./routes/cartsRouter");
const routerViews = require("./routes/viewsRouter")
// const routerChat = require("./routes/chatRouter")
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const { mongoDBconnection } = require("./dataBase/mongo.config");
const path = require("path")

const PORT = 3000;
const BASE = "api/v1"
const app = express();

const connectToBBDD = async () => {
    await mongoDBconnection()
}


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToBBDD()

// HANDLEBARS CONFIGURACION
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(`${__dirname}/views`));
app.set("view engine", "handlebars");
app.use(express.static(`${__dirname}/public`));


app.use(`/${BASE}/products`, routerProducts)
app.use(`/${BASE}/carts` , routerCarts)
app.use(`/${BASE}/views`, routerViews)
// app.use(`/${BASE}/chat`, routerChat)

const server = app.listen(PORT, () => {
    console.log(`API run port ${PORT}`);
})

const ChatManager = require("./services/chatServices")

const manager = new ChatManager;

app.get("/api/v1/chat", async (req, res) => {
    const messages = await manager.getMessages()
    console.log("messages -->", messages);
    res.render("chat", messages )
})

const io = new Server(server)

io.on("connection", async (socket) => {
    console.log("New client is connect");

    socket.on("message", async (data) => {
        
            if(data.message){
                const info = await manager.addMessage(data.user, data.message)
                console.log("guardamos");
                io.emit("actualizar", info)

     }
    })
  


})



app.use((req, res) => {
    res.status(404).json({
        ok : false,
        error : "Not found11"
    })
})








