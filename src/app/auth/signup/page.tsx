import AuthForm from "../components/AuthForm";
import SocialProviders from "../components/SocialProviders";

export default function SignupPage() {
  return (
    <>
      <AuthForm type="signup" />
      <SocialProviders providers={["google", "github"]} />
    </>
  );
}
