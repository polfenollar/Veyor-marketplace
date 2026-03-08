import React from 'react';

interface StepperProps {
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  const steps = [
    { label: 'Search', step: 1 },
    { label: 'Recommended Services', step: 2 },
    { label: 'Results', step: 3 },
    { label: 'Booking', step: 4 },
    { label: 'Verification', step: 5 },
  ];

  return (
    <div className="w-full flex justify-center py-6 bg-white border-b border-gray-100">
      <div className="flex items-center w-full max-w-4xl px-4 relative">
        {/* Background Line */}
        <div className="absolute left-0 top-[15px] w-full h-0.5 bg-gray-200 -z-10 hidden md:block"></div>

        <div className="flex justify-between w-full">
            {steps.map((s, index) => {
              const isActive = s.step <= currentStep;
              const isCurrent = s.step === currentStep;
              
              return (
                <div key={s.step} className="flex flex-col items-center bg-white px-2">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 border-2 
                    ${isActive ? 'bg-sky-200 border-sky-200 text-sky-700' : 'bg-gray-100 border-gray-200 text-gray-400'}
                    ${isCurrent ? 'ring-2 ring-offset-2 ring-sky-300' : ''}`}
                  >
                    {s.step}
                  </div>
                  <span className={`text-xs ${isActive ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
