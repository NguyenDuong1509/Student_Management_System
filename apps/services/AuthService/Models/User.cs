using System.ComponentModel.DataAnnotations;

namespace AuthService.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(30)]
        public string Role { get; set; } = "Student"; // Admin, HomeroomTeacher, SubjectTeacher, Student

        [MaxLength(100)]
        public string Department { get; set; } = string.Empty; // e.g., Công nghệ thông tin

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
