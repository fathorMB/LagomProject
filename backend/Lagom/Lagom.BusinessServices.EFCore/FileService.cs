using AutoMapper;
using Lagom.BusinessServices;
using Lagom.Common;
using Lagom.Model;
using Lagom.WebAPI.Contracts.DTOs;
using Lagom.WebAPI.Contracts.Requests;
using Lagom.WebAPI.Contracts.Responses;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Globalization;
using Lagom.WebAPI.Contracts.Abstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using SGBackend.Data;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace Lagom.BusinessServices.EFCore
{
    public class FileService : IFileService
    {
        private readonly LagomDbContext _db;
        private readonly IMapper _mapper;
        private readonly AppSettings _appSettings;
        private readonly BlobContainerClient _blobContainerClient;

        public FileService(IOptions<AppSettings> appSettings, LagomDbContext db, IMapper mapper, IConfiguration configuration)
        {
            _appSettings = appSettings.Value;
            _db = db;
            _mapper = mapper;

            // Configure the BlobContainerClient using configuration.
            // These values can be stored in appsettings.json.
            string connectionString = configuration.GetConnectionString("AzureBlobStorage");
            string containerName = _appSettings.AzureBlobContainerName;
            _blobContainerClient = new BlobContainerClient(connectionString, containerName);
            _blobContainerClient.CreateIfNotExists(PublicAccessType.Blob);
        }

        public async Task<CreateFileResponse> UploadFile(IFormFile file, string correlationId)
        {
            if (file == null || file.Length == 0)
            {
                return new CreateFileResponse(new CreateFileRequest { CorrelationId = correlationId },
                    new FileContract(),
                    BusinessServiceResponseStatus.Error,
                    new string[] { "No file uploaded." });
            }

            // Generate a unique blob name (using a GUID and preserving file extension)
            string blobName = Guid.NewGuid().ToString("N", CultureInfo.InvariantCulture) + Path.GetExtension(file.FileName);
            var blobClient = _blobContainerClient.GetBlobClient(blobName);

            try
            {
                using (var stream = file.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = file.ContentType });
                }

                // Create new UploadedFile entity record
                var uploadedFile = new UploadedFile
                {
                    BlobName = blobName,
                    FileName = file.FileName,
                    ContentType = file.ContentType,
                    CorrelationId = correlationId,
                    UploadDate = DateTime.UtcNow,
                    FileSize = file.Length
                };

                _db.UploadedFiles.Add(uploadedFile);
                await _db.SaveChangesAsync();

                // Map entity to DTO and include the Blob URL.
                var fileContract = _mapper.Map<FileContract>(uploadedFile);
                fileContract.BlobUrl = blobClient.Uri;

                return new CreateFileResponse(new CreateFileRequest { CorrelationId = correlationId },
                    fileContract,
                    BusinessServiceResponseStatus.Completed,
                    new string[] { "File uploaded successfully." });
            }
            catch (Exception ex)
            {
                return new CreateFileResponse(new CreateFileRequest { CorrelationId = correlationId },
                    new FileContract(),
                    BusinessServiceResponseStatus.Error,
                    new string[] { "Error uploading file.", ex.Message });
            }
        }

        public async Task<FileContract> GetFileById(int id)
        {
            var fileRecord = await _db.UploadedFiles.FindAsync(id);
            if (fileRecord == null)
                return null;

            var blobClient = _blobContainerClient.GetBlobClient(fileRecord.BlobName);
            var fileContract = _mapper.Map<FileContract>(fileRecord);
            fileContract.BlobUrl = blobClient.Uri;
            return fileContract;
        }

        public async Task<IEnumerable<FileContract>> GetFilesByCorrelationId(string correlationId)
        {
            var fileRecords = await _db.UploadedFiles.Where(f => f.CorrelationId == correlationId).ToListAsync();
            var result = new List<FileContract>();
            foreach (var record in fileRecords)
            {
                var blobClient = _blobContainerClient.GetBlobClient(record.BlobName);
                var fileContract = _mapper.Map<FileContract>(record);
                fileContract.BlobUrl = blobClient.Uri;
                result.Add(fileContract);
            }
            return result;
        }

        public async Task<BusinessServiceResponse> DeleteFile(int id)
        {
            var fileRecord = await _db.UploadedFiles.FindAsync(id);
            if (fileRecord == null)
                return new BusinessServiceResponse(BusinessServiceResponseStatus.Error, new string[] { "File not found." });

            try
            {
                var blobClient = _blobContainerClient.GetBlobClient(fileRecord.BlobName);
                await blobClient.DeleteIfExistsAsync();

                _db.UploadedFiles.Remove(fileRecord);
                await _db.SaveChangesAsync();

                return new BusinessServiceResponse(BusinessServiceResponseStatus.Completed, new string[] { "File deleted successfully." });
            }
            catch (Exception ex)
            {
                return new BusinessServiceResponse(BusinessServiceResponseStatus.Error, new string[] { "Error deleting file.", ex.Message });
            }
        }

        public async Task<BusinessServiceResponse> DeleteFilesByCorrelationId(string correlationId)
        {
            var fileRecords = await _db.UploadedFiles.Where(f => f.CorrelationId == correlationId).ToListAsync();
            if (!fileRecords.Any())
                return new BusinessServiceResponse(BusinessServiceResponseStatus.Error, new string[] { "No files found for the given correlation id." });

            try
            {
                foreach (var fileRecord in fileRecords)
                {
                    var blobClient = _blobContainerClient.GetBlobClient(fileRecord.BlobName);
                    await blobClient.DeleteIfExistsAsync();
                    _db.UploadedFiles.Remove(fileRecord);
                }
                await _db.SaveChangesAsync();

                return new BusinessServiceResponse(BusinessServiceResponseStatus.Completed, new string[] { "Files deleted successfully." });
            }
            catch (Exception ex)
            {
                return new BusinessServiceResponse(BusinessServiceResponseStatus.Error, new string[] { "Error deleting files.", ex.Message });
            }
        }
    }
}
