import React, { useEffect, useCallback } from 'react';
import useModalContext from '../../hooks/useModalContext';
import useLanguage from '../../hooks/useLanguage';
import useNavigation from '../../hooks/useNavigation';
import { AVAILABLE_LANGUAGES } from '../../constants';
import { RatingAppModalFooter, RatingAppModalContent } from './components';
import {
  ModalFalseContent,
  ModalFalseFooter
} from './components/RatingAppModalFalse';
import { Routes } from '../../services/navigationService/routes';

const RatingApp = () => {
  const { openModal, onClose } = useModalContext();
  const { language } = useLanguage();
  const { goTo } = useNavigation();

  const handleModalClickTrue = useCallback(() => {
    onClose();
    // eslint-disable-next-line
  }, []);

  const handleModalClickFalse = useCallback(() => {
    openModal(
      <ModalFalseContent />,
      'rating-app',
      null,
      <ModalFalseFooter
        type={language === AVAILABLE_LANGUAGES.pl ? 'link' : 'route'}
        path="https://www.gov.pl/web/protegosafe/pytania-i-odpowiedzi"
        handleClickTrue={() => {
          onClose();
          goTo(Routes.ReportBug);
        }}
        handleClickFalse={() => {
          onClose();
        }}
      />
    );
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    openModal(
      <RatingAppModalContent />,
      'rating-app',
      null,
      <RatingAppModalFooter
        handleClickTrue={handleModalClickTrue}
        handleClickFalse={handleModalClickFalse}
      />
    );
    // eslint-disable-next-line
  }, []);

  return null;
};

export default RatingApp;
