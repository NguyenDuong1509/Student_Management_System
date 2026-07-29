using Microsoft.EntityFrameworkCore;
using StudentService.Models;

namespace StudentService.Data
{
    public class StudentDbContext : DbContext
    {
        public StudentDbContext(DbContextOptions<StudentDbContext> options) : base(options) { }

        public DbSet<Student> Students { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Student>().HasData(
                new Student
                {
                    Id = 1,
                    StudentCode = "SV2026001",
                    FullName = "Nguyen Van An",
                    Email = "an.nguyen@example.com",
                    PhoneNumber = "0912345678",
                    DateOfBirth = new DateTime(2003, 5, 15, 0, 0, 0, DateTimeKind.Utc),
                    Gender = "Nam",
                    Department = "Công nghệ thông tin",
                    AcademicYear = 2026,
                    Status = "Đang học",
                    CreatedAt = new DateTime(2026, 1, 10, 0, 0, 0, DateTimeKind.Utc)
                },
                new Student
                {
                    Id = 2,
                    StudentCode = "SV2026002",
                    FullName = "Tran Thi Mai",
                    Email = "mai.tran@example.com",
                    PhoneNumber = "0987654321",
                    DateOfBirth = new DateTime(2004, 8, 22, 0, 0, 0, DateTimeKind.Utc),
                    Gender = "Nữ",
                    Department = "Kinh tế & Quản trị",
                    AcademicYear = 2026,
                    Status = "Đang học",
                    CreatedAt = new DateTime(2026, 1, 12, 0, 0, 0, DateTimeKind.Utc)
                },
                new Student
                {
                    Id = 3,
                    StudentCode = "SV2026003",
                    FullName = "Le Hoang Nam",
                    Email = "nam.le@example.com",
                    PhoneNumber = "0933112233",
                    DateOfBirth = new DateTime(2003, 11, 30, 0, 0, 0, DateTimeKind.Utc),
                    Gender = "Nam",
                    Department = "Công nghệ thông tin",
                    AcademicYear = 2026,
                    Status = "Đang học",
                    CreatedAt = new DateTime(2026, 1, 15, 0, 0, 0, DateTimeKind.Utc)
                }
            );
        }
    }
}
