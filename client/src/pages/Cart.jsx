import React from 'react';
import i1 from '../assets/images/download.jpeg';

const Cart = () => { 
  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-extrabold text-white mb-8 text-center">Your Cart</h1>

      <div className="bg-gray-800 shadow-lg rounded-lg p-6 flex hover:bg-gray-700 transition duration-300">
        <div className="w-1/3">
          <img
            src={i1}
            alt="Agra Nagar Ki Haveli"
            className="w-full h-auto rounded-lg object-cover transform hover:scale-105 transition duration-300"
          />
        </div>
        <div className="w-2/3 pl-6">
          <p className="text-xl font-bold text-white">AGRA NAGAR KI HAVELI</p>
          <p className="text-gray-400">Price: <span className="text-lg font-semibold text-mauve">$500</span></p>
        </div>
      </div>

      <div className="bg-gray-800 shadow-lg rounded-lg p-6 mt-6 flex hover:bg-gray-700 transition duration-300">
        <div className="w-1/3">
          <img
            src={i1}
            alt="Caterer c1"
            className="w-full h-auto rounded-lg object-cover transform hover:scale-105 transition duration-300"
          />
        </div>
        <div className="w-2/3 pl-6">
          <p className="text-xl font-bold text-white">Caterer c1</p>
          <div className="text-gray-400 space-y-1">
            <p className="font-semibold">Items:</p>
            <p>Pizza: $50</p>
            <p>Pizza2: $50</p>
            <p>Pizza3: $50</p>
            <p>Pizza4: $50</p>
            <p>Package: $400</p>
            <p className="font-bold text-lg text-mauve">Total: $600</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 shadow-lg rounded-lg p-6 mt-6 flex hover:bg-gray-700 transition duration-300">
        <div className="w-1/3">
          <img
            src={i1}
            alt="Decorator d1"
            className="w-full h-auto rounded-lg object-cover transform hover:scale-105 transition duration-300"
          />
        </div>
        <div className="w-2/3 pl-6">
          <p className="text-xl font-bold text-white">Decorator d1</p>
          <div className="text-gray-400 space-y-1">
            <p className="font-semibold">Items:</p>
            <p>Flower: $50</p>
            <p>Flower2: $50</p>
            <p>Flower3: $50</p>
            <p>Flower4: $50</p>
            <p>Package: $400</p>
            <p className="font-bold text-lg text-mauve">Total: $600</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 shadow-lg rounded-lg p-6 mt-6 flex hover:bg-gray-700 transition duration-300">
        <div className="w-1/3">
          <img
            src={i1}
            alt="Photographer p1"
            className="w-full h-auto rounded-lg object-cover transform hover:scale-105 transition duration-300"
          />
        </div>
        <div className="w-2/3 pl-6">
          <p className="text-xl font-bold text-white">Photographer p1</p>
          <div className="text-gray-400 space-y-1">
            <p className="font-semibold">Items:</p>
            <p>Photo: $50</p>
            <p>Photo2: $50</p>
            <p>Photo3: $50</p>
            <p>Photo4: $50</p>
            <p>Package: $400</p>
            <p className="font-bold text-lg text-mauve">Total: $600</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
