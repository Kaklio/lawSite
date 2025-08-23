'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from "next/link";
import { FiChevronDown, FiChevronUp, FiSearch } from 'react-icons/fi';

const fetchMeta = async (filter = {}) => {
  const params = new URLSearchParams(filter);
  const res = await fetch(`/api/lawyers/meta?${params.toString()}`);
  return await res.json();
};

const fetchLawyers = async (filters = {}, skip = 0, limit = 10) => {
  const params = new URLSearchParams({ ...filters, skip, limit });
  const res = await fetch(`/api/lawyers?${params.toString()}`);
  return await res.json();
};

export default function LawyerSearchPage() {
  const [lawyers, setLawyers] = useState([]);
  const [filters, setFilters] = useState({ city: 'ANY', practice: 'ANY' });
  const [counts, setCounts] = useState({ practices: {} });
  const [meta, setMeta] = useState({ cities: [], practices: [] });
  const [hasSearched, setHasSearched] = useState(false);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [cityChanged, setCityChanged] = useState(false);
  const [practiceChanged, setPracticeChanged] = useState(false);
  const [sortOption, setSortOption] = useState("sections"); // Default to sections count
  const [sortConfig, setSortConfig] = useState({
  key: 'sections', // Default sort
  direction: 'desc' // Default direction
});
  const observer = useRef();

  useEffect(() => {
    fetchMeta().then(setMeta);
  }, []);

  const handleFilterChange = async (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);

    // ✨ trigger visual effect
    if (name === "city") {
      setPracticeChanged(true);
      setTimeout(() => setPracticeChanged(false), 1000);
    } else if (name === "practice") {
      setCityChanged(true);
      setTimeout(() => setCityChanged(false), 1000);
    }

    // dynamic meta update logic (unchanged)
    if (name === "city" && value !== "ANY") {
      const data = await fetchMeta({ city: value });
      setMeta((prev) => ({ ...prev, practices: data.practices }));
    } else if (name === "practice" && value !== "ANY") {
      const data = await fetchMeta({ practice: value });
      setMeta((prev) => ({ ...prev, cities: data.cities }));
    } else {
      const fullMeta = await fetchMeta();
      setMeta(fullMeta);
    }
  };



  const handleSearch = async () => {
      const query = {
    ...(filters.city !== 'ANY' && { city: filters.city }),
    ...(filters.practice !== 'ANY' && { practice: filters.practice }),
    sort: getSortParam() // Use the new sort parameter format
  };
    const data = await fetchLawyers(query, 0);
    setLawyers(data.lawyers);
    setCounts(data.filterCounts);
    setSkip(data.lawyers.length);
    setTotalCount(data.total); // Track total
    setHasSearched(true);
  };


const handleSort = (key) => {
  setSortConfig(prev => ({
    key,
    direction: prev.key === key 
      ? prev.direction === 'asc' ? 'desc' : 'asc'
      : 'desc' // Default to desc when switching sort keys
  }));
  
  // Trigger search after a small delay
  setTimeout(handleSearch, 100);
};

const getSortIcon = (key) => {
  if (sortConfig.key !== key) return null;
  return sortConfig.direction === 'asc' 
    ? <FiChevronUp className="ml-1 inline" /> 
    : <FiChevronDown className="ml-1 inline" />;
};

