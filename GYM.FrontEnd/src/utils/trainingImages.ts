// utils/trainingImages.ts

// import as assets as we are using Vite
import yogaImg from "../img/trainings/yoga.jpeg";
import strengthImg from "../img/trainings/Strength.avif";
import cardioImg from "../img/trainings/cardio.webp";
import boxingImg from "../img/trainings/boxing.jpeg";
import hiitImg from "../img/trainings/hiit.webp";
import defaultImg from "../img/trainings/defaultimg.webp";

// Mapa de palabras clave -> imagen
// Usamos "includes" para que agarre variantes como "Yoga Flow", "Beginner Yoga", etc.
const TRAINING_IMAGE_MAP: { keywords: string[]; image: string }[] = [
  { keywords: ["yoga"], image: yogaImg },
  { keywords: ["strength", "power", "titan"], image: strengthImg },
  { keywords: ["cardio", "endurance", "run"], image: cardioImg },
  { keywords: ["hiit", "circuit"], image: hiitImg },
  { keywords: ["boxing", "box"], image: boxingImg },
];

export function getTrainingImage(trainingName?: string): string {
  if (!trainingName) return defaultImg;

  const normalized = trainingName.toLowerCase();

  const match = TRAINING_IMAGE_MAP.find((entry) =>
    entry.keywords.some((keyword) => normalized.includes(keyword))
  );

  return match ? match.image : defaultImg;
}