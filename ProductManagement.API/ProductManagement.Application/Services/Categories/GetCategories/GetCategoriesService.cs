using Microsoft.EntityFrameworkCore;
using ProductManagement.Domain.Models;
using ProductManagement.Domain.Shared;
using ProductManagement.Persistance.UnitOfWork;
using ProductManagement.Shared.Services.TreeBuilder;

namespace ProductManagement.Application.Services.Categories.GetCategories;

public class GetCategoriesService(IProductManagementUnitOfWork dataContext): IGetCategoriesService
{
    public async Task<ServiceResult<List<CategoryTree>>> Execute(CancellationToken cancellationToken)
    {
        var propsDictionary = new Dictionary<string, string>()
        {
            { "Id", "Id" },
            { "ParentId", "ParentId" }
        };

        var categoriesList = await dataContext.Categories.All
            .AsNoTracking()
            .Where(x=> x.IsActive == true)
            .ToListAsync(cancellationToken);

        var transformedSourceClass =
            DataTreeGenerator.Convert<Persistance.Entities.Categories, CategoryTree>(
                categoriesList, propsDictionary);

        var tree = GenerateMultilevelTree.Generate(
            transformedSourceClass,
            categoryTree => categoryTree.Id,
            categoryTree => categoryTree.ParentId,
            (categoryTree, children) => categoryTree.Children = children
        );

        return ServiceResult<List<CategoryTree>>.SuccessResult(tree);
    }
}