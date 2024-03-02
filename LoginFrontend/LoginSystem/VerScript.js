const ApiURL='https://localhost:7224/api/Auth/'; 


document.addEventListener('DOMContentLoaded', async function () {
    // Código que se ejecutará una vez que el DOM esté completamente cargado

    var url = ApiURL + 'register';
    var data = {};

    data.nombreUsuario=localStorage.getItem('UserR');
    data.correoElectronico=localStorage.getItem('Email');
    data.clave=localStorage.getItem('PassR');

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });


        // Hacer algo con la respuesta si es necesario
        console.log('Respuesta del servidor:', response);

        localStorage.removeItem('UserR');
        localStorage.removeItem('Email');
        localStorage.removeItem('PassR');
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }

    
});
