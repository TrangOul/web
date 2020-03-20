import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Summary from './Summary';
import { clearDiagnosis } from '../../../../store/actions/diagnosis';
import { addQuestionnaire } from '../../../../store/actions/questionnaires';

const SummaryContainer = () => {
  const history = useHistory();
  const { allQuestions, evidence } = useSelector(state => state.diagnosis);
  const { triageLevel, label, description } = useSelector(
    state => state.triage
  );
  const dispatch = useDispatch();
  const save = () => {
    const data = {
      allQuestions,
      evidence,
      triageLevel,
      label,
      description
    };
    dispatch(addQuestionnaire(data));
    history.push('/');
  };

  const tryAgain = () => dispatch(clearDiagnosis());

  return <Summary onSave={save} onTryAgain={tryAgain} />;
};

export default SummaryContainer;
