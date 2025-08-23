'use client';

export default function ContactPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2d0036] via-[#1a1333] to-[#1a0022] px-4 py-12">
            <div className="w-full max-w-lg bg-[#23182b] rounded-2xl shadow-2xl p-8 text-center">
                <h1 className="text-3xl font-bold text-white mb-4">Contact Us</h1>
                <p className="text-gray-300 mb-6">
                    We&apos;d love to hear from you. Reach out to us using the information below.
                </p>
                
                <div className="space-y-4 text-lg">
                    <div>
                        <h2 className="text-xl font-semibold text-white mb-1">Email Us At</h2>
                        <a 
                            href="mailto:junaidferhaj73@gmail.com" 
                            className="text-purple-400 hover:underline"
                        >
                            junaidferhaj73@gmail.com
                        </a>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-white mb-1">Sentinel Associates Customer Service</h2>
                        <p className="text-gray-300">+92-314-4314050</p>
                    </div>
                </div>
            </div>
        </main>
    );
}