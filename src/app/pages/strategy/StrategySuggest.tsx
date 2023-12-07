import React, {FC, useState, useEffect, useRef}  from "react";
import {useAuth0} from "@auth0/auth0-react";
import {collection, query, getDocs, where } from 'firebase/firestore'
import {db} from '../../../firebase'
import {KTSVG} from '../../../_metronic/helpers'
import {StrategySuggestWidget} from "../../modules/strategy/StrategySuggestWidget"
import MasterConfix from "../../../setup/MasterConfix";
import {SubscribeStrategySuggestDetail} from "../../pages/subscribe_strategy/SubscribeStrategySuggestDetail"
import apiEndpoint from "../../modules/services/apiEndpoint"

type Props={
    riskType: string
}

const StrategySuggest: FC<Props> = ({riskType}) => {

    const divConnectionModalRef = useRef<HTMLDivElement | null>(null)
    const divSubscribeRef = useRef<HTMLDivElement | null>(null)
    const buttonRef = useRef<HTMLDivElement>(null);
    //get user's profile from Auth0 token
    const { user} = useAuth0();
    const userId = user!.sub!.replaceAll('|','')
    const [strategys, setStrategys] = useState([] as any[])
    const [loading, setLoading] = useState(true)
    const [apis, setApis] = useState([] as any[])
    const [strategyUrl, setStrategyUrl ] = useState("")
    const [risk, setRisk ] = useState("")
    const [connectionCreatedFlag, setConnectionCreatedFlag] = useState("failed")
    
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
    
    const getData = async() => {
        let payload = {"riskType": riskType}
        apiEndpoint.getStrategiesByRisk(payload).then( async(response) => { 
                                    console.log("response>>>>", response)
                                    const my_strategys = await getMyStrategy()
                                    if (response!=null && response instanceof Array){
                                        let strategyResult = await Promise.all(response.map( (el:any) => {
                                            
                                            if (my_strategys.indexOf(el!.id!)<0){
                                                return el
                                            }
                                        }))
                                        
                                        setStrategys(strategyResult)
                                        setLoading(false)
                                    } else {
                                        setLoading(false)
                                    }
                                })

        // url = MasterConfix.API_BASE_ENDPOINT_V2+"/strategy/risktype"
        // console.log("url>>>", url)
        // fetch( url,
        //     { method: 'post', mode: "cors",
        //     body: JSON.stringify({"risk_type": riskType}),
        //       headers: {
        //         "Content-Type": "application/json"
        //       }}
        //     ).then(response => response.json() )
        //      .then( async(data) => { 
        //                         const my_strategys = await getMyStrategy()
        //                         if (data!=null && data instanceof Array){
        //                             let strategyResult = await Promise.all(data.map( (el:any) => {
                                        
        //                                 if (my_strategys.indexOf(el!.id!)<0){
        //                                     return el
        //                                 }
        //                             }))
                                    
        //                             setStrategys(strategyResult)
        //                             setLoading(false)
        //                         } else {
        //                             setLoading(false)
        //                         }
        //                     })
        // let payload = {"riskType": riskType}
        // console.log("payload data>>>", payload)
        // await apiEndpoint.getStrategiesByRisk(payload).then( async (data) => {
        //     console.log("Response data>>>", data)
        // })
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

    const setExchange=()=>{
        //exchange = exchangeRef!.current!.value
        //updateExchange(exchange)
    }

    
    const handdleHideModal = () => {
        buttonRef?.current?.click();
    }

    const handleClickSubscribe=async()=>{
        setApis(await getApisList())
        let hasExchange = apis!=null && apis.length>0 ? true: false;
        if (hasExchange){
            divSubscribeRef!.current!.click()
        } else {
            divConnectionModalRef!.current!.click()
        }
    }

    let key=0

    return  (
        <>
            {/* <div ref={divConnectionModalRef} id = "openConnectionModal" data-bs-toggle="modal" data-bs-target={"#kt_modal_add_api"} onClick={event=>setExchange()}/>
            <div ref={divSubscribeRef} id = "openSubscribeModal" data-bs-toggle="modal" data-bs-target={"#kt_modal_subscribe"} /> */}
            <div className={"modal fade"} tabIndex={-1} id={"kt_modal_subscribe"} data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Subscribe Strategy</h5>
                        <div
                        className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        >
                        <KTSVG
                            path="/media/icons/duotune/arrows/arr061.svg"
                            className="svg-icon svg-icon-2x"
                        />
                        </div>
                        
                    </div>
                        {connectionCreatedFlag === "success"? (
                            <div className="alert alert-success" role="alert">
                            Successfully create connections
                            <br/>You're ready to subscribe
                            </div>
                        ):(
                            <></>
                        )}
                    <div className="modal-body">
                            <SubscribeStrategySuggestDetail strategys={strategys} apis={apis} getData={getData} handdleHideModal={handdleHideModal}/>
                    </div>
                    <div className="modal-footer">
                        <div
                        
                        id="close_subscribe_modal"
                        className="btn btn-light"
                        data-bs-dismiss="modal"
                        style={{display: "hidden"}}
                        ref={buttonRef}
                        />
                        
                    </div>
                    </div>
                </div>
            </div>

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
                    <div className={`card card-xl-stretch mb-xl-12`}>
                        {/* begin::Header */}
                        <div className='card-header border-0 pt-5'>
                            <h3 className='card-title align-items-start flex-column'>
                                <span className='card-label fw-bolder fs-3 mb-1'>Explore Strategies</span>
                            </h3>
                        </div> 
                    </div>
                    { strategys.map( el=> el != undefined ? (
                            // btn btn-outline btn-outline-dashed btn-outline-default p-7 
                            <div className='col-xl-12 ' id={el!.id} key={el!.id}>
                                <StrategySuggestWidget
                                    className='card-xxl-stretch mb-xxl-12'
                                    chartColor='success'
                                    chartHeight='150px'
                                    chartWidth='100%'
                                    userId={user!.id}
                                    strategyId={el!.id}
                                    strategyObj={el}
                                    apis={apis}
                                    getData={getData}
                                    strategys={strategys}
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
    </>)
}

export {StrategySuggest}