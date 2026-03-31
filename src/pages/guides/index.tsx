import { NextPage, GetStaticProps } from "next";
import { useState, useMemo } from "react";
import { Link } from "../../components/link";
import { SEO } from "../../components/seo";
import { Footer } from "../../components/footer";
import { allGuides, Guide } from "content-collections";
import { cn } from "@/lib/cn";

// Shared topic IDs
const TOPIC_IDS = {
  FRAMEWORKS: "frameworks",
  INFRASTRUCTURE: "infrastructure",
  CICD: "cicd",
} as const;

type TopicId = (typeof TOPIC_IDS)[keyof typeof TOPIC_IDS];

const TOPICS: { name: string; id: TopicId; description: string }[] = [
  {
    name: "Frameworks & Integrations",
    id: TOPIC_IDS.FRAMEWORKS,
    description: "Deploy your favorite tools",
  },
  {
    name: "Infrastructure",
    id: TOPIC_IDS.INFRASTRUCTURE,
    description: "Security, observability, and more",
  },
  {
    name: "CI/CD",
    id: TOPIC_IDS.CICD,
    description: "Automate deployments and rollouts",
  },
];

// Tags to exclude from filter (too generic or noisy)
const EXCLUDED_TAGS = new Set(["deployment"]);

// Framework icons from the homepage "Your stack, your way" section
const FRAMEWORK_ICONS: {
  slug: string;
  name: string;
  href: string;
  icon: React.ReactNode;
}[] = [
  {
    slug: "nextjs",
    name: "Next.js",
    href: "/guides/nextjs",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 1000 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-black dark:text-white"
      >
        <path
          d="M467.253 0.269139C465.103 0.464613 458.26 1.14878 452.102 1.63747C310.068 14.4411 177.028 91.0671 92.7664 208.841C45.8456 274.325 15.8358 348.605 4.49658 427.284C0.488759 454.748 0 462.86 0 500.098C0 537.336 0.488759 545.448 4.49658 572.912C31.6716 760.666 165.298 918.414 346.53 976.861C378.983 987.319 413.196 994.453 452.102 998.754C467.253 1000.42 532.747 1000.42 547.898 998.754C615.054 991.326 671.945 974.71 728.055 946.073C736.657 941.675 738.319 940.502 737.146 939.525C736.364 938.939 699.707 889.777 655.718 830.352L575.758 722.353L475.562 574.085C420.43 492.572 375.073 425.915 374.682 425.915C374.291 425.818 373.9 491.693 373.705 572.13C373.412 712.97 373.314 718.639 371.554 721.962C369.013 726.751 367.058 728.706 362.952 730.856C359.824 732.42 357.087 732.713 342.327 732.713H325.415L320.919 729.878C317.986 728.021 315.836 725.578 314.37 722.744L312.317 718.345L312.512 522.382L312.805 326.321L315.836 322.509C317.4 320.457 320.723 317.818 323.069 316.547C327.077 314.592 328.641 314.397 345.552 314.397C365.494 314.397 368.817 315.179 373.998 320.848C375.464 322.411 429.717 404.12 494.624 502.541C559.531 600.963 648.289 735.352 691.887 801.324L771.065 921.248L775.073 918.609C810.557 895.543 848.094 862.703 877.81 828.495C941.056 755.877 981.818 667.326 995.503 572.912C999.511 545.448 1000 537.336 1000 500.098C1000 462.86 999.511 454.748 995.503 427.284C968.328 239.53 834.702 81.7821 653.47 23.3352C621.505 12.975 587.488 5.84016 549.365 1.53972C539.98 0.562345 475.367 -0.51276 467.253 0.269139ZM671.945 302.668C676.637 305.014 680.45 309.51 681.818 314.201C682.6 316.743 682.796 371.085 682.6 493.549L682.307 669.281L651.32 621.781L620.235 574.281V446.538C620.235 363.95 620.626 317.525 621.212 315.277C622.776 309.803 626.197 305.503 630.89 302.962C634.897 300.909 636.364 300.714 651.711 300.714C666.178 300.714 668.719 300.909 671.945 302.668Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    slug: "nuxt",
    name: "Nuxt",
    href: "/guides/nuxt",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 32 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.92 21.3333H29.76C30.1379 21.3334 30.4995 21.2006 30.8267 21.0133C31.1539 20.8261 31.4911 20.591 31.68 20.2667C31.8689 19.9423 32.0001 19.5743 32 19.1999C31.9999 18.8254 31.8691 18.4576 31.68 18.1334L23.68 4.37333C23.4912 4.04907 23.2605 3.81389 22.9333 3.62667C22.6062 3.43944 22.1377 3.30667 21.76 3.30667C21.3823 3.30667 21.0205 3.43944 20.6933 3.62667C20.3662 3.81389 20.1355 4.04907 19.9467 4.37333L17.92 7.89333L13.8667 1.06641C13.6777 0.742173 13.4472 0.400524 13.12 0.213333C12.7928 0.0261426 12.4311 0 12.0533 0C11.6755 0 11.3139 0.0261426 10.9867 0.213333C10.6595 0.400524 10.3223 0.742173 10.1333 1.06641L0.213334 18.1334C0.0242117 18.4576 0.000165207 18.8254 8.11525e-07 19.1999C-0.000163584 19.5743 0.0244964 19.9423 0.213334 20.2666C0.402171 20.5909 0.739461 20.8261 1.06667 21.0133C1.39387 21.2006 1.75549 21.3334 2.13333 21.3333H9.6C12.5586 21.3333 14.712 20.0061 16.2133 17.4933L19.84 11.2L21.76 7.89333L27.6267 17.92H19.84L17.92 21.3333ZM9.49333 17.92H4.26667L12.0533 4.48L16 11.2L13.3857 15.7573C12.3887 17.3877 11.252 17.92 9.49333 17.92Z"
          fill="#00DC82"
        />
      </svg>
    ),
  },
  {
    slug: "laravel",
    name: "Laravel",
    href: "/guides/laravel",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 31 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_guides_laravel)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M30.5391 7.11623C30.5504 7.15817 30.5562 7.2014 30.5563 7.24484V13.9968C30.5563 14.0835 30.5334 14.1686 30.49 14.2436C30.4466 14.3186 30.3841 14.3808 30.3089 14.4239L24.6418 17.6867V24.1538C24.6418 24.3298 24.5483 24.4922 24.3957 24.5808L12.5662 31.3907C12.5391 31.4061 12.5095 31.4159 12.48 31.4264C12.4689 31.4301 12.4585 31.4368 12.4468 31.4399C12.3641 31.4617 12.2772 31.4617 12.1945 31.4399C12.1809 31.4362 12.1686 31.4288 12.1557 31.4239C12.1286 31.4141 12.1003 31.4055 12.0745 31.3907L0.247385 24.5808C0.172251 24.5377 0.109822 24.4755 0.0663905 24.4005C0.022959 24.3255 5.95319e-05 24.2404 0 24.1538L0 3.89777C0 3.85346 0.00615385 3.81038 0.0172308 3.76854C0.0209231 3.75438 0.0295385 3.74146 0.0344615 3.72731C0.0436923 3.70146 0.0523077 3.675 0.0658462 3.651C0.0750769 3.635 0.0886154 3.62207 0.0996923 3.60731C0.113846 3.58761 0.126769 3.56731 0.143385 3.55007C0.157538 3.53592 0.176 3.52546 0.192 3.51315C0.209846 3.49838 0.225846 3.48238 0.246154 3.47069L6.16061 0.0657669C6.2355 0.022678 6.32038 0 6.40677 0C6.49316 0 6.57804 0.022678 6.65292 0.0657669L12.5668 3.47069H12.568C12.5877 3.483 12.6043 3.49838 12.6222 3.51254C12.6382 3.52484 12.656 3.53592 12.6702 3.54946C12.6874 3.56731 12.6997 3.58761 12.7145 3.60731C12.7249 3.62207 12.7391 3.635 12.7477 3.651C12.7618 3.67561 12.7698 3.70146 12.7797 3.72731C12.7846 3.74146 12.7932 3.75438 12.7969 3.76915C12.8083 3.81109 12.814 3.85433 12.8142 3.89777V16.5495L17.7422 13.7119V7.24423C17.7422 7.20115 17.7483 7.15746 17.7594 7.11623C17.7637 7.10146 17.7717 7.08854 17.7766 7.07438C17.7865 7.04854 17.7951 7.02207 17.8086 6.99807C17.8178 6.98207 17.8314 6.96915 17.8418 6.95438C17.8566 6.93469 17.8689 6.91438 17.8862 6.89715C17.9003 6.883 17.9182 6.87254 17.9342 6.86023C17.9526 6.84546 17.9686 6.82946 17.9883 6.81777L23.9034 3.41284C23.9782 3.3697 24.0631 3.34698 24.1495 3.34698C24.2359 3.34698 24.3208 3.3697 24.3957 3.41284L30.3095 6.81777C30.3305 6.83008 30.3465 6.84546 30.3649 6.85961C30.3803 6.87192 30.3982 6.883 30.4123 6.89654C30.4295 6.91438 30.4418 6.93469 30.4566 6.95438C30.4677 6.96915 30.4812 6.98207 30.4898 6.99807C30.504 7.02207 30.512 7.04854 30.5218 7.07438C30.5274 7.08854 30.5354 7.10146 30.5391 7.11623ZM29.5705 13.7119V8.09715L27.5009 9.28854L24.6418 10.9347V16.5495L29.5711 13.7119H29.5705ZM23.6566 23.8688V18.2504L20.8443 19.8565L12.8135 24.4399V30.1113L23.6566 23.8688ZM0.985846 4.75007V23.8688L11.8277 30.1107V24.4405L6.16369 21.235L6.16185 21.2338L6.15938 21.2325C6.14031 21.2215 6.12431 21.2055 6.10646 21.1919C6.09108 21.1796 6.07323 21.1698 6.05969 21.1562L6.05846 21.1544C6.04246 21.139 6.03138 21.1199 6.01785 21.1027C6.00554 21.0861 5.99077 21.0719 5.98092 21.0547L5.98031 21.0528C5.96923 21.0344 5.96246 21.0122 5.95446 20.9913C5.94646 20.9728 5.936 20.9556 5.93108 20.9359C5.92492 20.9125 5.92369 20.8873 5.92123 20.8633C5.91877 20.8448 5.91385 20.8264 5.91385 20.8079V20.8067V7.58761L3.05538 5.94084L0.985846 4.75007ZM6.40738 1.06146L1.48 3.89777L6.40615 6.73407L11.3329 3.89715L6.40615 1.06146H6.40738ZM8.96985 18.7624L11.8283 17.1168V4.75007L9.75877 5.94146L6.89969 7.58761V19.9544L8.96985 18.7624ZM24.1495 4.40854L19.2228 7.24484L24.1495 10.0812L29.0757 7.24423L24.1495 4.40854ZM23.6566 10.9347L20.7975 9.28854L18.728 8.09715V13.7119L21.5865 15.3575L23.6566 16.5495V10.9347ZM12.32 23.5876L19.5465 19.4621L23.1588 17.4005L18.2357 14.5661L12.5674 17.8295L7.40123 20.8036L12.32 23.5876Z"
            fill="#FF2D20"
          />
        </g>
        <defs>
          <clipPath id="clip0_guides_laravel">
            <rect width="30.7692" height="32" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
  },
  {
    slug: "django",
    name: "Django",
    href: "/guides/django",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 25 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#092E20] dark:text-white"
      >
        <path
          d="M11.2803 0H16.5128V24.2194C13.8286 24.729 11.8579 24.9329 9.71749 24.9329C3.32969 24.9327 0 22.0451 0 16.5066C0 11.1722 3.53375 7.70688 9.00382 7.70688C9.85317 7.70688 10.4987 7.77461 11.2803 7.97845V0ZM11.2803 12.1913C10.6688 11.9876 10.1592 11.9197 9.51365 11.9197C6.86344 11.9197 5.33438 13.5507 5.33438 16.4045C5.33438 19.1908 6.79549 20.7197 9.47967 20.7197C10.057 20.7197 10.5329 20.6857 11.2803 20.584V12.1913Z"
          fill="currentColor"
        />
        <path
          d="M24.8366 8.08037V20.2098C24.8366 24.3891 24.5309 26.3936 23.6136 28.1265C22.764 29.7916 21.6426 30.8446 19.3324 31.9999L14.4736 29.6895C16.7841 28.6023 17.9052 27.6513 18.6187 26.1897C19.3664 24.6948 19.6044 22.9619 19.6044 18.4092V8.08037H24.8366ZM19.6044 0.027832H24.8366V5.39619H19.6044V0.027832Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    slug: "rails",
    name: "Rails",
    href: "/guides/rails",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_guides_rails)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M27.4205 3.68421C24.369 2.17846 21.2435 2.02521 18.0435 3.15646C15.0988 4.19746 12.7498 6.06021 11.0035 8.59721C8.04877 12.8902 5.90252 17.5745 4.69977 22.663C4.08377 25.2672 3.68477 28.0295 3.79202 30.719C3.80077 30.9372 3.83327 31 3.85477 31.5H18.9463C18.903 31 18.8745 31.146 18.837 31.0507C18.0433 29.0242 17.4148 26.8842 16.98 24.7512C16.3555 21.6885 16.0285 18.569 16.6735 15.478C17.5763 11.1497 20.0435 8.02671 24.2028 6.40721C26.5588 5.49046 28.795 5.75121 30.7563 7.47271C30.7743 7.48846 30.8113 7.47896 30.8593 7.48671L31.5005 6.51596C30.2655 5.34021 28.9085 4.41871 27.4205 3.68421ZM0.834023 23.5985C0.719023 24.5792 0.611523 25.4975 0.499023 26.4612L3.28202 26.7952L3.79177 23.822C2.77802 23.7452 1.81527 23.6725 0.834023 23.5985ZM6.29652 15.052L3.67877 14.0277L2.83277 16.4295L5.50052 17.2845C5.77052 16.5267 6.02452 15.814 6.29652 15.052ZM18.6513 28.4667C19.545 28.5332 20.4405 28.579 21.427 28.6365C21.0688 27.8917 20.7505 27.2182 20.4173 26.5527C20.3808 26.4805 20.2575 26.4107 20.1738 26.4095C19.4155 26.3985 18.6568 26.4032 17.851 26.4032C18.0325 27.0602 18.1903 27.6665 18.375 28.264C18.4028 28.3542 18.5518 28.4595 18.6513 28.4667ZM10.7333 7.77571L8.74452 6.45871C8.21152 7.05446 7.69752 7.62871 7.15477 8.23496L9.19927 9.60896L10.7333 7.77571ZM17.0668 21.118C17.0635 21.1982 17.1358 21.326 17.2063 21.3577C17.9225 21.6797 18.6463 21.9865 19.4343 22.326C19.4015 21.703 19.3795 21.1822 19.3423 20.6625C19.3355 20.569 19.2915 20.4345 19.2223 20.396C18.5645 20.032 17.8975 19.6842 17.1683 19.2972C17.1285 19.9635 17.088 20.5402 17.0668 21.118ZM16.4775 3.07496L15.116 1.52971L13.2413 2.50421C13.7103 3.07571 14.153 3.61496 14.605 4.16521L16.4775 3.07496ZM17.3313 15.369C17.2905 15.4625 17.3443 15.6607 17.4245 15.733C17.9683 16.2235 18.5305 16.693 19.156 17.2282C19.2993 16.6282 19.4343 16.0935 19.5488 15.555C19.569 15.4592 19.5408 15.301 19.4743 15.2475C18.9878 14.8552 18.4855 14.4817 17.965 14.0847C17.7363 14.5385 17.5145 14.9455 17.3313 15.369ZM20.4438 2.26296C21.1388 2.28171 21.8345 2.27346 22.5685 2.27346C22.4953 1.76246 22.4603 1.37521 22.373 1.00046C22.347 0.888961 22.1793 0.740461 22.066 0.730961C21.3693 0.674461 20.6698 0.652711 19.9033 0.616211C20.0055 1.13196 20.0835 1.58646 20.1938 2.03321C20.217 2.12796 20.3555 2.26046 20.4438 2.26296ZM21.29 11.1817C21.3255 11.1152 21.3345 10.9945 21.2973 10.9365C20.9558 10.4022 20.601 9.87621 20.2338 9.32271L19.0438 10.4157L20.6893 12.2392C20.9103 11.8545 21.108 11.5222 21.29 11.1817ZM22.5738 7.54996L23.2845 8.87021C24.3968 8.26071 24.5033 8.04021 24.1095 7.16171L22.5738 7.54996ZM27.8955 3.48171C28.3583 3.76721 28.847 4.01046 29.3435 4.27796L29.676 3.76046C29.0705 3.31771 28.486 2.88946 27.8228 2.40396C27.7968 2.67996 27.758 2.87271 27.768 3.06321C27.776 3.20846 27.8003 3.42321 27.8955 3.48171ZM27.25 7.66146C27.75 7.71571 28.5 7.76746 29 7.82221V7.14271C28.5 7.03321 27.75 6.92471 27.25 6.81196V7.66146Z"
            fill="#CC0000"
          />
        </g>
        <defs>
          <clipPath id="clip0_guides_rails">
            <rect width="32" height="32" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
  },
  {
    slug: "remix",
    name: "Remix",
    href: "/guides/remix",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 32 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-black dark:text-white"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.2806 15.2294C16.4568 17.5112 16.4568 18.5807 16.4568 19.7483H11.218C11.218 19.4939 11.2225 19.2613 11.227 19.0253C11.2412 18.292 11.256 17.5274 11.1381 15.983C10.9823 13.7222 10.0161 13.2198 8.23961 13.2198H6.66571H0V9.10626H8.48894C10.7329 9.10626 11.8549 8.41838 11.8549 6.59713C11.8549 4.99568 10.7329 4.02521 8.48894 4.02521H0V0H9.42393C14.5041 0 17.0286 2.41787 17.0286 6.28018C17.0286 9.16906 15.2521 11.0531 12.8522 11.3671C14.8781 11.7754 16.0623 12.9372 16.2806 15.2294Z"
          fill="currentColor"
        />
        <path
          d="M0 19.7482V16.6816H5.53933C6.46459 16.6816 6.66548 17.3732 6.66548 17.7855V19.7482H0Z"
          fill="currentColor"
        />
        <path
          d="M27.8647 14.4411C27.3983 15.5375 26.5278 16.0074 25.1597 16.0074C23.6362 16.0074 22.3925 15.193 22.2682 13.47H31.9999V12.0603C31.9999 8.26994 29.5437 5.07471 24.9109 5.07471C20.5892 5.07471 17.3557 8.23861 17.3557 12.6556C17.3557 17.1038 20.5271 19.7978 24.9732 19.7978C28.642 19.7978 31.1916 18.0122 31.9067 14.817L27.8647 14.4411ZM22.3304 11.0266C22.5169 9.71093 23.2321 8.7085 24.8488 8.7085C26.3412 8.7085 27.1495 9.77357 27.2118 11.0266H22.3304Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    slug: "rocket",
    name: "Rocket",
    href: "/guides/rocket",
    icon: (
      <img
        src="https://res.cloudinary.com/railway/image/upload/v1739370994/rocket_o65iea.png"
        width="24"
        height="24"
        alt=""
      />
    ),
  },
  {
    slug: "phoenix",
    name: "Phoenix",
    href: "/guides/phoenix",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 32 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.0168 15.2549L11.7653 15.2091C9.979 14.8769 8.85025 13.7966 8.316 12.0974C7.98175 11.0381 8.58775 10.2586 9.6985 10.2074C10.6077 10.1649 11.2308 10.6879 11.781 11.2961C12.4908 12.0799 13.141 12.9176 13.838 13.7136C14.8415 14.8594 16.024 15.5971 17.6418 15.3694C19.092 15.1654 20.3567 14.5834 21.4562 13.6251C21.6215 13.4811 21.803 13.3554 21.9775 13.2214L21.8675 13.0919C20.944 13.3794 20.0025 13.4751 19.04 13.4269C17.5843 13.3539 16.1968 13.0494 14.9555 12.2504C13.8228 11.5209 12.9873 10.5434 12.5905 9.23789C12.2697 8.18289 12.9255 7.44514 14.0192 7.59764C14.451 7.65814 14.8145 7.85264 15.1415 8.12814C15.407 8.35314 15.6623 8.59064 15.9333 8.80864C17.2093 9.83414 18.992 9.89114 20.6108 8.77764C17.9487 8.76564 16.1375 7.30089 14.5468 5.44514C13.9242 4.71889 13.3165 3.97989 12.6807 3.26464C11.451 1.88139 10.087 0.662889 8.21975 0.246639C5.83275 -0.283861 3.52925 0.0636389 1.31825 1.07564C0.8775 1.27739 0.45425 1.51264 0 1.89064C0.225 1.89064 0.3475 1.89314 0.47 1.89064C1.585 1.86139 2.4205 2.35664 3.023 3.26864C3.4615 3.93239 3.668 4.68289 3.8255 5.45489C4.05925 6.60089 3.938 7.76864 4.07325 8.92014C4.42 11.8794 5.9325 13.9444 8.7485 15.0019C9.7815 15.3899 10.8405 15.5189 12.0165 15.2544L12.0168 15.2549ZM4.899 1.75489C4.45425 1.86689 4.09875 1.68739 3.7325 1.31664C4.36 1.16039 4.9135 1.09964 5.50825 1.07589C5.4595 1.46239 5.2315 1.67089 4.8995 1.75489H4.899ZM19.482 19.0364C19.4433 18.7511 19.1995 18.6256 19.008 18.4769C18.162 17.8179 17.1717 17.5844 16.1222 17.5654C15.4957 17.5536 14.8757 17.5071 14.2855 17.2874C14.0145 17.1874 13.711 17.0574 13.7185 16.7079C13.7253 16.3524 14.0343 16.2521 14.3155 16.1681C14.5455 16.1001 14.783 16.0556 15.0448 15.9944C14.3795 15.5679 13.7295 15.5091 12.8632 15.8576C11.4992 16.4051 10.155 16.3406 8.79575 15.8501C8.02825 15.5726 7.347 15.1376 6.63825 14.7526L6.61875 14.7664C6.62479 14.7619 6.63079 14.7574 6.63675 14.7529C6.61925 14.6996 6.588 14.6981 6.547 14.7284L6.6025 14.7771C7.19025 15.7409 7.985 16.5164 8.88275 17.1791C10.6112 18.4549 12.499 19.2161 14.7083 18.8786C15.4224 18.7691 16.1402 18.685 16.8603 18.6266C17.7628 18.5536 18.622 18.8081 19.482 19.0364ZM15.317 5.20889C15.269 5.17439 15.223 5.08789 15.1252 5.17739C15.9205 6.25289 16.9412 7.04489 18.1707 7.54389C20.1547 8.34914 22.1685 8.48714 24.2283 7.77639C25.8275 7.22489 26.977 7.76364 27.5742 9.31639C27.6607 7.51414 26.6003 6.20089 24.9118 5.94389C23.9618 5.79889 23.0842 6.11389 22.195 6.37214C19.7188 7.09014 17.417 6.73589 15.3167 5.20889H15.317ZM27.6588 12.2379C27.9813 12.2646 28.3043 12.2939 28.6268 12.3221C27.8978 11.6821 27.0093 11.6309 26.11 11.6821C24.7418 11.7596 23.7558 12.5496 22.8565 13.4921C22.064 14.3236 21.348 15.2559 20.1665 15.5901C20.1865 15.6256 20.1915 15.6436 20.197 15.6436C20.356 15.6459 20.515 15.6531 20.6737 15.6459C22.3908 15.5684 24.0083 15.2061 25.2945 13.9599C25.7 13.5679 26.062 13.1321 26.4535 12.7249C26.78 12.3849 27.1753 12.1966 27.6588 12.2374V12.2379ZM23.6702 10.1099C22.389 10.2221 21.2763 10.7519 20.231 11.4509C19.426 11.9884 18.566 12.2429 17.5987 12.0751C17.4287 12.0451 17.2572 12.0231 17.0865 11.9976L17.0807 12.0686C17.1423 12.1006 17.2015 12.1374 17.2652 12.1631C17.4265 12.2269 17.5853 12.3036 17.7528 12.3431C19.6133 12.7856 21.3948 12.5591 23.0005 11.5216C24.0127 10.8676 25.0605 10.7436 26.1963 10.9126C26.3113 10.9301 26.4255 10.9504 26.5408 10.9616C26.6473 10.9716 26.7587 11.0774 26.903 10.9629C25.9102 10.2456 24.8405 10.0079 23.6702 10.1099ZM19.0915 5.76064C19.7635 5.78389 20.4325 5.69564 21.1357 5.27814C20.9295 5.29614 20.8428 5.29614 20.7588 5.31264C19.79 5.50564 18.921 5.29439 18.1462 4.68239C17.8625 4.45789 17.5737 4.23864 17.2857 4.01839C16.145 3.14639 14.8365 2.85439 13.4058 2.87939C13.4285 2.94939 13.4307 2.99789 13.4552 3.02289C15.0125 4.59714 16.814 5.68239 19.0915 5.76064ZM30.359 13.8404C29.3958 12.8846 28.1025 12.7619 26.906 13.5956C27.698 13.6309 28.2925 13.8836 28.7745 14.3831C28.9434 14.5621 29.1234 14.7303 29.3132 14.8869C30.0425 15.4749 31.2778 15.5031 32 14.9574C31.152 14.6266 31.1517 14.6266 30.359 13.8404ZM20.763 21.1584C19.9165 19.5819 18.4932 19.2264 16.8487 19.3321C17.3338 19.4644 17.7925 19.6786 18.2052 19.9656C18.5882 20.2326 18.9103 20.5626 19.2278 20.9019C19.8563 21.5731 20.8378 21.9844 21.4885 21.8454C21.1898 21.6576 20.9242 21.4586 20.763 21.1584ZM28.642 12.3546C28.642 12.3441 28.6423 12.3344 28.643 12.3236L28.6268 12.3221L28.6362 12.3299L28.6418 12.3541L28.642 12.3546ZM19.5285 19.0736C19.5175 19.0672 19.5065 19.0609 19.4955 19.0546C19.4965 19.0616 19.4988 19.0683 19.5023 19.0744C19.5048 19.0781 19.5195 19.0744 19.5285 19.0736ZM19.4955 19.0546L19.4918 19.0394L19.4818 19.0369L19.4842 19.0484L19.495 19.0546H19.4955Z"
          fill="#FD4F00"
        />
      </svg>
    ),
  },
];

