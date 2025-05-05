import AuthForm from "../components/AuthForm";
import ContinueWith from "../components/ContinueWith";

export default function LoginPage() {
  return (
    <>
      <div>
        <AuthForm type="login" />
      </div>
      <div className="flex-col items-center justify-between my-4 max-w-md mx-auto gap-1">
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
