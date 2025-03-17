namespace ProductManagement.Application.Services.Categories.DeleteCategories;

public interface IDeleteCategoriesService
{
    Task Execute(List<int> categoryIds, CancellationToken cancellationToken);
}