using Microsoft.EntityFrameworkCore;
using ProductManagement.Persistance.UnitOfWork;

namespace ProductManagement.Application.Services.Categories.DeleteCategories;

public class DeleteCategoriesService(IProductManagementUnitOfWork dataContext) : IDeleteCategoriesService
{
    public async Task Execute(List<int> categoryIds, CancellationToken cancellationToken)
    {
        if (categoryIds.Count != 0)
        {
            var categories = await dataContext.Categories.All.Where(x => categoryIds.Contains(x.Id))
                .ToListAsync(cancellationToken);
            foreach (var category in categories)
            {
                category.IsActive = false;
            }

            await dataContext.CompleteAsync(cancellationToken);
        }
    }
}