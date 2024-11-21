import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../Auth/authSlice";
import contacts from "../Features/ContactBook/contactsSlice";
export const store = configureStore({
  reducer: {
    auth: authSlice,
    contacts: contacts
  },
  

   
});