import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("vendor")) || {
    _id: "",
    serviceName: "",
    location: "",
    about: "",
    vendorType: "",
    booking: "",
    terms: "",
    cancellation: "",
    packageName:"",
    price:"",
    items:"", 
    steps:"1",
    package_id:"",
    venue: "", // New field for venue ID
    singleItems: [], 
  };
const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    setVendorDetails: (state, action) => {
        console.log('Updating vendor details:', action.payload);
      const { _id, serviceName, location, about, vendorType, booking, terms, cancellation,venue,singleItems } = action.payload;
      state._id = _id;
      state.serviceName = serviceName;
      state.location = location;
      state.about = about;
      state.vendorType = vendorType;
      state.booking = booking;
      state.terms = terms;
      state.cancellation = cancellation;
      state.singleItems = singleItems;
      state.venue = venue;
      console.log("here");
      localStorage.setItem("vendor", JSON.stringify(state));
    },
    clearVendorDetails: (state) => {
      state._id = "";
      state.serviceName = "";
      state.location = "";
      state.about = "";
      state.vendorType = "";
      state.booking = "";
      state.terms = "";
      state.cancellation = "";
      state.venue = "";
      localStorage.removeItem("vendor");
    },
    setSteps:(state,action)=>{
      state.steps = action.payload;
    },
    setPackagedetails: (state, action) => {
      console.log('Updating package details:', action.payload); // Debugging line
      const { _id, packageName, price,items } = action.payload;
      state.packageName = packageName;
      state.price = price;
      state.items = items
      state.package_id = _id;// Debugging line
      localStorage.setItem("vendor", JSON.stringify(state));
    }
    
  },
});

export const { setVendorDetails, clearVendorDetails ,setSteps,setPackagedetails} = vendorSlice.actions;
export default vendorSlice.reducer;
