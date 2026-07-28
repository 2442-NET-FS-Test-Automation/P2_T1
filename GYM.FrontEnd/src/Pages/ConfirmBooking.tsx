import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getPublicTrainings } from "../services/TrainingService";
import { createBooking } from "../services/BookingService";
import { getUser } from "../services/auth";
import type { TrainingDTO } from "../types/trainingDTO";
import "../css/ConfirmBooking.css";
import { ExerciseList } from "../Components/ExerciseList";
import { IoArrowBack } from "react-icons/io5";
import { toast } from "react-toastify";

export function ConfirmBooking() {
  // Returns an object of key/value-pairs of the dynamic params
  // from the current URL that were matched by the routes.
  // Child routes inherit all params from their parent routes.
  const { trainingid } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [training, setTraining] = useState<TrainingDTO | null>(
    (location.state as { training?: TrainingDTO })?.training || null,
  );
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      const userData = await getUser();
      if (userData?.id) setCurrentUserId(userData.id);

      // Fallback: si no vino por state (ej. usuario refrescó la página)
      if (!training && trainingid) {
        const all = await getPublicTrainings();
        const found = all.find((t) => t.id === Number(trainingid));
        setTraining(found || null);
      }
    };
    init();
  }, []);

  const handleConfirm = async () => {
    if (!training?.id || !currentUserId) {
      toast.error(
        "We can't confirm your identity or the training. Try again.",
        {
          toastId: "confirmation-booking-error", // Prevents duplicate toasts
        },
      );
      return;
    }

    setSubmitting(true);

    const result = await createBooking({
      trainingId: training.id,
      userId: currentUserId,
      status: "Booked",
      exerciseTime: training.estimatedTime,
    });

    setSubmitting(false);

    if (result) {
      toast.success("Booked successfully!", {
        toastId: "booking-success",
      });
      navigate("/");
    } else {
      toast.error(
        "There has been a problem confirming your booking. Try again.",
        {
          toastId: "booking-error",
        },
      );
    }
  };

  if (!training) {
    return <p>Loading training...</p>;
  }

  return (
    <div className="confirm-booking-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        <IoArrowBack size={20} />
        <span>Back</span>
      </button>
      <h1>{training.trainingName}</h1>
      <p>{training.description}</p>

      {/* Inside your ConfirmBooking page layout component */}
      <ExerciseList
        exercises={training.exercises}
        onExerciseClick={(exercise) => {
          const targetId = exercise.id ?? (exercise as any).Id ?? 0;

          // 3. Match the exact singular string format registered in App.tsx: "/exercise/"
          navigate(`/exercise/${targetId}`, { state: { exercise } });
        }}
      />

      <button className="primary" onClick={handleConfirm} disabled={submitting}>
        Confirm Booking
      </button>

      {submitting && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
          <p>Confirming your booking...</p>
        </div>
      )}
    </div>
  );
}
