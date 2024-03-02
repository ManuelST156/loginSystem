using System.ComponentModel.DataAnnotations;

namespace UsuarioLogin.DTO
{
    public class UsuariosLogDTO
    {
        [Required, EmailAddress]
        public string CorreoElectronico { get; set; }


        [Required, MinLength(6, ErrorMessage = "Contraseña debe de ser de mas de 6 digitos")]
        public string Clave {  get; set; }

    }
}
