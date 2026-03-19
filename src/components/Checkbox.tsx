import React, { ComponentProps } from 'preact'
import { ReactNode } from 'preact/compat'
import { useId } from 'preact/hooks'

export interface CheckboxProps extends Omit<ComponentProps<'input'>, 'type'> {
  label: ReactNode
  inputClass?: string
  description?: ReactNode
}

export const Checkbox = ({
  className = '',
  id: givenId,
  inputClass = '',
  label,
  description,
  ...props
}: CheckboxProps) => {
  const uId = useId()
  const id = givenId ?? uId

  return (
    <div class={`${className} tw-flex tw-gap-x-4`}>
      <input
        id={id}
        type="checkbox"
        className={`${inputClass} tw-form-checkbox tw-mt-1 tw-rounded tw-border-red-300 tw-text-red-500 tw-ring-red-300 tw-ring-offset-0`}
        aria-describedby={description ? `comments-description-${id}` : undefined}
        {...props}
      />
      {(label || description) && (
        <div>
          {label && (
            <label for={id} className={`tw-cursor-pointer tw-font-medium tw-text-gray-900`}>
              {label}
              {props.required && <span class="tw-ml-1 tw-text-xl tw-leading-3 tw-text-green-500">*</span>}
            </label>
          )}
          {description && (
            <p id={`comments-description-${id}`} className={`tw-text-sm tw-text-gray-500`}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
