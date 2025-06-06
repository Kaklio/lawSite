"use client";

import { useState, useEffect } from 'react';
import { FiSearch, FiDownload, FiChevronDown, FiChevronUp, FiX, FiFilter } from 'react-icons/fi';

export default function LawSearch() {
  const [laws, setLaws] = useState([]);
  const [filteredLaws, setFilteredLaws] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortConfig, setSortConfig] = useState({ 
    key: 'year', 
    direction: 'desc' 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchLaws = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/laws');
        if (!response.ok) throw new Error('Failed to fetch laws');
        const data = await response.json();
        setLaws(data.laws);
        setFilteredLaws(data.laws);
        setCategories(data.categories);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLaws();
  }, []);

  useEffect(() => {
    let results = [...laws];

    // Apply category filter
    if (selectedCategory !== 'All') {
      results = results.filter(law => law.category === selectedCategory);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(law => 
        law.title.toLowerCase().includes(term) || 
        law.number.toString().includes(term)
      );
    }

    // Apply sorting
    results.sort((a, b) => {
      if (sortConfig.key === 'year') {
        // Handle null years by putting them at the end
        if (a.year === null) return 1;
        if (b.year === null) return -1;
        return sortConfig.direction === 'asc' 
          ? a.year - b.year 
          : b.year - a.year;
      } else {
        return sortConfig.direction === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
    });

    setFilteredLaws(results);
  }, [laws, searchTerm, selectedCategory, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key 
        ? prev.direction === 'asc' ? 'desc' : 'asc'
        : 'desc'
    }));
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' 
      ? <FiChevronUp className="ml-1" /> 
      : <FiChevronDown className="ml-1" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a011f] to-[#1a0a3a] text-white">
      {/* Header */}
      <header className="bg-[#1a0a3a]/80 backdrop-blur-sm py-8 px-4 shadow-2xl">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#7effe7] to-[#a67cff]">
            Legal Document Archive
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Search through the comprehensive collection of laws, acts, and ordinances
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-4">
        {/* Search and Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Search Bar */}
          <div className="relative col-span-1 md:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-3 border border-gray-700 rounded-lg bg-[#1a0a3a]/50 focus:ring-2 focus:ring-[#7effe7] focus:border-transparent"
              placeholder="Search by title or law number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FiX className="text-gray-400 hover:text-white" />
              </button>
            )}
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center justify-center w-full px-4 py-3 bg-[#1a0a3a]/70 border border-gray-700 rounded-lg hover:bg-[#2a1a5a] transition"
              >
                <FiFilter className="mr-2" />
                {selectedCategory === 'All' ? 'Filter' : selectedCategory}
              </button>
              
              {isFilterOpen && (
                <div className="absolute z-10 mt-1 w-full bg-[#1a0a3a] border border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsFilterOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 hover:bg-[#2a1a5a] ${selectedCategory === category ? 'bg-[#7effe7]/20 text-[#7effe7]' : 'text-gray-200'}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex">
              <button
                onClick={() => handleSort('title')}
                className={`px-3 py-2 rounded-l-lg border border-gray-700 ${sortConfig.key === 'title' ? 'bg-[#7effe7]/20 text-[#7effe7]' : 'bg-[#1a0a3a]/70'}`}
              >
                A-Z {getSortIcon('title')}
              </button>
              <button
                onClick={() => handleSort('year')}
                className={`px-3 py-2 rounded-r-lg border border-gray-700 ${sortConfig.key === 'year' ? 'bg-[#7effe7]/20 text-[#7effe7]' : 'bg-[#1a0a3a]/70'}`}
              >
                Year {getSortIcon('year')}
              </button>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-[#7effe7]/30 rounded-full mb-4"></div>
              <p className="text-gray-400">Loading legal documents...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            Error: {error}
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && (
          <div className="space-y-4">
            {filteredLaws.length > 0 ? (
              filteredLaws.map(law => (
                <LawCard key={law.number} law={law} />
              ))
            ) : (
              <div className="text-center py-16 bg-[#1a0a3a]/50 rounded-lg border border-dashed border-gray-700">
                <p className="text-gray-400 text-lg">No matching laws found</p>
                <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function LawCard({ law }) {
  return (
    <div className="group bg-[#1a0a3a]/50 hover:bg-[#1a0a3a]/70 border border-gray-800 hover:border-[#7effe7]/30 rounded-lg p-5 transition-all duration-300 shadow-lg hover:shadow-[#7effe7]/10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-medium text-[#a67cff] group-hover:text-[#7effe7] transition-colors">
            <a 
              href={law.filePath} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {law.title}
            </a>
          </h3>
          <div className="flex flex-wrap gap-3 mt-2 text-sm">
            <span className="bg-[#7effe7]/10 text-[#7effe7] px-2 py-1 rounded">
              {law.category}
            </span>
            {law.year && (
              <span className="bg-[#a67cff]/10 text-[#a67cff] px-2 py-1 rounded">
                {law.year}
              </span>
            )}
          </div>
        </div>
        <a
          href={law.filePath}
          download
          className="flex items-center justify-center px-4 py-2 bg-[#7effe7] text-[#0a011f] rounded-lg hover:bg-[#a67cff] transition-colors font-medium"
        >
          <FiDownload className="mr-2" />
          Download
        </a>
      </div>
    </div>
  );
}