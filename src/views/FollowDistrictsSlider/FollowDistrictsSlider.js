import React from 'react';
import PropTypes from 'prop-types';
import * as Styled from './FollowDistrictsSlider.styled';
import { StatusItem } from '../../components/StatusItem';
import { NavLink, T } from '../../components';
import { Routes } from '../../services/navigationService/routes';

const FollowDistrictsSlider = ({ items }) => {
  const renderItems = items.map(({ id, name, state }) => (
    <StatusItem id={id} key={id} name={name} status={state} />
  ));

  return (
    <Styled.FollowDistrictsSlider padding={items.length === 0}>
      {items.length > 0 ? (
        <>
          <NavLink to={Routes.CurrentRestrictions}>
            <Styled.Title>
              <T i18nKey="follow_district_title"/>:{' '}
              <Styled.Badge>{items.length}</Styled.Badge>
            </Styled.Title>
          </NavLink>
          <Styled.Slider>{renderItems}</Styled.Slider>
        </>
      ) : (
        <NavLink to={Routes.CurrentRestrictions}>
          <Styled.Button>
            <T i18nKey="follow_district_button_name"/>
            <Styled.Icon />
          </Styled.Button>
        </NavLink>
      )}
    </Styled.FollowDistrictsSlider>
  );
};

FollowDistrictsSlider.defaultProps = {
  items: []
};

FollowDistrictsSlider.propTypes = {
  items: PropTypes.array
};

export default FollowDistrictsSlider;
