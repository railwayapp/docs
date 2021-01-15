import { useDialog } from "@react-aria/dialog";
import { FocusScope } from "@react-aria/focus";
import {
  OverlayContainer,
  useModal,
  useOverlay,
  usePreventScroll,
} from "@react-aria/overlays";
import React, { useRef } from "react";
import { VisuallyHidden } from "react-aria";
import tw from "twin.macro";

export interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const ModalDialog: React.FC<Props> = ({ title, isOpen, onClose, children }) => {
  // Handle interacting outside the dialog and pressing
  // the Escape key to close the modal.
  const ref = useRef<HTMLDivElement | null>(null);
  const { overlayProps } = useOverlay(
    {
      isOpen,
      onClose,
      isDismissable: true,
    },
    ref,
  );

  // Prevent scrolling while the modal is open, and hide content
  // outside the modal from screen readers.
  usePreventScroll();
  const { modalProps } = useModal();

  // Get props for the dialog and its title
  const { dialogProps, titleProps } = useDialog({}, ref);

  return (
    <div
      css={[
        tw`fixed top-0 right-0 bottom-0 left-0 select-none`,
        tw`bg-black bg-opacity-50`,
      ]}
    >
      <FocusScope contain restoreFocus autoFocus>
        <div
          {...overlayProps}
          {...dialogProps}
          {...modalProps}
          ref={ref}
          tw="focus:outline-none"
        >
          <VisuallyHidden>
            <h3 {...titleProps} style={{ marginTop: 0 }}>
              {title}
            </h3>
          </VisuallyHidden>

          {children}
        </div>
      </FocusScope>
    </div>
  );
};

export const Modal: React.FC<Props> = props => {
  if (!props.isOpen) {
    return null;
  }

  return (
    <OverlayContainer>
      <ModalDialog {...props} />
    </OverlayContainer>
  );
};
