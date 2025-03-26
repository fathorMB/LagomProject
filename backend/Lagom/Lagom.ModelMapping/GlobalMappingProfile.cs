using AutoMapper;
using Lagom.Model;
using Lagom.WebAPI.Contracts.DTOs;

namespace Lagom.ModelMapping
{
    public class GlobalMappingProfile : Profile
    {
        public GlobalMappingProfile()
        {
            CreateMap<User, UserContract>()
                .ForMember(dest => dest.Claims, opt => opt.MapFrom(src => src.UsersClaims.Select(uc => uc.Claim)));

            CreateMap<Claim, ClaimContract>();
            CreateMap<Contact, ContactContract>();
            CreateMap<UploadedFile, FileContract>();
        }
    }
}
