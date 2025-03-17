namespace ProductManagement.Persistance.Repository;

public class GenericContextRepository<T>(ProductManagementDbContext context) : Repository<T>(context)
    where T : class // Constrain T to class to ensure it can be used as an entity
{
    public ProductManagementDbContext Context => (_context as ProductManagementDbContext)!; // Assuming _context is defined in the base Repository class

    // Constructor should match the class name
}