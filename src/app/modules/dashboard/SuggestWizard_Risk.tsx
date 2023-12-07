/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef} from 'react'
import clsx from 'clsx'

type Props = {
  className: string
}

const Risk: React.FC<Props> = ({className}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    

    return () => {
      
    }
  }, [])

  return (
    <div className={`card ${className}`}>
      {/* begin::Body */}
      <div className='card-body p-0'>
        <div className='d-flex flex-stack card-p flex-grow-1'>
          <span className={clsx('symbol symbol-50px', `symbol-light-`, 'me-2')}>
            <span className='symbol-label'>
              
            </span>
          </span>

          <div className='d-flex flex-column text-end'>
            <span className='text-dark fw-bolder fs-2'></span>

            <span className='text-muted fw-bold mt-1'></span>
          </div>
        </div>

      </div>
      {/* end::Body */}
    </div>
  )
}

export {Risk}

