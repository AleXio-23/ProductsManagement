using ProductManagement.Application.Services.Products.GetProducts.Models;
using ProductManagement.Domain.Shared;

namespace ProductManagement.Application.Services.Products.GetProducts;

public interface IGetProductsService
{
    Task<ServiceResult<ProductsResult>> Execute(ProductsFilterModel filterModel,
        CancellationToken cancellationToken);
}