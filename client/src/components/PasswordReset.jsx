import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PasswordReset = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
  });

  const [isOtpRequested, setIsOtpRequested] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [passwordValid, setPasswordValid] = useState('initial');
  const [showPassword, setShowPassword] = useState(false);

  // Password validation logic
  const validatePassword = password => {
    const errors = [];
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long.');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter.');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter.');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number.');
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain at least one special character.');
    }
    return { isValid: errors.length === 0, errors };
  };

  useEffect(() => {
    if (formData.newPassword !== '') {
      const { isValid, errors } = validatePassword(formData.newPassword);
      setPasswordErrors(errors);
      setPasswordValid(isValid);
    }
  }, [formData.newPassword]);

  const handleChange = e => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleRequestOtp = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/forgot-password/request-otp`,
        { email: formData.email },
      );
      setIsOtpRequested(true);
      toast.success('OTP sent to your email!', {
        autoClose: 1500,
        closeButton: false,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!/^\d{6}$/.test(formData.otp)) {
      toast.error('OTP must be exactly 6 digits');
      return;
    }
    if (!passwordValid || formData.newPassword.length === 0) {
      toast.error('Password does not meet the requirements');
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/forgot-password/verify-otp`,
        {
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
        },
      );

      toast.success('Password has been reset successfully!', {
        autoClose: 1500,
        closeButton: false,
      });
      setTimeout(() => {
        navigate('/auth/signin');
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md p-8 shadow-lg rounded-lg">
        <fieldset className="border-2 border-gray-300 p-4 rounded-lg">
          <legend className="text-lg font-semibold px-1">Reset Password</legend>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <div className="flex items-center max-[400px]:flex-col gap-2">
              <input
                type="email"
                id="email"
                className="p-2 w-full border rounded-md outline-none bg-transparent"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              <button
                type="button"
                className="w-1/2 text-white p-2 rounded-md bg-[#FF5364] hover:bg-[#FF5364]/80"
                onClick={handleRequestOtp}
                disabled={!formData.email}
              >
                Send OTP
              </button>
            </div>
          </div>

          {isOtpRequested && (
            <>
              <div className="mb-4">
                <label htmlFor="otp" className="block text-sm font-medium">
                  OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  className="mt-1 p-2 w-full border rounded-md outline-none bg-transparent"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={handleChange}
                />
              </div>

              <fieldset
                className={`border-2 rounded-lg mb-4 ${
                  passwordValid === 'initial'
                    ? 'border-gray-300'
                    : passwordValid
                    ? 'border-green-500'
                    : 'border'
                }`}
              >
                <legend className="text-left px-1">New Password</legend>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  className="p-2 w-full border-none outline-none bg-transparent rounded-md"
                  placeholder="Enter your new password"
                  value={formData.newPassword}
                  onChange={handleChange}
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

              <button
                type="submit"
                className="w-full text-white p-2 rounded-md mt-4 bg-[#FF5364] hover:bg-[#FF5364]/80"
                onClick={handleSubmit}
                disabled={!passwordValid}
              >
                Reset Password
              </button>
            </>
          )}
        </fieldset>
      </div>
      <ToastContainer />
    </div>
  );
};

export default PasswordReset;
