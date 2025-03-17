using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ProductManagement.Domain.Models;
using ProductManagement.Domain.Shared;
using ProductManagement.Persistance.UnitOfWork;

namespace ProductManagement.Application.Services.Categories.AddOrUpdateCategories;

public class AddOrUpdateCategories(IProductManagementUnitOfWork dataContext, IMapper mapper) : IAddOrUpdateCategories
{
    public async Task<ServiceResult<CategoriesDto>> Execute(CategoriesDto category, CancellationToken cancellationToken)
    {
        if (category.Id is null or 0)
        {
            category.Id = null;
            await AddCategory(category, cancellationToken).ConfigureAwait(false);
            return ServiceResult<CategoriesDto>.SuccessResult(category);
        }

        var getCategory = await dataContext.Categories.All.Where(x => x.Id == category.Id)
            .FirstOrDefaultAsync(cancellationToken);
        if (getCategory == null)
        {
            throw new ArgumentException($"კატეგორია Id : {category.Id} ვერ მოიძებნა");
        }

        getCategory.Name = category.Name;
        await dataContext.CompleteAsync(cancellationToken);
        return ServiceResult<CategoriesDto>.SuccessResult(category);
    }


    private async Task AddCategory(CategoriesDto category, CancellationToken cancellationToken)
    {
        var returnResult = mapper.Map<Persistance.Entities.Categories>(category);
        await dataContext.Categories.AddAsync(returnResult, cancellationToken).ConfigureAwait(false);
    }
}