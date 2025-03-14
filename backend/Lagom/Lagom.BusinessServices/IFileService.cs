using Lagom.WebAPI.Contracts.DTOs;
using Lagom.WebAPI.Contracts.Requests;
using Lagom.WebAPI.Contracts.Responses;
using Microsoft.AspNetCore.Http;

namespace Lagom.BusinessServices
{
    public interface IFileService
    {
        Task<CreateFileResponse> UploadFile(IFormFile file, string correlationId);
        Task<FileContract> GetFileById(int id);
        Task<IEnumerable<FileContract>> GetFilesByCorrelationId(string correlationId);
        Task<BusinessServiceResponse> DeleteFile(int id);
        Task<BusinessServiceResponse> DeleteFilesByCorrelationId(string correlationId);
    }
}
