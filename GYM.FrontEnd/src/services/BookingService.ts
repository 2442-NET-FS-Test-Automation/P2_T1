import { api } from "../api/client";
import type { BookingDTO, BookingStatus } from "../types/BookingDTO";

// payload that backend needs to create the record
export interface CreateBookingDTO {
  trainingId: number;
  userId: number;
  status: BookingStatus;
  exerciseTime: string;
}

// public enum BookingStatus { Booked, Working, Completed, Cancelled }
const STATUS_TO_NUMBER: Record<BookingStatus, number> = {
  Booked: 0,
  Working: 1,
  Completed: 2,
  Cancelled: 3,
};

// Convierte "00:45:00" a un DateTime completo tipo "2026-07-27T00:45:00"
const toDateTimeString = (time: string): string => {
  const todayISO = new Date().toISOString().split("T")[0]; // "2026-07-27"
  return `${todayISO}T${time}`;
};

// get all bookings
export const getPublicBookings = async (): Promise<BookingDTO[]> => {
  try {
    const response = await api.get<BookingDTO[]>('/Booking/allBookings');
    return response.data;
  } catch (error) {
    console.error('Error getting booking:', error);
    return [];
  }
};

// user creates bookings
export const createBooking = async (
  booking: CreateBookingDTO
): Promise<BookingDTO | null> => {
  try {
    const payload = {
      ...booking,
      status: STATUS_TO_NUMBER[booking.status],
      exerciseTime: toDateTimeString(booking.exerciseTime)
    }

    const response = await api.post<BookingDTO>('/Booking/bookings', payload);
    return response.data
  } catch (error) {
    console.error('Error creating booking:', error);
    return null;
  }
};

export const UpdateBookingStatus = async (id: number, newStatus: string): Promise<BookingDTO[]> => {
  try {
    const response = await api.patch<BookingDTO[]>(`/Booking/bookings-status/${id}/${newStatus}`)
    return response.data;
  } catch (error) {
    return []
  }
}


// [HttpPatch("bookings-status/{id}/{newStatus}")]
// public async Task<ActionResult<BookingDTO>> UpdateBookingStatus(int id, int newStatus)
// {
//     //Checar que exista el booking, enviarlo a ser modificado (modificarlo, guardarlo en db)
//     //regresar el dto

//     BookingDTO? updatedDTO = await _service.UpdateStatus(id, newStatus);

//     if(updatedDTO is null)
//         return BadRequest();

//     _cache.Remove("Bookings:all");
//     _cache.Remove($"Bookids:{id}");

//     return Ok(updatedDTO);
// }

// export const updateBooking = async (): Promise<BookingDTO[]> => {
//   try {
//     const response = await api.put<BookingDTO[]>('/Booking/updateBooking');
//     return response.data;
//   } catch (error) {
//     console.error('Error updating booking:', error);
//     return [];
//   }
// };

// export const deleteBooking = async (): Promise<BookingDTO[]> => {
//   try {
//     const response = await api.put<BookingDTO[]>('/Booking/updateBooking');
//     return response.data;
//   } catch (error) {
//     console.error('Error updating booking:', error);
//     return [];
//   }
// };

export const getBookingById = async (id: number): Promise<BookingDTO[]> => {
  try {
    const response = await api.put<BookingDTO[]>(`/Booking/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error updating booking:', error);
    return [];
  }
};

export const getBookingByUserId = async (userId: number): Promise<BookingDTO[]> => {
  try {
    const response = await api.put<BookingDTO[]>(`/Booking/BookingByUserId/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error updating booking:', error);
    return [];
  }
};