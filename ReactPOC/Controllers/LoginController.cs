using Microsoft.AspNetCore.Mvc;

namespace ReactPOC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly ILogger<LoginController> _logger;

        public LoginController(ILogger<LoginController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<LoginViewModel> Get()
        {
            List<LoginViewModel> log = new List<LoginViewModel>();
            LoginViewModel usuario = new LoginViewModel();
            usuario.Username = "luis";
            usuario.Password = "sdfsdfsd";
            log.Add(usuario);

            return log.ToArray();
        }

        [HttpPost]
        public IActionResult Login([FromBody] LoginViewModel loginViewModel)
        {
            // Validar los datos del formulario
            if (ModelState.IsValid)
            {
                // Realizar las operaciones de autenticación y retornar la respuesta adecuada
                // ...
                return Ok(new { message = "Inicio de sesión exitoso" });
            }
            else
            {
                // Los datos del formulario son inválidos, retornar un mensaje de error
                return BadRequest(new { message = "Datos de inicio de sesión inválidos" });
            }
        }

        
    }
}
