import * as Dialog from "@radix-ui/react-dialog";
import React from "react";
import tw, { styled } from "twin.macro";

export interface Props {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
}

export const Modal: React.FC<Props> = ({ isOpen, onOpenChange, children }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      {/* <Dialog.Trigger>Open</Dialog.Trigger> */}
      <StyledOverlay />

      {children}
    </Dialog.Root>
  );
};

export const ModalTrigger = Dialog.Trigger;

const StyledOverlay = styled(Dialog.Overlay)`
  ${tw`fixed top-0 right-0 bottom-0 left-0 select-none`}
  ${tw`bg-black bg-opacity-50`}
`;

export const ModalContent = styled(Dialog.Content)`
  ${tw`fixed`}
  ${tw`focus:outline-none`}

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
