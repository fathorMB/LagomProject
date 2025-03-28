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
                            Route = "lagom/menu/contacts"
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
                            Icon = "mat:groups",
                            Route = "lagom/menu/contacts"
                        },
                        new NavigationLink
                        {
                            Label = "Magazzino",
                            Icon = "mat:warehouse",
                            Route = "lagom/menu/warehouse"
                        },
                        new NavigationLink
                        {
                            Label = "Eventi",
                            Icon = "mat:festival",
                            Route = "lagom/menu/events"
                        },
                        new NavigationLink
                        {
                            Label = "Calendario",
                            Icon = "mat:event",
                            Route = "lagom/menu/calendar"
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
                            Route = "lagom/admin/users"
                        }
                    }
                }
            };
        }
    }
}
