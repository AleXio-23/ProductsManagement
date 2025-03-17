namespace ProductManagement.Application.Services.Products.GetProducts.Models;

public record ProductResultModel
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public decimal Price { get; set; }
    public int? CountryId { get; set; }
    public string? CountryName { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsActive { get; set; }
}

public record ProductsResult
{
    public List<ProductResultModel> Products { get; set; } = new List<ProductResultModel>();
    public int Count { get; set; } = 0;
}