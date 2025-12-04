import React from 'react'

const AuthLayout = ({ children }) => {
  return (
    <main className='flex flex-col items-center justify-center h-screen '>
        {children}
    </main>
  )
}

export default AuthLayout

// CLERK_SIGN_IN_FORCE_REDIRECT_URL=/
// CLERK_SIGN_UP_FORCE_REDIRECT_URL=/