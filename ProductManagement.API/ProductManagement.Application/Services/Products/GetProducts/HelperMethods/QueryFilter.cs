using Microsoft.EntityFrameworkCore;
using ProductManagement.Application.Services.Products.GetProducts.Models;
using ProductManagement.Persistance.Entities;
using ProductManagement.Persistance.UnitOfWork;

namespace ProductManagement.Application.Services.Products.GetProducts.HelperMethods;

public static class QueryFilter
{
    private static List<int> GetRecursiveCategoryIds(List<int> categoryIds, Dictionary<int, int?> categories,
        int mainId)
    {
        var result = categoryIds ?? new List<int>();
        foreach (var c in categories.Where(x => x.Value == mainId))
        {
            result.Add(c.Key);
            GetRecursiveCategoryIds(result, categories, c.Key);
        }

        return result;
    }

    public static async Task<IQueryable<Product>> FilterProducts(this IQueryable<Product> query,
        ProductsFilterModel filterModel,
        IProductManagementUnitOfWork dataContext,
        CancellationToken cancellationToken)
    {
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


        if (!string.IsNullOrEmpty(filterModel.Code))
        {
            query = query.Where(x => x.Code.Contains(filterModel.Code));
        }

        if (!string.IsNullOrEmpty(filterModel.Name))
        {
            query = query.Where(x => x.Code.Contains(filterModel.Name));
        }

        if (filterModel.PriceStart != null)
        {
            query = query.Where(x => x.Price >= filterModel.PriceStart);
        }

        if (filterModel.PriceEnd != null)
        {
            query = query.Where(x => x.Price <= filterModel.PriceEnd);
        }

        if (filterModel.CountryIds is { Count: > 0 })
        {
            query = query.Where(x => x.CountryId != null && filterModel.CountryIds.Contains(x.CountryId!.Value));
        }

        if (filterModel.DateStart != null)
        {
            query = query.Where(x => x.StartDate >= filterModel.DateStart);
        }

        if (filterModel.DateEnd != null)
        {
            query = query.Where(x => x.EndDate <= filterModel.DateEnd);
        }

        return query;
    }
}