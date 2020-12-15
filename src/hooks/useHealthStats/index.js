import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getNativeRiskLevel } from '../../store/selectors/nativeData';
import { getTriageLevel } from '../../store/selectors/triage';

const torLevels = {
  low: 'low',
  middle: 'middle',
  high: 'high',
  highCovid: 'highCovid'
};

const useHealthStats = () => {
  const nativeRiskLevel = useSelector(getNativeRiskLevel);
  const triageLevel = useSelector(getTriageLevel);

  const torLevel = useMemo(() => {
    switch (triageLevel) {
      case 'no_risk':
      case 'self_monitoring': {
        return torLevels.low;
      }
      case 'quarantine': {
        return torLevels.middle;
      }
      case 'isolation_call':
      case 'isolation_ambulance': {
        return torLevels.high;
      }
      case 'call_doctor': {
        return torLevels.highCovid;
      }
      default:
        return undefined;
    }
  }, [triageLevel]);

  return {
    noEn: nativeRiskLevel === undefined,
    isEnLow: nativeRiskLevel === 1,
    isEnMiddle: nativeRiskLevel === 2,
    isEnHigh: nativeRiskLevel === 3,
    noTor: torLevel === undefined,
    isTorLow: torLevel === torLevels.low,
    isTorMiddle: torLevel === torLevels.middle,
    isTorHigh: torLevel === torLevels.high,
    isTorHighWithCovid: torLevel === torLevels.highCovid
  };
};

export default useHealthStats;
