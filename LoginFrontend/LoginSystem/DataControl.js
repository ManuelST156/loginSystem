//Obtenemos elemento para presetar el reloj

let reloj=document.getElementById('reloj');

    

//Funcion Interval para cargar el reloj actual
setInterval(() => {
    let Hora= new Date();
    reloj.innerHTML=Hora.toLocaleTimeString();//`${Fecha.getHours()}:${Fecha.getMinutes()}:${Fecha.getSeconds()}`;



}, 1000);


//Variables que contienen elementos del html

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

var close=document.getElementById("close");
var closeR=document.getElementById("closeR");

//URl de la api
const URLAPI='https://localhost:7224/api/Auth/'; 



let responseData='';


//Event Listener del form para login/register/PasswordReset
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




//Funcion para logearse en la app
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

        responseData= await response.json();

        if(response.ok)
        {
            
            localStorage.setItem('tokenAuth',responseData.token);

            cerrarBotonCS.hidden=false;
            iniciarBotonIS.hidden=true;

            console.log(localStorage.getItem('tokenAuth'));
            wrapper.classList.remove('active-popup');

            EmailInput.value="";
            passwordInput.value="";
            
        }
        else{

            
            if(responseData.errors!=undefined)
            {

                alert(responseData.errors.Clave);
                console.log(responseData.errors.Clave);
            }
            else
            {
                alert(responseData.mensajeError);
                console.log(responseData.mensajeError);
            }
            
           
            
                
        }

    } 
    catch (error) 
    {
        console.error('Error en la solicitud:', error); 
        
    }

    

    

    
}


//Funcion para Cerrar Sesion en la app
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
    window.location.href ='index.html?#';

    } 
    catch (error) 
    {
        console.error('Error en la solicitud:', error); 
        
    }


}


//Permite que se pueda usar la funcion en otros docs js
window.LogOut = LogOut;

//Funcion para Enviar Correo de Validacion
async function enviarCorreoValidacion()
{
    let Email=document.getElementById("EmailR").value;

    let password=document.getElementById("PassR").value;

    let userName=document.getElementById("UserR").value;

    if(password.length<6)
    {
        return alert("La contraseña debe de ser de  6 o más digitos");
    }



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


//Funcion para Enviar correo para el reseteo de contraseña
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
        if(response.ok)
        {
            
            localStorage.setItem('token',dataEnviada);
        }
        else
        {
            alert(dataEnviada);
        }
        
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


//Funcion para verificar el usuario este logeado
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


//Funcion para ir a la pagina una vez este verificada
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


//Funcion que se ejecuta cuando carga una pagina
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




//Funcion para desactivar el cuadro del form al logearse/registrarse
close.addEventListener("click", function() {
    
    wrapper.classList.remove('active-popup');
    EmailInput.value="";
    passwordInput.value="";
});

closeR.addEventListener("click", function() {
    
    
    wrapper.classList.remove('active');
    wrapper.classList.remove('active-popup');
    EmailInput.value="";
    passwordInput.value="";

    
});


