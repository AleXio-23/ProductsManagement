using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ProductManagement.Domain.Models;
using ProductManagement.Domain.Shared;
using ProductManagement.Persistance.Entities;
using ProductManagement.Persistance.UnitOfWork;

namespace ProductManagement.Application.Services.Products.AddOrUpdateProduct;

public class AddOrUpdateProductService(IProductManagementUnitOfWork dataContext, IMapper mapper): IAddOrUpdateProductService
{
    public async Task<ServiceResult<ProductDto>> Execute(ProductDto productDto, CancellationToken cancellationToken)
    {
        if (productDto.Id is null or < 1)
        {
            return ServiceResult<ProductDto>.SuccessResult(await AddProduct(productDto, cancellationToken)
                .ConfigureAwait(false));
        }

        var getProduct =
            await dataContext.Products.All.Where(x => x.Id == productDto.Id).FirstOrDefaultAsync(cancellationToken) ??
            throw new ArgumentException($"პროდუქტი ID: {productDto.Id} ვერ მოიძებნა");

        getProduct.CategoryId = productDto.CategoryId;
        getProduct.Code = productDto.Code;
        getProduct.Name = productDto.Name;
        getProduct.Price = productDto.Price;
        getProduct.CountryId = productDto.CountryId;
        getProduct.StartDate = productDto.StartDate;
        getProduct.EndDate = productDto.EndDate;

        await dataContext.Products.Update(getProduct, cancellationToken).ConfigureAwait(false);
        return ServiceResult<ProductDto>.SuccessResult(mapper.Map<ProductDto>(getProduct));
    }


    private async Task<ProductDto> AddProduct(ProductDto productDto, CancellationToken cancellationToken)
    {
        var mapProduct = mapper.Map<Product>(productDto);

        await dataContext.Products.AddAsync(mapProduct, cancellationToken).ConfigureAwait(false);
        productDto.Id = mapProduct.Id;
        return productDto;
    }
}