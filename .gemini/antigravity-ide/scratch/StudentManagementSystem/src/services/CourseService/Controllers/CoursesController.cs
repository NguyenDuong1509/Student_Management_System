using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CourseService.Data;
using CourseService.Models;

namespace CourseService.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class CoursesController : ControllerBase
    {
        private readonly CourseDbContext _context;

        public CoursesController(CourseDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Course>>> GetCourses([FromQuery] string? search, [FromQuery] string? department)
        {
            var query = _context.Courses.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(c => c.CourseName.ToLower().Contains(term) || c.CourseCode.ToLower().Contains(term));
            }

            if (!string.IsNullOrWhiteSpace(department))
            {
                query = query.Where(c => c.Department == department);
            }

            return await query.OrderBy(c => c.CourseCode).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Course>> GetCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return NotFound(new { message = "Không tìm thấy môn học." });
            return course;
        }

        [HttpPost]
        public async Task<ActionResult<Course>> CreateCourse([FromBody] Course course)
        {
            if (await _context.Courses.AnyAsync(c => c.CourseCode == course.CourseCode))
            {
                return BadRequest(new { message = "Mã môn học đã tồn tại!" });
            }

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCourse), new { id = course.Id }, course);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCourse(int id, [FromBody] Course course)
        {
            if (id != course.Id) return BadRequest(new { message = "ID không trùng khớp." });

            var existing = await _context.Courses.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Không tìm thấy môn học." });

            existing.CourseName = course.CourseName;
            existing.Credits = course.Credits;
            existing.Department = course.Department;
            existing.Description = course.Description;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return NotFound(new { message = "Không tìm thấy môn học." });

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
