namespace Lagom.Model
{
    public class Claim
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<UsersClaims> UsersClaims { get; set; }
    }
}
