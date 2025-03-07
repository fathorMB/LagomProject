using AutoMapper;
using Lagom.Model;
using Lagom.WebAPI.Contracts.DTOs;

namespace Lagom.ModelMapping
{
    public class GlobalMappingProfile : Profile
    {
        public GlobalMappingProfile()
        {
            CreateMap<User, UserContract>();
            CreateMap<Claim, ClaimContract>();
            CreateMap<Contact, ContactContract>();
        }
    }
}
