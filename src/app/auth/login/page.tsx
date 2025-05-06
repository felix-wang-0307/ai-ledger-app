"use client";
import AuthForm from "../components/AuthForm";
import SocialProviders from "../components/SocialProviders";

export default function LoginPage() {
  return (
    <>
      <div>
        <AuthForm type="login" />
      </div>
      <SocialProviders providers={["google", "github", "guest"]} />
    </>
  );
}
