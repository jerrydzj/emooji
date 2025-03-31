import React, { Suspense } from 'react'
import Dashboard from './Dashboard'

export default function DashboardWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <Dashboard/>
    </Suspense>
  )
}
