import { connectDB } from "@/lib/db";
import Lawyer from "@/models/lawyer";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

export async function generateMetadata({ params }) {
  await connectDB();
  const lawyer = await Lawyer.findOne({ id: parseInt(params.id) }).lean();

   return {
    title: lawyer
      ? `Profile: ${lawyer.name}`
      : `Profile: Not Found`,
  };
}

export default async function LawyerProfile({ params }) {
  await connectDB();
  const lawyer = await Lawyer.findOne({ id: parseInt(params.id) }).lean();

   if (!lawyer) return <div className="p-10 text-red-600">Lawyer not found.</div>;

  return (

<>
    <Head>
  <title>Lawyer Profile: {lawyer.name}</title>
</Head>
    <div className="min-h-screen bg-stone-900 text-stone-100 px-6 py-10 font-serif animate-fadeIn">
      <div className="max-w-4xl mx-auto bg-purple-950 rounded-xl shadow-xl p-6 md:p-10 space-y-6">

        {/* Back Button */}
        <div>
          <Link
            href="/lawyerSearch"
            className="text-yellow-300 hover:text-yellow-200 underline text-lg"
          >
            ← Back to Search
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Image
            src={`/assets/images/Lawyers/${lawyer.id}.jpg`}
            alt={lawyer.name}
            width={300}
            height={300}
            className="rounded-full border-4 border-yellow-800 object-cover"
          />
          <h1 className="text-4xl font-bold">{lawyer.name}</h1>
          {lawyer.titles?.length > 0 && (
            <p className="italic text-lg text-yellow-200">
              {lawyer.titles.join(" / ")}
            </p>
          )}
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Detail icon="🏛️" label="Experience" value={lawyer.experience} />
          <Detail icon="⚖️" label="Courts" value={lawyer.courts?.join(", ")} />
          <Detail icon="📚" label="Practices" value={lawyer.practices?.join(", ")} />
          <Detail icon="📍" label="Cities" value={lawyer.Cities?.join(", ")} />
          <Detail icon="🗣️" label="Languages" value={lawyer.languages?.join(", ")} />
          <Detail icon="✉️" label="Email" value={lawyer.email} />
          {lawyer.phoneRequestLink && (
            <Detail
              icon="📞"
              label="Phone Link"
              value={
                <a
                  href={lawyer.phoneRequestLink}
                  className="text-yellow-300 underline"
                  target="_blank"
                >
                  Request Call Back
                </a>
              }
            />
          )}
        </div>

        {/* Sections */}
        <hr className="border-stone-600 my-4" />
        <div className="space-y-6">
          {Object.entries(lawyer.sections || {}).map(([key, val]) => (
            <div key={key}>
              <h3 className="text-2xl text-yellow-300 font-semibold mb-2 flex items-center gap-2">
                {getSectionIcon(key)}
                {key}
              </h3>
              <p className="text-stone-200 whitespace-pre-line leading-relaxed">
                {val}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}

function Detail({ label, value, icon }) {
  return (
    <div>
      <p className="text-sm uppercase tracking-wide text-stone-400 flex items-center gap-2">
        <span>{icon}</span>
        {label}
      </p>
      <p className="text-md text-stone-100">{value || "—"}</p>
    </div>
  );
}

function getSectionIcon(key) {
  const map = {
    Fees: "💰",
    Education: "🎓",
    Website: "🌐",
    "Contact & Map": "📍",
    "Professional Experience": "📁",
    "Professional Associations": "⚖️",
    Languages: "🗣️",
    FAQ: "❓",
    "Admitted to Practice": "📝",
    Jurisdictions: "📜",
  };
  return <span>{map[key] || "📄"}</span>;
}
