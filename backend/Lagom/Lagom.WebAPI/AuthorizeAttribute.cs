using Lagom.WebAPI.Contracts.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Lagom.WebAPI
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AuthorizeAttribute : Attribute, IAuthorizationFilter
    {
        public int[] Claims { get; set; }

        public AuthorizeAttribute(params int[] claims)
        {
            Claims = claims;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = (UserContract?)context.HttpContext.Items["User"];

            if (user == null)
            {
                context.Result = new JsonResult(new { message = "Unauthorized" }) { StatusCode = StatusCodes.Status401Unauthorized };
            }
            else
            {
                if (!user.Claims.Any(c => c.Id == 1) || Claims.Count() != 0)
                {
                    //user is not admin
                    if (!user.Claims.Any(c => Claims.Contains(c.Id)))
                    {
                        //user does not have the right claim
                        context.Result = new JsonResult(new { message = "Forbidden - User does not have necessary route claims" }) { StatusCode = StatusCodes.Status403Forbidden };
                    }
                }
            }
        }
    }
}
