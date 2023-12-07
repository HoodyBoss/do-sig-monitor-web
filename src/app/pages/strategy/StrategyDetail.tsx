import React, {useEffect}  from 'react'
import {useAuth0} from "@auth0/auth0-react";

import {
  StrategyDetail_Profile
} from './StrategyDetail_Profile'
import {
  StrategyDetail_Top
} from './StrategyDetail_Top'
import {
  StrategyDetail_Chart
} from './StrategyDetail_Chart'

import {StrategyDetail_More} from "./StrategyDetail_More"

type Props = {
  strategyId: string
  strategyObj: any
  exchange: string
  updateExchange: (arg: string) => void
  apis: any
}

const StrategyDetail : React.FC<Props> = ({strategyId, strategyObj, exchange, updateExchange, apis}) => {
 
  const { user } = useAuth0();

  const strategyName = strategyObj!.data!.strategy_name;

  useEffect( ()=>{

  }, [exchange])

  return (
    <>
    
    {/* begin::Row */}
      <div className='row g-5 g-xxl-12'>
        <div className='col-xxl-12'>
          <StrategyDetail_Top
            className='card-xxl-stretch mb-5 mb-xxl-12'
            image='abstract-1.svg'
            title={strategyName}
            time='10AM Jan, 2021'
            description='Description here'
            strategy={strategyObj}
            exchange={exchange}
            updateExchange={updateExchange}
            apis={apis}
          />
        </div>
      </div>
    {/* end::Row */}
    {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
        <div className='col-xl-6'>
          <StrategyDetail_Profile className='card-xl-stretch mb-xl-8' strategyId={strategyId} strategyObj={strategyObj}></StrategyDetail_Profile>
        </div>
        <div className='col-xl-6'>
          <StrategyDetail_Chart className='card-xl-stretch mb-5 mb-xl-8' />
        </div>
      </div>
    {/* end::Row */}

    
    </>
  )
}


export {StrategyDetail}