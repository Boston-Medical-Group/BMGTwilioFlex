import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Button, ITask } from '@twilio/flex-ui'
import { CalendarIcon } from '@twilio-paste/icons/esm/CalendarIcon'
import { Spinner } from '@twilio-paste/core/spinner'
import { Flex } from '@twilio/flex-ui/src/FlexGlobal'
import useApi from '../../hooks/useApi'
import { useQuery, QueryClient, QueryClientProvider, useMutation, useQueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

type MyProps = {
  manager: Flex.Manager
  task?: ITask
}

export const CalendarButton = ({ manager, task }: MyProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <QuickScheduleButton manager={manager} task={task} />
    </QueryClientProvider>
  )
}

const QuickScheduleButton = ({ manager, task }: MyProps) => {
  const { getCalendarUrl } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });

  //const queryClient = useQueryClient()

  const [pollCounter, setPollCounter] = useState(0)
  const [calendarUrl, setCalendarUrl] = useState('')
  const timerIdRef = useRef<string | number | undefined | NodeJS.Timeout>();
  const [isPollingEnabled, setIsPollingEnabled] = useState(true);
  const [runPoll, setRunPoll] = useState(true)

  const { isLoading, isError, data, error } = useQuery({
    //@ts-ignore
    queryKey: ['calendarUrl'],
    queryFn: async () => getCalendarUrl(task).then((result) => {
        if (result.calendarUrl === '') {
          setRunPoll(false)
          throw new Error('URL not found')
        } else {
          setRunPoll(false)
          return result
        }
      }),
    retry: 3,
    enabled: runPoll
  }, [])

  if (isLoading) {
    return null
  }

  //@ts-ignore
  if (isError || data?.calendarUrl === '') {
    return null
  }

  return (
    //@ts-ignore
    <Button variant="primary" href={data.calendarUrl} target="_blank" isLink={true} size="icon_small" style={{paddingTop: '0.32rem', paddingBottom: '0.32rem', minWidth: 'auto', marginRight: '0.25rem'}}>
        {isLoading ? (
          <Spinner size='sizeIcon10' decorative={false} title='Loading' />
        ) : (
        <CalendarIcon decorative={false}
          title='Agendar cita'
          size='sizeIcon10'
          />
        )}
      </Button>
  )
}