using System.ComponentModel.DataAnnotations;

namespace StudentService.Models
{
    public class Student
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(20)]
        public string StudentCode { get; set; } = string.Empty; // MSSV (e.g., SV2026001)

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Phone]
        [MaxLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;

        public DateTime DateOfBirth { get; set; }

        [MaxLength(10)]
        public string Gender { get; set; } = "Nam";

        [Required]
        [MaxLength(100)]
        public string Department { get; set; } = string.Empty;

        public int AcademicYear { get; set; } = 2026;

        [MaxLength(20)]
        public string Status { get; set; } = "Đang học";

        [MaxLength(255)]
        public string? AvatarUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
