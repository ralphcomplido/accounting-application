
using System;

namespace LightNap.Core.Accounts.Dto.Request
{
    public class UpdateAccountDto
    {
        // TODO: Update which fields to include when creating this item.
        public string AccountNumber { get; set; }
        public string AccountType { get; set; }
        public string AccountName { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
    }
}