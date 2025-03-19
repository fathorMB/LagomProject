using Lagom.WebAPI.Contracts.DTOs.Menu;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lagom.BusinessServices
{
    public interface IClientNavigationService
    {
        Task<NavigationItem[]> GetNavigationItems(int claimId);
    }
}
