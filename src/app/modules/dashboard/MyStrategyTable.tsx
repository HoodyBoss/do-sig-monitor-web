/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect} from 'react'
import {KTSVG} from '../../../_metronic/helpers'
import {useAuth0} from "@auth0/auth0-react";
import {useHistory} from 'react-router-dom'
import {collection, query, getDocs, where } from 'firebase/firestore'
import {db} from '../../../firebase'
import {MyStrategyWidget} from "../../modules/strategy/MyStrategyWidget"

type Props = {
  className: string
  actions: string
}

const MyStrategyTable: React.FC<Props> = ({className, actions}) => {
  
  const history = useHistory();

  //get user's profile from Auth0 token
  const { user } = useAuth0();
  const userId = user!.sub!.replaceAll('|','')

  const [data, setData] = useState([] as any[])
  const [loading, setLoading] = useState(true)
  const [noti, setNoti] = useState([] as any[])

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

  const getNoti = async()=> {
    
    const rootColRef = query(collection(db, 'users'), where("user_id", "==", userId ))
    let notis = [] as any[]
    const data = await getDocs(rootColRef).then( async(querySnapshot) => {
        const allDocResult = await Promise.all(querySnapshot.docs.map( async(docData:any) => {
            let data_userId = docData.id
            const refAccountCol = query(collection(db, 'users', docData.id, 'notifications'))
            const accountData = await getDocs(refAccountCol).then( async(accountSnapshot) => {
                const accountResult = await Promise.all(accountSnapshot.docs.map( async(account:any) => {
                  notis.push({id: account.id, data: account.data()})
                  return account.id 
                }))
                
                return accountResult
            })
            return accountData
        }))
        return allDocResult
    })
    return notis
  }


  const getStrategyData = async() => {
    const myStrategys = await getMyStrategy()
    if (myStrategys!=undefined && myStrategys!=null && myStrategys.length>0){
      //let myStrategysArray = myStrategys.split(",")
      //const strategysDetail = await getStrategyDetail(myStrategys)
      setData(myStrategys)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }

  useEffect( () => {
    //function for get my strategy detail
    const getMyStrategyDetail = async()=>{
      await getStrategyData()
      setNoti(await getNoti())
    }

    //call function
    getMyStrategyDetail()

    //clear memory leak
    return () => {
      setData([]); // This worked for me
    };
    
  }, [])

  const handleNewStrategy = () => {
      history.push('/strategy/strategy_pool')
  }
  
  const redirectTo = () => {
    history.push('/account')
  }
 
  return (
      <>
        {loading ? (
            <div className="card-xl-stretch mb-xl-12 text-center">
                <div className="spinner-border" style={{width: "6rem",height: "6rem"}} role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        ):(
          <>
          <div className={`card ${className}`}>
            {/* begin::Header */}
            <div className='card-header border-0 pt-5'>
              <h3 className='card-title align-items-start flex-column'>
                <span className='card-label fw-bolder fs-3 mb-1'>My Strategy</span>
                <span className='text-muted mt-1 fw-bold fs-7'></span>
              </h3>
              <div className='card-toolbar'>
                <a href='#' className='btn btn-sm btn-light-primary' onClick={ (event) => handleNewStrategy() } >
                  <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                  New Strategy
                </a>
              </div>
            </div> 
          </div>
          
            { actions==="subscribed"?(
              <div className='row g-5 g-xxl-12'>
                <div className='col-xl-6'>
                  <div className="alert alert-success" role="alert">
                    You're successfully subscribed
                  </div>
                </div>
                {noti!.length===0 ? (
                  <div className='col-xl-6'>
                    <div className="alert alert-warning" role="alert">
                      You don't have any notification. Create one <a href="#" onClick={event=>redirectTo()}>click here</a>
                    </div>
                  </div>
                ):(<></>)}
              </div>
            ):(<></>)}
          
          <div className='row g-5 g-xl-8'>
            { data.map( el=> el != undefined ? (
              <div className='col-xl-4 ' id={el!.id} key={el!.id}>
                  <MyStrategyWidget
                      className='card-xl-stretch mb-xl-8'
                      chartColor='success'
                      chartHeight='150px'
                      userId={userId}
                      strategyId={el!.id}
                      strategyObj={el}
                      getStrategyData={getStrategyData}
                  />
              </div>
          
            ):(
              <></>
            ))}
          </div>
        </>
      )}
    </>
  )
}

export {MyStrategyTable}
