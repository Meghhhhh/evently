import React, { useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay, Navigation } from "swiper/modules";
import TandC from "../Common/TandC";
import Recommended from "./Recommended";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, removeItemFromCart,addPackageToCart,removePackageFromCart,selectTotalItemAmount,selectTotalPackageAmount, selectGrandTotal } from "../../features/cartSlice";
import { useEffect } from "react";
import "../../index.css"
import { useNavigate } from "react-router-dom";
import { getPackageNames } from '../../features/cartSlice';
import axios from "axios";
import { setUserDetails } from "../../features/user/userSlice";
import { toast } from "react-toastify";
const Service = ({
  gallery = [],
  serviceName,
  location,
  about,
  packages = [],
  booking,
  cancellation,
  terms,
  singleItems = [],
  
}) => {
  const navigate = useNavigate(); 
  const packageNames = useSelector(getPackageNames);
  const safePackageNames = Array.isArray(packageNames) ? packageNames : [];
 const {items,packagesState} = useSelector((state)=>state.cart)
 const user = useSelector((state) => state.user);
  const totalItemAmount = useSelector(selectTotalItemAmount);
  const totalPackageAmount = useSelector(selectTotalPackageAmount);
  const grandTotal = useSelector(selectGrandTotal);
  const [quantities, setQuantities] = useState([]);
  const [pkgQuantity, setPkgQuantity] = useState([]);
  const [itemQuantity, setItemQuantity] = useState([]);
  const [pkgName, setPkgName] = useState([]);
  const [itmArr, setItmArr] = useState([]);
  const [pkgArr, setPkgArr] = useState([]);
 
  const dispatch = useDispatch();

  useEffect(()=>{
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/users/current-user",
          { withCredentials: true }
        );
        const obj = response.data.data;
        console.log("hey user here",obj);
                dispatch(
                  setUserDetails({
                    _id: obj._id,
                    email: obj.email,
                    firstName: obj.firstName,
                    lastName: obj.lastName,
                    userType: obj.userType,
                    contactNumber: obj.contactNumber,
                  })
                );
                 toast.success(" fetching user details!", {
                          autoClose: 1500,
                          closeButton: false,
                        });
  }
  catch{
     toast.error("error fetching user details!", {
              autoClose: 1500,
              closeButton: false,
            });
  }
};
fetchUserDetails();
},[]);
  const handleAddToCart = async () => {
    try {
      
      console.log(user);
      const addedResponse = await axios.post("http://localhost:8080/api/v1/cart/addToCart", {
       
        userId: user._id,
        isVenue: false,
        name: serviceName, // Changed to 'name'
        totalPrice: grandTotal, // Changed to 'totalAmount'
        items: itmArr, // Changed to 'items'
        package: pkgArr, // Changed to 'packages'
      });
      if (addedResponse.status === 200) {
        navigate("/cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      // Show a user-friendly error message
    }
  };
  
 
  useEffect(() => {
 
    const totItems = quantities.reduce((acc, qty) => acc + qty, 0);
    const totPkg = pkgQuantity.reduce((acc, qty) => acc + qty, 0);
  
    const itmArrNew = {
      itemPrice: totalItemAmount, 
      itemQuantity: totItems, 
    };//just an object
  
    const pkgArrNew = pkgQuantity.map((pkgQty, index) => ({
      packageName:  pkgName.map(pkg => pkg.packageName), 
      packageQuantity: totPkg,
      packagePrice: totalPackageAmount,
     
      
    }));//array of objects
    console.log("Total items quantity:", totItems);
    console.log("Total packages quantity:", totPkg);
    console.log("itmArr", itmArrNew);
    console.log("pkgArr", pkgArrNew);
    setItmArr(itmArrNew);
    setPkgArr(pkgArrNew);
  
  }, [quantities, pkgQuantity, totalItemAmount, totalPackageAmount, pkgName]);
  

  useEffect(() => {
    const names = packageNames.payload.cart.packagesState;
    setPkgName(names);
    console.log("Package Names:", packageNames.payload.cart.packagesState); 
  }, [packageNames]);




  useEffect(() => {
    
    if (singleItems.length > 0) {
      setQuantities(new Array(singleItems.length).fill(0));
    }
  
  }, [singleItems]);
  useEffect(() => {
    
    if (packages.length > 0) {
      setPkgQuantity(new Array(packages.length).fill(0));
    }
  
  }, [packages]);

  const handleAddSingleItem = (item, index) => {
    
    const newQuantities = [...quantities];
    newQuantities[index] = Math.max(0, newQuantities[index] + 1);

     setQuantities(newQuantities);
     const updatedItem = { ...item, quantity: newQuantities[index] };

     console.log("Updated item:", updatedItem);
    if (quantities[index] > 0) {
      dispatch(addItemToCart(updatedItem));
    }
    console.log(items)
  };

  const handleRemoveSingleItem = (item, index) => {
    
    const newQuantities = [...quantities];
    newQuantities[index] = Math.max(0, newQuantities[index] - 1);

     setQuantities(newQuantities);
     const updatedItem = { ...item, quantity: newQuantities[index] };
    if (quantities[index] > 0) {
      dispatch(removeItemFromCart(updatedItem));
    }
    console.log(items)
  };


  const handleAddPackages = (pkg, inx) => {
    
    const newPackages = [...pkgQuantity];
    newPackages[inx] = Math.max(0, newPackages[inx] + 50);

    setPkgQuantity(newPackages);
     const updatedItem = { ...pkg, quantity: newPackages[inx] };

     console.log("Updated item:", updatedItem);
    if (pkgQuantity[inx] > 0) {
      dispatch(addPackageToCart(updatedItem));
    }
     console.log(packagesState)
     console.log("grandtotal",grandTotal)
  };

  const handleRemovePackages = (pkg, inx) => {
    
    const newPackages = [...pkgQuantity];
    newPackages[inx] = Math.max(0, newPackages[inx] - 50);

    setPkgQuantity(newPackages);
     const updatedItem = { ...pkg, quantity: newPackages[inx] };
    if (pkgQuantity[inx] > 0) {
      dispatch(removePackageFromCart(updatedItem));
    }
    console.log(packagesState)
  };
  const formatNumber = (num) => num.toLocaleString();
  return (
    <div className="bg-darkGray/30 w-11/12 p-5 flex gap-10 flex-col">
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        modules={[FreeMode, Pagination, Autoplay, Navigation]}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        freeMode={true}
        breakpoints={{
          1024: {
            slidesPerView: 1,
          },
        }}
        className="w-full sm:h-[60vh]"
      >
        {gallery.map((img, index) => (
          <SwiperSlide key={index}>
            <img src={img} alt={`${serviceName} photo ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* header section */}
      <div className="sm:flex-row flex flex-col gap-10">
        <div className="flex flex-col gap-10 sm:w-[60%]">
          <div className="bg-lightGray/10 rounded-md p-10 flex justify-between items-center">
            <div className="flex flex-col gap-3">
              <h2 className="font-bold text-3xl text-primaryPeach">{serviceName}</h2>
              <p>{location}</p>
            </div>
          </div>
          {/* about section */}
          <div className="bg-lightGray/10 rounded-md p-10 flex flex-col gap-3">
            <h2 className="font-bold text-3xl text-primaryPeach">About {serviceName}</h2>
            <div>{about}</div>
          </div>
        </div>
        <div className="sm:w-[40%]">
          <Recommended />
        </div>
      </div>

      {/* single items */}
      <div className="bg-lightGray/10 rounded-md p-10 flex flex-col gap-6">
        <h2 className="font-bold text-3xl text-primaryPeach">Items We Provide</h2>
        <div className="bg-lightGray w-[100%] h-[100%] rounded-lg">
          <div className="p-2 flex justify-between items-center text-black">
            <div><b>Item Name</b> (you can buy in sets of 50 min. 50 provided)</div>
            <div className="flex gap-10 pr-16">
              <div>Quantity</div>
              <div>Price</div>
            </div>
          </div>
          <span className="bg-mediumGray h-[1px] w-[100%] my-1 block"></span>

          {singleItems.map((item, index) => (
            <div className="flex flex-col" key={index}>
              <div className="p-2 flex justify-between items-center text-black">
                <div>{item.itemName}</div>
                <div className="flex gap-10">
                  <div>{item.itemQuantity}</div>
                  <div>{item.itemPrice}</div>
                  <div className="flex gap-4 bg-primaryPeach p-2 rounded-lg text-lightGray">
                    <span onClick={() => handleRemoveSingleItem(item,index)}>-</span>
                    <span>{quantities[index] || 0}</span>
                    <span onClick={() => handleAddSingleItem(item, index)}>+</span>
                    {/* <button
                      className="bg-primaryPeach/90 p-2 rounded-lg text-lightGray"
                      onClick={() => handleAddSingleItem(item, index)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="bg-red-500/90 p-2 rounded-lg text-lightGray"
                      onClick={() => handleRemoveSingleItem(item, index)}
                    >
                      Remove from Cart
                    </button> */}
                  </div>
                </div>
              </div>
              <span className="bg-mediumGray h-[1px] w-[100%] my-1 block"></span>
            </div>
          ))}
        </div>
      </div>

      {/* all packages */}
      <div className="bg-lightGray/10 rounded-md p-10 flex flex-col gap-6">
        <h2 className="font-bold text-3xl text-primaryPeach">Our Packages</h2>
        {packages.map((pkg, inx) => (
          <details key={inx} className="">
            <summary className="flex gap-10 justify-between px-10 h-24 items-center bg-lightGray/40 rounded-t-xl">
              <div className="font-semibold sm:text-2xl text-md">
                {pkg.packageName} - ${pkg.price}
              </div>
              <div className="flex gap-4 bg-primaryPeach p-2 rounded-lg text-lightGray cursor-pointer">
                    <span onClick={() => handleRemovePackages(pkg,inx)}>-</span>
                    <span>{pkgQuantity[inx] || 0}</span>
                    <span onClick={() => handleAddPackages(pkg, inx)}>+</span>
                    </div>
            </summary>
            <div className="bg-lightGray text-darkGray transition-all  rounded-b-xl flex flex-col p-3 gap-4 text-lg">
              <ul>
                {pkg.items.map((detail, index) => (
                  <React.Fragment key={index}>
                    <li className="flex justify-between items-center px-10">
                      <span>{detail.itemName}</span>
                      <span>{detail.itemQuantity}</span>
                    </li>
                    <span className="bg-mediumGray h-[1px] w-[100%] my-1 block"></span>
                  </React.Fragment>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>

      {/* addons */}
      {/* <div className="bg-lightGray/10 rounded-md p-10 flex flex-col gap-6">
        <h2 className="font-bold text-3xl text-primaryPeach">You Can Add Extra</h2>
        <textarea
          name="addOns"
          value={addOns}
          onChange={(e) => setAddOns(e.target.value)}
          className="p-3 rounded-md bg-gray-50/20 outline-none focus:border-pink-500"
          placeholder="Enter add ons"
          rows="1"
        />
      </div> */}

      {/* booking, terms, and cancellation */}
      <TandC booking={booking} cancellation={cancellation} terms={terms} />

      {(quantities.some(qty => qty > 0) || pkgQuantity.some(qty => qty > 0))  && (  <div class="bg-white shadow-md rounded-lg p-6 w-80 absolute top-4 right-4 z-50">
  <h2 class="text-lg font-bold mb-4 text-primaryBlack">Order Summary</h2>

  <div class="flex justify-between mb-2">
    <div class="text-gray-600">Item Quantity</div>
    <div class="font-semibold text-gray-900" >{quantities.reduce((acc, qty) => acc + qty, 0)}</div>
  </div>
  <div class="flex justify-between mb-4">
    <div class="text-gray-600">Item Price</div>
    <div class="font-semibold text-gray-900">{formatNumber(totalItemAmount)}</div>
  </div>

  <div class="flex justify-between mb-2">
    <div class="text-gray-600">Package Quantity</div>
    <div class="font-semibold text-gray-900"> {pkgQuantity.reduce((acc, qty) => acc + qty, 0)} </div>
  </div>
  <div class="flex justify-between mb-4">
    <div class="text-gray-600">Package Price</div>
    <div class="font-semibold text-gray-900">{formatNumber(totalPackageAmount)}</div>
  </div>
 
  <div class="flex justify-between mb-4">
  <div>
      <h3 className="text-black">Selected Packages:</h3>
      <ul>
        {pkgName.map((pkg, index) => (
          <li key={index}  className="text-black">{pkg.packageName}</li>
        ))}
      </ul>
    </div>
  </div>

  <div class="border-t border-gray-300 my-4"></div>
  <div class="flex justify-between text-lg font-bold text-gray-900">
    <span>Grand Total</span>
    <span>{formatNumber(grandTotal)}</span>
  </div>

  <button class="mt-6 w-full bg-primaryPeach text-white py-2 rounded-lg font-medium hover:bg-primaryPeach/90" onClick={handleAddToCart} navigate>
    Add to Cart
  </button>
</div>)}
    

    </div>
  );
};

export default Service;
