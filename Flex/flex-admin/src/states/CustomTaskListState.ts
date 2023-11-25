import { AnyAction } from 'redux'

const ACTION_DISMISS_BAR = 'DISMISS_BAR';

const initialState = {
  isOpen: true,
};

export class Actions {
  static dismissBar = () => ({ type: ACTION_DISMISS_BAR });
}

export function reduce(state = initialState, action: AnyAction) {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case ACTION_DISMISS_BAR: {
      return {
        ...state,
        isOpen: false,
      };
    }

    default:
      return state;
  }
}