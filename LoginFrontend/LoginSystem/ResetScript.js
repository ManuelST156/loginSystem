const ApiURL='https://localhost:7224/api/Auth/'; 



async function resetearPass()
{
    let pass=document.getElementById('Pass').value;
    let passConfirmacion=document.getElementById('PassConfirmacion').value;

    console.log("mierda");
    var token=localStorage.getItem('token');
    var data={};
    console.log(token);

    data.token=token;
    data.clave=pass;
    data.claveConfirmacion=passConfirmacion;

    console.log(data);

    var url= ApiURL+'ResetPass'; 
    try 
    {
    const response= await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
         }
        });

        if(!response.ok)
        {
            var dataStatus = response.status;
            const dataRecibida = await response.json(); 
            var dataInfo= dataRecibida.errors.claveConfirmacion[0];

            
            console.log("Error "+dataStatus+": "+dataInfo);
            alert("Error "+dataStatus+": "+dataInfo);
            

            
        }
        else
        {
            var dataRecibida= await response.text();
        
            console.log(dataRecibida);

            
            localStorage.removeItem('token');
            console.log("eliminado");
            alert(dataRecibida);
            
           
        }



        

     } 
     catch (error) 
     {
         console.error('Error en la solicitud:', error); 
         
     }

     
    
}


