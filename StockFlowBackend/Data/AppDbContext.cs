using Microsoft.EntityFrameworkCore;
using StockFlowBackend.Models;

namespace StockFlowBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<Movement> Movements { get; set; }
    }
}