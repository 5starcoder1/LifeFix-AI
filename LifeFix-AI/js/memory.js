let smx_memories = JSON.parse(localStorage.getItem("smartMemories")) || [];
let smx_memoryStatus = localStorage.getItem("memoryStatus") || "ON";

smx_renderMemories();
smx_updateStats();

/* Add Memory */
function smx_addMemory(){

let input = document.getElementById("smx-memoryInput");
let text = input.value.trim();

if(text === "") return;

if(smx_memoryStatus === "OFF"){
alert("Smart Memory is OFF");
return;
}

smx_memories.unshift({
text:text,
date:new Date().toLocaleString()
});

localStorage.setItem("smartMemories",JSON.stringify(smx_memories));

input.value="";

smx_renderMemories();
smx_updateStats();
}

/* Render */
function smx_renderMemories(list = smx_memories){

let box = document.getElementById("smx-memoryList");

if(list.length === 0){
box.innerHTML = `<div class="smx-empty">No memories saved.</div>`;
return;
}

box.innerHTML = "";

list.forEach((item,index)=>{

box.innerHTML += `
<div class="smx-memory-item">
<button onclick="smx_deleteMemory(${index})">X</button>
<div>${item.text}</div>
<div class="smx-date">${item.date}</div>
</div>
`;

});

}

/* Delete */
function smx_deleteMemory(index){

smx_memories.splice(index,1);

localStorage.setItem("smartMemories",JSON.stringify(smx_memories));

smx_renderMemories();
smx_updateStats();
}

/* Clear All */
function smx_clearAll(){

if(confirm("Delete all memories?")){

smx_memories = [];

localStorage.setItem("smartMemories","[]");

smx_renderMemories();
smx_updateStats();

}

}

/* Search */
function smx_searchMemory(){

let q = document.getElementById("smx-searchInput").value.toLowerCase();

let filtered = smx_memories.filter(item =>
item.text.toLowerCase().includes(q)
);

smx_renderMemories(filtered);
}

/* Toggle */
function smx_toggleMemory(){

smx_memoryStatus = smx_memoryStatus === "ON" ? "OFF" : "ON";

localStorage.setItem("memoryStatus",smx_memoryStatus);

smx_updateStats();
}

/* Stats */
function smx_updateStats(){

document.getElementById("smx-totalMemories").innerText = smx_memories.length;

document.getElementById("smx-statusText").innerText = smx_memoryStatus;

document.getElementById("smx-lastUpdated").innerText =
smx_memories.length > 0 ? "Now" : "Today";

}