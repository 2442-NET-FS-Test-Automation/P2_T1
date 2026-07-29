using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GYM.Data.Migrations
{
    /// <inheritdoc />
    public partial class TempSyncMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Age",
                table: "UserDetails");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Age",
                table: "UserDetails",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
