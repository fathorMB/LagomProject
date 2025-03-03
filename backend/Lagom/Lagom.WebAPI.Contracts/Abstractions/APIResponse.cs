namespace Lagom.WebAPI.Contracts.Abstractions
{
    public abstract class APIResponse
    {
        public string RequestId { get; }
        public string ResponseId { get; }

        protected APIResponse(APIRequest request)
        {
            RequestId = request.RequestId;
            ResponseId = Guid.NewGuid().ToString();
        }
    }
}
