"use client"
import { useAuth } from '@/context/AuthContext'
import React from 'react'
import Button from './Button'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Logout() {
    const { logout, currentUser } = useAuth()
    const pathname = usePathname()
    if (!currentUser) { return null }
    if (pathname == "/") {
        return (
            <Link href={"/dashboard"}>
                <Button text="Go to Dashboard"></Button>
            </Link>
        )
    }
    return (
        <Button text="Logout" clickHandler={logout}/>
    )
}
