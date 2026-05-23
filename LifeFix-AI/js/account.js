const key = "lfxp-u-data";

const nameEl = document.getElementById("lfxp-u-name");
const emailEl = document.getElementById("lfxp-u-email");
const imgEl = document.getElementById("lfxp-u-img");

const nameInput = document.getElementById("lfxp-u-nameInput");
const emailInput = document.getElementById("lfxp-u-emailInput");
const imgInput = document.getElementById("lfxp-u-imgInput");

const modal = document.getElementById("lfxp-u-modal");
const aiText = document.getElementById("lfxp-u-aiText");

function lfxpULoad(){
  let d = JSON.parse(localStorage.getItem(key)) || {};

  if(d.name) nameEl.innerText = d.name;
  if(d.email) emailEl.innerText = d.email;
  if(d.img) imgEl.src = d.img;

  nameInput.value = d.name || "";
  emailInput.value = d.email || "";
}

function lfxpUSave(){
  let d = JSON.parse(localStorage.getItem(key)) || {};

  d.name = nameInput.value;
  d.email = emailInput.value;
  d.img = imgEl.src;

  localStorage.setItem(key, JSON.stringify(d));

  lfxpUCloseModal();
  lfxpULoad();
}

imgInput.addEventListener("change",(e)=>{
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = ()=> imgEl.src = reader.result;
  reader.readAsDataURL(file);
});

function lfxpUOpenModal(){ modal.style.display="flex"; }
function lfxpUCloseModal(){ modal.style.display="none"; }

function lfxpUAI(){
  let h = new Date().getHours();
  aiText.innerText =
    h<12 ? "🌞 Focus on important work" :
    h<18 ? "🚀 Keep pushing forward" :
    "🌙 Time to relax";
}

lfxpULoad();
lfxpUAI();