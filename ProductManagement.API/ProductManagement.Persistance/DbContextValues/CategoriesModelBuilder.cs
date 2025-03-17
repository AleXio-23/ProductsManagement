using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProductManagement.Shared.Constants;

namespace ProductManagement.Persistance.DbContextValues;

public class CategoriesModelBuilder : IEntityTypeConfiguration<Entities.Categories>
{
    public void Configure(EntityTypeBuilder<Entities.Categories> entity)
    {
        entity.ToTable("Categories", SchemaConstants.SCHEMA_DICTIONARY);
        entity.HasKey(x => x.Id);
        entity.Property(e => e.IsActive)
            .IsRequired()
            .HasDefaultValueSql("((1))");
        entity.Property(e => e.Name).HasColumnType("NVARCHAR(255)");
        entity.Property(e => e.ParentId).IsRequired(false);
    }
}