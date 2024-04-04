using Microsoft.AspNetCore.Hosting;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

WebApplication app = builder.Build();

Routes.Configure(app);

app.Run();