namespace Lagom.WebAPI.Contracts.DTOs
{
    public class UserContract
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public bool IsActive { get; set; }
        public IList<ClaimContract> Claims { get; set; }
    }
}
