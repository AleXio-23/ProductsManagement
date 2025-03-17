namespace ProductManagement.Application.Services.Products.DeleteProducts;

public interface IDeleteProductsService
{
    Task Execute(List<int> productIds, CancellationToken cancellationToken);
}