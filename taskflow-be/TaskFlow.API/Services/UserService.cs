using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using TaskFlow.API.Data;
using TaskFlow.API.Models;
using Microsoft.Extensions.Logging;

namespace TaskFlow.API.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UserService> _logger;

        public UserService(ApplicationDbContext context, ILogger<UserService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<User> RegisterUserAsync(User user)
        {
            try
            {
                // Check if user already exists
                if (await _context.Users.AnyAsync(u => u.Email == user.Email))
                {
                    throw new Exception("Email already exists");
                }

                if (await _context.Users.AnyAsync(u => u.Username == user.Username))
                {
                    throw new Exception("Username already exists");
                }

                // Add user to database
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering user");
                throw;
            }
        }

        public async Task<User> LoginUserAsync(string email, string password)
        {
            try
            {
                // Find user by email
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
                if (user == null)
                {
                    throw new Exception("Invalid email or password");
                }

                // Compare hashed passwords directly since the password is already hashed
                if (user.PasswordHash != password)
                {
                    throw new Exception("Invalid email or password");
                }

                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging in user");
                throw;
            }
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            try
            {
                return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user by email");
                throw;
            }
        }

        public async Task<User> GetUserByUsernameAsync(string username)
        {
            try
            {
                return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user by username");
                throw;
            }
        }
    }
} 