// Map framework slug to icon for use on cards
const FRAMEWORK_ICON_MAP = new Map(
  FRAMEWORK_ICONS.map(fw => [fw.slug, fw.icon]),
);

function getGuideSlug(guide: Guide): string {
  return guide._raw.flattenedPath;
}

interface GuidesPageProps {
  guides: Guide[];
}

const VISIBLE_COUNT = 20;

const GuidesPage: NextPage<GuidesPageProps> = ({ guides }) => {
  const [activeTopic, setActiveTopic] = useState<TopicId | "all">("all");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  // Tags with count >= 2, sorted descending by count
  const tagsWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const guide of guides) {
      for (const tag of guide.tags ?? []) {
        if (!EXCLUDED_TAGS.has(tag)) {
          counts[tag] = (counts[tag] || 0) + 1;
        }
      }
    }
    return Object.entries(counts)
      .filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));
  }, [guides]);

  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = { all: guides.length };
    for (const guide of guides) {
      counts[guide.topic] = (counts[guide.topic] || 0) + 1;
    }
    return counts;
  }, [guides]);

  // Filter by topic + tags (OR logic for tags)
  const filteredGuides = useMemo(() => {
    let result = guides.slice();

    if (activeTopic !== "all") {
      result = result.filter(g => g.topic === activeTopic);
    }

    if (activeTags.size > 0) {
      result = result.filter(g =>
        Array.from(activeTags).some(tag => g.tags?.includes(tag)),
      );
    }

    return result.sort((a, b) => a.title.localeCompare(b.title));
  }, [guides, activeTopic, activeTags]);

  const displayedGuides = showAll
    ? filteredGuides
    : filteredGuides.slice(0, VISIBLE_COUNT);
  const hasMore = filteredGuides.length > VISIBLE_COUNT;

  const toggleTag = (tag: string) => {
    setActiveTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
    setShowAll(false);
  };

  const clearFilters = () => {
    setActiveTopic("all");
    setActiveTags(new Set());
    setShowAll(false);
  };

  const hasActiveFilters = activeTopic !== "all" || activeTags.size > 0;

  return (
    <>
      <SEO
        title="Guides | Railway"
        description="In-depth guides, tutorials, and how-tos for deploying on Railway"
        url="https://docs.railway.com/guides"
      />
      <div className="w-full z-10 flex gap-0 lg:gap-10">
        {/* Filter sidebar — desktop only */}
        <aside className="hidden lg:block w-48 shrink-0 sticky top-[77px] self-start max-h-[calc(100vh-77px)] overflow-y-auto pb-12">
          <div className="flex flex-col gap-6">
            {/* Topics */}
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-base mb-3">
                Topic
              </h3>
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => { setActiveTopic("all"); setShowAll(false); }}
                  className={cn(
                    "text-left text-sm px-2 py-1.5 rounded-md transition-colors",
                    activeTopic === "all"
                      ? "bg-muted-element text-foreground font-medium"
                      : "text-muted-base hover:text-muted-high-contrast hover:bg-muted-element/50",
                  )}
                >
                  All
                  <span className="ml-1.5 text-xs text-muted-base">
                    {topicCounts.all}
                  </span>
                </button>
                {TOPICS.map(topic => (
                  <button
                    key={topic.id}
                    onClick={() => { setActiveTopic(topic.id); setShowAll(false); }}
                    className={cn(
                      "text-left text-sm px-2 py-1.5 rounded-md transition-colors",
                      activeTopic === topic.id
                        ? "bg-muted-element text-foreground font-medium"
                        : "text-muted-base hover:text-muted-high-contrast hover:bg-muted-element/50",
                    )}
                  >
                    {topic.name}
                    <span className="ml-1.5 text-xs text-muted-base">
                      {topicCounts[topic.id] || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-base mb-3">
                Tags
              </h3>
              <div className="flex flex-col gap-0.5">
                {tagsWithCounts.map(({ tag, count }) => (
                  <label
                    key={tag}
                    className={cn(
                      "flex items-center gap-2 text-sm px-2 py-1.5 rounded-md transition-colors cursor-pointer",
                      activeTags.has(tag)
                        ? "text-foreground"
                        : "text-muted-base hover:text-muted-high-contrast hover:bg-muted-element/50",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={activeTags.has(tag)}
                      onChange={() => toggleTag(tag)}
                      className="rounded border-muted text-primary-solid focus:ring-primary-solid focus:ring-offset-0 h-3.5 w-3.5"
                    />
                    <span className="flex-1 truncate">{tag}</span>
                    <span className="text-xs text-muted-base tabular-nums">
                      {count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-left text-sm text-primary-base hover:text-primary-high-contrast transition-colors px-2"
              >
                Clear filters
              </button>
            )}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-4xl mb-4 text-foreground font-serif font-medium"
              style={{
                lineHeight: 1.13,
                letterSpacing: "-0.035em",
                fontSize: "2.5rem",
              }}
            >
              Guides
            </h1>
            <p className="text-lg text-muted-base">
              In-depth guides, tutorials, and how-tos for deploying on Railway
            </p>
          </div>

          {/* Framework icons */}
          <div className="mb-10">
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {FRAMEWORK_ICONS.map(fw => (
                <Link
                  key={fw.slug}
                  href={fw.href}
                  className="group flex flex-col items-center justify-center border rounded-lg p-3 md:p-4 transition-all duration-200 border-muted bg-muted-element/50 hover:bg-muted-element dark:bg-muted-element/20 dark:hover:bg-muted-element/50"
                >
                  {fw.icon}
                  <span className="text-xs mt-1.5 text-muted-high-contrast group-hover:text-foreground transition-colors text-center">
                    {fw.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile filters */}
          <div className="flex flex-wrap gap-1.5 mb-6 lg:hidden">
            <button
              onClick={() => { setActiveTopic("all"); setShowAll(false); }}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
                activeTopic === "all"
                  ? "bg-foreground text-muted-app"
                  : "bg-muted-element text-muted-high-contrast hover:bg-muted-element-hover",
              )}
            >
              All
            </button>
            {TOPICS.map(topic => (
              <button
                key={topic.id}
                onClick={() => { setActiveTopic(topic.id); setShowAll(false); }}
                className={cn(
                  "px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
                  activeTopic === topic.id
                    ? "bg-foreground text-muted-app"
                    : "bg-muted-element text-muted-high-contrast hover:bg-muted-element-hover",
                )}
              >
                {topic.name}
              </button>
            ))}
          </div>

          {/* Guide list */}
          {displayedGuides.length > 0 ? (
            <div className="flex flex-col gap-2">
              {displayedGuides.map(guide => {
                const slug = getGuideSlug(guide);
                const icon = FRAMEWORK_ICON_MAP.get(slug);

                return (
                  <Link
                    key={guide.url}
                    href={guide.url}
                    className="group flex items-center gap-3 border rounded-lg px-4 py-3 transition-all duration-200 border-muted bg-muted-element/50 hover:bg-muted-element dark:bg-muted-element/20 dark:hover:bg-muted-element/50"
                  >
                    {icon && (
                      <span className="shrink-0 [&>svg]:w-5 [&>svg]:h-5 [&>img]:w-5 [&>img]:h-5">
                        {icon}
                      </span>
                    )}

                    <span className="font-medium text-sm text-foreground group-hover:text-foreground transition-colors flex-1 min-w-0 truncate">
                      {guide.title}
                    </span>

                    {guide.tags && guide.tags.length > 0 && (
                      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                        {guide.tags
                          .filter((t: string) => !EXCLUDED_TAGS.has(t))
                          .slice(0, 3)
                          .map((tag: string) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-[11px] font-medium rounded-full border border-muted text-muted-base"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-base text-sm">
                No guides match your filters.
              </p>
              <button
                onClick={clearFilters}
                className="mt-2 text-sm font-medium text-primary-base hover:text-primary-high-contrast transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Show all / Show less */}
          {hasMore && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-4 text-sm font-medium text-primary-base hover:text-primary-high-contrast transition-colors flex items-center gap-1"
            >
              {showAll
                ? "Show less"
                : `Show all ${filteredGuides.length} guides`}
              <span
                className={cn(
                  "text-base transition-transform duration-200",
                  showAll ? "rotate-180" : "",
                )}
              >
                ↓
              </span>
            </button>
          )}

          <Footer />
        </div>
      </div>
    </>
  );
};

export default GuidesPage;

export const getStaticProps: GetStaticProps<GuidesPageProps> = async () => {
  return {
    props: {
      guides: allGuides,
    },
  };
};
