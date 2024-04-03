using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.Threading.Tasks;
using System.Data;
using dotenv.net;
using Dapper;

WebApplication app = WebApplication.Create();

IDbConnection ConnectDB()
{
    DotEnv.Load();

    string server = Environment.GetEnvironmentVariable("DB_SERVER")!;
    string user = Environment.GetEnvironmentVariable("DB_USER")!;
    string password = Environment.GetEnvironmentVariable("DB_PASSWORD")!;
    string database = Environment.GetEnvironmentVariable("DB_NAME")!;

    string connection = $"Server={server};Uid={user};Password={password};Database={database}";

    return new MySqlConnection(connection);
}

app.MapGet("/", () => "Status: 200");

app.MapGet("/book", async () =>
{
    var conn = ConnectDB();

    try
    {
        conn.Open();
        var data = await conn.QueryAsync("Select * FROM book;");
        conn.Close();

        return Results.Json(new { status = 200, data = data.ToList(), message = "Data Retrieved" });
    }
    catch (System.Exception e) { return Results.Json(new { status = 400, error = e.Message }); }
});

app.MapGet("/book/{phone}", async (int phone) =>
{
    var conn = ConnectDB();

    try
    {
        conn.Open();
        var data = await conn.QueryAsync("Select * FROM book WHERE phone='" + phone + "';");
        conn.Close();

        if (!data.Any()) { return Results.Json(new { status = 404, data = "This number doesn't exist in the database" }); };

        return Results.Json(new { status = 200, data = data.First(), message = "Data Retrieved" });
    }
    catch (System.Exception e) { return Results.Json(new { status = 400, error = e.Message }); }
});

app.MapPost("/book", async (Book book) =>
{
    var conn = ConnectDB();

    try
    {
        conn.Open();

        var data = new
        {
            Phone = book.Phone,
            First_name = book.First_name,
            Last_name = book.Last_name,
            Household = book.Household,
            Email = book.Email
        };

        await conn.QueryAsync("INSERT INTO book (phone, first_name, last_name, household, email) " + "VALUES (@Phone, @First_name, @Last_name, @Household, @Email)", data);

        conn.Close();

        return Results.Json(new { status = 201, data, message = "Data Created" });
    }
    catch (System.Exception e) { return Results.Json(new { status = 400, error = e.Message }); }
});

async Task<bool> IsNumberRegisteredAsync(int phone)
{
    try
    {
        var conn = ConnectDB();
        var data = await conn.QueryAsync("SELECT * FROM book WHERE phone = @Phone;", new { Phone = phone });
        conn.Close();

        if (!data.Any()) { return false; }

        return true;
    }
    catch (System.Exception) { return false; }
}

app.MapPut("/book/{phone}", async (int phone, Book book) =>
{
    var conn = ConnectDB();

    try
    {
        if (!await IsNumberRegisteredAsync(phone)) { return Results.Json(new { status = 404, data = "This number doesn't exist in the database" }); }

        conn.Open();

        var data = new
        {
            Phone = phone,
            NewPhone = book.Phone == 0 ? phone : book.Phone,
            FirstName = book.First_name,
            LastName = book.Last_name,
            Household = book.Household,
            Email = book.Email
        };

        string query = "UPDATE book SET phone = @NewPhone";

        if (book.First_name != null) { query += ", first_name = @FirstName"; }
        if (book.Last_name != null) { query += ", last_name = @LastName"; }
        if (book.Household != null) { query += ", household = @Household"; }
        if (book.Email != null) { query += ", email = @Email"; }

        query += " WHERE phone = @Phone";

        await conn.QueryAsync(query, data);

        conn.Close();

        return Results.Json(new { status = 201, data, message = "Data Updated" });
    }
    catch (System.Exception e) { return Results.Json(new { status = 400, error = e.Message }); }
});

app.MapDelete("/book/{phone}", async (int phone) =>
{
    var conn = ConnectDB();

    try
    {
        if (!await IsNumberRegisteredAsync(phone)) { return Results.Json(new { status = 404, data = "This number doesn't exist in the database" }); }

        conn.Open();
        await conn.QueryAsync("Delete FROM book WHERE phone='" + phone + "';");
        conn.Close();

        return Results.Json(new { status = 201, message = $"{phone} data was Deleted" });
    }
    catch (System.Exception e) { return Results.Json(new { status = 400, error = e.Message }); }
});

app.Run();

class Book
{
    public int Phone { get; set; }
    public string? First_name { get; set; }
    public string? Last_name { get; set; }
    public string? Household { get; set; }
    public string? Email { get; set; }
}
