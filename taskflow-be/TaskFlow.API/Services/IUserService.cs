using TaskFlow.API.Models;

namespace TaskFlow.API.Services
{
    public interface IUserService
    {
        Task<User> RegisterUserAsync(User user);
        Task<User> LoginUserAsync(string email, string password);
        Task<User> GetUserByEmailAsync(string email);
        Task<User> GetUserByUsernameAsync(string username);
    }
} 