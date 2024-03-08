let reloj=document.getElementById('reloj');

    

//Funcion Interval
setInterval(() => {
    let Hora= new Date();
    reloj.innerHTML=Hora.toLocaleTimeString();//`${Fecha.getHours()}:${Fecha.getMinutes()}:${Fecha.getSeconds()}`;
    console.log(reloj);


}, 1000);


//import nodemailer from 'nodemailer';

//import {validarCorreo} from './services/mail.service.js';

let EmailInput=document.getElementById("Email");
let passwordInput=document.getElementById("password");
const cerrarBotonCS= document.getElementById('CS');
const iniciarBotonIS= document.getElementById('IS');

const wrapper= document.querySelector('.wrapper');
const loginlink= document.querySelector('.login-link');
const loginlink2= document.querySelector('.login-link2');
const registerlink= document.querySelector('.register-link');
const forgotlink=document.querySelector('.forgot-link');
const btnPopup= document.querySelector('.btnlogin-popup');


const URLAPI='https://localhost:7224/api/Auth/'; 

//https://localhost:7224/api/Auth/login

let responseData='';



registerlink.addEventListener('click',()=>{
    wrapper.classList.add('active');
    console.log("Se agrego la cosa a wrapper");
});


loginlink.addEventListener('click',()=>{
    wrapper.classList.remove('active');
    console.log("Se fue la cosa a wrapper");
});

loginlink2.addEventListener('click',()=>{
    wrapper.classList.remove('activeD');
    console.log("Se fue la cosa a wrapper");
});



forgotlink.addEventListener('click',()=>{

    wrapper.classList.add('activeD');
});

btnPopup.addEventListener('click',()=>{
    wrapper.classList.add('active-popup');
    console.log("Se agrego pero al inicio la cosa a wrapper");
});





async function Login(){
    Email=EmailInput.value;

    password=passwordInput.value;

    var Data={
        "correoElectronico": Email,
        "clave": password
    };


   var url= URLAPI+'login'; 

   try 
    {
        const response= await fetch(url, {
            method: 'POST',
            body: JSON.stringify(Data), 
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(Data);
        responseData = await response.json();

        console.log('Respuesta del API:', responseData.mensaje);

        localStorage.setItem('tokenAuth',responseData.token);

        cerrarBotonCS.hidden=false;
        iniciarBotonIS.hidden=true;

        console.log(localStorage.getItem('tokenAuth'));
        wrapper.classList.remove('active-popup');

        EmailInput.value="";
        passwordInput.value="";

    } 
    catch (error) 
    {
        console.error('Error en la solicitud:', error); 
        
    }

    

    

    
}

async function LogOut()
{

    var url= URLAPI+'loginOut'; 
    var Data={};
    Data.token=localStorage.getItem('tokenAuth');

   try 
    {
    const response= await fetch(url, {
        method: 'POST',
        body: JSON.stringify(Data),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    console.log(Data);
    responseData = await response.text();

    console.log('Respuesta del API:', responseData);

    cerrarBotonCS.hidden=true;
    iniciarBotonIS.hidden=false;
    localStorage.removeItem('tokenAuth');


    } 
    catch (error) 
    {
        console.error('Error en la solicitud:', error); 
        
    }


}



//Enviar Correo de Validacion
async function enviarCorreoValidacion()
{
    let Email=document.getElementById("EmailR").value;

    let password=document.getElementById("PassR").value;

    let userName=document.getElementById("UserR").value;

    localStorage.setItem('Email',Email);
    localStorage.setItem('PassR',password);
    localStorage.setItem('UserR',userName);

    var Data={};

    Data.toEmail=Email;

    var url= URLAPI+'EnviarEmails'; 
   try 
   {
   const response= await fetch(url, {
       method: 'POST',
       body: JSON.stringify(Data),
       headers: {
           'Content-Type': 'application/json'
       }
   });
    } 
    catch (error) 
    {
        console.error('Error en la solicitud:', error); 
        
    }
    

}



async function enviarCorreoReset(){

    let Email=document.getElementById("EmailRe").value;

    var data={};

    data.toEmail=Email;
    console.log("viendo");

    var url= URLAPI+'OlvidoContraseña'; 
    try 
    {
    const response= await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
         }
        });

        var dataEnviada= await response.text();
        localStorage.setItem('token',dataEnviada);
     } 
     catch (error) 
     {
         console.error('Error en la solicitud:', error); 
         
     }




    var url= URLAPI+'EnviarEmails'; 
    try 
    {
    const response= await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
     } 
     catch (error) 
     {
         console.error('Error en la solicitud:', error); 
         
     }


}

/* async function VerificarUsuario()
{
    var data={};

    data.token=localStorage.getItem('tokenAuth');


    var url= ApiURL+'Verificacion'; 
    try 
    {
        const response= await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {


            
            return false;
  
        }


        
        return true;

     } 
     catch (error) 
     {
         console.error('Error en la solicitud:', error); 
         
     }
}

document.addEventListener('DOMContentLoaded', async function() {

    var PaginaActual=window.location.href;

    if(await VerificarUsuario())
    {
        
        cerrarBoton.hidden=false;
        iniciarBoton.hidden=true;
        document.getElementById('miDiv').style.display = 'block';
    }
    else
    {
        iniciarBoton.hidden=false;
        cerrarBoton.hidden=true;
        console.log(PaginaActual);

        if(PaginaActual!='http://127.0.0.1:5500/index.html?#')
        {
            localStorage.setItem('dato','log');
        }
        
        window.location.href ='index.html?#';

        
    }

    var dato=localStorage.getItem('dato');

    if(dato=='log')
    {
        wrapper.classList.add('active-popup');
        localStorage.removeItem('dato');
    }
    
});  */

async function VerificarUsuario()
{
    var data={};

    data.token=localStorage.getItem('tokenAuth');


    var url= URLAPI+'Verificacion'; 
    try 
    {
        const response= await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {


            
            return false;
  
        }
        
        return true;

     } 
     catch (error) 
     {
         console.error('Error en la solicitud:', error); 
         
     }
}



async function IrPaginaVerificacion(pagina)
{
    console.log("llega?");
    if(await VerificarUsuario())
    {
        
        window.location.href =pagina;
    }
    else
    {
        window.location.href ='index.html?#';
        
        wrapper.classList.add('active-popup');
        console.log(pagina);
    }

}

document.addEventListener('DOMContentLoaded', async function() {

   

    if(await VerificarUsuario())
    {
        
        cerrarBotonCS.hidden=false;
        iniciarBotonIS.hidden=true;
    }
    else
    {
        iniciarBotonIS.hidden=false;
        cerrarBotonCS.hidden=true;

    }

    var dato=localStorage.getItem('dato');
    
    if(dato=='log')
    {
        wrapper.classList.add('active-popup');
        localStorage.removeItem('dato');
    }

    
    
}); 



