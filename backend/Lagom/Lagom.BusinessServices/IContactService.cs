using Lagom.WebAPI.Contracts.DTOs;
using Lagom.WebAPI.Contracts.Requests;
using Lagom.WebAPI.Contracts.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lagom.BusinessServices
{
    public interface IContactService
    {
        Task<CreateContactResponse> CreateContact(CreateContactRequest request);
        Task<UpdateContactResponse> UpdateContact(UpdateContactRequest request);
        Task<BusinessServiceResponse> DeleteContact(int id);

        Task<IEnumerable<ContactContract>> GetAll();
        Task<ContactContract> GetById(int id);
    }
}
