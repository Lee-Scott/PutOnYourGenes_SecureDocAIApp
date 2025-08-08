import React, { useState } from 'react';
import { useCreateQuestionnaireMutation } from '../../service/QuestionnaireService';
import type { IQuestionnaireRequest, IQuestionPageRequest } from '../../models/IQuestionnaire';
import type { IQuestionRequest, QuestionType } from '../../models/IQuestion';
import './QuestionnaireBuilder.css';

const QUESTION_TYPES: QuestionType[] = [
  'TEXT', 'NUMBER', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'YES_NO', 'DATE', 'SCALE'
];

const defaultQuestion = (): IQuestionRequest => ({
  questionNumber: 1,
  questionText: '',
  questionType: 'TEXT',
  isRequired: false,
  helpText: '',
  validationRules: {},
  options: []
});

const defaultPage = (): IQuestionPageRequest => ({
  pageNumber: 1,
  title: '',
  description: '',
  questions: [defaultQuestion()],
  isRequired: true
});

const QuestionnaireBuilder: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('HEALTHCARE');
  const [estimatedTimeMinutes, setEstimatedTimeMinutes] = useState(20);
  const [pages, setPages] = useState<IQuestionPageRequest[]>([defaultPage()]);
  const [isActive, setIsActive] = useState(true);
  const [message, setMessage] = useState('');
  const [createQuestionnaire, { isLoading }] = useCreateQuestionnaireMutation();

  const handlePageChange = (idx: number, field: keyof IQuestionPageRequest, value: any) => {
    const newPages = [...pages];
    (newPages[idx] as any)[field] = value;
    setPages(newPages);
  };

  const handleQuestionChange = (pageIdx: number, qIdx: number, field: keyof IQuestionRequest, value: any) => {
    const newPages = [...pages];
    (newPages[pageIdx].questions[qIdx] as any)[field] = value;
    setPages(newPages);
  };

  const addPage = () => {
    setPages([...pages, { ...defaultPage(), pageNumber: pages.length + 1 }]);
  };

  const removePage = (idx: number) => {
    if (pages.length === 1) return;
    setPages(pages.filter((_, i) => i !== idx));
  };

  const addQuestion = (pageIdx: number) => {
    const newPages = [...pages];
    newPages[pageIdx].questions.push({ ...defaultQuestion(), questionNumber: newPages[pageIdx].questions.length + 1 });
    setPages(newPages);
  };

  const removeQuestion = (pageIdx: number, qIdx: number) => {
    const newPages = [...pages];
    if (newPages[pageIdx].questions.length === 1) return;
    newPages[pageIdx].questions = newPages[pageIdx].questions.filter((_, i) => i !== qIdx);
    setPages(newPages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const payload: IQuestionnaireRequest = {
      title,
      description,
      category,
      isActive,
      estimatedTimeMinutes,
      pages
    };
    try {
      await createQuestionnaire(payload).unwrap();
      setMessage('Questionnaire created successfully!');
    } catch (err) {
      setMessage('Failed to create questionnaire.');
    }
  };

  return (
    <div className="questionnaire-builder-container">
      <h2>Create New Questionnaire</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required style={{ background: '#fff', color: '#222' }} />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} required style={{ background: '#fff', color: '#222' }} />
        </div>
        <div>
          <label>Category:</label>
          <select value={category} onChange={e => setCategory(e.target.value)} required style={{ background: '#fff', color: '#222' }}>
            <option value="HEALTHCARE">Healthcare</option>
            <option value="EDUCATION">Education</option>
            <option value="BUSINESS">Business</option>
            <option value="PERSONAL">Personal</option>
            <option value="RESEARCH">Research</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div>
          <label>Estimated Time (minutes):</label>
          <input type="number" value={estimatedTimeMinutes} onChange={e => setEstimatedTimeMinutes(Number(e.target.value))} min={1} required style={{ background: '#fff', color: '#222' }} />
        </div>
        <div>
          <label>Active:</label>
          <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
        </div>
        <hr />
        {pages.map((page, pageIdx) => (
          <div key={pageIdx} className="page-section">
            <div className="page-content">
              <h3>Page {pageIdx + 1}</h3>
              <button type="button" onClick={() => removePage(pageIdx)} disabled={pages.length === 1}>Remove Page</button>
              <div>
                <label>Page Title:</label>
                <input value={page.title} onChange={e => handlePageChange(pageIdx, 'title', e.target.value)} required style={{ background: '#fff', color: '#222' }} />
              </div>
              <div>
                <label>Page Description:</label>
                <input value={page.description} onChange={e => handlePageChange(pageIdx, 'description', e.target.value)} required style={{ background: '#fff', color: '#222' }} />
              </div>
              <div>
                <label>Questions:</label>
                {page.questions.map((q, qIdx) => (
                  <div key={qIdx} className="question-section">
                    <h4>Question {qIdx + 1}</h4>
                    <button type="button" onClick={() => removeQuestion(pageIdx, qIdx)} disabled={page.questions.length === 1}>Remove Question</button>
                    <div>
                      <label>Text:</label>
                      <input value={q.questionText} onChange={e => handleQuestionChange(pageIdx, qIdx, 'questionText', e.target.value)} required style={{ background: '#fff', color: '#222' }} />
                    </div>
                    <div>
                      <label>Type:</label>
                      <select value={q.questionType} onChange={e => handleQuestionChange(pageIdx, qIdx, 'questionType', e.target.value as QuestionType)} style={{ background: '#fff', color: '#222' }}>
                        {QUESTION_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                    </div>
                    <div>
                      <label>Required:</label>
                      <input type="checkbox" checked={q.isRequired} onChange={e => handleQuestionChange(pageIdx, qIdx, 'isRequired', e.target.checked)} />
                    </div>
                    <div>
                      <label>Help Text:</label>
                      <input value={q.helpText} onChange={e => handleQuestionChange(pageIdx, qIdx, 'helpText', e.target.value)} style={{ background: '#fff', color: '#222' }} />
                    </div>
                    {/* Options for SINGLE_CHOICE and MULTIPLE_CHOICE */}
                    {(q.questionType === 'SINGLE_CHOICE' || q.questionType === 'MULTIPLE_CHOICE') && (
                      <div className="options-section">
                        <label>Options:</label>
                        {q.options && q.options.length > 0 ? (
                          q.options.map((opt, optIdx) => (
                            <div key={optIdx} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                              <input
                                type="text"
                                value={opt.optionText}
                                onChange={e => {
                                  const newPages = [...pages];
                                  if (!newPages[pageIdx].questions[qIdx].options) newPages[pageIdx].questions[qIdx].options = [];
                                  newPages[pageIdx].questions[qIdx].options[optIdx].optionText = e.target.value;
                                  // Option value can be auto-generated from text or left as is
                                  newPages[pageIdx].questions[qIdx].options[optIdx].optionValue = e.target.value;
                                  setPages(newPages);
                                }}
                                placeholder={`Option ${optIdx + 1}`}
                                style={{ marginRight: 8, background: '#fff', color: '#222' }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newPages = [...pages];
                                  if (newPages[pageIdx].questions[qIdx].options) {
                                    newPages[pageIdx].questions[qIdx].options.splice(optIdx, 1);
                                    // Reorder orderIndex after delete
                                    newPages[pageIdx].questions[qIdx].options.forEach((o, i) => o.orderIndex = i + 1);
                                    setPages(newPages);
                                  }
                                }}
                                disabled={q.options && q.options.length === 1}
                                style={{ marginLeft: 4 }}
                              >
                                Delete
                              </button>
                            </div>
                          ))
                        ) : (
                          <div style={{ marginBottom: 4 }}>No options yet.</div>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const newPages = [...pages];
                            if (!newPages[pageIdx].questions[qIdx].options) newPages[pageIdx].questions[qIdx].options = [];
                            const nextIndex = newPages[pageIdx].questions[qIdx].options.length + 1;
                            newPages[pageIdx].questions[qIdx].options.push({ optionText: '', optionValue: '', orderIndex: nextIndex });
                            setPages(newPages);
                          }}
                          style={{ marginTop: 4 }}
                        >
                          Add Option
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addQuestion(pageIdx)}>Add Question</button>
              </div>
            </div>
          </div>
        ))}
        <div>
          <button type="button" onClick={addPage}>Add Page</button>
        </div>
        <hr />
        <div>
          <button type="submit" disabled={isLoading}>{isLoading ? 'Submitting...' : 'Create Questionnaire'}</button>
        </div>
        {message && <div className="message">{message}</div>}
      </form>
    </div>
  );
}

export default QuestionnaireBuilder;