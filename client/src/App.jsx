import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Home from "./pages/Home";

import Registration from "./pages/Registration";
import Cookies from "js-cookie";
import VerifyAccount from "./components/VerifyAccount";
import Profile from "./pages/Profile";
import Payment from "./components/Payment";

import Panel from "./pages/Panel";
import AddServices from "./components/Panel/AddServices";
import MyServices from "./components/Panel/MyServices";
import Vendor from "./components/Vendor";
import AddVenue from "./components/Panel/AddVenue";
import AddSubVenue from "./components/Panel/AddSubVenue";
import Venues from "./components/Panel/Venues";
import Cities from "./components/Panel/Cities";
import Images from "./components/Panel/Images";
import Cart from "./pages/Cart";

import PasswordReset from "./components/PasswordReset";

import Service from "./components/Panel/Service";

import { Navbar } from "./components";
import History from "./components/Panel/History";
import AddCities from "./components/Panel/AddCities";
import CustomDatePicker from "./components/CustomDatePicker";

function App() {
  const [isVisible, setIsVisible] = useState(true);

  const isAuthenticated = () => {
    return !!Cookies.get("accessToken"); // Check if user is authenticated
  };

  return (
    <Router>
      {/* {!isVisible && <Navbar/>} */}
      <div>
        <Routes>
          {isVisible ? (
            <Route
              path="/"
              element={<LandingPage setIsVisible={setIsVisible} />}
            />
          ) : (
            <Route path="/" element={<Home />} />
          )}
          {isAuthenticated() ? (
            1
          ) : (
            // <Route path="/profile" element={<Profile />} />
            <>
              <Route path="/auth/signup" element={<Signup />} />
              <Route path="/auth/signin" element={<Signin />} />
              <Route path="/auth/verify" element={<VerifyAccount />} />

              <Route path="/auth/reset-password" element={<PasswordReset />} />
            </>
          )}

          <Route element={<Panel />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/panel/add-services" element={<AddServices />} />
            <Route path="/panel/my-services" element={<MyServices />} />
            <Route path="/panel/history" element={<History />} />
            <Route path="/panel/add-venue" element={<AddVenue />} />
            <Route path="/panel/venues" element={<Venues />} />
            <Route path="/panel/add-sub-venues" element={<AddSubVenue />} />
            <Route path="/panel/add-city" element={<AddCities />} />
            <Route path="/panel/cities" element={<Cities />} />
            <Route path="/panel/addImage" element={<Images />} />
          </Route>

          {/* <Route path="/profile" element={<Profile />} /> */}
          <Route path="/vendor/:vendorId" element={<Vendor />} />

          {/*           <Route path="/caterer" element={<Caterer />} />
          <Route path="/decorator" element={<Decorator />} />
          <Route path="/photographer" element={<Photographer />} /> */}
          <Route path="/dateSelector" element={<CustomDatePicker />}/>
          <Route path="/registration" element={<Registration />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
