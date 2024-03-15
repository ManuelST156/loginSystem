using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MimeKit;
using MimeKit.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Security.Cryptography;
using UsuarioLogin.DTO;
using UsuarioLogin.Models;
using MailKit.Net.Smtp;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;
using System.Text;
using Microsoft.Extensions.Configuration;
using System.Linq;

namespace UsuarioLogin.Controllers
{
    [Route("api/Auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ManaUsersContext ManaUsersContext;
        private readonly IConfiguration _configuration;
        private readonly IConfiguration secretKey;

        public AuthController(ManaUsersContext context, IConfiguration configuration)
        {
            this.ManaUsersContext = context;
            _configuration = configuration;
            
        }


        //1-) Endpoints con las funcionalidades principales de la aplicacion
        #region Endpoints


        //1.1- Metodo para Registrar Usuarios

        #region Registrar


        [HttpPost("register")]

        public async Task<ActionResult<Usuario>> Register(UsuariosDTO usuariodto)
        {
            CrearPasswordHash(usuariodto.Clave, out byte[] passwordHash, out byte[] passwordSalt);

            var busqueda = await ManaUsersContext.Usuarios.Where(u => u.NombreUsuario == usuariodto.NombreUsuario || 
            u.CorreoElectronico==usuariodto.CorreoElectronico).SingleOrDefaultAsync();

            if(busqueda!=null)
            {
                return BadRequest("El Usuario o Correo ya ha sido registrado");
            }

            var usuario = new Usuario()
            {
                NombreUsuario = usuariodto.NombreUsuario,
                CorreoElectronico = usuariodto.CorreoElectronico,
                ClaveHash = passwordHash,
                ClaveSalt = passwordSalt,

            };


            ManaUsersContext.Add(usuario);
            await ManaUsersContext.SaveChangesAsync();
            return Ok(usuario);
        }

        #endregion


        //1.2- Metodo para Loguear Usuarios
        #region Login


        [HttpPost("login")]

        public async Task<ActionResult<string>> Login(UsuariosLogDTO usuariosDTO)
        {

            var UserLogin = await ManaUsersContext.Usuarios.Where(u => u.CorreoElectronico == usuariosDTO.CorreoElectronico)
                .SingleOrDefaultAsync();

            var user = await ManaUsersContext.Usuarios.Where(u => u.CorreoElectronico == usuariosDTO.CorreoElectronico)
                .Select(u => u.NombreUsuario).SingleOrDefaultAsync();

            var contraHash = await ManaUsersContext.Usuarios.Where(u => u.CorreoElectronico == usuariosDTO.CorreoElectronico)
                .Select(u => u.ClaveHash).SingleOrDefaultAsync();

            var contraSalt = await ManaUsersContext.Usuarios.Where(u => u.CorreoElectronico == usuariosDTO.CorreoElectronico)
                .Select(u => u.ClaveSalt).SingleOrDefaultAsync();

            var idUser = await ManaUsersContext.Usuarios.Where(u => u.CorreoElectronico == usuariosDTO.CorreoElectronico)
                .Select(u => u.IdUsuario).SingleOrDefaultAsync();

            if (UserLogin.tokenVerificacion != null)
            {
                return BadRequest($"El Usuario {user} ya esta logueado");
            }

            if (user == null)
            {
                return BadRequest("Usuario Incorrecto");
            }

            if (!VerificarPasswordHash(usuariosDTO.Clave, contraHash, contraSalt))
            {
                return StatusCode(StatusCodes.Status400BadRequest, new {mensajeError= "Contraseña Incorrecta" });
            }


            var token = CreateToken(user);

            UserLogin.tokenVerificacion =token;

            UserLogin.tokenDate=DateTime.Now;

            await ManaUsersContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status200OK,new { token = token, mensaje=$"El Usuario {UserLogin.NombreUsuario} ha Iniciado Sesion"}); 


        }

        #endregion



        //1.3- Metodo para Cerrar Sesion

        #region LogOut

        [HttpPost("loginOut")]
        public async Task<IActionResult>LogOut(VerificacionDTO verificacion)
        {
            var user = await ManaUsersContext.Usuarios.FirstOrDefaultAsync(u => u.tokenVerificacion == verificacion.token);

            if (user == null)
            {
                return BadRequest("Token Invalido");
            }

            user.tokenDate = null;
            user.tokenVerificacion = null;

            await ManaUsersContext.SaveChangesAsync();

            return Ok($"Usuario {user.NombreUsuario} acaba de Cerrar Sesion");

        }

        #endregion


        //1.4- Metodo para Enviar Email de Confirmacion

        #region Enviar Emails

        [HttpPost("EnviarEmails")]

        public async Task<IActionResult> SendEmail(CorreoDTO correoDto)
        {

            //Otra Forma de Enviar Correos
            /*
            
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse("eldeveloper62@gmail.com"));
            email.To.Add(MailboxAddress.Parse("eldeveloper62@gmail.com"));
            email.Subject = "Prueba de Email";
            email.Body = new TextPart(TextFormat.Html)
            {
                Text = body
            };

            using var smtp = new SmtpClient();
            smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            smtp.Authenticate("eldeveloper62@gmail.com", "zfqoggimvcvguzus");
            smtp.Send(email);
            smtp.Disconnect(true);

            */

            IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();

            var emailConfig = configuration.GetSection("EmailConfiguration");
            string fromMail = emailConfig["CorreoUsuario"];
            string fromPass = emailConfig["ContrasenaUsuario"];

            var token = await ManaUsersContext.Usuarios.Where(u => u.CorreoElectronico == correoDto.ToEmail)
                .Select(u => u.tokenResetClave).SingleOrDefaultAsync();

            string body = @"<!DOCTYPE html>
            <html lang=es>
            <head>
              <meta charset=""UTF-8"">
              <meta name=""viewport"" content=""""width=device-width, initial-scale=1.0>
              <title>Botón Verde Grande con Hover y Click</title>
              <style>

                .Vebutton {
                  background-color:rgb(29, 4, 97);
                  color: white;
                  padding: 15px 20px;
                  font-size: 18px;
                  border: none;
                  border-radius: 5px;
                  cursor: pointer;
                  transition: background-color 0.3s; 
                }

                /* Efecto hover */
                .Vebutton:hover {
                  background-color: rgb(142, 103, 248); /* Cambia el color de fondo al pasar el mouse */
                }

                /* Efecto click (estado :active) */
                .Vebutton:active {
                  background-color: pink; /* Cambia el color de fondo al hacer clic */
                }
              </style>

                
            </head>
            <body>


            <h1>Confirmar su Correo Electronico para terminar el proceso de registro</h1>

            <p>Si desea ser parte de nuestra comunidad, favor validar el correo con el siguiente boton:</p>
            
            <a href=""http://127.0.0.1:5500/verificacion.html?#""><button class=""Vebutton"" >Confirmar Correo Electronico</button></a>
            


            

            <p>Este correo fue de parte de Manuel Sanchez</p>

            <p>&copy; by Manuel Sanchez</p>

            </body>
            </html>";


            string bodyPass = @"<!DOCTYPE html>
            <html lang=es>
            <head>
              <meta charset=""UTF-8"">
              <meta name=""viewport"" content=""""width=device-width, initial-scale=1.0>
              <title>Botón Verde Grande con Hover y Click</title>
              <style>

                .Vebutton {
                  background-color:rgb(29, 4, 97);
                  color: white;
                  padding: 15px 20px;
                  font-size: 18px;
                  border: none;
                  border-radius: 5px;
                  cursor: pointer;
                  transition: background-color 0.3s; 
                }

                /* Efecto hover */
                .Vebutton:hover {
                  background-color: rgb(142, 103, 248); /* Cambia el color de fondo al pasar el mouse */
                }

                /* Efecto click (estado :active) */
                .Vebutton:active {
                  background-color: pink; /* Cambia el color de fondo al hacer clic */
                }
              </style>

                
            </head>
            <body>


            <h1>Seleccione la opcion de Cambiar contraseña para modificar sus credenciales</h1>

            <p>Si desea ser parte de nuestra comunidad, favor validar el correo con el siguiente boton:</p>
            
            <a href=""http://127.0.0.1:5500/resetPass.html?#""><button class=""Vebutton"" >Cambiar Contraseña</button></a>
            


            

            <p>Este correo fue de parte de Manuel Sanchez</p>

            <p>&copy; by Manuel Sanchez</p>

            </body>
            </html>";


            MailMessage email = new MailMessage();
            email.From = new MailAddress(fromMail);
            email.Subject = "Correo de Confirmacion";   //correoDto.Subject;

            email.To.Add(new MailAddress(correoDto.ToEmail));

            if (token != null)
            {
                email.Body = bodyPass;
            }
            else
            {
                email.Body = body;
            }


            email.IsBodyHtml = true;

            var smtpClient = new System.Net.Mail.SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(fromMail, fromPass),
                EnableSsl = true,
            };


            smtpClient.Send(email);

            return Ok();

        }

