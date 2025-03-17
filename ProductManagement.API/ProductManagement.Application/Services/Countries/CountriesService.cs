using Microsoft.EntityFrameworkCore;
using ProductManagement.Domain.Models;
using ProductManagement.Domain.Shared;
using ProductManagement.Persistance.Entities;
using ProductManagement.Persistance.UnitOfWork;
using AutoMapper;

namespace ProductManagement.Application.Services.Countries;

public class CountriesService(IProductManagementUnitOfWork unitOfWork, IMapper mapper): ICountriesService
{
    public async Task CreateCountryAsync(CountryDto countryDto, CancellationToken cancellationToken)
    {
        if (countryDto == null)
        {
            throw new ArgumentNullException(nameof(countryDto));
        }

        var country = mapper.Map<Country>(countryDto);

        await unitOfWork.Countries.AddAsync(country, cancellationToken);
    }

    public async Task<ServiceResult<List<CountryDto>>> GetCountriesAsync(CancellationToken cancellationToken)
    {
        var country = await unitOfWork.Countries.All.AsNoTracking().Where(x => x.IsActive == true)
            .Select(x => mapper.Map<CountryDto>(x)).ToListAsync(cancellationToken);

        return ServiceResult<List<CountryDto>>.SuccessResult(country);
    }

    public async Task UpdateCountryAsync(CountryDto countryDto, CancellationToken cancellationToken)
    {
        if (countryDto == null)
        {
            throw new ArgumentNullException(nameof(countryDto));
        }

        var country = await unitOfWork.Countries.Get(countryDto.Id!.Value, cancellationToken);
        mapper.Map(countryDto, country);

        if (country != null) await unitOfWork.Countries.Update(country, cancellationToken);
    }

    public async Task DeleteCountryAsync(int id, CancellationToken cancellationToken)
    {
        await unitOfWork.Countries.Delete(id, cancellationToken);
    }
}