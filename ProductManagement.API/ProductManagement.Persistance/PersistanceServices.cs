using Microsoft.Extensions.DependencyInjection;
using ProductManagement.Persistance.UnitOfWork;

namespace ProductManagement.Persistance;

public static class PersistanceServices
{
    public static IServiceCollection RegisterPersistanceServices(this IServiceCollection services)
    {
        services.AddScoped<IProductManagementUnitOfWork,  ProductManagementUnitOfWork>();


        return services;
    }
}