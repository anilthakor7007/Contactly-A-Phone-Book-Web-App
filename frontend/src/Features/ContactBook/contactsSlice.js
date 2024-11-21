import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://contactly-1clq.onrender.com',
})

// Thunks for async operations
export const fetchContacts = createAsyncThunk(
    "contacts/fetchContacts",
    async (_, { getState, rejectWithValue }) => {

        const state = getState();
        const token = state.auth?.token;
        if(!token){
            return rejectWithValue("Token not found");
        }
      try {
       
        const response = await axiosInstance.get("/api/contacts", {
          headers: {
            Authorization: `Bearer ${token}`, // Use the token from the auth state
          },
        });
        return response.data; // Assuming the API returns the list of contacts
      } catch (error) {
        return rejectWithValue(error.response.data || error.message);
      }
    }
);

export const addContact = createAsyncThunk(
    'contacts/addContact',
    
    async (contactData, { getState, rejectWithValue }) => {
        const state = getState();
        const token = state.auth?.token;
        if(!token){
            return rejectWithValue("Token not found");
        }
      
        try {
            const response = await axiosInstance.post('/api/contacts/create', contactData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Attach the token from the state
                },
            });
            alert("got the response" );
            console.log(response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateContact = createAsyncThunk(
    'contacts/updateContact',
    async ({ id, contact }, { getState, rejectWithValue }) => {
        const state = getState();
        const token = state.auth?.token;
        if(!token){
            return rejectWithValue("Token not found");
        }
       
        try {
            const response = await axiosInstance.put(`/api/contacts/${id}`, contact, {
                headers: {
                    Authorization: `Bearer ${token}`, // Attach the token from the state
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteContact = createAsyncThunk(
    'contacts/deleteContact',
    async (id, { getState, rejectWithValue }) => {
        const state = getState();
        const token = state.auth?.token;
        if(!token){
            return rejectWithValue("Token not found");
        }
       
        try {
            await axiosInstance.delete(`/api/contacts/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Attach the token from the state
                },
            });
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Initial state
const initialState = {
    contacts: [],
    status: 'idle',
    error: null
};

// Slice
const contactsSlice = createSlice({
    name: 'contacts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchContacts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchContacts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.contacts = action.payload;
            })
            .addCase(fetchContacts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || action.error.message;
            })
            .addCase(addContact.fulfilled, (state, action) => {
                state.contacts.push(action.payload);
            })
            .addCase(updateContact.fulfilled, (state, action) => {
                const updatedContact = action.payload;
                const index = state.contacts.findIndex(contact => contact._id === updatedContact._id);
                
                if (index !== -1) {
                    state.contacts[index] = updatedContact; // Update the contact in the state
                }
            })
            .addCase(updateContact.rejected, (state, action) => {
                state.error = action.payload || action.error.message;
            })
            
            .addCase(deleteContact.fulfilled, (state, action) => {
                state.contacts = state.contacts.filter(contact => contact._id !== action.payload);
            })
            .addCase(addContact.rejected, (state, action) => {
                state.error = action.payload || action.error.message;
            })
           
            .addCase(deleteContact.rejected, (state, action) => {
                state.error = action.payload || action.error.message;
            });
    }
});

export default contactsSlice.reducer;
export const selectUser = state => state.user;
export const selectAllContacts = state => state.contacts.contacts;
export const selectCurrentContact = (state, contactId) =>
    state.contacts.contacts.find(contact => contact.id === contactId);
