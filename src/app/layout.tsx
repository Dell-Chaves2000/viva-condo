import "./globals.css";
import Menu from "@/components/menu";
import { createServerSupabase } from "@/utils/supabase/server"; 
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase(); 
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {user && <Menu user={user} />}
        <div className={user ? "ml-60" : ""}>
          {children}
        </div>
        
        {/* Toaster posicionado no rodapé direito */}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            classNames: {
              toast: "!p-4 !rounded-lg !shadow-lg !border-0 !font-sans",
              title: "!font-medium !text-sm",
            },
          }}
        />
      </body>
    </html>
  );
}