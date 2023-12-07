import React, {forwardRef, FC, useState, useEffect, useRef} from 'react'
import { StrategySuggest } from '../../../pages/strategy/StrategySuggest'

type Props={
  riskType: string
}
const Step2: FC<Props> = ({riskType}) => {

  //const [currentValue] = useState<ICreateAccount>(getValues)
  const [risk, setRisk] = useState("")
  
  useEffect( ()=>{
    setRisk(riskType)
    //console.log("Risk type :::", currentValue!.riskType!)
  }, [risk, riskType])
  return (
    <>

        <div >
          <StrategySuggest riskType={riskType} />
        </div>
    </>
  )
}

export {Step2}
