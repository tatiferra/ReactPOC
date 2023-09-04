using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactPOC.Models;
using System.Drawing.Text;

namespace ReactPOC.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class EventosController : ControllerBase
    {
        private readonly ILogger<EventosController> _logger;
        private WebRuralContext db = new WebRuralContext(new DbContextOptions<WebRuralContext>());


        public EventosController(ILogger<EventosController> logger)
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
        public IEnumerable<Eventos> ObtenerEventosActivos()
        {
            List<Eventos> listaEventosActivos = db.Eventos
                .Include(e => e.Expositores)
                .OrderByDescending(e => e.habilitado) // Ordenar por eventos habilitados en orden descendente (true primero, false después)
                .ThenByDescending(e => e.FechaDesde) // Ordenar por fecha desde en orden descendente
                .ToList();

            foreach (var evento in listaEventosActivos)
            {
                evento.CantidadExpositores = evento.Expositores.Count();
                evento.Expositores = null;
            }
            
            return listaEventosActivos;
        }

        [HttpGet]
        public IEnumerable<Eventos> ObtenerEventosHabilitados()
        {
            List<Eventos> listaEventosActivos = db.Eventos
                .Include(e => e.Expositores)
                .Where(e => e.habilitado)
                .OrderByDescending(e => e.habilitado) // Ordenar por eventos habilitados en orden descendente (true primero, false después)
                .ThenByDescending(e => e.FechaDesde) // Ordenar por fecha desde en orden descendente
                .ToList();

            foreach (var evento in listaEventosActivos)
            {
                evento.CantidadExpositores = evento.Expositores.Count();
                evento.Expositores = null;
            }

            return listaEventosActivos;
        }

        [HttpPost]
        public IActionResult AgregarEvento(Eventos evento) 
        {
            if (ModelState.IsValid)
            {
                evento.FechaHasta = evento.FechaHasta.AddDays(1);   
                db.Eventos.Add(evento);
                db.SaveChanges();
                return Ok("Evento Agregado con Éxito");
            }
            else { return BadRequest("Error al agregar el nuevo Evento"); }
        }

        [HttpPost]
        public IActionResult EditarEvento(Eventos evento)
        {
            if (ModelState.IsValid)
            {
                db.Entry(evento).State = EntityState.Modified;
                db.SaveChanges();
                return Ok("Evento Modificado con Éxito");
            }
            else { return BadRequest("Error al editar Evento"); }
        }

        [HttpPost]
        public IActionResult EliminarEvento(Eventos evento)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    db.Eventos.Remove(evento);
                    db.SaveChanges();
                    return Ok("Evento Modificado con Éxito");
                } catch (Exception ex) { 
                    return BadRequest("No se puede eliminar un evento con expositores y registros asociados");
                }
            }
            else { return BadRequest("Error al eliminar Evento"); }
        }


        [HttpPost]
        public IActionResult CambiarEstadoEvento(Eventos evento)
        {
            if (ModelState.IsValid)
            {
                db.Entry(evento).State = EntityState.Modified;
                db.SaveChanges();
                return Ok("Evento Deshabilitado con Éxito");
            }
            else { return BadRequest("Error al deshabilitar Evento"); }
        }

        //[HttpPost]
        //public IActionResult Login([FromBody] LoginViewModel loginViewModel)
        //{
        //    // Validar los datos del formulario
        //    if (ModelState.IsValid)
        //    {
        //        // Realizar las operaciones de autenticación y retornar la respuesta adecuada
        //        // ...
        //        return Ok(new { message = "Inicio de sesión exitoso" });
        //    }
        //    else
        //    {
        //        // Los datos del formulario son inválidos, retornar un mensaje de error
        //        return BadRequest(new { message = "Datos de inicio de sesión inválidos" });
        //    }
        //}


    }
}
