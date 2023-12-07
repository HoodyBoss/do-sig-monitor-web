import React, {Suspense} from 'react'
import {BrowserRouter} from 'react-router-dom'
import {I18nProvider} from '../_metronic/i18n/i18nProvider'
import {LayoutProvider, LayoutSplashScreen} from '../_metronic/layout/core'
import AuthInit from './modules/auth/redux/AuthInit'
import {Routes} from './routing/Routes'
import { Auth0Provider } from "@auth0/auth0-react";
import MasterConfix from '../setup/MasterConfix'


type Props = {
  basename: string
}

//export const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID
//export const AUTHO_DOMAIN = process.env.AUTHO_DOMAIN

const App: React.FC<Props> = ({basename}) => {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <BrowserRouter basename={basename}>
        <I18nProvider>
          <LayoutProvider>
            <Auth0Provider
              domain={MasterConfix.AUTH0_DOMAIN}
              clientId={MasterConfix.AUTH0_CLIENT_ID}
              redirectUri={window.location.origin}
            >
              <AuthInit>
                <Routes/>
              </AuthInit>
            </Auth0Provider>
          </LayoutProvider>
        </I18nProvider>
      </BrowserRouter>
    </Suspense>
  )
}

export {App}
