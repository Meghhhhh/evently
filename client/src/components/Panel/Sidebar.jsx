import React from 'react';
import SidebarLink from './SidebarLink';
import { sidebarlinks } from '../../data/SidebarLinks';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../features/user/userSlice';
const Sidebar = () => {
  const dispatch = useDispatch();
  const { userType } = useSelector(state => state.user);
  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/logout`,
        {},
        { withCredentials: true },
      );
      dispatch(logoutUser());
      toast.success('Logged out successfully!', {
        autoClose: 1500,
        closeButton: false,
      });
      setTimeout(() => {
        window.location.href = '/auth/signin';
      }, 1500);
    } catch (err) {
      toast.success(err.response?.data?.message || 'Error logging out!.', {
        autoClose: 1500,
        closeButton: false,
      });
    }
  };
  console.log(userType);
  return (
    <div className="min-w-[14%]">
      <div className="flex  text-white flex-col  h-[100%] bg-primaryPeach">
        <div className="flex flex-col">
          {sidebarlinks.map(link => {
            if (link.type && userType !== link.type) {
              return null;
            }
            return (
              <SidebarLink key={link.id} link={link} iconName={link.icon} />
            );
          })}
        </div>
        <div onClick={handleLogout} className="block p-2 cursor-pointer">
          Logout
        </div>

        {/* <div className="flex w-[15vw] text-white flex-col border-r-richblack-700 h-[100vh] fixed left-0 bg-primaryPeach/80">
      <div className="flex flex-col">
        {sidebarlinks.map((link) => {
          if (link.type && userType !== link.type) {
            return null;
          }
          return <SidebarLink key={link.id} link={link} iconName={link.icon} />;
        })}
      </div>
      <div
        onClick={handleLogout}
        className="block p-4 cursor-pointer hover:bg-primaryPeach/80"
      >
        Logout*/}
      </div>
    </div>
  );
};

export default Sidebar;
