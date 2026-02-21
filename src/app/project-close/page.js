'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient, vestaSchema, designerHubSchema } from '@/lib/supabase-client'
import { FORM_SECTIONS, CONFIRM_FIELDS, getInitialFormState } from '@/lib/formSections'
import Header from '@/components/Header'
import FormStepper from '@/components/FormStepper'
import FormField from '@/components/FormField'

export default function ProjectCloseForm() {
  const supabase = createClient()
  const [user, setUser] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(getInitialFormState())
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [autofillLoading, setAutofillLoading] = useState(false)
  const [autofillFound, setAutofillFound] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
  }, [])

  // Autofill from projects table when project_id changes
  const handleProjectLookup = useCallback(async () => {
    const projectId = formData.project_id?.trim()
    if (!projectId) return

    setAutofillLoading(true)
    setAutofillFound(false)
    try {
      const { data, error } = await vestaSchema(supabase)
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
        setAutofillFound(true)
      }
    } catch (e) {
      // No match found — user fills manually
    }
    setAutofillLoading(false)
  }, [formData.project_id, supabase])

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === 'project_id') {
      setAutofillFound(false)
    }
  }

  const canConfirm = formData.project_id?.trim() && formData.market && formData.address?.trim()

  const handleConfirm = () => {
    if (canConfirm) {
      setConfirmed(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
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
    if (isFirstStep) {
      // Go back to confirm step
      setConfirmed(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setCurrentStep((s) => s - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)

    try {
      const payload = { ...formData }
      FORM_SECTIONS.forEach((section) => {
        section.fields.forEach((field) => {
          if (field.type === 'yes_no_other' && payload[field.name] === 'Other') {
            payload[field.name] = `Other: ${payload[`${field.name}_other`] || ''}`
          }
          delete payload[`${field.name}_other`]
        })
      })

      payload.submitted_by = user?.email || 'unknown'

      const { error: dbError } = await designerHubSchema(supabase)
        .from('project_close_submissions')
        .insert([payload])

      if (dbError) throw dbError

      // Send confirmation email (fire and forget)
      try {
        await fetch('/api/send-receipt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            submitterEmail: user?.email,
            projectId: formData.project_id,
            market: formData.market,
            address: formData.address,
            submittedAt: new Date().toISOString(),
          }),
        })
      } catch (emailErr) {
        console.warn('Receipt email failed (non-blocking):', emailErr)
      }

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
          <p className="text-vesta-muted mb-2">
            Project <strong className="text-vesta-charcoal">{formData.project_id}</strong> has been recorded.
          </p>
          <p className="text-vesta-muted text-sm mb-10">
            A confirmation email has been sent to {user?.email}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setFormData(getInitialFormState())
                setCurrentStep(0)
                setConfirmed(false)
                setSubmitted(false)
                setAutofillFound(false)
              }}
              className="px-6 py-3 bg-vesta-charcoal text-vesta-cream rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all"
            >
              Submit another
            </button>
            <a
              href="/"
              className="px-6 py-3 border border-vesta-border rounded-lg text-sm font-medium text-vesta-charcoal hover:border-vesta-bronze transition-all"
            >
              Back to hub
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Confirm project step
  if (!confirmed) {
    return (
      <div className="min-h-screen bg-vesta-cream">
        <Header />
        <div className="max-w-2xl mx-auto px-6 py-10">
          <div className="mb-8 animate-fade-up">
            <a
              href="/"
              className="flex items-center gap-2 text-sm text-vesta-muted hover:text-vesta-charcoal transition-colors mb-6"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to hub
            </a>
            <h1 className="font-serif text-3xl text-vesta-charcoal mb-2">Project Close Form</h1>
            <p className="text-vesta-muted text-sm">
              First, confirm the project you&apos;re closing out.
            </p>
          </div>

          <div className="section-enter">
            <div className="bg-white border border-vesta-border rounded-lg p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-vesta-bronze bg-opacity-10 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-vesta-bronze" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="font-serif text-xl text-vesta-charcoal">Identify Your Project</h2>
              </div>

              <div className="space-y-6">
                {/* Project ID with lookup button */}
                <div>
                  <label className="block text-sm font-medium text-vesta-charcoal mb-2">
                    What is the project ID?
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={formData.project_id || ''}
                      onChange={(e) => handleFieldChange('project_id', e.target.value)}
                      placeholder="e.g. VH-2025-001"
                      className="flex-1 px-4 py-3 bg-white border border-vesta-border rounded-lg text-vesta-charcoal text-sm placeholder:text-vesta-muted focus:outline-none focus:border-vesta-bronze focus:ring-2 focus:ring-vesta-bronze focus:ring-opacity-10"
                    />
                    <button
                      type="button"
                      onClick={handleProjectLookup}
                      disabled={!formData.project_id?.trim() || autofillLoading}
                      className="px-4 py-3 bg-vesta-charcoal text-vesta-cream text-sm rounded-lg font-medium hover:bg-opacity-90 transition-all disabled:opacity-40 whitespace-nowrap"
                    >
                      {autofillLoading ? 'Looking up...' : 'Look up'}
                    </button>
                  </div>
                  {autofillFound && (
                    <p className="text-xs text-vesta-sage mt-2 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Project found — details auto-filled below
                    </p>
                  )}
                </div>

                {/* Market */}
                <div>
                  <label className="block text-sm font-medium text-vesta-charcoal mb-2">
                    Which market does this project belong to?
                  </label>
                  <select
                    value={formData.market || ''}
                    onChange={(e) => handleFieldChange('market', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-vesta-border rounded-lg text-vesta-charcoal text-sm focus:outline-none focus:border-vesta-bronze appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%239A9590%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center]"
                  >
                    <option value="">Select market</option>
                    <option value="San Francisco">San Francisco</option>
                    <option value="Los Angeles">Los Angeles</option>
                    <option value="New York City">New York City</option>
                    <option value="Florida">Florida</option>
                  </select>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-vesta-charcoal mb-2">
                    Please specify the address of this project
                  </label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    placeholder="Full property address"
                    className="w-full px-4 py-3 bg-white border border-vesta-border rounded-lg text-vesta-charcoal text-sm placeholder:text-vesta-muted focus:outline-none focus:border-vesta-bronze"
                  />
                </div>
              </div>

              {/* Confirm card */}
              {canConfirm && (
                <div className="mt-8 pt-6 border-t border-vesta-border animate-fade-up">
                  <div className="bg-vesta-cream rounded-lg p-5 mb-6">
                    <p className="text-xs font-medium text-vesta-bronze tracking-widest uppercase mb-3">Confirm project</p>
                    <h3 className="font-serif text-lg text-vesta-charcoal">{formData.project_id}</h3>
                    <p className="text-sm text-vesta-muted mt-1">{formData.market} &middot; {formData.address}</p>
                  </div>
                  <button
                    onClick={handleConfirm}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-vesta-bronze text-white rounded-lg text-sm font-medium hover:bg-vesta-bronze-light transition-all"
                  >
                    Confirm &amp; Begin Form
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main form (after confirmation)
  return (
    <div className="min-h-screen bg-vesta-cream">
      <Header />

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Project banner */}
        <div className="bg-white border border-vesta-border rounded-lg px-5 py-3 mb-8 flex items-center justify-between animate-fade-up">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-vesta-bronze bg-opacity-10 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-vesta-bronze" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-vesta-charcoal">{formData.project_id}</p>
              <p className="text-xs text-vesta-muted">{formData.market} &middot; {formData.address}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setConfirmed(false)
              setCurrentStep(0)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="text-xs text-vesta-muted hover:text-vesta-charcoal transition-colors"
          >
            Change
          </button>
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
            <span className="text-xs font-medium text-vesta-bronze tracking-widest uppercase">
              Section {currentSection.icon}
            </span>
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
                onChange={handleFieldChange}
                onOtherChange={handleFieldChange}
                formData={formData}
              />
            ))}
          </div>
        </div>

        {/* Error */}
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-vesta-charcoal hover:bg-vesta-warm transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {isFirstStep ? 'Back to project' : 'Previous'}
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
