import "../globals.css";
import ProviderWrapper from "@/redux/ProviderWrapper"; // ✅ Import Redux provider
import SessionWrapper from "@/components/sessionWrapper"


export default function PlainLayout({ children }) {
    return (
      <html lang="en">
        <body>
        <SessionWrapper>

         <ProviderWrapper> {/* ✅ Wrap with Redux provider */}
          {children}
        </ProviderWrapper>
          </SessionWrapper>
         </body>
      </html>
    );
  }