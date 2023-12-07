import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {LandingPageV1} from '../modules/landingpage'

export function PublicRoutes() {
  return (
    <Switch>
      <Route path='/home' component={LandingPageV1} />
      <Redirect to='/home' />
    </Switch>
  )
}
