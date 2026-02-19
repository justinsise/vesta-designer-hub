'use client'

export default function FormField({ field, value, otherValue, onChange, onOtherChange, formData }) {
  // Handle conditional visibility
  if (field.conditional) {
    const parentValue = formData[field.conditional.field]
    if (parentValue !== field.conditional.value) {
      return null
    }
  }

  const baseInputClasses =
    'w-full px-4 py-3 bg-white border border-vesta-border rounded-lg text-vesta-charcoal text-sm placeholder:text-vesta-muted focus:outline-none'

  const labelClasses = 'block text-sm font-medium text-vesta-charcoal mb-2 leading-snug'

  switch (field.type) {
    case 'text':
      return (
        <div>
          <label className={labelClasses}>{field.label}</label>
          {field.helperText && (
            <p className="text-xs text-vesta-muted mb-2">{field.helperText}</p>
          )}
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder || ''}
            className={baseInputClasses}
            required={field.required}
          />
        </div>
      )

    case 'url':
      return (
        <div>
          <label className={labelClasses}>{field.label}</label>
          <input
            type="url"
            value={value || ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder || 'https://'}
            className={baseInputClasses}
          />
        </div>
      )

    case 'textarea':
      return (
        <div>
          <label className={labelClasses}>{field.label}</label>
          {field.helperText && (
            <p className="text-xs text-vesta-muted mb-2">{field.helperText}</p>
          )}
          <textarea
            value={value || ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            placeholder={field.placeholder || ''}
            rows={field.rows || 3}
            className={`${baseInputClasses} resize-y`}
            required={field.required}
          />
        </div>
      )

    case 'select':
      return (
        <div>
          <label className={labelClasses}>{field.label}</label>
          {field.helperText && (
            <p className="text-xs text-vesta-muted mb-2">{field.helperText}</p>
          )}
          <select
            value={value || ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            className={`${baseInputClasses} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%239A9590%22%20d%3D%22M6%208L1%203h10z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_1rem_center]`}
            required={field.required}
          >
            <option value="">Select an option</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )

    case 'boolean':
      return (
        <div>
          <label className={labelClasses}>{field.label}</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onChange(field.name, true)}
              className={`radio-option flex-1 px-4 py-3 border rounded-lg text-sm font-medium transition-all ${
                value === true
                  ? 'selected border-vesta-bronze bg-vesta-bronze bg-opacity-[0.08] text-vesta-charcoal'
                  : 'border-vesta-border text-vesta-muted hover:border-vesta-bronze'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => onChange(field.name, false)}
              className={`radio-option flex-1 px-4 py-3 border rounded-lg text-sm font-medium transition-all ${
                value === false
                  ? 'selected border-vesta-bronze bg-vesta-bronze bg-opacity-[0.08] text-vesta-charcoal'
                  : 'border-vesta-border text-vesta-muted hover:border-vesta-bronze'
              }`}
            >
              No
            </button>
          </div>
        </div>
      )

    case 'yes_no_other':
      return (
        <div>
          <label className={labelClasses}>{field.label}</label>
          <div className="flex gap-3">
            {['Yes', 'No', 'Other'].map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(field.name, opt)}
                className={`radio-option flex-1 px-4 py-3 border rounded-lg text-sm font-medium transition-all ${
                  value === opt
                    ? 'selected border-vesta-bronze bg-vesta-bronze bg-opacity-[0.08] text-vesta-charcoal'
                    : 'border-vesta-border text-vesta-muted hover:border-vesta-bronze'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {value === 'Other' && (
            <textarea
              value={otherValue || ''}
              onChange={(e) => onOtherChange(`${field.name}_other`, e.target.value)}
              placeholder={field.otherLabel || 'Please specify...'}
              rows={2}
              className={`${baseInputClasses} mt-3 resize-y`}
            />
          )}
        </div>
      )

    default:
      return null
  }
}
