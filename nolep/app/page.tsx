import { RedirectToSignIn, SignedOut, SignedIn } from "@clerk/nextjs";
import Home from "@/app/home/page";
import prisma from "@/lib/db";

export default async function Page() {
  const users = await prisma.user.findMany();
  console.log(users); // Log the users to the console
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <Home />
      </SignedIn>
    </>
  );
}
