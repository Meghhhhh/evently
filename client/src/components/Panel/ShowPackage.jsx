import React from 'react'
import { MdDelete } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
const ShowPackage = ({currentPackage,onDeletePackage}) => { 
    const {vendor,_id} = useSelector((state)=>state.vendor);
    const [packages, setPackages] = useState(Array.isArray(currentPackage) ? currentPackage : [currentPackage]);
    useEffect(() => {
        console.log(currentPackage);
        setPackages(Array.isArray(currentPackage) ? currentPackage : [currentPackage]);
        console.log("packages inside show",packages);
    }, [currentPackage]);
   


  return (
    <div className=" bg-lightGray/10 w-[80%] rounded-md p-10 mt-10 flex flex-col gap-6">
        <h2 className="font-bold text-3xl text-primaryPeach ">Our Packages</h2>
        {packages.map((pkg, index) => (
          <div>
          <details key={index} className="">
            <summary className="flex gap-10 justify-between px-10 h-24 items-center bg-lightGray/40 rounded-t-xl">
              <div className="font-semibold sm:text-2xl text-md">
                {" "}
                {pkg.packageName} - {pkg.price}
              </div>
              <div className="text-sm text-darkGray">
                <strong>Package ID:</strong> {pkg.package_id}
              </div>
            </summary>
            <div className="bg-lightGray text-darkGray rounded-b-xl flex flex-col p-3 gap-4 text-lg">
              <ul>
                {pkg.items.map((detail, index) => (
                  <>
                    <li key={index} className="flex justify-between items-center px-10">
                      <span>{detail.itemName}</span>
                      <span>{detail.itemQuantity}</span>
                    </li>
                    <span className="bg-mediumGray h-[1px] w-[100%] my-1 block"></span>
                  </>
                ))}
              </ul>
            </div>
          </details>
          <div className='flex gap-5'>
              {/* <button onClick={() => onUpdatePackage(pkg.package_id,pkg.packageName,pkg.price,pkg.items)} ><AiFillEdit fontSize={23}/></button> */}
              <button onClick={() => onDeletePackage(pkg.package_id)}><MdDelete fontSize={23}/></button>
              </div>
              </div>
        ))}
      </div>
  )
}

export default ShowPackage