        #endregion



        //1.5- Metodo para la Verificacion de Usuario al Loguearse
        #region Verificacion de Usuario

        [HttpPost("Verificacion")]

        public async Task<IActionResult> Verificar(VerificacionDTO verificacion)
        {


            var user = await ManaUsersContext.Usuarios.FirstOrDefaultAsync(u => u.tokenVerificacion == verificacion.token);

            if (user == null ||verificacion.token==null)
            {
                return BadRequest("Token Invalido");
            }


            

            return Ok("Usuario Verificado");

        }
        #endregion


        //1.6- Metodo para Cuando Olvidas Contraseña

        #region Crear token de Contraseñas



        [HttpPost("OlvidoContraseña")]

        public async Task<IActionResult> OlvidarPass(CorreoDTO correo)
        {
            var user = await ManaUsersContext.Usuarios.FirstOrDefaultAsync(u => u.CorreoElectronico == correo.ToEmail);

            if (user == null)
            {
                return BadRequest("Email no registrado");


            }

            user.tokenResetClave = CrearRandomToken();
            user.tokenExpResetClave = DateTime.Now.AddMinutes(20);

            await ManaUsersContext.SaveChangesAsync();


            return Ok(user.tokenResetClave);


        }

        #endregion



        //1.7 -Metodo para Resetear Contraseña

