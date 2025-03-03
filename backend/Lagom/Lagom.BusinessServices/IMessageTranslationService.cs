namespace Lagom.BusinessServices
{
    public interface IMessageTranslationService
    {
        Task<string> GetMessageAsync(string code, int idLanguage);
    }
}
