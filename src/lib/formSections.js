// All form questions organized by section
// Field types: text, textarea, select, boolean, yes_no_other, url

// Step 0: Project confirmation (handled separately in the form UI)
export const CONFIRM_FIELDS = [
  {
    name: 'project_id',
    label: 'What is the project ID?',
    type: 'text',
    required: true,
    placeholder: 'e.g. VH-2025-001',
    autofillTrigger: true,
  },
  {
    name: 'market',
    label: 'Which market does this project belong to?',
    type: 'select',
    options: ['San Francisco', 'Los Angeles', 'New York City', 'Florida'],
    required: true,
    autofilled: true,
    helperText: 'Auto-filled from project ID when available',
  },
  {
    name: 'address',
    label: 'Please specify the address of this project',
    type: 'text',
    required: true,
    autofilled: true,
    helperText: 'Auto-filled from project ID when available',
  },
]

// Steps 1-6: Form sections (after project is confirmed)
export const FORM_SECTIONS = [
  {
    id: 'project',
    title: 'Project Details',
    subtitle: 'Basic information about the project',
    icon: '01',
    fields: [
      {
        name: 'is_project_complete',
        label: 'Is the project/job complete?',
        type: 'boolean',
        required: true,
      },
      {
        name: 'service_in_focus',
        label: 'What was the service in focus for this project?',
        type: 'select',
        options: ['Occupied Staging', 'Vacant Staging', 'Model Home Staging', 'Redesign', 'Install Only', 'Other'],
        required: true,
      },
      {
        name: 'design_style',
        label: 'What was the style of design for this project?',
        type: 'select',
        options: ['Modern', 'Contemporary', 'Transitional', 'Traditional', 'Mid-Century Modern', 'Coastal', 'Farmhouse', 'Industrial', 'Scandinavian', 'Bohemian', 'Other'],
        required: true,
      },
      {
        name: 'sales_personnel',
        label: 'Who was the sales personnel assigned to this project?',
        type: 'text',
        required: true,
      },
      {
        name: 'designer',
        label: 'Who was the Designer on your project?',
        type: 'text',
        required: true,
      },
      {
        name: 'other_partners',
        label: 'Please list all other partners who worked on this project with you, if known',
        type: 'textarea',
        placeholder: 'e.g. listing agent, developer, architect, interior designer',
        required: false,
      },
    ],
  },
  {
    id: 'design',
    title: 'Design & Inspiration',
    subtitle: 'Tell us about your creative vision',
    icon: '02',
    fields: [
      {
        name: 'design_inspiration',
        label: 'What inspired your design work in this project?',
        type: 'textarea',
        required: true,
        rows: 4,
      },
      {
        name: 'hero_pieces',
        label: 'What are the hero pieces in this project? (Min 3)',
        type: 'textarea',
        required: true,
        rows: 5,
        placeholder: 'Provide SKUs with names, one per line\ne.g.\nSKU-12345 - Restoration Hardware Cloud Sofa\nSKU-67890 - Arteriors Caviar Pendant\nSKU-11111 - CB2 Gwyneth Boucle Chair',
        helperText: 'Minimum 3 pieces. Include SKU and name for each.',
      },
      {
        name: 'favourite_aspect',
        label: 'What was your favourite aspect of working on this project?',
        type: 'textarea',
        required: true,
        rows: 3,
        helperText: 'Property specific — what stood out about this particular job?',
      },
      {
        name: 'what_makes_property_unique',
        label: 'What makes this property unique?',
        type: 'textarea',
        required: true,
        rows: 4,
        placeholder: 'e.g. architectural details, location, standout features, or how the space reflects the style of your market',
      },
      {
        name: 'favourite_room',
        label: 'What is your favorite room and why?',
        type: 'textarea',
        required: true,
        rows: 3,
      },
    ],
  },
  {
    id: 'procurement',
    title: 'Procurement & Inventory',
    subtitle: 'Items, reservations, and team coordination',
    icon: '03',
    fields: [
      {
        name: 'crew_performed_as_expected',
        label: 'Did the crew perform as expected?',
        type: 'boolean',
        required: true,
      },
      {
        name: 'crew_notes',
        label: 'Any notes about crew performance?',
        type: 'textarea',
        required: false,
        rows: 2,
        conditional: { field: 'crew_performed_as_expected', value: false },
      },
      {
        name: 'procurement_purchased',
        label: 'Was anything purchased for this project by the procurement department?',
        type: 'boolean',
        required: true,
      },
      {
        name: 'procured_items_added_to_eames',
        label: 'Were the procured items added to your EAMES page via the inventory team?',
        type: 'boolean',
        required: false,
        conditional: { field: 'procurement_purchased', value: true },
      },
      {
        name: 'items_usable_condition',
        label: 'Did your selected items arrive in usable condition?',
        type: 'boolean',
        required: true,
      },
      {
        name: 'items_condition_notes',
        label: 'Please describe any condition issues',
        type: 'textarea',
        required: false,
        rows: 2,
        conditional: { field: 'items_usable_condition', value: false },
      },
      {
        name: 'reserving_difficult_categories',
        label: 'When you were reserving, were there any categories that were particularly difficult to work with or that you wished had more available options?',
        type: 'textarea',
        required: false,
        rows: 3,
      },
      {
        name: 'design_ops_communication_clear',
        label: 'Was communication clear coming from the design ops department when it came to replacements and any other support you needed?',
        type: 'boolean',
        required: true,
      },
      {
        name: 'design_ops_communication_notes',
        label: 'Please share details about communication issues',
        type: 'textarea',
        required: false,
        rows: 2,
        conditional: { field: 'design_ops_communication_clear', value: false },
      },
    ],
  },
  {
    id: 'install',
    title: 'Install Day Operations',
    subtitle: 'How did the installation go?',
    icon: '04',
    fields: [
      {
        name: 'adequate_prep_time',
        label: 'Do you feel that you were given adequate time to prepare for the project?',
        type: 'yes_no_other',
        required: true,
        otherLabel: 'If no, please specify why',
      },
      {
        name: 'schedule_received_before_5pm',
        label: 'Did you receive your schedule for this install prior to 5pm on load day?',
        type: 'yes_no_other',
        required: true,
        otherLabel: 'If no, specify when you received the schedule',
      },
      {
        name: 'notified_truck_departure',
        label: 'Were you notified of truck departure/driver ETA on each day of install?',
        type: 'boolean',
        required: true,
      },
      {
        name: 'team_arrived_on_time',
        label: 'Did your team arrive on time?',
        type: 'yes_no_other',
        required: true,
        otherLabel: 'If no, specify what time they arrived',
      },
      {
        name: 'lead_reviewed_plan',
        label: 'Did the lead take time to review the property/design plan with you?',
        type: 'boolean',
        required: true,
      },
      {
        name: 'adequate_property_protection',
        label: 'Did the team provide adequate protection to the property?',
        type: 'boolean',
        required: true,
      },
      {
        name: 'received_everything_requested',
        label: 'Did you receive everything you requested/reserved on each day of install?',
        type: 'boolean',
        required: true,
      },
      {
        name: 'offloading_delays',
        label: 'Were there any delays or challenges with offloading the truck?',
        type: 'yes_no_other',
        required: true,
        otherLabel: 'Please describe (building or property related)',
      },
      {
        name: 'team_had_tools',
        label: 'Did the team have all tools and supplies necessary to complete a successful install?',
        type: 'yes_no_other',
        required: true,
        otherLabel: 'If no, specify what they were missing',
      },
      {
        name: 'client_onsite',
        label: 'Was the client (or client\'s representative) onsite during the install?',
        type: 'boolean',
        required: true,
      },
      {
        name: 'client_interfering',
        label: 'Was the client interfering or in the way during the install?',
        type: 'yes_no_other',
        required: false,
        conditional: { field: 'client_onsite', value: true },
        otherLabel: 'Please describe',
      },
      {
        name: 'trash_removed',
        label: 'Did the team remove all trash/debris prior to leaving for the day?',
        type: 'boolean',
        required: true,
      },
      {
        name: 'install_surprises',
        label: 'Were there any surprises during the install that were not covered in the scope of work?',
        type: 'yes_no_other',
        required: true,
        otherLabel: 'Please describe the surprises',
      },
      {
        name: 'other_contractors',
        label: 'Were there any other contractors or vendors working onsite during the installation?',
        type: 'yes_no_other',
        required: true,
        otherLabel: 'Please describe who and what they were doing',
      },
      {
        name: 'appropriate_resources',
        label: 'Do you feel that you were given an appropriate amount of resources to complete the job successfully?',
        type: 'yes_no_other',
        required: true,
        otherLabel: 'If no, specify why not',
      },
      {
        name: 'had_reception_internet',
        label: 'Did you have reception/access to internet on your jobsite?',
        type: 'boolean',
        required: true,
      },
      {
        name: 'additional_services',
        label: 'Were there any additional services provided?',
        type: 'yes_no_other',
        required: false,
        otherLabel: 'Please describe the additional services',
      },
    ],
  },
  {
    id: 'photography',
    title: 'Photography & Marketing',
    subtitle: 'Help us showcase your work',
    icon: '05',
    fields: [
      {
        name: 'worthy_of_photography',
        label: 'Is this project worthy of professional photography?',
        type: 'boolean',
        required: true,
      },
      {
        name: 'photography_folder_link',
        label: 'Please provide the link to your project photos in the photography folder',
        type: 'url',
        required: false,
        placeholder: 'https://drive.google.com/...',
      },
      {
        name: 'google_drive_photos_link',
        label: 'Please provide the link to your photos in the Google Drive',
        type: 'url',
        required: false,
        placeholder: 'https://drive.google.com/...',
      },
      {
        name: 'social_campaign_notes',
        label: 'Please share any other notes you may want to emphasize in a social post or email campaign',
        type: 'textarea',
        required: false,
        rows: 4,
      },
    ],
  },
  {
    id: 'reflections',
    title: 'Final Reflections',
    subtitle: 'Overall thoughts on the project',
    icon: '06',
    fields: [
      {
        name: 'enough_time_to_prep',
        label: 'Did you feel you had enough time to prep for your project?',
        type: 'boolean',
        required: true,
      },
      {
        name: 'prep_time_notes',
        label: 'Any additional thoughts on prep time?',
        type: 'textarea',
        required: false,
        rows: 2,
        conditional: { field: 'enough_time_to_prep', value: false },
      },
    ],
  },
]

// Flatten all field names for building the initial form state
export function getInitialFormState() {
  const state = {}

  // Confirm fields
  CONFIRM_FIELDS.forEach(field => {
    state[field.name] = ''
  })

  // Section fields
  FORM_SECTIONS.forEach(section => {
    section.fields.forEach(field => {
      if (field.type === 'boolean') {
        state[field.name] = null
      } else if (field.type === 'yes_no_other') {
        state[field.name] = ''
        state[`${field.name}_other`] = ''
      } else {
        state[field.name] = ''
      }
    })
  })
  return state
}
