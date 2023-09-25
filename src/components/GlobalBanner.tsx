import { useGlobalBanners } from "@/hooks/useGlobalBanners";
import { Banner } from "./Banner";
import { X } from "react-feather";
import tw from "twin.macro";

export const GlobalBanners = () => {
  const { currentBanner, dismissGlobalBanner } = useGlobalBanners();

  if (currentBanner == null) return null;

  return (
    <Banner
      variant={currentBanner.variant}
      tw="rounded-none"
      textContainerStyles={tw`relative w-full flex justify-center`}
    >
      <p>{currentBanner.message}</p>

      <button
        type="button"
        title="Dismiss"
        css={[
          tw`absolute top-0 right-0`,
          tw`focus:outline-none text-gray-500 hover:text-gray-700`,
        ]}
        onClick={() => dismissGlobalBanner(currentBanner.id)}
      >
        <X tw="h-5 w-5" />
      </button>
    </Banner>
  );
};
