import React, {FC, useState, useEffect}  from "react";
import {useAuth0} from "@auth0/auth0-react";
import {collection, query, getDocs, where } from 'firebase/firestore'
import {db} from '../../../firebase'
import axios from 'axios'

import {StrategyWidget} from "../../modules/strategy/StrategyWidget"
import MasterConfix from "../../../setup/MasterConfix";
import apiEndpoint from "../../modules/services/apiEndpoint"

type Props={
    riskType: string
  }

const StrategyPool: FC<Props> = ({riskType}) => {

    //get user's profile from Auth0 token
    const { user} = useAuth0();
    const userId = user!.sub!.replaceAll('|','')
    const [strategys, setStrategys] = useState([] as any[])
    const [myStrategys, setMyStrategys] = useState([] as any[])
    const [loading, setLoading] = useState(true)
    const [apis, setApis] = useState([] as any[])
    const [strategyUrl, setStrategyUrl ] = useState("")
    const [risk, setRisk ] = useState("")
    
    let url = MasterConfix.API_BASE_ENDPOINT+MasterConfix.API_GET_STRATEGY_DETAIL 
    if (riskType!=null && riskType!=""){
        url = MasterConfix.API_BASE_ENDPOINT+MasterConfix.API_GET_STRATEGY_BY_RISK+"/"+riskType
    }
    //get api list
    const getApisList = async() => {
        let apiDetail = [] as any[]
        const rootColRef = query(collection(db, 'api_keys'), where("user_id", "==", userId ))
        const data = await getDocs(rootColRef).then( async(docSnapshot) => {
        const strategyResult = await Promise.all(docSnapshot.docs.map( async(api:any) => {
            apiDetail.push({id: api.id, data: api.data()} )
            return api 
        })) 
        })
        return apiDetail
    }
    
    let my_strategys = ''
    const getMyStrategy = async()=> {
        const rootColRef = query(collection(db, 'users'), where("user_id", "==", userId ))
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
                                my_strategys += ","+strategy.id
                                
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
    
    // const getData = async() => {
    //     fetch( url,
    //         { mode: "cors",
    //           headers: {
    //             "Content-Type": "application/json"
    //           }}
    //         ).then(response => response.json() )
    //          .then( async(data) => { 
    //                             const my_strategys = await getMyStrategy()
    //                             //setMyStrategys(my_strategys)
    //                             if (data!=null && data instanceof Array){
    //                                 let strategyResult = await Promise.all(data.map( (el:any) => {
                                        
    //                                     // if (my_strategys.indexOf(el!.id!)<0){
    //                                     //     return el
    //                                     // }
    //                                     return el
    //                                 }))
                                    
    //                                 setStrategys(strategyResult)
    //                                 setLoading(false)
    //                             } else {
    //                                 setLoading(false)
    //                             }
    //                         })
    // }

    const getData = async() => {
        apiEndpoint.getStrategiesList(null).then( async(response) => { 
            console.log("Strategies:::", response)
        })
    }

    useEffect( () => {
        
        setStrategyUrl(url)

        const loadData = async()=>{
            await getData()
        }
        
        loadData()
        //get apis list
        const prepareApisList = async() => {
            setApis(await getApisList())
        }
        prepareApisList()
        
        return () => {
            setStrategys([]); // This worked for me
            setApis([]);
        };
    }, [url, strategyUrl])

    let key=0
    
    return  (
            <div>
                <div className='row g-5 g-xxl-12'>
                {loading ? (
                    <div className="card-xl-stretch mb-xl-12 text-center" key={Math.floor(Math.random() * 1000)}>
                        <div className="spinner-border" style={{width: "6rem",height: "6rem"}} role="status" key={Math.floor(Math.random() * 1000)}>
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ):(
                    <>
                    <div className={`card card-xl-stretch mb-xl-8`}>
                        {/* begin::Header */}
                        <div className='card-header border-0 pt-5'>
                            <h3 className='card-title align-items-start flex-column'>
                                <span className='card-label fw-bolder fs-3 mb-1'>Explore Strategies</span>
                            </h3>
                        </div> 
                    </div>
                    { strategys.map( el=> el !=  undefined? (
                            // btn btn-outline btn-outline-dashed btn-outline-default p-7 
                            <div className='col-xl-4 ' id={el!.id} key={el!.id}>
                                <StrategyWidget
                                    className='card-xxl-stretch mb-xxl-8'
                                    chartColor='success'
                                    chartHeight='150px'
                                    chartWidth='100%'
                                    userId={user!.id}
                                    strategyId={el!.id}
                                    strategyObj={el}
                                    apis={apis}
                                    getData={getData}
                                />
                            </div>
                            ) : (
                                <></>
                            ) 
                        )}
                    </>
                )}
                    
                </div>
            </div>
    )
}

export {StrategyPool}