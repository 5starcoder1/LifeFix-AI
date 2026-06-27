const key = ".lfxp-u-data";

const nameE1 = document.getElementById(".lfxp-u-name");
const emailE1 = document.getElementById(".lfxp-u-email");
const imgE1 = document.getElementById(".lfxp-u-img");

const nameInput = document.getElementById(".lfxp-u-nameInput");
const emailInput = document.getElementById(".lfxp-u-emailInput");
const imgInput = document.getElementById(".lfxp-u-imgInput");

const model = document.getElementById(".lfxp-u-model");
const aiText = document.getElementById(".lfxp-u-aiText");



function lfxpUload() {
    let d=JSON.parse(localStorage.getItem(key)) || {};

    if(d.name) nameE1.innerText = d.name;
    if(d.email) emailE1.innerText = d.email;
    if(d.img) imgE1.src = d.img;

nameInput.value=d.name || "";
emailInput.value=d.email || "";
    
}

imgInput.addEventListener("change",(e)=>{
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = ()=> imgE1.src = reader.result;
    reader.readAsDataURL(file);
});

function lfxUOpenModel(){model.style.display="flex";}
function lfxUUCloseModel(){model.style.display="none";}


function lfxpUAI() {
    let h = new Date().getHours();
    aiText.innerText=
    h<12?"Focus on important work":
    h<1 ? "keep pushing forword":
    "Time to relax";
}


lfxpUload();
lfxpUAI();




