import invoke from 'lodash.invoke';
import uniqueId from 'lodash.uniqueid';

import { always, cond, equals } from 'ramda';
import StoreRegistry from '../../store/storeRegistry';
import {
  FETCH_LAB_TEST_SUBSCRIPTION,
  FETCH_LANGUAGE,
  NATIVE_DATA_FETCH_EXPOSURE_NOTIFICATION_STATISTICS_SUCCESS,
  NATIVE_DATA_FETCH_NATIVE_STATE,
  NATIVE_DATA_SET_SERVICES_STATUS_SUCCESS
} from '../../store/types/nativeData';
import { DATA_TYPE } from './nativeBridge.constants';
import { UPLOAD_HISTORICAL_DATA_FINISHED } from '../../store/types/app';
import { isAndroidWebView, isIOSWebView } from '../../utils/native';
import { fetchExposureNotificationStatistics } from '../../store/actions/nativeData';
import { fetchDistrictsStatus } from '../../store/actions/restrictions';

const nativeRequests = {};

const sendNativeRequest = (functionName, dataType, data) => {
  const requestId = uniqueId('request-');
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `${Date.now()}: functionName: ${functionName}, dataType: ${dataType}, data: ${data}, requestId: ${requestId}`
    );
  }
  return new Promise((resolve, reject) => {
    nativeRequests[requestId] = { resolve, reject };
    if (isIOSWebView()) {
      invoke(window.webkit, `messageHandlers.${functionName}.postMessage`, {
        type: dataType,
        data,
        requestId
      });
    } else if (isAndroidWebView()) {
      invoke(window.NativeBridge, functionName, dataType, data, requestId);
    }
  });
};

const receiveNativeResponse = (body, dataType, requestId) => {
  try {
    nativeRequests[requestId].resolve(body);
  } catch (error) {
    console.error('requestId', requestId, error);
    nativeRequests[requestId].reject(error);
  }
  delete nativeRequests[requestId];
};

const callNativeFunction = async (functionName, dataType, data) => {
  const args = [dataType];
  if (data) {
    args.push(JSON.stringify(data));
  }

  if (isAndroidWebView() && functionName === 'setBridgeData') {
    return invoke(window.NativeBridge, functionName, ...args);
  }

  return sendNativeRequest(functionName, ...args);
};

const callGetBridgeData = async (dataType, data = undefined) => {
  try {
    const json = await callNativeFunction('getBridgeData', dataType, data);
    if (json) {
      return JSON.parse(json);
    }
  } catch (error) {
    console.error('Error while parsing native response', error);
  }
  return '';
};

const getNotification = async () => {
  return callGetBridgeData(DATA_TYPE.NOTIFICATION);
};

const getServicesStatus = async () => {
  return callGetBridgeData(DATA_TYPE.NATIVE_SERVICES_STATUS);
};

const getFontScale = async () => {
  return callGetBridgeData(DATA_TYPE.FONT_SCALE);
};

const getNativeVersion = async () => {
  return callGetBridgeData(DATA_TYPE.NATIVE_VERSION);
};

const getLanguage = async () => {
  return callGetBridgeData(DATA_TYPE.LANGUAGE);
};

const getDistrictsStatus = async () => {
  return callGetBridgeData(DATA_TYPE.DISTRICTS_STATUS);
};

const getForceDistrictsStatus = async () => {
  return callGetBridgeData(DATA_TYPE.FORCE_DISTRICTS_STATUS);
};

const getSubscribedDistricts = async () => {
  return callGetBridgeData(DATA_TYPE.SUBSCRIBED_DISTRICTS);
};

const getLabTestSubscription = async () => {
  return callGetBridgeData(DATA_TYPE.LAB_TEST_SUBSCRIPTION);
};

const getLabTestPin = async () => {
  return callGetBridgeData(DATA_TYPE.LAB_TEST_PIN);
};

const getExposureNotificationStatistics = async () => {
  return callGetBridgeData(DATA_TYPE.EXPOSURE_STATISTICS);
};

const setDiagnosisTimestamp = async timestamp => {
  await callNativeFunction('setBridgeData', DATA_TYPE.FILLED_DIAGNOSIS, {
    timestamp
  });
};

