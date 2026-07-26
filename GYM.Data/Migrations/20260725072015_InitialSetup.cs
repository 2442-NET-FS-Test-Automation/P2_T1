using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace GYM.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialSetup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Achievements",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Points = table.Column<int>(type: "int", nullable: false),
                    Condition_type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ConditionValue = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Achievements", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Exercises",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "varchar(30)", maxLength: 30, nullable: false),
                    Description = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    VisualReferenceUrl = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    Sets = table.Column<int>(type: "int", nullable: false),
                    Reps = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Exercises", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Trainings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Difficulty = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Calories = table.Column<int>(type: "int", nullable: false),
                    Place = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Description = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    EstimatedTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TrainingName = table.Column<string>(type: "varchar(120)", maxLength: 120, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trainings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Phone = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TrainingExercises",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TrainingId = table.Column<int>(type: "int", nullable: false),
                    ExerciseId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingExercises", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrainingExercises_Exercises_ExerciseId",
                        column: x => x.ExerciseId,
                        principalTable: "Exercises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TrainingExercises_Trainings_TrainingId",
                        column: x => x.TrainingId,
                        principalTable: "Trainings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Bookings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TrainingId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExerciseTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DoneAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bookings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Bookings_Trainings_TrainingId",
                        column: x => x.TrainingId,
                        principalTable: "Trainings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Bookings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Statistics",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Weight = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    Height = table.Column<decimal>(type: "decimal(3,2)", nullable: false),
                    Strength = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    MileRun = table.Column<TimeOnly>(type: "time", nullable: false),
                    MeasureAt = table.Column<DateOnly>(type: "date", nullable: false),
                    age = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Statistics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Statistics_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserAchievements",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AchievementId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Completed_At = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserAchievements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserAchievements_Achievements_AchievementId",
                        column: x => x.AchievementId,
                        principalTable: "Achievements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserAchievements_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserDetails",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Surname = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    JoinAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Age = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserDetails_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Achievements",
                columns: new[] { "Id", "ConditionValue", "Condition_type", "Description", "Icon", "Name", "Points" },
                values: new object[,]
                {
                    { 1, 0, "workouts_completed", "Complete your first workout", "fa-trophy", "Newbie", 5 },
                    { 2, 0, "miles_runned", "Run 5 miles", "fa-star", "Rocky Balboa", 10 },
                    { 3, 0, "stats_completed_1", "Your first measures", "fa-Medal", "First Stats", 30 }
                });

            migrationBuilder.InsertData(
                table: "Exercises",
                columns: new[] { "Id", "Description", "Name", "Reps", "Sets", "VisualReferenceUrl" },
                values: new object[,]
                {
                    { 1, "Perform a standard push-up while keeping your back straight and lowering your chest toward the floor.", "Push-Ups", 15, 4, "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmhqd250ZHlqNjM1eThyZzJnbXFva3czc21hZmptOTZteTN0ZjA2eSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3pY8FQP9uMtDKXkYqX/giphy.gif" },
                    { 2, "Perform a squat by lowering your hips toward the floor while keeping your chest up and your back straight.", "Bodyweight Squats", 20, 4, "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmx4cmJxOGZwMHUwaXBrbmJqaW9sa3ZlYmU3eGNsYXZpbTR6c2ppcCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/fnmk65werlZFy81pGw/giphy.gif" },
                    { 3, "Curl dumbbells upward toward your shoulders while keeping your elbows close to your body and controlling the movement.", "Dumbbell Bicep Curls", 12, 3, "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YTQydzBwZnZxZXlweGt2NmxrbXFydGQ1MjFmdXYwZjZza3YwNnB2diZlcD12MV9naWZzX3NlYXJjaCZjdD1n/kFnaSyOxFVVKFVOi9O/giphy.gif" },
                    { 4, "Hold a straight-body position supported by your forearms and toes while keeping your core tight.", "Plank", 1, 3, "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZm44bmI1eGs1d2RnbmNxb2I5ajJtMXF4NGd4MmNnc3NpMWJvOXQwdCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/KbOsMppYjfO5a/giphy.gif" },
                    { 5, "Step forward with one leg and lower your hips until both knees are bent, then return to the starting position and alternate legs.", "Alternating Lunges", 12, 3, "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzdmMTg5d2tyaHY3eW92MHhja2ZhdzczN3Zra21lMmk1bWNyNTc5MSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l3q2Q3sUEkEyDvfPO/giphy.gif" },
                    { 6, "Press dumbbells upward from shoulder level until your arms are extended, then lower them under control.", "Dumbbell Shoulder Press", 10, 3, "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmJ5ZmdrdmJmNzZtZDMxeHo3cTlrcW1zMXZtbWhpeHJud2V3NDUwNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/s1zHoMpAKEPnKoqW8k/giphy.gif" },
                    { 7, "Lie on your back with your knees bent and lift your hips upward while squeezing your glutes.", "Glute Bridges", 15, 4, "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmVwM3JhdWlma2gyZTNtY2czNzFsZG50ODhyYnExdHc2cGVnNWV0aiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/oOGc4pXsX22XjE2eTA/giphy.gif" },
                    { 8, "Start in a plank position and alternate driving your knees toward your chest while keeping your core engaged.", "Mountain Climbers", 20, 3, "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeTVhbWxjdTloN3c0cWw1YWFwOW9jczV5cXlmZDFlN2xiOWdnZ2U0MCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/VzlPEkuoqlgjehxvxk/giphy.gif" },
                    { 9, "Pull a dumbbell toward your torso while keeping your back straight and your elbow close to your body.", "Dumbbell Rows", 12, 3, "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExem52cXIxMDJ6bzdmNTk2d3o3YXZrNjY3MGozZW8zM2F5N3E2NW1pdCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3oEjHM9hzerMdVjYWI/giphy.gif" },
                    { 10, "Raise your heels off the ground while balancing on the balls of your feet, then slowly lower your heels.", "Standing Calf Raises", 20, 4, "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3eHdqY2l2aDhiOTBuZjh5OHc1YTV5dzdhb29yd2hhaDJodnRhdnpzcyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/4VYaL0JOguZrBgjQOt/giphy.gif" },
                    { 11, "Normal run", "Run", 45, 1, "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3p1YnNkeHBkczN3b2c3emkxcTQ2cTFlY3NlazdhdGdrNTY5c2E4byZlcD12MV9naWZzX3NlYXJjaCZjdD1n/CUbiYQbsKSGAM/giphy.gif" },
                    { 12, "Several sprints and rest in between.", "Sprint", 10, 3, "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWY4c2V4YWw5MDYzNTM3YW12dWJ0NjlxbGt4ZndpZ201eWJoamNhdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/VFwqlu33Ob5ELrRXiw/giphy.gif" }
                });

            migrationBuilder.InsertData(
                table: "Trainings",
                columns: new[] { "Id", "Calories", "CreatedAt", "Description", "Difficulty", "EstimatedTime", "Place", "TrainingName" },
                values: new object[,]
                {
                    { 1, 250, new DateTime(2026, 7, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "A beginner-friendly full-body workout that can be performed at home with little to no equipment.", "Easy", new TimeOnly(0, 30, 0), "Home", "Beginner Full Body Workout" },
                    { 2, 400, new DateTime(2026, 7, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "A strength-focused workout targeting the chest, shoulders, back, and arms using dumbbells and bodyweight exercises.", "Intermediate", new TimeOnly(0, 45, 0), "GYM", "Upper Body Strength Workout" },
                    { 3, 600, new DateTime(2026, 7, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "A high-intensity workout combining cardio and core exercises to improve endurance and burn calories.", "Advanced", new TimeOnly(1, 0, 0), "Outdoors", "High Intensity Cardio & Core" },
                    { 4, 450, new DateTime(2026, 7, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "A lower-body focused workout designed to strengthen the legs and glutes using a combination of bodyweight and weighted exercises.", "Intermediate", new TimeOnly(0, 50, 0), "GYM", "Lower Body Strength & Glutes" },
                    { 5, 300, new DateTime(2026, 7, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), "Cardio full of runs and sprints to archive a better physical condition.", "Intermediate", new TimeOnly(1, 15, 0), "Outdoors", "Full Cardio" }
                });

            migrationBuilder.InsertData(
                table: "TrainingExercises",
                columns: new[] { "Id", "ExerciseId", "TrainingId" },
                values: new object[,]
                {
                    { 1, 1, 1 },
                    { 2, 2, 1 },
                    { 3, 4, 1 },
                    { 4, 8, 1 },
                    { 5, 11, 1 },
                    { 6, 1, 2 },
                    { 7, 3, 2 },
                    { 8, 6, 2 },
                    { 10, 4, 3 },
                    { 11, 7, 3 },
                    { 12, 8, 3 },
                    { 13, 11, 3 },
                    { 14, 12, 3 },
                    { 15, 2, 4 },
                    { 16, 5, 4 },
                    { 17, 7, 4 },
                    { 18, 10, 4 },
                    { 19, 5, 4 },
                    { 20, 11, 5 },
                    { 21, 12, 5 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_TrainingId",
                table: "Bookings",
                column: "TrainingId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_UserId",
                table: "Bookings",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Statistics_UserId",
                table: "Statistics",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingExercises_ExerciseId",
                table: "TrainingExercises",
                column: "ExerciseId");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingExercises_TrainingId",
                table: "TrainingExercises",
                column: "TrainingId");

            migrationBuilder.CreateIndex(
                name: "IX_Trainings_Place",
                table: "Trainings",
                column: "Place");

            migrationBuilder.CreateIndex(
                name: "IX_UserAchievements_AchievementId",
                table: "UserAchievements",
                column: "AchievementId");

            migrationBuilder.CreateIndex(
                name: "IX_UserAchievements_UserId",
                table: "UserAchievements",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserDetails_UserId",
                table: "UserDetails",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Phone",
                table: "Users",
                column: "Phone",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Bookings");

            migrationBuilder.DropTable(
                name: "Statistics");

            migrationBuilder.DropTable(
                name: "TrainingExercises");

            migrationBuilder.DropTable(
                name: "UserAchievements");

            migrationBuilder.DropTable(
                name: "UserDetails");

            migrationBuilder.DropTable(
                name: "Exercises");

            migrationBuilder.DropTable(
                name: "Trainings");

            migrationBuilder.DropTable(
                name: "Achievements");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
