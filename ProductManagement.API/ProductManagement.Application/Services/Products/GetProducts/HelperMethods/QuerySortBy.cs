using ProductManagement.Application.Services.Products.GetProducts.Models;
using ProductManagement.Persistance.Entities;

namespace ProductManagement.Application.Services.Products.GetProducts.HelperMethods;

public static class QuerySortBy
{
    public static IQueryable<Product> SortProducts(this IQueryable<Product> query, ProductsFilterModel filterModel)
    {
        return filterModel.SortBy switch
        {
            "code" => filterModel.SortByDescendingOrder == true
                ? query.OrderByDescending(x => x.Code).ThenBy(x => x.Name)
                : query.OrderBy(x => x.Code).ThenBy(x => x.Name),
            "name" => filterModel.SortByDescendingOrder == true
                ? query.OrderByDescending(x => x.Name)
                : query.OrderBy(x => x.Name),
            "price" => filterModel.SortByDescendingOrder == true
                ? query.OrderByDescending(x => x.Price).ThenBy(x => x.Name)
                : query.OrderBy(x => x.Price).ThenBy(x => x.Name),
            "country" => filterModel.SortByDescendingOrder == true
                ? query.OrderByDescending(x => x.Country!.Name).ThenBy(x => x.Name)
                : query.OrderBy(x => x.Country!.Name).ThenBy(x => x.Name),
            "date" => filterModel.SortByDescendingOrder == true
                ? query.OrderByDescending(x => x.StartDate).ThenBy(x => x.EndDate).ThenBy(x => x.Name)
                : query.OrderBy(x => x.StartDate).ThenBy(x => x.EndDate).ThenBy(x => x.Name),
            _ => filterModel.SortByDescendingOrder == true
                ? query.OrderByDescending(x => x.Id)
                : query.OrderBy(x => x.Id)
        };
    }
}