import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// IMPORT SERVICES: Pulls both your collection getter and status patcher endpoints
import {
  deleteBooking,
  getBookingByUserId,
  UpdateBookingStatus,
} from "../services/BookingService";
import type { BookingDTO } from "../types/BookingDTO";
import { BookingCard } from "../components/BookingCard";
import { getTrainingImage } from "../utils/trainingImages";
import { toast } from "react-toastify";

const WORKOUT_COACH_MAP: Record<string, string> = {
  yoga: "Coach Elena (Yoga Specialist)",
  strength: "Coach Marcus (Powerlifting)",
  power: "Coach Marcus (Powerlifting)",
  hiit: "Coach Alex (HIIT Lead)",
  circuit: "Coach Alex (HIIT Lead)",
  cardio: "Coach Sarah (Endurance)",
  boxing: "Coach Ramirez (Striking)",
};

const PLACE_ENUM_MAP: Record<number, string> = {
  0: "Cardio Studio - Room A",
  1: "Strength Zone - Main Floor",
  2: "HIIT Cage - Box 2",
  3: "Mind & Body - Wellness Suite",
};

export function UserMyBookings() {
  const [bookings, setBookings] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchUserBookings = async () => {
    try {
      const userBookingsData = await getBookingByUserId();
      setBookings(userBookingsData || []);
    } catch (error) {
      console.error("Failed to compile user booking allocations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUserBookings();
  }, []);

  // NEW: Dynamic Status Handler callback block triggers patch transaction directly on the C# controller
  const handleStatusMutation = async (
    bookingId: number,
    nextStatusValue: number,
  ) => {
    // FIX: Pass the raw number value directly instead of casting it to a String
    const result = await UpdateBookingStatus(bookingId, nextStatusValue);

    // Check if the array or object returned from the patch path is valid
    if (result) {
      toast.success("Workout tracking status updated!");
      fetchUserBookings(); // Forcibly refresh state metrics grid layout list view instantly
    } else {
      toast.error("Could not synchronize status updates with GymQuest.");
    }
  };

  const handleCancelWorkout = async (bookingId: number) => {
    const isDeleted = await deleteBooking(bookingId);
    if (isDeleted) {
      toast.success("Reservation removed from your calendar.");
      // Force a fresh fetch invocation to update your states layout dynamically
      const updatedData = await getBookingByUserId();
      setBookings(updatedData || []);
    } else {
      toast.error("Failed to cancel this session profile. Try again.");
    }
  };

  return (
    <>
      <section className="trainingDetail">
        <div className="text-center py-5 text-white">
          <h2 className="fw-bold" style={{ letterSpacing: "0.5px" }}>
            Your bookings
          </h2>
        </div>
        <div className="list-container">
          <section className="exercise-list">
            {loading ? (
              <p className="text-center text-white">
                Loading your active schedule logs...
              </p>
            ) : bookings.length === 0 ? (
              <p className="text-center text-white-50">
                You have no active routine bookings scheduled yet.
              </p>
            ) : (
              bookings.map((booking, index) => {
                const training = booking.trainings?.[0];

                const normalizedName = (
                  training?.trainingName || ""
                ).toLowerCase();
                const matchedKeyword = Object.keys(WORKOUT_COACH_MAP).find(
                  (keyword) => normalizedName.includes(keyword),
                );
                const assignedTrainerName = matchedKeyword
                  ? WORKOUT_COACH_MAP[matchedKeyword]
                  : "GymQuest Staff Coach";

                const rawPlaceValue = training?.place;
                const placeString =
                  typeof rawPlaceValue === "number"
                    ? PLACE_ENUM_MAP[rawPlaceValue] || `Zone ${rawPlaceValue}`
                    : rawPlaceValue || "Main Gym Floor";

                const resolvedCardImage = getTrainingImage(
                  training?.trainingName,
                );

                return (
                  <BookingCard
                    key={booking.id ?? index}
                    trainingName={
                      training?.trainingName || "GymQuest Workout Track"
                    }
                    trainer={assignedTrainerName}
                    location={placeString}
                    exerciseCount={training?.exercises?.length ?? 0}
                    imageUrl={resolvedCardImage}
                    description={training?.description}
                    difficulty={training?.difficulty as any}
                    isMyBookingFeed={true}
                    status={Number(booking.status ?? 0)} // Ensures numerical stability
                    onStatusChange={(targetNextStateCode) => {
                      if (booking.id) {
                        handleStatusMutation(booking.id, targetNextStateCode);
                      }
                    }}
                    onViewExercises={() => {
                      if (training) {
                        navigate("/training", { state: { training } });
                      }
                    }}
                    // FIXED PROPERTY NAME: Must be labeled 'onDelete' to match the component contract definitions
                    onDelete={() => {
                      if (booking.id) {
                        handleCancelWorkout(booking.id);
                      }
                    }}
                  />
                );
              })
            )}
          </section>
        </div>
      </section>
    </>
  );
}
