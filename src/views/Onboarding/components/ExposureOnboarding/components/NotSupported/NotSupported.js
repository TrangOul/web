import React from 'react';
import './NotSupported.scss';
import { OnboardingContent, Button, Layout, T } from '../../../../../../components';
import { isIOSWebView } from '../../../../../../utils/native';
import { Icon } from './NotSupported.styled';

const NotSupported = ({ onNext }) => {
  const buttons = [
    {
      label: <T i18nKey="onboarding_not_supported_text3" />,
      onClick: onNext
    }
  ];

  const renderButton = buttons.map(({ onClick, label }) => <Button key={label} onClick={onClick} label={label} />);

  return (
    <Layout hideBackButton isGovFooter>
      <OnboardingContent icon={<Icon />} title={<T i18nKey="onboarding_not_supported_text4" />} buttons={renderButton}>
        {!isIOSWebView() ? (
          <p>
            <T i18nKey="onboarding_not_supported_text1" />
          </p>
        ) : (
          <p>
            <T i18nKey="onboarding_not_supported_text2" />
          </p>
        )}
      </OnboardingContent>
    </Layout>
  );
};

export default NotSupported;
