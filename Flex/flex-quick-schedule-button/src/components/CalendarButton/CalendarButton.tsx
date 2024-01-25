import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Button, ITask } from '@twilio/flex-ui'
import { CalendarIcon } from '@twilio-paste/icons/esm/CalendarIcon'
import { Spinner } from '@twilio-paste/core/spinner'
import { Flex } from '@twilio/flex-ui/src/FlexGlobal'
import useApi from '../../hooks/useApi'
import { useQuery } from '@tanstack/react-query'

type MyProps = {
  manager: Flex.Manager
  task?: ITask
}

export const CalendarButton = ({ manager, task }: MyProps) => {
  const { getCalendarUrl } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });

  const [pollCounter, setPollCounter] = useState(0)
  const [calendarUrl, setCalendarUrl] = useState('')
  const timerIdRef = useRef<string | number | undefined | NodeJS.Timeout>();
  const [isPollingEnabled, setIsPollingEnabled] = useState(true);
  const [runPoll, setRunPoll] = useState(false)

  const { isLoading, isError, data, error } = useQuery({
    //@ts-ignore
    queryKey: ['calendarUrl'],
    queryFn: (new Promise(async (resolve, reject) => {
      await getCalendarUrl(task)
        .then(({ calendarUrl }) => {
          if (calendarUrl !== null && calendarUrl !== '') {
            setCalendarUrl(calendarUrl)
            resolve(calendarUrl)
          } else {
            reject('error')
          }
        }).catch((err) => {
          reject(error)
        })
    }))
  })

  

  const sendCalendarHandler = useCallback((data) => {
    window.open(data, '_blank');
  }, [])

  if (calendarUrl === '' || isLoading) {
    return null
  }

  return (
    <>
      <Button variant="primary" onClick={sendCalendarHandler(data)} size="icon_small" style={{paddingTop: '0.32rem', paddingBottom: '0.32rem', minWidth: 'auto', marginRight: '0.25rem'}}>
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