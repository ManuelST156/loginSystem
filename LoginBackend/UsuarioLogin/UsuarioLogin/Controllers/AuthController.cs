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

namespace UsuarioLogin.Controllers
{
    [Route("api/Auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ManaUsersContext ManaUsersContext;
        private readonly IConfiguration _configuration;

        public AuthController(ManaUsersContext context, IConfiguration configuration)
        {
            this.ManaUsersContext = context;
            _configuration = configuration;

        }

        //public static Usuario usuario= new Usuario();


        

        [HttpPost("register")]

        public async Task<ActionResult<Usuario>> Register(UsuariosDTO usuariodto)
        {
            CreatePasswordHash(usuariodto.Clave, out byte[] passwordHash, out byte[] passwordSalt);

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


        [HttpPost("login")]

        public async Task<ActionResult<string>>Login(UsuariosLogDTO usuariosDTO)
        {
            
            var user= await ManaUsersContext.Usuarios.Where(u => u.CorreoElectronico == usuariosDTO.CorreoElectronico)
                .Select(u=>u.NombreUsuario).SingleOrDefaultAsync();

            var contraHash = await ManaUsersContext.Usuarios.Where(u=>u.CorreoElectronico==usuariosDTO.CorreoElectronico)
                .Select(u=>u.ClaveHash).SingleOrDefaultAsync();

            var contraSalt = await ManaUsersContext.Usuarios.Where(u => u.CorreoElectronico == usuariosDTO.CorreoElectronico)
                .Select(u => u.ClaveSalt).SingleOrDefaultAsync();

            

            if (user==null)
            {
                return BadRequest("Usuario Incorrecto");
            }

            if(!VerifyPasswordHash(usuariosDTO.Clave, contraHash, contraSalt))
            {
                return BadRequest("Contraseña incorrecta");
            }

            string Token = CreateToken(user);
            return Ok(Token);
            
        }


        [HttpPost]

        public IActionResult SendEmail(string body, string subject, string dirigido)
        {
            //var email = new MimeMessage();
            //email.From.Add(MailboxAddress.Parse("cody30@ethereal.email"));
            //email.To.Add(MailboxAddress.Parse("cody30@ethereal.email"));
            //email.Subject = "Prueba de Email";
            //email.Body = new TextPart(TextFormat.Html)
            //{
            //    Text = body
            //};

            //using var smtp = new SmtpClient();
            //smtp.Connect("smtp.ethereal.email", 587, SecureSocketOptions.StartTls);
            //smtp.Authenticate("cody30@ethereal.email", "jQGc4TcuSqUDcNr2pp");
            //smtp.Send(email);
            //smtp.Disconnect(true);

            string fromMail = "eldeveloper62@gmail.com";
            string fromPass = "zfqoggimvcvguzus";

            MailMessage email = new MailMessage();
            email.From = new MailAddress(fromMail);
            email.Subject = subject;

            email.To.Add(new MailAddress(dirigido));

            email.Body = body;

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





        private string CreateToken(string usuario)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, usuario)
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddSeconds(60),
                signingCredentials: creds
                );

            var jwt= new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        private void  CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using(var hmac= new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }

        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash= hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));



                return computedHash.SequenceEqual(passwordHash);
            }
        }
    }
}
