namespace ProductManagement.Persistance.Entities;

public class Categories
{
    public int Id { get; set; }
    public int? ParentId { get; set; }
    public string Name { get; set; } = default!;
    public bool IsActive { get; set; }
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}