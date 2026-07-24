/* We don't ask for a surname or name in the user database
   at least not in Users table, check RegisterDTO in GYM.Controller.Api

export interface RegisterUserDTOs {
  name: string;
  surname: string;
  email: string;
  password: string;
  phone?: string;
}*/

export interface RegisterUserDTOs {
  email: string;
  password: string;
  phone?: string;
}