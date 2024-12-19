import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "tailwindcss/tailwind.css";
import { setStartDate, setEndDate } from "../features/date/dateSlice.js";

const CustomDatePicker = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { startDate, endDate } = useSelector((state) => state.date);

  const handleConfirmClick = () => {
    navigate("/registration");
  };

  // Inline styles for the custom date picker
  const datePickerStyles = {
    container: {
      position: 'relative',
    },
    header: {
      backgroundColor: '#3a3a3a', // Header background
      color: '#e5e5e5', // Header text color
      borderBottom: '2px solid #4a4a4a', // Border bottom
    },
    day: {
      borderRadius: '0.5rem',
      color: '#e5e5e5',
    },
    daySelected: {
      backgroundColor: '#6b21a8', // Selected day background
      color: '#ffffff', // Selected day text color
    },
    dayInRange: {
      backgroundColor: '#4a4a4a', // In-range day background
    },
    inputContainer: {
      display: 'flex',
    },
    input: {
      backgroundColor: '#3a3a3a', // Input background color
      color: '#e5e5e5', // Input text color
      border: '1px solid #4a4a4a', // Input border color
      padding: '0.5rem', // Padding
      borderRadius: '0.5rem', // Rounded corners
    },
    inputFocus: {
      borderColor: '#6b21a8', // Input border color on focus
    },
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-violet-900 to-indigo-900">
      <Modal
        isOpen={true}
        className="bg-gray-800 p-8 rounded-lg shadow-2xl max-w-lg mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
        ariaHideApp={false} // Avoids app element error
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Select a Date Range
        </h2>
        <div className="flex justify-center mb-4">
          <DatePicker
            selected={startDate}
            onChange={(dates) => {
              const [start, end] = dates;
              dispatch(setStartDate(start));
              dispatch(setEndDate(end));
            }}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
              <div style={datePickerStyles.header} className="flex justify-between">
                <button onClick={decreaseMonth}>{"<"}</button>
                <span>{date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                <button onClick={increaseMonth}>{">"}</button>
              </div>
            )}
            calendarClassName="custom-calendar"
            dayClassName={(date) => {
              let className = 'custom-day';
              if (date.getTime() === startDate?.getTime() || date.getTime() === endDate?.getTime()) {
                className += ' custom-day-selected';
              }
              return className;
            }}
            dayClassNameInRange="custom-day-in-range"
            className="custom-datepicker"
          />
        </div>
        <div className="mt-6 flex justify-center">
          <button
            className="bg-indigo-500 text-white px-5 py-2 rounded-md hover:bg-indigo-600 transition duration-300 ease-in-out"
            onClick={handleConfirmClick}
          >
            Confirm
          </button>
        </div>
      </Modal>
      <style>
        {`
          .custom-calendar {
            border-radius: 0.5rem;
            border: 2px solid #4a4a4a;
            background-color: #2d2d2d;
            color: #e5e5e5;
          }
          .custom-day {
            border-radius: 0.5rem;
            color: #e5e5e5;
          }
          .custom-day-selected {
            background-color: #6b21a8;
            color: #ffffff;
          }
          .custom-day-in-range {
            background-color: #4a4a4a;
          }
          .custom-datepicker {
            background-color: #3a3a3a;
            color: #e5e5e5;
            border: 1px solid #4a4a4a;
            padding: 0.5rem;
            border-radius: 0.5rem;
          }
          .custom-datepicker:focus {
            border-color: #6b21a8;
          }
        `}
      </style>
    </div>
  );
};

export default CustomDatePicker;
