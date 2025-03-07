using Lagom.Model.Abstracts;
using Microsoft.EntityFrameworkCore;
using SGBackend.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lagom.BusinessServices.EFCore.Utility
{
    internal static class NextIdCalculator
    {
        internal static async Task<int> NextId<T>(LagomDbContext dbContext) where T : LagomDBEntity
        {
            var set = dbContext.Set<T>();

            if (set == null)
                throw new Exception("Invalid data operation. Check logs.");

            bool any = await set.AnyAsync();

            return !any ? 1 : set.Max<T>(e => e.Id);
        }
    }
}
