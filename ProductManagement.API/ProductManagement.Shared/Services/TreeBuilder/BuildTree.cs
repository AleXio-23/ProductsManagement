namespace ProductManagement.Shared.Services.TreeBuilder;

internal static class BuildTree
{
    internal static T? Build<T>(
        List<T>? items,
        object? parentId,
        Func<T, object> idAccessor,
        Func<T, object?> parentIdAccessor,
        Action<T, List<T>> childrenSetter,
        Func<T, int>? sortIndexAccessor = null,
        int depth = 0,
        int maxDepth = 100
    ) where T : class
    {
        if (items == null || items.Count == 0 || depth >= maxDepth)
            return null;

        var node = items.FirstOrDefault(item => idAccessor(item).Equals(parentId));
        if (node == null)
            return null;

        var children = items.Where(item => parentIdAccessor(item)?.Equals(parentId) == true).Select(item =>
            Build(items, idAccessor(item), idAccessor, parentIdAccessor, childrenSetter, sortIndexAccessor, depth + 1,
                maxDepth)).OfType<T>().ToList();


        if (sortIndexAccessor != null)
        {
            children = children.OrderBy(sortIndexAccessor).ToList();
        }

        childrenSetter(node, children);
        return node;
    }
}