using Lagom.BusinessServices.EFCore.DataValidation.Abstracts;
using Lagom.Model;
using Microsoft.EntityFrameworkCore;
using SGBackend.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lagom.BusinessServices.EFCore.DataValidation.Validators
{
    internal class UserValidator : LagomDBDataValidator<User>
    {
        internal override async Task<LagomDBDataValidatorResult> Validate(DataValidationContext validationContext, User entity, LagomDbContext dbContext)
        {
            switch (validationContext)
            {
                case DataValidationContext.EntityCreation:
                    return await ValidateForCreation(entity, dbContext);
                case DataValidationContext.EntityUpdate:
                    return await ValidateForUpdate(entity, dbContext);
                case DataValidationContext.EntityDeletion:
                    return await ValidateForDeletion(entity, dbContext);
                default:
                    return new LagomDBDataValidatorResult()
                    {
                        Status = LagomDBDataValidatorResultStatus.DataError,
                        ValidationMessage = "Il contesto di validazione specificato non è supportato."
                    };
            }
        }

        private async Task<LagomDBDataValidatorResult> ValidateForDeletion(User entity, LagomDbContext dbContext)
        {
            return new LagomDBDataValidatorResult()
            {
                Status = LagomDBDataValidatorResultStatus.Success
            };
        }

        private async Task<LagomDBDataValidatorResult> ValidateForUpdate(User entity, LagomDbContext dbContext)
        {
            return new LagomDBDataValidatorResult()
            {
                Status = LagomDBDataValidatorResultStatus.Success
            };
        }

        private async Task<LagomDBDataValidatorResult> ValidateForCreation(User entity, LagomDbContext dbContext)
        {
            var duplicateUsername = await dbContext.Users.FirstOrDefaultAsync(u => u.Username == entity.Username);
            if (duplicateUsername != null)
            {
                return new LagomDBDataValidatorResult()
                {
                    Status = LagomDBDataValidatorResultStatus.DuplicateEntity,
                    ValidationMessage = $"Esiste un utente con lo stesso username."
                };
            }

            return new LagomDBDataValidatorResult()
            {
                Status = LagomDBDataValidatorResultStatus.Success
            };
        }
    }
}
