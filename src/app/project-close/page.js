'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase-client'
import { FORM_SECTIONS, getInitialFormState } from '@/lib/formSections'
import Header from '@/components/Header'
import FormStepper from '@/components/FormStepper'
import FormField from '@/components/FormField'

export default function ProjectCloseForm() {
  const supabase = createClient()
  const [user, setUser] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(getInitialFormState())
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [autofillLoading, setAutofillLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  // Autofill from projects table when project_id changes
  const handleProjectIdBlur = useCallback(async () => {
    const projectId = formData.project_id?.trim()
    if (!projectId) return

    setAutofillLoading(true)
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('market, address, sales_person, designer')
        .eq('id', projectId)
        .single()

      if (data && !error) {
        setFormData((prev) => ({
          ...prev,
          market: data.market || prev.market,
          address: data.address || prev.address,
          sales_personnel: data.sales_person || prev.sales_personnel,
          designer: data.designer || prev.designer,
        }))
      }
    } catch (e) {
      // No match found — that's fine, user fills manually
    }
    setAutofillLoading(false)
  }, [formData.project_id, supabase])

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const currentSection = FORM_SECTIONS[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === FORM_SECTIONS.length - 1

  const goNext = () => {
    if (!isLastStep) {
      setCurrentStep((s) => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goPrev = () => {
    if (!isFirstStep) {
      setCurrentStep((s) => s - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)

    try {
      // Build the submission payload — flatten yes_no_other fields
      const payload = { ...formData }
      // Merge _other fields into their parents for storage
      FORM_SECTIONS.forEach((section) => {
        section.fields.forEach((field) => {
          if (field.type === 'yes_no_other' && payload[field.name] === 'Other') {
            payload[field.name] = `Other: ${payload[`${field.name}_other`] || ''}`
          }
          // Remove _other keys from payload
          delete payload[`${field.name}_other`]
        })
      })

      payload.submitted_by = user?.email || 'unknown'

      const { error: dbError } = await supabase
        .from('project_close_submissions')
        .insert([payload])

      if (dbError) throw dbError

      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e) {
      console.error('Submit error:', e)
      setError(e.message || 'Something went wrong. Please try again.')
    }
    setSubmitting(false)
  }

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen bg-vesta-cream">
        <Header />
        <div className="max-w-2xl mx-auto px-6 py-24 text-center animate-fade-up">
          <div className="w-20 h-20 bg-vesta-sage bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-vesta-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-serif text-4xl text-vesta-charcoal mb-4">Submission received</h1>
          <p className="text-vesta-muted text-lg mb-2">
            Thank you for completing the project close form.
          </p>
          <p className="text-vesta-muted mb-10">
            Project <strong className="text-vesta-charcoal">{formData.project_id}</strong> has been recorded.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setFormData(getInitialFormState())
                setCurrentStep(0)
                setSubmitted(false)
              }}
              className="px-6 py-3 bg-vesta-charcoal text-vesta-cream rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all"
            >
              Submit another
            </button>
            <a
              href="/"
              className="px-6 py-3 border border-vesta-border rounded-lg text-sm font-medium text-vesta-charcoal hover:border-vesta-bronze transition-all"
            >
              Back to home
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-vesta-cream">
      <Header />

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Page title */}
        <div className="mb-8 animate-fade-up">
          <h1 className="font-serif text-3xl text-vesta-charcoal mb-2">Project Close Form</h1>
          <p className="text-vesta-muted text-sm">
            Complete all sections to finalize your project debrief.
          </p>
        </div>

        {/* Stepper */}
        <FormStepper
          sections={FORM_SECTIONS}
          currentStep={currentStep}
          onStepClick={setCurrentStep}
        />

        {/* Current Section */}
        <div key={currentSection.id} className="section-enter">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-medium text-vesta-bronze tracking-widest uppercase">
                Section {currentSection.icon}
              </span>
              {autofillLoading && currentStep === 0 && (
                <span className="text-xs text-vesta-sage animate-pulse">Looking up project...</span>
              )}
            </div>
            <h2 className="font-serif text-2xl text-vesta-charcoal">{currentSection.title}</h2>
            <p className="text-sm text-vesta-muted mt-1">{currentSection.subtitle}</p>
          </div>

          <div className="space-y-6">
            {currentSection.fields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={formData[field.name]}
                otherValue={formData[`${field.name}_other`]}
                onChange={(name, value) => {
                  handleFieldChange(name, value)
                  // Trigger autofill on project_id change
                  if (name === 'project_id' && value.length > 3) {
                    // Debounce via setTimeout
                    setTimeout(() => handleProjectIdBlur(), 500)
                  }
                }}
                onOtherChange={handleFieldChange}
                formData={formData}
              />
            ))}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-8 border-t border-vesta-border">
          <button
            type="button"
            onClick={goPrev}
            disabled={isFirstStep}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isFirstStep
                ? 'text-vesta-border cursor-not-allowed'
                : 'text-vesta-charcoal hover:bg-vesta-warm'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <span className="text-xs text-vesta-muted">
            {currentStep + 1} of {FORM_SECTIONS.length}
          </span>

          {isLastStep ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-vesta-bronze text-white rounded-lg text-sm font-medium hover:bg-vesta-bronze-light transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="flex items-center gap-2 px-5 py-2.5 bg-vesta-charcoal text-vesta-cream rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
