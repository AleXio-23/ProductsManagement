namespace ProductManagement.Application.Services.Products.GetProducts.Models;

public record ProductsFilterModel
{
    public List<int>? Ids { get; set; }
    public List<int>? CategoryIds { get; set; }

    public string? Code { get; set; }
    public string? Name { get; set; }
    public decimal? PriceStart { get; set; }
    public decimal? PriceEnd { get; set; }
    public List<int>? CountryIds { get; set; } = null;
    public DateTime?  DateStart { get; set; }
    public DateTime?  DateEnd { get; set; }
    public int? Skip { get; set; } = 0;
    public int? Take { get; set; } = 30;

    public string SortBy { get; set; } = "id";
    public bool SortByDescendingOrder { get; set; } = true;
}