namespace ProductManagement.Application.Services.Products.GetProducts.Models;

public record ProductsFilterModel
{
    public List<int>? Ids { get; set; }
    public List<int>? CategoryIds { get; set; }
    public int? Skip { get; set; } = 0;
    public int? Take { get; set; } = 30;

    public string SortBy { get; set; } = "id";
    public bool SortByDescendingOrder { get; set; } = true;
}