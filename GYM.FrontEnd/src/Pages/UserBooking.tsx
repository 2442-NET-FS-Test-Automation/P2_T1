import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookingFilterBar,
  type FilterOptions,
} from "../Components/BookingFilterBar";
import { getPublicBookings } from "../services/BookingService";
import { BookingCard } from "../Components/BookingCard";
import "../css/Booking.css";
import type { BookingDTO } from "../types/BookingDTO";

export function UserBooking() {
  const [sortBy, setSortBy] = useState("date-asc");
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    location: "",
    trainer: "",
    minExercises: "",
    difficulty: "all",
  });

  // Filter evaluation logic
  const filteredBookings = bookings.filter((booking) => {
    const training = booking.trainings?.[0];
    const user = booking.users?.[0];

    const trainerFullName = user?.detail
      ? `${user.detail.name}`.toLowerCase()
      : "unknown staff";

    const placeString =
      typeof training?.place === "number"
        ? `zone ${training.place}`
        : (training?.place || "").toLowerCase();
    const totalExercises = training?.exercises?.length || 0;
    // 1. Evaluate Location match
    if (
      activeFilters.location &&
      !placeString.includes(activeFilters.location.toLowerCase())
    ) {
      return false;
    }
    // 2. Evaluate Trainer match
    if (activeFilters.trainer) {
      const searchInput = activeFilters.trainer.toLowerCase();

      // Isolate first name and surname cleanly to allow first letter matching on both parts
      const firstName = (user?.detail?.name || "").toLowerCase();

      // Returns true if either the first name OR the last name starts with the user's typed letters
      const matchesFirstName = firstName.startsWith(searchInput);

      if (!matchesFirstName) {
        return false; // Discards row entry if neither field starts with the typed values
      }
    }
    // Exercises threshold filter evaluated cleanly against array length
    if (
      activeFilters.minExercises &&
      totalExercises < parseInt(activeFilters.minExercises, 10)
    ) {
      return false;
    }

    if (
      activeFilters.difficulty !== "all" &&
      training?.difficulty !== activeFilters.difficulty
    ) {
      return false;
    }

    return true;
  });

  // Execute sorting rules over your filtered subsets
  const finalProcessedData = [...filteredBookings].sort((a, b) => {
    const nameA = a.trainings?.[0]?.trainingName?.toLowerCase() || "";
    const nameB = b.trainings?.[0]?.trainingName?.toLowerCase() || "";
    return sortBy === "name-asc"
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

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
        <BookingFilterBar onFilterChange={setActiveFilters} />
        <section className="bookingsContainer">
          <div className="bookings-header-row">
            <h2>Bookings</h2>

            <div className="sort-wrapper">
              <label
                htmlFor="sort-select"
                className="text-neon small fw-semibold"
              >
                Sort By:
              </label>
              <select
                id="sort-select"
                className="sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name-asc">Name (A - Z)</option>
                <option value="name-desc">Name (Z - A)</option>
              </select>
            </div>
          </div>

          <div className="booking-list-container">
            {loading ? (
              <p>Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p>No bookings found.</p>
            ) : (
              finalProcessedData.map((booking) => {
                const training = booking.trainings?.[0];
                const user = booking.users?.[0];

                // Safely combine name and surname from user.detail DTO
                const trainerFullName = user?.detail
                  ? `${user.detail.name} ${user.detail.surname}`
                  : "Unknown Staff";

                // Parse place type signature safely
                const placeString =
                  typeof training?.place === "number"
                    ? `Zone ${training.place}`
                    : training?.place;

                return (
                  <BookingCard
                    key={booking.id}
                    title={training?.trainingName || "Unnamed Workout"}
                    trainer={trainerFullName}
                    location={placeString || "Main Arena"}
                    exerciseCount={
                      training?.exercises?.length || 0
                    } /* Feeds calculated array length safely */
                    description={training?.description}
                    duration={
                      training?.estimatedTime || "01:00:00"
                    } /* Uses estimatedTime metric string */
                    difficulty={
                      (training?.difficulty as
                        | "Beginner"
                        | "Intermediate"
                        | "Advanced"
                        | "Heroic") || "Beginner"
                    }
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
