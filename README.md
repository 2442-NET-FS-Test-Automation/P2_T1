# GymQuest

**Project 2 — Full-Stack Web Application**
**Team Project (4 Members)**

GymQuest is a full-stack web application designed to help users create, manage, and follow workout routines while tracking their fitness progress over time. The platform supports multiple user roles, each with different permissions and features.

---

## 👥 Team Members

* Stefano Herrejon Antuñano
* Carlos Otero
* Miguel Angel Aranda Castillo
* Alan Ernesto Nares Molina

---

## 🚀 Features

### User

* Register, Log In, and Log Out
* Book training sessions
* View and update personal profile
* Record personal fitness statistics
* Track progress over time
* Unlock achievements
* Complete workout routines
* Browse and search the training catalog

**User Stories**

* As a user, I want to record my fitness statistics so I can monitor my progress over time.
* As a user, I want to unlock achievements to stay motivated throughout my fitness journey.

### Trainer

* Create new training routines
* Add new exercises
* Update existing trainings and exercises
* Delete trainings and exercises

### Administrator

* Create Trainer and Administrator accounts
* View application reports

---

## 🛠️ Technologies Used

### Backend

* .NET / C#
* ASP.NET Web API
* Entity Framework Core
* SQL Server
* Docker
* Swagger

### Frontend

* React
* Axios
* Bootstrap

---

## 📊 Database Diagram

https://lucid.app/lucidchart/73bb86a6-e723-4efb-811b-0669394f345e/edit?viewport_loc=-278%2C-267%2C1459%2C752%2C0_0&invitationId=inv_f2229796-bf4e-443a-8a98-1466cdfa8b5f

---

## 🎨 Figma Mockup

https://www.figma.com/design/F1GREzLiRTwrRopCkzEAXh/GymQuest?node-id=0-1&t=OZw1mEOewxiSBiKj-1

---

## 📌 API Endpoint Maps

### Endpoint Map 1

https://lucid.app/lucidchart/ab3dd9a0-e29a-4f7e-a599-9db189529364/edit?beaconFlowId=6730FC3221389A3A&invitationId=inv_b432906e-3af8-493a-9308-98e2a1be28c3&page=0_0#

### Endpoint Map 2

https://lucid.app/lucidchart/339392b5-6e1e-479e-86c1-1fc42247fdf8/edit?beaconFlowId=356BEE7985BD001B&invitationId=inv_67c428c2-cfae-4885-9c7d-316654705ced&page=0_0#

---

# Getting Started

## 1. Clone the Repository

```bash
git clone <repository-url>
cd P2_T1
```

---

## 2. Start SQL Server

Start the SQL Server Docker container.

---

## 3. Apply Database Migrations

```bash
dotnet ef database update --project GYM.Data --startup-project GYM.Controller.Api
```

To view the available migrations:

```bash
dotnet ef migrations list --project GYM.Data --startup-project GYM.Controller.Api
```

---

## 4. Run the Backend

Navigate to the API project:

```bash
cd GYM.Controller.Api
dotnet run
```

The API will be available through Swagger.

---

## 5. Run the Frontend

Navigate to the frontend project:

```bash
cd GYM.FrontEnd
npm install
npm run dev
```

---

# Seed Data

Create the default users by calling the **SeedData** endpoint with the following payload:

```json
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
```

---

# Project Structure

```text
P2_T1
│
├── GYM.Controller.Api      # ASP.NET Web API
├── GYM.Data                # Entities, DbContext, Repositories
├── GYM.FrontEnd            # React Application
└── README.md
```

---

# License

This project was developed as part of **Project 2 – Full-Stack Web Application** for educational purposes.
