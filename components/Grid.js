"use client";

import { useEffect, useState, useRef} from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";


const services = [
  { name: "Law Books", href: "/homePage/lawBooks.png", link: "/lawBooks" },
  { name: "Legal Precedents", href: "/homePage/LegalPrecedents.jpg", link: "/lawSearch" },
  { name: "Legal Queries", href: "/homePage/LegalQueries.webp", link: "/legalQueries" },
  { name: "Case Profile", href: "/homePage/caseProfile.webp", link: "/lawBooks" },
  { name: "Criminal Record", href: "/homePage/criminalRecord.webp", link: "/CriminalRecord" },
  { name: "Find a lawyer", href: "/homePage/lawyer.jpg", link: "/lawyerSearch" },
  { name: "Courts", href: "/homePage/court.jpg", link: "/Courts" },
  { name: "Judges", href: "/homePage/judge.jpg", link: "/lawBooks" },
  { name: "Search Laws", href: "/homePage/search.webp", link: "/lawSearch" }
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
    id="services-grid" 
    ref={gridRef} 
      className="relative flex flex-col items-center justify-center bg-purple-900 h-screen w-full bg-cover bg-center bg-no-repeat"
      // style={{ backgroundImage: "url('/assets/images/homePage/blindJusticelady_OG.png')" }}
    >
  <img
   src="/assets/images/homePage/blindJusticelady_OG.png"
      alt="Background"
      className="absolute xl:h-[110%] 2xl:h-full w-screen object-fill"
    /> 

      {/* Dark Overlay */}
      <div className="absolute xl:mt-[-18px] 2xl:mt-0 xl:h-[110%] 2xl:h-full inset-0 bg-black opacity-30"></div>

      <h2 className="relative text-5xl font-light  font-[Domine] md:text-3xl text-white">
        Sentinel Services
      </h2>

{/* Services Grid */}
<div className={`relative grid grid-cols-2 xl:grid-cols-3 gap-4 transition-all duration-1000 ease-out
  ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
  
  {services.map((service, index) => (
    <Link key={index} href={service.link} onClick={() => console.log("CLICKED!!")}>
      <div
        className={`group xl:relative bg-black/95 border border-black text-white xl:text-sm 2xl:text-xl cursor-pointer overflow-hidden 
        xl:w-[250px] xl:h-[140px] 2xl:w-[410px] 2xl:h-[242px]
        transition-transform duration-1000 hover:scale-x-105 hover:scale-y-107 bg-cover bg-no-repeat
        ${index === 8 ? "w-[222px] h-[128px] absolute left-[95px] xl:left-auto" : "w-[192px] h-[118px]"}`}
        style={{ backgroundImage: `url('/assets/images/${service.href}')` }}
      >
        {/* Service Name with Hover Effects */}
        <h3 className="relative transition-all duration-700 opacity-100 lg:opacity-20 scale-100 translate-x-0 translate-y-0 
          origin-left z-10 group-hover:opacity-100 group-hover:scale-150 xl:group-hover:translate-x-2 xl:group-hover:translate-y-2 2xl:group-hover:translate-x-4 2xl:group-hover:translate-y-4">
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
