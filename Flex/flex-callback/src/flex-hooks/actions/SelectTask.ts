import * as Flex from '@twilio/flex-ui';
import { AppState, reduxNamespace } from '../states';
import { ErrorManager, FlexErrorSeverity, FlexPluginErrorType } from '../../utils/ErrorManager';

export interface EventPayload {
  task?: Flex.ITask;
  sid?: string;
}

// when an outbound call back completes, select the parent task that initiated it
export const autoSelectCallbackTaskWhenEndingCall = async (flex: typeof Flex, manager: Flex.Manager) => {
  try {
    flex.Actions.addListener('beforeSelectTask', (payload: EventPayload, abortFunction: () => void) => {
      // when a reservation is removed from state, Flex runs SelectTask with task set to null
      // this means that when an outbound call back to a contact is completed (or canceled)
      // we need to catch that here in order to select the callback task

      // we only care if a null task is being selected
      if (payload.task || payload.sid) return;

      const state = manager.store.getState() as AppState;

      // we only care if a task was selected before this event occurred
      if (!state.flex.view.selectedTaskSid) return;

      // we need the previous reservation in state in order to select it
      const parentTask = state[reduxNamespace].lastPlacedReservationSid;
      if (!parentTask) return;

      // make sure the parent task is still here
      if (!state.flex.worker.tasks.get(parentTask)) return;

      // cancel this action and select the parent task instead
      abortFunction();

      (async () => {
        await flex.Actions.invokeAction('SelectTask', {
          sid: parentTask,
        });
      })();
    });
  } catch (e) {
    ErrorManager.createAndProcessError("Could not add 'beforeSelectTask' listener", {
      type: FlexPluginErrorType.action,
      description: e instanceof Error ? `${e.message}` : "Could not add 'beforeSelectTask' listener",
      context: 'Plugin.Action.beforeSelectTask',
      wrappedError: e,
    });
  }
};
