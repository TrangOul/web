import moment from 'moment';
import PropTypes from 'prop-types';

const dayWeekFormat = 'dddd';
const dateFormat = 'D-MM-YYYY';

const descending = (a, b) => {
  const { data } = a[1];
  const { data: _data } = b[1];
  const dateA = moment(data.time).unix();
  const dateB = moment(_data.time).unix();
  return dateA - dateB;
};

// filledDays contains moments
export const createDaysDetails = (
  filledDays = [],
  dateFormatIn = dateFormat
) => {
  return filledDays.sort(descending).map(_timestamp => {
    const { data } = _timestamp[1];

    return {
      day: moment(data.time).format(dateFormatIn),
      dayWeek: moment(data.time).format(dayWeekFormat),
      timestamp: _timestamp[0]
    };
  });
};

export const daysDetailsPropType = PropTypes.arrayOf(
  PropTypes.shape({
    day: PropTypes.string.isRequired,
    dayWeek: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired
  })
).isRequired;
