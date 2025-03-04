﻿namespace Lagom.Model
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string AccessKeyHash { get; set; }
        public bool IsActive { get; set; }
        public ICollection<UsersClaims> UsersClaims { get; set; }
    }
}
