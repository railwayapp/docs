import { useEffect } from "react";
import { hashRedirects } from "../../redirects";

export function useHashRedirect() {
  useEffect(() => {
    const { hash } = window.location;

    if (!hash) return;

    const { pathname } = window.location;

    const redirect = hashRedirects.find(redirect => {
      const sourceParts = redirect.source.split("#");
      
      return sourceParts.length === 2 && sourceParts[0] !== ""
        ? pathname + hash === redirect.source
        : hash === redirect.source;
    });

    if (redirect) window.location.replace(redirect.destination);
  }, []);
}
