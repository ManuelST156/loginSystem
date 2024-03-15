
//Guardar en las variables los elementos de la pagina

const cerrarBoton= document.getElementById('CS');
const iniciarBoton= document.getElementById('IS');



//Link de la Api
const ApiURL='https://localhost:7224/api/Auth/'; 




//Funcion para Verificar que el usuario este logeado
async function VerificarUsuario()
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


//Funcion para Comprobar el tiempo del token y su fecha de exp
async function ComprobarTiempo()
{

    var data={};

    data.token=localStorage.getItem('tokenAuth');


    var url= ApiURL+'CompDate'; 
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


//Funcion para generar un nuevo token para mantener actualizado el tiempo del token
async function ReiniciarToken()
{

    var data={};

    data.token=localStorage.getItem('tokenAuth');


    var url= ApiURL+'ReiniciarToken'; 
    try 
    {
        const response= await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            responseData = await response.text();
            localStorage.removeItem('tokenAuth');
            localStorage.setItem('tokenAuth', responseData);
            console.log(responseData);
            
        }

     } 
     catch (error) 
     {
         console.error('Error en la solicitud:', error); 
         
     }


}


//Funcion para cuando cargue la pagina
document.addEventListener('DOMContentLoaded', async function() {

   

    if(await VerificarUsuario())
    {

        console.log("Usuario Verificado");
        if(await ComprobarTiempo())
        {
            ReiniciarToken();

            console.log("Buen Login");
            cerrarBoton.hidden=false;
            iniciarBoton.hidden=true;
            document.getElementById('miDiv').style.display = 'block';

            if(window.location.pathname=='/VerUsuarios.html')
            {
                console.log("Sera");
                await VerUsuarios();
                
            }
            
            
        }
        else
        {
            console.log("Acabo Tiempo");
            alert("Se ha acabado la sesion");
            window.LogOut();
            window.location.href ='index.html?#';
        }
 
    }
    else
    {
        iniciarBotonIS.hidden=false;
        cerrarBotonCS.hidden=true;

        localStorage.setItem('dato','log');
        window.location.href ='index.html?#';
        


        
    }
    
}); 


//Funcion para ir a una pagina
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

//
async function VerUsuarios()
 {
     console.log("hola");
    var url = ApiURL + 'UsuariosConectados';


    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });


        var usuarios=await response.json();
        var html= '';
        console.log(usuarios);
        if(response.ok)
        {

            const usuariosSeparados = usuarios.map(item => {
                const partes = item.split(' ');
                return { nombreUsuario: partes[0], Estado: partes[1] };
            });

            console.log(usuariosSeparados);

            for(usuario of usuariosSeparados)
            {
                
                var row = `<tr>
                <td>${usuario.nombreUsuario}</td>
                <td>${usuario.Estado}</td>
                </tr>`

                html= html+row
                document.querySelector('#usuarios > tbody').outerHTML=html;
            }
        }


    } catch (error) {
        console.error('Error en la solicitud:', error);
    }


 }


