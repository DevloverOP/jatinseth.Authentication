
const regbtn = document.getElementById('rsubmit')
regbtn.addEventListener("click",onRegister)

async function onRegister(e){
    e.preventDefault()
    const regdata={
        name:document.getElementById('rname').value,
        email:document.getElementById('remail').value,
        password:document.getElementById('rpassword').value
    }
    console.log(regdata)       

  const request =  await fetch('http://localhost:8000/register',{
        method:'POST',
        body:JSON.stringify(regdata),
        headers:{'Content-Type':'application/json'}
    })
  const response = await request;
        if(response.ok){
            location.replace(response.url)
        }else console.log("fail",response)

}

