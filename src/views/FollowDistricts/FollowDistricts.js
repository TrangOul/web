import React from 'react';
import PropTypes from 'prop-types';
import { StatusItem, T } from '../../components';
import * as Styled from './FollowDistricts.styled';

const FollowDistricts = ({ dateUpdate, handleUnsubscribeDistrict, items }) => {
  if (!items) {
    return null;
  }
  const renderItems = items.map(({ id, name, state }) => (
    <StatusItem key={id} name={name} status={state} handleClick={() => handleUnsubscribeDistrict(id)} />
  ));

  return (
    <Styled.FollowDistricts>
      <Styled.DateUpdate>
        <T i18nKey="follow_district_date_update" /> {dateUpdate}
      </Styled.DateUpdate>

      {items.length === 0 ? (
        <Styled.Description>
          <T i18nKey="follow_district_description" /> <Styled.Star />
        </Styled.Description>
      ) : (
        <Styled.Content>
          <Styled.Title>
            <T i18nKey="follow_district_title" /> ({items.length}):
          </Styled.Title>
          {renderItems}
        </Styled.Content>
      )}
    </Styled.FollowDistricts>
  );
};

FollowDistricts.propTypes = {
  dateUpdate: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired
};

export default FollowDistricts;
