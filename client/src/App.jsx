import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";

// Pages and Components
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
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
import History from "./components/Panel/History";
import AddCities from "./components/Panel/AddCities";
import CustomDatePicker from "./components/CustomDatePicker";
import { Navbar } from "./components";

function App() {
  const location = useLocation();

  const isAuthenticated = () => {
    return !!Cookies.get("accessToken"); // Check if user is authenticated
  };

  const showNavbar = ![
    "/",
    "/dateSelector",
    "/profile",
    "/auth/signin",
    "/auth/signup",
    "/auth/verify",
    "/auth/reset-password",
    "/cart",
  ].includes(location.pathname); // Paths where Navbar should be hidden

  return (
    <>
      {showNavbar && <Navbar />} {/* Conditionally render Navbar */}
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />

          {/* Auth Routes */}
          {isAuthenticated() ? (
            <>
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
            </>
          ) : (
            <>
              <Route path="/auth/signup" element={<Signup />} />
              <Route path="/auth/signin" element={<Signin />} />
              <Route path="/auth/verify" element={<VerifyAccount />} />
              <Route path="/auth/reset-password" element={<PasswordReset />} />
            </>
          )}

          <Route path="/vendor/:vendorId" element={<Vendor />} />
          <Route path="/dateSelector" element={<CustomDatePicker />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/cart" element={<Cart />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
