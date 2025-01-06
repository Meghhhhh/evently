import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';

const Signup = () => {
  const features = [
    {
      id: 1,
      bgClass: 'bg-guest-list',
      text: 'Manage guest lists with ease and track RSVPs in real-time.',
    },
    {
      id: 2,
      bgClass: 'bg-budget',
      text: 'Stay on budget with our powerful expense tracking tools.',
    },
    {
      id: 3,
      bgClass: 'bg-task',
      text: 'Assign and track tasks to ensure nothing is missed.',
    },
    {
      id: 4,
      bgClass: 'bg-vendor',
      text: 'Coordinate with vendors and manage contracts effortlessly.',
    },
    {
      id: 5,
      bgClass: 'bg-invite',
      text: 'Design and distribute beautiful invitations with our templates.',
    },
    {
      id: 6,
      bgClass: 'bg-seating',
      text: 'Create interactive seating arrangements with ease.',
    },
  ];

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactNumber: '',
  });

  const [passwordValid, setPasswordValid] = useState('initial'); // Start with "initial" state
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isVendor, setIsVendor] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const validatePassword = password => {
      const errors = [];
      if (!/[A-Z]/.test(password))
        errors.push('Must contain an uppercase letter.');
      if (!/[a-z]/.test(password))
        errors.push('Must contain a lowercase letter.');
      if (!/[0-9]/.test(password)) errors.push('Must contain a number.');
      if (!/[!@#$%^&*]/.test(password))
        errors.push('Must contain a special character.');
      if (password.length < 8)
        errors.push('Must be at least 8 characters long.');

      setPasswordErrors(errors);
      setPasswordValid(errors.length === 0 ? true : false);
    };

    if (formData.password !== '') {
      validatePassword(formData.password);
    }
  }, [formData.password]);

  const handleChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));

    // Reset passwordValid to "initial" if the password field is empty
    if (id === 'password' && value === '') {
      setPasswordValid('initial');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!passwordValid) {
      toast.error('Password does not meet the requirements');
      return;
    }

    if (!/^\d{10}$/.test(formData.contactNumber)) {
      toast.error('Contact number must be exactly 10 digits');
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/register`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          contactNumber: formData.contactNumber,
          userType: isVendor ? 'vendor' : 'ordinary',
        },
      );
      const { accessToken, refreshToken } = response.data.data;

      Cookies.set('accessToken', accessToken, {
        expires: 1,
        secure: true,
        sameSite: 'Strict',
      });
      Cookies.set('refreshToken', refreshToken, {
        expires: 10,
        secure: true,
        sameSite: 'Strict',
      });

      toast.success('User registered successfully!', {
        autoClose: 1500,
        closeButton: false,
      });
      setTimeout(() => {
        navigate('/auth/verify');
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred');
      console.log(err);
    }
  };

  return (
    <div className="w-full flex flex-row max-[990px]:flex-col min-h-screen items-center justify-center p-5">
      <div className="w-2/3 text-center font-bold text-lg p-6 max-[990px]:w-full">
        <h1 className="w-full p-4 text-2xl">
          Sign up &amp; start planning your Perfect Event!
        </h1>
        <h3 className="font-semibold text-xl">Why sign up?</h3>

        <div className="flex flex-wrap mt-4">
          {features.map(feature => (
            <div
              key={feature.id}
              className="flex flex-col items-center justify-center text-center w-1/3 max-[990px]:w-1/2 max-[400px]:w-full p-2"
            >
              <div
                className={`w-28 h-28 border-2 ${feature.bgClass} bg-center bg-no-repeat `}
              ></div>
              <p className="text-sm">{feature.text}</p>
            </div>
          ))}
          <h4 className="w-full text-lg font-semibold mt-4">
            And much more...!
          </h4>
        </div>
      </div>
      <div className="w-1/3 text-center p-6 max-[990px]:w-full">
        <form onSubmit={handleSubmit}>
          <fieldset className="border-2 border-gray-300 rounded-lg mb-4">
            <legend className="text-left px-1">First Name</legend>

            <input
              type="text"
              id="firstName"
              className="p-2 w-full border-none outline-none bg-transparent rounded-md"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </fieldset>

          <fieldset className="border-2 border-gray-300 rounded-lg mb-4">
            <legend className="text-left px-1">Last Name</legend>

            <input
              type="text"
              id="lastName"
              className="p-2 w-full border-none outline-none bg-transparent rounded-md"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </fieldset>

          <fieldset className="border-2 border-gray-300 rounded-lg mb-4">
            <legend className="text-left px-1">Email</legend>

            <input
              type="email"
              id="email"
              className="p-2 w-full border-none outline-none bg-transparent rounded-md"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </fieldset>
          <fieldset className="border-2 border-gray-300 rounded-lg mb-4">
            <legend className="text-left px-1">Contact Number</legend>
            <input
              type="text"
              id="contactNumber"
              className="p-2 w-full border-none outline-none bg-transparent rounded-md"
              placeholder="Enter your contact number"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
          </fieldset>

          {/* {isVendor && (
            <fieldset className="border-2 border-gray-300 rounded-lg mb-4">
              <legend className="text-left px-1">Vendor Type</legend>
              <select
                id="userType"
                className="p-2 w-full border-none outline-none bg-transparent rounded-md"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                required
              >
                <option value="">Select Type</option>
                <option value="caterer">Caterer</option>
                <option value="decorator">Decorator</option>
                <option value="photographer">Photographer</option>
              </select>
            </fieldset>
          )} */}

          <fieldset
            className={`border-2 rounded-lg mb-4 ${
              passwordValid === 'initial'
                ? 'border-gray-300'
                : passwordValid
                ? 'border-green-500'
                : 'border-red-500'
            }`}
          >
            <legend className="text-left px-1">Password</legend>

            <input
              type="password"
              id="password"
              className={`p-2 w-full border-none outline-none bg-transparent rounded-md`}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {passwordValid !== 'initial' && !passwordValid && (
              <div className="text-left text-red text-sm m-2">
                <ul>
                  {passwordErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </fieldset>

          <fieldset className="border-2 border-gray-300 rounded-lg mb-4">
            <legend className="text-left px-1">Confirm Password</legend>

            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              className="p-2 w-full border-none outline-none bg-transparent rounded-md"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </fieldset>

          <div className="flex items-center justify-end mb-4 px-2 text-sm">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(prev => !prev)}
            />
            <label htmlFor="showPassword" className="ml-2">
              Show Password
            </label>
          </div>
          <div className="flex items-center justify-center mb-4 px-2 text-sm">
            <input
              type="checkbox"
              id="isVendor"
              checked={isVendor}
              onChange={() => setIsVendor(prev => !prev)}
            />
            <label htmlFor="isVendor" className="ml-2">
              Sign up as a vendor
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF5364] hover:bg-[#FF5364]/80 text-white p-2 rounded-md mt-4"
            disabled={passwordValid !== true}
          >
            Sign Up
          </button>

          <div className="mt-4 max-[600px]:mb-20 text-sm">
            Already have an account?
            <Link
              to="/auth/signin"
              className="text-[#FF5364] hover:underline px-1"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
