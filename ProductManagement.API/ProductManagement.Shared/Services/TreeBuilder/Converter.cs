using System.Reflection;

namespace ProductManagement.Shared.Services.TreeBuilder;

public static class DataTreeGenerator
{
    public static List<TTarget> Convert<TSource, TTarget>(
        List<TSource> source,
        Dictionary<string, string> sourceTargetFieldDictionary
    ) where TTarget : new()
    {
        var sourceProperties = typeof(TSource).GetProperties();
        var targetProperties = typeof(TTarget).GetProperties().ToDictionary(p => p.Name);

        var generatedList = new List<TTarget>();

        foreach (var item in source)
        {
            var targetObject = new TTarget();

            foreach (var sourceProperty in sourceProperties)
            {
                PropertyInfo? targetProperty;
                if (sourceTargetFieldDictionary.TryGetValue(sourceProperty.Name, out var targetPropertyName))
                {
                    targetProperty = targetProperties.GetValueOrDefault(targetPropertyName);
                }
                else
                {
                    targetProperty = targetProperties.GetValueOrDefault(sourceProperty.Name);
                }

                if (targetProperty != null && targetProperty.CanWrite)
                {
                    targetProperty.SetValue(targetObject, sourceProperty.GetValue(item));
                }
            }

            generatedList.Add(targetObject);
        }

        return generatedList;
    }
}