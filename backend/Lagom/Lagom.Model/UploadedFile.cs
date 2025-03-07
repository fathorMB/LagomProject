using Lagom.Model.Abstracts;
using System;

namespace Lagom.Model
{
    public class UploadedFile : LagomDBEntity
    {
        public string BlobName { get; set; }           // The unique name in Blob Storage
        public string FileName { get; set; }           // Original file name
        public string ContentType { get; set; }        // MIME type
        public string CorrelationId { get; set; }      // Logical grouping identifier
        public DateTime UploadDate { get; set; }       // When the file was uploaded
        public long FileSize { get; set; }             // File size in bytes (optional)
    }
}
