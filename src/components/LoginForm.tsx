import React, { ComponentProps } from 'preact'
import { TextInput } from './TextInput'
import { getNhostClient } from '../utils/nhostClient'
import { useState } from 'preact/hooks'
import { Button } from './Button'

export interface LoginFormProps extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  onLogin(): void
}

export const LoginForm = ({ className = '', onLogin, ...props }: LoginFormProps) => {
  const nhost = getNhostClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [resetSuccess, setResetSuccess] = useState(false)

  const [error, setError] = useState('')

  const disabled = !email || !password

  return (
    <form
      action="#"
      className={`${className} tw-w-sm tw-max-w-full`}
      {...props}
      onSubmit={async (e) => {
        e.preventDefault()

        if (disabled) return

        const res = await nhost.auth
          .signInEmailPassword({ email, password })
          .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

        if (res instanceof Error) {
          setError('Wrong email or password.')
          return console.error(res)
        }

        onLogin()
      }}
    >
      <h3 class="tw-text-center tw-font-montserrat tw-text-2xl tw-font-bold">LOG IN</h3>
      <p class="tw-mb-4 tw-mt-1 tw-text-center tw-font-inter tw-text-xs tw-italic tw-text-gray-500">
        Take advantage of your subscriber benefits!
      </p>
      <TextInput
        id="login-email"
        className="tw-mb-3"
        type="email"
        name="email"
        label="Email"
        value={email}
        onInput={(e) => {
          setEmail(e.currentTarget.value)
          resetSuccess && setResetSuccess(false)
        }}
        required
      />
      <TextInput
        className="tw-mb-1"
        type="password"
        name="password"
        label="Password"
        value={password}
        onInput={(e) => setPassword(e.currentTarget.value)}
        required
      />
      {resetSuccess ? (
        <p class="tw-mb-3 tw-whitespace-break-spaces tw-text-sm tw-text-green-500">
          Check your inbox for a link to login and change your password!
        </p>
      ) : (
        <button
          type="button"
          class="tw-mb-3 tw-text-sm tw-text-gray-400 hover:tw-text-blue-500 focus:tw-text-blue-500 focus:tw-underline focus:tw-outline-none"
          onClick={async () => {
            if (!email) {
              return document.querySelector<HTMLInputElement>('#login-email')?.reportValidity()
            }

            const res = await nhost.auth
              .sendPasswordResetEmail({
                email,
                options: {
                  redirectTo: location.origin.includes('https://mywebsite.straffordmedia.com')
                    ? 'https://mywebsite.straffordmedia.com/site/0e650340/my-profile?preview=true&insitepreview=true&dm_device=mobile'
                    : 'https://thisweekhawaii.com/my-profile',
                },
              })
              .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

            if (res instanceof Error) {
              return setError('Unable to send forgot password email. Please check your email and try again.')
            }

            setResetSuccess(true)
          }}
        >
          I forgot my password...
        </button>
      )}
      {error && <p class="tw-mb-3 tw-text-sm tw-italic tw-text-red-500">{error}</p>}
      <Button type="submit" disabled={disabled}>
        Log In
      </Button>
    </form>
  )
}
