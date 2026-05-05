import { RedirectToSignIn, SignedOut, SignedIn } from "@clerk/nextjs";
import Home from "@/app/home/page";

export default async function Page() {
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
