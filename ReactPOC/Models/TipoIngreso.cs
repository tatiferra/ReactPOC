﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace ReactPOC.Models;

public partial class TipoIngreso
{
    [Key]
    public int id { get; set; }

    [Required]
    [StringLength(10)]
    [Unicode(false)]
    public string Tipo { get; set; }

    [InverseProperty("id_tipoIngresoNavigation")]
    public virtual ICollection<Eventos> Eventos { get; set; } = new List<Eventos>();

    [InverseProperty("id_tipoIngresoNavigation")]
    public virtual ICollection<Expositores> Expositores { get; set; } = new List<Expositores>();
}