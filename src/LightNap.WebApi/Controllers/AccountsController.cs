
using LightNap.Core.Api;
using LightNap.Core.Accounts.Interfaces;
using LightNap.Core.Accounts.Dto.Request;
using LightNap.Core.Accounts.Dto.Response;
using Microsoft.AspNetCore.Mvc;

namespace LightNap.WebApi.Controllers
{
    // TODO: Update authorization for methods via the Authorize attribute at the controller or method level.
    // Also register this controller's dependencies in the AddApplicationServices method of Extensions/ApplicationServiceExtensions.cs:
    //
    // services.AddScoped<IAccountService, AccountService>();
    //
    [ApiController]
    [Route("api/[controller]")]
    public class AccountsController(IAccountService accountsService) : ControllerBase
    {
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponseDto<AccountDto>), 200)]
        public async Task<ApiResponseDto<AccountDto>> GetAccount(int id)
        {
            return new ApiResponseDto<AccountDto>(await accountsService.GetAccountAsync(id));
        }

        [HttpPost("search")]
        [ProducesResponseType(typeof(ApiResponseDto<PagedResponseDto<AccountDto>>), 200)]
        public async Task<ApiResponseDto<PagedResponseDto<AccountDto>>> SearchAccounts([FromBody] SearchAccountsDto dto)
        {
            return new ApiResponseDto<PagedResponseDto<AccountDto>>(await accountsService.SearchAccountsAsync(dto));
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResponseDto<AccountDto>), 201)]
        public async Task<ApiResponseDto<AccountDto>> CreateAccount([FromBody] CreateAccountDto dto)
        {
            return new ApiResponseDto<AccountDto>(await accountsService.CreateAccountAsync(dto));
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResponseDto<AccountDto>), 200)]
        public async Task<ApiResponseDto<AccountDto>> UpdateAccount(int id, [FromBody] UpdateAccountDto dto)
        {
            return new ApiResponseDto<AccountDto>(await accountsService.UpdateAccountAsync(id, dto));
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResponseDto<bool>), 200)]
        public async Task<ApiResponseDto<bool>> DeleteAccount(int id)
        {
            await accountsService.DeleteAccountAsync(id);
            return new ApiResponseDto<bool>(true);
        }
    }
}
