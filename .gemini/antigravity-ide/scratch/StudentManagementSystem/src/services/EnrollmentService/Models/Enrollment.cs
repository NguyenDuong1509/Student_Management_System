using System.ComponentModel.DataAnnotations;

namespace EnrollmentService.Models
{
    public class Enrollment
    {
        public int Id { get; set; }

        public int StudentId { get; set; }

        public int CourseId { get; set; }

        [Required]
        [MaxLength(20)]
        public string Semester { get; set; } = "HK1-2025-2026";

        [Range(0, 10)]
        public double? MidtermScore { get; set; }

        [Range(0, 10)]
        public double? FinalScore { get; set; }

        public double? TotalScore
        {
            get
            {
                if (MidtermScore.HasValue && FinalScore.HasValue)
                {
                    return Math.Round(MidtermScore.Value * 0.4 + FinalScore.Value * 0.6, 2);
                }
                return null;
            }
        }

        public string GradeLetter
        {
            get
            {
                var total = TotalScore;
                if (!total.HasValue) return "N/A";
                if (total >= 8.5) return "A";
                if (total >= 7.0) return "B";
                if (total >= 5.5) return "C";
                if (total >= 4.0) return "D";
                return "F";
            }
        }

        public double GPA4
        {
            get
            {
                var total = TotalScore;
                if (!total.HasValue) return 0.0;
                if (total >= 8.5) return 4.0;
                if (total >= 7.0) return 3.0;
                if (total >= 5.5) return 2.0;
                if (total >= 4.0) return 1.0;
                return 0.0;
            }
        }
    }
}
