using Microsoft.Extensions.DependencyInjection;
using ProductManagement.Application.Services.Categories.AddOrUpdateCategories;
using ProductManagement.Application.Services.Categories.DeleteCategories;
using ProductManagement.Application.Services.Categories.GetCategories;
using ProductManagement.Application.Services.Countries;
using ProductManagement.Application.Services.Products.AddOrUpdateProduct;
using ProductManagement.Application.Services.Products.DeleteProducts;
using ProductManagement.Application.Services.Products.GetProducts;

namespace ProductManagement.Application;

public static class ApplicationServices
{
    public static IServiceCollection RegisterApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IDeleteCategoriesService, DeleteCategoriesService>();
        services.AddScoped<IAddOrUpdateCategories, AddOrUpdateCategories>();
        services.AddScoped<IGetCategoriesService, GetCategoriesService>();
        services.AddScoped<IGetProductsService, GetProductsService>();
        services.AddScoped<IAddOrUpdateProductService, AddOrUpdateProductService>();
        services.AddScoped<ICountriesService, CountriesService>();
        services.AddScoped<IDeleteProductsService, DeleteProductsService>();
        return services;
    }
}