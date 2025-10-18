import "./globals.css";
import Menu from "@/components/menu";
import { createServerSupabase } from "@/utils/supabase/server"; 
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
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

  // Verifica se é a página de login
  const isLoginPage = false;

  return (
    <html lang="en">
      <body>
        {user && <Menu user={user} />}
        <div className={user ? "ml-60" : ""}>
          {children}
        </div>
      </body>
    </html>
  );
}