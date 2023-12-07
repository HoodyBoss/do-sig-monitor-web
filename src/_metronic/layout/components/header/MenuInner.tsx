import React from 'react'
import {MenuItem} from './MenuItem'
import {MenuInnerWithSub} from './MenuInnerWithSub'
import {MegaMenu} from './MegaMenu'
import {useIntl} from 'react-intl'

export function MenuInner() {
  const intl = useIntl()
  return (
    <>
      {/* <MenuItem title={intl.formatMessage({id: 'MENU.DASHBOARD'})} to='/dashboard' />
      <MenuItem title='My Strategy' to='/strategy/my-strategy'   />
      <MenuItem title='Strategy Pool' to='/strategy/strategy_pool'   />
      <MenuItem title='Connection' to='/setup/exchange_setup'   />
      <MenuItem title='Account Setting' to='/account'   /> */}
    </>
  )
}
