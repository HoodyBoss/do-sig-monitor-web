/* eslint-disable jsx-a11y/anchor-is-valid */
import React , { useState, useEffect, useRef}  from "react";
import {useAuth0} from "@auth0/auth0-react";
import {KTSVG} from '../../../_metronic/helpers'
import {db} from '../../../firebase'
import {collection, collectionGroup, addDoc, Timestamp, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'
import {useHistory} from 'react-router-dom'
import {Verify2MFA} from '../2mfa/Verify2MFA'
import MasterConfix from '../../../setup/MasterConfix'

type Props = {
  className: string
}

const ExchangeList: React.FC<Props> = ({className}) => {
  const history = useHistory()
  const divCloseModalbeRef = useRef<HTMLDivElement | null>(null)
  const divOVerify2MfaModalbeRef = useRef<HTMLDivElement | null>(null)
  const divOConfirmDeleteModalbeRef = useRef<HTMLDivElement | null>(null)
  
  
   //get user's profile from Auth0 token
   const {user} = useAuth0();
   const userId = user!.sub!.replaceAll("|","")
   const [data, setData] = useState([] as any[]) 
   const [reload, setReload] = useState(true)
   const [exchange, setExchange] = useState("")
   const [testNet, setTestNet] = useState("0")
   const [accountName, setAccountName] = useState("")
   const [apiKey, setApiKey] = useState("")
   const [apiSecret, setApiSecret] = useState("")
   const [subAccountFlag, setSubAccountFlag] = useState("")

   const [saveStatus, setSaveStatus] = useState(0)
   const [accountNameError, setAccountNameError] = useState("")
   const [exchangeError, setExchangeError] = useState("")
   const [apiKeyError, setApiKeyError] = useState("")
   const [apiSecretError, setApiSecretError] = useState("")
   const [saveErrorFlag, setSaveErrorFlag] = useState(0)
   const [saveSuccessFlag, setSaveSuccessFlag] = useState(0)
   const [saveErrorMsg, setSaveErrorMsg] = useState("")
   const [deleteResultFlag, setDeleteResultFlag] = useState(0)
   const [deleteResultMsg, setDeleteResultMsg] = useState("")
   

   const [apiKeyDelete, setApiKeyDelete] = useState("")


   const saveSecretApi = MasterConfix.API_BASE_ENDPOINT + MasterConfix.API_SAVE_SECRET_ENDPOINT//'https://asia-southeast1-crypto-342815.cloudfunctions.net/webApi/api/v1/save_secret';
   const deleteSecretApi = MasterConfix.API_BASE_ENDPOINT + MasterConfix.API_DELETE_SECRET_ENDPOINT//'https://asia-southeast1-crypto-342815.cloudfunctions.net/webApi/api/v1/save_secret';
   const validateApikeyUrl = MasterConfix.API_BASE_ENDPOINT + MasterConfix.API_VALIDATE_APIKEY//'https://asia-southeast1-crypto-342815.cloudfunctions.net/ValidateApi';
   const valifyAuthyUrl = MasterConfix.API_BASE_ENDPOINT + MasterConfix.API_VALIDATE_APIKEY//'https://asia-southeast1-crypto-342815.cloudfunctions.net/ValidateApi';

   const getExchangeList = async() => {
    let apiDetail = [] as any[]
    const rootColRef = query(collection(db, 'api_keys'), where("user_id", "==", userId ))
    await getDocs(rootColRef).then( async(docSnapshot) => {
      await Promise.all(docSnapshot.docs.map( async(api:any) => {
        apiDetail.push({id: api.id, data: api.data()} )
        return api 
      })) 
    })
    return apiDetail
   }

   const getLineToken = async() => {
    let lineToken = [] as any[]
    const rootColRef = query(collectionGroup(db, 'notifications'), where("user_id", "==", userId ))
    await getDocs(rootColRef).then( async(docSnapshot) => {
      await Promise.all(docSnapshot.docs.map( async(token:any) => {
        lineToken.push({id: token.id, data: token.data()} )
        return  
      })) 
    })
    return lineToken
   }

   const sendNoti = async() => {
    const lineToken = await getLineToken()
    await fetch( MasterConfix.SEND_NOTI_URL ,{ 
        method: "POST",
        body: JSON.stringify({
          token: lineToken![0].data!.line_token,
          notiMsg: "Created exchange connection successfully."
        }),
        headers: {
        "Content-Type": "application/json"
      }
     }).then( async response => { 
      // console.log("Fetch response:::", response)
    })

  }
   
   const initialFormValues = () => {
    setExchange("")
    setAccountName("")
    setApiKey("")
    setApiSecret("")
    setTestNet("0")
    setSubAccountFlag("0")

    setExchangeError("")
    setAccountNameError("")
    setApiKeyError("")
    setApiSecretError("")

    setSaveStatus(0)
    
  }

  const getData = async()=>{
    setData(await getExchangeList())
  }

  useEffect( () => {
    initialFormValues()

    if (reload) {
      const getExchange = async() => {
        await getData()
      }
      getExchange()
      setReload(false)
    }
    
  }, [])

  //save api secret function
  const createAndAccessSecret = async() => {
    
    const data = {
      apiKey: apiKey,
      apiSecret: apiSecret
    }
    //post secret to google secret manager
    return fetch( saveSecretApi,{ 
        method: "POST",
        body: JSON.stringify(data),
        headers: {
        "Content-Type": "application/json"
      }}).then(response => { return response } )
  }

  //save api secret function
  const deleteApiKey = async(key:any) => {
    
    const data = {
      apiKey: key
    }
    //post secret to google secret manager
    return fetch( deleteSecretApi,{ 
        method: "POST",
        body: JSON.stringify(data),
        headers: {
        "Content-Type": "application/json"
      }}).then(response => { return response } )
  }

  const validateForm = () => {
    let error = false
    if (accountName === "") {
      setAccountNameError("Please enter Account Name")
      error = true
    } else { 
        if (accountName!==null && accountName.indexOf(" ")>=0){
          setAccountNameError("Account Name. cannot has space")
          error = true
        }
    }

    if (exchange!==null && exchange === ""){
      setExchangeError("Please select exchange")
      error = true
    }
    if (apiKey!==null && apiKey === ""){
      setApiKeyError("Please enter API key")
      error = true
    }
    if (apiSecret!==null && apiSecret === ""){
      setApiSecretError("Please enter API secret")
      error = true
    }

    //check if form error then return false
    if (error){
      return false
    } else {
      return true
    }
  }
  const handleSubmit = async (e:any) => {
    e.preventDefault()

    if (!validateForm()){
      return;
    }

    try {
      setSaveStatus(1)
      //validate api, exchange and secret first
      await fetch( validateApikeyUrl ,{ 
        method: "POST",
        body: JSON.stringify({
          apiKey: apiKey,
          secret: apiSecret,
          exchange: exchange,
          testNet: testNet,
          accountName: accountName,
          subAccountFlag: subAccountFlag
        }),
        headers: {
        "Content-Type": "application/json"
      }}).then( async(response) => {  
        //save api secret in google secret manager
        if (response.status === 200) {
          await createAndAccessSecret()
          .then( async respose => {
            if (respose.status === 200) {
              await addDoc(collection(db, 'api_keys'), {
                user_id: userId,
                exchange: exchange,
                accountName: accountName,
                apiKey: apiKey,
                status: "Active",
                testNet: testNet,
                subAccountFlag: subAccountFlag,
                cd: Timestamp.now()
              });

              //send line noti to tell user about operation done.
              await sendNoti()

              setSaveStatus(3)
              setSaveSuccessFlag(1)
              await getData()
              setTimeout( ()=>{ setSaveSuccessFlag(0); divCloseModalbeRef!.current!.click(); }, 3000 )
            } else {
              setSaveErrorFlag(1)
              setSaveErrorMsg("Invalid API Key. Please try again or another one.")
              setSaveStatus(0)
              setTimeout( ()=>{setSaveErrorFlag(0)}, 10000 )
            }
          })
          
        } else {
          setSaveErrorFlag(1)
          setSaveErrorMsg("Invalid API Key. Please try again or another one.")
          setSaveStatus(0)
          setTimeout( ()=>{setSaveErrorFlag(0)}, 10000 )
        }
      })
      
    } catch (err) {
      //
      setSaveErrorFlag(1)
      setSaveErrorMsg("Invalid API Key. Please try again or another one..")
      setSaveStatus(0)
      setTimeout( ()=>{setSaveErrorFlag(0)}, 10000 )
    }
  }

  const displayText = (text:any) => {
    if (text != undefined && text != null && text.length>10) {
      return text.substring(0,9)+"..."
    } else {
      return text
    }
  }

  const handleSelectSubAccountFlag = (item:any) => {
    if (item.checked) {
      setSubAccountFlag("1")
    } else {
      setSubAccountFlag("0")
    }
  }

  const handleDelete=async(key:any)=>{
    setApiKeyDelete(key)
    divOConfirmDeleteModalbeRef!.current!.click()

  }

  const handleConfirmDelete=async()=>{

    try {
        setDeleteResultFlag(1)
      
        await deleteApiKey(apiKeyDelete).then( async respose => {
          if (respose.status === 200) {
            const rootColRef = query(collection(db, 'api_keys'), where("apiKey", "==", apiKeyDelete ))
            await getDocs(rootColRef).then( async(docSnapshot) => {
              docSnapshot.docs.map( async(api:any) => {
                await deleteDoc(doc(db, 'api_keys', api.id ) )
                setDeleteResultMsg("Delete connection successfully.")
                setDeleteResultFlag(2)
              })
              
            })
            
            //setSaveSuccessFlag(1)
            setTimeout( async()=>{ await getData() }, 1000)
            setTimeout( ()=>{ setDeleteResultFlag(0); }, 3000 )
          } else {
            setDeleteResultMsg("Delete connection failed. Please contact administrator.")
            setDeleteResultFlag(99)
            setTimeout( ()=>{ setDeleteResultFlag(0); }, 3000 )
          }
        })
          
        
    } catch (err) {
      //
      setDeleteResultMsg("Delete connection failed. Please contact administrator.")
      setDeleteResultFlag(99)
      setTimeout( ()=>{ setDeleteResultFlag(0); }, 3000 )
    }
  }

  

  return (
    <>
    <div ref={divCloseModalbeRef} id = "closeModal" data-bs-toggle="modal" data-bs-target={"#kt_modal_add_api"} />
    <div ref={divOVerify2MfaModalbeRef} id = "openVerify2MfaModal" data-bs-toggle="modal" data-bs-target={"#kt_modal_verify_2mfa"} />
    <div ref={divOConfirmDeleteModalbeRef} id = "openConfirmDeleteModal" data-bs-toggle="modal" data-bs-target={"#kt_modal_confirm_delete"} />

    <div className="modal fade" tabIndex={-1} id="kt_modal_verify_2mfa" data-bs-backdrop="static" data-bs-keyboard="false">

      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content ">
          <div className="modal-header">
            <h5 className="modal-title">Verify 2MFA Application</h5>
            
            <div
              className="btn btn-icon btn-sm btn-active-light-primary ms-2"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={event => initialFormValues()}
            >
              <KTSVG
                path="/media/icons/duotune/arrows/arr061.svg"
                className="svg-icon svg-icon-2x"
              />
            </div>
          </div>
          <div className="modal-body">
              <Verify2MFA />
          </div>
        </div>
      </div>
    </div>

    <div className="modal fade" tabIndex={-1} id="kt_modal_confirm_delete" data-bs-backdrop="static" data-bs-keyboard="false">

      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content ">
          <div className="modal-header">
            <h5 className="modal-title">Delete connection</h5>
            
            <div
              className="btn btn-icon btn-sm btn-active-light-primary ms-2"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={event => initialFormValues()}
            >
              <KTSVG
                path="/media/icons/duotune/arrows/arr061.svg"
                className="svg-icon svg-icon-2x"
              />
            </div>
          </div>
          <div className="modal-body">
              Do you want to delete this connection?
          </div>
          <div className="modal-footer modal-dialog-centered">
              <a href="" className="text-success"  data-bs-dismiss="modal" onClick={event => handleConfirmDelete()}>Yes</a>
              &nbsp;&nbsp;
              <a href="" data-bs-dismiss="modal" className="text-danger" onClick={event => initialFormValues()}>No</a>
          </div>
        </div>
      </div>
    </div>

    <div className="modal fade" tabIndex={-1} id="kt_modal_add_api" data-bs-backdrop="static" data-bs-keyboard="false">
    { saveErrorFlag === 1 ? (
        <div className="alert alert-danger" role="alert">
            {saveErrorMsg}
        </div>
    ):(<></>)}
    { saveSuccessFlag === 1 ? (
        <div className="alert alert-success" role="alert">
            Created exchange connection successfully.
        </div>
    ):(<></>)}

    
      
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content ">
          <div className="modal-header">
            <h5 className="modal-title">Connection</h5>
            
            <div
              className="btn btn-icon btn-sm btn-active-light-primary ms-2"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={event => initialFormValues()}
            >
              <KTSVG
                path="/media/icons/duotune/arrows/arr061.svg"
                className="svg-icon svg-icon-2x"
              />
            </div>
          </div>
          <div className="modal-body">
         
              <select className="form-select form-select-solid" aria-label="Select Exchange..." id = "exchange"
              onChange={(event) => { setExchange(event.target.value)} }
              >
                <option style={{color: "gray"}} value="" selected={exchange===""}>Select Exchange...</option>
                <option value="ftx">FTX</option>
                {/* <option value="binance">Binance</option>
                <option value="ftx">FTX</option>
                <option value="coinbase">Coinbase</option> */}
              </select>
              <div className='fv-plugins-message-container'>
                <span role="alert" className="text-danger">{exchangeError}</span>
              </div>
              <br/>
              
              
              <br/>
              <input
                type="text"
                id = "accountName"
                autoComplete='off'
                value = {accountName}
                className="form-control"
                placeholder="Account Name"
                onChange={(event) =>  setAccountName(event.target.value) }
              />
              <div className='fv-plugins-message-container'>
                <span role="alert" className="text-danger">{accountNameError}</span>
              </div>
              <br/>
              
                <input
                  type="checkbox"
                  name = "subAccountFlag"
                  className="form-check-input form-check-input-border form-check-input-border-radius"
                  onChange={(event) =>  handleSelectSubAccountFlag(event.target) }
                  style={{outline: "1px solid #FFF"}}
                />&nbsp;&nbsp;Sub account?
                <br/>
                <br/>
              
              <input
                type="text"
                value = {apiKey}
                autoComplete='off'
                className="form-control"
                placeholder="API Key"
                onChange={(event) => setApiKey(event.target.value) }
              />
              <span className="text-danger">{apiKeyError}</span>
              <br/>
              <input
                type='password'
                value = {apiSecret}
                autoComplete='off'
                className="form-control"
                placeholder="API Secret"
                onChange={(event) => setApiSecret(event.target.value) }
              />
              <div className='fv-plugins-message-container'>
                <span className="text-danger">{apiSecretError}</span>
              </div>
              <br/>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-light"
              data-bs-dismiss="modal"
              onClick={event => initialFormValues()}
            >
              Close
            </button>
            { saveStatus == 0 ? (
              <button type='button'
                  id='kt_add_apikey_submit' className="btn btn-primary" onClick={event=>handleSubmit(event)}>
                Save
              </button>
            ) : (
              saveStatus == 1 ? (
                <span className='indicator-progress' style={{display: 'block'}}>
                    Saving...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
              ): (
                saveStatus == 3 ? (
                  <span className="text-success">Save Successfully</span>
                ) : (
                  <span className="text-danger">Save Failed</span>
                )
              )
            )}
          </div>
        </div>
      </div>
    </div>
    { deleteResultFlag === 1 ? (
      <div className="alert alert-primary" role="alert">
        <span className='indicator-progress' style={{display: 'block'}}>
          Deleting...
          <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
        </span>
      </div>
    ):(
      deleteResultFlag === 2 ? (
      <div className="alert alert-success" role="alert">
        {deleteResultMsg}
      </div>
    ):(
      deleteResultFlag === 99 ? (
        <div className="alert alert-danger" role="alert">
          {deleteResultMsg}
      </div>
      ):(<></>)
    ))} 
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Exchange API Key</span>
          <span className='text-muted mt-1 fw-bold fs-7'>...</span>
          
        </h3>
        
        <div className='card-toolbar'>
          {/* begin::Menu */}
          
          <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
           
          </button>
          <a href="#" className="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#kt_modal_add_api" id="kt_add_api_button" >New API</a>
          
          {/* end::Menu */}
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table align-middle gs-0 gy-4'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bolder text-muted bg-light'>
                <th className='ps-4 min-w-300px rounded-start'>Exchange</th>
                <th className='min-w-125px'>Account Name</th>
                <th className='min-w-125px'>API Key</th>
                <th className='min-w-125px'>Status</th>
                <th className='min-w-200px text-end rounded-end'></th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {data.map( el => 
              <tr key={el.id}>
                <td>
                  <div className='d-flex align-items-center'>
                    <div className='symbol symbol-50px me-5'>
                      <span className='symbol-label bg-light'>
                        <img
                          src={'/media/svg/avatars/'+el!.data!.exchange+'.svg'}
                          className='h-75 align-self-end'
                          alt=''
                        />
                      </span>
                    </div>
                    <div className='d-flex justify-content-start flex-column'>
                      <a href='#' className='text-dark fw-bolder text-hover-primary mb-1 fs-6'>
                        {el!.data!.exchange}
                      </a>
                      <span className='text-muted fw-bold text-muted d-block fs-7'>
                        {displayText(el!.data!.apiKey)}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <a href='#' className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                  {el!.data!.accountName}
                  </a>
                  <span className='text-muted fw-bold text-muted d-block fs-7'></span>
                </td>
                <td>
                  <a href='#' className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6' >
                  {displayText(el!.data!.apiKey)}
                  </a>
                  <span className='text-muted fw-bold text-muted d-block fs-7'></span>
                </td>
                <td>
                  <a href='#' className='text-dark fw-bolder text-hover-primary d-block mb-1 fs-6'>
                  {el!.data!.status}
                  </a>
                  <span className='text-muted fw-bold text-muted d-block fs-7'></span>
                </td>
               
                <td className='text-end'>
                 
                  <a
                    href='#'
                    className='btn btn-bg-secondary btn-color-danger btn-active-color-danger btn-sm px-4'
                    onClick={event=>handleDelete(el!.data!.apiKey)}
                  >
                    Delete
                  </a>
                </td>
              </tr>
              )}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
   </>
  )
}

export {ExchangeList}
