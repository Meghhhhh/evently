import React, { useState } from 'react';
import Service from './Services/service';
import axios from 'axios';

import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Vendor = () => {
  const [vendor, setVendor] = useState();
  const { vendorId } = useParams();
  useEffect(() => {
    const getCatererDetails = async () => {
      try {
        const catererDetails = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/vendor/getVendorDetails`,
          { vendorId: vendorId },
        );
        console.log(catererDetails);
        if (catererDetails.data.statusCode <= 200)
          setVendor(catererDetails?.data?.data?.data);
        console.log(vendor?.gallery);
      } catch (error) {
        console.error('Error fetching caterer details:', error);
      }
    };
    getCatererDetails();
  }, [vendorId]);
  return (
    <div className="w-full bg-primaryBlack text-lightGray h-full flex justify-center items-center pt-10">
      <Service
        gallery={vendor?.gallery}
        serviceName={vendor?.serviceName}
        location={vendor?.location}
        // contact={vendor?.contact}
        // rating={vendor?.rating}
        about={vendor?.about}
        packages={vendor?.packages}
        booking={vendor?.booking}
        cancellation={vendor?.cancellation}
        terms={vendor?.terms}
        singleItems={vendor?.singleItems}
        addOns={vendor?.addOns}
      />
    </div>
  );
};

export default Vendor;
