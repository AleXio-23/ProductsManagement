using ProductManagement.Domain.Models;
using ProductManagement.Domain.Shared;

namespace ProductManagement.Application.Services.Products.AddOrUpdateProduct;

public interface IAddOrUpdateProductService
{
    Task<ServiceResult<ProductDto>> Execute(ProductDto productDto, CancellationToken cancellationToken);
}