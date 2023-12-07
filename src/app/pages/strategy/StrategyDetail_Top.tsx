/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useRef, useEffect, useState}  from 'react'
import store from '../../../setup/redux/Store'
import {collection, query, getDocs, where } from 'firebase/firestore'
import {db} from '../../../firebase'
import {useAuth0} from "@auth0/auth0-react";
import NumberFormat from 'react-number-format';

type Props = {
  className: string
  image: string
  title: string
  time: string
  description: string
  strategy: any
  exchange: string
  updateExchange: (arg: string) => void
  apis: any
}

const StrategyDetail_Top: React.FC<Props> = ({className, image, title, time, description, strategy, exchange, updateExchange, apis}) => {
  
  let userModel = store.getState();
  const { user} = useAuth0();
  const userId = user!.sub!.replaceAll('|','')

  const divConnectionModalRef = useRef<HTMLDivElement | null>(null)
  const divSubscribeRef = useRef<HTMLDivElement | null>(null)
  const exchangeRef = useRef<HTMLInputElement | null>(null)
  const [exchangeList, setExchangeList] = useState([] as any[])

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

  const handleClickSubscribe = async(strategyId:any) => {
    apis = await getApisList()
    let hasExchange = apis!=null && apis.length>0 ? true: false;
    if (hasExchange){
      divSubscribeRef!.current!.click()
    } else {
      divConnectionModalRef!.current!.click()
    }
  }

  const el = strategy

  const extractExchange=(value:[]) => {
    return value != null ? value.join(','):""
  }

  const setExchange=()=>{
    exchange = exchangeRef!.current!.value
    updateExchange(exchange)
  }

  useEffect( () => {

    const prepareApisList = async() => {
      setExchangeList(await getApisList())
    }
    prepareApisList()
    
    return () => {
      setExchangeList([]);
    };
    
  }, [exchange])


  const displayExchange =(exchangeArr:any)=> {
    if (exchangeArr===undefined){
      return ''
    } else if (exchangeArr!=undefined && exchangeArr.length===1){
      return exchangeArr![0]
    } else {
      return exchangeArr!.join(', ')
    }
    //return ''
  }


  return (
    <>
    <div ref={divConnectionModalRef} id = "openConnectionModal" data-bs-toggle="modal" data-bs-target={"#kt_modal_add_api"} onClick={event=>setExchange()}/>
    <div ref={divSubscribeRef} id = "openSubscribeModal" data-bs-toggle="modal" data-bs-target={"#kt_modal_copy_strategy_"+el!.id} />
    <input ref={exchangeRef} type = "hidden" id = {"exchanges_support_"+el!.id} value = {extractExchange(el!.data!.exchange)}/>
    <div key={el!.id}
      className={`card bgi-no-repeat ${className}`}
      style={{
        backgroundPosition: 'right top',
        backgroundSize: '30% auto',
        backgroundImage: `url('/media/svg/shapes/' + image)`,
      }}
    >
      {/* begin::Body */}
      <div className='card-header border-0 py-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>{el!.data!.asset_type} : {el!.data!.asset}
          </span>

          <span className='text-muted fw-bold fs-7'>Asset Type:Asset</span>
        </h3>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>{displayExchange(el!.data!.exchange).toUpperCase()}
          </span>
 
          <span style={{color: "#858585", fontSize: "80%", textAlign:"left"}}>{el!.data!.description}</span>
        </h3>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Minimum investment: &nbsp;
                <NumberFormat
                  value={el!.data!.min_capital}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'$'}
                />
          </span>

          <span className='text-muted fw-bold fs-7'></span>
        </h3> 
         
      </div>
      <div className='card-body' style={{
          backgroundPosition: 'left bottom',
        }}>
          <a href="#" className="btn btn-sm btn-primary"  id="copy_strategy" onClick={(event) => {handleClickSubscribe(el!.id)}}>Subscribe</a>
      </div>
      {/* end::Body */}
    </div>
    
    </>
  )
}

export {StrategyDetail_Top}
