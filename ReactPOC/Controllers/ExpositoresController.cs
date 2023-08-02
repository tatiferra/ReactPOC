using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactPOC.Models;
using System.Drawing.Text;

namespace ReactPOC.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class ExpositoresController : ControllerBase
    {
        private readonly ILogger<ExpositoresController> _logger;
        private WebRuralContext db = new WebRuralContext(new DbContextOptions<WebRuralContext>());


        public ExpositoresController(ILogger<ExpositoresController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<TipoIngreso> ObtenerTiposIngreso()
        {

            List<TipoIngreso> listaTipos = db.TipoIngreso.ToList();

            return listaTipos.ToArray();
        }
        
        [HttpGet]
        public IEnumerable<Expositores> ObtenerExpositores()
        {
            //using WebRuralContext ctx = new WebRuralContext(new DbContextOptions<WebRuralContext>());
            List<Expositores> listaExpositoresActivos = db.Expositores.ToList();
            return listaExpositoresActivos;
        }

        [HttpPost]
        public IActionResult EditarExpositor(Expositores expositor)
        {
            if (ModelState.IsValid)
            {
                db.Entry(expositor).State = EntityState.Modified;
                db.SaveChanges();
                return Ok("Expositor Modificado con Éxito");
            }
            else { return BadRequest("Error al editar Expositor"); }
        }

        [HttpPost]
        public IActionResult AgregarExpositor(Expositores expositor)
        {
            if (ModelState.IsValid)
            {

                db.Expositores.Add(expositor);
                db.SaveChanges();
                return Ok("Expositor Agregado con Éxito");
            }
            else { return BadRequest("Error al agregar el nuevo Expositor"); }
        }

        [HttpPost]
        public IActionResult CambiarEstadoExpositor(Expositores expositor)
        {
            if (ModelState.IsValid)
            {
                db.Entry(expositor).State = EntityState.Modified;
                db.SaveChanges();
                return Ok("Exposiotr modifico estado con Éxito");
            }
            else { return BadRequest("Error al modificar estado Expositor"); }
        }

    }
}
