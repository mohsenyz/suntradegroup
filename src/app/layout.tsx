import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "سان ترد گروپ - ابزار و یراق آلات باکیفیت",
  description: "شرکت سان ترد گروپ با بیش از ربع قرن تجربه در تولید و توزیع ابزار و یراق آلات",
  keywords: "ابزار، یراق آلات، سان ترد گروپ، تولید، توزیع، کیفیت",
  authors: [{ name: "سان ترد گروپ" }],
  robots: "index, follow",
  openGraph: {
    title: "سان ترد گروپ",
    description: "تولیدکننده و توزیع‌کننده ابزار و یراق آلات باکیفیت",
    type: "website",
    locale: "fa_IR",
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="icon" href="/images/logo.webp" type="image/webp" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-sans" style={{fontFamily: 'Vazirmatn, Tahoma, sans-serif'}}>
        {children}
      </body>
    </html>
  );
}
