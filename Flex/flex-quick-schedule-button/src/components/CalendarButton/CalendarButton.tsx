import React, { useEffect, useState, useCallback, useRef } from 'react'
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
  const timerIdRef = useRef<string | number | undefined | NodeJS.Timeout>();
  const [isPollingEnabled, setIsPollingEnabled] = useState(true);

  useEffect(() => {
    setIsLoading(true)
    
    const pollingCallback = async () => {
      await getCalendarUrl(task)
        .then(({ calendarUrl }: { calendarUrl: string }) => {
          if (calendarUrl !== null && calendarUrl !== '') {
            setCalendarUrl(calendarUrl ?? '')
            setIsLoading(false)
          }
        }).catch(err => {
          setCalendarUrl('')
        })
    };

    const startPolling = () => {
      timerIdRef.current = setInterval(pollingCallback, 5000);
    };

    const stopPolling = () => {
      clearInterval(timerIdRef.current);
    };

    if (calendarUrl === null || calendarUrl === '') {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [calendarUrl, isPollingEnabled])

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