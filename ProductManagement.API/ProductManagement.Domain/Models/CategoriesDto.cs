namespace ProductManagement.Domain.Models;

public record CategoriesDto
{
    public int? Id { get; set; }
    public int? ParentId { get; set; }
    public string Name { get; set; } = default!;
    public bool IsActive { get; set; }
}

public record CategoryTree
{
    public int Id { get; set; }
    public int? ParentId { get; set; }
    public string Name { get; set; } = default!;
    public bool IsActive { get; set; }
    public List<CategoryTree>? Children { get; set; }
}