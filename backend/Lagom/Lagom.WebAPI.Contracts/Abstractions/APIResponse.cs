namespace Lagom.WebAPI.Contracts.Abstractions
{
    public enum BusinessServiceResponseStatus
    {
        Completed,
        CompletedWithErrors,
        Error,
        Unknown
    }

    public abstract class APIResponse
    {
        public string RequestId { get; }
        public string ResponseId { get; }
        public BusinessServiceResponseStatus BusinessServiceStatus { get; }
        public string[] BusinessServiceMessages { get; }

        protected APIResponse(APIRequest request, BusinessServiceResponseStatus businessServiceStatus, string[] businessServiceMessages)
        {
            RequestId = request.RequestId;
            ResponseId = Guid.NewGuid().ToString();
            BusinessServiceStatus = businessServiceStatus;
            BusinessServiceMessages = businessServiceMessages;
        }
    }
}
