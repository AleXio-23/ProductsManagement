using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProductManagement.Shared.Constants;

namespace ProductManagement.Persistance.DbContextValues;

public class CountryModelBuilder : IEntityTypeConfiguration<Entities.Country>
{
    public void Configure(EntityTypeBuilder<Entities.Country> entity)
    {
        entity.ToTable("Country", SchemaConstants.SCHEMA_DICTIONARY);
        entity.HasKey(x => x.Id);
        entity.Property(e => e.IsActive)
            .IsRequired()
            .HasDefaultValueSql("((1))");
        entity.Property(e => e.Name).HasColumnType("NVARCHAR(255)"); 
    }
}