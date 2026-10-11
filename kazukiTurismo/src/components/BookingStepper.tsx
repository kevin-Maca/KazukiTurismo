import React from 'react';
import { Check } from 'lucide-react';
import '../styles/public.css';

interface BookingStepperProps {
  currentStep: number;
}

export const BookingStepper: React.FC<BookingStepperProps> = ({ currentStep }) => {
  const steps: string[] = ['Fecha', 'Tus datos', 'Pago', 'Confirmación'];

  return (
    <div className="stepper-bar">
      {steps.map((label, idx) => {
        const stepNum = idx + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={label} className={`stepper-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
            <div className="stepper-circle">
              {isCompleted ? <Check size={14} /> : stepNum}
            </div>
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
};