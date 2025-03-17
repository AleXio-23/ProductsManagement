using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProductManagement.Shared.Constants;

namespace ProductManagement.Persistance.DbContextValues;

public class ProductsModelBuilder : IEntityTypeConfiguration<Entities.Product>
{
    public void Configure(EntityTypeBuilder<Entities.Product> entity)
    {
        entity.ToTable("Products", SchemaConstants.SCHEMA_DICTIONARY);
        entity.HasKey(x => x.Id);
        entity.Property(e => e.IsActive)
            .IsRequired()
            .HasDefaultValueSql("((1))");
        entity.Property(e => e.Name).HasColumnType("NVARCHAR(255)");
        entity.Property(e => e.Price)
            .HasColumnType("DECIMAL(18,2)");

        entity.HasOne(x => x.Country)
            .WithMany(x => x.Products)
            .HasForeignKey(x => x.CountryId)
            .OnDelete(DeleteBehavior.Restrict);
        entity.HasOne(x => x.Category)
            .WithMany(x => x.Products)
            .HasForeignKey(x => x.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}