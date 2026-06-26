import { useState } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { useShop } from '../context/useShop';

const questions = [
  {
    id: 'activity',
    question: 'What type of training do you do most?',
    options: [
      { value: 'gym', label: 'Gym / Weights', emoji: '🏋️' },
      { value: 'cardio', label: 'Cardio / Running', emoji: '🏃' },
      { value: 'yoga', label: 'Yoga / Pilates', emoji: '🧘' },
      { value: 'crossfit', label: 'CrossFit / HIIT', emoji: '💪' },
    ],
  },
  {
    id: 'fit',
    question: 'How do you prefer your fit?',
    options: [
      { value: 'tight', label: 'Tight / Compression', emoji: '🔥' },
      { value: 'regular', label: 'Regular Fit', emoji: '✅' },
      { value: 'loose', label: 'Loose / Relaxed', emoji: '👕' },
    ],
  },
  {
    id: 'material',
    question: 'What material do you prefer?',
    options: [
      { value: 'cotton', label: 'Cotton', emoji: '🌿' },
      { value: 'polyester', label: 'Polyester', emoji: '🧵' },
      { value: 'blend', label: 'Cotton-Poly Blend', emoji: '🔄' },
    ],
  },
];

const recommendations = {
  gym_tight_cotton: { text: 'Our compression cotton tee is perfect for you!', category: 'mens' },
  gym_tight_polyester: { text: 'Try our pro compression top for maximum performance.', category: 'mens' },
  cardio_regular_polyester: { text: 'Our lightweight running singlet is ideal.', category: 'mens' },
  yoga_loose_cotton: { text: 'Our relaxed yoga tee will keep you comfortable.', category: 'mens' },
};

export default function FitFinderModal({ onClose }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentQuestion = questions[step];
  const isLastQuestion = step === questions.length - 1;

  const selectAnswer = (value) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (isLastQuestion) return;
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step === 0) return;
    setStep((s) => s - 1);
  };

  const currentAnswer = answers[currentQuestion?.id];
  const canProceed = !!currentAnswer;

  const key = Object.keys(answers).map((k) => answers[k]).join('_');
  const result = recommendations[key] || null;

  const handleReset = () => {
    setStep(0);
    setAnswers({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#1a1a1a] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-heading font-[850] text-white">Find My Fit</h3>
          <button onClick={onClose} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!result ? (
          <>
            <div className="flex justify-center gap-1.5 mb-6">
              {questions.map((q, i) => (
                <div key={q.id} className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'w-8 bg-brand-pink' : 'w-4 bg-white/20'}`} />
              ))}
            </div>

            <h4 className="text-lg font-bold text-white mb-4">{currentQuestion.question}</h4>

            <div className="space-y-2 mb-6">
              {currentQuestion.options.map((option) => {
                const isSelected = currentAnswer === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => selectAnswer(option.value)}
                    className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 ${
                      isSelected
                        ? 'border-brand-pink bg-brand-pink/5 text-white'
                        : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">{option.emoji}</span>
                    <span className="font-bold text-sm">{option.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center">
              <button onClick={handleBack} disabled={step === 0} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className="flex items-center gap-1 px-6 py-2.5 rounded-xl bg-brand-pink text-black text-sm font-bold uppercase tracking-widest hover:bg-brand-green-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isLastQuestion ? 'See Results' : 'Next'} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="text-4xl mb-4">🎯</div>
            <h4 className="text-lg font-bold text-white mb-2">We found your match!</h4>
            <p className="text-gray-400 mb-6">{result.text}</p>
            <button onClick={handleReset} className="text-sm text-brand-pink hover:underline">Retake quiz</button>
          </div>
        )}
      </div>
    </div>
  );
}
