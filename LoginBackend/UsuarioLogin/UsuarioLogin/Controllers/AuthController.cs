using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using UsuarioLogin.DTO;
using UsuarioLogin.Models;

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

        public static Usuario usuario= new Usuario();


        

        [HttpPost("register")]

        public async Task<ActionResult<Usuario>> Register(UsuariosDTO usuariodto)
        {
            CreatePasswordHash(usuariodto.Clave, out byte[] passwordHash, out byte[] passwordSalt);


            usuario.NombreUsuario=usuariodto.NombreUsuario;
            usuario.CorreoElectronico=usuariodto.CorreoElectronico;
            usuario.ClaveHash = passwordHash;
            usuario.ClaveSalt = passwordSalt;


            ManaUsersContext.Add(usuario);
            await ManaUsersContext.SaveChangesAsync();
            return Ok(usuario);
        }


        [HttpPost("login")]

        public async Task<ActionResult<string>>Login(UsuariosDTO usuariosDTO)
        {
            
            var user= await ManaUsersContext.Usuarios.Where(u => u.NombreUsuario == usuariosDTO.NombreUsuario)
                .Select(u=>u.NombreUsuario).SingleOrDefaultAsync();

            var contraHash = await ManaUsersContext.Usuarios.Where(u=>u.NombreUsuario==usuariosDTO.NombreUsuario)
                .Select(u=>u.ClaveHash).SingleOrDefaultAsync();

            var contraSalt = await ManaUsersContext.Usuarios.Where(u => u.NombreUsuario == usuariosDTO.NombreUsuario)
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
