import { api } from "../api/client";
import type { BookingDTO } from "../types/BookingDTO";


// Petición GET limpia y sin tokens requeridos
export const getPublicBookings = async (): Promise<BookingDTO[]> => {
  try {
    const response = await api.get<BookingDTO[]>('/Booking/bookings');
    return response.data;
  } catch (error) {
    console.error('Error al obtener entrenamientos:', error);
    return [];
  }
};