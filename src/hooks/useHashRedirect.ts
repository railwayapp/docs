import { useEffect } from "react";
import { useRouter } from "next/router";
import { hashRedirects } from "../../redirects";

export function useHashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;

    if (!hash) return;

    const redirect = hashRedirects.find(
      redirect => redirect.source === hash,
    );

    if (redirect) router.push(redirect.destination);
  }, [router]);

  return;
}
