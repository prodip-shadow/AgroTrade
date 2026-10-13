import { fontSans, fontDisplay, fontLogo } from "@/fonts";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { ToastProvider } from "@/components/providers/toast-provider";

export const metadata = {
  title: "AgroTrade | Smart Agriculture Marketplace",
  description: "Direct trade connecting Bangladesh's local farmers with families and businesses. Fresh produce, transparent pricing, and ethical farming.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontDisplay.variable} ${fontLogo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
        <AuthProvider>
          <CartProvider>
            {children}
            <ToastProvider />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
