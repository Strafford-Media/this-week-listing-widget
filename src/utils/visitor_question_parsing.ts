import { VisitorQuestion } from '../@types/duda'

export const parseQuestionMetadata = (v: VisitorQuestion): VisitorQuestion | null | undefined => {
  if (!v || !v.label || !v.question_type || !v.id) return null

  if (v.metadata?.required != null && typeof v.metadata.required !== 'boolean') {
    v.metadata.required = false
  }

  if (v.metadata?.description != null && typeof v.metadata.description !== 'string') {
    v.metadata.description = undefined
  }

  switch (v.question_type) {
    case 'text':
      v.metadata ||= {}

      if (v.metadata.defaultValue != null && typeof v.metadata.defaultValue !== 'string') {
        v.metadata.defaultValue = undefined
      }

      if (v.metadata.longform != null && typeof v.metadata.longform !== 'boolean') {
        v.metadata.longform = false
      }

      if (v.metadata.placeholder != null && typeof v.metadata.placeholder !== 'string') {
        v.metadata.placeholder = undefined
      }

      return v
    case 'number':
      v.metadata ||= {}

      if (v.metadata.defaultValue != null && typeof v.metadata.defaultValue !== 'number') {
        v.metadata.defaultValue = undefined
      }

      if (v.metadata.min != null && typeof v.metadata.min !== 'number') {
        v.metadata.min = undefined
      }

      if (v.metadata.max != null && typeof v.metadata.max !== 'number') {
        v.metadata.max = undefined
      }

      if (v.metadata.step != null && typeof v.metadata.step !== 'number') {
        v.metadata.step = undefined
      }

      if (v.metadata.placeholder != null && !['number', 'string'].includes(typeof v.metadata.placeholder)) {
        v.metadata.placeholder = undefined
      }

      return v
    case 'checkbox':
      v.metadata ||= {}

      if (v.metadata.defaultValue != null && typeof v.metadata.defaultValue !== 'boolean') {
        v.metadata.defaultValue = false
      }

      return v
    case 'choice':
      if (
        !v.metadata ||
        !Array.isArray(v.metadata.choices) ||
        v.metadata.choices.some((c) => typeof c.label !== 'string')
      ) {
        return null
      }

      v.metadata.choices.forEach((c) => {
        if (typeof c.defaultChecked !== 'boolean') {
          c.defaultChecked = false
        }
      })

      if (v.metadata.multiple != null && typeof v.metadata.multiple !== 'boolean') {
        v.metadata.multiple = false
      }

      return v
  }
}

export const resolveAnswerToQuestionType = (answer: any, questionType: VisitorQuestion['question_type']) => {
  switch (questionType) {
    case 'number':
    case 'text':
      return typeof answer === 'string' || typeof answer === 'number' || typeof answer === 'bigint' ? `${answer}` : ''
    case 'checkbox':
      return typeof answer === 'boolean' ? answer : false
    case 'choice':
      return Array.isArray(answer) ? answer.filter((a) => typeof a === 'string') : []
  }
}

export const isAnswerValidForQuestion = (answer: any, question: VisitorQuestion) => {
  switch (question.question_type) {
    case 'number':
      if (answer == null || answer === '') {
        if (question.metadata.required) return false

        // having bypassed the required check, none of the other checks matter if it's empty
        break
      }

      const actualValue = safeParseFloat(answer)

      if (isNaN(actualValue)) return false
      if (question.metadata.min != null && actualValue < question.metadata.min) return false
      if (question.metadata.max != null && actualValue > question.metadata.max) return false

      break
    case 'text':
      if (question.metadata.required && (answer == null || answer === '')) return false

      break
    case 'checkbox':
      if (question.metadata.required && answer !== true) return false

      break
    case 'choice':
      const validAnswers = Array.isArray(answer)
        ? answer.filter((a) => question.metadata.choices.some((c) => c.label === a))
        : []

      if (question.metadata.required && !validAnswers.length) return false

      if (!question.metadata.multiple && validAnswers.length > 1) return false

      break
  }

  return true
}

export const safeParseFloat = (val: any) => {
  try {
    return parseFloat(val)
  } catch (error) {
    return NaN
  }
}

export const getDefaultAnswer = (q: VisitorQuestion) => {
  switch (q?.question_type) {
    case 'number':
    case 'text':
    case 'checkbox':
      return q.metadata.defaultValue
    case 'choice':
      return q.metadata.choices.filter((c) => c.defaultChecked).map((c) => c.label)
  }
}

export const formatAnswer = (q: VisitorQuestion, a: any) => {
  return {
    rawAnswer: a,
    questionType: q.question_type,
    originalLabel: q.label,
  }
}
