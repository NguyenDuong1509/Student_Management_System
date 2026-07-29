using System.Net.Http.Json;
using EnrollmentService.Dtos;

namespace EnrollmentService.Services
{
    public interface IIntegrationService
    {
        Task<StudentExternalDto?> GetStudentAsync(int id);
        Task<CourseExternalDto?> GetCourseAsync(int id);
        Task<Dictionary<int, StudentExternalDto>> GetStudentsMapAsync();
        Task<Dictionary<int, CourseExternalDto>> GetCoursesMapAsync();
    }

    public class IntegrationService : IIntegrationService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public IntegrationService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
        }

        public async Task<StudentExternalDto?> GetStudentAsync(int id)
        {
            try
            {
                var baseUrl = _config["Services:StudentServiceUrl"] ?? "http://localhost:5001";
                return await _httpClient.GetFromJsonAsync<StudentExternalDto>($"{baseUrl}/api/v1/students/{id}");
            }
            catch
            {
                return null;
            }
        }

        public async Task<CourseExternalDto?> GetCourseAsync(int id)
        {
            try
            {
                var baseUrl = _config["Services:CourseServiceUrl"] ?? "http://localhost:5002";
                return await _httpClient.GetFromJsonAsync<CourseExternalDto>($"{baseUrl}/api/v1/courses/{id}");
            }
            catch
            {
                return null;
            }
        }

        public async Task<Dictionary<int, StudentExternalDto>> GetStudentsMapAsync()
        {
            try
            {
                var baseUrl = _config["Services:StudentServiceUrl"] ?? "http://localhost:5001";
                var list = await _httpClient.GetFromJsonAsync<List<StudentExternalDto>>($"{baseUrl}/api/v1/students");
                return list?.ToDictionary(s => s.Id, s => s) ?? new Dictionary<int, StudentExternalDto>();
            }
            catch
            {
                return new Dictionary<int, StudentExternalDto>();
            }
        }

        public async Task<Dictionary<int, CourseExternalDto>> GetCoursesMapAsync()
        {
            try
            {
                var baseUrl = _config["Services:CourseServiceUrl"] ?? "http://localhost:5002";
                var list = await _httpClient.GetFromJsonAsync<List<CourseExternalDto>>($"{baseUrl}/api/v1/courses");
                return list?.ToDictionary(c => c.Id, c => c) ?? new Dictionary<int, CourseExternalDto>();
            }
            catch
            {
                return new Dictionary<int, CourseExternalDto>();
            }
        }
    }
}
