import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { Actions, Button, ITask } from '@twilio/flex-ui'
import axios from 'axios'

import { CalendarIcon } from '@twilio-paste/icons/esm/CalendarIcon'
import { Spinner } from '@twilio-paste/core/spinner'
import { Flex } from '@twilio/flex-ui/src/FlexGlobal'

axios.defaults.baseURL = process.env.FLEX_APP_TWILIO_SERVERLESS_DOMAIN

type MyProps = {
  manager: Flex.Manager
  task?: ITask
}

const IconWrapper = styled.div<{isLoading: boolean}>`
  margin: 0.8rem;
  cursor: ${props => (props.isLoading ? 'not-allowed' : 'pointer')};
`

export const CalendarButton = ( {manager, task}: MyProps ) => {
  const [isLoading, setIsLoading] = useState(false)
  const [calendarUrl, setCalendarUrl] = useState('')

  useEffect(() => {
    setIsLoading(true)
    axios.post(`/getCalendarUrl`, {
      token: manager.store.getState().flex.session.ssoTokenPayload.token,
      calendar_url_field: process.env.FLEX_APP_CALENDAR_URL_FIELD,
      contact_id: task?.attributes?.hubspot_contact_id,
      deal_id: task?.attributes?.hubspot_deal_id
    }).then((response: { data: { calendarUrl: string } }) => {
      setCalendarUrl(response.data.calendarUrl ?? '')
    }).catch(err => {
      setCalendarUrl('')
    }).finally(() => {
      setIsLoading(false)
    })
  }, [])

  const sendCalendarHandler = useCallback(() => {
    window.open(calendarUrl, '_blank');
  }, [calendarUrl])

  if (calendarUrl === '') {
    return null
  }

  return (
    <>
      <Button variant="primary" href={calendarUrl} size="icon_small" style={{paddingTop: '0.32rem', paddingBottom: '0.32rem', minWidth: 'auto', marginRight: '0.25rem'}}>
        {isLoading ? (
          <Spinner size='sizeIcon10' decorative={false} title='Loading' />
        ) : (
        <CalendarIcon decorative={false}
          title='Agendar cita'
          size='sizeIcon10'
          onClick={sendCalendarHandler}
          />
        )}
      </Button>
    </>
  )
}