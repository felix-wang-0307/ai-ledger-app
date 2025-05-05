import AuthForm from "../components/AuthForm";
import ContinueWith from "../components/ContinueWith";

export default function SignupPage() {
  return (
    <>
      <AuthForm type="signup" />
      <div className="flex-col items-center gap-1 my-4 max-w-md mx-auto">
        {["google", "github"].map( 
          (
            provider: any // TODO: add more providers
          ) => (
            <ContinueWith provider={provider} key={provider} />
          )
        )}
      </div>
    </>
  );
}
