namespace Lagom.Model
{
    public class AppMessage
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Type { get; set; }
        public string Severity { get; set; }
        public string Message { get; set; }
        public int AppLanguageId { get; set; }
        public AppLanguage AppLanguage { get; set; }
    }
}