import React, { useEffect, useRef}  from 'react'
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";
import {LayoutProvider, LayoutSplashScreen} from '../../../../_metronic/layout/core'

export function RedirectAuth0() {
  const history = useHistory();
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  useEffect ( () => {
    // async function checkUser() {
    //   if (isAuthenticated) {
    //     await history.push("/explore");
    //   } else {
    //     loginWithRedirect();
    //   }
    // }

    // checkUser();                            
  }, [isAuthenticated, loginWithRedirect])

  const RedirectTo = ()=>{
    setTimeout(() => {
      loginWithRedirect()
    }, 1000)
  }
  return (
    <>
      <br/>
      <h3 className=" text-center"><a href="#" className="btn btn-sm btn-primary" onClick={event=>RedirectTo()}>Enter App</a></h3>
      
    </>
  )
}
