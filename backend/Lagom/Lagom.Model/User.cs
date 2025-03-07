using Lagom.Model.Abstracts;

namespace Lagom.Model
{
    public class User : LagomDBEntity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string AccessKeyHash { get; set; }
        public bool IsActive { get; set; }
        public ICollection<UsersClaims> UsersClaims { get; set; }
    }
}
