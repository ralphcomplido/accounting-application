
using LightNap.Core.Api;
using System;

namespace LightNap.Core.Accounts.Dto.Request
{
    public class SearchAccountsDto : PagedRequestDtoBase
    {
        // TODO: Update to reflect which fields to include for searches.
        public string? AccountNumber { get; set; }
        public string? AccountType { get; set; }
        public string? AccountName { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? LastModifiedDate { get; set; }

    }
}