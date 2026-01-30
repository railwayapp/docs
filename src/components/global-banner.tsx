import { useGlobalBanners } from "@/hooks/use-global-banners";
import { Banner } from "./banner";
import { Icon } from "./icon";

export const GlobalBanners = () => {
  const { currentBanner, dismissGlobalBanner } = useGlobalBanners();

  if (currentBanner == null) return null;

  return (
    <Banner variant={currentBanner.variant} className="rounded-none">
      <p>{currentBanner.message}</p>

      <button
        type="button"
        title="Dismiss"
        className="absolute top-3 right-0 focus:outline-hidden text-muted-solid hover:text-muted-high-contrast"
        onClick={() => dismissGlobalBanner(currentBanner.id)}
      >
        <Icon name="Cross" className="h-5 w-5" />
      </button>
    </Banner>
  );
};
