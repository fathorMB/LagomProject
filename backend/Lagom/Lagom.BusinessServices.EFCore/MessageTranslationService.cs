using Microsoft.EntityFrameworkCore;
using SGBackend.Data;

namespace Lagom.BusinessServices.EFCore
{
    public class MessageTranslationService : IMessageTranslationService
    {
        private readonly LagomDbContext _db;

        public MessageTranslationService(LagomDbContext db)
        {
            _db = db;
        }

        public async Task<string> GetMessageAsync(string code, int idLanguage)
        {
            var dbMessage = await _db.AppMessages.FirstOrDefaultAsync(x => x.Code == code && x.AppLanguageId == idLanguage);

            if (dbMessage == null)
                throw new Exception($"Message with code {code} not found");

            return dbMessage.Message;
        }
    }
}
