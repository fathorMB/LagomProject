using AutoMapper;
using Lagom.BusinessServices.EFCore.DataValidation;
using Lagom.BusinessServices.EFCore.DataValidation.Abstracts;
using Lagom.BusinessServices.EFCore.Utility;
using Lagom.Common;
using Lagom.Model;
using Lagom.WebAPI.Contracts.Abstractions;
using Lagom.WebAPI.Contracts.DTOs;
using Lagom.WebAPI.Contracts.Requests;
using Lagom.WebAPI.Contracts.Responses;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SGBackend.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lagom.BusinessServices.EFCore
{
    public class ContactService : IContactService
    {
        private readonly IMapper _mapper;
        private readonly AppSettings _appSettings;
        private readonly LagomDbContext _db;

        public ContactService(IMapper mapper, IOptions<AppSettings> appSettings, LagomDbContext db)
        {
            _mapper = mapper;
            _appSettings = appSettings.Value;
            _db = db;
        }

        public async Task<CreateContactResponse> CreateContact(CreateContactRequest request)
        {
            var contactEntity = new Contact()
            {
                Email = request.Contact.Email,
                FirstName = request.Contact.FirstName,
                LastName = request.Contact.LastName,
                Nick = request.Contact.Nick,
                PhoneNumber = request.Contact.PhoneNumber
            };

            var contactValidator = new ContactValidator();
            var contactValidationResult = await contactValidator.Validate(contactEntity, _db);

            if (contactValidationResult.Status != LagomDBDataValidatorResultStatus.Success)
                return new CreateContactResponse(request, new ContactContract(), BusinessServiceResponseStatus.Error, new string[] { contactValidationResult.ValidationMessage });

            try
            {
                await _db.Contacts.AddAsync(contactEntity);
                await _db.SaveChangesAsync();

                var mapContact = _mapper.Map<ContactContract>(await GetByIdInternal(contactEntity.Id));

                return new CreateContactResponse(request, mapContact, BusinessServiceResponseStatus.Completed, new string[] { "Contatto salvato con successo." });
            }
            catch (Exception ex)
            {
                return new CreateContactResponse(request, new ContactContract(), BusinessServiceResponseStatus.Error, new string[] { "Errore durante il salvataggio del dato.", ex.Message });
            }
        }

        public async Task<DeleteContactResponse> DeleteContact(int id)
        {
            var match = await _db.Contacts.FindAsync(id);

            if (match == null)
                return new DeleteContactResponse(id, BusinessServiceResponseStatus.Error, new string[] { $"Il contatto con ID:'{id}' non è stato trovato." });

            try
            {
                _db.Contacts.Remove(match);

                await _db.SaveChangesAsync();

                return new DeleteContactResponse(id, BusinessServiceResponseStatus.Completed, new string[] { "Contatto eliminato correttamente." });
            }
            catch (Exception ex)
            {
                return new DeleteContactResponse(id, BusinessServiceResponseStatus.Error, new string[] { $"Errore durante l'eliminazione del contatto con ID:'{id}'", ex.Message });
            }
        }

        public async Task<UpdateContactResponse> UpdateContact(UpdateContactRequest request)
        {
            var contactEntity = new Contact()
            {
                Email = request.Contact.Email,
                FirstName = request.Contact.FirstName,
                LastName = request.Contact.LastName,
                Nick = request.Contact.Nick,
                PhoneNumber = request.Contact.PhoneNumber
            };

            var contactValidator = new ContactValidator();
            var contactValidationResult = await contactValidator.Validate(contactEntity, _db);

            if (contactValidationResult.Status != LagomDBDataValidatorResultStatus.Success)
                return new UpdateContactResponse(request, new ContactContract(), BusinessServiceResponseStatus.Error, new string[] { contactValidationResult.ValidationMessage });

            var match = await _db.Contacts.FindAsync(request.Contact.Id);

            if (match == null)
                return new UpdateContactResponse(request, new ContactContract(), BusinessServiceResponseStatus.Error, new string[] { $"Il contatto con ID:'{request.Contact.Id}' non è stato trovato." });

            try
            {
                match.Email = contactEntity.Email;
                match.Nick = contactEntity.Nick;
                match.Email = contactEntity.Email;
                match.FirstName = contactEntity.FirstName;
                match.LastName = contactEntity.LastName;
                match.PhoneNumber = contactEntity.PhoneNumber;

                _db.Contacts.Update(match);

                await _db.SaveChangesAsync();

                var mapContact = _mapper.Map<ContactContract>(await GetByIdInternal(match.Id));

                return new UpdateContactResponse(request, mapContact, BusinessServiceResponseStatus.Completed, new string[] { "Contatto aggiornato correttamente." });
            }
            catch (Exception ex)
            {
                return new UpdateContactResponse(request, new ContactContract(), BusinessServiceResponseStatus.Error, new string[] { $"Errore durante l'aggiornamento del contatto con ID:'{request.Contact.Id}'", ex.Message });
            }
        }

        public async Task<IEnumerable<ContactContract>> GetAll()
        {
            return _mapper.Map<IEnumerable<ContactContract>>(await _db.Contacts.ToListAsync());
        }

        public async Task<ContactContract> GetById(int id)
        {
            return await GetByIdInternal(id);
        }

        private async Task<ContactContract?> GetByIdInternal(int id)
        {
            var dbContact = await _db.Contacts.FirstOrDefaultAsync(c => c.Id == id);

            if (dbContact != null)
            {
                var contact = _mapper.Map<ContactContract>(dbContact);

                return contact;
            }

            return null;
        }
    }
}
