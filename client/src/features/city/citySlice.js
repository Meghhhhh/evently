import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedCity: {},
}

const citySlice = createSlice({
    name: "city",
    initialState,
    reducers: {
        setSelectedCity : (state,action) => {
            state.selectedCity = action.payload;
        }
    }
})
 export const {setSelectedCity} = citySlice.actions;
 export default citySlice.reducer; 