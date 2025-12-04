
import { ClerkProvider,SignUpButton, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { onBoardUser } from "@/modules/auth/actions";

export default async function Home() {

  await onBoardUser();

  return (
    <div className="flex min-h-screen items-center justify-center bg-black font-sans ">


      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
    </div>
  );
}
