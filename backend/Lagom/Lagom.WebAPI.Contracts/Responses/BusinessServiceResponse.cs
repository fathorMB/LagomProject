using Lagom.WebAPI.Contracts.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lagom.WebAPI.Contracts.Responses
{
    public class BusinessServiceResponse : APIResponse
    {
        public BusinessServiceResponse(BusinessServiceResponseStatus businessServiceStatus, string[] businessServiceMessages) : base(businessServiceStatus, businessServiceMessages)
        {
        }

        public BusinessServiceResponse(APIRequest request, BusinessServiceResponseStatus businessServiceStatus, string[] businessServiceMessages) : base(request, businessServiceStatus, businessServiceMessages)
        {
        }
    }
}
