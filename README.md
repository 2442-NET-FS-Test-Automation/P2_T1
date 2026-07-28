QuestFitt
# P2_T1
Project 2 — Full-Stack Web Application (Teams of 4, Weeks 6–7)

-Stefano Herrejon Antuñano
-Carlos Otero
-Miguel Angel Aranda Castillo
-Alan Ernesto Nares Molina

Web application for working out routines. 
All types of users.

Users -> Log in, Log out, Book Trainings, See User Details, Set stats, See stats over time, Unlock Achivements, Workout, See Catalog of trainings and filter search
    (As a user I wanto to Set stats to see my progress over time, As a user I want to Unlock archivements to feel motivated)
Trainer -> Add new trainings, add new Exercices, update/Delete existing ones
Admin -> Create Trainer Users and Admins, see reports

Technologies Used : 
- SqlServer, Docker, DOTNET / C#, Controllers / API, Axios, React, BootStrap.

DB Diagram -> https://lucid.app/lucidchart/73bb86a6-e723-4efb-811b-0669394f345e/edit?viewport_loc=-278%2C-267%2C1459%2C752%2C0_0&invitationId=inv_f2229796-bf4e-443a-8a98-1466cdfa8b5f 

Figma Mockup -> https://www.figma.com/design/F1GREzLiRTwrRopCkzEAXh/GymQuest?node-id=0-1&t=OZw1mEOewxiSBiKj-1

EndPoints mapper -> 

1) https://lucid.app/lucidchart/ab3dd9a0-e29a-4f7e-a599-9db189529364/edit?beaconFlowId=6730FC3221389A3A&invitationId=inv_b432906e-3af8-493a-9308-98e2a1be28c3&page=0_0#

2) https://lucid.app/lucidchart/339392b5-6e1e-479e-86c1-1fc42247fdf8/edit?beaconFlowId=356BEE7985BD001B&invitationId=inv_67c428c2-cfae-4885-9c7d-316654705ced&page=0_0#

How to run ->
Download the repository

Docker ->
Migrations -> dotnet ef migrations list --project GYM.Data --startup-project GYM.Controller.Api
Run Backend -> Go to P2_T1\GYM.Controller.Api, on CLI DOTNET run
Run Frontend -> Go to P2_T1\GYM.FrontEnd, on CLI npm run dev

Seed Data -> SeedData with
[
  {
    "email": "user@test.com",
    "phone": "1212121212",
    "password": "1234"
  },
{
    "email": "trainer@test.com",
    "phone": "1313131313",
    "password": "1234"
  },
{
    "email": "admin@test.com",
    "phone": "1414141414",
    "password": "1234"
  }
]