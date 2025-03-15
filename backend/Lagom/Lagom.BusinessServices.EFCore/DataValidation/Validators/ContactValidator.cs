using Azure.Core;
using Lagom.BusinessServices.EFCore.DataValidation.Abstracts;
using Lagom.Model;
using Lagom.WebAPI.Contracts.DTOs;
using Lagom.WebAPI.Contracts.Responses;
using Microsoft.EntityFrameworkCore;
using SGBackend.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lagom.BusinessServices.EFCore.DataValidation.Validators
{
    internal class ContactValidator : LagomDBDataValidator<Contact>
    {
        internal override async Task<LagomDBDataValidatorResult> Validate(DataValidationContext validationContext, Contact entity, LagomDbContext dbContext)
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

        private async Task<LagomDBDataValidatorResult> ValidateForCreation(Contact entity, LagomDbContext dbContext)
        {
            var duplicateEmail = await dbContext.Contacts.FirstOrDefaultAsync(c => c.Email == entity.Email);
            if (duplicateEmail != null)
            {
                string contactIdentifier = !string.IsNullOrEmpty(duplicateEmail.Nick) ? duplicateEmail.Nick : duplicateEmail.FirstName + ' ' + duplicateEmail.LastName;
                return new LagomDBDataValidatorResult()
                {
                    Status = LagomDBDataValidatorResultStatus.DuplicateEntity,
                    ValidationMessage = $"Il contatto di '{contactIdentifier}' fa riferimento alla stessa email. Considerare l'aggiornamento del record corrispondente."
                };
            }

            var duplicatePhoneNumber = await dbContext.Contacts.FirstOrDefaultAsync(c => c.PhoneNumber == entity.PhoneNumber);
            if (duplicatePhoneNumber != null)
            {
                string contactIdentifier = !string.IsNullOrEmpty(duplicatePhoneNumber.Nick) ? duplicatePhoneNumber.Nick : duplicatePhoneNumber.FirstName + ' ' + duplicatePhoneNumber.LastName;
                return new LagomDBDataValidatorResult()
                {
                    Status = LagomDBDataValidatorResultStatus.DuplicateEntity,
                    ValidationMessage = $"Il contatto di '{contactIdentifier}' fa riferimento allo stesso numero telefonico. Considerare l'aggiornamento del record corrispondente."
                };
            }

            var duplicateNick = await dbContext.Contacts.FirstOrDefaultAsync(c => c.Nick == entity.Nick);
            if (duplicateNick != null)
                return new LagomDBDataValidatorResult()
                {
                    Status = LagomDBDataValidatorResultStatus.DuplicateEntity,
                    ValidationMessage = $"Si sta cercando di aggiungere un contatto con nickname già esistente: '{entity.Nick}'."
                };

            var duplicateName = await dbContext.Contacts.FirstOrDefaultAsync(c => c.FirstName == entity.FirstName && c.LastName == entity.LastName);
            if (duplicateName != null)
                return new LagomDBDataValidatorResult()
                {
                    Status = LagomDBDataValidatorResultStatus.DuplicateEntity,
                    ValidationMessage = "Si sta cercando di aggiungere un contatto con nome e cognome già registrati per un altro contatto."
                };

            return new LagomDBDataValidatorResult()
            {
                Status = LagomDBDataValidatorResultStatus.Success
            };
        }

        private async Task<LagomDBDataValidatorResult> ValidateForUpdate(Contact entity, LagomDbContext dbContext)
        {
            var otherContacts = await dbContext.Contacts.Where(c => c.Id != entity.Id).ToListAsync();

            var duplicateEmail = otherContacts.FirstOrDefault(c => c.Email == entity.Email);
            if (duplicateEmail != null)
            {
                string contactIdentifier = !string.IsNullOrEmpty(duplicateEmail.Nick) ? duplicateEmail.Nick : duplicateEmail.FirstName + ' ' + duplicateEmail.LastName;
                return new LagomDBDataValidatorResult()
                {
                    Status = LagomDBDataValidatorResultStatus.DuplicateEntity,
                    ValidationMessage = $"Il contatto di '{contactIdentifier}' fa riferimento alla stessa email. Considerare l'aggiornamento del record corrispondente."
                };
            }

            var duplicatePhoneNumber = otherContacts.FirstOrDefault(c => c.PhoneNumber == entity.PhoneNumber);
            if (duplicatePhoneNumber != null)
            {
                string contactIdentifier = !string.IsNullOrEmpty(duplicatePhoneNumber.Nick) ? duplicatePhoneNumber.Nick : duplicatePhoneNumber.FirstName + ' ' + duplicatePhoneNumber.LastName;
                return new LagomDBDataValidatorResult()
                {
                    Status = LagomDBDataValidatorResultStatus.DuplicateEntity,
                    ValidationMessage = $"Il contatto di '{contactIdentifier}' fa riferimento allo stesso numero telefonico. Considerare l'aggiornamento del record corrispondente."
                };
            }

            var duplicateNick = otherContacts.FirstOrDefault(c => c.Nick == entity.Nick);
            if (duplicateNick != null)
                return new LagomDBDataValidatorResult()
                {
                    Status = LagomDBDataValidatorResultStatus.DuplicateEntity,
                    ValidationMessage = $"Si sta cercando di aggiungere un contatto con nickname già esistente: '{entity.Nick}'."
                };

            var duplicateName = otherContacts.FirstOrDefault(c => c.FirstName == entity.FirstName && c.LastName == entity.LastName);
            if (duplicateName != null)
                return new LagomDBDataValidatorResult()
                {
                    Status = LagomDBDataValidatorResultStatus.DuplicateEntity,
                    ValidationMessage = "Si sta cercando di aggiungere un contatto con nome e cognome già registrati per un altro contatto."
                };

            return new LagomDBDataValidatorResult()
            {
                Status = LagomDBDataValidatorResultStatus.Success
            };
        }

        private async Task<LagomDBDataValidatorResult> ValidateForDeletion(Contact entity, LagomDbContext dbContext)
        {
            return new LagomDBDataValidatorResult()
            {
                Status = LagomDBDataValidatorResultStatus.Success
            };
        }
    }
}
