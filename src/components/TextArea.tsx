import React, { ComponentProps } from 'preact'
import { ReactNode, useId } from 'preact/compat'

export interface TextAreaProps extends ComponentProps<'textarea'> {
  inputClass?: string
  label?: ReactNode
  description?: ReactNode
}

export const TextArea = ({
  className = '',
  inputClass = '',
  label,
  id: givenId,
  description,
  ...props
}: TextAreaProps) => {
  const uId = useId()
  const id = givenId ?? uId

  return (
    <div className={`${className}`}>
      {label && (
        <label class="tw-block tw-font-medium" for={id}>
          {label}
          {props.required && <span class="tw-ml-1 tw-text-xl tw-leading-3 tw-text-green-500">*</span>}
        </label>
      )}
      <textarea
        id={id}
        class={`tw-form-textarea tw-w-full tw-rounded tw-border tw-border-red-300 tw-bg-white focus:tw-ring ${inputClass}`}
        {...props}
      />
      {description && <p class="tw-text-sm tw-text-gray-500">{description}</p>}
    </div>
  )
}
