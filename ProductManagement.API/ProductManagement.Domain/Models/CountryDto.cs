namespace ProductManagement.Domain.Models;

public class CountryDto
{
    public int? Id { get; set; } 
    public string Name { get; set; } = default!;
    public bool? IsActive { get; set; }
}