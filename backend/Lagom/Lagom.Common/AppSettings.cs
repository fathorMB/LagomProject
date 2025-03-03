namespace Lagom.Common
{
    public class AppSettings
    {
        public string JWTSecret { get; set; } = string.Empty;
        public int JWTTokenExpirationInMinutes { get; set; }
        public string JWTAudience { get; set; } = string.Empty;
        public string JWTIssuer { get; set; } = string.Empty;
        public int WebSocketProbeInterval { get; set; }
        public string WebSocketProbeAPIVersion { get; set; } = string.Empty;
    }
}
