namespace Lagom.Common
{
    public class AppSettings
    {
        public string Secret { get; set; } = string.Empty;
        public int TokenExpirationInMinutes { get; set; }
        public string Audience { get; set; } = string.Empty;
        public string Issuer { get; set; } = string.Empty;
    }
}
