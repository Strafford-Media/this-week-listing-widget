import React, { ComponentProps } from 'preact'
import { Modal, ModalProps } from './Modal'
import { TextInput } from './TextInput'
import { useState } from 'preact/hooks'
import { getNhostClient } from '../utils/nhostClient'
import { Button } from './Button'

export interface ChangePasswordProps extends ModalProps {}

export const ChangePassword = ({ className = '', ...props }: ChangePasswordProps) => {
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')

  const [success, setSuccess] = useState(false)

  const disabled = !newPassword || newPassword.length < 9 || !!error

  return (
    <Modal {...props}>
      {!success ? (
        <form
          class="tw-space-y-4"
          action="#"
          onSubmit={async (e) => {
            e.preventDefault()

            const nhost = getNhostClient()

            if (disabled || !nhost) return

            const res = await nhost.auth
              .changeUserPassword({ newPassword })
              .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

            if (res instanceof Error) {
              console.error('Unable to change password', res)
              setError('An error occurred. Please try again.')
              return
            }

            setSuccess(true)

            setTimeout(() => {
              props.onClose()
            }, 2000)
          }}
        >
          <TextInput
            id="new_password"
            label="New Password"
            type="password"
            name="new_password"
            value={newPassword}
            onInput={(e) => {
              if (error) setError('')
              setNewPassword(e.currentTarget.value)
            }}
            required
          />
          {error && <p class="tw-text-sm tw-italic tw-text-red-500">{error}</p>}
          <Button type="submit" disabled={disabled}>
            Save
          </Button>
        </form>
      ) : (
        <h3 class="tw-text-center tw-text-2xl tw-text-green-500">Password Successfully Changed!</h3>
      )}
    </Modal>
  )
}
