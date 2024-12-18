import React, { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { clearVendorDetails, setVendorDetails } from "../../features/vendorSlice";
import AddPackages from "./AddPackages";
const AddServices = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user); 
  const {vendor,_id} = useSelector((state)=>state.vendor)
  const vendorData = localStorage.getItem("vendor");
  const parsedVendorData = vendorData ? JSON.parse(vendorData) : {};
  

  const [serviceName, setServiceName] = useState(parsedVendorData.serviceName || "");
  const [location, setLocation] = useState(parsedVendorData.location || "");
  const [about, setAbout] = useState(parsedVendorData.about || "");
  const [vendorType, setVendorType] = useState(parsedVendorData.vendorType || "");
  const [booking, setBookingPolicy] = useState(parsedVendorData.booking || "");
  const [cancellation, setCancellationPolicy] = useState(parsedVendorData.cancellation || "");
  const [terms, setTermsAndConditions] = useState(parsedVendorData.terms || "");
  const [venueArr, setVenueArr] = useState([]);
  const [venue, setVenue] = useState(parsedVendorData.venue || "");
  const [singleItems, setSingleItems] = useState(parsedVendorData.singleItems || []);
  const[cities,setCities] = useState([]);
  const [cityName, setCityName] = useState("");
  //const [cityName, setCityName] = useState("");
  const [editDetails, setEditDetails] = useState(localStorage.getItem("vendor") ? true : false);

