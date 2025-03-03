using System.ComponentModel;

namespace Lagom.WebAPI.Contracts.Abstractions
{
    public abstract class APIRequest
    {
        public string RequestId { get; }

        [DefaultValue(1)]
        public int AppLanguageId { get; set; }

        protected APIRequest()
        {
            RequestId = Guid.NewGuid().ToString();
        }
    }
}
