import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  startDate: null,
  endDate: null,
};

const dateSlice = createSlice({
    name: "date",
    initialState,
    reducers: {
        setStartDate: (state, action) => {
            state.startDate = action.payload;
        },
        setEndDate: (state, action) => {
            state.endDate = action.payload;
        }
    }
});

export const {setStartDate, setEndDate} = dateSlice.actions;
export default dateSlice.reducer;

