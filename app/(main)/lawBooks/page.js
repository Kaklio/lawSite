"use client";

import { useState, useRef } from "react";

const books = [
  { name: "Basic Laws", author: " Office of General Counsel National Archives and Records Administration", year: "2016", href: "Books/Basic Laws.pdf" },
  { name: "Fundamental Law of Pakistan", author: "A. K. Brohi", year: "1958", href: "Books/Fundamental Law of Pakistan.pdf" },
  { name: "International Law Benchbook for the Judiciary in Pakistan", author: "RSIL", year: "2014", href: "Books/International-Law-Benchbook-for-the-Judiciary-in-Pakistan.pdf" },
  { name: "Punjab Judicial Academy Law Journal", author: "Punjab Judicial Academy", year: "2022", href: "Books/Punjab Judicial Academy Law Journal.pdf" },
  { name: "Pakistan Penal Code", author: "National Assembly", year: "1847", href: "Books/Pakistan Penal Code.pdf" },
];

export default function lawBooks() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#06002d]">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-3xl">
        <h1 className="text-center text-3xl text-white mb-4">Download Links</h1>
        <ul className="space-y-4">
          {books.map((book, index) => (
            <DownloadItem key={index} book={book} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function DownloadItem({ book }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  return (
    <li className="bg-gray-700 p-3 rounded-lg relative">
      <div
        className="flex items-center cursor-pointer text-white text-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`mr-2 transition-transform duration-300 ${
            isOpen ? "rotate-90 text-[#7effe7]" : "text-white"
          }`}
        >
          →
        </span>
        <a href={book.href} download className="text-[#7effe7] hover:text-[#68beb0]">
          {book.name}
        </a>
      </div>
      <div
        ref={contentRef}
        className="overflow-hidden transition-[height] duration-300 ease-in-out"
        style={{
          height: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
        }}
      >
        <p className="text-white text-sm mt-2"><strong>Author:</strong> {book.author}</p>
        <p className="text-white text-sm"><strong>Year:</strong> {book.year}</p>
      </div>
    </li>
  );
}
