using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProductManagement.Persistance.Migrations
{
    /// <inheritdoc />
    public partial class AddCountries : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                schema: "dictionary",
                table: "Users");

            migrationBuilder.RenameTable(
                name: "Users",
                schema: "dictionary",
                newName: "Categories",
                newSchema: "dictionary");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Categories",
                schema: "dictionary",
                table: "Categories",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Country",
                schema: "dictionary",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "NVARCHAR(255)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValueSql: "((1))")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Country", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Country",
                schema: "dictionary");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Categories",
                schema: "dictionary",
                table: "Categories");

            migrationBuilder.RenameTable(
                name: "Categories",
                schema: "dictionary",
                newName: "Users",
                newSchema: "dictionary");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                schema: "dictionary",
                table: "Users",
                column: "Id");
        }
    }
}
