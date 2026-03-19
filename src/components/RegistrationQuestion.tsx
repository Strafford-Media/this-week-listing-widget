import { parseQuestionMetadata, resolveAnswerToQuestionType } from '../utils/visitor_question_parsing'
import { CheckboxQuestion, ChoiceQuestion, NumberQuestion, TextQuestion, VisitorQuestion } from '../@types/duda'
import React, { ComponentProps } from 'preact'
import { TextInput } from './TextInput'
import { TextArea } from './TextArea'
import { Checkbox } from './Checkbox'

export interface RegistrationQuestionProps {
  className?: string
  question: VisitorQuestion
  answer: any
  onAnswerChanged(answer: any): void
}

export const RegistrationQuestion = ({
  className = '',
  question: questionRaw,
  answer,
  onAnswerChanged,
}: RegistrationQuestionProps) => {
  const question = parseQuestionMetadata(questionRaw)

  if (!question) return null

  const resolvedAnswer = resolveAnswerToQuestionType(answer, question.question_type)

  switch (question.question_type) {
    case 'text':
      return (
        <TextQuestionField
          className={className}
          question={question}
          answer={resolvedAnswer as string}
          onAnswerChanged={onAnswerChanged}
        />
      )
    case 'number':
      return (
        <NumberQuestionField
          className={className}
          question={question}
          answer={resolvedAnswer as string}
          onAnswerChanged={onAnswerChanged}
        />
      )
    case 'checkbox':
      return (
        <CheckboxQuestionField
          className={className}
          question={question}
          answer={resolvedAnswer as boolean}
          onAnswerChanged={onAnswerChanged}
        />
      )
    case 'choice':
      return (
        <ChoiceQuestionField
          className={className}
          question={question}
          answer={resolvedAnswer as string[]}
          onAnswerChanged={onAnswerChanged}
        />
      )
  }
}

interface TextQuestionFieldProps {
  className?: string
  question: TextQuestion
  answer: string
  onAnswerChanged(answer: string): void
}

const TextQuestionField = ({ className = '', question, answer, onAnswerChanged, ...props }: TextQuestionFieldProps) => {
  const id = `visitor-question-${question.id}`

  const Component = question.metadata.longform ? TextArea : TextInput

  return (
    <Component
      className={`${className}`}
      id={id}
      label={question.label}
      type={question.metadata.longform ? undefined : 'text'}
      value={answer}
      placeholder={question.metadata.placeholder}
      onInput={(e) => onAnswerChanged(e.currentTarget.value)}
      required={question.metadata.required}
      description={question.metadata.description}
    />
  )
}

interface NumberQuestionFieldProps {
  className?: string
  question: NumberQuestion
  answer: string
  onAnswerChanged(answer: string): void
}

const NumberQuestionField = ({ className = '', question, answer, onAnswerChanged }: NumberQuestionFieldProps) => {
  const id = `visitor-question-${question.id}`

  return (
    <TextInput
      className={`${className}`}
      label={question.label}
      id={id}
      type="number"
      value={answer}
      min={question.metadata.min}
      max={question.metadata.max}
      step={question.metadata.step}
      placeholder={question.metadata.placeholder?.toString()}
      onInput={(e) => onAnswerChanged(e.currentTarget.value)}
      required={question.metadata.required}
      description={question.metadata.description}
    />
  )
}

interface CheckboxQuestionFieldProps {
  className?: string
  question: CheckboxQuestion
  answer: boolean
  onAnswerChanged(answer: boolean): void
}

const CheckboxQuestionField = ({ className = '', question, answer, onAnswerChanged }: CheckboxQuestionFieldProps) => {
  const id = `visitor-question-${question.id}`

  return (
    <Checkbox
      id={id}
      className={className}
      checked={answer}
      onInput={(e) => onAnswerChanged(e.currentTarget.checked)}
      label={question.label}
      description={question.metadata.description}
      required={question.metadata.required}
    />
  )
}

interface ChoiceQuestionFieldProps extends ComponentProps<'div'> {
  question: ChoiceQuestion
  answer: string[]
  onAnswerChanged(answer: string[]): void
}

const ChoiceQuestionField = ({
  className = '',
  question,
  answer,
  onAnswerChanged,
  ...props
}: ChoiceQuestionFieldProps) => {
  return (
    <div className={`${className}`} {...props}>
      <label class="tw-font-medium">
        {question.label}
        {question.metadata.required && <span class="tw-ml-1 tw-text-xl tw-leading-3 tw-text-green-500">*</span>}
      </label>
      <div class="tw-flex tw-flex-wrap tw-gap-2">
        {question.metadata.choices.map((choice, index) => {
          const id = `question-${question.id}-choice-${index}`
          const checked = answer.includes(choice.label)

          return (
            <label
              key={choice.label}
              class={`tw-flex-center tw-relative tw-grow tw-cursor-pointer tw-rounded tw-border tw-px-2 tw-py-1 tw-ring-0 tw-ring-red-200 focus-within:tw-ring ${
                checked ? 'tw-border-red-500 tw-bg-red-500 tw-text-white' : 'tw-border-red-300 tw-bg-white'
              }`}
            >
              <input
                id={id}
                class="tw-absolute tw-h-0 tw-w-0"
                type="checkbox"
                checked={checked}
                onClick={(e) => {
                  const newAnswer = e.currentTarget.checked
                    ? question.metadata.multiple
                      ? answer.concat([choice.label])
                      : [choice.label]
                    : answer.filter((a) => a !== choice.label)
                  onAnswerChanged(newAnswer)
                }}
              />
              <span>{choice.label}</span>
            </label>
          )
        })}
      </div>
      {question.metadata.description && (
        <p class="tw-mt-1 tw-text-sm tw-text-gray-500">{question.metadata.description}</p>
      )}
    </div>
  )
}
