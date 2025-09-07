import Logout from "@/components/Logout";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log("🚀 ~ session", session);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Logout />
        </div>
      </main>
    </div>
  );
}
