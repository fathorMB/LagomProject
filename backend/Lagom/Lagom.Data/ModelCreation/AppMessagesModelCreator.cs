using Lagom.Model;
using Microsoft.EntityFrameworkCore;

namespace Lagom.Data.ModelCreation
{
    internal class AppMessagesModelCreator
    {
        internal static void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AppMessage>()
                .HasOne(am => am.AppLanguage)
                .WithMany(al => al.AppMessages)
                .HasForeignKey(am => am.AppLanguageId);

            modelBuilder.Entity<AppLanguage>().HasData(
                new AppLanguage
                {
                    Id = 1,
                    Code = "en",
                    Name = "English",
                    IsActive = true,
                    NativeName = "English"
                },
                new AppLanguage
                {
                    Id = 2,
                    Code = "it",
                    Name = "Italian",
                    IsActive = true,
                    NativeName = "Italiano"
                }
            );

            modelBuilder.Entity<AppMessage>().HasData(
                new AppMessage
                {
                    Id = 1,
                    AppLanguageId = 1,
                    Code = "login.credentials.required",
                    Message = "Username and password are required",
                    Severity = "error",
                    Type = "login"
                },
                new AppMessage
                {
                    Id = 2,
                    AppLanguageId = 2,
                    Code = "login.credentials.required",
                    Message = "Username e password sono obbligatori",
                    Severity = "error",
                    Type = "login"
                },
                new AppMessage
                {
                    Id = 3,
                    AppLanguageId = 1,
                    Code = "login.credentials.invalid",
                    Message = "Invalid username or password",
                    Severity = "error",
                    Type = "login"
                },
                new AppMessage
                {
                    Id = 4,
                    AppLanguageId = 2,
                    Code = "login.credentials.invalid",
                    Message = "Username o password non validi",
                    Severity = "error",
                    Type = "login"
                },
                new AppMessage
                {
                    Id = 5,
                    AppLanguageId = 1,
                    Code = "user.creation.error",
                    Message = "Something went wrong while trying to create the user",
                    Severity = "error",
                    Type = "user.creation"
                },
                new AppMessage
                {
                    Id = 6,
                    AppLanguageId = 2,
                    Code = "user.creation.error",
                    Message = "Qualcosa è andato storto durante la creazione dell'utente.",
                    Severity = "error",
                    Type = "user.creation"
                }
            );
        }
    }
}
