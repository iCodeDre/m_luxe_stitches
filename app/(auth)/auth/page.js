import AuthForm from "@/components/auth-form";
import { Suspense } from "react";

function AuthPage() {
  return (
    <Suspense fallback={<p>loading..</p>}>
      <AuthForm />
    </Suspense>
  );
}

export default AuthPage;
