"use client";
import { signInWith } from "@/lib/auth";
import { GoogleOutlined, GithubOutlined, AppleFilled, XOutlined } from "@ant-design/icons";

function getIcon(provider: string) {
  const className = "text-gray-900";
  const assets = {
    google: <GoogleOutlined className={className}/>,
    github: <GithubOutlined className={className}/>,
    apple: <AppleFilled className={className}/>,
    twitter: <XOutlined className={className}/>,
  }
  return assets[provider]
}

export default function ContinueWith({
  provider,
}: {
  provider: "google" | "github" | "apple" | "twitter";
}) {
  return (
    <button
      type="button"
      onClick={() => signInWith(provider)}
      className="mt-4 border border-gray-300 bg-white text-gray-900 hover:bg-gray-200 transition-colors rounded-md px-4 py-2 w-full cursor-pointer"
    >
      {getIcon(provider)} <span className="ml-2" />
      Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}
    </button>
  );
}
