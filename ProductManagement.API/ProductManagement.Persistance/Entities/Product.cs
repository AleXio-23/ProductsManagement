namespace ProductManagement.Persistance.Entities;

public class Product
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public decimal Price { get; set; }
    public int? CountryId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsActive { get; set; }

    public virtual Categories? Category { get; set; }
    public virtual Country? Country { get; set; }
}