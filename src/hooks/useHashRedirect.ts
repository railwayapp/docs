import { useEffect } from "react";
import { hashRedirects } from "../../redirects";

export function useHashRedirect() {
  useEffect(() => {
    const hash = window.location.hash;

    if (!hash) return;

    const redirect = hashRedirects.find(
      redirect => redirect.source === hash,
    );
  
    if (redirect) window.location.replace(redirect.destination);
  }, []);
}