namespace ReactPOC.Models
{
    public class IngresosEventoResponse
    {
        public int id { get; set; }
        public string Expositor { get; set; }
        public string Empresa { get; set; }
        public string Evento { get; set; }
        public DateTime FechaIngreso { get; set; }
        public bool Valido { get; set; }
    }
}
