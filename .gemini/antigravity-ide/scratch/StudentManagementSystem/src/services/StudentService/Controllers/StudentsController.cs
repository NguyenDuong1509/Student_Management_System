using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentService.Data;
using StudentService.Models;

namespace StudentService.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class StudentsController : ControllerBase
    {
        private readonly StudentDbContext _context;

        public StudentsController(StudentDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents([FromQuery] string? search, [FromQuery] string? department)
        {
            var query = _context.Students.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(s => s.FullName.ToLower().Contains(term) 
                                      || s.StudentCode.ToLower().Contains(term)
                                      || s.Email.ToLower().Contains(term));
            }

            if (!string.IsNullOrWhiteSpace(department))
            {
                query = query.Where(s => s.Department == department);
            }

            return await query.OrderByDescending(s => s.Id).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound(new { message = "Không tìm thấy sinh viên." });
            return student;
        }

        [HttpPost]
        public async Task<ActionResult<Student>> CreateStudent([FromBody] Student student)
        {
            if (await _context.Students.AnyAsync(s => s.StudentCode == student.StudentCode))
            {
                return BadRequest(new { message = "Mã sinh viên đã tồn tại trên hệ thống!" });
            }

            student.CreatedAt = DateTime.UtcNow;
            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, student);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] Student student)
        {
            if (id != student.Id) return BadRequest(new { message = "ID không trùng khớp." });

            var existing = await _context.Students.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Không tìm thấy sinh viên." });

            existing.FullName = student.FullName;
            existing.Email = student.Email;
            existing.PhoneNumber = student.PhoneNumber;
            existing.DateOfBirth = student.DateOfBirth;
            existing.Gender = student.Gender;
            existing.Department = student.Department;
            existing.AcademicYear = student.AcademicYear;
            existing.Status = student.Status;
            existing.AvatarUrl = student.AvatarUrl;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound(new { message = "Không tìm thấy sinh viên." });

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
