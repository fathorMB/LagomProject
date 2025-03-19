using Lagom.Model.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lagom.Data.ModelCreation
{
    internal static class DomainModelCreator
    {
        internal static void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ComplexProductComponent>()
                .HasOne(pc => pc.ComplexProduct)
                .WithMany(cp => cp.Components)
                .HasForeignKey(pc => pc.ComplexProductId);

            modelBuilder.Entity<ComplexProductComponent>()
                .HasOne(pc => pc.BasicProduct)
                .WithMany()
                .HasForeignKey(pc => pc.BasicProductId);
        }
    }
}
