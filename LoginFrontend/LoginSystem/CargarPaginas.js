const cerrarBoton= document.getElementById('CS');
const iniciarBoton= document.getElementById('IS');




const ApiURL='https://localhost:7224/api/Auth/'; 

//https://localhost:7224/api/Auth/login



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





document.addEventListener('DOMContentLoaded', async function() {

   

    if(await VerificarUsuario())
    {
        console.log("verificar");
        cerrarBoton.hidden=false;
        iniciarBoton.hidden=true;
        document.getElementById('miDiv').style.display = 'block';
    }
    else
    {
        iniciarBotonIS.hidden=false;
        cerrarBotonCS.hidden=true;

        localStorage.setItem('dato','log');
        window.location.href ='index.html?#';
        


        
    }
    
}); 


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