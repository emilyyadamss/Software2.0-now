import "./globals.css";

export const metadata = {
  title: "Software2.0-now",
  description: "Enterprise software update dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
