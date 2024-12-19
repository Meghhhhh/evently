import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  venues: [],
  selectedVenue: JSON.parse(localStorage.getItem("selectedVenue")) || null,
};

const venueSlice = createSlice({
  name: "venue",
  initialState,
  reducers: {
    setVenues: (state, action) => {
      state.venues = action.payload;
    },
    setSelectedVenue: (state, action) => {
      state.selectedVenue = action.payload;
      localStorage.setItem(
        "selectedVenue",
        JSON.stringify(state.selectedVenue)
      );
    },
  },
});

export const { setVenues, setSelectedVenue } = venueSlice.actions;
export default venueSlice.reducer;
