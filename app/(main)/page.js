"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Hero from "../../components/Hero";
import Grid from "@/components/Grid";
import { useSelector } from "react-redux";

export default function Home() {
  const isLandscape = useSelector((state) => state.screen.isLandscape);

  // Define your slides here
  const slides = [
    {
      img: "/assets/images/homePage/inJustice.jpg",
      title: "Pakistan & Justice",
      text: "Pakistan has a tumultuous relationship with justice. Across its history, the Justice system has been weaponized and abused by the strong against the weak. Our platform is at the forefront to change this reality, by empowering individuals with accessible legal knowledge and resources.",
    },
    {
      img: "/assets/images/homePage/library.jpg", // replace with another image
      title: "Access to Legal Knowledge",
      text: "Millions in Pakistan lack access to basic legal knowledge. We are working to bridge this gap, ensuring that everyone can understand their rights and navigate the justice system with confidence.",
    },
    {
      img: "/assets/images/homePage/empower.webp", // replace with another image
      title: "Knowing you Legal Rights",
      text: "Empowerment comes from awareness. By making legal information accessible, we help individuals defend their rights and demand accountability from institutions.",
    },
  ];

  // Slider state
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <main>
      <Hero className="relative z-0" />

      <div
        className={`relative bg-gradient-to-b from-white/0 to-black w-full h-[8vh]
        ${isLandscape ? "mt-[-28px]" : "mt-[-60px]"}  xl:mt-[-45px] 2xl:mt-[-80px] z-[1]`}
      ></div>

      {/* Slider Wrapper */}
      <div className="relative w-full h-[80vh] overflow-hidden bg-black">
        <div
          className="flex transition-transform duration-1000 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row justify-center items-center gap-8 w-full flex-shrink-0 px-6 h-full"
            >
              {/* Image on Left */}
              <div className="relative w-full md:w-1/2 h-2/3 md:h-2/3">
                <Image
                  src={slide.img}
                  alt={slide.title}
                  fill
                  className="object-cover rounded-lg shadow-lg"
                  priority={i === 0}
                />
              </div>

              {/* Text on Right */}
              <div className="md:w-1/2 text-center md:text-left space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                  {slide.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                currentIndex === i
                  ? "bg-purple-500 scale-125"
                  : "bg-gray-500 hover:bg-gray-400"
              }`}
            ></button>
          ))}
        </div>
      </div>

      <div
        className={`relative bg-gradient-to-t from-white/0 to-black w-full h-[8vh]
        ${isLandscape ? "mb-[-10px]" : "mb-[-23px]"} xl:mb-[-15px] 2xl:mb-[-80px] z-[1]`}
      ></div>

      <Grid className="relative z-0" />
    </main>
  );
}