const getSortParam = () => {
  if (sortConfig.key === 'sections') return 'sections';
  return `${sortConfig.key}_${sortConfig.direction}`;
};

  const lastLawyerRef = useRef();
  useEffect(() => {
    if (!hasSearched) return;

    const loadMore = async () => {
      if (loading || skip >= totalCount) return;
      setLoading(true);

        const query = {
    ...(filters.city !== 'ANY' && { city: filters.city }),
    ...(filters.practice !== 'ANY' && { practice: filters.practice }),
    sort: getSortParam() // Use the new sort parameter format
  };


      const data = await fetchLawyers(query, skip);

      // Prevent duplicates by filtering out already seen lawyer IDs
      setLawyers((prev) => {
        const existingIds = new Set(prev.map((l) => l.id));
        const newUnique = data.lawyers.filter((l) => !existingIds.has(l.id));
        return [...prev, ...newUnique];
      });

      setSkip((prev) => prev + data.lawyers.length);
      setLoading(false);
    };

    const observerInstance = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loadMore();
      }
    }, { threshold: 1 });

    if (lastLawyerRef.current) {
      observerInstance.observe(lastLawyerRef.current);
    }

    return () => {
      if (lastLawyerRef.current) {
        observerInstance.unobserve(lastLawyerRef.current);
      }
    };
  }, [skip, filters, hasSearched]);

  return (
    <div className="min-h-screen bg-stone-800 p-6 font-sans text-stone-900">
      <h1 className="text-4xl font-serif text-stone-200 mb-6 border-b border-stone-300 pb-2">
        Find a Lawyer
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1 bg-yellow-950 rounded shadow p-4 ">
          <h2 className="text-xl font-bold text-stone-200 mb-4">Filters</h2>

          <div className="mb-4">
            <label className="block mb-1 font-medium text-stone-200">City</label>
            <select
              name="city"
              className={`w-full border rounded p-2 transition-all duration-700 ${cityChanged ? 'bg-purple-700 text-white shadow-lg' : 'bg-white text-stone-900 border-stone-300'
                }`}
              value={filters.city}
              onChange={handleFilterChange}
            >
              <option value="ANY">Any City</option>
              {meta.cities?.sort().map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium text-stone-200">Practice</label>
            <select
              name="practice"
              className={`w-full border rounded p-2 transition-all duration-700 ${practiceChanged ? 'bg-purple-700 text-white shadow-lg' : 'bg-white text-stone-900 border-stone-300'
                }`}
              value={filters.practice}
              onChange={handleFilterChange}
            >
              <option value="ANY">Any Practice</option>
              {meta.practices?.sort().map((practice) => (
                <option key={practice} value={practice}>
                  {practice}
                  {counts.practices?.[practice] ? ` (${counts.practices[practice]})` : ''}
                </option>
              ))}
            </select>
          </div>

  <button
    onClick={handleSearch}
    className="w-full mt-2 bg-red-950 text-white rounded py-2 hover:bg-red-900 transition flex items-center justify-center gap-2"
  >
    <FiSearch className="w-4 h-4" />
    Search
  </button>


  {/* {ADDDITION} */}
<div className="mb-4">
  <label className="block mb-2 font-medium text-stone-200">Sort By</label>
  <div className="flex flex-col">
    {/* Profile Completeness Button */}
    <button
      onClick={() => handleSort('sections')}
      className={`px-4 py-2 rounded-t-lg border border-amber-950 transition-colors ${
        sortConfig.key === 'sections' 
          ? 'bg-purple-900/70 text-purple-300' 
          : 'bg-amber-600/70 hover:bg-stone-800/70'
      }`}
    >
      Completeness {getSortIcon('sections')}
    </button>
    
    {/* Name Button */}
    <button
      onClick={() => handleSort('alphabetical')}
      className={`px-4 py-2 border-t border-b border-amber-950 transition-colors ${
        sortConfig.key === 'alphabetical' 
          ? 'bg-purple-900/70 text-purple-300' 
          : 'bg-amber-600/70 hover:bg-stone-800/70'
      }`}
    >
      Name {getSortIcon('alphabetical')}
    </button>
    
    {/* Experience Button */}
    <button
      onClick={() => handleSort('experience')}
      className={`px-4 py-2 rounded-b-lg border border-amber-950 transition-colors ${
        sortConfig.key === 'experience' 
          ? 'bg-purple-900/70 text-purple-300' 
          : 'bg-amber-600/70 hover:bg-stone-800/70'
      }`}
    >
      Experience {getSortIcon('experience')}
    </button>
  </div>
</div>
{/* {ADDDITION} */}


        </div>

        {/* Lawyer Results */}
        <div className="lg:col-span-3 space-y-6">
          {hasSearched && lawyers.length === 0 && (
            <div className="text-center text-stone-400 mt-8">
              No lawyers found for selected filters.
            </div>
          )}

          {lawyers.map((lawyer, index) => {
            const showRef = index === lawyers.length - 1;
            return (
              <Link href={`/lawyer/${lawyer.id}`} key={`lawyer-${lawyer.id}`} ref={showRef ? lastLawyerRef : null}>
                <div className="bg-purple-950 hover:bg-purple-800 rounded-lg shadow-md p-6 flex flex-col items-center lg:flex-row lg:items-start lg:gap-6 hover:shadow-xl transition">
                  <Image
                    src={`/assets/images/Lawyers/${lawyer.id}.jpg`}
                    width={300}
                    height={300}
                    alt={lawyer.name}
                    className="rounded-full object-cover mb-4 lg:mb-0"
                  />
                  <div className="text-stone-100 text-2xl text-center lg:text-left max-w-2xl py-14 ">
                    <h3 className="text-4xl font-semibold mb-2">{lawyer.name}</h3>
                    <p className="italic text-sm mb-2">
                      {lawyer.titles?.join(', ')}
                    </p>
                    <p><strong>Experience:</strong> {lawyer.experience || '—'}</p>
                    <p><strong>Courts:</strong> {lawyer.courts?.join(', ') || '—'}</p>
                    <p><strong>Practices:</strong> {lawyer.practices?.slice(0, 2).join(', ') || '—'}</p>
                    <p><strong>Cities:</strong> {lawyer.Cities?.slice(0, 2).join(', ') || '—'}</p>
                  </div>
                </div>
              </Link>
            );
          })}
          {loading && (
            <div className="text-center text-stone-400">Loading more lawyers...</div>
          )}
          {!loading && hasSearched && lawyers.length >= totalCount && (
            <div className="text-center text-stone-400 mt-4">All profiles loaded.</div>
          )}
        </div>
      </div>
    </div>
  );
}
