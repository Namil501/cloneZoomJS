const messageList = document.querySelector("ul");
const messageNickname = document.querySelector("#nickname");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);

function createMessage(type, payload){
    const msg = { type, payload };
    return JSON.stringify(msg);

}
socket.addEventListener("open", () => {
    console.log("Connected to Server ✅");
});
socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});
socket.addEventListener("close", () => {
    console.log("Disconnected from Server ❌");
});

function handleSubmitNickname(event){
    event.preventDefault();
    const input = messageNickname.querySelector("input");
    socket.send(createMessage("nickname", input.value)); 
    input.value = ""; 
}
function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(createMessage("message", input.value)); 
    input.value = ""; 
}
messageNickname.addEventListener("submit", handleSubmitNickname);
messageForm.addEventListener("submit", handleSubmit);