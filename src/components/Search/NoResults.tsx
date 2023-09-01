import { DiscordIcon } from "@/components/Icons";
import { Link } from "@/components/Link";
import React from "react";
import { HelpCircle, Mail } from "react-feather";
import tw, { styled } from "twin.macro";

const ContactButton = styled(Link)`
  ${[
    tw`flex flex-row items-center gap-2 p-2`,
    tw`border border-solid rounded-lg`,
    tw`hover:bg-pink-100`,
    tw`[&>svg]:w-8`,
    tw`[&>svg]:h-8`,
  ]}
`;

const NoResults: React.FC = () => {
  return (
    <div css={[tw`flex flex-col items-center justify-center mb-4`]}>
      <HelpCircle size={64} css={tw`mt-8 mb-4`} />
      <div css={tw`flex flex-col items-center justify-center p-4`}>
        <p css={tw`font-bold mb-4 text-center`}>
          We couldn't find what you're searching for.
        </p>
        <div>
          <p css={tw`mb-4 text-center`}>Reach out to us if you need help:</p>
          <div css={tw`flex flex-row gap-4 items-center justify-center`}>
            <ContactButton href="https://discord.gg/railway">
              <DiscordIcon />
              Discord
            </ContactButton>
            <ContactButton href="mailto:team@railway.app">
              <Mail />
              Email
            </ContactButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoResults;
