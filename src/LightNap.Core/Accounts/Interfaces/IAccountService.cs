
using LightNap.Core.Api;
using LightNap.Core.Accounts.Dto.Request;
using LightNap.Core.Accounts.Dto.Response;

namespace LightNap.Core.Accounts.Interfaces
{
    public interface IAccountService
    {
        Task<AccountDto?> GetAccountAsync(int id);
        Task<PagedResponseDto<AccountDto>> SearchAccountsAsync(SearchAccountsDto dto);
        Task<AccountDto> CreateAccountAsync(CreateAccountDto dto);
        Task<AccountDto> UpdateAccountAsync(int id, UpdateAccountDto dto);
        Task DeleteAccountAsync(int id);
    }
}
