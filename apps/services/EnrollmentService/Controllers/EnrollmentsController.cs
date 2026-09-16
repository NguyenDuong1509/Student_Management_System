using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EnrollmentService.Data;
using EnrollmentService.Dtos;
using EnrollmentService.Models;
using EnrollmentService.Services;

namespace EnrollmentService.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class EnrollmentsController : ControllerBase
    {
        private readonly EnrollmentDbContext _context;
        private readonly IIntegrationService _integration;

        public EnrollmentsController(EnrollmentDbContext context, IIntegrationService integration)
        {
            _context = context;
            _integration = integration;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EnrollmentDto>>> GetEnrollments([FromQuery] int? studentId, [FromQuery] int? courseId, [FromQuery] string? semester)
        {
            var query = _context.Enrollments.AsQueryable();

            if (studentId.HasValue) query = query.Where(e => e.StudentId == studentId.Value);
            if (courseId.HasValue) query = query.Where(e => e.CourseId == courseId.Value);
            if (!string.IsNullOrWhiteSpace(semester)) query = query.Where(e => e.Semester == semester);

            var enrollments = await query.ToListAsync();

            var studentsMap = await _integration.GetStudentsMapAsync();
            var coursesMap = await _integration.GetCoursesMapAsync();

            var dtos = enrollments.Select(e =>
            {
                studentsMap.TryGetValue(e.StudentId, out var student);
                coursesMap.TryGetValue(e.CourseId, out var course);

                return new EnrollmentDto
                {
                    Id = e.Id,
                    StudentId = e.StudentId,
                    StudentCode = student?.StudentCode ?? $"SV#{e.StudentId}",
                    StudentName = student?.FullName ?? $"Sinh viên #{e.StudentId}",
                    Department = student?.Department ?? "N/A",

                    CourseId = e.CourseId,
                    CourseCode = course?.CourseCode ?? $"MH#{e.CourseId}",
                    CourseName = course?.CourseName ?? $"Môn học #{e.CourseId}",
                    Credits = course?.Credits ?? 3,

                    Semester = e.Semester,
                    MidtermScore = e.MidtermScore,
                    FinalScore = e.FinalScore,
                    TotalScore = e.TotalScore,
                    GradeLetter = e.GradeLetter,
                    Gpa4 = e.GPA4
                };
            }).ToList();

            return dtos;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EnrollmentDto>> GetEnrollment(int id)
        {
            var e = await _context.Enrollments.FindAsync(id);
            if (e == null) return NotFound(new { message = "Không tìm thấy hồ sơ đăng ký." });

            var student = await _integration.GetStudentAsync(e.StudentId);
            var course = await _integration.GetCourseAsync(e.CourseId);

            return new EnrollmentDto
            {
                Id = e.Id,
                StudentId = e.StudentId,
                StudentCode = student?.StudentCode ?? $"SV#{e.StudentId}",
                StudentName = student?.FullName ?? $"Sinh viên #{e.StudentId}",
                Department = student?.Department ?? "N/A",

                CourseId = e.CourseId,
                CourseCode = course?.CourseCode ?? $"MH#{e.CourseId}",
                CourseName = course?.CourseName ?? $"Môn học #{e.CourseId}",
                Credits = course?.Credits ?? 3,

                Semester = e.Semester,
                MidtermScore = e.MidtermScore,
                FinalScore = e.FinalScore,
                TotalScore = e.TotalScore,
                GradeLetter = e.GradeLetter,
                Gpa4 = e.GPA4
            };
        }

        [HttpPost]
        public async Task<ActionResult<EnrollmentDto>> CreateEnrollment([FromBody] CreateEnrollmentDto dto)
        {
            var exists = await _context.Enrollments.AnyAsync(e => e.StudentId == dto.StudentId && e.CourseId == dto.CourseId && e.Semester == dto.Semester);
            if (exists)
            {
                return BadRequest(new { message = "Sinh viên đã đăng ký học phần này trong học kỳ rồi!" });
            }

            var enrollment = new Enrollment
            {
                StudentId = dto.StudentId,
                CourseId = dto.CourseId,
                Semester = dto.Semester
            };

            _context.Enrollments.Add(enrollment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEnrollment), new { id = enrollment.Id }, enrollment);
        }

        [HttpPut("{id}/grades")]
        public async Task<IActionResult> UpdateGrades(int id, [FromBody] UpdateGradeDto gradeDto)
        {
            var e = await _context.Enrollments.FindAsync(id);
            if (e == null) return NotFound(new { message = "Không tìm thấy hồ sơ đăng ký." });

            if (gradeDto.MidtermScore.HasValue) e.MidtermScore = gradeDto.MidtermScore.Value;
            if (gradeDto.FinalScore.HasValue) e.FinalScore = gradeDto.FinalScore.Value;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEnrollment(int id)
        {
            var e = await _context.Enrollments.FindAsync(id);
            if (e == null) return NotFound(new { message = "Không tìm thấy đăng ký học phần." });

            _context.Enrollments.Remove(e);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
