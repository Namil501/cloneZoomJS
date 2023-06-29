import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));

const handleListen = () => console.log(`Listening on http://localhost:3000`)

// app.listen(3000, handleListen);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const sockets = [];
wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Unknown"
    console.log("Connected to Browser ✅");
    socket.on("close", () => {
        console.log("Disconnected from Browser  ❌");
    });
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message);
        switch(parsedMessage.type){
            case "message":
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname} : ${parsedMessage.payload}`));
                break;
            default: 
                console.log(parsedMessage.payload);
                socket["nickname"] = parsedMessage.payload;
        }
    });
});

server.listen(3000, handleListen);