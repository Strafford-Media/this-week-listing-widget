import React, { ComponentProps } from 'preact'
import { createPortal } from 'preact/compat'

export interface ModalProps extends ComponentProps<'div'> {
  onClose(): void
}

export const Modal = ({ className = '', children, onClose, ...props }: ModalProps) => {
  return createPortal(
    <div className={`${className} tw-flex-center tw-fixed tw-inset-0 tw-z-[99999]`} {...props}>
      <div class="tw-absolute tw-inset-0 tw-bg-white tw-opacity-20" onClick={() => onClose()}></div>
      <div class="tw-z-20 tw-max-h-[95dvh] tw-max-w-[95vw] tw-overflow-y-auto tw-rounded-lg tw-bg-white tw-p-4 tw-shadow-lg">
        {children}
      </div>
    </div>,
    document.body,
  )
}
