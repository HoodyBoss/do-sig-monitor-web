/* eslint-disable jsx-a11y/anchor-is-valid */
import React , { useState, useEffect, useRef}  from "react";
import {useAuth0} from "@auth0/auth0-react";
import {KTSVG} from '../../../_metronic/helpers'
import {db} from '../../../firebase'
import {collection, addDoc, Timestamp, query, where, getDocs} from 'firebase/firestore'
import MasterConfix from '../../../setup/MasterConfix'

type Props = {
    strategyId: string
    exchanges: string
    connectionCreated: (arg: string) => void
    updateApis: (args:any[])=>void
}

const ConnectionModal:React.FC<Props> = ({strategyId, exchanges, connectionCreated, updateApis}) => {

    const divSubscribeRef = useRef<HTMLDivElement | null>(null)
    //get user's profile from Auth0 token
    const {user} = useAuth0();
    const userId = user!.sub!.replaceAll("|","")
    const [data, setData] = useState([] as any[]) 
    const [reload, setReload] = useState(true)
    const [saveErrorFlag, setSaveErrorFlag] = useState(0)
    const [saveSuccessFlag, setSaveSuccessFlag] = useState(0)
    
    const [saveErrorMsg, setSaveErrorMsg] = useState("")
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
    const [supportExchange, setSupportExchange] = useState([] as any[])

    const [show, setShow] = useState(false)

    const funcUrl = MasterConfix.API_BASE_ENDPOINT+MasterConfix.API_SAVE_SECRET_ENDPOINT;
    const validateApikeyUrl = MasterConfix.API_BASE_ENDPOINT+MasterConfix.API_VALIDATE_APIKEY;

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
        
        if (exchanges!=null && exchanges!=""){
            setSupportExchange(exchanges.split(','))
        }
        

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
        return fetch( funcUrl,{ 
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
                setAccountNameError("Invalid Account Name. Account Name. should not has space")
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
                    await createAndAccessSecret().then( async respose => {
                    
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
                        })
                        setSaveStatus(3)
                        //await getData();
                        updateApis(await getExchangeList())
                        connectionCreated("success")
                        divSubscribeRef!.current!.click();
                    } else {
                        setSaveErrorFlag(1)
                        setSaveErrorMsg("Invalid API Key. Maybe duplicate key in system. Please try other api.")
                        setSaveStatus(0)
                        setTimeout( ()=>{setSaveErrorFlag(0)}, 10000 )
                    }
                })
                
                } else {

                    setSaveErrorFlag(1)
                    setSaveErrorMsg("Invalid API Key. Please try again. (Maybe don't check Is Sub-Account? flag.")
                    
                    setSaveStatus(0)
                    setTimeout( ()=>{setSaveErrorFlag(0)}, 10000 )
                }
            })
        
    } catch (err) {
        //
            //alert("Invalid API Key. Please try again")
            setSaveErrorFlag(1)
            setSaveErrorMsg("Invalid API Key. Please try again")
            
            setSaveStatus(0)
            setTimeout( ()=>{setSaveErrorFlag(0)}, 10000 )
            setSaveStatus(0)
        }
    }

    const displayText = (text:any) => {
        if (text != undefined && text != null && text.length>10) {
            return text.substring(0,9)+"..."
        } else {
            return text
        }
    }

    const handleSelectTestNet = (item:any) => {
        if (item.checked) {
            setTestNet("1")
        } else {
            setTestNet("0")
        }
    }

    const handleSelectSubAccountFlag = (item:any) => {
        if (item.checked) {
            setSubAccountFlag("1")
        } else {
            setSubAccountFlag("0")
        }
    }
    //data-bs-backdrop="static" data-bs-keyboard="false"
    return (
        
        <>
        
        <div ref={divSubscribeRef} id = "openSubscribeModal" data-bs-toggle="modal" data-bs-target={"#kt_modal_copy_strategy_"+strategyId} />
        <div className="modal fade" tabIndex={-1} id={"kt_modal_add_api"} data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="alert alert-warning" role="alert">
                    You don't have connection for FTX. Please create one.
                </div>
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
                        <h5 className="modal-title">New connection</h5>
                        
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
                    
                        <select className="form-select form-select-solid" aria-label="Select Exchange..." 
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
                        
                        
                        <input
                            type="text"
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
                            />&nbsp;&nbsp;Is Sub-Account?
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
                        { saveStatus === 0 ? (
                            <button type='button' className="btn btn-primary" onClick={event=>handleSubmit(event)}>
                                Save
                            </button>
                        ) : (
                            saveStatus === 1 ? (
                                <span className='indicator-progress' style={{display: 'block'}}>
                                    Saving...
                                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                </span>
                        ) : (
                                saveStatus === 3 ? ( 
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
        </>
    )
}

export {ConnectionModal}