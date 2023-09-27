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

const LaunchWeekBanner = ({
  linkText,
  isFirstStop,
  isLastStop,
}: {
  linkText: string;
  isFirstStop?: boolean;
  isLastStop?: boolean;
}) => (
  <>
    <span role="img">🚅</span>{" "}
    <span>
      <strong>Launch Week 01</strong> is now{" "}
      {isFirstStop ? "boarding" : "in service"}.{" "}
      {isFirstStop ? "First" : isLastStop ? "Last" : "Next"} stop:{" "}
      <Link href="https://railway.app/launch-week-01" tw="underline">
        {linkText}
      </Link>
      !
    </span>
  </>
);

const GLOBAL_BANNERS_KEY = "@railway/globalBanners";
const useGlobalBannersLocalStorage = () =>
  useLocalStorageState<Record<string, boolean>>(GLOBAL_BANNERS_KEY, {
    defaultValue: {},
  });

export const allGlobalBanners: GlobalBanner[] = [
  // Day 1
  // {
  //   id: "launch-week-day-1",
  //   message: <LaunchWeekBanner linkText="Regions" isFirstStop />,
  // },
  // Day 2
  // {
  //   id: "launch-week-day-2",
  //   message: <LaunchWeekBanner linkText="Next-Gen Databases" />,
  // },
  // Day 3
  {
    id: "launch-week-day-3",
    message: <LaunchWeekBanner linkText="Horizontal Scaling" />,
  },
  // Day 4
  // {
  //   id: "launch-week-day-4",
  //   message: <LaunchWeekBanner linkText="NO SPOILERS" />,
  // },
  // Day 5
  // {
  //   id: "launch-week-day-5",
  //   message: <LaunchWeekBanner linkText="NO SPOILERS" isLastStop />,
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
