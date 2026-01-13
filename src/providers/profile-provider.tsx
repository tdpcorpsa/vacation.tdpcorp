'use client'

import { Suspense, createContext, useContext } from 'react'
import useProfile from '@/hooks/auth/use-profile'
import { Spinner } from '@/components/ui/spinner'

type UseProfileReturn = ReturnType<typeof useProfile>
type ProfileData = UseProfileReturn['data']

type ProfileContextType = {
  profile: ProfileData | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

const ProfileContext = createContext<ProfileContextType>({
  profile: undefined,
  isLoading: true,
  error: null,
  refetch: () => {},
})

export const useProfileContext = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfileContext must be used within a ProfileProvider')
  }
  return context
}

export default function ProfileProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: profile, isLoading, error, refetch } = useProfile()

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isLoading,
        error: error as Error | null,
        refetch,
      }}
    >
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen">
            <Spinner />
          </div>
        }
      >
        {children}
      </Suspense>
    </ProfileContext.Provider>
  )
}
