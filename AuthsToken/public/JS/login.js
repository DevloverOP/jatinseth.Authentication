const logbtn = document.getElementById('logsubmit')
logbtn.addEventListener("click",onLogin)

function onLogin(e){
    e.preventDefault()
    const logdata={
        email:document.getElementById('lemail').value,
        password:document.getElementById('lpassword').value
    }
    console.log(logdata)

  fetch('http://localhost:8000/login',{
        method:'POST',
        body:JSON.stringify(logdata),
        headers:{'Content-Type':'application/json'}
    }).then((res)=>{
      location.replace(res.url)
    }).catch((res)=>{
        console.log("fail",res)
    })

}