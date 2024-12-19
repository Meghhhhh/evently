import React, { useState } from "react";
import { setPackagedetails } from "../../features/vendorSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import ShowPackage from "./ShowPackage";
const AddPackages = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { vendor, _id } = useSelector((state) => state.vendor);
  const vendorData = localStorage.getItem("vendor");
  const parsedVendorData = vendorData ? JSON.parse(vendorData) : {};
  const [currentPackage, setCurrentPackage] = useState([]);
  const [isediting,setIsEditing] = useState(false);
  const [editPackageId,setEditPackageId] = useState("");
  const vendorId = _id;

  const [packageName, setPackageName] = useState(
    parsedVendorData.packages?.packageName || ""
  );
  const [price, setPackagePrice] = useState(
    parsedVendorData.packages?.price || ""
  );
  const [items, setItems] = useState(
    parsedVendorData.packages?.items?.length
      ? parsedVendorData.packages.items.map((item) => ({
          itemName: item.itemName || "",
          itemQuantity: item.itemQuantity || "",
        }))
      : [{ itemName: "", itemQuantity: "" }]
  );

  const handleAddItem = () => {
    setItems([...items, { itemName: "", itemQuantity: "" }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if(isediting){
    //   try {
    //     console.log("Inside is editing",editPackageId,packageName,price,items)
    //     const updated = await axios.put("http://localhost:8080/api/v1/package/updatePackages", {
    //       packageId: editPackageId,
    //       packageName,
    //       price,
    //       items
    //   })
    //     const newPack = updated?.data?.data?.data?.packages;
    //     console.log("newPack",newPack);
    //     setCurrentPackage(newPack)
    //     console.log("curr",currentPackage)
    //     toast.success("Package edited successfully", {
    //       autoClose: 1500,
    //       closeButton: false,
    //     });
    //     setIsEditing(false);
    //     setPackageName("");
    //     setPackagePrice("");
    //     setItems([]);
    //     setEditPackageId("")
    //   } catch (error) {
    //     console.error("Error updating package:", error);
    //     toast.error("Error updating package", {
    //       autoClose: 1500,
    //       closeButton: false,
    //     });
    //   }
     
    // }
 //   else{
    console.log(packageName, price, items, vendorId);
    try {
      const packageDetails = await axios.post(
        "http://localhost:8080/api/v1/package/createPackages",
        {
          packageName,
          price,
          items,
          vendorId,
        }
      );
      console.log("Package Details:", packageDetails);
      const currPackage =
        packageDetails?.data?.data?.data?.packages?.slice(-1)[0];

      // const packageId2 = currPackage._id;
      // const packageName2 = currPackage.packageName;
      // const price2 = currPackage.price;
      // const items2 = currPackage.items;
      console.log(currPackage);//last package added 
      
      dispatch(
        setPackagedetails({
          package_id: currPackage._id,
          packageName: currPackage.packageName,
          price: currPackage.price,
          items: currPackage.items,
        })
      );
      setCurrentPackage((prevPackages) => [
        ...prevPackages,
        {
          package_id: currPackage._id,
          packageName: currPackage.packageName,
          price: currPackage.price,
          items: currPackage.items,
        },
      ]);
      console.log("ant shant",currentPackage)
      setPackageName("");
      setPackagePrice("");
      setItems([]);
    } catch (error) {
      console.log(error);
      toast.error("Error in package addition details.", {
        autoClose: 1500,
        closeButton: false,
      });
    }
  //}
  };
  const handleDeletePackage = async (packageId) => {
    try {
      const deletePackage = await axios.delete("http://localhost:8080/api/v1/package/deletePackages",{
        data: { packageId, vendorId: _id } // Sending the data as part of request body
    });
      
      // Update the state to remove the deleted package
      setCurrentPackage((prevPackages) =>
        prevPackages.filter((pkg) => pkg.package_id !== packageId)
      );

      toast.success("Package deleted successfully", {
        autoClose: 1500,
        closeButton: false,
      });
    
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Error deleting package", {
        autoClose: 1500,
        closeButton: false,
      });
    }
  };
  // const handleEdit = async(packageId,packageName,price,items)=>{
  //   setPackageName(packageName);
  //   setPackagePrice(price);
  //   setItems(items);
  //   setIsEditing(true);
  //   console.log("pid",packageId,editPackageId);
  //   setEditPackageId(packageId);
  //   console.log("pid2",packageId,editPackageId);
    
  // }
  return (
    <div className=" w-[100%] min-h-[100vh] flex flex-col items-center">
      <h2 className="text-4xl pt-10 font-bold text-center text-primaryPeach mb-6">
        Add Packages
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-darkGray/30 p-5 rounded-lg w-[80%]"
      >
        {/* Package Name */}
        <div className="flex flex-col mb-4">
          <label className="text-primaryPeach font-semibold mb-2">
            Package Name:
          </label>
          <input
            type="text"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            className="p-3 rounded-md bg-gray-50/20 outline-none focus:border-pink-500"
            placeholder="Enter package name"
          />
        </div>

        {/* Package Price */}
        <div className="flex flex-col mb-4">
          <label className="text-primaryPeach font-semibold mb-2">
            Package Price:
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPackagePrice(e.target.value)}
            className="p-3 rounded-md bg-gray-50/20 outline-none focus:border-pink-500"
            placeholder="Enter package price"
          />
        </div>

        {/* Items */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4 text-primaryPeach">
            Items
          </h3>
          {items.map((item, index) => (
            <div key={index} className="flex items-center mb-4">
              <input
                type="text"
                value={item.itemName}
                onChange={(e) =>
                  handleItemChange(index, "itemName", e.target.value)
                }
                className="p-2 mr-4 rounded-md bg-gray-50/20 outline-none focus:border-pink-500"
                placeholder="Item name"
              />
              <input
                type="number"
                value={item.itemQuantity}
                onChange={(e) =>
                  handleItemChange(index, "itemQuantity", e.target.value)
                }
                className="p-2 rounded-md bg-gray-50/20 outline-none focus:border-pink-500"
                placeholder="Item Quantity"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddItem}
            className="py-2 px-4 bg-primaryPeach text-white font-semibold rounded-md"
          >
            Add Another Item
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-primaryPeach text-white font-semibold rounded-md transition duration-200"
        >
          Submit Package
        </button>
      </form>
      <ToastContainer
        style={{ zIndex: 9999 }} // Adjust the z-index as needed
      />
        {/* {currentPackage.length > 0 && <ShowPackage currentPackage={currentPackage} onDeletePackage={handleDeletePackage} onUpdatePackage={handleEdit}/>} */}
        {currentPackage.length > 0 && <ShowPackage currentPackage={currentPackage} onDeletePackage={handleDeletePackage}/>}


    </div>
  );
};

export default AddPackages;
