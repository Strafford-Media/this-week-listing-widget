import React, { ComponentProps } from 'preact'
import { useState } from 'preact/hooks'
import { getNhostClient } from '../utils/nhostClient'
import { VisitorQuestion } from '../@types/duda'
import { RegistrationQuestion } from './RegistrationQuestion'
import { TextInput } from './TextInput'
import { formatAnswer, getDefaultAnswer, isAnswerValidForQuestion } from '../utils/visitor_question_parsing'
import { Button } from './Button'
import { useGraphQLResponse } from '../hooks/useGraphQLResponse'
import { useOnlyOnce } from '../hooks/useOnlyOnce'
import { Checkbox } from './Checkbox'

const nhost = getNhostClient()

export interface RegistrationProps extends ComponentProps<'div'> {
  onSignUp(): void
}

export const Registration = ({ className = '', onSignUp, ...props }: RegistrationProps) => {
  const { data, error } = useGraphQLResponse<{ visitor_question: VisitorQuestion[] }>({
    query: `query getRegistrationQuestions {
      visitor_question (order_by: { order: asc }, where: { active: { _eq: true } }) {
        id
        label
        question_type
        metadata
      }
    }`,
  })

  const questions = data?.visitor_question ?? []

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const [answers, setAnswers] = useState<Record<number, any>>({})

  const [commsOptIn, setCommsOptIn] = useState(true)

  useOnlyOnce(
    () => setAnswers((as) => ({ ...as, ...questions.reduce((qa, q) => ({ ...qa, [q.id]: getDefaultAnswer(q) }), {}) })),
    !!questions.length,
  )

  const disabled =
    !email ||
    !password ||
    password.length < 9 ||
    !firstName ||
    (!error && questions.some((q) => !isAnswerValidForQuestion(answers[q.id], q)))

  return (
    <div className={`${className} tw-text-left tw-text-base`} {...props}>
      <form
        class="tw-flex tw-max-w-xl tw-flex-col tw-items-stretch"
        action="#"
        onSubmit={async (e) => {
          e.preventDefault()

          if (disabled) return

          const res = await nhost.auth
            .signUpEmailPassword({
              email,
              password,
              options: { defaultRole: 'subscriber', displayName: `${firstName}${lastName ? ` ${lastName}` : ''}` },
            })
            .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

          if (res instanceof Error) {
            return console.error('signup failed:', res)
          }

          if (commsOptIn) {
            await nhost.graphql
              .request({
                query: `mutation commsOptIn {
                  insert_communication_opt_in_one(
                    object: { comm_type: "newsletter", opt_in: true },
                    on_conflict: {
                      constraint: communication_opt_in_user_id_comm_type_key,
                      update_columns: [opt_in]
                    }
                  ) {
                    id
                  }
                }`,
              })
              .catch((e) => console.error(e))
          }

          await nhost.graphql
            .request({
              query: `mutation UploadAnswers ($answers: [visitor_answer_insert_input!]!) {
                insert_visitor_answer (
                  objects: $answers,
                  on_conflict: {
                    constraint: visitor_answer_question_id_user_id_key,
                    update_columns: [answer]
                  }
                ) {
                  affected_rows
                }
              }`,
              variables: {
                answers: questions
                  .filter((q) => isAnswerValidForQuestion(answers[q.id], q))
                  .map((q) => ({ question_id: q.id, answer: formatAnswer(q, answers[q.id]) })),
              },
            })
            .catch((e) => console.error(e))

          onSignUp()
        }}
      >
        <h3 class="tw-text-center tw-font-montserrat tw-text-2xl tw-font-bold">SIGN UP</h3>
        <p class="tw-mb-4 tw-mt-2 tw-text-center tw-font-inter tw-text-xs tw-italic tw-text-gray-500">
          Subscribe and gain access to discounts, promo codes, and more!
        </p>
        <div class="tw-my-2 tw-grid tw-grid-cols-1 tw-gap-2 sm:tw-grid-cols-2">
          <TextInput
            label="First Name"
            name="first_name"
            value={firstName}
            onInput={(e) => setFirstName(e.currentTarget.value)}
            required
          />
          <TextInput
            label="Last Name"
            name="last_name"
            value={lastName}
            onInput={(e) => setLastName(e.currentTarget.value)}
          />
          <TextInput
            label="Email"
            type="email"
            name="email"
            value={email}
            onInput={(e) => setEmail(e.currentTarget.value)}
            required
          />
          <TextInput
            label="Password"
            type="password"
            name="password"
            value={password}
            onInput={(e) => setPassword(e.currentTarget.value)}
            required
          />
        </div>
        {questions.map((q) => (
          <RegistrationQuestion
            className="tw-my-2"
            question={q}
            answer={answers[q.id]}
            onAnswerChanged={(a) => setAnswers((as) => ({ ...as, [q.id]: a }))}
          />
        ))}
        <Checkbox
          label="Keep Me Informed"
          checked={commsOptIn}
          onClick={(e) => setCommsOptIn(e.currentTarget.checked)}
          description="I agree to receive periodic email newsletters from This Week Hawaii."
        />
        <Button className="tw-mt-4" type="submit" disabled={disabled}>
          Sign Up
        </Button>
      </form>
    </div>
  )
}
