import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getPublicTrainings } from "../services/TrainingService";
import { createBooking } from "../services/BookingService";
import { getUser } from "../services/auth";
import type { TrainingDTO } from "../types/trainingDTO";
import "../css/ConfirmBooking.css";
import { ExerciseList } from "../components/exerciseList";
import { IoArrowBack } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";

export function ConfirmBooking() {
// Returns an object of key/value-pairs of the dynamic params 
// from the current URL that were matched by the routes. 
// Child routes inherit all params from their parent routes.
  const { trainingid } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const Confirmation = () => toast("Booked!");

  const [training, setTraining] = useState<TrainingDTO | null>(
    (location.state as { training?: TrainingDTO })?.training || null
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
      alert("We can't confirm your identity or the training. Try again.");
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
      navigate("/");
    } else {
      alert("There has been a problem confirming your booking. Try again.");
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

      <ExerciseList exercises={training.exercises} />

      <button
        className="primary"
        onClick={handleConfirm}
        disabled={submitting}
      >
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