const setPin = async pin => {
  await callNativeFunction('setBridgeData', DATA_TYPE.HISTORICAL_DATA, {
    pin
  });
};

const setServicesState = async data => {
  await callNativeFunction(
    'setBridgeData',
    DATA_TYPE.NATIVE_SERVICES_STATE,
    data
  );
};

const turnOff = async () => {
  await callNativeFunction('setBridgeData', DATA_TYPE.TURN_OFF, {
    turnOff: true
  });
};

const uploadLabTestPin = async pin => {
  return callGetBridgeData(DATA_TYPE.UPLOAD_LAB_TEST_PIN, {
    pin
  });
};

const setDistrictSubscription = async (districtId, isSubscribed) => {
  const ADD = 1;
  const DELETE = 2;
  return callGetBridgeData(DATA_TYPE.DISTRICT_ACTION, {
    type: isSubscribed ? ADD : DELETE,
    districtId
  });
};

const handleServicesStatus = servicesStatus => {
  const store = StoreRegistry.getStore();
  store.dispatch({
    servicesStatus,
    type: NATIVE_DATA_SET_SERVICES_STATUS_SUCCESS
  });
};

const handleUploadHistoricalDataResponse = ({ result }) => {
  const store = StoreRegistry.getStore();
  store.dispatch({
    result,
    type: UPLOAD_HISTORICAL_DATA_FINISHED
  });
};

const handleExposureSummary = riskLevel => {
  const store = StoreRegistry.getStore();
  store.dispatch({
    riskLevel,
    type: NATIVE_DATA_FETCH_EXPOSURE_NOTIFICATION_STATISTICS_SUCCESS
  });
};

const handleNativeState = appState => {
  const store = StoreRegistry.getStore();
  const { dispatch } = store;
  dispatch({
    appState,
    type: NATIVE_DATA_FETCH_NATIVE_STATE
  });
  if (appState.appState === 1) {
    dispatch(fetchExposureNotificationStatistics());
    dispatch(fetchDistrictsStatus());
  }
};
const handleNativeLanguage = body => {
  const store = StoreRegistry.getStore();
  const { dispatch } = store;
  dispatch({
    body,
    type: FETCH_LANGUAGE
  });
};

const handleLabTestSubscription = body => {
  const store = StoreRegistry.getStore();
  const { dispatch } = store;
  dispatch({
    body,
    type: FETCH_LAB_TEST_SUBSCRIPTION
  });
};

const callBridgeDataHandler = cond([
  [equals(DATA_TYPE.NATIVE_SERVICES_STATUS), always(handleServicesStatus)],
  [
    equals(DATA_TYPE.HISTORICAL_DATA),
    always(handleUploadHistoricalDataResponse)
  ],
  [equals(DATA_TYPE.EXPOSURE_STATISTICS), always(handleExposureSummary)],
  [equals(DATA_TYPE.NATIVE_STATE), always(handleNativeState)],
  [equals(DATA_TYPE.LANGUAGE), always(handleNativeLanguage)],
  [equals(DATA_TYPE.LAB_TEST_SUBSCRIPTION), always(handleLabTestSubscription)]
]);

const onBridgeData = (dataType, dataString) => {
  try {
    const data = JSON.parse(dataString);
    callBridgeDataHandler(dataType)(data);
  } catch (error) {
    console.error('Error while parsing native request', error);
  }
};

const clearAllData = async data => {
  await callNativeFunction('setBridgeData', DATA_TYPE.CLEAR_ALL_DATA, data);
};

const changeLanguage = async data => {
  await callNativeFunction('setBridgeData', DATA_TYPE.LANGUAGE, data);
};

window.onBridgeData = onBridgeData;
window.bridgeDataResponse = receiveNativeResponse;

export default {
  clearAllData,
  changeLanguage,
  setDiagnosisTimestamp,
  getExposureNotificationStatistics,
  getDistrictsStatus,
  getFontScale,
  getForceDistrictsStatus,
  getLabTestPin,
  getLabTestSubscription,
  getLanguage,
  getNativeVersion,
  getNotification,
  getServicesStatus,
  getSubscribedDistricts,
  setPin,
  setDistrictSubscription,
  setServicesState,
  turnOff,
  uploadLabTestPin
};
