import React, { Suspense } from 'react'
import Dashboard from './Dashboard'
import Loading from './Loading'

export default function DashboardWrapper() {
  return (
    <Suspense fallback={<Loading/>}>
        <Dashboard/>
    </Suspense>
  )
}
