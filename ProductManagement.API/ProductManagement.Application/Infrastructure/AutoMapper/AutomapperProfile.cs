using AutoMapper;
using ProductManagement.Domain.Models;
using ProductManagement.Persistance.Entities;

namespace ProductManagement.Application.Infrastructure.AutoMapper
{
    public class AutomapperProfile : Profile
    {
        public AutomapperProfile()
        {
            CreateMap<Categories, CategoriesDto>().ReverseMap();
            CreateMap<Country, CountryDto>().ReverseMap();
            CreateMap<Product, ProductDto>().ReverseMap();
        }
    }
}