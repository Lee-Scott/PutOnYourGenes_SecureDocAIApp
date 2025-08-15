import React from 'react';
import { Link } from 'react-router-dom';
import { useGetUserResponsesQuery } from '../../../service/QuestionnaireService';
import Loader from '../../profile/Loader';

const QuestionnaireWidget: React.FC = () => {
  const { data: responses, isLoading } = useGetUserResponsesQuery();

  if (isLoading) {
    return <Loader />;
  }

  const latestResponse = responses?.data?.[0];

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Questionnaire</h5>
        {latestResponse ? (
          <>
            <p className="card-text">
              Your latest score: {latestResponse.totalScore}
            </p>
            <Link to={`/questionnaire-results/${latestResponse.id}`} className="btn btn-primary">
              View Results
            </Link>
          </>
        ) : (
          <p className="card-text">You have not completed any questionnaires yet.</p>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireWidget;