import React from 'react'
import { insertReactRoot } from './dom'

interface Milestone {
  due: string
  hours: number
  issues: string[]
}

const HOURLY_RATE = 40

/** Enter a value into an input element and trigger the input event so that Upwork reads it. */
const setInput = (el: HTMLInputElement, value: string | number) => {
  el.value = value.toString()
  el.dispatchEvent(new Event('input'))
}

/** Fills out the form with a milestone. */
const fillMilestone = async (milestone: Milestone, i: number) => {
  // add a new form if it does not exist yet
  if (!document.getElementById(`milestone-description-${i}`)) {
    const addMilestoneButton = document.querySelector('[data-ev-label="add_milestone_button"]') as HTMLElement
    addMilestoneButton.click()
    await new Promise(resolve => requestAnimationFrame(resolve))
  }

  // fill out the form
  const description = document.getElementById(`milestone-description-${i}`) as HTMLInputElement
  const due = document.getElementById(`milestone-due-${i}`)?.querySelector('input') as HTMLInputElement
  const amount = document.getElementById(`milestone-amount-${i}`) as HTMLInputElement
  setInput(description, milestone.issues.map(issue => `#${issue}`).join(', '))
  setInput(due, milestone.due)
  setInput(amount, milestone.hours * HOURLY_RATE)
}

/** A button that imports milestones from JSON. */
function ImportButton() {
  const [value, setValue] = React.useState('')

  return (
    <>
      <input
        className='air3-input mr-4'
        placeholder='Paste milestone JSON here'
        style={{ display: 'inline-block', width: '16em' }}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button
        onClick={() => {
          const milestones = JSON.parse(value) as Milestone[]
          milestones.forEach(fillMilestone)
        }}
        type='button'
        className='air3-btn air3-btn-tertiary mb-6x'
        style={{ marginTop: '-1em' }}
      >
        Import Milestones
      </button>
    </>
  )
}

const grid = document.querySelector('[data-test="contract-terms-fixed-milestones"] .air3-grid-container') as HTMLElement
insertReactRoot(grid, 'before', { id: 'import' })?.render(
  <React.StrictMode>
    <ImportButton />
  </React.StrictMode>,
)
