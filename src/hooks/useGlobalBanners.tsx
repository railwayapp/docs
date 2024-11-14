import { BannerVariant } from "@/components/Banner";
import { Link } from "@/components/Link";
import { useMemo } from "react";
import useLocalStorageState from "use-local-storage-state";
import tw from "twin.macro";

export interface GlobalBanner {
  id: string;
  message: string | React.ReactElement;
  variant?: BannerVariant;
}

// const LaunchWeekBanner = ({
//   linkText,
//   isFirstStop,
//   isLastStop,
// }: {
//   linkText: string;
//   isFirstStop?: boolean;
//   isLastStop?: boolean;
// }) => (
//   <>
//     <span role="img">🚅</span>{" "}
//     <span>
//       <strong>Launch Week 01</strong> is now{" "}
//       {isFirstStop ? "boarding" : "in service"}.{" "}
//       {isFirstStop ? "First" : isLastStop ? "Last" : "Next"} stop:{" "}
//       <Link href="https://railway.com/launch-week-01" tw="underline">
//         {linkText}
//       </Link>
//       !
//     </span>
//   </>
// );

const GLOBAL_BANNERS_KEY = "@railway/globalBanners";
const useGlobalBannersLocalStorage = () =>
  useLocalStorageState<Record<string, boolean>>(GLOBAL_BANNERS_KEY, {
    defaultValue: {},
  });

export const allGlobalBanners: GlobalBanner[] = [
  // Day 1
  // {
  //   id: "some-id",
  //   message: <LaunchWeekBanner linkText="Feature" isFirstStop />,
  // },
];

export const useGlobalBanners = () => {
  const [viewedGlobalBanners, setViewedGlobalBanners] =
    useGlobalBannersLocalStorage();

  const dismissGlobalBanner = (id: string) => {
    setViewedGlobalBanners(currentBanners => ({
      ...currentBanners,
      [id]: true,
    }));
  };

  // Oldest banner that should be visible
  const currentBanner = useMemo(() => {
    const viewedBanners = Object.entries(viewedGlobalBanners)
      .filter(([, viewed]) => viewed)
      .map(([id]) => id);

    const unviewedBanners = allGlobalBanners.filter(
      banner => !viewedBanners.includes(banner.id),
    );

    return unviewedBanners[0] ?? null;
  }, [allGlobalBanners, viewedGlobalBanners]);

  return {
    currentBanner,
    dismissGlobalBanner,
  };
};
