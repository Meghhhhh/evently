import React from "react";

const Footer = () => {
  return (
    <footer className="py-8 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0 md:w-[60%]">
            <h3 className="text-2xl font-bold ">Event toolkit</h3>
            <p className="text-gray-400 mt-2">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nulla molestiae eveniet est eum deserunt neque, culpa vero similique voluptate eos ab asperiores nesciunt voluptatem dicta ut quaerat corrupti debitis magni fugiat dolorum tempore expedita!
            </p>
          </div>
          <div className="mb-6 md:mb-0">
            <h4 className="text-xl font-bold ">Contact Us</h4>
            <p className="text-gray-400 mt-2">Email: info@exploreindia.com</p>
            <p className="text-gray-400">Phone: +91 123-456-7890</p>
            <p className="text-gray-400 mt-2">
              Address: 123, Explore India Street, New Delhi, India
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-white pt-4 text-center">
          <p className="text-gray-400">
            © 2024 Event Tolkit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
