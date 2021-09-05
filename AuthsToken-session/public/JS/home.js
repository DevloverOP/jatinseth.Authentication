
document.getElementById('logout').addEventListener("click",()=>{
    fetch('http://localhost:8000/logout')
    .then((res)=>{location.reload()})
    .catch((err)=>{})
    
})