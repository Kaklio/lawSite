'use client';

import React, { useState, useEffect } from 'react';

export default function JudgesPage() {
  const [judgesData, setJudgesData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourt, setSelectedCourt] = useState('All Courts');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJudges = async () => {
      try {
        const response = await fetch('/JSONS/judges.json');
        const data = await response.json();
        setJudgesData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching judges data:', error);
        setIsLoading(false);
      }
    };

    fetchJudges();
  }, []);

  // Get all unique courts for the filter dropdown
  const courts = ['All Courts', ...Object.keys(judgesData)];

  // Filter judges based on search term and selected court
  const filteredJudges = Object.entries(judgesData).reduce((acc, [court, judges]) => {
    if (selectedCourt !== 'All Courts' && court !== selectedCourt) {
      return acc;
    }

    const courtJudges = judges.filter(judge =>
      judge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      judge.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (courtJudges.length > 0) {
      acc.push({ court, judges: courtJudges });
    }

    return acc;
  }, []);

  // Function to parse various date formats
  const parseDate = (dateString) => {
    if (!dateString || dateString.trim() === '') return null;
    
    // Handle formats like "8 July 2025", "23-Dec-15", "27-03-17", "04-02-25"
    const formats = [
      // Format: "8 July 2025"
      /(\d+)\s+([a-zA-Z]+)\s+(\d{4})/,
      // Format: "23-Dec-15" or "23-Dec-2015"
      /(\d+)-([a-zA-Z]+)-(\d{2,4})/,
      // Format: "27-03-17" or "27-03-2017"
      /(\d+)-(\d+)-(\d{2,4})/,
      // Format: "04-02-25" (assuming DD-MM-YY)
      /(\d{2})-(\d{2})-(\d{2})/
    ];

    for (const regex of formats) {
      const match = dateString.match(regex);
      if (match) {
        let day, month, year;

        if (regex === formats[0]) {
          // "8 July 2025"
          day = parseInt(match[1]);
          month = new Date(Date.parse(match[2] + " 1, 2000")).getMonth();
          year = parseInt(match[3]);
        } else if (regex === formats[1]) {
          // "23-Dec-15"
          day = parseInt(match[1]);
          month = new Date(Date.parse(match[2] + " 1, 2000")).getMonth();
          year = parseInt(match[3]);
          if (year < 100) year += 2000; // Convert YY to YYYY
        } else if (regex === formats[2] || regex === formats[3]) {
          // "27-03-17" or "04-02-25"
          day = parseInt(match[1]);
          month = parseInt(match[2]) - 1; // Months are 0-indexed in JS
          year = parseInt(match[3]);
          if (year < 100) year += 2000; // Convert YY to YYYY
        }

        // Validate the date
        const date = new Date(year, month, day);
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
    }

    // If no format matches, try default Date parsing
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  // Function to determine if a judge is serving or retired
  const getStatus = (judge) => {
    const today = new Date();
    
    // If no retirement date, they are serving
    if (!judge.retirementDate || judge.retirementDate.trim() === '') {
      return 'Serving';
    }
    
    const retirementDate = parseDate(judge.retirementDate);
    
    // If we can't parse the retirement date, show unknown status
    if (!retirementDate) {
      return 'Unknown';
    }
    
    // Compare dates (ignore time part)
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const retirementDateOnly = new Date(retirementDate.getFullYear(), retirementDate.getMonth(), retirementDate.getDate());
    
    return todayDate > retirementDateOnly ? 'Retired' : 'Serving';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Serving':
        return 'text-green-400 bg-green-900/20';
      case 'Retired':
        return 'text-gray-400 bg-gray-900/20';
      case 'Unknown':
        return 'text-yellow-400 bg-yellow-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br maroon-bg text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gold-400 mb-4 font-serif">
            ⚖️ Judiciary of Pakistan
          </h1>
          <p className="text-maroon-200 text-lg">
            Honorable Judges Serving Across Various High Courts
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-maroon-800/50 border border-amber-800 rounded-xl p-6 mb-8 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search Input */}
            <div>
              <label className="block text-gold-300 mb-2 font-medium">
                Search Judges
              </label>
              <input
                type="text"
                placeholder="Search by name or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 maroon-bg border border-amber-800 rounded-lg text-white placeholder-maroon-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              />
            </div>

            {/* Court Filter */}
            <div>
              <label className="block text-gold-300 mb-2 font-medium">
                Filter by Court
              </label>
              <select
                value={selectedCourt}
                onChange={(e) => setSelectedCourt(e.target.value)}
                className="w-full px-4 py-3 maroon-bg bg-red-950 border border-amber-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              >
                {courts.map((court) => (
                  <option key={court} value={court}>
                    {court}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
  {searchTerm && (
  <div className="text-maroon-200 mb-6 text-center">
    Found {filteredJudges.reduce((total, { judges }) => total + judges.length, 0)} 
    judges matching &ldquo;{searchTerm}&rdquo;
  </div>
)}

        {/* Judges List */}
        <div className="space-y-8">
          {filteredJudges.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gold-400 text-2xl mb-4">No judges found</div>
              <p className="text-maroon-200">Try adjusting your search criteria</p>
            </div>
          ) : (
            filteredJudges.map(({ court, judges }) => (
              <div key={court} className="bg-maroon-800/30 border border-maroon-600 rounded-xl overflow-hidden backdrop-blur-sm">
                {/* Court Header */}
                <div className="bg-maroon-900/80 px-6 py-4 border-b border-maroon-600">
                  <h2 className="text-2xl font-bold text-gold-400 font-serif">
                    {court}
                  </h2>
                </div>

                {/* Judges Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {judges.map((judge, index) => (
                    <div
                      key={index}
                      className="bg-maroon-900/50 border border-white rounded-lg p-6 hover:bg-red-950 transition-all duration-300 hover:shadow-lg hover:shadow-maroon-700/20"
                    >
                      {/* Status Badge */}
                      <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(getStatus(judge))} bg-maroon-800/50`}>
                          {getStatus(judge)}
                        </span>
                      </div>

                      {/* Position */}
                      <div className="text-yellow-500 text-sm font-medium mb-2 uppercase tracking-wide">
                        {judge.position}
                      </div>

                      {/* Name */}
                      <h3 className="text-xl font-bold text-white mb-4 font-serif">
                        {judge.name}
                      </h3>

                      {/* Dates */}
                      <div className="space-y-2 text-maroon-200 text-sm">
                        {judge.appointmentDate && (
                          <div className="flex items-center">
                            <span className="w-4 h-4 bg-gold-500 rounded-full mr-2"></span>
                            <span>Appointed: {judge.appointmentDate}</span>
                          </div>
                        )}
                        {judge.retirementDate && judge.retirementDate.trim() !== '' && (
                          <div className="flex items-center">
                            <span className="w-4 h-4 bg-maroon-400 rounded-full mr-2"></span>
                            <span>Retirement: {judge.retirementDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Note */}
        {filteredJudges.length > 0 && (
          <div className="text-center mt-12 pt-8 border-t border-maroon-600">
            <p className="text-maroon-300 text-sm">
              Information sourced from official court records and public databases
            </p>
          </div>
        )}
      </div>

      {/* Add custom styles for the color theme */}
      <style jsx>{`
        :root {
          --color-maroon-900: #4A0000;
          --color-maroon-800: #5D0000;
          --color-maroon-700: #700000;
          --color-maroon-600: #830000;
          --color-maroon-500: #960000;
          --color-maroon-400: #A90000;
          --color-maroon-300: #BC0000;
          --color-gold-500: #D4AF37;
          --color-gold-400: #E6C35C;
          --color-gold-300: #F8D781;
        }
        
        .bg-maroon-900 { background-color: var(--color-maroon-900); }
        .bg-maroon-800 { background-color: var(--color-maroon-800); }
        .bg-maroon-700 { background-color: var(--color-maroon-700); }
        .bg-maroon-600 { background-color: var(--color-maroon-600); }
        .bg-maroon-500 { background-color: var(--color-maroon-500); }
        .bg-maroon-400 { background-color: var(--color-maroon-400); }
        .bg-maroon-300 { background-color: var(--color-maroon-300); }
        
        .text-maroon-900 { color: var(--color-maroon-900); }
        .text-maroon-800 { color: var(--color-maroon-800); }
        .text-maroon-700 { color: var(--color-maroon-700); }
        .text-maroon-600 { color: var(--color-maroon-600); }
        .text-maroon-500 { color: var(--color-maroon-500); }
        .text-maroon-400 { color: var(--color-maroon-400); }
        .text-maroon-300 { color: var(--color-maroon-300); }
        .text-maroon-200 { color: #E8C8C8; }
        
        .text-gold-500 { color: var(--color-gold-500); }
        .text-gold-400 { color: var(--color-gold-400); }
        .text-gold-300 { color: var(--color-gold-300); }
        
        .border-maroon-600 { border-color: var(--color-maroon-600); }
        .border-maroon-500 { border-color: var(--color-maroon-500); }
        
        .focus\:ring-gold-500:focus { ring-color: var(--color-gold-500); }
      `}</style>
    </div>
  );
}