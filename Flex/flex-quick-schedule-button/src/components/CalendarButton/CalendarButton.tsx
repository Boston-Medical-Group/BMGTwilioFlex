import React, { useEffect, useState, useCallback } from 'react'
import { Button, ITask } from '@twilio/flex-ui'
import { CalendarIcon } from '@twilio-paste/icons/esm/CalendarIcon'
import { Spinner } from '@twilio-paste/core/spinner'
import { Flex } from '@twilio/flex-ui/src/FlexGlobal'
import useApi from '../../hooks/useApi'

type MyProps = {
  manager: Flex.Manager
  task?: ITask
}

export const CalendarButton = ({ manager, task }: MyProps) => {
  const { getCalendarUrl } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });

  const [isLoading, setIsLoading] = useState(false)
  const [calendarUrl, setCalendarUrl] = useState('')

  useEffect(() => {
    setIsLoading(true)
    getCalendarUrl(task)
      .then(({calendarUrl }: { calendarUrl: string }) => {
        setCalendarUrl(calendarUrl ?? '')
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
      <Button variant="primary" onClick={sendCalendarHandler} size="icon_small" style={{paddingTop: '0.32rem', paddingBottom: '0.32rem', minWidth: 'auto', marginRight: '0.25rem'}}>
        {isLoading ? (
          <Spinner size='sizeIcon10' decorative={false} title='Loading' />
        ) : (
        <CalendarIcon decorative={false}
          title='Agendar cita'
          size='sizeIcon10'
          />
        )}
      </Button>
    </>
  )
}