
using LightNap.Core.Api;
using LightNap.Core.Data;
using LightNap.Core.Data.Entities;
using LightNap.Core.Extensions;
using LightNap.Core.Accounts.Interfaces;
using LightNap.Core.Accounts.Dto.Request;
using LightNap.Core.Accounts.Dto.Response;
using Microsoft.EntityFrameworkCore;

namespace LightNap.Core.Accounts.Services
{
    public class AccountService(ApplicationDbContext db) : IAccountService
    {
        public async Task<AccountDto?> GetAccountAsync(int id)
        {
            var item = await db.Accounts.FindAsync(id);
            return item?.ToDto();
        }

        public async Task<PagedResponseDto<AccountDto>> SearchAccountsAsync(SearchAccountsDto dto)
        {
            var query = db.Accounts.AsQueryable();

            // TODO: Update filters and sorting

            if (dto.AccountNumber is not null)
            {
                query = query.Where(item => item.AccountNumber == dto.AccountNumber);
            }

            if (dto.AccountType is not null)
            {
                query = query.Where(item => item.AccountType == dto.AccountType);
            }

            if (dto.AccountName is not null)
            {
                query = query.Where(item => item.AccountName == dto.AccountName);
            }

            if (dto.CreatedDate is not null)
            {
                query = query.Where(item => item.CreatedDate == dto.CreatedDate);
            }

            if (dto.LastModifiedDate is not null)
            {
                query = query.Where(item => item.LastModifiedDate == dto.LastModifiedDate);
            }

            query = query.OrderBy(item => item.Id);

            int totalCount = await query.CountAsync();

            if (dto.PageNumber > 1)
            {
                query = query.Skip((dto.PageNumber - 1) * dto.PageSize);
            }

            var items = await query.Take(dto.PageSize).Select(item => item.ToDto()).ToListAsync();

            return new PagedResponseDto<AccountDto>(items, dto.PageNumber, dto.PageSize, totalCount);
        }

        public async Task<AccountDto> CreateAccountAsync(CreateAccountDto dto)
        {
            Account item = dto.ToCreate();
            db.Accounts.Add(item);
            await db.SaveChangesAsync();
            return item.ToDto();
        }

        public async Task<AccountDto> UpdateAccountAsync(int id, UpdateAccountDto dto)
        {
            var item = await db.Accounts.FindAsync(id) ?? throw new UserFriendlyApiException("The specified Account was not found.");
            item.UpdateFromDto(dto);
            await db.SaveChangesAsync();
            return item.ToDto();
        }

        public async Task DeleteAccountAsync(int id)
        {
            var item = await db.Accounts.FindAsync(id) ?? throw new UserFriendlyApiException("The specified Account was not found.");
            db.Accounts.Remove(item);
            await db.SaveChangesAsync();
        }
    }
}