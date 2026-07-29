using System.ComponentModel.DataAnnotations;

namespace CourseService.Models
{
    public class Course
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(20)]
        public string CourseCode { get; set; } = string.Empty; // Mã môn (e.g., INT1001)

        [Required]
        [MaxLength(150)]
        public string CourseName { get; set; } = string.Empty; // Tên môn (e.g., Lập trình C#, Cơ sở dữ liệu...)

        public int Credits { get; set; } = 3; // Số tín chỉ

        [MaxLength(100)]
        public string Department { get; set; } = string.Empty; // Khoa phụ trách

        [MaxLength(500)]
        public string? Description { get; set; }
    }
}
