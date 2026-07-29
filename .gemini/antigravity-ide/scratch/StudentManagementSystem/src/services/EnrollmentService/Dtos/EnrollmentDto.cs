using System.Text.Json.Serialization;

namespace EnrollmentService.Dtos
{
    public class EnrollmentDto
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public string StudentCode { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;

        public int CourseId { get; set; }
        public string CourseCode { get; set; } = string.Empty;
        public string CourseName { get; set; } = string.Empty;
        public int Credits { get; set; }

        public string Semester { get; set; } = string.Empty;
        public double? MidtermScore { get; set; }
        public double? FinalScore { get; set; }
        public double? TotalScore { get; set; }
        public string GradeLetter { get; set; } = "N/A";

        [JsonPropertyName("gpa4")]
        public double Gpa4 { get; set; }
    }

    public class CreateEnrollmentDto
    {
        public int StudentId { get; set; }
        public int CourseId { get; set; }
        public string Semester { get; set; } = "HK1-2025-2026";
    }

    public class UpdateGradeDto
    {
        public double? MidtermScore { get; set; }
        public double? FinalScore { get; set; }
    }

    public class StudentExternalDto
    {
        public int Id { get; set; }
        public string StudentCode { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
    }

    public class CourseExternalDto
    {
        public int Id { get; set; }
        public string CourseCode { get; set; } = string.Empty;
        public string CourseName { get; set; } = string.Empty;
        public int Credits { get; set; }
    }
}
