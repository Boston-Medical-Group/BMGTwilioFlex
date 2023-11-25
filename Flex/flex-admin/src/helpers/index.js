import {
  createDowntimeConfigMutex,
  releaseDowntimeConfigMutex,
  updateDowntimeConfig,
  hasCreatedDowntimeConfigMutex,
  loadRemoteConfig,
  loadRemoteConfigCountry,
  saveRemoteConfigCountry,
  loadRemoteConfigRegularHours,
  loadRemoteHolidays,
  saveRemoteHoliday,
  deleteRemoteHoliday,
  saveRegularHour,
  deleteRegularHour,

  loadPartialDays,
  savePartialDay,
  deletePartialDay
} from './downtimeConfigService'
import {hasAdminRights} from './authorizationService';
import { fetchTimezoneList } from './defaultConfigService';
import { loadQueues } from './defaultService';

import { loadWrapupCodes, saveWrapupCodes, loadQueueWrapupCodes, saveQueueWrapupCodes } from './wrapupCodesService';


export {
  createDowntimeConfigMutex, releaseDowntimeConfigMutex, updateDowntimeConfig, hasCreatedDowntimeConfigMutex, loadRemoteConfig,
  loadRemoteConfigCountry,
  saveRemoteConfigCountry,
  loadRemoteConfigRegularHours,
  saveRegularHour,
  deleteRegularHour,

  loadQueues,
  loadRemoteHolidays,
  saveRemoteHoliday,
  deleteRemoteHoliday,

  loadPartialDays,
  savePartialDay,
  deletePartialDay,
  
  loadWrapupCodes,
  saveWrapupCodes,
  loadQueueWrapupCodes,
  saveQueueWrapupCodes,

  hasAdminRights,
  fetchTimezoneList
}