using Microsoft.EntityFrameworkCore;
using ProductManagement.Persistance.DbContextValues;
using ProductManagement.Persistance.Entities;

namespace ProductManagement.Persistance;

public partial class ProductManagementDbContext : DbContext
{
    public ProductManagementDbContext()
    {
    }

    public ProductManagementDbContext(DbContextOptions<ProductManagementDbContext> options) : base(options)
    {
    }

    public virtual DbSet<Categories> Categories { get; set; }
    public virtual DbSet<Country> Countries { get; set; }
    public virtual DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new CategoriesModelBuilder());
        modelBuilder.ApplyConfiguration(new CountryModelBuilder());
        modelBuilder.ApplyConfiguration(new ProductsModelBuilder());

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}