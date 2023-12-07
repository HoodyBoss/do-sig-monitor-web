import React, { useState, useEffect}  from 'react'
import {useAuth0} from "@auth0/auth0-react";
import {collection, Timestamp, query, setDoc, doc, getDocs, where, collectionGroup} from 'firebase/firestore'
import {db} from '../../../firebase'
import MasterConfix from '../../../setup/MasterConfix';
import { useHistory } from "react-router-dom";
import NumberFormat from 'react-number-format';

import {
  SubscribeStrategyDetail_Profile
} from './SubscribeStrategyDetail_Profile'


type Props = {
  strategyId: string
  strategyObj: any
  apis: any
  getData?:() => void
  handdleHideModal?:() => void
}

const SubscribeStrategyDetail : React.FC<Props> = ({strategyId, strategyObj, apis, getData=()=>{}, handdleHideModal=()=>{}}) => {
  const history = useHistory();
  const { user } = useAuth0();
  //prepare user id data
  const userId = user!.sub!.replaceAll('|','')

  const [capital, setCapital] = useState(0)
  const [asset, setAsset] = useState("")
  const [leftAsset, setLeftAsset] = useState("")
  const [rightAsset, setRightAsset] = useState("")
  const [risk, setRisk] = useState("")
  const [accountName, setAccountName] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [apiSecret, setApiSecret] = useState("")
  const [lineApiKey, setLineApiKey] = useState("")
  const [saveDataFlag, setSaveDataFlag] = useState(0)
  const [strategyType, setStrategyType] = useState(0)
  const [exchange, setExchange] = useState("")
  const [exchangeError, setExchangeError] = useState("")
  const [capitalError, setCapitalError] = useState("")
  const [loadingExchange, setLoadingExchange] = useState(false)
  const [upperZone, setUpperZone] = useState("")
  const [lowerZone, setLowerZone] = useState("")
  const [gapEntry, setGapEntry] = useState("")
  const [gapTp, setGapTp] = useState("")
  const [usdType, setUsdType] = useState("")
  const [pyramidRate, setPyramidRate] = useState("")
  const [numberOfGrid, setNumberOfGrid] = useState("")
  const [tpMultiple, setTpMultiple] = useState("")
  const [maStatus, setMaStatus] = useState("")
  const [goBack, setGoBack] = useState(false)
  const [subAccountFlag, setSubAccountFlag] = useState("0")
  const [minCapital, setMinCapital] = useState("0")
  const [accountBalance, setAccountBalance] = useState(0)
  const [exchangeApis, setExchangeApis] = useState([] as any[])
  const [loadingBalance, setLoadingBalance] = useState(false)
  const [notifications, setNotifications] = useState([] as any[])
  
  /***** */
  let getAccountUrl = MasterConfix.API_BASE_ENDPOINT+MasterConfix.API_GET_ACCOUNT_BALANCE
  
  /***** */
  const url = 'https://asia-southeast1-crypto-342815.cloudfunctions.net/webApi/api/v1/strategy/';
  const create_excel_file_url = MasterConfix.API_BASE_ENDPOINT+MasterConfix.API_GRID_CREATE_ZONE; //'https://asia-southeast1-crypto-342815.cloudfunctions.net/Grid_Create_Zone';
  const validateApikeyUrl = 'https://asia-southeast1-crypto-342815.cloudfunctions.net/ValidateApi';
  const funcUrl = 'https://asia-southeast1-crypto-342815.cloudfunctions.net/webApi/api/v1/save_secret';

  const initValue = async() => {
    setSaveDataFlag(0)
    setAsset("")
    setCapital(0)
    setAccountName("")
    setApiKey("")
    setApiSecret("")
    setLineApiKey("")
    setExchangeError("")
    setCapitalError("")
    setSubAccountFlag("0")

    setUpperZone("")
    setLowerZone("")
    setGapEntry("")
    setGapTp("")
    setUsdType("")
    setPyramidRate("")
    setNumberOfGrid("")
    setTpMultiple("")
    setMaStatus("")
    
  }

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

  const getNotifications = async() => {
    let notifications = [] as any[]
    const rootColRef = query(collectionGroup(db, 'notifications'), where("user_id", "==", userId ))
    const data = await getDocs(rootColRef).then( async(docSnapshot) => {
    const strategyResult = await Promise.all(docSnapshot.docs.map( async(noti:any) => {
        notifications.push({id: noti.id, data: noti.data()} )
        return noti 
    })) 
    })
    return notifications
  }

  //control page state here
  useEffect( () => {

    //call reset initial value
    initValue()

    const prepareData=async()=>{
      setNotifications( await getNotifications() )
    }

    prepareData()

    if (strategyObj!.data!.strategy_type!=null){
      setStrategyType(strategyObj!.data!.strategy_type)
    }
    if (strategyObj!.data!.asset!=null){
      setAsset(strategyObj!.data!.asset)
      setLeftAsset(strategyObj!.data!.asset.split('/')[0])
      setRightAsset(strategyObj!.data!.asset.split('/')[1])
    }

    
    setUpperZone(strategyObj!.data!.upper_zone)
    setLowerZone(strategyObj!.data!.lower_zone)
    setGapEntry(strategyObj!.data!.gap_entry)
    setGapTp(strategyObj!.data!.gap_tp)
    setUsdType(strategyObj!.data!.usd_type)
    setPyramidRate(strategyObj!.data!.pyramid_rate)
    setNumberOfGrid(strategyObj!.data!.number_of_grid)
    setTpMultiple(strategyObj!.data!.tp_multiple)
    setMaStatus(strategyObj!.data!.ma_status)
    
    setLoadingExchange(false)

    return () => {
      setAsset("")
      setLeftAsset("")
      setRightAsset("")
      setUpperZone("")
      setLowerZone("")
      setGapEntry("")
      setGapTp("")
      setUsdType("")
      setPyramidRate("")
      setNumberOfGrid("")
      setTpMultiple("")
      setMaStatus("")
    };  
  }, [])


  //
  const handleInitialForm = () => {
    initValue()
  }

  const validateForm = () => {
    let formValid = true
    //create grid setting document
    if (capital === null || capital===0) {
      setCapitalError("Please enter Capital")
      formValid = false
    }

    if (exchange === null || exchange==="") {
      setExchangeError("Please select Exchange item")
      formValid = false
    }

    let minCapital = Number(strategyObj!.data!.min_capital)
    if ( !Number.isNaN(minCapital) && Number(capital) < minCapital ){
      setCapitalError("Investment can not lower than "+minCapital+"$")
      formValid = false
    }

    if (  !Number.isNaN(accountBalance) && Number(capital) > accountBalance ){
      setCapitalError("Investment can not more than "+accountBalance+"$")
      formValid = false
    }

    return formValid
  }

  //verify api key
  //create firestore document
  //generate grid setting
  //firestore path
  ///users/{user document}/accounts/{account document}/strategys/{strategy document}
  const handleSubscribe = async () => {
    
    //validate form here
    if (!validateForm()){
      return
    }
    //split exchange and api key here
    const exs = exchange.split("|")
    let _exchange = exs[0]
    let _accountName = exs[1]
    let _apiKey = exs[2]
    let _testNet = exs[3]
    let _subAccountFlag = exs[4]
    setSaveDataFlag(1)
    
    if (strategyObj!.data!.strategy_type!=null){
      setStrategyType(strategyObj!.data!.strategy_type)
    }
    let leftAsset='', rightAsset='';
    if (strategyObj!.data!.asset!=null){
      setAsset(strategyObj!.data!.asset)
      setLeftAsset(strategyObj!.data!.asset.split('/')[0])
      setRightAsset(strategyObj!.data!.asset.split('/')[1])
      leftAsset = strategyObj!.data!.asset.split('/')[0]
      rightAsset = strategyObj!.data!.asset.split('/')[1]
    }

    setUpperZone(strategyObj!.data!.upper_zone)
    setLowerZone(strategyObj!.data!.lower_zone)
    setGapEntry(strategyObj!.data!.gap_entry)
    setGapTp(strategyObj!.data!.gap_tp)
    setUsdType(strategyObj!.data!.usd_type)
    setPyramidRate(strategyObj!.data!.pyramid_rate)
    setNumberOfGrid(strategyObj!.data!.number_of_grid)
    setTpMultiple(strategyObj!.data!.tp_multiple)
    setMaStatus(strategyObj!.data!.ma_status)
    setMinCapital( minCapital => minCapital + Number(strategyObj!.data!.min_capital) )

    let data = {
      user_id: userId
      ,strategy_id: strategyObj!.id
      ,apiKey: _apiKey
      ,accountName: _accountName
      ,capital: capital
      ,asset: strategyObj!.data!.asset
      ,leftAsset: leftAsset
      ,rightAsset: rightAsset
      ,exchange: _exchange
      ,testNet: _testNet
      ,upperZone: strategyObj!.data!.upper_zone
      ,lowerZone: strategyObj!.data!.lower_zone
      ,gapEntry: strategyObj!.data!.gap_entry
      ,gapTp: strategyObj!.data!.gap_tp
      ,subAccountFlag: _subAccountFlag
      ,usdType: strategyObj!.data!.usd_type
      ,numberOfGrid: strategyObj!.data!.number_of_grid
      ,pyramidRate: strategyObj!.data!.pyramid_rate
      ,tpMultiple: strategyObj!.data!.tp_multiple
      ,maStatus: 'ON'
      ,collect_range: strategyObj!.data!.collect_range
      ,out_of_range: strategyObj!.data!.out_of_range
    }
    
    
    let bot_type = strategyObj!.data!.bot_type

    //process subscribe bot
    await fetch( create_excel_file_url ,{ 
      method: "POST",
      body: JSON.stringify(data),
      headers: {
      "Content-Type": "application/json"
    }}).then( async response => { 
      console.log("Response>>>", response!.status)
      //if create excel api return success (code: 200)
      if (response!.status === 200){
        await setDoc(doc(db, 'users', userId! ), { user_id: userId!, cd: Timestamp.now()})
        .then(async()=>{
          await setDoc(doc(db, `users/${userId}/accounts`, _apiKey ), { account_name: accountName, api_key: _apiKey, cd: Timestamp.now()})
            .then( async()=>{
              await setDoc(doc(db, `users/${userId}/accounts/${_apiKey}/strategys`, strategyObj!.id ), 
                {  
                  user_id: userId
                  ,strategy_id: strategyObj!.id
                  ,strategy_name: strategyObj!.data!.strategy_name
                  ,strategy_type: strategyObj!.data!.strategy_type
                  ,market: strategyObj!.data!.market
                  ,risk: risk
                  ,capital: capital
                  ,system_status:'Active'
                  ,sub_account_name: _accountName
                  ,apiKey: _apiKey
                  ,line_token: lineApiKey
                  ,admin_Line_token: ''
                  ,admin_Line_Alert:'ON'
                  ,Zone_Alert:'ON'
                  ,Lending_Alert:'ON'
                  ,product_type:'Spot'
                  ,grid_asset: strategyObj!.data!.asset
                  ,asset_left: leftAsset
                  ,asset_right: rightAsset
                  ,farm_type:'Cash'
                  ,grid_type:'Percent'
                  ,upprer_zone: strategyObj!.data!.upper_zone
                  ,lower_zone: strategyObj!.data!.lower_zone
                  ,gap_entry: strategyObj!.data!.gap_entry
                  ,gap_tp: strategyObj!.data!.gap_tp
                  ,RP_file:'2_RP'
                  ,Statement_file:'3_Statement'
                  ,out_of_range: strategyObj!.data!.out_of_range
                  ,main_loop_countdown:'20.00'
                  ,Active_Zone:'ON'
                  ,upper_zone: strategyObj!.data!.upper_zone
                  ,lowerer_zone: strategyObj!.data!.lower_zone
                  ,MA_Status:'ON'
                  ,MA_Type:'EMA'
                  ,MA_TF:'15m'
                  ,MA_Period_01:'10'
                  ,MA_Period_02:'30'
                  ,ATR_Status:'ON'
                  ,ATR_Type:'MA'
                  ,ATR_TF:'15m'
                  ,ATR_Period:'13'
                  ,ATR_Multiple:'1.00'
                  ,BB_Status:'OFF'
                  ,BB_TF:'15m'
                  ,BB_Period:'20'
                  ,BB_upperband_sd:'2.00'
                  ,BB_lowerband_sd:'2.00'
                  ,BB_sig:'OUT'
                  ,Auto_Tranfer:'ON'
                  ,To_Account_Name:'Option'
                  ,lending_asset_left:'OFF'
                  ,assett_left:'USD'
                  ,Percent_offer_left:'30'
                  ,Cut_off_under_left:'200'
                  ,Record_to_file_left:'Lending_History_Asset_01'
                  ,lending_asset_right:'OFF'
                  ,Asset_right:'ETH'
                  ,Percent_offer_right:'60'
                  ,Cut_off_under_right:'500'
                  ,Record_to_file_right:'Lending_History_Asset_02'
                  ,Record_Type:'MANUAL'
                  ,Deposit:'960.00'
                  ,Withdrawal:'40.00'
                  ,testNet: _testNet
                  ,exchange: _exchange
                  ,subAccountFlag: _subAccountFlag
                  ,asset: strategyObj!.data!.asset
                  ,accountBalance: accountBalance
                  ,minCapital: minCapital
                  ,bot_version: "2.0"
                  ,usdType: strategyObj!.data!.usd_type
                  ,numberOfGrid: strategyObj!.data!.number_of_grid
                  ,pyramidRate: strategyObj!.data!.pyramid_rate
                  ,tpMultiple: strategyObj!.data!.tp_multiple
                  ,maStatus: 'ON'
                  ,notifications: JSON.stringify( notifications )
                  ,bot_type: strategyObj!.data!.bot_type
                  ,cd: Timestamp.now()}
                )
                .then( async()=>{
                  
                  //create file in storage
                  //createFileInStorage('1_Grid_Setting.xlsx', `${userId}_${strategyId}_Grid_Setting.xlsx`)

                  //statement
                  await setDoc(doc(db,  `users/${userId}/accounts/${_apiKey}/strategys/${strategyId}/statement`, `${userId}_${strategyId}_statement`), 
                  {  
                    cd: Timestamp.now() }
                  ).then( async()=>{
                    //create file in storage
                    //createFileInStorage('3_Statement.xlsx', `${userId}_${strategyId}_Statement.xlsx`)
                  })

                  //lending hist 1
                  await setDoc(doc(db,  `users/${userId}/accounts/${_apiKey}/strategys/${strategyId}/lending_hist_01`, `${userId}_${strategyId}_lending_hist_01`), 
                  {  
                    cd: Timestamp.now()}
                  ).then( async()=>{
                    //create file in storage
                    //createFileInStorage('Lending_History_Asset_01.xlsx', `${userId}_${strategyId}_Lending_History_Asset_01.xlsx`)
                  })

                  //lending hist 2
                  await setDoc(doc(db,  `users/${userId}/accounts/${_apiKey}/strategys/${strategyId}/lending_hist_02`, `${userId}_${strategyId}_lending_hist_02`), 
                  {  
                    cd: Timestamp.now()}
                  ).then( async()=>{
                    //create file in storage
                    //createFileInStorage('Lending_History_Asset_02.xlsx', `${userId}_${strategyId}_Lending_History_Asset_02.xlsx`)
                  })

                  //rp
                  await setDoc(doc(db,  `users/${userId}/accounts/${_apiKey}/strategys/${strategyId}/rp`, `${userId}_${strategyId}_rp`), 
                  {  NO:''
                      ,Zone:''
                      ,TP_Zone:''
                      ,Size_USD:''
                      ,Unit:''
                      ,Open_Side:''
                      ,Open_ID:''
                      ,Open_Price:''
                      ,Open_Time:''
                      ,Open_fee:''
                      ,Open_cre:''
                      ,Open_total:''
                      ,Open_status:''
                      ,product:''
                      ,Close_Side:''
                      ,Close_ID:''
                      ,Close_Price:''
                      ,Close_Time:''
                      ,Close_fee:''
                      ,Close_cre:''
                      ,Close_total:''
                      ,Close_status:''
                      ,Zone_Status:''
                      ,cd: Timestamp.now()
                    }
                  ).then( async()=>{
                    
                    setSaveDataFlag(3)
                    handdleHideModal()
                    getData()
                    setTimeout( ()=>{history.push("/strategy/my-strategies/subscribed")}, 1000)
                  })
                })
            })
        })
      } else {
        setSaveDataFlag(99)
        setTimeout( ()=>{ setSaveDataFlag(0) }, 5000)
      }
  }).catch( (error) => {
    console.log("Error>>", error)
    setSaveDataFlag(99)
    setTimeout( ()=>{ setSaveDataFlag(0) }, 5000)
  })
      
    

  }

  const getAccountBalance=async(itemVal:any)=>{
    setLoadingBalance(true)
    const exs = itemVal.split("|")
    let _exchange = exs[0]
    let _accountName = exs[1]
    let _apiKey = exs[2]
    let _testNet = exs[3]
    let _subAccountFlag = exs[4]

    let data = {
      "exchange": _exchange
      ,"accountName": _accountName
      ,"isSubAccount":_subAccountFlag
      ,"apiKey": _apiKey
    }
    
    let balance = await fetch( getAccountUrl ,{ 
        method: "POST"
        , headers: { 'Content-Type': 'application/json' }
        , body: JSON.stringify(data)
      }).then( async response => { 
      //if create excel api return success (code: 200)
      if (response!.status === 200){
        return response.json()
      }
    })
   
    if (balance != undefined && balance != "") {
      setAccountBalance(Number(balance))
      setLoadingBalance(false)
    } else {
      setCapitalError("Cannot load balance, please check your exchange connection.")
      setAccountBalance(0)
      setLoadingBalance(false)

    }
    
  }

  const reloadExchange=async()=>{
    setLoadingExchange(true)
    apis = await getApisList()
    if (apis!=null && apis.length>0){
      setExchangeApis(apis)
      setLoadingExchange(false)
    }
    
  }

  const calInvestment=async(percentTage:any)=>{
    setCapital(accountBalance*(percentTage/100)) 
  }
  
  return (
   
      <>
      { saveDataFlag === 99 ? (
                    <div className="alert alert-danger" role="alert">
                        Subscribtion failed. 
                    </div>
                ):(<></>)}
      {/* begin::Row */}
        <div className='row g-5 g-xl-12'>
          <div className='col-xl-12'>
            {/* <SubscribeStrategyDetail_Profile className='card-xl-stretch mb-xl-8' strategyId={strategyId} strategyObj={strategyObj}></SubscribeStrategyDetail_Profile> */}
          </div>
          
        </div>
      {/* end::Row */}

       {/* begin::Row */}
       <div className='row g-5 g-xl-12'>
          <div className='col-xl-12'>
            <div className={`card card-xl-stretch mb-xl-8`} >
            {/* begin::Header */}
              {/* end::Header */}
              {/* begin::Body */}
              <div className='card-body py-3'>
                {/* begin::Table container */}
                <div className='table-responsive'>
                  Exchange
                  <br/>
                  <br/>
                  { loadingExchange ? (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Loading Exchange...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  ):(
                    <>
                      Do you found a new connection? if No!, <a href="#" onClick={event=>reloadExchange()}>Click here</a> to reload new connection.
                      <select className="form-control" onChange={(event) => { setExchange(event.target.value); getAccountBalance(event.target.value) } } aria-label="Select Exchange..." >
                        <option value="" style={{color: "gray"}} selected={exchange === ""}>Select Exchange...</option>
                        {exchangeApis.map( (el:any) => (
                          <option value={el!.data!.exchange+"|"+el!.data!.accountName+"|"+el!.data!.apiKey+"|"+el!.data!.testNet+"|"+el!.data!.subAccountFlag} key={el!.id!}>{el!.data!.accountName}</option>
                        ))}
                      </select>
                      <span style={{ color: "red" }}>{exchangeError}</span>
                    </>
                  )}
                  
                  <br/>
                  
                </div>
                
                {/* end::Table container */}
              </div>
               {/* begin::Body */}
              <div className='card-body py-3'>
                {/* begin::Table container */}
                Investment
                <br/>
                <br/>
                <div className='table-responsive'>
                
                  {
                    loadingBalance ? (
                    <>
                      <span className='indicator-progress' style={{display: 'block'}}>
                        Getting balance. Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    </>):(
                      accountBalance>0? (
                        <>
                          Your balance : &nbsp;
                              <NumberFormat
                                value={accountBalance}
                                className="text-warning"
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'$'}
                              />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          <span className="text-right">
                            <a href="#" onClick={event=>calInvestment(25)}>25%</a>&nbsp;&nbsp;<a href="#" onClick={event=>calInvestment(50)}>50%</a>&nbsp;&nbsp;<a href="#" onClick={event=>calInvestment(75)}>75%</a>
                            &nbsp;&nbsp;<a href="#" onClick={event=>calInvestment(100)}>Max</a>
                          </span>
                          &nbsp;&nbsp;
                          <input type = "number" className="form-control" placeholder='Investment Capital($)'
                          onChange={(event) => { setCapital(Number(event.target.value))} } value={capital}
                          // onFocus={event => initValue()}
                          readOnly={accountBalance<=0}
                          />
                          <div className='fv-plugins-message-container'>
                            <span role = "alert" style={{ color: "red" }}>{capitalError}</span>
                          </div>
                        </>
                      ):(
                        <>
                        <div className='fv-plugins-message-container'>
                            <span role = "alert" style={{ color: "red" }}>{capitalError}</span>
                        </div>
                        </>
                      )
                    )}
                </div>
                {/* end::Table container */}
              </div>
            </div>
          </div>
            
        </div>
      {/* end::Row */}

     
      {/* begin::Row */}
      <div className='row g-5 g-xl-12 text-center'>
            <div className='col-xl-12'>
              { saveDataFlag === 0 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={(event)=>{handleSubscribe()}}
                >
                Subscribe
                </button>
              ): (
                saveDataFlag === 1 ? (
                <button
                        type="button"
                        className="btn btn-primary"
                      >
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Subscribing...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                </button>
                ) : (
                  saveDataFlag === 3 ? (
                    <span className="text-success">Subscribe Successfully</span>
                  ) : (
                    <span className="text-danger">Subscribe Failed</span>
                  )
                )
              )}
              &nbsp;&nbsp;&nbsp;&nbsp;
              <button
                type="button"
                className="btn btn-light"
                data-bs-dismiss="modal"
                onClick={event => handleInitialForm()}
                >
                Cancel
                </button>
            </div>
            
        </div>
      {/* end::Row */}
      </>
  )
}


export {SubscribeStrategyDetail}