import React, { useCallback, useEffect, useState } from 'react'
import { Button, ITask } from '@twilio/flex-ui'
import { VoiceCapableIcon } from '@twilio-paste/icons/esm/VoiceCapableIcon'
import { Flex } from '@twilio/flex-ui/src/FlexGlobal'
import useLang from '../../hooks/useLang'

type MyProps = {
  manager: Flex.Manager
  task?: ITask
}

// Create a function that checks if a variable is an empty string or null
const isNullOrEmpty = (value: any) => {
  return value === null || value === undefined || value === ''
}

export const CallButton = ({ manager, task }: MyProps) => {

  const { _l } = useLang()
  const [payload, setPayload] = useState({});

  useEffect(() => {
    if (!isNullOrEmpty(task?.attributes?.hubspot_deal_id)) {
      setPayload({
        from: 'FLEX_SCRIPT',
        actionType: 'dial',
        deal_id: task?.attributes?.hubspot_deal_id
      })
    } else {
      setPayload({
        from: 'FLEX_SCRIPT',
        actionType: 'dial',
        contact_id: task?.attributes?.hubspot_contact_id
      })
    }
  }, [task])

  const startCall = useCallback(() => {
    // window.postMessage to self
    window.parent?.postMessage(payload, '*')
  }, [task, payload])

  return (
    //@ts-ignore
    <Button variant="primary" onClick={() => startCall()} size="icon_small" style={{paddingTop: '0.32rem', paddingBottom: '0.32rem', minWidth: 'auto', marginRight: '0.25rem'}}>
        <VoiceCapableIcon decorative={false}
          title={_l('Call contact')}
          size='sizeIcon10'
          />
      </Button>
  )
}