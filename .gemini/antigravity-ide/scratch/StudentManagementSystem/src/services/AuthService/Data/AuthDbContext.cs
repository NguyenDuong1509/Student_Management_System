using Microsoft.EntityFrameworkCore;
using AuthService.Models;

namespace AuthService.Data
{
    public class AuthDbContext : DbContext
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed initial demo users
            var passHash = BCrypt.Net.BCrypt.HashPassword("123456");
            var adminPassHash = BCrypt.Net.BCrypt.HashPassword("admin123");

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "admin",
                    PasswordHash = adminPassHash,
                    FullName = "Quản Trị Viên (Admin)",
                    Email = "admin@studentmanager.vn",
                    Role = "Admin",
                    Department = "Ban BGH",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    Id = 2,
                    Username = "gvcn_cntt",
                    PasswordHash = passHash,
                    FullName = "ThS. Nguyễn Văn Bình (GVCN)",
                    Email = "binh.nguyen@studentmanager.vn",
                    Role = "HomeroomTeacher",
                    Department = "Công nghệ thông tin",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    Id = 3,
                    Username = "gvbm",
                    PasswordHash = passHash,
                    FullName = "TS. Trần Thị Hoa (GVBM)",
                    Email = "hoa.tran@studentmanager.vn",
                    Role = "SubjectTeacher",
                    Department = "Công nghệ thông tin",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    Id = 4,
                    Username = "student",
                    PasswordHash = passHash,
                    FullName = "Nguyen Van An (Sinh viên)",
                    Email = "an.nguyen@example.com",
                    Role = "Student",
                    Department = "Công nghệ thông tin",
                    CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );
        }
    }
}
