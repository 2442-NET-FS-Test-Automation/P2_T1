import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// IMPORT SERVICES: Pulls both your collection getter and status patcher endpoints
import {
  deleteBooking,
  getBookingByUserId,
  UpdateBookingStatus,
} from "../services/BookingService";
import type { BookingDTO } from "../types/BookingDTO";
import { BookingCard } from "../Components/BookingCard";
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
    // 1. Look up the specific item record inside your state array list matrix
    const targetBooking = bookings.find((b) => b.id === bookingId);

    // 2. FIXED GUARD: Terminate processing immediately if the entry has a 'Completed' index string code matching 2
    if (targetBooking && Number(targetBooking.status) === 2) {
      toast.warning("Completed workouts cannot be cancelled.");
      return;
    }

    try {
      const result = await UpdateBookingStatus(bookingId, 3);

      if (result) {
        toast.success("Reservation removed from your schedule feed.");
        const updatedData = await getBookingByUserId();
        setBookings(updatedData || []);
      } else {
        toast.error("Could not process your cancellation request.");
      }
    } catch (err) {
      console.error("Cancellation network processing error:", err);
    }
  };

  // Inside your return markup block, apply Number() type conversions to resolve the overlap:

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
            ) : bookings.filter((b) => Number(b.status) !== 3).length === 0 ? ( // FIXED OVERLAP GUARD
              <p className="text-center text-white-50">
                You have no active routine bookings scheduled yet.
              </p>
            ) : (
              bookings
                .filter((booking) => Number(booking.status) !== 3) // FIXED OVERLAP FILTER
                .map((booking, index) => {
                  const training = booking.trainings?.[0];
                  const user = booking.users?.[0] as any;

                  const firstName = user?.name ?? user?.Name ?? "";
                  const lastName = user?.surname ?? user?.Surname ?? "";
                  const trainerFullName = firstName
                    ? `${firstName} ${lastName}`.trim()
                    : "GymQuest Staff Coach";

                  const placeString =
                    typeof training?.place === "number"
                      ? PLACE_ENUM_MAP[training.place] ||
                        `Zone ${training.place}`
                      : training?.place || "Main Gym Floor";

                  const resolvedCardImage = getTrainingImage(
                    training?.trainingName,
                  );

                  return (
                    <BookingCard
                      key={booking.id ?? index}
                      trainingName={
                        training?.trainingName || "GymQuest Workout Track"
                      }
                      trainer={trainerFullName}
                      location={placeString}
                      exerciseCount={training?.exercises?.length ?? 0}
                      imageUrl={resolvedCardImage}
                      description={training?.description}
                      difficulty={training?.difficulty as any}
                      isMyBookingFeed={true}
                      // Maps cleanly as a normalized numeric value down to the card interface components
                      status={Number(booking.status)}
                      onStatusChange={(targetNextStateCode) => {
                        if (booking.id)
                          handleStatusMutation(booking.id, targetNextStateCode);
                      }}
                      onViewExercises={() => {
                        if (training)
                          navigate("/training", { state: { training } });
                      }}
                      onDelete={() => {
                        if (booking.id) handleCancelWorkout(booking.id);
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
