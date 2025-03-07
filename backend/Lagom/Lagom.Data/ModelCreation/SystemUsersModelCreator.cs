using Lagom.Model;
using Microsoft.EntityFrameworkCore;

namespace Lagom.Data.ModelCreation
{
    internal class SystemUsersModelCreator
    {
        internal static void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UsersClaims>()
                .HasKey(uc => new { uc.UserId, uc.ClaimId });

            modelBuilder.Entity<UsersClaims>()
                .HasOne(uc => uc.User)
                .WithMany(u => u.UsersClaims)
                .HasForeignKey(uc => uc.UserId);

            modelBuilder.Entity<UsersClaims>()
                .HasOne(uc => uc.Claim)
                .WithMany(c => c.UsersClaims)
                .HasForeignKey(uc => uc.ClaimId);

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    FirstName = "System",
                    LastName = "Admin",
                    Username = "admin",
                    AccessKeyHash = "21232f297a57a5a743894a0e4a801fc3",
                    IsActive = true
                },
                new User
                {
                    Id = 2,
                    FirstName = "Moreno",
                    LastName = "Bruschi",
                    Username = "moro",
                    AccessKeyHash = "21232f297a57a5a743894a0e4a801fc3",
                    IsActive = true
                }
            );

            modelBuilder.Entity<Claim>().HasData(
                new Claim
                {
                    Id = 1,
                    Name = "admin",
                    Description = "Full control"
                },
                new Claim
                {
                    Id = 2,
                    Name = "example",
                    Description = "Can run example controller routes"
                },
                new Claim
                {
                    Id = 3,
                    Name = "data-operator",
                    Description = "Can run CRUD and service operations on data"
                }
            );

            modelBuilder.Entity<UsersClaims>().HasData(
                new UsersClaims
                {
                    ClaimId = 1,
                    UserId = 1
                },
                new UsersClaims
                {
                    ClaimId = 2,
                    UserId = 2
                },
                new UsersClaims
                {
                    ClaimId = 3,
                    UserId = 2
                }
            );
        }
    }
}
