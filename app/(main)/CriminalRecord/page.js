"use client";

import { useState, useRef, useEffect } from "react";
import { FiSearch, FiDownload, FiChevronDown, FiChevronUp, FiX, FiRefreshCw } from "react-icons/fi";

export default function CriminalRecord() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/criminal-records');
        if (!response.ok) {
          throw new Error('Failed to fetch records');
        }
        const data = await response.json();
        setRecords(data);
        setFilteredRecords(data);
      } catch (err) {
        console.error('Error fetching records:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, []);

  useEffect(() => {
    // Filter and sort records based on search term and sort order
    let results = [...records];
    
    if (searchTerm) {
      results = results.filter(record =>
        record.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    results.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    setFilteredRecords(results);
  }, [searchTerm, sortOrder, records]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const refreshRecords = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/criminal-records');
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      const data = await response.json();
      setRecords(data);
      setFilteredRecords(data);
      setSearchTerm("");
    } catch (err) {
      console.error('Error refreshing records:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06002d] text-white">
      {/* Subtle Navbar/Header */}
      <header className="bg-[#120050] py-6 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2 text-[#7effe7]">Criminal Records</h1>
          <nav className="flex justify-center space-x-8">
            <button className="px-4 py-2 bg-[#7effe7] text-[#06002d] rounded-lg font-medium">
              Gangs
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-4">
        {/* Search and Sort Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-2 border border-gray-600 rounded-lg bg-gray-800 focus:ring-2 focus:ring-[#7effe7] focus:border-transparent"
              placeholder="Search gang records..."
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

          <div className="flex items-center gap-2">
            <button
              onClick={refreshRecords}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
              title="Refresh records"
            >
              <FiRefreshCw className={`${isLoading ? 'animate-spin' : ''}`} />
            </button>
            
            <div className="flex items-center">
              <span className="mr-2 text-gray-300">Sort by name:</span>
              <button
                onClick={toggleSortOrder}
                className="flex items-center px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
              >
                {sortOrder === "asc" ? (
                  <>
                    <span>A-Z</span>
                    <FiChevronUp className="ml-1" />
                  </>
                ) : (
                  <>
                    <span>Z-A</span>
                    <FiChevronDown className="ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7effe7]"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            Error: {error}
          </div>
        )}

        {/* Records List */}
        {!isLoading && !error && (
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {filteredRecords.length > 0 ? (
              <ul className="divide-y divide-gray-700">
                {filteredRecords.map((record, index) => (
                  <RecordItem key={index} record={record} />
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-gray-400">
                No records found matching your search.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function RecordItem({ record }) {
  return (
    <li className="hover:bg-gray-750 transition">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <a
            href={record.file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-medium text-[#7effe7] hover:underline"
          >
            {record.name}
          </a>
          <p className="text-sm text-gray-400 mt-1">Last updated: {record.date}</p>
        </div>
        <a
          href={record.file}
          download
          className="flex items-center px-3 py-2 bg-[#7effe7] text-[#06002d] rounded-lg hover:bg-[#68beb0] transition"
        >
          <FiDownload className="mr-2" />
          Download
        </a>
      </div>
    </li>
  );
}