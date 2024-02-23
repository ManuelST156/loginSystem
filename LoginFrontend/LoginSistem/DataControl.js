

function Login(){
    let userName=document.getElementById("Email");

    let password=document.getElementById("password");

   /*  userName.style.borderColor="black";
    password.style.borderColor="black"; */

    let usuario="Manuel@sa.com";
    let contraseña="Manuel123#";

    console.log(userName);
    console.log(password);


    if((userName.value==usuario) && (password.value== contraseña))
    {
        let fecha=new Date();
        let horas= fecha.getHours();

        console.log(fecha);

        console.log(horas);

        if(horas<18)
        {
            alert("Buenas Tardes! Ha accedido a su sistema");
        }
        else if(horas>19) {
            alert("Buenas Noches! Ha accedido a su sistema"); 
        }


        
    }
    else if((userName.value==usuario) && (password.value!= contraseña)){
        alert("Contraseña Erronea");
        let inputboxP= document.getElementById("password");
        /* inputboxP.style.borderColor="red"; */
    }
    else if((userName.value!=usuario) && (password.value== contraseña)){
        alert("Usuario Incorrecto");
        let inputboxUN= document.getElementById("userName");
       /*  inputboxUN.style.borderColor="red"; */
    }
    else{
        alert("Usuario y Contraseña Invalida");
        let inputboxUN= document.getElementById("userName");
        let inputboxP= document.getElementById("password");

      /*   inputboxUN.style.borderColor="red";
        inputboxP.style.borderColor="red"; */
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