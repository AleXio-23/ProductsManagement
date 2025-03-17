using ProductManagement.Domain.Models;
using ProductManagement.Domain.Shared;

namespace ProductManagement.Application.Services.Countries;

public interface ICountriesService
{
    Task CreateCountryAsync(CountryDto countryDto, CancellationToken cancellationToken);
    Task<ServiceResult<List<CountryDto>>> GetCountriesAsync(CancellationToken cancellationToken);
    Task UpdateCountryAsync(CountryDto countryDto, CancellationToken cancellationToken);
    Task DeleteCountryAsync(int id, CancellationToken cancellationToken);
}