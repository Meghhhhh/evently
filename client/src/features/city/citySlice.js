import { createSlice } from "@reduxjs/toolkit";

const citySlice = createSlice({
    name: "city",
    initialState: {
        selectedCity: null, 
      },
    reducers: {
        setSelectedCity : (state,action) => {
            state.selectedCity = action.payload;
        }
    }
})
 export const {setSelectedCity} = citySlice.actions;
 export default citySlice.reducer; 