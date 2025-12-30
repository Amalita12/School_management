const user = document.getElementById('user')



window.addEventListener("load", (event) => {
  user.innerText = localStorage.getItem('username');
});


document.getElementById('dex').addEventListener('click',()=>{
window.location.href = "./index.html";
 localStorage.removeItem('username');
});