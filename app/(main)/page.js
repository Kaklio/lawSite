import Image from "next/image";
import Hero from "../../components/Hero";
import Grid from "@/components/Grid";


export default function Home() {
  return (
    <main>
    <Hero/>
      <div className="filler w-full h-[5vh] bg-gray-900"></div>
      <Grid/>
    </main>
  );
}
