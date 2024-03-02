using System.ComponentModel.DataAnnotations;

namespace UsuarioLogin.DTO
{
    public class CorreoDTO
    {
        //public string Subject { get; set; } 

        [Required,EmailAddress]
        public string ToEmail { get; set; }

        //public string Body { get; set; }




    }
}
