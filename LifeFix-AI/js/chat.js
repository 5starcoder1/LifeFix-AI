

let chats = JSON.parse(localStorage.getItem("lifefix_chats")) || [];
let memories = JSON.parse(localStorage.getItem("lifefix_memory")) || [];
let currentChat = [];

lfx_loadHistory();
lfx_updateMemoryPreview();

/* Send Message */
async function lfx_sendMsg() {

let input = document.getElementById("lfx-msgInput");
let text = input.value.trim();
if(text === "") return;

/* user bubble */
lfx_appendMessage("user", text);
currentChat.push({role:"user", text:text});

/* memory detect */
lfx_detectMemory(text);

input.value = "";
lfx_autoResize();

lfx_appendTyping();

try {

const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
method:"POST",
headers:{
"Content-Type":"application/json",
"Authorization":"Bearer " + API_KEY
},
body: JSON.stringify({
model:"llama-3.1-8b-instant",
temperature:0.7,
messages:[
{
role:"system",
content:"You are LIFEFIX AI. Reply smart and clean."
},
{
role:"system",
content:"User memory: " + memories.join(" | ")
},
{
role:"user",
content:text
}
]
})
});

const data = await response.json();

lfx_removeTyping();

let reply = data?.choices?.[0]?.message?.content || "No response.";

lfx_appendMessage("ai", reply);
currentChat.push({role:"ai", text:reply});

} catch(error){

lfx_removeTyping();
lfx_appendMessage("ai", "Connection error.");

}

}

/* Save chat ONLY when switching */
function lfx_saveCurrentChat(){

if(currentChat.length < 2) return;

let lastChat = chats[chats.length - 1];

if(JSON.stringify(lastChat) === JSON.stringify(currentChat)) return;

chats.push([...currentChat]);
localStorage.setItem("lifefix_chats", JSON.stringify(chats));

lfx_loadHistory();
}

/* New chat */
function lfx_newChat(){

lfx_saveCurrentChat();

currentChat = [];

document.getElementById("lfx-chatBox").innerHTML = `
<div class="lfx-message ai">
<div class="lfx-bubble">
Hello Rahul 👋
I’m your premium AI assistant. How can I help today?
</div>
</div>
`;

}

/* Append message */
function lfx_appendMessage(type, text){

let box = document.getElementById("lfx-chatBox");

box.innerHTML += `
<div class="lfx-message ${type}">
<div class="lfx-bubble">${lfx_escapeHtml(text)}</div>
</div>
`;

box.scrollTop = box.scrollHeight;
}

/* typing */
function lfx_appendTyping(){

let box = document.getElementById("lfx-chatBox");

box.innerHTML += `
<div class="lfx-message ai" id="lfx-typingRow">
<div class="lfx-bubble">Typing...</div>
</div>
`;

}

function lfx_removeTyping(){
let row = document.getElementById("lfx-typingRow");
if(row) row.remove();
}

/* History */
function lfx_loadHistory(){

let list = document.getElementById("lfx-chatHistory");
list.innerHTML = "";

chats.forEach((chat,index)=>{

let title = "Chat " + (index + 1);

for(let i=0;i<chat.length;i++){
if(chat[i].role === "user"){
title = chat[i].text;
break;
}
}

list.innerHTML += `
<div class="lfx-chat-item">
<span onclick="lfx_openChat(${index})">${lfx_escapeHtml(title)}</span>
<button onclick="lfx_deleteChat(${index})">X</button>
</div>
`;

});

}

/* Open old chat */
function lfx_openChat(index){

lfx_saveCurrentChat();

currentChat = chats[index];

let box = document.getElementById("lfx-chatBox");
box.innerHTML = "";

currentChat.forEach(msg=>{
lfx_appendMessage(msg.role === "user" ? "user" : "ai", msg.text);
});

}

/* Delete chat */
function lfx_deleteChat(index){

chats.splice(index,1);
localStorage.setItem("lifefix_chats", JSON.stringify(chats));

lfx_loadHistory();
lfx_newChat();

}

/* Memory */
function lfx_detectMemory(text){

let t = text.toLowerCase();

const triggers = [
"my name is","mera naam","i am","i want","i like","my goal"
];

for(let key of triggers){

if(t.includes(key)){

memories.unshift(text);

if(memories.length > 8){
memories.pop();
}

localStorage.setItem("lifefix_memory", JSON.stringify(memories));
lfx_updateMemoryPreview();
break;

}

}

}

function lfx_updateMemoryPreview(){

let box = document.getElementById("lfx-memoryPreview");

if(memories.length === 0){
box.innerText = "No memories yet";
return;
}

box.innerText = memories[0];

}

/* Enter send */
document.addEventListener("DOMContentLoaded", ()=>{

const input = document.getElementById("lfx-msgInput");

input.addEventListener("keydown", function(e){
if(e.key === "Enter" && !e.shiftKey){
e.preventDefault();
lfx_sendMsg();
}
});

input.addEventListener("input", lfx_autoResize);

});

/* resize */
function lfx_autoResize(){
let input = document.getElementById("lfx-msgInput");
input.style.height = "auto";
input.style.height = input.scrollHeight + "px";
}

/* escape */
function lfx_escapeHtml(str){
return String(str)
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;")
.replace(/"/g,"&quot;")
.replace(/'/g,"&#039;");
}