using Lagom.Model.Abstracts;
using SGBackend.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lagom.BusinessServices.EFCore.DataValidation.Abstracts
{
    internal abstract class LagomDBDataValidator<T> where T : LagomDBEntity
    {
        internal abstract Task<LagomDBDataValidatorResult> Validate(T entity, LagomDbContext dbContext);
    }

    internal class LagomDBDataValidatorResult
    {
        internal LagomDBDataValidatorResultStatus Status { get; set; }
        internal string ValidationMessage { get; set; }
    }

    internal enum LagomDBDataValidatorResultStatus
    {
        Success,
        DuplicateEntity,
        InconsistentEntity,
        DataError
    }
}
