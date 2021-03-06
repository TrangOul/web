import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../../store/actions/app';
import { languages } from '../../utils/languages';
import useDefaultLanguage from '../useDefaultLanguage';
import { DEFAULT_LANGUAGE } from '../../constants';

const useLanguage = () => {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();

  const { defaultLanguage } = useDefaultLanguage();

  const changeAppLanguage = useCallback(
    language => {
      i18n
        .changeLanguage(language)
        .then(value => dispatch(changeLanguage(language)));
    },
    [dispatch, i18n]
  );

  return {
    languages,
    changeAppLanguage,
    language: defaultLanguage,
    isDefaultLanguage: defaultLanguage === DEFAULT_LANGUAGE
  };
};

export default useLanguage;
