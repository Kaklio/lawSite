import Image from "next/image";
import Hero from "../../components/Hero";
import Grid from "@/components/Grid";


export default function Home() {
  return (
   <main className="">
<Hero className="relative z-0"/>
 {/* <div className="relative bg-gradient-to-b from-white/0 via-black to-white/0 w-full h-[50vh] my-[-200px] z-[50]"></div> */}
 
 <div className="relative bg-gradient-to-b from-white/0 to-black w-full h-[8vh] xl:mt-[-45px] 2xl:mt-[-200px] z-[1]"></div>
<div className="flex justify-center items-center w-full h-[80vh] bg-black text-amber-50 text-5xl">SOME EYE CANDY NEEDED HERE</div>
 <div className="relative bg-gradient-to-t from-white/0 to-black w-full h-[8vh] xl:mb-[-15px] 2xl:mb-[-200px] z-[1]"></div>

      <Grid className="relative z-0"/>
</main>
);
}
