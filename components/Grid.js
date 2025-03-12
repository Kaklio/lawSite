"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

const services = [
  { name: "Law Books", href: "/lawBooks.png", link: "/lawBooks" },
  { name: "Case Study", href: "/caseStudy.jpg", link: "/lawBooks" },
  { name: "Precedents", href: "/precedents.jpg", link: "/lawBooks" },
  { name: "Case Profile", href: "/caseProfile.webp", link: "/lawBooks" },
  { name: "Criminal Record", href: "/criminalRecord.webp", link: "/lawBooks" },
  { name: "Find a lawyer", href: "/lawyer.jpg", link: "/lawBooks" },
  { name: "Courts", href: "/court.jpg", link: "/lawBooks" },
  { name: "Judges", href: "/judge.jpg", link: "/lawBooks" },
  { name: "Search Laws", href: "/search.webp", link: "/lawBooks" }
];

export default function Grid() {
  const [isVisible, setIsVisible] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 } // Trigger when 20% of the element is visible
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => {
      if (gridRef.current) {
        observer.unobserve(gridRef.current);
      }
    };
  }, []);

  return (
    <div  
    ref={gridRef} 
      className="relative flex flex-col items-center justify-center bg-purple-900 h-[1200px] w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/images/blindJusticelady.png')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      <h2 className="relative text-5xl font-light text-white font-[Domine] md:text-3xl">
        Sentinel Services
      </h2>

      {/* Services Grid */} 
      <div  className={ `relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 transition-all duration-1000 ease-out 
      ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        {/* {console.log(isVisible)} */}
        {services.map((service, index) => (
          <Link key={index} href={service.link} onClick={() => console.log("CLICKED!!")}>
            <div
              className="group relative  bg-black/95 border border-black w-[25vw] h-[15vw] text-white text-xl
              cursor-pointer overflow-hidden transition-transform duration-1000 hover:scale-105 bg-contain"
              style={{ backgroundImage: `url('/assets/images/${service.href}')` }}
            >
              <h3 className=" relative transition-all duration-700 opacity-30 scale-100 origin-left group-hover:opacity-100 group-hover:translate-x-[10px] group-hover:translate-y-[10px] group-hover:scale-[1.5] z-10">
                {service.name}
              </h3>

              {/* Dark Hover Effect */}
              <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/40 z-1"></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
