import "../globals.css";

export default function PlainLayout({ children }) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }