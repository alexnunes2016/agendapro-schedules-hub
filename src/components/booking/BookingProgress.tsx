
interface BookingProgressProps {
  currentStep: number;
  totalSteps: number;
}

const BookingProgress = ({ currentStep, totalSteps }: BookingProgressProps) => {
  const steps = [
    { number: 1, label: "Serviço" },
    { number: 2, label: "Data/Hora" },
    { number: 3, label: "Dados" },
    { number: 4, label: "Confirmação" }
  ];

  return (
    <div className="mb-6 sm:mb-8">
      {/* Mobile Progress - Simplified */}
      <div className="flex justify-between items-center mb-4 sm:hidden">
        <span className="text-sm font-medium text-gray-600">
          Passo {currentStep} de {totalSteps}
        </span>
        <span className="text-sm text-blue-600">
          {steps[currentStep - 1]?.label}
        </span>
      </div>

      {/* Desktop Progress - Full */}
      <div className="hidden sm:flex justify-between items-center mb-4">
        {steps.map((step) => (
          <span 
            key={step.number}
            className={`flex items-center ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-2 ${
              currentStep >= step.number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step.number}
            </span>
            {step.label}
          </span>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default BookingProgress;
