/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC} from 'react'
import {KTSVG} from '../../../../_metronic/helpers'
import {Field, ErrorMessage} from 'formik'

type Props={
  updateRiskType: (riskType:string) => void
}
const Step1: FC<Props> = ({updateRiskType}) => {
  return (
    <div className='w-100'>
      <div className='pb-10 pb-lg-15'>
        <h2 className='fw-bolder d-flex align-items-center text-dark'>
          Choose risk as you prefer.
          <i
            className='fas fa-exclamation-circle ms-2 fs-7'
            data-bs-toggle='tooltip'
            title='Risk of strategy'
          ></i>
        </h2>

        <div className='text-gray-400 fw-bold fs-6'>
          {/* If you need more info, please check out
          <a href='/dashboard' className='link-primary fw-bolder'>
            {' '}
            Help Page
          </a>
          . */}
        </div>
      </div>

      <div className='fv-row'>
        <div className='row'>
          <div className='col-lg-6'>
            <Field
              type='radio'
              className='btn-check'
              name='riskType'
              value='low'
              id='kt_suggest_bot_form_risk_type_low'
              onClick={(event:any)=>updateRiskType(event.target.value)}
            />
            <label
              className='btn btn-outline btn-outline-dashed btn-outline-default p-7 d-flex align-items-center mb-10'
              htmlFor='kt_suggest_bot_form_risk_type_low'
            >
              <KTSVG
                path='/media/icons/strategy/low-risk-50-dark.png'
                className='svg-icon-3x me-5'
              />

              <span className='d-block fw-bold text-start'>
                <span className='text-dark fw-bolder d-block fs-4 mb-2'>Low Risk</span>
                <span className='text-gray-400 fw-bold fs-6'>
                  Protect your money. Stable return.
                </span>
                <span className='text-dark fw-bolder d-block fs-4 mb-2'>Return: <span className="text-success">12 - 15%</span>&nbsp;per year</span>
                <span className='text-dark fw-bolder d-block fs-4 mb-2'>Max. Drawdown: <span className="text-danger">(5) - (12)%</span>&nbsp;per year</span>
                
              </span>
            </label>
          </div>

          <div className='col-lg-6'>
            <Field
              type='radio'
              className='btn-check'
              name='riskType'
              value='high'
              id='kt_suggest_bot_form_risk_type_high'
              onClick={(event:any)=>updateRiskType(event.target.value)}
            />
            <label
              className='btn btn-outline btn-outline-dashed btn-outline-default p-7 d-flex align-items-center'
              htmlFor='kt_suggest_bot_form_risk_type_high'
            >
              <KTSVG path='/media/icons/strategy/icons8-high-risk-50-dark.png' className='svg-icon-3x me-5' />

              <span className='d-block fw-bold text-start'>
                <span className='text-dark fw-bolder d-block fs-4 mb-2'>High Risk</span>
                <span className='text-gray-400 fw-bold fs-6'>
                  Rolling your money. Return big bonus.
                </span>
                
                <span className='text-dark fw-bolder d-block fs-4 mb-2'>Return: <span className="text-success">20 - 35%</span>&nbsp;per year</span>
                <span className='text-dark fw-bolder d-block fs-4 mb-2'>Max. Drawdown: <span className="text-danger">(15) - (30)%</span>&nbsp;per year</span>
              </span>
            </label>
          </div>

          <div className='text-danger mt-2'>
            <ErrorMessage name='riskType' />
          </div>
        </div>
      </div>
    </div>
  )
}

export {Step1}
