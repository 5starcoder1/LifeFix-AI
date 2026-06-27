document.addEventListener("DOMContentLoaded",()=>{


// Greeting
let h=new Date().getHours();
let greet=h<12?"Morning":h<18?"Afternoon":"Evening";

document.querySelector(".lf_welcome h1").innerHTML =
`Good ${greet}, Rahul 👋`;



// Productivity
let product=document.querySelectorAll(".lf_card h2")[0];
let p=87;

setInterval(()=>{
p=p>=99?80:p+1;
product.innerHTML=p+"%";
},3000);



// AI Counter
let ai=document.querySelectorAll(".lf_card h2")[3];
let count=0;

let timer=setInterval(()=>{
ai.innerHTML=++count;
if(count==24) clearInterval(timer);
},100);



// Search Effect
document.querySelector(".lf_topbar input")
.addEventListener("keyup",e=>{

e.target.style.boxShadow =
e.target.value ?
"0 0 20px #6a49ff" :
"none";

});



// AI Chat
let input=document.querySelector(".lf_chat_input input");
let btn=document.querySelector(".lf_chat_input button");
let box=document.querySelector(".lf_box");


btn.onclick=()=>{

let text=input.value.trim();

if(!text)return;


box.innerHTML += 
`<p>👤 ${text}</p>`;


setTimeout(()=>{

box.innerHTML +=
`<p style="color:#00e9ff">
🤖 AI: I will help you with ${text}
</p>`;

},700);


input.value="";

};



// Mood
document.querySelectorAll(".lf_emoji span")
.forEach(m=>{

m.onclick=()=>{

document.querySelectorAll(".lf_emoji span")
.forEach(x=>x.classList.remove("lf_active"));

m.classList.add("lf_active");

}

});




// Plan Toggle
document.querySelectorAll(".lf_plan li")
.forEach(item=>{

item.onclick=()=>{

item.classList.toggle("done");

item.style.textDecoration =
item.classList.contains("done")
?"line-through":"none";

item.style.opacity =
item.classList.contains("done")
?".5":"1";

}

});



// Progress Animation
document.querySelectorAll(".lf_bar span")
.forEach(bar=>{

let width=bar.style.width;

bar.style.width="0%";

setTimeout(()=>{
bar.style.transition="1.5s";
bar.style.width=width;
},300);

});


});