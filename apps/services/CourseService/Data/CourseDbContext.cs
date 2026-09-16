using Microsoft.EntityFrameworkCore;
using CourseService.Models;

namespace CourseService.Data
{
    public class CourseDbContext : DbContext
    {
        public CourseDbContext(DbContextOptions<CourseDbContext> options) : base(options) { }

        public DbSet<Course> Courses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Course>().HasData(
                // Khoa Công nghệ thông tin
                new Course
                {
                    Id = 1,
                    CourseCode = "INT1001",
                    CourseName = "Lập trình C# & .NET Core",
                    Credits = 3,
                    Department = "Công nghệ thông tin",
                    Description = "Kiến thức nền tảng và nâng cao về lập trình C# và xây dựng Web API."
                },
                new Course
                {
                    Id = 2,
                    CourseCode = "INT1002",
                    CourseName = "Cơ sở dữ liệu PostgreSQL",
                    Credits = 4,
                    Department = "Công nghệ thông tin",
                    Description = "Thiết kế, truy vấn và tối ưu hóa hệ quản trị cơ sở dữ liệu quan hệ PostgreSQL."
                },
                new Course
                {
                    Id = 3,
                    CourseCode = "INT1003",
                    CourseName = "Phát triển Frontend với React",
                    Credits = 3,
                    Department = "Công nghệ thông tin",
                    Description = "Xây dựng ứng dụng Single Page Application (SPA) hiện đại với React và Vite."
                },
                new Course
                {
                    Id = 4,
                    CourseCode = "INT1004",
                    CourseName = "Kiến trúc Microservices & Docker",
                    Credits = 3,
                    Department = "Công nghệ thông tin",
                    Description = "Thiết kế hệ thống phân tán, YARP API Gateway & Containerization."
                },
                new Course
                {
                    Id = 5,
                    CourseCode = "INT1005",
                    CourseName = "An toàn thông tin & Mạng máy tính",
                    Credits = 3,
                    Department = "Công nghệ thông tin",
                    Description = "Bảo mật hệ thống, mã hóa SSL & phân quyền JWT Authentication."
                },

                // Khoa Kinh tế & Quản trị
                new Course
                {
                    Id = 6,
                    CourseCode = "ECO2001",
                    CourseName = "Kinh tế vĩ mô & Vi mô",
                    Credits = 3,
                    Department = "Kinh tế & Quản trị",
                    Description = "Tổng quan về quy luật kinh tế thị trường, lạm phát và tăng trưởng."
                },
                new Course
                {
                    Id = 7,
                    CourseCode = "ECO2002",
                    CourseName = "Quản trị nhân sự & Doanh nghiệp",
                    Credits = 4,
                    Department = "Kinh tế & Quản trị",
                    Description = "Quản trị nguồn nhân lực, văn hóa doanh nghiệp và vận hành tổ chức."
                },
                new Course
                {
                    Id = 8,
                    CourseCode = "ECO2003",
                    CourseName = "Tài chính doanh nghiệp & Kế toán",
                    Credits = 3,
                    Department = "Kinh tế & Quản trị",
                    Description = "Phân tích báo cáo tài chính, quản lý dòng tiền và kế toán tổng hợp."
                },
                new Course
                {
                    Id = 9,
                    CourseCode = "ECO2004",
                    CourseName = "Marketing kỹ thuật số & E-Commerce",
                    Credits = 3,
                    Department = "Kinh tế & Quản trị",
                    Description = "Chiến lược tiếp thị số, bán hàng trực tuyến và thương mại điện tử."
                },

                // Khoa Ngoại ngữ
                new Course
                {
                    Id = 10,
                    CourseCode = "FLG3001",
                    CourseName = "Ngôn ngữ Anh chuyên ngành",
                    Credits = 3,
                    Department = "Ngoại ngữ",
                    Description = "Rèn luyện các kỹ năng Nghe - Nói - Đọc - Viết thuật ngữ học thuật."
                },
                new Course
                {
                    Id = 11,
                    CourseCode = "FLG3002",
                    CourseName = "Tiếng Anh thương mại & Giao tiếp",
                    Credits = 3,
                    Department = "Ngoại ngữ",
                    Description = "Kỹ năng đàm phán hợp đồng, viết email và thuyết trình quốc tế."
                },
                new Course
                {
                    Id = 12,
                    CourseCode = "FLG3003",
                    CourseName = "Biên dịch & Phiên dịch nâng cao",
                    Credits = 4,
                    Department = "Ngoại ngữ",
                    Description = "Kỹ thuật dịch thuật tài liệu chuyên ngành và phiên dịch hội thảo."
                }
            );
        }
    }
}
