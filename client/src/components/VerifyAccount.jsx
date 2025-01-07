import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyAccount = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [errorMessage, setErrorMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(30);
  const navigate = useNavigate();

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (isNaN(value) || value === '') return;

    setOtp([...otp.map((d, idx) => (idx === index ? value : d))]);

    if (e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();

      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);

      if (index > 0) {
        document.querySelectorAll('input[name="otp"]')[index - 1].focus();
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const otpCode = otp.join('');

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/verify`,
        {
          code: otpCode,
        },
        {
          withCredentials: true,
        },
      );
      toast.success('User Verified successfully!', {
        autoClose: 1500,
        closeButton: false,
      });
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      toast.error('Verification failed!', {
        autoClose: 1500,
        closeButton: false,
      });
      setErrorMessage('Verification failed. Please try again.');
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/resend-otp`,
        {},
        { withCredentials: true },
      );
      toast.success('OTP resent successfully!', {
        autoClose: 1500,
        closeButton: false,
      });
      setResendCooldown(30);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP', {
        autoClose: 1500,
        closeButton: false,
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Verify your account</h1>
          <p className="mt-2 text-sm">
            Enter the 6-digit code sent to your email.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-center">
            {otp.map((data, index) => (
              <input
                className="m-2 h-10 w-10 text-center text-lg border rounded bg-transparent outline-none"
                type="text"
                name="otp"
                maxLength="1"
                key={index}
                value={data}
                onChange={e => handleChange(e, index)}
                onKeyDown={e => handleKeyDown(e, index)}
                onFocus={e => e.target.select()}
              />
            ))}
          </div>
          <p className="text-center text-red">{errorMessage}</p>
          <button
            type="submit"
            className="w-full bg-[#FF5364] hover:bg-[#FF5364]/80 text-white p-2 font-bold rounded-md"
          >
            Verify
          </button>
        </form>
        <div className="text-center text-sm">
          Didn’t receive the code?
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className={`text-[#FF5364] hover:underline px-1 ${
              resendCooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Resend {resendCooldown > 0 ? `${resendCooldown}s` : ''}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default VerifyAccount;
