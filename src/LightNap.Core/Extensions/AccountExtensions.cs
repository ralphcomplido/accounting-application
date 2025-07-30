
using LightNap.Core.Data.Entities;
using LightNap.Core.Accounts.Dto.Request;
using LightNap.Core.Accounts.Dto.Response;

namespace LightNap.Core.Extensions
{
    public static class AccountExtensions
    {
        public static Account ToCreate(this CreateAccountDto dto)
        {
            // TODO: Update these fields to match the DTO.
            var item = new Account()
            {
                AccountNumber = dto.AccountNumber,
                AccountType = dto.AccountType,
                AccountName = dto.AccountName,
                CreatedDate = dto.CreatedDate,
                LastModifiedDate = dto.LastModifiedDate,
            };  
            return item;
        }

        public static AccountDto ToDto(this Account item)
        {
            // TODO: Update these fields to match the DTO.
            var dto = new AccountDto()
            {
                Id = item.Id,
                AccountNumber = item.AccountNumber,
                AccountType = item.AccountType,
                AccountName = item.AccountName,
                CreatedDate = item.CreatedDate,
                LastModifiedDate = item.LastModifiedDate,
            };
            return dto;
        }

        public static void UpdateFromDto(this Account item, UpdateAccountDto dto)
        {
            // TODO: Update these fields to match the DTO.
            item.AccountNumber = dto.AccountNumber;
            item.AccountType = dto.AccountType;
            item.AccountName = dto.AccountName;
            item.CreatedDate = dto.CreatedDate;
            item.LastModifiedDate = dto.LastModifiedDate;
        }
    }
}