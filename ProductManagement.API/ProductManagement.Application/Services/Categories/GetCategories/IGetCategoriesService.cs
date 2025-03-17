using ProductManagement.Domain.Models;
using ProductManagement.Domain.Shared;

namespace ProductManagement.Application.Services.Categories.GetCategories;

public interface IGetCategoriesService
{
    Task<ServiceResult<List<CategoryTree>>> Execute(CancellationToken cancellationToken);
}