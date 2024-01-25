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
  const [pollCounter, setPollCounter] = useState(0)
  const [calendarUrl, setCalendarUrl] = useState('')
  const [isPollingEnabled, setIsPollingEnabled] = useState(true);
  const [runPoll, setRunPoll] = useState(false)
  const [timerId, setTimerId] = useState<NodeJS.Timeout | undefined>()

  // Escribe código para React que haga poll a un servicio ajax cada 5 segundos hasta recibir un resultado esperado o hasta que lo haya intentado 4 veces.
  useEffect(() => {
    setIsLoading(true)
    const pollingCallback = async () => {
      const response = await getCalendarUrl(task)
      if (response.calendarUrl !== null && response.calendarUrl !== '') {
        setIsLoading(false)
        setCalendarUrl(response.calendarUrl)
        clearInterval(timerId);
      } else {
        setPollCounter((prevCounter) => prevCounter + 1);

        if (pollCounter >= 5) {
          setIsLoading(false)
          clearInterval(timerId);
        }
      }
    };

    setTimerId(setInterval(pollingCallback, 5000))

    return () => {
      setIsLoading(false)
      clearInterval(timerId);
    };
  }, [timerId]);

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