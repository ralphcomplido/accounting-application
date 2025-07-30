using LightNap.Core.Api;
using LightNap.Core.Users.Dto.Request;
using LightNap.Core.Users.Dto.Response;

namespace LightNap.Core.Users.Interfaces
{
    /// <summary>  
    /// Interface for managing users.
    /// </summary>  
    public interface IUsersService
    {
        /// <summary>  
        /// Gets a user asynchronously by user ID.  
        /// </summary>  
        /// <param name="userId">The user ID.</param>  
        /// <returns>A task that represents the asynchronous operation. The task result contains the user data.</returns>  
        Task<PublicUserDto?> GetUserAsync(string userId);

        /// <summary>  
        /// Searches users asynchronously based on the specified request DTO.  
        /// </summary>  
        /// <param name="adminSearchUsersRequest">The request DTO containing search parameters.</param>  
        /// <returns>A task that represents the asynchronous operation. The task result contains the paged user data.</returns>  
        Task<PagedResponseDto<PublicUserDto>> SearchUsersAsync(AdminSearchUsersRequestDto adminSearchUsersRequest);

        /// <summary>  
        /// Gets a list of users asynchronously by their IDs.  
        /// </summary>  
        /// <param name="userIds">The collection of user IDs.</param>  
        /// <returns>A task that represents the asynchronous operation. The task result contains the list of user data.</returns>  
        Task<IList<PublicUserDto>> GetUsersByIdsAsync(IEnumerable<string> userIds);

        /// <summary>  
        /// Updates a user asynchronously by user ID.  
        /// </summary>  
        /// <param name="userId">The user ID.</param>  
        /// <param name="adminUpdateUserRequest">The request DTO containing update information.</param>  
        /// <returns>A task that represents the asynchronous operation. The task result contains the updated user data.</returns>  
        Task<AdminUserDto> UpdateUserAsync(string userId, AdminUpdateUserRequestDto adminUpdateUserRequest);

        /// <summary>  
        /// Deletes a user asynchronously by user ID.  
        /// </summary>  
        /// <param name="userId">The user ID.</param>  
        /// <returns>A task that represents the asynchronous operation.</returns>  
        Task DeleteUserAsync(string userId);

        /// <summary>  
        /// Locks a user account asynchronously by user ID.  
        /// </summary>  
        /// <param name="userId">The user ID.</param>  
        /// <returns>A task that represents the asynchronous operation.</returns>  
        Task LockUserAccountAsync(string userId);

        /// <summary>  
        /// Unlocks a user account asynchronously by user ID.  
        /// </summary>  
        /// <param name="userId">The user ID.</param>  
        /// <returns>A task that represents the asynchronous operation.</returns>  
        Task UnlockUserAccountAsync(string userId);
    }
}