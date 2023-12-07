/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import clsx from 'clsx'

type Props = {
  className: string,
  strategyId: string
  strategyObj: any
}


const StrategyDetail_Profile: React.FC<Props> = ({className, strategyId, strategyObj}) => {

  const obj = strategyObj

  return (
    <>
    
    <div className={`card ${className}`} key={obj.id}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>{obj!.data!.asset}</span>
          <span className='text-muted fw-bold fs-7'>Asset</span>
        </h3>
        <div className='card-toolbar'>
          {/* begin::Menu */}
          {/*
          <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTSVG path='/media/icons/duotune/general/gen024.svg' className='svg-icon-2' />
          </button>
          <Dropdown1 />
          */}
          <h3 className='card-title align-items-start flex-column'>
            <span className={clsx(
                      'card-label fw-bolder fs-3 mb-1 ',
                      {
                        'text-success': obj!.data!.equity > 0,
                      },
                      {
                        'text-danger': obj!.data!.equity < 0,
                      }
                    )}>{obj!.data!.equity}%</span>
          </h3>
          {/* end::Menu */}
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table align-middle gs-0 gy-5'>
            {/* begin::Table head */}
            <thead>
              <tr>
                <th className='p-0 min-w-100px'></th>
                <th className='p-0 min-w-100px'></th>
                <th className='p-0 min-w-100px'></th>
                <th className='p-0 min-w-100px'></th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              <tr>
                <th>
                  <div className='symbol symbol-50px me-2'>
                    <a href='#' className='text-dark fw-bolder text-hover-primary mb-1 fs-6'>
                    {obj!.data!.strategy_type}
                    </a>
                    <span className='text-muted fw-bold d-block fs-7'>Strategy Type</span>
                  </div>
                </th>
                <td>
                  <a href='#' className={clsx(
                      'fw-bolder text-hover-primary mb-1 fs-6 ',
                      {
                        'text-success': obj!.data!.cagr > 0,
                      },
                      {
                        'text-danger': obj!.data!.cagr < 0,
                      }
                    )}>
                    {obj!.data!.cagr}%
                  </a>
                  <span className='text-muted fw-bold d-block fs-7'>% CAGR</span>
                </td>
                <td>
                  <a href='#' className={clsx(
                      'fw-bolder text-hover-primary mb-1 fs-6 ',
                      {
                        'text-success': obj!.data!.max_drawdown > 0,
                      },
                      {
                        'text-danger': obj!.data!.max_drawdown < 0,
                      }
                    )}
                  >
                    {obj!.data!.max_drawdown}%
                  </a>
                  <span className='text-muted fw-bold d-block fs-7'>% Max drawdown</span>
                </td>
                <td>
                  <a href='#'  className={clsx(
                      'fw-bolder text-hover-primary mb-1 fs-6 ',
                      {
                        'text-success': obj!.data!.annualized_std > 0,
                      },
                      {
                        'text-danger': obj!.data!.annualized_std < 0,
                      }
                    )}>
                    {obj!.data!.annualized_std}%
                  </a>
                  <span className='text-muted fw-bold d-block fs-7'>% Annualized STD</span>
                </td>
              </tr>
              <tr>
                <th>
                  <div className='symbol symbol-50px me-2'>
                    <a href='#' className='text-dark fw-bolder text-hover-primary mb-1 fs-6'>
                    {obj!.data!.equity_leverage}
                    </a>
                    <span className='text-muted fw-bold d-block fs-7'>Equity & Leverage</span>
                  </div>
                </th>
                <td>
                  <a href='#'  className={clsx(
                      'fw-bolder text-hover-primary mb-1 fs-6 ',
                      {
                        'text-success': obj!.data!.win_rate > 0,
                      },
                      {
                        'text-danger': obj!.data!.win_rate < 0,
                      }
                    )}>
                    {obj!.data!.win_rate}
                  </a>
                  <span className='text-muted fw-bold d-block fs-7'>% Win</span>
                </td>
                <td>
                  <div className='symbol symbol-50px me-2'>
                    <a href='#' className={clsx(
                      'fw-bolder text-hover-primary mb-1 fs-6 ',
                      {
                        'text-success': obj!.data!.avg_gain > 0,
                      },
                      {
                        'text-danger': obj!.data!.avg_gain < 0,
                      }
                    )}>
                    {obj!.data!.avg_gain}
                    </a>
                    <span className='text-muted fw-bold d-block fs-7'>% Avg. Gain</span>
                  </div>
                </td>
                <td>
                  <div className='symbol symbol-50px me-2'>
                    <a href='#' className='text-dark fw-bolder text-hover-primary mb-1 fs-6'>
                    {obj!.data!.sharp_ratio}
                    </a>
                    <span className='text-muted fw-bold d-block fs-7'>Sharp Ratio</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className='symbol symbol-50px me-2'>
                    <a href='#' className='text-dark fw-bolder text-hover-primary mb-1 fs-6'>
                    {obj!.data!.time_frame}
                    </a>
                    <span className='text-muted fw-bold d-block fs-7'>Time Frame</span>
                  </div>
                </td>
                <td>
                  <div className='symbol symbol-50px me-2'>
                    <a href='#'  className={clsx(
                      'fw-bolder text-hover-primary mb-1 fs-6 ',
                      {
                        'text-success': obj!.data!.loss_rate > 0,
                      },
                      {
                        'text-danger': obj!.data!.loss_rate < 0,
                      }
                    )}>
                    {obj!.data!.loss_rate}
                    </a>
                    <span className='text-muted fw-bold d-block fs-7'>% loss</span>
                  </div>
                </td>
                <td>
                  <div className='symbol symbol-50px me-2'>
                    <a href='#' className={clsx(
                      'fw-bolder text-hover-primary mb-1 fs-6 ',
                      {
                        'text-success': obj!.data!.avg_loss > 0,
                      },
                      {
                        'text-danger': obj!.data!.avg_loss < 0,
                      }
                    )}>
                    {obj!.data!.avg_loss}
                    </a>
                    <span className='text-muted fw-bold d-block fs-7'>% Avg. Loss</span>
                  </div>
                </td>
                <td>
                  <div className='symbol symbol-50px me-2'>
                    &nbsp;
                  </div>
                </td>
              </tr>
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
    </div>
    
    </>
  )
}

export {StrategyDetail_Profile}