const userId = user._id
  useEffect(() => {
    console.log("Vendor after addit:", vendor);
  }, [vendor]);

  //getting all cities
  useEffect(()=>{
    const getCities = async()=>{
      try {
       const citiesArray = await axios.get("http://localhost:8080/api/v1/cities/getAllCities");
       console.log("arrayy",citiesArray);
       setCities(citiesArray.data.data.data);
       console.log("arrayy",cities);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    getCities();
  },[]);

  useEffect(()=>{
    const getVenues = async()=>{
      console.log(cityName);
      if (!cityName) return; // Avoid unnecessary fetches
      try {
        const venuesArray = await axios.post(
          "http://localhost:8080/api/v1/cities/getAllVenuesAtCity",{cityName}
        );
        console.log(venuesArray.data.data.data)
        setVenueArr(venuesArray.data.data.data || []); // Update venues state
      } catch (error) {
        console.error("Error fetching venues:", error);
        toast.error("Failed to fetch venues.");
      }
    };
    getVenues();
    
  },[cityName]);


  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      console.log("in the frontend code",serviceName,location,about,vendorType,booking,cancellation,terms,venue,singleItems,user._id)
      const addedDetails = await axios.post("http://localhost:8080/api/v1/vendor/addServiceDetails",{
        serviceName,location,about,vendorType,booking,cancellation,terms,venue,singleItems,userId
      });
      console.log(addedDetails.data)
     console.log("service added")
      dispatch(
        setVendorDetails({
          _id: addedDetails.data.data.data._id,
          serviceName: addedDetails.data.data.data.serviceName,
          location: addedDetails.data.data.data.location,
          about: addedDetails.data.data.data.about,
          vendorType: addedDetails.data.data.data.vendorType,
          booking:addedDetails.data.data.data.booking,
          terms: addedDetails.data.data.data.terms,
          cancellation: addedDetails.data.data.data.cancellation,
          venue: addedDetails.data.data.data.venue,
          singleItems: addedDetails.data.data.data.singleItems,
        
        })
      );
      console.log("vendor after add",vendor);
      setEditDetails(true);

    } catch (error) {
      console.log(error)
      toast.error(
       "Error adding the service",
        {
          autoClose: 1500,
          closeButton: false,
        }
      );
    }
  
    
  };


  const handleAddOneMore = () => {
    dispatch(clearVendorDetails());

    // Reset form fields
    setServiceName("");
    setLocation("");
    setAbout("");
    setVendorType("");
    setBookingPolicy("");
    setCancellationPolicy("");
    setTermsAndConditions("");
    setVenue("");
    setSingleItems([]);

    setEditDetails(false);
  };
  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    try {
      console.log(serviceName, location, about, vendorType, booking, cancellation, terms, _id,venue,singleItems)
      const updatedDetails = await axios.put("http://localhost:8080/api/v1/vendor/updateServiceDetails", {
        serviceName, location, about, vendorType, booking, cancellation, terms,vendorId: _id,venue,singleItems
      });
      console.log(updatedDetails);
      //toast.success("Service Updated Successfully");
  
      dispatch(setVendorDetails({
        _id: updatedDetails.data.data.data._id,
        serviceName: updatedDetails.data.data.data.serviceName,
        location: updatedDetails.data.data.data.location,
        about: updatedDetails.data.data.data.about,
        vendorType: updatedDetails.data.data.data.vendorType,
        booking: updatedDetails.data.data.data.booking,
        terms: updatedDetails.data.data.data.terms,
        cancellation: updatedDetails.data.data.data.cancellation,
        venue: updatedDetails.data.data.data.venue,
        singleItems: updatedDetails.data.data.data.singleItems,
       
      }));
      console.log("vendor after addo",vendor);
    } catch (error) {
      console.log(error);
      toast.error("Error updating service.");
    }
  };
  const handleSingleItemChange = (index, key, value) => {
    const newItems = [...singleItems];
    newItems[index][key] = value;
    setSingleItems(newItems);
  };

  const addSingleItem = () => {
    setSingleItems([...singleItems, { itemName: "", itemQuantity: 0, itemPrice: 0 }]);
  };
  return (
    
    <div className="w-[100%] min-h-[100vh] flex flex-col gap-30 items-center justify-center ">
      <div className="w-[80%] rounded-lg shadow-lg ">
        <h2 className="text-4xl pt-10 font-bold text-center text-primaryPeach mb-6">
          Add New Service
        </h2>
       
        <form className="bg-darkGray/30 p-5 rounded-lg" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col">
              <label className="text-primaryPeach  font-semibold mb-2">Service Name:</label>
              <input
                type="text"
                name="serviceName"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="p-3  rounded-md bg-gray-50/20 outline-none focus:border-pink-500"
                placeholder="Enter service name"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-primaryPeach  font-semibold mb-2">Location:</label>
              <input
                type="text"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="p-3  rounded-md bg-gray-50/20 outline-none focus:border-pink-500"
                placeholder="Enter location"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-primaryPeach  font-semibold mb-2">About:</label>
              <textarea
                name="about"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="p-3  rounded-md bg-gray-50/20 outline-none focus:border-pink-500"
                placeholder="Enter details about the service"
                rows="1"
              />
            </div>

            <div className="flex flex-col">
  <label className="text-primaryPeach font-semibold mb-2">Vendor Type:</label>
  <select
    name="vendorType"
    value={vendorType}
    onChange={(e) => setVendorType(e.target.value)}
    className="p-3 rounded-md bg-gray-50/20 outline-none focus:border-pink-500"
  >
    <option value="" disabled>Select type of vendor</option>
    <option value="caterer">Caterer</option>
    <option value="decorator">Decorator</option>
    <option value="photographer">Photographer</option>
  </select>
</div>

            <div className="flex flex-col">
              <label className="text-primaryPeach  font-semibold mb-2">Booking Policy:</label>
              <textarea
               name="booking"
               value={booking}
               onChange={(e) => setBookingPolicy(e.target.value)}
                className="p-3  rounded-md bg-gray-50/20 outline-none focus:border-pink-500"
                placeholder="Enter booking policy details"
                rows="1"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-primaryPeach  font-semibold mb-2">Cancellation Policy:</label>
              <textarea
               name="cancellation"
               value={cancellation}
               onChange={(e) => setCancellationPolicy(e.target.value)}
                className="p-3  rounded-md bg-gray-50/20 outline-none focus:border-pink-500"
                placeholder="Enter cancellation policy details"
                rows="1"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-primaryPeach  font-semibold mb-2">Terms and Conditions:</label>
              <textarea
                name="terms"
                value={terms}
                onChange={(e) => setTermsAndConditions(e.target.value)}
                className="p-3  rounded-md bg-gray-50/20 outline-none focus:border-pink-500"
                placeholder="Enter terms and conditions"
                rows="1"
              />
            </div>
        


            <div className="flex flex-col">
            <label className="text-primaryPeach font-semibold mb-2">Cities:</label>
            <select name="cities" value={cities}  onChange={(e) => setCityName(e.target.value)}>
                <option value="" disabled>Select a city</option>
               {
                cities.map((city)=>(
                  <option key={city.id} value={city.name} className="text-white">{city.cityName}</option>
                ))
               }
               
              </select>
              </div>

              <div className="flex flex-col">
              <label className="text-primaryPeach font-semibold mb-2">Venues:</label>
            <select name="venue" value={venue} onChange={(e)=>setVenue(e.target.value)}>
                <option value="" disabled>Select a venue</option>
               {
                venueArr.map((venue)=>(
                  <option key={venue.id} value={venue._id} className="text-white">{venue.venueName}</option>
                ))
               }
               
              </select>
            
            </div>


            {singleItems.map((item, index) => (
              <div key={index} className="flex flex-col">
                <label className="text-primaryPeach font-semibold mb-2">Item {index + 1}:</label>
                <input
                  type="text"
                  value={item.itemName}
                  onChange={(e) => handleSingleItemChange(index, "itemName", e.target.value)}
                  className="p-3 mb-2 rounded-md bg-gray-50/20 outline-none focus:border-pink-500"
                  placeholder="Item Name"
                />
                <input
                  type="number"
                  value={item.itemQuantity}
                  onChange={(e) => handleSingleItemChange(index, "itemQuantity", e.target.value)}
                  className="p-3 mb-2 rounded-md bg-gray-50/20 outline-none focus:border-pink-500"
                  placeholder="Item Quantity"
                />
                <input
                  type="number"
                  value={item.itemPrice}
                  onChange={(e) => handleSingleItemChange(index, "itemPrice", e.target.value)}
                  className="p-3 rounded-md bg-gray-50/20 outline-none focus:border-pink-500"
                  placeholder="Item Price"
                />
              </div>
            ))}
             <button
              type="button"
              onClick={addSingleItem}
              className="mt-2 bg-blue-500 text-white px-3 py-2 rounded-md"
            >
              Add Item
            </button>
            {/* AddOns Field */}
            
           
          </div>

        {!editDetails ? (<button
            type="submit"
            className="w-full py-3 bg-primaryPeach text-white font-semibold rounded-md  transition duration-200"
          >
            Add Service
          </button>) : (
            <button
           onClick={handleUpdateDetails}
            className="w-full py-3 bg-green-500 text-white font-semibold rounded-md  transition duration-200"
          >
            Update Details
          </button>)
}
        </form>
      </div>
      <ToastContainer
        style={{ zIndex: 9999 }} // Adjust the z-index as needed
      />
      <button onClick={handleAddOneMore} className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md">
        Add one more?
      </button>
      {
        editDetails ?( <AddPackages/> ): (<div></div>)
      }
      
    </div>
  );
};

export default AddServices;
