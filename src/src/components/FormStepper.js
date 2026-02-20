'use client'

export default function FormStepper({ sections, currentStep, onStepClick }) {
  const progress = ((currentStep + 1) / sections.length) * 100

  return (
    <div className="mb-10">
      {/* Progress bar */}
      <div className="h-1 bg-vesta-border rounded-full mb-8 overflow-hidden">
        <div
          className="progress-fill h-full bg-vesta-bronze rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex gap-2 flex-wrap">
        {sections.map((section, index) => (
          <button
            key={section.id}
            type="button"
            onClick={() => onStepClick(index)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              index === currentStep
                ? 'bg-vesta-charcoal text-vesta-cream'
                : index < currentStep
                ? 'bg-vesta-sage bg-opacity-20 text-vesta-sage cursor-pointer hover:bg-opacity-30'
                : 'bg-vesta-warm text-vesta-muted cursor-pointer hover:bg-vesta-border'
            }`}
          >
            {index < currentStep ? (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span>{section.icon}</span>
            )}
            <span className="hidden sm:inline">{section.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
