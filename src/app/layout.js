import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Luyện tập biên tập",
  description:
    "Ứng dụng luyện tập biên tập dành cho các bạn đang tập trở thành MC",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col`}
      >
        {/* Nội dung chiếm toàn bộ chiều cao trống */}
        <main className="flex-1">{children}</main>

        {/* Toaster để hiển thị thông báo */}
        <Toaster
          position="top-right"
          richColors
          closeButton={false}
          toastOptions={{
            className: "bg-white text-black shadow-lg",
            style: {
              background: "#fff",
              color: "#000",
            },
          }}
        />

        {/* Footer luôn nằm dưới cùng */}
        <Footer />
      </body>
    </html>
  );
}
