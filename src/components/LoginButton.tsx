import React, { ComponentProps } from 'preact'
import { Button } from './Button'
import { useState } from 'preact/hooks'
import { Modal } from './Modal'
import { ReactNode } from 'preact/compat'
import { Registration } from './Registration'
import { LoginForm } from './LoginForm'
import { useRememberedState } from '../hooks/useRememberedState'

export interface LoginButtonProps extends ComponentProps<'button'> {
  label?: ReactNode
  commsRefresh?(): void
}

export const LoginButton = ({ className = '', label = 'Login', commsRefresh, ...props }: LoginButtonProps) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [signingUp, setSigningUp] = useRememberedState('twh-is-signing-up', true)

  return (
    <>
      <Button className={`${className}`} {...props} onClick={() => setIsLoggingIn(true)}>
        {label}
      </Button>
      {isLoggingIn && (
        <Modal onClose={() => setIsLoggingIn(false)}>
          {signingUp ? (
            <Registration
              onSignUp={() => {
                setIsLoggingIn(false)
                commsRefresh?.()
              }}
            />
          ) : (
            <LoginForm
              onLogin={() => {
                setIsLoggingIn(false)
                commsRefresh?.()
              }}
            />
          )}
          <button
            class="tw-mt-2 tw-text-sm tw-text-blue-400 hover:tw-text-blue-500 focus:tw-text-blue-500 focus:tw-underline focus:tw-outline-none"
            onClick={() => setSigningUp((s) => !s)}
          >
            {signingUp ? 'Already have an account? Log in.' : 'Not a subscriber yet? Sign up.'}
          </button>
        </Modal>
      )}
    </>
  )
}
