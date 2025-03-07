using System;

namespace Lagom.WebAPI.Contracts.DTOs
{
    public class FileContract
    {
        public int Id { get; set; }              // Database record identifier
        public string FileName { get; set; }
        public string BlobName { get; set; }
        public string ContentType { get; set; }
        public string CorrelationId { get; set; }
        public DateTime UploadDate { get; set; }
        public long FileSize { get; set; }
        public Uri BlobUrl { get; set; }           // URL to the blob in Azure Storage
    }
}
