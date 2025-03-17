using ProductManagement.Domain.Models;
using ProductManagement.Domain.Shared;

namespace ProductManagement.Application.Services.Categories.AddOrUpdateCategories;

public interface IAddOrUpdateCategories
{
    Task<ServiceResult<CategoriesDto>> Execute(CategoriesDto category, CancellationToken cancellationToken);
}