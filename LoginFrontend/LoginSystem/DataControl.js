//import nodemailer from 'nodemailer';

//import {validarCorreo} from './services/mail.service.js';


const wrapper= document.querySelector('.wrapper');
const loginlink= document.querySelector('.login-link');
const registerlink= document.querySelector('.register-link');
const btnPopup= document.querySelector('.btnlogin-popup');

const ApiURL='https://localhost:7224/api/Auth/'; 

//https://localhost:7224/api/Auth/login

let responseData='';



registerlink.addEventListener('click',()=>{
    wrapper.classList.add('active');
});


loginlink.addEventListener('click',()=>{
    wrapper.classList.remove('active');
});


btnPopup.addEventListener('click',()=>{
    wrapper.classList.add('active-popup');
});





async function Login(){
    let userName=document.getElementById("Email").value;

    let password=document.getElementById("password").value;

    var Data={
        "correoElectronico": userName,
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
    responseData = await response.text();

    console.log('Respuesta del API:', responseData);
    } 
    catch (error) 
    {
        console.error('Error en la solicitud:', error); 
        
    }

    
    

    //mensajito

    let fecha=new Date();
    let horas= fecha.getHours();

    
    if(responseData=='Usuario Incorrecto')
    {
        alert("Usuario Incorrecto");
        let inputboxUN= document.getElementById("userName");
         inputboxUN.style.borderColor="red";

    }
    else if(responseData=='Contraseña incorrecta')
    {
        alert("Contraseña Erronea");
        let inputboxP= document.getElementById("password");
        inputboxP.style.borderColor="red";
    }
    else
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

async function Register()
{
    let Email=document.getElementById("EmailR").value;

    let password=document.getElementById("PassR").value;

    let userName=document.getElementById("UserR").value;

    console.log(Email);
    console.log(password);
    console.log(userName);

    var Data={};

    Data.nombreUsuario=userName;
    Data.correoElectronico=Email;
    Data.clave=password;


   var url= ApiURL+'register'; 
   //const mail= await validarCorreo(Email,'Token de prueba');
   //console.log("Correo enviado");
   try 
   {
   const response= await fetch(url, {
       method: 'POST',
       body: JSON.stringify(Data),
       headers: {
           'Content-Type': 'application/json'
       }
   });

   if(response!=null)
   {
    console.log(Data);
    console.log(response);
    wrapper.classList.remove('active');
    
    document.getElementById("EmailR").value=" ";

    document.getElementById("PassR").value="";

    document.getElementById("UserR").value=" ";

   }
   
   const mail= await validarCorreo(Email,'Token de prueba');
   alert("Usted acaba de ser registrado en nuestros sistemas");
   } 
   catch (error) 
   {
       console.error('Error en la solicitud:', error); 
       
   }
}




//Enviar Correo de Validacion




