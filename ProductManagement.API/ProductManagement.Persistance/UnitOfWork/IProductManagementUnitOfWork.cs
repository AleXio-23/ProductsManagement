using Microsoft.EntityFrameworkCore.Storage;
using ProductManagement.Persistance.Entities;
using ProductManagement.Persistance.Repository;

namespace ProductManagement.Persistance.UnitOfWork;

public interface IUnitOfWork : IDisposable
{
    int Complete();
    Task<int> CompleteAsync(CancellationToken cancellationToken);
    Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default);
}

public interface IProductManagementUnitOfWork : IUnitOfWork
{
    IRepository<Categories> Categories { get; }
    IRepository<Country> Countries { get; }
    IRepository<Product> Products { get; }
}