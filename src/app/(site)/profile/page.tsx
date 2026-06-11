import type { Metadata } from "next";
import { ProfileClient } from "./profile-client";

export const metadata: Metadata = {
  title: "Your Beliefs — Sponsio",
  description:
    "Your account: the belief coins you hold, your balance, and your wallet.",
  robots: { index: false },
};

// App surface, not a marketing page: no hero title — the user's identity
// is the header (Euphoria pattern). A near-solid wash quiets the photo
// strips so the cards carry the page.
export default function Profile() {
  return (
    <>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[#050505]/90" />
      <main className="min-h-0 flex-1 overflow-y-auto px-4 pt-24 pb-10 md:px-10">
        <ProfileClient />
      </main>
    </>
  );
}
