namespace Lagom.WebAPI.AppConfiguration
{
    public static class HTTPAppConfiguration
    {
        public static void Configure(WebApplication webApplication)
        {
            webApplication.UseHttpsRedirection();
            webApplication.UseAuthorization();
            webApplication.UseCors("AllowSpecificOrigin");
            webApplication.MapControllers();
        }
    }
}
