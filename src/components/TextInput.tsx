import React, { ComponentProps } from 'preact'
import { ReactNode, useId } from 'preact/compat'

export interface TextInputProps extends ComponentProps<'input'> {
  inputClass?: string
  label?: ReactNode
  description?: ReactNode
}

export const TextInput = ({
  className = '',
  type = 'text',
  inputClass = '',
  label,
  id: givenId,
  description,
  ...props
}: TextInputProps) => {
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
      <input
        id={id}
        type={type}
        class={`tw-form-input tw-w-full tw-rounded tw-border tw-border-red-300 tw-bg-white tw-ring-red-300 focus:tw-outline-none focus:tw-ring ${inputClass}`}
        {...props}
      />
      {description && <p class="tw-text-sm tw-text-gray-500">{description}</p>}
    </div>
  )
}
