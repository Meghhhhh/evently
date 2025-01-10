import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../features/user/userSlice.js';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [passwordValid, setPasswordValid] = useState('initial');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  useEffect(() => {
    const accessToken = document.cookie.split('; ').reduce((acc, current) => {
      const [key, value] = current.split('=');
      if (key === 'accessToken') {
        acc.accessToken = value; // Assign the accessToken value
      }
      return acc;
    }, {}).accessToken;

    const fetchUserDetails = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/current-user`,
          {
            accessToken,
          },
          { withCredentials: true },
        );
        const obj = response.data.data;
        dispatch(
          setUserDetails({
            _id: obj._id,
            email: obj.email,
            firstName: obj.firstName,
            lastName: obj.lastName,
            userType: obj.userType,
            contactNumber: obj.contactNumber,
          }),
        );
        setFirstName(obj.firstName || '');
        setLastName(obj.lastName || '');
        setContactNumber(obj.contactNumber || '');
      } catch (err) {
        toast.error('error fetching user details!', {
          autoClose: 1500,
          closeButton: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [dispatch]);

  const validateNewPassword = password => {
    const errors = [];
    if (!/[A-Z]/.test(password))
      errors.push('Must contain an uppercase letter.');
    if (!/[a-z]/.test(password))
      errors.push('Must contain a lowercase letter.');
    if (!/[0-9]/.test(password)) errors.push('Must contain a number.');
    if (!/[!@#$%^&*]/.test(password))
      errors.push('Must contain a special character.');
    if (password.length < 8) errors.push('Must be at least 8 characters long.');

    setPasswordErrors(errors);
    setPasswordValid(errors.length === 0 ? true : false);
  };

  const handleChangePassword = async e => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.info('New password and confirm password do not match.', {
        autoClose: 1500,
        closeButton: false,
      });
      return;
    }
    if (newPassword === currentPassword) {
      toast.info('New password and Old password must be different.', {
        autoClose: 1500,
        closeButton: false,
      });
      return;
    }
    if (!passwordValid) {
      toast.info('New password does not meet the requirements.', {
        autoClose: 1500,
        closeButton: false,
      });
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/change-password`,
        {
          oldPassword: currentPassword,
          newPassword,
        },
        { withCredentials: true },
      );
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password changed successfully!', {
        autoClose: 1500,
        closeButton: false,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error changing password.', {
        autoClose: 1500,
        closeButton: false,
      });
    }
  };

  const handleUpdateAccountDetails = async e => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/update-account`,
        {
          firstName,
          lastName,
          contactNumber,
        },
        { withCredentials: true },
      );
      const obj = response.data.data;
      dispatch(
        setUserDetails({
          _id: obj._id,
          email: obj.email,
          firstName: obj.firstName,
          lastName: obj.lastName,
          userType: obj.userType,
          contactNumber: obj.contactNumber,
        }),
      );
      toast.success('Account details updated successfully!', {
        autoClose: 1500,
        closeButton: false,
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Error updating account details.',
        {
          autoClose: 1500,
          closeButton: false,
        },
      );
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-[100%] min-h-[100vh] flex items-center justify-center ">
      <div className="w-full p-8">
        <form onSubmit={handleUpdateAccountDetails}>
          <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1 mb-4">
            <div>
              <label className="block">First Name:</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded-md bg-transparent outline-none"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className="block">Last Name:</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded-md bg-transparent outline-none"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block">Communication Email address:</label>
            <input
              type="email"
              className="w-full mt-1 p-2 border rounded-md bg-transparent outline-none"
              value={user?.email || ''}
              readOnly
            />
          </div>

          <div>
            <label className="block">Phone Number:</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded-md bg-transparent outline-none"
              value={contactNumber}
              onChange={e => setContactNumber(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="p-2 bg-[#FF5364] hover:bg-[#FF5364]/80 text-white rounded-md mt-4"
          >
            Update Account Details
          </button>
        </form>
        <div>
          <h2 className="text-lg font-semibold py-2">Change Password</h2>
          <form onSubmit={handleChangePassword}>
            <div className="mb-4">
              <label className="block">Current Password:</label>
              <input
                type="password"
                className="w-full mt-1 p-2 border rounded-md bg-transparent outline-none"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block">New Password:</label>
              <input
                type="password"
                className={`w-full mt-1 p-2 border rounded-md bg-transparent outline-none ${
                  passwordValid === 'initial'
                    ? ''
                    : passwordValid
                    ? 'border-green-500'
                    : 'border-red'
                }`}
                value={newPassword}
                onChange={e => {
                  setNewPassword(e.target.value);
                  validateNewPassword(e.target.value);
                }}
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
            </div>
            <div className="mb-2">
              <label className="block">Confirm New Password:</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full mt-1 p-2 border rounded-md bg-transparent outline-none"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-end px-2 text-sm mb-2">
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
              className="p-2 bg-[#FF5364] hover:bg-[#FF5364]/80 text-white rounded-md"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;
