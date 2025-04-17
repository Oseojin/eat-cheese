// app/layout.tsx
import { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "EAT CHEESE",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="w-full py-4 flex justify-center items-center">
          <h1 className="text-3xl font-bold text-yellow-600">EAT CHEESE</h1>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
