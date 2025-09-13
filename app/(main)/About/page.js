'use client';

import Image from "next/image";

export default function AboutPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2d0036] via-[#1a1333] to-[#1a0022] px-4 py-12">
            <div className="w-full max-w-4xl bg-[#23182b] rounded-2xl shadow-2xl p-10 space-y-12">
                
                {/* Page Title */}
                <section className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">About Us</h1>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        We are committed to providing simplistic legal guidance and resources 
                        with clarity and dedication. Our mission is to make reliable legal 
                        knowledge accessible for everyone.
                    </p>
                </section>

                {/* Our Motto */}
                <section className="bg-[#2d2340] rounded-xl p-6 shadow-md">
                    <h2 className="text-2xl font-semibold text-purple-300 mb-3">We say</h2>
                    <p className="text-gray-200 leading-relaxed">
                        &ldquo;Justice. Clarity. Accessibility.&rdquo; <br />
                        We believe legal help should be accessible, approachable, and empowering. 
                        Our platform exists to bridge the gap between legal aspirants knowledge that they most require.
                    </p>
                </section>

                {/* Founder Section */}
                <section className="flex flex-col md:flex-row items-center gap-8 bg-[#2d2340] rounded-xl p-6 shadow-md">
                    <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-purple-700 shadow-lg">
                        <Image
                            src="/assets/images/CEO.jpg"
                            alt="Founder"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold text-purple-300 mb-2">Our Founder</h2>
                        <p className="text-gray-200 leading-relaxed">
                            Our Founder, Junaid Ferhaj is a visionary legal 
                            expert with driving passion for making legal information accessible
                            to everyone in Pakistan, a country where legal knowledge is often
                            clouded in complexity. He established Sentinel Associates, a platform
                            dedicated to empower individuals with the tools and insights that are required to
                            navigate legal landscape confidently and conveniently.
                        </p>
                    </div>
                </section>

                {/* Values Section */}
                <section className="grid md:grid-cols-3 gap-6">
                    <div className="bg-[#2d2340] rounded-xl p-6 shadow-md text-center">
                        <h3 className="text-xl font-semibold text-purple-300 mb-2">Justice</h3>
                        <p className="text-gray-300 text-sm">
                           Justice is blind and we make sure everyone and anyone can get it.
                        </p>
                    </div>
                    <div className="bg-[#2d2340] rounded-xl p-6 shadow-md text-center">
                        <h3 className="text-xl font-semibold text-purple-300 mb-2">Clarity</h3>
                        <p className="text-gray-300 text-sm">
                            Complex topics made simple, so that everyone can understand the law.
                        </p>
                    </div>
                    <div className="bg-[#2d2340] rounded-xl p-6 shadow-md text-center">
                        <h3 className="text-xl font-semibold text-purple-300 mb-2">Accessibility</h3>
                        <p className="text-gray-300 text-sm">
                            Legal resources available to everyone, everywhere, without barriers.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}