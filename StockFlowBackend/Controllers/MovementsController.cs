using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockFlowBackend.Data;
using StockFlowBackend.Models;

namespace StockFlowBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovementsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MovementsController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/Movements
        [HttpPost]
        public async Task<ActionResult<Movement>> PostMovement(Movement movement)
        {
            var product = await _context.Products.FindAsync(movement.ProductId);
            if (product == null || !product.IsActive)
            {
                return NotFound(new { message = "Producto no encontrado." });
            }

            if (movement.Type.ToUpper() == "SALIDA" && product.Stock < movement.Quantity)
            {
                return BadRequest(new { message = "Stock insuficiente para realizar la salida." });
            }

            // Actualizar el stock del producto según el tipo de movimiento
            if (movement.Type.ToUpper() == "ENTRADA")
            {
                product.Stock += movement.Quantity;
            }
            else if (movement.Type.ToUpper() == "SALIDA")
            {
                product.Stock -= movement.Quantity;
            }

            _context.Movements.Add(movement);
            await _context.SaveChangesAsync();

            return Ok(movement);
        }

        // GET: api/Movements
[HttpGet]
public async Task<ActionResult<IEnumerable<object>>> GetMovements()
{
    var movements = await _context.Movements
        .Include(m => m.Product)
        .OrderByDescending(m => m.CreatedAt)
        .Select(m => new
        {
            m.Id,
            m.ProductId,
            ProductName = m.Product != null ? m.Product.Name : "Producto Eliminado",
            m.Type,
            m.Quantity,
            m.Description,
            m.CreatedAt
        })
        .ToListAsync();

    return Ok(movements);
}
    }

    
}