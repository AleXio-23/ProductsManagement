using Microsoft.EntityFrameworkCore;
using ProductManagement.Application.Services.Products.GetProducts.HelperMethods;
using ProductManagement.Application.Services.Products.GetProducts.Models;
using ProductManagement.Domain.Shared;
using ProductManagement.Persistance.UnitOfWork;

namespace ProductManagement.Application.Services.Products.GetProducts;

public class GetProductsService(IProductManagementUnitOfWork dataContext) : IGetProductsService
{
    public async Task<ServiceResult<ProductsResult>> Execute(ProductsFilterModel filterModel,
        CancellationToken cancellationToken)
    {
        var query = dataContext.Products.All
            .AsNoTracking()
            .Include(x => x.Category)
            .Include(x => x.Country)
            .Where(x => x.IsActive == true)
            .AsQueryable();

        query = await query.FilterProducts(filterModel, dataContext, cancellationToken);

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