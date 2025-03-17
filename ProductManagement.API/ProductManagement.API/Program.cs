using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.PlatformAbstractions;
using Microsoft.OpenApi.Models;
using ProductManagement.Application;
using ProductManagement.Application.Infrastructure.MiddleWares;
using ProductManagement.Persistance;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Configuration
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .AddJsonFile("appsecrets.json", optional: true, reloadOnChange: true);


builder.Services.AddDbContext<ProductManagementDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlServerOptionsAction: sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(
                maxRetryCount: 5, // Maximum number of retry attempts
                maxRetryDelay: TimeSpan.FromSeconds(30), // Maximum delay between retries
                errorNumbersToAdd: null); // Specific SQL error numbers to consider for retries
        }));

builder.Services.RegisterPersistanceServices();
builder.Services.RegisterApplicationServices();
builder.Services.AddHttpContextAccessor();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddAuthentication();


////builder.WithOrigins("https://localhost:8081")
////       .AllowAnyHeader()
////       .AllowAnyMethod()
////       .AllowCredentials();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder =>
        {
            builder
                .AllowAnyOrigin() // Be cautious, combining AllowAnyOrigin() with AllowCredentials() is discouraged due to security risks.
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddControllers();
// .AddFluentValidation(configurationExpression: fv =>
//     fv.RegisterValidatorsFromAssemblyContaining<RegisterDtoValidator>());

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc(
        "v1",
        new OpenApiInfo
        {
            Title = "ProductManagement API",
            Description = "Product Management System",
            Version = "v1"
        }
    );
    var basePath = PlatformServices.Default.Application.ApplicationBasePath;
    foreach (var name in Directory.GetFiles(basePath, "*.XML", SearchOption.AllDirectories))
    {
        options.IncludeXmlComments(name);
    }

     
});

var app = builder.Build();

app.UseCors("AllowSpecificOrigin");
// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
app.UseSwagger();
app.UseSwaggerUI();
//}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.MapControllers();

app.Run();