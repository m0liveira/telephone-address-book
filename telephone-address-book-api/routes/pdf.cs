using System;
using System.IO;
using PdfSharp.Pdf;
using PdfSharp.Drawing;
using PdfSharp.Fonts;
using Models;

public class MyFontResolver : IFontResolver
{
    private readonly byte[] _fontData;

    public MyFontResolver(byte[] fontData) { _fontData = fontData ?? throw new ArgumentNullException(nameof(fontData)); }

    public byte[] GetFont(string faceName) { return _fontData; }

    public string DefaultFontName => "Arial";

    public FontResolverInfo ResolveTypeface(string familyName, bool isBold, bool isItalic) { return new FontResolverInfo(DefaultFontName); }
}

public class PDF
{
    public string? FilePath { get; set; }
    public Book[]? Data { get; set; }
}

public class PDFGenerator
{
    private static void DrawTableCell(XGraphics gfx, double x, double y, double width, string text, bool isHeader = false)
    {
        XFont font = new XFont("Arial", 12);
        XBrush brush = isHeader ? XBrushes.LightSteelBlue : XBrushes.White;
        XPen pen = new XPen(XColors.Black, 0.5);

        double xPos = x + 10;
        double yPos = y + 14;

        gfx.DrawRectangle(pen, brush, x, y, width, 20);
        gfx.DrawString(text, font, XBrushes.Black, xPos, yPos);
    }

    public static void GenerateBookPDF(string filePath, Book[] books)
    {
        try
        {
            if (GlobalFontSettings.FontResolver == null)
            {
                string fontsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "fonts");
                string fontFilePath = Path.Combine(fontsDirectory, "arial.ttf");

                byte[] fontData = File.ReadAllBytes(fontFilePath);

                GlobalFontSettings.FontResolver = new MyFontResolver(fontData);
            }

            PdfDocument pdf = new PdfDocument();
            int currentPageIndex = 0;
            double yPos = 100;
            XGraphics? gfx = null;

            foreach (var book in books)
            {
                if (currentPageIndex == 0)
                {
                    PdfPage page = pdf.AddPage();
                    gfx = XGraphics.FromPdfPage(page);
                    XFont titleFont = new XFont("Arial", 18);

                    gfx.DrawString("Telephone Address Book", titleFont, XBrushes.Blue, new XRect(0, 40, page.Width, titleFont.Height), XStringFormats.Center);

                    currentPageIndex++;
                }

                if (yPos >= 700)
                {
                    PdfPage page = pdf.AddPage();
                    gfx = XGraphics.FromPdfPage(page);
                    yPos = 60;
                }

                XFont regularFont = new XFont("Arial", 12);
                double columnWidth = 400;
                double tableWidth = 400;

                double xPos = (gfx!.PageSize.Width - tableWidth) / 2;
                double yPosStart = yPos;

                DrawTableCell(gfx, xPos, yPos, columnWidth, $"Name:   {book.First_name} {book.Last_name}", true);
                yPos += 20;

                DrawTableCell(gfx, xPos, yPos, columnWidth, $"Phone:   {book.Phone}");
                yPos += 20;

                DrawTableCell(gfx, xPos, yPos, columnWidth, $"Email:   {book.Email}", true);
                yPos += 20;

                DrawTableCell(gfx, xPos, yPos, columnWidth, $"Address:   {book.Household}");
                yPos += 50;
            }

            pdf.Save(filePath);
        }
        catch (Exception ex) { Console.WriteLine($"Error generating PDF: {ex.Message}"); throw; }
    }
}

