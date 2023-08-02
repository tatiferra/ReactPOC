using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactPOC.Models;
using System.Drawing.Text;

namespace ReactPOC.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class LoginController : ControllerBase
    {
        private readonly ILogger<LoginController> _logger;
        private WebRuralContext db = new WebRuralContext(new DbContextOptions<WebRuralContext>());



        public LoginController(ILogger<LoginController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<LoginViewModel> Get()
        {
            
            List<LoginViewModel> log = new List<LoginViewModel>();
            LoginViewModel usuario = new LoginViewModel();
            usuario.id = 1;
            usuario.Username = "luis";
            usuario.Password = "sdfsdfsd";
            log.Add(usuario);

            return log.ToArray();
        }
        
        [HttpGet]
        public IEnumerable<LoginViewModel> ObtenerUsuarios()
        {
            //using WebRuralContext ctx = new WebRuralContext(new DbContextOptions<WebRuralContext>());
            Eventos e = db.Eventos.First();

            List<LoginViewModel> log = new List<LoginViewModel>();
            LoginViewModel usuario = new LoginViewModel();
            usuario.id = 1;
            usuario.Username = "luis";
            usuario.Password = "sdfsdfsd";
            log.Add(usuario);
            LoginViewModel usuario1 = new LoginViewModel();
            usuario1.id = 2;    
            usuario1.Username = "daniela";
            usuario1.Password = "dsfsdf";
            log.Add(usuario1);
            return log.ToArray();
        }

        [HttpPost]
        public IActionResult Login([FromBody] LoginViewModel loginViewModel)
        {
            // Validar los datos del formulario
            if (ModelState.IsValid)
            {
                // Realizar las operaciones de autenticación y retornar la respuesta adecuada
                Usuarios Usuario = db.Usuarios.FirstOrDefault(u => u.Email == loginViewModel.Username);
                if (Usuario == null) {
                    return BadRequest(new { message = "Usuario Inexistente" });
                }
                else
                {
                    if (Usuario.Email == loginViewModel.Username && Usuario.Password == loginViewModel.Password)
                    {
                        return Ok(new { message = "Inicio de sesión exitoso", token = "20203013", user = Usuario, role = "Administrador" });
                    }
                    else 
                    {
                        return BadRequest(new { message = "Clave Incorrecta" });
                    }
                    
                }
                
            }
            else
            {
                // Los datos del formulario son inválidos, retornar un mensaje de error
                return BadRequest(new { message = "Datos inválidos" });
            }
        }

        
    }
}
