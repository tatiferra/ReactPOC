using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactPOC.Models;
using System.Drawing.Text;
using System.Text.Json.Serialization;
using System.Text.Json;

namespace ReactPOC.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class IngresosController : ControllerBase
    {
        private readonly ILogger<IngresosController> _logger;
        private WebRuralContext db = new WebRuralContext(new DbContextOptions<WebRuralContext>());


        public IngresosController(ILogger<IngresosController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<TipoIngreso> ObtenerTiposIngreso()
        {

            List<TipoIngreso> listaTipos = db.TipoIngreso.ToList();

            return listaTipos.ToArray();
        }

        [HttpPost]
        public IActionResult ValidarIngreso([FromBody] IngresoRequest request)
        {

            JsonSerializerOptions options = new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.Preserve
            };

            // Validar que exista un Expositor con ese DNI
            if (ModelState.IsValid)
            {
                Expositores? expositor = db.Expositores.FirstOrDefault(e => e.DNI == request.dni && e.habilitado);
                if (expositor != null) 
                {
                    TipoIngreso? tipoIngreso = db.TipoIngreso.FirstOrDefault(t => t.id == expositor.id_tipoIngreso);
                    if (tipoIngreso != null) 
                    {
                        Ingresos? ingresoAnterior = db.Ingresos.OrderByDescending(i => i.fecha).FirstOrDefault(i => i.id_expositor == expositor.id && i.id_evento == expositor.id_evento);
                        if (tipoIngreso.Tipo == "UNICO")
                        {
                            // Validar que ya no tenga un ingreso registrado a ese evento                            
                            if (ingresoAnterior != null)
                            {
                                return BadRequest("Ingreso unico ya utilizado");
                            }
                            else 
                            {
                                // Registrar el ingreso y devolver los datos
                                Ingresos nuevoIngreso = new Ingresos();
                                // Obtener la zona horaria de Buenos Aires (UTC-3)
                                TimeZoneInfo buenosAiresTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                                // Obtener la hora actual en Buenos Aires
                                DateTime currentTimeInBuenosAires = TimeZoneInfo.ConvertTime(DateTime.UtcNow, buenosAiresTimeZone);
                                nuevoIngreso.fecha = currentTimeInBuenosAires;
                                nuevoIngreso.id_evento = expositor.id_evento;
                                nuevoIngreso.id_expositor = expositor.id;
                                nuevoIngreso.valido = true;
                                db.Ingresos.Add(nuevoIngreso);
                                db.SaveChanges();
                                var ingresoResponse = new IngresoResponse
                                {
                                    Message = "Ingreso Ok",
                                    Expositor = expositor.Apellido + ", " + expositor.Nombre,
                                    Empresa = expositor.Empresa,
                                    Evento = "",
                                    UltimoIngreso = nuevoIngreso.fecha.ToString("dd/MM/yyyy HH:mm:ss"),
                                };
                                return Ok(ingresoResponse);
                            }
                        }
                        else 
                        {
                            // Registrar el ingreso y devolver los datos
                            Ingresos nuevoIngreso = new Ingresos();
                            // Obtener la zona horaria de Buenos Aires (UTC-3)
                            TimeZoneInfo buenosAiresTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                            // Obtener la hora actual en Buenos Aires
                            DateTime currentTimeInBuenosAires = TimeZoneInfo.ConvertTime(DateTime.UtcNow, buenosAiresTimeZone);
                            nuevoIngreso.fecha = currentTimeInBuenosAires;
                            nuevoIngreso.id_evento = expositor.id_evento;
                            nuevoIngreso.id_expositor = expositor.id;
                            nuevoIngreso.valido = true;
                            db.Ingresos.Add(nuevoIngreso);
                            db.SaveChanges();
                            var ingresoResponse = new IngresoResponse
                            {
                                Message = "Ingreso Ok",
                                Expositor = expositor.Apellido + ", " + expositor.Nombre,
                                Empresa = expositor.Empresa,
                                Evento = "",
                                UltimoIngreso = ingresoAnterior.fecha.ToString("dd/MM/yyyy HH:mm:ss"),
                            };
                            return Ok(ingresoResponse);
                        }
                    }
                    else 
                    { 
                        return BadRequest("Error en Ingreso"); 
                    }
                }
                else
                {
                    return BadRequest("Expositor no existente o no habilitado");
                }
            }
            else
            {
                return BadRequest("Error en la validación");
            }

                
        }

        [HttpPost]
        public IActionResult ObtenerIngresosPorEvento(Eventos evento) 
        {
            if (ModelState.IsValid)
            {
                Eventos? eventoSeleccionado = db.Eventos.FirstOrDefault(e => e.id == evento.id);
                if (eventoSeleccionado != null)
                {
                    List<Ingresos> listaIngresos = db.Ingresos.Include(e => e.id_expositorNavigation).Where(i => i.id_evento == eventoSeleccionado.id).ToList();
                    return Ok(listaIngresos);
                }
                else { return BadRequest("Error de ingresos"); }
            }
            else { return BadRequest("Error al agregar el nuevo Evento"); }
        }

        [HttpGet]
        public IActionResult ObtenerIngresosActivos(int eventoId)
        {
            if (ModelState.IsValid)
            {
                List<Ingresos> listaIngresos = db.Ingresos.Include(e => e.id_expositorNavigation).Include(p => p.id_eventoNavigation).Where(x => x.id_evento == eventoId).ToList();
                List<IngresosEventoResponse> listaRegistros = new List<IngresosEventoResponse>();
                foreach (var ingreso in listaIngresos)
                {
                    IngresosEventoResponse logIngreso = new IngresosEventoResponse();
                    logIngreso.id = ingreso.id;
                    logIngreso.Empresa = ingreso.id_expositorNavigation.Empresa;
                    logIngreso.Evento = ingreso.id_eventoNavigation.NombreEvento;
                    logIngreso.Expositor = ingreso.id_expositorNavigation.Apellido + ", " + ingreso.id_expositorNavigation.Nombre;
                    logIngreso.FechaIngreso = ingreso.fecha;
                    logIngreso.Valido = ingreso.valido;
                    listaRegistros.Add(logIngreso);

                }
                return Ok(listaRegistros);
            }
            else 
            { 
                return BadRequest("Error al agregar el nuevo Evento"); 
            }
        }


    }
}
