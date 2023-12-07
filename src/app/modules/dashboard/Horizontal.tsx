import React, {FC, useEffect, useRef, useState} from 'react'
import {Step1} from './steps/Step1'
import {Step2} from './steps/Step2'
import {Step3} from './steps/Step3'
import {Step4} from './steps/Step4'
import {Step5} from './steps/Step5'
import {KTSVG} from '../../../_metronic/helpers'
import {StepperComponent} from '../../../_metronic/assets/ts/components'
import {Formik, Form, FormikValues} from 'formik'
import {createAccountSchemas, ICreateAccount, inits} from './CreateAccountWizardHelper'
import {collection, query, getDocs, where } from 'firebase/firestore'
import {db} from '../../../firebase'
import {useAuth0} from "@auth0/auth0-react";
import {SubscribeStrategyDetail} from "../../pages/subscribe_strategy/SubscribeStrategyDetail"


const Horizontal: FC = () => {
  const stepperRef = useRef<HTMLDivElement | null>(null)
  const stepper = useRef<StepperComponent | null>(null)
  const divConnectionModalRef = useRef<HTMLDivElement | null>(null)
  const divSubscribeRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLDivElement>(null);
  

  const [currentSchema, setCurrentSchema] = useState(createAccountSchemas[0])
  const [initValues] = useState<ICreateAccount>(inits)
  const [isSubmitButton, setSubmitButton] = useState(false)
  const [riskType, setRiskType] = useState("")
 

  const { user} = useAuth0();
  const userId = user!.sub!.replaceAll('|','')

  const loadStepper = () => {
    stepper.current = StepperComponent.createInsance(stepperRef.current as HTMLDivElement)
  }

  const prevStep = () => {
    if (!stepper.current) {
      return
    } 

    setSubmitButton(stepper.current.currentStepIndex === stepper.current.totatStepsNumber! - 1)

    stepper.current.goPrev()

    setCurrentSchema(createAccountSchemas[stepper.current.currentStepIndex - 1])
  }

  const submitStep = (values: ICreateAccount, actions: FormikValues) => {
    if (!stepper.current) {
      return
    }

    setSubmitButton(stepper.current.currentStepIndex === stepper.current.totatStepsNumber! - 1)

    setCurrentSchema(createAccountSchemas[stepper.current.currentStepIndex])

    if (stepper.current.currentStepIndex !== stepper.current.totatStepsNumber) {
      stepper.current.goNext()
    } else {
      stepper.current.goto(1)
      actions.resetForm()
    }
  }

  useEffect(() => {
    if (!stepperRef.current) {
      return
    }

    loadStepper()
  }, [stepperRef])

  const updateRiskType=async(riskType:any)=>{
    setRiskType(riskType)
    
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

  const handleClickSubscribe = async() => {
    let apis = await getApisList()
    let hasExchange = apis!=null && apis.length>0 ? true: false;
    if (hasExchange){
      divSubscribeRef!.current!.click()
    } else {
      divConnectionModalRef!.current!.click()
    }
  }

  const setExchange=()=>{
    //exchange = exchangeRef!.current!.value
    //updateExchange(exchange)
  }


  return (
    <>
    <div ref={divConnectionModalRef} id = "openConnectionModal" data-bs-toggle="modal" data-bs-target={"#kt_modal_add_api"} onClick={event=>setExchange()}/>
    <div ref={divSubscribeRef} id = "openSubscribeModal" data-bs-toggle="modal" data-bs-target={"#kt_modal_subscribe"} />
    <div className='card '>
      <div className='card-body'>
        <div
          ref={stepperRef}
          className='stepper stepper-links d-flex flex-column pt-15'
          id='kt_create_account_stepper'
        >
          <div className='stepper-nav mb-5'>
            <div className='stepper-item current' data-kt-stepper-element='nav'>
              <h3 className='stepper-title'>Risk</h3>
            </div>

            <div className='stepper-item' data-kt-stepper-element='nav'>
              <h3 className='stepper-title'>Suggest Bot</h3>
            </div>

            
          </div>

          <Formik validationSchema={currentSchema} initialValues={initValues} onSubmit={submitStep}>
            {() => (
              <Form className='mx-auto mw-1200px w-100 pt-15 pb-10' id='kt_suggest_bot_form'>
                <div className='current' data-kt-stepper-element='content'>
                  <Step1 updateRiskType={updateRiskType} />
                </div>

                <div data-kt-stepper-element='content' >
                  <Step2 riskType={riskType} />
                </div>
                
                <div className='d-flex flex-stack pt-15'>
                  <div className='mr-2'>
                    <button
                      onClick={prevStep}
                      type='button'
                      className='btn btn-lg btn-light-primary me-3'
                      data-kt-stepper-action='previous'
                    >
                      <KTSVG
                        path='/media/icons/duotune/arrows/arr063.svg'
                        className='svg-icon-4 me-1'
                      />
                      Back
                    </button>
                  </div>

                  <div>
                    {!isSubmitButton ? (
                    <button type='submit' className='btn btn-lg btn-primary me-3'>
                      <span className='indicator-label'>
                        Continue
              
                        <KTSVG
                          path='/media/icons/duotune/arrows/arr064.svg'
                          className='svg-icon-3 ms-2 me-0'
                        />
                      </span>
                    </button>
                    ):(<button type='button' className='btn btn-lg btn-primary me-3' onClick={event=>handleClickSubscribe()}>
                    <span className='indicator-label'>
                      Subscribe
            
                      <KTSVG
                        path='/media/icons/duotune/arrows/arr064.svg'
                        className='svg-icon-3 ms-2 me-0'
                      />
                    </span>
                  </button>)}
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  </>)
}

export {Horizontal}
