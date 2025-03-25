import { Geist, Geist_Mono } from "next/font/google";
import "../styles/index.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Macro Calculator",
  description: "Calculate your personalized macro nutrition plan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} app-background`}
      >
        <div className="app-container">{children}</div>
      </body>
    </html>
  );
}
