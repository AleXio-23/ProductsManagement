using Microsoft.EntityFrameworkCore.Storage;
using ProductManagement.Persistance.Entities;
using ProductManagement.Persistance.Repository;

namespace ProductManagement.Persistance.UnitOfWork;

public class ProductManagementUnitOfWork : IProductManagementUnitOfWork
{
    private readonly ProductManagementDbContext _context;


    public ProductManagementUnitOfWork(ProductManagementDbContext context)
    {
        _context = context;
        Categories = new GenericContextRepository<Categories>(_context);
        Countries = new GenericContextRepository<Country>(_context);
        Products = new GenericContextRepository<Product>(_context);
    }

    public void Dispose()
    {
        _context.Dispose();
        GC.SuppressFinalize(this);
    }

    public int Complete()
    {
        return _context.SaveChanges();
    }

    public async Task<int> CompleteAsync(CancellationToken cancellationToken)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Database.BeginTransactionAsync(cancellationToken);
    }

    public IRepository<Categories> Categories { get; }
    public IRepository<Country> Countries { get; }
    public IRepository<Product> Products { get; }
}