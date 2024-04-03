using MySql.Data.MySqlClient;
using System.Data;
using Dapper;

WebApplication app = WebApplication.Create();

IDbConnection ConnectDB()
{
    return new MySqlConnection("Server=localhost;Uid=root;Password=<password>;Database=phonebook");
}

app.MapGet("/", () => "Status: 200");

app.MapGet("/book", async () =>
{
    var conn = ConnectDB();

    try
    {
        conn.Open();
        var bookList = await conn.QueryAsync("Select * FROM book;");
        conn.Close();
        return bookList.ToList();
    }
    catch (System.Exception e)
    {
        Console.WriteLine(e.Message);
        throw;
    }
});

app.MapGet("/book/{phone}", async (int phone) =>
{
    var conn = ConnectDB();

    try
    {
        conn.Open();
        var result = await conn.QueryAsync("Select * FROM book WHERE phone='" + phone + "';");
        conn.Close();
        return result;
    }
    catch (System.Exception e)
    {
        Console.WriteLine(e.Message);
        throw;
    }
});

app.MapPost("/book", async (Book book) =>
{
    var conn = ConnectDB();

    try
    {
        conn.Open();

        await conn.QueryAsync("INSERT INTO book (phone, first_name, last_name, household, email) " + "VALUES (@Phone, @First_name, @Last_name, @Household, @Email)", new { Phone = book.Phone, First_name = book.First_name, Last_name = book.Last_name, Household = book.Household, Email = book.Email });

        conn.Close();
        return "Added '" + book.Phone + "' to book";
    }
    catch (System.Exception e)
    {
        Console.WriteLine(e.Message);
        throw;
    }
});

app.MapPut("/book/{phone}", async (int phone, Book book) =>
{
    var conn = ConnectDB();

    try
    {
        conn.Open();

        string updateQuery = "UPDATE book SET ";
        bool isFirstField = true;

        if (book.First_name != null)
        {
            updateQuery += "first_name = @FirstName";
            isFirstField = false;
        }
        if (book.Last_name != null)
        {
            updateQuery += isFirstField ? "" : ", ";
            updateQuery += "last_name = @LastName";
            isFirstField = false;
        }
        if (book.Household != null)
        {
            updateQuery += isFirstField ? "" : ", ";
            updateQuery += "household = @Household";
            isFirstField = false;
        }
        if (book.Email != null)
        {
            updateQuery += isFirstField ? "" : ", ";
            updateQuery += "email = @Email";
        }

        updateQuery += " WHERE phone = @Phone";

        await conn.QueryAsync(updateQuery, new { Phone = phone, FirstName = book.First_name, LastName = book.Last_name, Household = book.Household, Email = book.Email });

        conn.Close();
        return "'" + book.Phone + "' updated";
    }
    catch (System.Exception e)
    {
        Console.WriteLine(e.Message);
        throw;
    }
});

app.MapDelete("/book/{phone}", async (int phone) =>
{
    var conn = ConnectDB();

    try
    {
        conn.Open();
        await conn.QueryAsync("Delete FROM book WHERE phone='" + phone + "';");
        conn.Close();
        return "Regist deleted '" + phone + "'";
    }
    catch (System.Exception e)
    {
        Console.WriteLine(e.Message);
        throw;
    }
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
