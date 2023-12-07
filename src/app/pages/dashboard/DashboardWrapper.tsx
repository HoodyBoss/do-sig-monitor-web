/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useState, useEffect} from 'react'
import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'

import {collection, query, getDocs, where } from 'firebase/firestore'
import {db} from '../../../firebase'

import { DashboardDetail } from '../../modules/dashboard/components/DashboardDetail'

import { SelectRisk } from './SuggestBotWizard_Page'

import { useAuth0 } from "@auth0/auth0-react";



const DashboardPage: FC = () => (
  
  <>
    

    <div className='row g-5 gx-xxl-12'>
      <div className='col-xxl-12'>
        <DashboardDetail />
      </div>
    </div>
  </>
)

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  const { user, loginWithRedirect, isAuthenticated, handleRedirectCallback } = useAuth0();
  const userId = user!.sub!.replaceAll('|','')

  const [isFirsttimeLogin, setIsFirsttimeLogin] = useState(false)
  const [myStrategys, setMyStrategys] = useState([] as any[])

  const getMyStrategy = async()=> {
    
    const rootColRef = query(collection(db, 'users'), where("user_id", "==", userId ))
    let my_strategys = [] as any[]
    const data = await getDocs(rootColRef).then( async(querySnapshot) => {
        const allDocResult = await Promise.all(querySnapshot.docs.map( async(docData:any) => {
            let data_userId = docData.id
            const refAccountCol = query(collection(db, 'users', docData.id, 'accounts'))
            const accountData = await getDocs(refAccountCol).then( async(accountSnapshot) => {
                const accountResult = await Promise.all(accountSnapshot.docs.map( async(account:any) => {
                    const refStrategyCol = collection(db, 'users', data_userId, 'accounts', account.id, 'strategys')
                    const strategyData = await getDocs(refStrategyCol).then( async(strategySnapshot) => {
                        const strategyResult = await Promise.all(strategySnapshot.docs.map( async(strategy:any) => {
                            let data_strategy_id = strategy.id
                            my_strategys.push({id: strategy.id, data: strategy.data()})
                            return data_strategy_id 
                        }))   
                        
                       return strategyResult 
                    })
                    return strategyData
                }))
                
                return accountResult
            })
            return accountData
        }))
        return allDocResult
    })
    return my_strategys
  }

  const getStrategyData = async() => {
    const myStrategys = await getMyStrategy()
    if (myStrategys!=undefined && myStrategys!=null && myStrategys.length>0){
      //let myStrategysArray = myStrategys.split(",")
      //const strategysDetail = await getStrategyDetail(myStrategys)
      setMyStrategys(myStrategys)
      setIsFirsttimeLogin(false)
    } else {
      setIsFirsttimeLogin(true)
    }
  }

  useEffect( () => {
    //function for get my strategy detail
    const getMyStrategyDetail = async()=>{
      await getStrategyData()
    }

    //call function
    getMyStrategyDetail()

    //clear memory leak
    return () => {
      setMyStrategys([]); // This worked for me
    };
    
  }, [])

  return (
    <>
      
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      { isFirsttimeLogin? (
        <DashboardPage />
      ):(
        <DashboardPage />
      )}
        
    </>
  )
}

export {DashboardWrapper}
