/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import React, {FC, useEffect} from 'react'
import {Redirect, Switch, Route} from 'react-router-dom'
import {shallowEqual, useSelector} from 'react-redux'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import {PrivateRoutes} from './PrivateRoutes'
import {Logout, AuthPage} from '../modules/auth'
import {LandingPageV1, LandingPageV2, UpdatePortfolioWeight, LandingPageWhite} from '../modules/landingpage'
import {ErrorsPage} from '../modules/errors/ErrorsPage'
import {RootState} from '../../setup'
import {MasterInit} from '../../_metronic/layout/MasterInit'
import { useAuth0 } from "@auth0/auth0-react";

const Routes: FC = () => {
  //const isAuthorized = useSelector<RootState>(({auth}) => auth.user, shallowEqual)
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  
  useEffect(()=>{

  },[isAuthenticated])

  return (
    <>
      <Switch>
        {!isAuthenticated ? (
          /*Render auth page when user at `/auth` and not authorized.*/
          
          <Route>
            <AuthPage />
          </Route>
          // <Route render= {()=>loginWithRedirect() } />
        ) : (
          /*Otherwise redirect to root page (`/`)*/
          // <Redirect from='/auth' to='/' />
          <MasterLayout>
            <PrivateRoutes />
          </MasterLayout>
        )}

        <Route path='/error' component={ErrorsPage} />
        <Route path='/logout' component={Logout} />

        {!isAuthenticated ? (
          /*Redirect to `/auth` when user is not authorized*/
          
          //<Redirect to='/auth/login' />
          <Redirect to='/my-page' />
        ) : (
          <>
            <MasterLayout>
              <PrivateRoutes />
            </MasterLayout>
          </>
        )}
      </Switch>
      <MasterInit />
    </>
  )
}

export {Routes}
