
using System;

namespace LightNap.Core.Accounts.Dto.Response
{
    public class AccountDto
    {
        // TODO: Finalize which fields to include when returning this item.
		public int Id { get; set; }
        public string AccountNumber { get; set; }
        public string AccountType { get; set; }
        public string AccountName { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
    }
}
