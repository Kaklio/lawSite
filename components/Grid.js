"use client";

import { useEffect, useState, useRef} from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";


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
<div className={`relative grid grid-cols-2 xl:grid-cols-3 gap-4 transition-all duration-1000 ease-out 
  ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
  
  {services.map((service, index) => (
    <Link key={index} href={service.link} onClick={() => console.log("CLICKED!!")}>
      <div
        className={`group xl:relative bg-black/95 border border-black text-white text-xl cursor-pointer overflow-hidden 
        xl:w-[320px] xl:h-[192px] 2xl:w-[460px] 2xl:h-[292px]
        transition-transform duration-1000 hover:scale-x-105 hover:scale-y-107 bg-cover bg-no-repeat
        ${index === 8 ? "w-[270px] h-[178px] absolute left-[65px] xl:left-auto" : "w-[195px] h-[138px]"}`}
        style={{ backgroundImage: `url('/assets/images/${service.href}')` }}
      >
        {/* Service Name with Hover Effects */}
        <h3 className="relative transition-all duration-700 opacity-10 scale-100 translate-x-0 translate-y-0 
          origin-left z-10 group-hover:opacity-100 group-hover:scale-150 group-hover:translate-x-4 group-hover:translate-y-4">
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
