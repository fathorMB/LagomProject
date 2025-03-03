using System.ComponentModel;

namespace Lagom.WebAPI.Contracts.Abstractions
{
    public abstract class APIRequest
    {
        public string RequestId { get; }

        protected APIRequest()
        {
            RequestId = Guid.NewGuid().ToString();
        }
    }
}
