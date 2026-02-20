'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { FORM_SECTIONS } from '@/lib/formSections'
import Header from '@/components/Header'
import Link from 'next/link'

// Map field names to human-readable labels
const fieldLabels = {}
FORM_SECTIONS.forEach((section) => {
  section.fields.forEach((field) => {
    fieldLabels[field.name] = field.label
  })
})

function formatValue(value) {
  if (value === true) return 'Yes'
  if (value === false) return 'No'
  if (value === null || value === undefined || value === '') return '—'
  return String(value)
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function SubmissionDetail({ submission, onClose }) {
  return (
    <div className="section-enter">
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-sm text-vesta-muted hover:text-vesta-charcoal transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to submissions
      </button>

      <div className="bg-white border border-vesta-border rounded-lg p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl text-vesta-charcoal">{submission.project_id}</h2>
            <p className="text-sm text-vesta-muted mt-1">
              {submission.market} &middot; {submission.address || 'No address'}
            </p>
          </div>
          <span className="text-xs text-vesta-muted bg-vesta-warm px-3 py-1 rounded-full">
            {formatDate(submission.submitted_at)}
          </span>
        </div>

        {FORM_SECTIONS.map((section) => {
          const sectionFields = section.fields.filter((field) => {
            const val = submission[field.name]
            return val !== null && val !== undefined && val !== ''
          })

          if (sectionFields.length === 0) return null

          return (
            <div key={section.id} className="mb-8 last:mb-0">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-vesta-border">
                <span className="text-xs font-medium text-vesta-bronze tracking-widest uppercase">
                  {section.icon}
                </span>
                <h3 className="font-serif text-lg text-vesta-charcoal">{section.title}</h3>
              </div>
              <div className="space-y-4">
                {sectionFields.map((field) => (
                  <div key={field.name}>
                    <p className="text-xs font-medium text-vesta-muted mb-1">{field.label}</p>
                    <p className="text-sm text-vesta-charcoal whitespace-pre-wrap leading-relaxed">
                      {formatValue(submission[field.name])}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function MySubmissions() {
  const supabase = createClient()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    async function fetchSubmissions() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('project_close_submissions')
        .select('*')
        .eq('submitted_by', user.email)
        .order('submitted_at', { ascending: false })

      if (data && !error) {
        setSubmissions(data)
      }
      setLoading(false)
    }

    fetchSubmissions()
  }, [])

  const selectedSubmission = submissions.find((s) => s.id === selectedId)

  return (
    <div className="min-h-screen bg-vesta-cream">
      <Header />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {selectedSubmission ? (
          <SubmissionDetail
            submission={selectedSubmission}
            onClose={() => {
              setSelectedId(null)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        ) : (
          <div className="animate-fade-up">
            <div className="mb-8">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-vesta-muted hover:text-vesta-charcoal transition-colors mb-6"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to hub
              </Link>
              <h1 className="font-serif text-3xl text-vesta-charcoal mb-2">My Submissions</h1>
              <p className="text-vesta-muted text-sm">
                Review your previously submitted project close forms.
              </p>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white border border-vesta-border rounded-lg p-6 animate-pulse">
                    <div className="h-5 bg-vesta-warm rounded w-32 mb-3" />
                    <div className="h-4 bg-vesta-warm rounded w-64" />
                  </div>
                ))}
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-vesta-warm rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-vesta-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl text-vesta-charcoal mb-2">No submissions yet</h3>
                <p className="text-vesta-muted text-sm mb-6">
                  You haven&apos;t submitted any project close forms yet.
                </p>
                <Link
                  href="/project-close"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-vesta-charcoal text-vesta-cream rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all"
                >
                  Start a form
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setSelectedId(sub.id)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="w-full text-left bg-white border border-vesta-border rounded-lg p-6 hover:border-vesta-bronze hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-serif text-lg text-vesta-charcoal group-hover:text-vesta-bronze transition-colors">
                          {sub.project_id}
                        </h3>
                        <p className="text-sm text-vesta-muted mt-1">
                          {sub.market}{sub.address ? ` · ${sub.address}` : ''}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          {sub.service_in_focus && (
                            <span className="text-xs bg-vesta-warm text-vesta-muted px-2 py-0.5 rounded">
                              {sub.service_in_focus}
                            </span>
                          )}
                          {sub.worthy_of_photography && (
                            <span className="text-xs bg-vesta-bronze bg-opacity-10 text-vesta-bronze px-2 py-0.5 rounded">
                              📷 Photo-worthy
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-vesta-muted whitespace-nowrap">
                          {formatDate(sub.submitted_at)}
                        </span>
                        <svg className="w-4 h-4 text-vesta-muted group-hover:text-vesta-bronze group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
