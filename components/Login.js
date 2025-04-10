"use client"
import { Fugaz_One } from 'next/font/google';
import React, { useState } from 'react'
import Button from './Button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const fugaz = Fugaz_One({ subsets : ["latin"], weight : ['400']});

export default function Login(props) {

  const { defaultIsRegister } = props
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isRegister, setIsRegister] = useState(defaultIsRegister)
  const [authenticating, setAuthenticating] = useState(false)
  const { signup, login } = useAuth()
  const router = useRouter()

  async function handleSubmit() {
    if (!email || !password || password.length < 6) { return }
    setAuthenticating(true)
    try {
      if (isRegister) {
        await signup(email, password)
      } else {
        await login(email, password)
      }
      router.push("/dashboard")
    } catch (err) {
      console.log(err.message)
    } finally {
      setAuthenticating(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 justify-center items-center gap-4">
      <h3 className={"text-4xl sm:text-5xl md:text-6xl " + fugaz.className}>{isRegister ? "Register" : "Login"}</h3>
      <p>You&#39;re one step away!</p>
      <input value={email} onChange={(e) => {
        setEmail(e.target.value)
      }} className="max-w-[400px] w-full mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none" placeholder="Email"/>
      <input value={password} onChange={(e) => {
        setPassword(e.target.value)
      }} className="max-w-[400px] w-full mx-auto px-3 duration-200 hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 border border-solid border-indigo-400 rounded-full outline-none" placeholder="Password" type="password"/>
      <div className="max-w-[400px] w-full mx-auto">
        <Button clickHandler={handleSubmit} text={authenticating ? "Submitting..." : "Submit"} full/>
      </div>
      <p className="text-center">{isRegister ? "Already have an account? " : "Don\'t have an account? "}<button onClick={() => setIsRegister(!isRegister)} className="text-indigo-600">{isRegister ? "Sign in" : "Sign up"}</button></p>
    </div>
  )

}
