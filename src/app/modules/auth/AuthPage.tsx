/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {Registration} from './components/Registration'
import {ForgotPassword} from './components/ForgotPassword'
import {RedirectAuth0} from './components/RedirectAuth0'
import { useAuth0 } from "@auth0/auth0-react";

export function AuthPage() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  useEffect(() => {
    document.body.classList.add('bg-black')
    return () => {
      document.body.classList.remove('bg-black')
    }
  }, [isAuthenticated])
  
  const logoStyle = {
    filter: "brightness(0.5) sepia(1) hue-rotate(-70deg) saturate(5);"
  }
  return (
    <div
      className='d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed'
      style={{
        backgroundImage: `url('')`,
      }}
    >
      {/* begin::Content */}
      <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
        {/* begin::Logo */}
        <a href='#' className='mb-12'>
          <img alt='Logo' src={'/media/logos/LOGO_DEEPOCEAN-06.svg'} style={{filter: `brightness(0.45) sepia(1) hue-rotate(-190deg) saturate(5)`, height: '200px'}} />
        </a>
        {/* end::Logo */}
        {/* begin::Wrapper */}
        <div className='w-lg-500px bg-black rounded shadow-sm p-10 p-lg-15 mx-auto'>
          <Switch>
            <Route path='/auth/login' component={RedirectAuth0} />
            <Route path='/auth/registration' component={Registration} />
            <Route path='/auth/forgot-password' component={ForgotPassword} />
            <Redirect from='/auth' exact={true} to='/auth/login' />
            <Redirect to='/auth/login' />
          </Switch>
        </div>
        {/* end::Wrapper */}
      </div>
      {/* end::Content */}
      {/* begin::Footer */}
      <div className='d-flex flex-center flex-column-auto p-10'>
        <div className='d-flex align-items-center fw-bold fs-6'>
          <a href='#' className='text-muted text-hover-primary px-2'>
            About
          </a>

          <a href='#' className='text-muted text-hover-primary px-2'>
            Contact
          </a>

        </div>
      </div>
      {/* end::Footer */}
    </div>
  )
}
