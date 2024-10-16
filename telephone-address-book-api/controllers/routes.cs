using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.IO;
using Models;

public static class Routes
{
    public static void Configure(WebApplication app)
    {
        app.MapGet("/", () => "Status: 200");

        app.MapPost("/book/pdf", async (HttpContext context) =>
        {
            try
            {
                using var reader = new StreamReader(context.Request.Body);
                var requestBody = await reader.ReadToEndAsync();

                var pdfRequest = JsonConvert.DeserializeObject<PDF>(requestBody);

                if (pdfRequest == null) { throw new ArgumentNullException(nameof(pdfRequest), "PDF object is null."); }

                if (string.IsNullOrEmpty(pdfRequest.FilePath)) { throw new ArgumentException("File path is null or empty.", nameof(pdfRequest.FilePath)); }

                if (pdfRequest.Data == null) { throw new ArgumentNullException(nameof(pdfRequest.Data), "PDF data array is null."); }

                PDFGenerator.GenerateBookPDF(pdfRequest.FilePath, pdfRequest.Data);

                return Results.Ok(new { message = "PDF generation completed", filePath = pdfRequest.FilePath });
            }
            catch (Exception ex) { return Results.BadRequest(new { error = ex.Message }); }
        });

        app.MapGet("/book", async () => { return await BookManager.getBookData(); });

        app.MapGet("/book/{phone}", async (int phone) => { return await BookManager.getDataByPhone(phone); });

        app.MapPost("/book", async (Book book) => { return await BookManager.postDataToBook(book); });

        app.MapPut("/book/{phone}", async (int phone, Book book) => { return await BookManager.updateDataByPhone(phone, book); });

        app.MapDelete("/book/{phone}", async (int phone) => { return await BookManager.deleteDataByPhone(phone); });
    }
}