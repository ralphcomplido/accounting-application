﻿using LightNap.Core.Api;
using LightNap.Core.Configuration;
using LightNap.Core.Data;
using LightNap.Core.Data.Entities;
using LightNap.Core.Extensions;
using LightNap.Core.Interfaces;
using LightNap.Core.Users.Dto.Request;
using LightNap.Core.Users.Dto.Response;
using LightNap.Core.Users.Interfaces;
using LightNap.Core.Users.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LightNap.Core.Users.Services
{
    /// <summary>
    /// Service for managing administrator-related operations.
    /// </summary>
    public class UsersService(UserManager<ApplicationUser> userManager, ApplicationDbContext db, IUserContext userContext) : IUsersService
    {
        /// <summary>
        /// Retrieves a user by ID.
        /// </summary>
        /// <param name="userId">The ID of the user to retrieve.</param>
        /// <returns>The user details or null if not found.</returns>
        public async Task<PublicUserDto?> GetUserAsync(string userId)
        {
            bool isAdministrator = userContext.IsAdministrator;
            bool isPrivileged = userContext.IsAuthenticated;

            var user = await db.Users.FindAsync(userId);

            if (isAdministrator)
            {
                return user?.ToAdminUserDto();
            }

            if (isPrivileged)
            {
                return user?.ToPrivilegedUserDto();
            }

            return user?.ToPublicUserDto();
        }

        /// <summary>
        /// Searches for users based on the specified criteria.
        /// </summary>
        /// <param name="adminSearchUsersRequest">The search criteria.</param>
        /// <returns>The list of users matching the criteria.</returns>
        public async Task<PagedResponseDto<PublicUserDto>> SearchUsersAsync(AdminSearchUsersRequestDto adminSearchUsersRequest)
        {
            bool isAdministrator = userContext.IsAdministrator;
            bool isPrivileged = userContext.IsAuthenticated;

            IQueryable<ApplicationUser> query = db.Users.AsQueryable();

            // Query for provided public parameters. The provided request potentially has all fields, so casting it down to the public request
            // type makes it easier to limit querying done in this block to just the search fields supported by this privilege level.
            PublicSearchUsersRequestDto publicParameters = adminSearchUsersRequest;
            if (!string.IsNullOrWhiteSpace(publicParameters.Email))
            {
                query = query.Where(user => EF.Functions.Like(user.NormalizedEmail!, $"%{publicParameters.Email.ToUpper()}%"));
            }
            if (!string.IsNullOrWhiteSpace(publicParameters.UserName))
            {
                query = query.Where(user => EF.Functions.Like(user.NormalizedUserName!, $"%{publicParameters.UserName.ToUpper()}%"));
            }

            if (isPrivileged)
            {
                PrivilegedSearchUsersRequestDto privilegedParameters = adminSearchUsersRequest;
                // Query for provided privileged parameters.
            }

            if (isAdministrator)
            {
                // Query for provided admin parameters.
            }

            query = adminSearchUsersRequest.SortBy switch
            {
                ApplicationUserSortBy.Email => adminSearchUsersRequest.ReverseSort ? query.OrderByDescending(user => user.Email) : query.OrderBy(user => user.Email),
                ApplicationUserSortBy.UserName => adminSearchUsersRequest.ReverseSort ? query.OrderByDescending(user => user.UserName) : query.OrderBy(user => user.UserName),
                ApplicationUserSortBy.CreatedDate => adminSearchUsersRequest.ReverseSort ? query.OrderByDescending(user => user.CreatedDate) : query.OrderBy(user => user.CreatedDate),
                ApplicationUserSortBy.LastModifiedDate => adminSearchUsersRequest.ReverseSort ? query.OrderByDescending(user => user.LastModifiedDate) : query.OrderBy(user => user.LastModifiedDate),
                _ => throw new ArgumentException("Invalid sort field: '{sortBy}'", adminSearchUsersRequest.SortBy.ToString()),
            };
            int totalCount = await query.CountAsync();

            if (adminSearchUsersRequest.PageNumber > 1)
            {
                query = query.Skip((adminSearchUsersRequest.PageNumber - 1) * adminSearchUsersRequest.PageSize);
            }

            var users = await query.Take(adminSearchUsersRequest.PageSize).ToListAsync();

            if (isAdministrator)
            {
                var adminUserDtos = users.ToAdminUserDtoList().Cast<PublicUserDto>().ToList();
                return new PagedResponseDto<PublicUserDto>(adminUserDtos, adminSearchUsersRequest.PageNumber, adminSearchUsersRequest.PageSize, totalCount);
            }

            if (isPrivileged)
            {
                var privilegedUserDtos = users.ToPrivilegedUserDtoList().Cast<PublicUserDto>().ToList();
                return new PagedResponseDto<PublicUserDto>(privilegedUserDtos, adminSearchUsersRequest.PageNumber, adminSearchUsersRequest.PageSize, totalCount);
            }

            return new PagedResponseDto<PublicUserDto>(users.ToPublicUserDtoList(), adminSearchUsersRequest.PageNumber, adminSearchUsersRequest.PageSize, totalCount);
        }

        /// <summary>  
        /// Gets a list of users asynchronously by their IDs.  
        /// </summary>  
        /// <param name="userIds">The collection of user IDs.</param>  
        /// <returns>A task that represents the asynchronous operation. The task result contains the list of user data.</returns>  
        public async Task<IList<PublicUserDto>> GetUsersByIdsAsync(IEnumerable<string> userIds)
        {
            bool isAdministrator = userContext.IsAdministrator;
            bool isPrivileged = userContext.IsAuthenticated;

            var users = await db.Users.Where(user => userIds.Contains(user.Id)).ToListAsync();

            if (isAdministrator)
            {
                return [.. users.ToAdminUserDtoList().Cast<PublicUserDto>()];
            }

            if (isPrivileged)
            {
                return [.. users.ToPrivilegedUserDtoList().Cast<PublicUserDto>()];
            }

            return [.. users.ToPublicUserDtoList().Cast<PublicUserDto>()];
        }

        /// <summary>
        /// Updates a user.
        /// </summary>
        /// <param name="userId">The ID of the user to update.</param>
        /// <param name="adminUpdateUserRequest">The updated user information.</param>
        /// <returns>The updated user details.</returns>
        public async Task<AdminUserDto> UpdateUserAsync(string userId, AdminUpdateUserRequestDto adminUpdateUserRequest)
        {
            userContext.AssertAdministrator();

            var user = await db.Users.FindAsync(userId) ?? throw new UserFriendlyApiException("The specified user was not found.");

            user.UpdateAdminUserDto(adminUpdateUserRequest);

            await db.SaveChangesAsync();

            return user.ToAdminUserDto();
        }

        /// <summary>
        /// Deletes a user.
        /// </summary>
        /// <param name="userId">The ID of the user to delete.</param>
        public async Task DeleteUserAsync(string userId)
        {
            userContext.AssertAdministrator();

            var user = await db.Users.FindAsync(userId) ?? throw new UserFriendlyApiException("The specified user was not found.");

            if (await userManager.IsInRoleAsync(user, ApplicationRoles.Administrator.Name!)) { throw new UserFriendlyApiException("You may not delete an Administrator."); }

            db.Users.Remove(user);

            await db.SaveChangesAsync();
        }

        /// <summary>
        /// Locks a user account.
        /// </summary>
        /// <param name="userId">The ID of the user to lock.</param>
        public async Task LockUserAccountAsync(string userId)
        {
            userContext.AssertAdministrator();

            var user = await db.Users.FindAsync(userId) ?? throw new UserFriendlyApiException("The specified user was not found.");

            if (await userManager.IsInRoleAsync(user, ApplicationRoles.Administrator.Name!)) { throw new UserFriendlyApiException("You may not lock an Administrator account."); }

            user.LockoutEnd = DateTimeOffset.MaxValue;

            await db.SaveChangesAsync();
        }

        /// <summary>
        /// Unlocks a user account.
        /// </summary>
        /// <param name="userId">The ID of the user to unlock.</param>
        public async Task UnlockUserAccountAsync(string userId)
        {
            userContext.AssertAdministrator();

            var user = await db.Users.FindAsync(userId) ?? throw new UserFriendlyApiException("The specified user was not found.");

            user.LockoutEnd = null;

            await db.SaveChangesAsync();
        }
    }
}
