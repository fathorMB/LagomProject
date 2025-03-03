using Lagom.Data.ModelCreation;
using Lagom.Model;
using Microsoft.EntityFrameworkCore;

namespace SGBackend.Data
{
    public class LagomDbContext : DbContext
    {
        public LagomDbContext() : base()
        {

        }

        public LagomDbContext(DbContextOptions<LagomDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Claim> Claims { get; set; }
        public DbSet<UsersClaims> UsersClaims { get; set; }
        public DbSet<AppLanguage> AppLanguages { get; set; }
        public DbSet<AppMessage> AppMessages { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Data Source=.;Initial Catalog=LagomDB; Integrated Security=true;TrustServerCertificate=True;", b => b.MigrationsAssembly("SGBackend.Data"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            SystemUsersModelCreator.OnModelCreating(modelBuilder);
            AppMessagesModelCreator.OnModelCreating(modelBuilder);
        }
    }
}
