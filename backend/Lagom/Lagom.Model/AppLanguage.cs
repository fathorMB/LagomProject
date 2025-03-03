namespace Lagom.Model
{
    public class AppLanguage
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string NativeName { get; set; }
        public bool IsActive { get; set; }
        public ICollection<AppMessage> AppMessages { get; set; }
    }
}
