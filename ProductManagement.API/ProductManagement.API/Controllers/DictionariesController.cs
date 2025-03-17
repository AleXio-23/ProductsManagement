using Microsoft.AspNetCore.Mvc;
using ProductManagement.Application.Services.Categories.AddOrUpdateCategories;
using ProductManagement.Application.Services.Categories.DeleteCategories;
using ProductManagement.Application.Services.Categories.GetCategories;
using ProductManagement.Application.Services.Countries;
using ProductManagement.Application.Services.Products.AddOrUpdateProduct;
using ProductManagement.Application.Services.Products.DeleteProducts;
using ProductManagement.Application.Services.Products.GetProducts;
using ProductManagement.Application.Services.Products.GetProducts.Models;
using ProductManagement.Domain.Models;
using ProductManagement.Domain.Shared;

namespace ProductManagement.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DictionariesController(
    IDeleteCategoriesService deleteCategoriesService,
    IAddOrUpdateCategories addOrUpdateCategories,
    IGetCategoriesService getCategoriesService,
    ICountriesService countriesService,
    IGetProductsService getProductsService,
    IAddOrUpdateProductService addOrUpdateProductService,
    IDeleteProductsService deleteProductsService)
    : Controller
{
    #region Category

    [HttpGet("Category")]
    public async Task<ActionResult<ServiceResult<List<CategoryTree>>>> GetCategories(
        CancellationToken cancellationToken)
    {
        var result = await getCategoriesService.Execute(cancellationToken);

        return Ok(result);
    }

    [HttpPost("Category")]
    public async Task<ActionResult<ServiceResult<CategoriesDto>>> AddOrUpdateCategory(
        [FromBody] CategoriesDto category, CancellationToken cancellationToken)
    {
        var result = await addOrUpdateCategories.Execute(category, cancellationToken);

        return Ok(result);
    }

    [HttpDelete("Category")]
    public async Task<IActionResult> DeleteCategory([FromQuery] List<int> categoryIds,
        CancellationToken cancellationToken)
    {
        await deleteCategoriesService.Execute(categoryIds, cancellationToken);

        return Ok();
    }

    #endregion

    #region Country

    [HttpPost("Country")]
    public async Task<IActionResult> CreateCountryAsync([FromBody] CountryDto countryDto)
    {
        await countriesService.CreateCountryAsync(countryDto, CancellationToken.None);
        return Ok();
    }

    [HttpGet("Country")]
    public async Task<ActionResult<ServiceResult<List<CountryDto>>>> GetCountriesAsync()
    {
        var result = await countriesService.GetCountriesAsync(CancellationToken.None);
        return Ok(result);
    }

    [HttpPut("Country")]
    public async Task<IActionResult> UpdateCountryAsync([FromBody] CountryDto countryDto)
    {
        await countriesService.UpdateCountryAsync(countryDto, CancellationToken.None);
        return Ok();
    }

    [HttpDelete("Country")]
    public async Task<IActionResult> DeleteCountryAsync([FromQuery] int id)
    {
        await countriesService.DeleteCountryAsync(id, CancellationToken.None);
        return Ok();
    }

    #endregion

    /// <summary>
    /// პროდუქტების წამოღება
    /// </summary>
    /// <param name="filterModel"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpGet("Products")]
    public async Task<ActionResult<ServiceResult<ProductsResult>>> GetProducts(
        [FromQuery] ProductsFilterModel filterModel,
        CancellationToken cancellationToken)
    {
        var result = await getProductsService.Execute(filterModel, cancellationToken);

        return Ok(result);
    }

    /// <summary>
    /// პროდუქტის დამატება
    /// </summary>
    /// <param name="productDto"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    [HttpPost("Products")]
    public async Task<ActionResult<ServiceResult<ProductDto>>> AddProduct([FromBody] ProductDto productDto,
        CancellationToken cancellationToken)
    {
        var result = await addOrUpdateProductService.Execute(productDto, cancellationToken);

        return Ok(result);
    }

    [HttpPut("Products")]
    public async Task<ActionResult<ServiceResult<ProductDto>>> UpdateProduct([FromBody] ProductDto productDto,
        CancellationToken cancellationToken)
    {
        var result = await addOrUpdateProductService.Execute(productDto, cancellationToken);

        return Ok(result);
    }

    [HttpDelete("Products")]
    public async Task<ActionResult<ServiceResult<ProductDto>>> DeleteProducts([FromQuery] List<int> productIds,
        CancellationToken cancellationToken)
    {
        await deleteProductsService.Execute(productIds, cancellationToken);

        return Ok();
    }
}