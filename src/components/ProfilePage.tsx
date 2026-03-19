import React, { ComponentProps } from 'preact'
import { useIsLoggedIn } from '../hooks/useIsLoggedIn'
import { LoginButton } from './LoginButton'
import { Button } from './Button'
import { getNhostClient } from '../utils/nhostClient'
import { EditableUserDisplayName } from './EditableUserDisplayName'
import { useState } from 'preact/hooks'
import { ChangePassword } from './ChangePassword'
import { Checkbox } from './Checkbox'
import { useGraphQLResponse } from '../hooks/useGraphQLResponse'

const commTypes = [
  {
    title: 'Email Newsletter',
    description:
      'Periodic communication from the team at This Week Hawaii about trip ideas, deals, savings, and Hawaiian culture',
    type: 'newsletter',
  },
]

export interface ProfilePageProps extends ComponentProps<'div'> {}

export const ProfilePage = ({ className = '', ...props }: ProfilePageProps) => {
  const nhost = getNhostClient()

  const { loggedIn, user } = useIsLoggedIn()

  const [changingPassword, setChangingPassword] = useState(false)

  const { data, refresh } = useGraphQLResponse<{
    communication_opt_in: { id: number; comm_type: string; opt_in: boolean }[]
  }>({
    query: `query commsPrefs ($userId: uuid!) {
      communication_opt_in(where: { user_id: { _eq: $userId } }) {
        id
        comm_type
        opt_in
      }
    }`,
    variables: { userId: user?.id },
    skip: !user?.id,
  })

  const commPrefsDataMap = (data?.communication_opt_in ?? []).reduce<Record<string, boolean>>(
    (map, item) => ({ ...map, [item.comm_type]: item.opt_in }),
    {},
  )

  const isAdminUser = user?.defaultRole === 'user'

  return (
    <div
      className={`${className} tw-mx-auto tw-min-h-[50vh] tw-w-full tw-max-w-2xl tw-p-2 tw-text-left sm:tw-mt-12`}
      {...props}
    >
      {!loggedIn && (
        <div class="tw-flex-center tw-h-80 tw-flex-col tw-gap-y-4">
          <h2 class="tw-font-montserrat tw-text-xl tw-font-bold tw-uppercase sm:tw-text-3xl">Subscribers Save Big!</h2>
          <LoginButton label="Login or Sign Up" commsRefresh={refresh} />
          <p class="tw-text-center tw-text-sm tw-italic tw-text-gray-500">
            Once logged in, you can manage your profile here.
          </p>
        </div>
      )}
      {loggedIn && user && (
        <div class="tw-flex tw-w-full tw-min-w-0 tw-flex-col tw-items-start tw-gap-y-4">
          <div class="tw-grid tw-w-full tw-grid-cols-[auto_1fr_auto] tw-items-start tw-gap-2 tw-pb-2 sm:tw-gap-4">
            {user.avatarUrl && (
              <div class="tw-h-12 tw-w-12 tw-overflow-clip tw-rounded-full sm:tw-h-16 sm:tw-w-16">
                <img
                  class="tw-aspect-auto tw-h-full"
                  src={user.avatarUrl.includes('gravatar.com') ? `${user.avatarUrl}&s=500` : user.avatarUrl}
                />
              </div>
            )}
            <div class="tw-text-left">
              <h3 class="tw-mt-0 tw-break-all">
                <EditableUserDisplayName />
              </h3>
              <p class="tw-break-all tw-text-xs sm:tw-text-base">{user.email}</p>
            </div>
            <Button
              variant="subdued"
              onClick={() => {
                nhost.auth.signOut({ all: false })
              }}
            >
              Log Out
            </Button>
          </div>
          <hr class="tw-w-full" />
          <h4>Communication Preferences</h4>
          {commTypes.map(({ title, type, description }) => (
            <Checkbox
              key={type}
              label={title}
              description={description}
              checked={commPrefsDataMap[type] ?? false}
              onClick={async (e) => {
                const optIn = e.currentTarget.checked

                const res = await nhost.graphql
                  .request({
                    query: `mutation commsOptInOut ($commType: String! $optIn: Boolean!${
                      isAdminUser ? ', $userId: uuid!' : ''
                    }) {
                      insert_communication_opt_in_one(object:{ comm_type: $commType, opt_in: $optIn${
                        isAdminUser ? ', user_id: $userId' : ''
                      } }, on_conflict: { update_columns: [opt_in], constraint: communication_opt_in_user_id_comm_type_key }){
                        id
                      }
                    }`,
                    variables: { commType: type, optIn, userId: isAdminUser ? user.id : undefined },
                  })
                  .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

                if (res instanceof Error) {
                  return console.error('could not update comm pref', res)
                }

                refresh()
              }}
            />
          ))}
          <hr class="tw-w-full" />
          <div class="tw-flex tw-w-full tw-flex-col tw-items-start tw-gap-4 sm:tw-flex-row">
            <Button onClick={() => setChangingPassword(true)}>Change Password</Button>
            {user.defaultRole === 'user' && (
              <a
                className="tw-flex-center tw-min-h-10 tw-rounded tw-border tw-border-red-500 tw-bg-white tw-px-2 tw-text-red-500 tw-ring-0 tw-ring-red-300 hover:tw-bg-red-50 focus:tw-outline-none focus:tw-ring disabled:tw-opacity-60 sm:tw-ml-auto"
                href="https://admin.thisweekhawaii.com"
              >
                Go to Admin Dashboard ↗️
              </a>
            )}
          </div>
          {changingPassword && <ChangePassword onClose={() => setChangingPassword(false)} />}
        </div>
      )}
    </div>
  )
}
