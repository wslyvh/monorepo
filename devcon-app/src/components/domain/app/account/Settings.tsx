import React, { useState } from 'react'
import css from './login.module.scss'
import { Link, LinkList } from 'components/common/link'
import { Button } from 'lib/components/button'
import { useAccountContext } from 'context/account-context'
import Alert from 'lib/components/alert'
import { CollapsedSection, CollapsedSectionHeader, CollapsedSectionContent } from 'components/common/collapsed-section'
import AccountFooter from './AccountFooter'
import { useAvatar } from 'hooks/useAvatar'
import { isEmail } from 'utils/validators'
import { TruncateMiddle } from 'utils/formatting'
import { useRouter } from 'next/router'
import Toggle from 'react-toggle'
import { EMAIL_DEVCON } from 'utils/constants'
import { cn } from 'lib/shadcn/lib/utils'

export default function SettingsPage() {
  const router = useRouter()
  const accountContext = useAccountContext()
  const avatar = useAvatar()
  const [areYouSure, setAreYouSure] = useState(false)
  const [error, setError] = useState('')
  const [openTabs, setOpenTabs] = React.useState<any>(
    router.asPath.split('#')[1] ? { [router.asPath.split('#')[1]]: true } : {}
  )

  const deleteAccount = async () => {
    if (!accountContext.account?.id) {
      setError('Unable to delete account.')
      return
    }

    await accountContext.deleteAccount(accountContext.account?.id)
  }

  const toggleScheduleSharing = async () => {
    if (accountContext.account) {
      accountContext.toggleScheduleSharing(accountContext.account)
    }
  }

  const toggleNotifications = async () => {
    if (accountContext.account) {
      accountContext.toggleNotifications(accountContext.account)
    }
  }

  const disconnect = async () => {
    if (!accountContext.account?.id) {
      setError('Unable to sign out.')
      return
    }

    accountContext.logout(accountContext.account?.id)
    router.push('/login')
  }

  return (
    <>
      <div data-type="settings-layout" className={cn('flex flex-row lg:gap-3 relative')}>
        <div className={cn('basis-[60%] grow')}>
          <div className="flex flex-col lg:border lg:border-solid lg:border-[#E4E6EB] rounded-3xl relative">
            <div className="flex flex-col gap-3 pb-4 lg:px-4 mt-4">
              <div className={css['alert']}>
                {error && (
                  <Alert title="Error" color="orange">
                    {error}
                  </Alert>
                )}
              </div>

              <div className={cn(css['profile'], 'border-b border-solid border-[#E4E6EB]')}>
                <div className={css['avatar']}>
                  <img src={avatar.url} alt={avatar.name} />
                </div>
                <p className={`${css['name']} text-xl font-semibold`}>
                  {accountContext.account?.username
                    ? accountContext.account?.username
                    : isEmail(avatar.name)
                    ? avatar.name
                    : TruncateMiddle(avatar.name, 8)}
                </p>
                <span className={css['signout']} role="button" onClick={disconnect}>
                  Sign out
                </span>
              </div>

              <CollapsedSection
                open={openTabs['account']}
                setOpen={() => {
                  const isOpen = openTabs['account']

                  const nextOpenState = {
                    ...openTabs,
                    ['account']: true,
                  }

                  if (isOpen) {
                    delete nextOpenState['account']
                  }

                  setOpenTabs(nextOpenState)
                }}
              >
                <CollapsedSectionHeader title="Account" />
                <CollapsedSectionContent>
                  <div>
                    <LinkList noIndicator>
                      <Link to="/account/email">Manage Email</Link>
                      <Link to="/account/wallets">Manage Wallets</Link>
                      <Link to="/account/username">Manage Username</Link>
                      <Link to="/account/profile">Manage Profile</Link>
                    </LinkList>
                  </div>
                </CollapsedSectionContent>
              </CollapsedSection>

              <CollapsedSection
                open={openTabs['schedule']}
                setOpen={() => {
                  const isOpen = openTabs['schedule']

                  const nextOpenState = {
                    ...openTabs,
                    ['schedule']: true,
                  }

                  if (isOpen) {
                    delete nextOpenState['schedule']
                  }

                  setOpenTabs(nextOpenState)
                }}
              >
                <CollapsedSectionHeader title="Schedule" />
                <CollapsedSectionContent>
                  <div className={css['share']}>
                    <div className="flex flex-col gap-2">
                      <p className="font-bold">Personal schedule</p>
                      <p>Share your personal schedule with your colleagues and friends.</p>
                    </div>
                    <div className={css['toggle']}>
                      <Toggle
                        className={'custom'}
                        icons={false}
                        defaultChecked={accountContext.account?.publicSchedule}
                        onChange={toggleScheduleSharing}
                      />
                    </div>
                  </div>
                  {accountContext.account?.id && accountContext.account?.publicSchedule && (
                    <div className={css['links']}>
                      <LinkList>
                        <Link to={`/schedule/u/${accountContext.account.id}/`}>Personal schedule link</Link>
                      </LinkList>
                    </div>
                  )}
                </CollapsedSectionContent>
              </CollapsedSection>

              <CollapsedSection
                open={openTabs['notifications']}
                setOpen={() => {
                  const isOpen = openTabs['notifications']

                  const nextOpenState = {
                    ...openTabs,
                    ['notifications']: true,
                  }

                  if (isOpen) {
                    delete nextOpenState['notifications']
                  }

                  setOpenTabs(nextOpenState)
                }}
              >
                <CollapsedSectionHeader title="Notifications" />
                <CollapsedSectionContent>
                  <div className={css['share']}>
                    <div className="flex flex-col gap-2">
                      <p className="font-bold">Event updates</p>
                      <p>Stay informed about the latest news, updates, and announcements related to Devcon SEA.</p>
                    </div>
                    <div className={css['toggle']}>
                      <Toggle
                        className={'custom'}
                        icons={false}
                        defaultChecked={accountContext.account?.notifications}
                        onChange={toggleNotifications}
                      />
                    </div>
                  </div>
                </CollapsedSectionContent>
              </CollapsedSection>

              <CollapsedSection
                open={openTabs['application']}
                setOpen={() => {
                  const isOpen = openTabs['application']

                  const nextOpenState = {
                    ...openTabs,
                    ['application']: true,
                  }

                  if (isOpen) {
                    delete nextOpenState['application']
                  }

                  setOpenTabs(nextOpenState)
                }}
              >
                <CollapsedSectionHeader title="Application" />
                <CollapsedSectionContent>
                  <div className={css['links']}>
                    <LinkList>
                      {/* <Link to="/info#faq">FAQ</Link> */}
                      <Link to={`mailto:${EMAIL_DEVCON}`}>Support</Link>
                    </LinkList>
                  </div>
                </CollapsedSectionContent>
              </CollapsedSection>

              <CollapsedSection
                open={openTabs['delete']}
                setOpen={() => {
                  const isOpen = openTabs['delete']

                  const nextOpenState = {
                    ...openTabs,
                    ['delete']: true,
                  }

                  if (isOpen) {
                    delete nextOpenState['delete']
                  }

                  setOpenTabs(nextOpenState)
                }}
              >
                <CollapsedSectionHeader title="Delete Account" />
                <CollapsedSectionContent>
                  <div className={css['wallet']}>
                    <p className="mb-4">Once you delete your Devcon account, there is no going back. Tread lightly.</p>
                    {!areYouSure && (
                      <>
                        <Button className="plain" color="purple-2" fill onClick={() => setAreYouSure(true)}>
                          Delete Devcon account
                        </Button>
                      </>
                    )}

                    {areYouSure && (
                      <>
                        <Button className="plain" color="black-1" fill onClick={() => setAreYouSure(false)}>
                          No, keep my account
                        </Button>
                        &nbsp;
                        <Button className="plain" color="purple-2" fill onClick={deleteAccount}>
                          Yes, delete my account
                        </Button>
                      </>
                    )}
                  </div>
                </CollapsedSectionContent>
              </CollapsedSection>

              <AccountFooter />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
