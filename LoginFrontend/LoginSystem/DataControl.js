//import nodemailer from 'nodemailer';

//import {validarCorreo} from './services/mail.service.js';

let EmailInput=document.getElementById("Email");
let passwordInput=document.getElementById("password");

const cerrarBoton= document.getElementById('CS');
const iniciarBoton= document.getElementById('IS');

const wrapper= document.querySelector('.wrapper');
const loginlink= document.querySelector('.login-link');
const loginlink2= document.querySelector('.login-link2');
const registerlink= document.querySelector('.register-link');
const forgotlink=document.querySelector('.forgot-link');
const btnPopup= document.querySelector('.btnlogin-popup');

const ApiURL='https://localhost:7224/api/Auth/'; 

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
})

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


   var url= ApiURL+'login'; 

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

        cerrarBoton.hidden=false;
        iniciarBoton.hidden=true;

        console.log(localStorage.getItem('tokenAuth'));
        wrapper.classList.remove('active-popup');

        EmailInput.value="";
        passwordInput.value="";

    } 
    catch (error) 
    {
        console.error('Error en la solicitud:', error); 
        
    }

    
    /* if(response.ok)
    {
        console.log(horas);
        if(horas<18&&horas>12)
        {
            alert("Buenas Tardes! Ha accedido a su sistema");
        }
        else if(horas>6 && horas<12) {
            alert("Buenos Dias! Ha accedido a su sistema"); 
        }
        else
        {
            alert("Buenas Noches! Ha accedido a su sistema: "); 
        }
    } */
    

    
}

async function LogOut()
{

    var url= ApiURL+'loginOut'; 
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

    cerrarBoton.hidden=true;
    iniciarBoton.hidden=false;
    localStorage.removeItem('tokenAuth');


    } 
    catch (error) 
    {
        console.error('Error en la solicitud:', error); 
        
    }


}




let reloj=document.getElementById("reloj");
    let comida="hola";
    console.log(comida);
    console.log(reloj);

    //Funcion Interval
    setInterval(() => {
    let Hora= new Date();
    reloj.innerHTML=Hora.toLocaleTimeString();//`${Fecha.getHours()}:${Fecha.getMinutes()}:${Fecha.getSeconds()}`;
    


}, 1000);



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

    var url= ApiURL+'EnviarEmails'; 
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

    var url= ApiURL+'OlvidoContraseña'; 
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




    var url= ApiURL+'EnviarEmails'; 
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



async function AutenticacionUsuario()
{

}


