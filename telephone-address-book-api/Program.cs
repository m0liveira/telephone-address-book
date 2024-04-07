using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;


WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
    {
        options.AddPolicy(name: MyAllowSpecificOrigins,
            builder =>
        {
            builder.WithOrigins("http://localhost",
                "http://localhost:4200",
                "http://localhost:5043")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .SetIsOriginAllowedToAllowWildcardSubdomains();
        });
    });

WebApplication app = builder.Build();

Routes.Configure(app);

app.UseCors(MyAllowSpecificOrigins);

app.Run();