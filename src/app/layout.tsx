import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css"; // This line is very important!

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter' 
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ['400', '600', '700'],
  variable: '--font-cormorant-garamond'
});

export const metadata: Metadata = {
  title: "Constellaria - Your Mystical Guide",
  description: "Daily tarot interpreted through your unique astrological blueprint.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorantGaramond.variable} text-white font-sans`}>
        {children}
      </body>
    </html>
  );
}