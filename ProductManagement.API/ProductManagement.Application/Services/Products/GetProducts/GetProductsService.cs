using Microsoft.EntityFrameworkCore;
using ProductManagement.Application.Services.Products.GetProducts.HelperMethods;
using ProductManagement.Application.Services.Products.GetProducts.Models;
using ProductManagement.Domain.Shared;
using ProductManagement.Persistance.UnitOfWork;

namespace ProductManagement.Application.Services.Products.GetProducts;

public class GetProductsService(IProductManagementUnitOfWork dataContext) : IGetProductsService
{
    private List<int> GetRecursiveCategoryIds(List<int> categoryIds, Dictionary<int, int?> categories, int mainId)
    {
        var result = categoryIds ?? new List<int>();
        foreach (var c in categories.Where(x => x.Value == mainId))
        {
            result.Add(c.Key);
            GetRecursiveCategoryIds(result, categories, c.Key);
        }

        return result;
    }

    public async Task<ServiceResult<ProductsResult>> Execute(ProductsFilterModel filterModel,
        CancellationToken cancellationToken)
    {
        var query = dataContext.Products.All
            .AsNoTracking()
            .Include(x => x.Category)
            .Include(x => x.Country)
            .Where(x => x.IsActive == true)
            .AsQueryable();

        if (filterModel.Ids is { Count: > 0 })
        {
            query = query.Where(x => filterModel.Ids.Contains(x.Id));
        }

        if (filterModel.CategoryIds is { Count: > 0 })
        {
            var getCategories = (await dataContext.Categories.All.AsNoTracking().Where(x => x.IsActive == true)
                .Select(x => new { x.Id, x.ParentId })
                .ToListAsync(cancellationToken)).ToDictionary(x => x.Id, x => x.ParentId);
            var categoryIds = new List<int>();

            if (filterModel.CategoryIds.Count == 1)
            {
                var mainId = filterModel.CategoryIds.FirstOrDefault();
                categoryIds = GetRecursiveCategoryIds(categoryIds, getCategories, mainId);
                categoryIds.Add(mainId);
            }
            else
            {
                categoryIds = filterModel.CategoryIds;
            }

            query = query.Where(x => categoryIds.Contains(x.CategoryId));
        }

        var count = await query.CountAsync(cancellationToken);
        var result = await query
            .SortProducts(filterModel)
            .Select(x => new ProductResultModel()
            {
                Id = x.Id,
                CategoryId = x.CategoryId,
                Code = x.Code,
                Name = x.Name,
                Price = x.Price,
                CountryId = x.CountryId,
                CountryName = x.Country!.Name,
                StartDate = x.StartDate,
                EndDate = x.EndDate,
                IsActive = x.IsActive
            }).Skip(filterModel.Skip ?? 0).Take(filterModel.Take ?? 30).ToListAsync(cancellationToken);

        return ServiceResult<ProductsResult>.SuccessResult(new ProductsResult()
        {
            Products = result,
            Count = count
        });
    }
}