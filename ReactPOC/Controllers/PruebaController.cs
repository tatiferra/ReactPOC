using Microsoft.AspNetCore.Mvc;

namespace ReactPOC.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PruebaController : ControllerBase
    {
        
        public IActionResult Get()
        {
            return Ok(new { message = "Inicio de sesión exitoso" });
        }
    }
}
