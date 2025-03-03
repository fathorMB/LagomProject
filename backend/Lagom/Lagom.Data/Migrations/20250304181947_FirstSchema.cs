using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Lagom.Data.Migrations
{
    /// <inheritdoc />
    public partial class FirstSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppLanguages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NativeName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppLanguages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Claims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Claims", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AccessKeyHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Severity = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AppLanguageId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppMessages_AppLanguages_AppLanguageId",
                        column: x => x.AppLanguageId,
                        principalTable: "AppLanguages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UsersClaims",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ClaimId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UsersClaims", x => new { x.UserId, x.ClaimId });
                    table.ForeignKey(
                        name: "FK_UsersClaims_Claims_ClaimId",
                        column: x => x.ClaimId,
                        principalTable: "Claims",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UsersClaims_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "AppLanguages",
                columns: new[] { "Id", "Code", "IsActive", "Name", "NativeName" },
                values: new object[,]
                {
                    { 1, "en", true, "English", "English" },
                    { 2, "it", true, "Italian", "Italiano" }
                });

            migrationBuilder.InsertData(
                table: "Claims",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[,]
                {
                    { 1, "Full control", "admin" },
                    { 2, "Can run example controller routes", "example" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "AccessKeyHash", "FirstName", "IsActive", "LastName", "Username" },
                values: new object[,]
                {
                    { 1, "21232f297a57a5a743894a0e4a801fc3", "System", true, "Admin", "admin" },
                    { 2, "21232f297a57a5a743894a0e4a801fc3", "Moreno", true, "Bruschi", "moro" }
                });

            migrationBuilder.InsertData(
                table: "AppMessages",
                columns: new[] { "Id", "AppLanguageId", "Code", "Message", "Severity", "Type" },
                values: new object[,]
                {
                    { 1, 1, "login.credentials.required", "Username and password are required", "error", "login" },
                    { 2, 2, "login.credentials.required", "Username e password sono obbligatori", "error", "login" },
                    { 3, 1, "login.credentials.invalid", "Invalid username or password", "error", "login" },
                    { 4, 2, "login.credentials.invalid", "Username o password non validi", "error", "login" },
                    { 5, 1, "user.creation.error", "Something went wrong while trying to create the user", "error", "user.creation" },
                    { 6, 2, "user.creation.error", "Qualcosa è andato storto durante la creazione dell'utente.", "error", "user.creation" }
                });

            migrationBuilder.InsertData(
                table: "UsersClaims",
                columns: new[] { "ClaimId", "UserId" },
                values: new object[,]
                {
                    { 1, 1 },
                    { 2, 2 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppMessages_AppLanguageId",
                table: "AppMessages",
                column: "AppLanguageId");

            migrationBuilder.CreateIndex(
                name: "IX_UsersClaims_ClaimId",
                table: "UsersClaims",
                column: "ClaimId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppMessages");

            migrationBuilder.DropTable(
                name: "UsersClaims");

            migrationBuilder.DropTable(
                name: "AppLanguages");

            migrationBuilder.DropTable(
                name: "Claims");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
