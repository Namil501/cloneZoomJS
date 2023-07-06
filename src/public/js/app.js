const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

let roomName = "";

room.hidden = true;

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerHTML = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}
function handleNicknameSubmit(event){
    event.preventDefault();
    const input = room.querySelector("#name input");
    const value = input.value;
    socket.emit("nickname", value);
    input.value = "";

}
function showRoom(newCount){
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    const nicknameForm = room.querySelector("#name");
    const msgForm = room.querySelector("#msg");
    nicknameForm.addEventListener("submit", handleNicknameSubmit);
    msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${user} arrived!`);
});
socket.on("bye", (left, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${left} left ㅠㅠ`);
});
socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    console.log('room_change');
    if (rooms.length === 0) {
        console.log('room 0');
        return;
    }
    // rooms.forEach((room) => {
    //     const li = document.createElement("li");
    //     li.innerText = room;
    //     roomList.append(li);
    // });
    for (let key in rooms) {
        console.log('key test');
        console.log(key);
        console.log('key test2');
        const li = document.createElement("li");
        li.innerText = key + '(' + rooms[key] + ')';
        roomList.append(li);
    }
});
// socket.on("room_list_init", (roomArray) => {
//     const roomList = welcome.querySelector("ul");
//     roomList.innerHTML = "";
//     console.log('key test-1');
//     console.log(roomArray);
//     if (roomArray.length === 0) {
//         return;
//     }
//     console.log('key test0');
//     for (let key in roomArray) {
//         console.log('key test');
//         console.log(key);
//         console.log('key test2');
//         const li = document.createElement("li");
//         li.innerText = key + '(' + roomArray[key] + ')';
//         roomList.append(li);
//     }
// });