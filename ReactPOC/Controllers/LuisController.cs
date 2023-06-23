using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ReactPOC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LuisController : ControllerBase
    {
        private readonly ILogger<LuisController> _logger;

        public LuisController(ILogger<LuisController> logger)
        {
            _logger = logger;
        }
        public IActionResult Get()
        {
            return Ok(new { message = "Inicio de sesión exitoso" });
        }
    }
}
