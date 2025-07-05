"use client";
import { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Building, Scale, Building2 } from "lucide-react";
import CopyButton from "@/components/CopyButton";

export default function CourtsPage() {
    const [courts, setCourts] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    useEffect(() => {
        fetchCourts();
    }, [selectedCity]);

    const fetchCourts = async () => {
        try {
            const res = await fetch(`/api/courts${selectedCity ? `?city=${selectedCity}` : ""}`);
            const data = await res.json();
            if (data.success) {
                setCourts(data.courts);
                if (!selectedCity) {
                    const uniqueCities = [...new Set(data.courts.map((c) => c.city))].sort();
                    setCities(uniqueCities);
                }
            }
        } catch (err) {
            console.error("Failed to fetch courts:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black text-white px-4 py-10 overflow-x-hidden">
            <h1 className="text-4xl font-bold text-center mb-10 text-purple-100 tracking-wide">
                🏛️ Pakistan Court Directory
            </h1>

            <div className="flex justify-center mb-8">
                <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-gray-800 text-white border border-purple-500 rounded-lg px-5 py-3 text-lg max-w-full"
                >
                    <option value="">All Cities</option>
                    {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
                {courts.map((court) => (
                    <div
                        key={court.id}
                        className="w-full pt-0 pr-3 lg:pr-3 overflow-auto bg-gradient-to-br from-purple-900/40 via-gray-800/30 to-purple-950/60 border border-purple-700 p-6 backdrop-blur-md shadow-lg hover:shadow-purple-700/50 transition-all"
                    >
                        <p className="text-[10px] pt-2 pl-[282px] lg:pl-[302px] opacity-55">{court.type}</p>
                        <div className="mb-3">
                            <h2 className="text-xl font-semibold text-amber-300 tracking-wide break-words">
                                <Scale className="inline-block w-5 h-5 mr-2 mb-1 text-purple-400" />
                                {court.courtName}
                            </h2>
                        </div>

                        <div className="space-y-1 text-sm text-gray-300">
                            <p>
                                <MapPin className="inline-block w-4 h-4 mr-1 text-red-500" />
                                {court.address}
                            </p>
                            <p>
                                <Building className="inline-block w-4 h-5 mr-2 mb-1 text-purple-400" />
                                {/* <span className="text-purple-300 font-medium">City:</span>  */}
                                {court.city}
                            </p>

                            {court.contact && typeof court.contact === "string" ? (
                                <p>
                                    <Phone className="inline-block w-4 h-4 mr-1 text-purple-300" />
                                    {court.contact}
                                </p>
                            ) : (
                                <>
                                    {court.contact?.Number && (
                                        <p className="flex items-center">
                                            <Phone className="inline-block w-4 h-4 mr-1 text-green-600" />
                                            {court.contact.Number}
                                            <CopyButton value={court.contact.Number} />
                                        </p>
                                    )}

                                    {court.contact?.Email && (
                                        <p className="flex items-center">
                                            <Mail className="inline-block w-4 h-4 mr-1 text-white" />
                                            {court.contact.Email}
                                            <CopyButton value={court.contact.Email} />
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
