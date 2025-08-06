import "../globals.css";
import AuthHeader from "@/components/auth-header";

export default function RootLayout({ children }) {
  return (
    <div className="auth">
      <AuthHeader />
      {children}
    </div>
  );
}
