using Microsoft.AspNetCore.Mvc;
using Models;

public static class Routes
{
    public static void Configure(WebApplication app)
    {
        app.MapGet("/", () => "Status: 200");

        app.MapGet("/book", async () => { return await BookManager.getBookData(); });

        app.MapGet("/book/{phone}", async (int phone) => { return await BookManager.getDataByPhone(phone); });

        app.MapPost("/book", async (Book book) => { return await BookManager.postDataToBook(book); });

        app.MapPut("/book/{phone}", async (int phone, Book book) => { return await BookManager.updateDataByPhone(phone, book); });

        app.MapDelete("/book/{phone}", async (int phone) => { return await BookManager.deleteDataByPhone(phone); });
    }
}