import { useIsLoggedIn } from '../hooks/useIsLoggedIn'
import React, { ComponentProps } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { getNhostClient } from '../utils/nhostClient'

export interface EditableUserDisplayNameProps extends ComponentProps<'input'> {}

export const EditableUserDisplayName = ({ className = '', ...props }: EditableUserDisplayNameProps) => {
  const { user, refreshUser } = useIsLoggedIn()

  const [displayName, setDisplayName] = useState(user?.displayName ?? '')

  useEffect(() => {
    if (user?.displayName != null) setDisplayName(user.displayName)
  }, [user?.displayName])

  const saveName = async () => {
    const nhost = getNhostClient()
    if (!nhost || !user?.id || displayName === user.displayName) return

    const res = await nhost.graphql
      .request({
        query: `mutation updateUserData ($id: uuid!, $set: users_set_input!) {
          updateUser(pk_columns: {id: $id}, _set: $set) {
            id
            displayName
            __typename
          }
        }`,
        variables: { id: user.id, set: { displayName } },
      })
      .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

    if (res instanceof Error) {
      return console.error('Could not update user display name', res)
    }

    refreshUser()
  }

  return (
    <input
      id="user-display-name"
      type="text"
      class="tw-h-[unset] tw-border-none tw-bg-transparent tw-p-0 ![font-size:inherit] hover:tw-underline focus:tw-underline focus:tw-outline-none"
      value={displayName}
      onInput={(e) => setDisplayName(e.currentTarget.value)}
      className={`${className}`}
      {...props}
      onBlur={() => saveName()}
      onKeyDown={(e) => e.key === 'Enter' && saveName()}
    />
  )
}
