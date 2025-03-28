using System.Net;
using ProductManagement.Domain.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

namespace ProductManagement.Application.Infrastructure.MiddleWares
{
    public class ExceptionHandlingMiddleware(RequestDelegate next)
    {
        public async Task InvokeAsync(HttpContext context, IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            //var logger = scope.ServiceProvider.GetRequiredService<ILogger>();
            try
            {
                await next(context).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                // Handle the exception
                //await logger.LogError(context.Request.Path, ex.Message, context.RequestAborted, ex).ConfigureAwait(false);
                await HandleExceptionAsync(context, ex).ConfigureAwait(false);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            // Set the response status code and return an error response
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";

            var errorResponse = ServiceResult<object>.ErrorResult(ex.Message);

            var jsonErrorResponse = JsonConvert.SerializeObject(errorResponse);
            return context.Response.WriteAsync(jsonErrorResponse);
        }
    }
}