        #region Resetear Contraseña

        [HttpPost("ResetPass")]

        public async Task<IActionResult> ResetPassWord(UsuarioResetDTO usuarioReset)
        {
            var user = await ManaUsersContext.Usuarios.FirstOrDefaultAsync(u => u.tokenResetClave == usuarioReset.token);

            if (user == null || user.tokenExpResetClave < DateTime.Now)
            {
                return BadRequest("Token Invalido");
            }

            if (usuarioReset.clave != usuarioReset.claveConfirmacion)
            {
                return BadRequest("Contraseña no coinciden Invalido");
            }

            if (usuarioReset.clave.Length < 6)
            {
                return BadRequest("La contraseña debe de tener más de 6 digitos");
            }

    
            CrearPasswordHash(usuarioReset.clave, out byte[] passwordHash, out byte[] passwordSalt);

            user.ClaveHash = passwordHash;
            user.ClaveSalt = passwordSalt;

            user.tokenResetClave = null;
            user.tokenExpResetClave = null;

            await ManaUsersContext.SaveChangesAsync();

            return Ok("Contraseña Guardada");
        }

        #endregion


        //1.8- Metodo para verificar tiempo de tokens

        #region Token Date Verificacion

        [HttpPost("CompDate")]
        public async Task<ActionResult>CompDate(VerificacionDTO verificacion)
        {
            var user= await ManaUsersContext.Usuarios.FirstOrDefaultAsync(u => u.tokenVerificacion == verificacion.token);

            if (user == null || verificacion.token == null)
            {
                return BadRequest("Token Invalido");
            }

            var time = DescifrarDate(verificacion.token);

            
            if (time < DateTime.Now)
            {
                Console.WriteLine(DateTime.Now);
                Console.WriteLine(time);
                return BadRequest(false);
                
            }

            Console.WriteLine(DateTime.Now);
            Console.WriteLine(time);
            return Ok(true);
            
        }






        #endregion


        //1.9- Token de Reinicio de Token

        #region Reinicio Token

