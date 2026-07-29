import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookingFilterBar,
  type FilterOptions,
} from "../Components/BookingFilterBar";
import { getPublicTrainings } from "../services/TrainingService";
import { getUser } from "../services/auth";
import { BookingCard } from "../Components/BookingCard";
import "../css/Booking.css";
import type { TrainingDTO } from "../types/trainingDTO";
import { getTrainingImage } from "../utils/trainingImages";
import { getPlaceLabel } from "../utils/placeLabels";

export function UserBooking() {
  const [sortBy, setSortBy] = useState("name-asc");
  const navigate = useNavigate();
  const [trainings, setTrainings] = useState<TrainingDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    location: "",
    trainingName: "",
    minExercises: "",
    difficulty: "all",
  });

  // Filtrado directo sobre TrainingDTO (ya no hay booking/user de por medio)
  const filteredTrainings = trainings.filter((training) => {
    const placeString = getPlaceLabel(training.place).toLowerCase();

    const totalExercises = training.exercises?.length || 0;

    if (
      activeFilters.trainingName &&
      !(training.trainingName || "")
        .toLowerCase()
        .includes(activeFilters.trainingName.toLowerCase())
    ) {
      return false;
    }

    if (
      activeFilters.location &&
      !placeString.includes(activeFilters.location.toLowerCase())
    ) {
      return false;
    }

    if (
      activeFilters.minExercises &&
      totalExercises < parseInt(activeFilters.minExercises, 10)
    ) {
      return false;
    }

    if (
      activeFilters.difficulty !== "all" &&
      training.difficulty !== activeFilters.difficulty
    ) {
      return false;
    }

    return true;
  });

  const finalProcessedData = [...filteredTrainings].sort((a, b) => {
    const nameA = a.trainingName?.toLowerCase() || "";
    const nameB = b.trainingName?.toLowerCase() || "";
    return sortBy === "name-asc"
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Traemos el usuario logueado para saber su id al reservar
      const userData = await getUser();
      if (userData?.id) {
        setCurrentUserId(userData.id);
      }

      const data = await getPublicTrainings();

      if (!data || data.length === 0) {
        setTrainings([
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
        ]);
      } else {
        setTrainings(data);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleBookNow = (training: TrainingDTO) => {
    navigate(`/user/booking/confirm/${training.id}`, { state: { training } });
  };

  return (
    <>
      <div className="bookings ">
        <BookingFilterBar onFilterChange={setActiveFilters} />
        <section className="bookingsContainer ">
          <div className="bookings-header-row">
            <h2>Trainings</h2>

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
                <option value="name-asc">Name (A - Z)</option>
                <option value="name-desc">Name (Z - A)</option>
              </select>
            </div>
          </div>

          <div className="booking-list-container">
            {loading ? (
              <p>Loading trainings...</p>
            ) : trainings.length === 0 ? (
              <p>No trainings found.</p>
            ) : (
              finalProcessedData.map((training) => {
                const placeString =
                  typeof training.place === "number"
                    ? `Zone ${training.place}`
                    : training.place;

                return (
                  <BookingCard
                    key={training.id}
                    trainingName={training.trainingName || "Unnamed Workout"}
                    location={getPlaceLabel(training.place) || "Main Arena"}
                    exerciseCount={training.exercises?.length || 0}
                    description={training.description}
                    duration={training.estimatedTime || "01:00:00"}
                    calories={training.calories || 250}
                    difficulty={
                      (training.difficulty as
                        | "Beginner"
                        | "Intermediate"
                        | "Advanced"
                        | "Heroic") || "Beginner"
                    }
                    imageUrl={getTrainingImage(training.trainingName)}
                    onBook={() => handleBookNow(training)}
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