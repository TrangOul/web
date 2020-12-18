import React from 'react';
import { OnboardingContent, Button, Layout, T } from '../../../../../../components';
import { Icon } from './Information.styled';

const Information = ({ onNext, onSkip }) => {
  const buttons = [
    {
      label: <T i18nKey="button_next" />,
      onClick: onNext
    },
    {
      label: <T i18nKey="notification_onboarding_information_text2" />,
      type: 'blankSmall',
      onClick: onSkip
    }
  ];

  const renderButton = buttons.map(button => (
    <Button key={button.label} onClick={button.onClick} label={button.label} type={button.type} />
  ));

  return (
    <Layout hideBackButton isGovFooter>
      <OnboardingContent
        icon={<Icon />}
        title={<T i18nKey="notification_onboarding_information_text3" />}
        buttons={renderButton}
      >
        <>
          <p>
            <T i18nKey="notification_onboarding_information_text1" />
          </p>
        </>
      </OnboardingContent>
    </Layout>
  );
};

export default Information;
