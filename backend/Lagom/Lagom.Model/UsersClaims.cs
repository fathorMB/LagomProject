﻿namespace Lagom.Model
{
    public class UsersClaims
    {
        public int UserId { get; set; }
        public User User { get; set; }
        public int ClaimId { get; set; }
        public Claim Claim { get; set; }
    }
}
