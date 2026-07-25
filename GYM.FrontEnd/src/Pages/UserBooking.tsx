import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookingFilterBar } from "../components/BookingFilterBar";
import { getPublicBookings } from "../services/BookingService";
import { BookingCard } from "../components/BookingCard";
import "../css/Booking.css";
import type { BookingDTO } from "../types/BookingDTO";

export function UserBooking() {
  const [sortBy, setSortBy] = useState("date-asc");
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const data = await getPublicBookings();

      if (!data || data.length === 0) {
        setBookings([
          {
            id: 1,
            trainingId: 101,
            userId: 50,
            status: "Booked",
            exerciseTime: "00:45:00",
            trainings: [
              {
                id: 101,
                trainingName: "Initial Strength",
                difficulty: "Beginner",
                place: "Gym",
                calories: 300,
                description:
                  "Learn fundamental movement patterns and build a solid foundation.",
                estimatedTime: "00:45:00",
                exercises: [],
              },
            ],
            users: [
              {
                id: 50,
                email: "sarah.j@example.com",
                phone: "+15550198",
                role: "Trainer",
                detail: {
                  name: "Sarah",
                  surname: "Jones",
                  gender: "Female",
                  age: 28,
                },
              },
            ],
          },
          {
            id: 2,
            trainingId: 102,
            userId: 51,
            status: "Working",
            exerciseTime: "01:00:00",
            trainings: [
              {
                id: 102,
                trainingName: "Urban Endurance",
                difficulty: "Intermediate",
                place: "Outdoor",
                calories: 450,
                description:
                  "High-intensity circuit designed to burn calories outdoors.",
                estimatedTime: "01:00:00",
                exercises: [],
              },
            ],
            users: [
              {
                id: 51,
                email: "alex.m@example.com",
                phone: "+15550143",
                role: "Trainer",
                detail: {
                  name: "Alex",
                  surname: "Miller",
                  gender: "Male",
                  age: 32,
                },
              },
            ],
          },
          {
            id: 3,
            trainingId: 103,
            userId: 52,
            status: "Completed",
            exerciseTime: "01:15:00",
            doneAt: "2026-07-24T20:00:00Z",
            trainings: [
              {
                id: 103,
                trainingName: "Titan Power",
                difficulty: "Advanced",
                place: "Gym",
                calories: 600,
                description:
                  "Focused on hypertrophy and heavy lifting for experienced athletes.",
                estimatedTime: "01:15:00",
                exercises: [],
              },
            ],
            users: [
              {
                id: 52,
                email: "marcus.v@example.com",
                phone: "+15550177",
                role: "Trainer",
                detail: {
                  name: "Marcus",
                  surname: "Vance",
                  gender: "Male",
                  age: 35,
                },
              },
            ],
          },
        ]);
      } else {
        setBookings(data);
      }
      setLoading(false);
    };

    fetchBookings();
  }, []);
    return (
    <>
      <div className="bookings">
        <BookingFilterBar />
        <section className="bookingsContainer">
          <div className="bookings-header-row">
            <h2>Bookings</h2>

            <div className="sort-wrapper">
              <label htmlFor="sort-select" className="text-neon small fw-semibold">
                Sort By:
              </label>
              <select
                id="sort-select"
                className="sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date-asc">Date (Oldest First)</option>
                <option value="date-desc">Date (Newest First)</option>
                <option value="trainer-az">Trainer (A - Z)</option>
                <option value="location-az">Location (A - Z)</option>
              </select>
            </div>
          </div>
          
          <div className="booking-list-container">
            {loading ? (
              <p>Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p>No bookings found.</p>
            ) : (
              bookings.map((booking) => {
                const training = booking.trainings?.[0];
                const user = booking.users?.[0];

                // Safely combine name and surname from user.detail DTO
                const trainerFullName = user?.detail 
                  ? `${user.detail.name} ${user.detail.surname}`
                  : "Unknown Staff";

                // Parse place type signature safely
                const placeString = typeof training?.place === "number" 
                  ? `Zone ${training.place}` 
                  : training?.place;

                return (
                  <BookingCard
                    key={booking.id}
                    title={training?.trainingName || "Untitled Workout"}
                    trainer={trainerFullName}
                    location={placeString || "TBD Location"}
                    exerciseCount={training?.exercises?.length || 0}
                    difficulty={(training?.difficulty as "Beginner" | "Intermediate" | "Advanced" | "Heroic") || "Beginner"}
                  />
                );
              })
            )}
          </div>
        </section>
      </div>
    </>
  );
}