        [HttpPost("ReiniciarToken")]
        public async Task<ActionResult> ReinicioToken(VerificacionDTO verificacion)
        {

            var user = await ManaUsersContext.Usuarios.FirstOrDefaultAsync(u => u.tokenVerificacion == verificacion.token);

            if (user == null || verificacion.token == null)
            {
                return BadRequest("Token Invalido");
            }

            var token = CreateToken(user.NombreUsuario);

            user.tokenVerificacion = token;

            user.tokenDate = DateTime.Now;

            

            await ManaUsersContext.SaveChangesAsync();

            return Ok(user.tokenVerificacion);


        }


        #endregion


        //1.10- Metodo para generar un listado de todos los usuarios conectados

        [HttpGet("UsuariosConectados")]
        public async Task<ActionResult<IEnumerable<string>>> UsuariosConectados()
        {
            var busqueda = await ManaUsersContext.Usuarios.ToListAsync();

            List<string> listaUsuarios = new List<string>();

            foreach (var user in busqueda)
            {
                if(user.tokenVerificacion==null)
                {
                    listaUsuarios.Add(user.NombreUsuario + " Desconectado");
                }
                else
                {
                    listaUsuarios.Add(user.NombreUsuario + " Conectado");
                }
            }
            return listaUsuarios;
        }


        #endregion


        


        //2-) Funciones para crear un token por usuario -- Usada para cuando un usuario se loguea

        #region Metodos de Creacion de Tokens

        //2.1- Metodo 1 utilizando JwtSecurityToken

        #region Metodo 1 JwtSecurityToken
        private string CreateToken(string usuario)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, usuario)
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            //var randomComponent = Guid.NewGuid().ToString();

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(5),
                signingCredentials: creds
                );

            //token.Header.Add("random_component", randomComponent);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        #endregion


        //2.2- Metodo 2 utilizando SecuritytokenDescriptor

        #region Metodo 2 SecuritytokenDescriptor
        private string CrearToken(string usuario)
        {

            IConfigurationRoot secretKeyP = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();

            var secretKey= secretKeyP.GetSection("settings").GetSection("secretKey").ToString();


            var keyBytes = Encoding.ASCII.GetBytes(secretKey);
            var claims = new ClaimsIdentity();
            claims.AddClaim(new Claim(ClaimTypes.NameIdentifier, usuario));

            var tokenDescripcion = new SecurityTokenDescriptor
            {
                Subject = claims,
                Expires = DateTime.UtcNow.AddMinutes(5),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenConfig = tokenHandler.CreateToken(tokenDescripcion);

            var tokenCreado = tokenHandler.WriteToken(tokenConfig);

            return tokenCreado;

            
        }

        #endregion


        //2.3- Funcion que crea un token random para el tema del reseteo de contraseña

        #region Metodo 3 TokenRandom
        private string CrearRandomToken()
        {
            return Convert.ToHexString(RandomNumberGenerator.GetBytes(64));
        }

        #endregion


        //2.4- Funcion para obtener la fecha de expiracion del token generado

        #region Metodo 4 Descifrar Token Exp Date


        private DateTime DescifrarDate(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.ReadToken(token) as JwtSecurityToken;

            //DateTime expiracion = securityToken.ValidTo;


            //return expiracion;

            if (securityToken == null)
            {
                // Token inválido
                throw new ArgumentException("Invalid token");
            }

            var expValor = securityToken.Payload["exp"];
            long expUnixTimeSeconds = (long)expValor;

            DateTime localTime = DateTimeOffset.FromUnixTimeSeconds(expUnixTimeSeconds).LocalDateTime;

            return localTime;
        }

        #endregion

        #endregion



        //3-) Funcion utilizada para cifrar la contraseña que el usuario quiere tener

        #region Metodos para Cifrar y Verificar Contraseñas


        //3.1- Metodo utilizado para cifrar contraseña creando un Hash
        #region  Metodo para Cifrar Contraseñas 
        private void  CrearPasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using(var hmac= new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }

        }
        #endregion



        //3.2- Funcion usada para comparar la contraseña al loguearse con la registrada, cifra la del logue y compara cifrados

        #region Metodo para Verificar Contraseña
        private bool VerificarPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash= hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));



                return computedHash.SequenceEqual(passwordHash);
            }
        }


        #endregion


        #endregion


        
    }
}
