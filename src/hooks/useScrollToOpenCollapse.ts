import { useEffect } from 'react';

export function useScrollToOpenCollapse() {
    useEffect(() => {
        const hash = window.location.hash.slice(1);
        if (!hash) return;

        const element = document.getElementById(hash);
        if (!element) return;

        const handleMutation = (mutations: MutationRecord[]) => {
            if (mutations.some(mutation =>
                mutation.type === 'attributes' &&
                mutation.attributeName === 'open' &&
                mutation.target === element
            )) {
                element.scrollIntoView();
                observer.disconnect();
            }
        };

        const observer = new MutationObserver(handleMutation);
        observer.observe(element, { attributes: true });

        return () => observer.disconnect();
    }, []);
}