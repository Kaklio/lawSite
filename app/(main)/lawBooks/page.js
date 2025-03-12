"use client";

import { useState, useRef } from "react";

const books = [
  { name: "Book 1", author: "Author 1", publisher: "Publisher 1", year: "2021", href: "/Files/shit.txt" },
  { name: "Book 2", author: "Author 2", publisher: "Publisher 2", year: "2020", href: "/Files/shit.txt" },
  { name: "Book 3", author: "Author 3", publisher: "Publisher 3", year: "2019", href: "/Files/shit.txt" },
  { name: "Book 4", author: "Author 4", publisher: "Publisher 4", year: "2018", href: "/Files/shit.txt" },
  { name: "Book 5", author: "Author 5", publisher: "Publisher 5", year: "2017", href: "/Files/shit.txt" },
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
        <p className="text-white text-sm"><strong>Publisher:</strong> {book.publisher}</p>
        <p className="text-white text-sm"><strong>Year:</strong> {book.year}</p>
      </div>
    </li>
  );
}
