using System.ComponentModel.DataAnnotations;

namespace UsuarioLogin.DTO
{
    public class UsuarioResetDTO
    {
        [Required]
        public string token { get;set;}

        [Required, MinLength(6, ErrorMessage = "Contraseña debe de ser de mas de 6 digitos")]
        public string clave { get;set;}


        [Required, Compare("clave",ErrorMessage ="La clave y la clave de confirmacion no coinciden"), MinLength(6, ErrorMessage = "Contraseña debe de ser de mas de 6 digitos")]
        public string claveConfirmacion { get;set;}
    }
}
