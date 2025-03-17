using Microsoft.EntityFrameworkCore;
using ProductManagement.Persistance.UnitOfWork;

namespace ProductManagement.Application.Services.Products.DeleteProducts;

public class DeleteProductsService(IProductManagementUnitOfWork dataContext) : IDeleteProductsService
{
    public async Task Execute(List<int> productIds, CancellationToken cancellationToken)
    {
        if (productIds.Count > 0)
        {
            var products = await dataContext.Products.All.Where(x => productIds.Contains(x.Id))
                .ToListAsync(cancellationToken);

            foreach (var product in products)
            {
                product.IsActive = false;
            }

            await dataContext.CompleteAsync(cancellationToken);
        }
    }
}