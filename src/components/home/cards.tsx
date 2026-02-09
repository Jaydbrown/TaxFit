import React from "react";
import { useState, useEffect } from "react";

export default function Cards() {
  const [isScrolling, setIsScrolling] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="p-12 bg-primary-600">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="relative bg-white p-2 bg-[url('public/images/image-copy.png')] bg-cover bg-center rounded-lg shadow-md hover:scale-105 transition-transform duration-1000 ease-in-out overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
            <div className="relative p-6 z-10">
              <h3 className="text-2xl text-white font-bold mb-4">
                Tax Planning
              </h3>
              <p className="text-white">
                Get expert help to reduce your tax and save money legally.
              </p>
            </div>
          </div>

          <div className="relative bg-white bg-[url('public/images/image-copy.png')] bg-cover bg-center p-6 rounded-lg shadow-md hover:scale-105 transition-transform duration-1000 ease-in-out overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-4">
                Tax Compliance
              </h3>
              <p className="text-white">
                Stay up to date with your tax payments and avoid penalties.
              </p>
            </div>
          </div>

          <div className="relative bg-white p-6 bg-[url('public/images/image-copy.png')] bg-cover bg-center rounded-lg shadow-md hover:scale-105 transition-transform duration-1000 ease-in-out overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-2">
                Tax Problems
              </h2>
              <p className="text-white">
                Resolve tax issues and get professional representation.
              </p>
            </div>
          </div>

          <div className="relative bg-white p-6 bg-[url('public/images/image-copy.png')] bg-cover bg-center rounded-lg shadow-md hover:scale-105 transition-transform duration-1000 ease-in-out overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
            <div className="relative z-10">
              <h3 className="text-2xl text-white font-bold mb-4">
                Business Tax Advice
              </h3>
              <p className="text-white">
                Resolve tax issues and get professional representation.
              </p>
            </div>
          </div>

          <div className="relative bg-white p-6 bg-[url('public/images/image-copy.png')] bg-cover bg-center rounded-lg shadow-md hover:scale-105 transition-transform duration-1000 ease-in-out overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
            <div className="relative z-10">
              <h3 className="text-2xl text-white font-bold mb-4">
                Business Restructuring
              </h3>
              <p className="text-white">
                Resolve tax issues and get professional representation.
              </p>
            </div>
          </div>

          <div className="relative bg-white p-6 bg-[url('public/images/image-copy.png')] bg-cover bg-center rounded-lg shadow-md hover:scale-105 transition-transform duration-1000 ease-in-out overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
            <div className="relative z-10">
              <h3 className="text-2xl text-white font-bold mb-4">
                Tax Education
              </h3>
              <p className="text-white">
                Resolve tax issues and get professional representation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
