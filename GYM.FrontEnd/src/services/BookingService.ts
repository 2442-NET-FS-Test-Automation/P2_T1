import { api } from "../api/client";
import type { BookingDTO, BookingStatus } from "../types/BookingDTO";

export interface CreateBookingDTO {
  trainingId: number;
  userId: number;
  status: BookingStatus;
  exerciseTime: string;
}

const STATUS_TO_NUMBER: Record<BookingStatus, number> = {
  Booked: 0,
  Working: 1,
  Completed: 2,
  Cancelled: 3,
};

const toDateTimeString = (time: string): string => {
  const todayISO = new Date().toISOString().split("T")[0];
  return `${todayISO}T${time}`;
};

// URL: GET /api/Booking/allBookings
export const getPublicBookings = async (): Promise<BookingDTO[]> => {
  try {
    const response = await api.get<BookingDTO[]>("/Booking/allBookings");
    return response.data;
  } catch (error) {
    console.error("Error getting bookings:", error);
    return [];
  }
};

// URL: POST /api/Booking/bookings
export const createBooking = async (
  booking: CreateBookingDTO,
): Promise<BookingDTO | null> => {
  try {
    const payload = {
      ...booking,
      status: STATUS_TO_NUMBER[booking.status],
      exerciseTime: toDateTimeString(booking.exerciseTime),
    };

    const response = await api.post<BookingDTO>("/Booking/bookings", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    return null;
  }
};

// URL: PATCH /api/Booking/bookings-status/{id}/{newStatus}
export const UpdateBookingStatus = async (
  id: number,
  newStatus: number,
): Promise<BookingDTO | null> => {
  try {
    // FIXED: Maps single response instance from backend Ok(updatedDTO) definition
    const response = await api.patch<BookingDTO>(
      `/Booking/bookings-status/${id}/${newStatus}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error modifying booking status token:", error);
    return null;
  }
};

// URL: GET /api/Booking/bookings/{id}
export const getBookingById = async (
  id: number,
): Promise<BookingDTO | null> => {
  try {
    // FIXED: Swapped api.put to api.get to resolve potential 405 runtime exceptions
    const response = await api.get<BookingDTO>(`/Booking/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching target booking payload:", error);
    return null;
  }
};

// URL: GET /api/Booking/bookings/BookingByUserId
export const getBookingByUserId = async (): Promise<BookingDTO[]> => {
  try {
    const response = await api.get<BookingDTO[]>(
      "/Booking/bookings/BookingByUserId",
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return [];
  }
};

// URL: DELETE /api/Booking/bookings/{id}
export const deleteBooking = async (id: number): Promise<boolean> => {
  try {
    // FIXED: Changed route path from '/Booking/bookings/' to match your [HttpDelete("bookings/{id:int}")] contract precisely
    await api.delete(`/Booking/bookings/${id}`);
    return true;
  } catch (error) {
    console.error("Error removing session booking:", error);
    return false;
  }
};
