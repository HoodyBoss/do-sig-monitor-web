import {FC, useRef, useEffect, useState} from 'react'
import {shallowEqual, useSelector, connect, useDispatch, ConnectedProps} from 'react-redux'
import {LayoutSplashScreen} from '../../../../_metronic/layout/core'
import * as auth from './AuthRedux'
import {getUserByToken} from './AuthCRUD'
import {RootState} from '../../../../setup'
import {UserModel} from '../models/UserModel'
import { useAuth0 } from "@auth0/auth0-react";

const mapState = (state: RootState) => ({auth: state.auth})
const connector = connect(mapState, auth.actions)
type PropsFromRedux = ConnectedProps<typeof connector>



const AuthInit: FC<PropsFromRedux> = (props) => {
  const didRequest = useRef(false)
  const dispatch = useDispatch()
  const [showSplashScreen, setShowSplashScreen] = useState(true)
  const accessToken = useSelector<RootState>(({auth}) => auth.accessToken, shallowEqual)
  const [isLogin, setIsLogin] = useState(false)
  
  const { user, isAuthenticated, isLoading, loginWithRedirect, handleRedirectCallback } = useAuth0();

  // We should request user by authToken before rendering the application
  useEffect(() => {
    // if (!isAuthenticated){
    //   loginWithRedirect();
    // }
    const requestUser = async () => {
      try {
        if (!didRequest.current) {
          //const {data: user} = await getUserByToken()
          
          if (isAuthenticated){
            let userModel: UserModel =  {
              id: 123,
              username: '123',
              password: '123',
              email: '123',
              first_name: '123',
              last_name: '456'
            }
            dispatch(props.fulfillUser(userModel))
            setIsLogin(true)
          }
          
          // if (!isLogin){
          //   loginWithRedirect();
          // }
        }
      } catch (error) {
        console.error(error)
        if (!didRequest.current) {
          dispatch(props.logout())
        }
      } finally {
        setShowSplashScreen(false)
      }

      return () => (didRequest.current = true)
    }

    if (accessToken) {
      requestUser()
    } else {
      dispatch(props.logout())
      setShowSplashScreen(false)
    }
    // eslint-disable-next-line
  }, [isAuthenticated, isLogin])

  

  return showSplashScreen ? <LayoutSplashScreen /> : <>{props.children}</>
}

export default connector(AuthInit)
