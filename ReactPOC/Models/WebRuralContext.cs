﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ReactPOC.Models;

public partial class WebRuralContext : DbContext
{
    public WebRuralContext()
    {
    }

    public WebRuralContext(DbContextOptions<WebRuralContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Eventos> Eventos { get; set; }

    public virtual DbSet<Expositores> Expositores { get; set; }

    public virtual DbSet<Ingresos> Ingresos { get; set; }

    public virtual DbSet<TipoIngreso> TipoIngreso { get; set; }

    public virtual DbSet<Usuarios> Usuarios { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //Desarrollo
        //=> optionsBuilder.UseSqlServer("Data Source=.\\sqlexpress;Initial Catalog=WebRural;Integrated Security=True;persist security info=True;user id=sa;password=Golf2027;MultipleActiveResultSets=True;TrustServerCertificate=True");
        //Produccion
        => optionsBuilder.UseSqlServer("Data Source=SQL5054.site4now.net;Initial Catalog=db_a9d070_ssr;User Id=db_a9d070_ssr_admin;Password=Golf$3013");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Eventos>(entity =>
        {
            entity.HasOne(d => d.id_tipoIngresoNavigation).WithMany(p => p.Eventos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Eventos_TipoIngreso");
        });

        modelBuilder.Entity<Expositores>(entity =>
        {
            entity.HasOne(d => d.id_eventoNavigation).WithMany(p => p.Expositores)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Expositores_Eventos");

            entity.HasOne(d => d.id_tipoIngresoNavigation).WithMany(p => p.Expositores)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Expositores_TipoIngreso");
        });

        modelBuilder.Entity<Ingresos>(entity =>
        {
            //entity.Property(e => e.id).ValueGeneratedNever();

            entity.HasOne(d => d.id_eventoNavigation).WithMany(p => p.Ingresos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Ingresos_Eventos");

            entity.HasOne(d => d.id_expositorNavigation).WithMany(p => p.Ingresos)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Ingresos_Expositores");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}