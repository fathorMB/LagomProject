using Lagom.WebAPI.Contracts.DTOs.Menu;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lagom.BusinessServices.EFCore
{
    public class ClientNavigationService : IClientNavigationService
    {
        public async Task<NavigationItem[]> GetNavigationItems(int claimId)
        {
            switch(claimId)
            {
                case 1:
                    return GetAdminNavigationItems();
                case 2:
                default:
                    return GetDataOperatorNavigationItems();
            }
        }

        private NavigationItem[] GetDataOperatorNavigationItems()
        {
            return new NavigationItem[]
            {
                new NavigationSubheading
                {
                    Label = "Menù",
                    Children = new List<NavigationItem>
                    {
                        new NavigationLink
                        {
                            Label = "Blank",
                            Icon = "mat:picture_in_picture",
                            Route = "/ui/page-layouts/blank"
                        }
                    }
                }
            };
        }

        private NavigationItem[] GetAdminNavigationItems()
        {
            return new NavigationItem[]
            {
                new NavigationSubheading
                {
                    Label = "Menù",
                    Children = new List<NavigationItem>
                    {
                        new NavigationLink
                        {
                            Label = "Contatti",
                            Icon = "mat:picture_in_picture",
                            Route = "/ui/page-layouts/blank"
                        }
                    }
                },
                new NavigationSubheading
                {
                    Label = "Admin",
                    Children = new List<NavigationItem>
                    {
                        new NavigationLink
                        {
                            Label = "Utenti",
                            Icon = "mat:people",
                            Route = "/ui/admin/users"
                        }
                    }
                }
            };
        }
    }
}
