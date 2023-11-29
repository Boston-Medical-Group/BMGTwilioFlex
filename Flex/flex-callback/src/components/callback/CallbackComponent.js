import React from 'react';
import * as Flex from '@twilio/flex-ui';
import moment from 'moment';
import 'moment-timezone';
import { Button } from '@twilio-paste/core/button';
import { Tooltip } from '@twilio-paste/core/tooltip';
import { InformationIcon } from '@twilio-paste/icons/esm/InformationIcon';

import styles from './CallbackStyles';
import { inqueueUtils } from '../common';

export default class CallbackComponent extends React.Component {
  static displayName = 'CallbackComponent';

  constructor(props) {
    super(props);

    this.state = {};
  }

  cbCallButtonAccessibility = async (state) => inqueueUtils.callButtonAccessibility(this.props.task, 'callback', state);

  startCall = async () => {
    const manager = Flex.Manager.getInstance();
    const activityName = manager.workerClient.activity.name;
    if (activityName === 'Offline') {
      // eslint-disable-next-line no-alert
      alert('Change activity state from "Offline" to place call to contact');
      return;
    }
    await this.cbCallButtonAccessibility(true);

    const { queueSid, attributes } = this.props.task;
    const { to, from } = attributes;
    const attr = {
      type: 'outbound',
      name: `Contact: ${to}`,
      phone: to,
    };
    await Flex.Actions.invokeAction('StartOutboundCall', {
      destination: to,
      queueSid,
      callerId: from,
      taskAttributes: attr,
    });
  };

  startTransfer = async () => {
    await this.cbCallButtonAccessibility(false);

    return inqueueUtils.startTransfer(this.props.task);
  };

  render() {
    const { attributes } = this.props.task;
    const timeReceived = moment(attributes.callTime.time_recvd);
    const localTz = moment.tz.guess();
    const localTimeShort = timeReceived.tz(localTz).format('MM-D-YYYY, h:mm:ss a z');

    // capture taskRetry count - disable button conditionally
    const count = attributes.placeCallRetry;

    return (
      <span className="Twilio">
        <h1>Contact CallBack Request</h1>
        <p>A contact has requested an immediate callback.</p>
        <h4 style={styles.itemBold}>Callback Details</h4>
        <ul>
          <li>
            <div style={styles.itemWrapper}>
              <span style={styles.item}>Contact Phone:</span>
              <span style={styles.itemDetail}>{attributes.to}</span>
            </div>
          </li>
          <li>&nbsp;</li>
          <li>
            <div style={styles.itemWrapper}>
              <span style={styles.itemBold}>Call Reception Information</span>
            </div>
          </li>
          <li>
            <div style={styles.itemWrapper}>
              <label style={styles.item}>
                Received: &nbsp;
                <Tooltip text="System call reception time" placement="right">
                    <InformationIcon decorative={false} title="Open Tooltip" display="block" />
                </Tooltip>
              </label>

              <label style={styles.itemDetail}>{attributes.callTime.server_time_short}</label>
            </div>
          </li>
          <li>
            <div style={styles.itemWrapper}>
              <div style={styles.itemWrapper}>
                <div>
                  <label style={styles.item}>Localized:&nbsp;</label>
                  <Tooltip text="Call time localized to agent" placement="right">
                    <InformationIcon decorative={false} title="Open Tooltip" display="block" />
                  </Tooltip>
                  <label style={styles.itemDetail}>{localTimeShort}</label>
                </div>
              </div>
            </div>
          </li>
          <li>&nbsp;</li>
        </ul>
        <Button
          style={styles.cbButton}
          variant="primary"
          onClick={async () => this.startCall()}
          disabled={attributes.ui_plugin.cbCallButtonAccessibility}
        >
          Place Call Now ( {attributes.to} )
        </Button>
        <p style={styles.textCenter}>Not answering? Requeue to try later.</p>
        <Button
          style={styles.cbButton}
          variant="secondary"
          onClick={async () => this.startTransfer()}
          disabled={count >= 3}
        >
          Requeue Callback ( {attributes.placeCallRetry} of 3 )
        </Button>
        <p>&nbsp;</p>
      </span>
    );
  }
}
