using Microsoft.EntityFrameworkCore;
using EnrollmentService.Models;

namespace EnrollmentService.Data
{
    public class EnrollmentDbContext : DbContext
    {
        public EnrollmentDbContext(DbContextOptions<EnrollmentDbContext> options) : base(options) { }

        public DbSet<Enrollment> Enrollments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Enrollment>().HasData(
                new Enrollment
                {
                    Id = 1,
                    StudentId = 1,
                    CourseId = 1,
                    Semester = "HK1-2025-2026",
                    MidtermScore = 8.5,
                    FinalScore = 9.0
                },
                new Enrollment
                {
                    Id = 2,
                    StudentId = 1,
                    CourseId = 2,
                    Semester = "HK1-2025-2026",
                    MidtermScore = 7.5,
                    FinalScore = 8.0
                },
                new Enrollment
                {
                    Id = 3,
                    StudentId = 2,
                    CourseId = 4,
                    Semester = "HK1-2025-2026",
                    MidtermScore = 9.0,
                    FinalScore = 9.5
                }
            );
        }
    }
}
