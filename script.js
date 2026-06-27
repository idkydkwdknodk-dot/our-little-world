const openButton=document.getElementById("openButton");

const welcome=document.getElementById("welcome");

const main=document.getElementById("mainPage");

main.style.display="none";

openButton.onclick=()=>{

welcome.style.display="none";

main.style.display="block";

}
