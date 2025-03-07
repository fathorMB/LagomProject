using Lagom.Model.Abstracts;

namespace Lagom.Model
{
    public class Claim : LagomDBEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<UsersClaims> UsersClaims { get; set; }
    }
}
