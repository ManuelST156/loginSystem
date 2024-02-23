using System;
using System.Collections.Generic;

namespace UsuarioLogin.Models
{
    public partial class Usuario
    {
        public int IdUsuario { get; set; }
        public string? NombreUsuario { get; set; }
        public string? CorreoElectronico { get; set; }
        public byte[]? ClaveHash { get; set; }
        public byte[]? ClaveSalt { get; set; }
    }
}
