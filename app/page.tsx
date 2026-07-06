"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader2  from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-white">
        <div className="animate-spin text-red-600">
          {/* Loading state while redirecting */}
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full" />
        </div>
        <p className="text-gray-400 font-medium">Redirecting to Admin Portal...</p>
      </div>
    </div>
  );
}
