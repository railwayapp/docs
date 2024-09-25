import { scrollToID } from "@/utils/scroll";
import React from "react";
import { Link as FeatherLinkIcon } from "react-feather";
import styled from "styled-components";
import tw from "twin.macro";

const StyledLinkIcon = styled.a`
  text-decoration: none;
  position: absolute;
  width: 3rem;
  height: 2rem;
  display: none;
  align-items: center;
  left: -2rem;
  &:hover {
    text-decoration: underline;
  }
`;

const StyledLinkHeading = styled.a`
  text-decoration: none;
  position: absolute;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
`;

const BaseStyledHeading = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding: 1.5rem 0 0;
  margin-bottom: 2rem;

  &:hover {
    ${StyledLinkIcon} {
      display: flex;
    }
    @media (max-width: 1300px) {
      ${StyledLinkIcon} {
        display: none;
      }
    }
  }
`;

const StyledHeadingH2 = styled(BaseStyledHeading).attrs({ as: "h2" })``;
const StyledHeadingH3 = styled(BaseStyledHeading).attrs({ as: "h3" })``;

export const H2: React.FC<{ id: string; children: React.ReactNode[] }> = ({
  id,
  children,
}) => {
  return (
    <StyledHeadingH2 id={id}>
      <StyledLinkIcon>
        <FeatherLinkIcon className="icon" size={20} />
      </StyledLinkIcon>
      <StyledLinkHeading onClick={scrollToID(id)} style={{ cursor: "pointer" }}>
        {children[1]}
      </StyledLinkHeading>
    </StyledHeadingH2>
  );
};

export const H3: React.FC<{ id: string; children: React.ReactNode[] }> = ({
  id,
  children,
}) => {
  return (
    <StyledHeadingH3 id={id}>
      <StyledLinkIcon>
        <FeatherLinkIcon className="icon" size={20} />
      </StyledLinkIcon>
      <StyledLinkHeading onClick={scrollToID(id)} style={{ cursor: "pointer" }}>
        {children[1]}
      </StyledLinkHeading>
    </StyledHeadingH3>
  );
};

export const H4: React.FC<{ id: string; children: React.ReactNode[] }> = ({
  id,
  children,
}) => {
  return (
    <h4 id={id} onClick={scrollToID(id, true)} style={{ cursor: "pointer" }} css={tw`mb-[1.5em]`}>
      {children[1]}
    </h4>
  );
};
