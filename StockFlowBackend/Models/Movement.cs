using System.ComponentModel.DataAnnotations;

namespace StockFlowBackend.Models
{
    public class Movement
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        public string Type { get; set; } = "ENTRADA"; // "ENTRADA" o "SALIDA"

        [Required]
        public int Quantity { get; set; }

        public string Description { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Relación con el producto (opcional para EF)
        public Product? Product { get; set; }
    }
}