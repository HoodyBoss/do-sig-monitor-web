/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect} from 'react'
import { Ellipsis } from 'react-bootstrap-v5/lib/esm/PageItem'
import {KTSVG, toAbsoluteUrl} from '../../../helpers'
import {Dropdown1} from '../../content/dropdown/Dropdown1'

type Props = {
  userId: string
}

const StrategyList: React.FC<Props> = ({userId}) => {

  const [data, setData] = useState([] as any[])

  useEffect( () => {
    fetch('https://jsonplaceholder.typicode.com/users', {method: 'POST'})
      .then(response => response.json())
      .then(data => setData(data))
  }, [])

  return (
    
      <div className='card-body pt-3'>

        { data.map( el => {
          {console.log(el.name)}
          {/* begin::Item */}
            <div className='d-flex align-items-sm-center mb-7'>
              {/* begin::Symbol */}
              <div className='symbol symbol-60px symbol-2by3 me-4'>
                <div
                  className='symbol-label'
                  style={{backgroundImage: `url(${toAbsoluteUrl('/media/stock/600x400/img-20.jpg')})`}}
                ></div>
              </div>
              {/* end::Symbol */}
              {/* begin::Title */}
              <div className='d-flex flex-row-fluid flex-wrap align-items-center'>
                <div className='flex-grow-1 me-2'>
                  <a href='#' className='text-gray-800 fw-bolder text-hover-primary fs-6'>
                    Cup &amp; Green
                  </a>
                  <span className='text-muted fw-bold d-block pt-1'>Size: 87KB</span>
                </div>
                <span className='badge badge-light-success fs-8 fw-bolder my-2'>Approved</span>
              </div>
              {/* end::Title */}
            </div>
          {/* end::Item */}
        })}
        
      </div>

  )
}

export {StrategyList}
