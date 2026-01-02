import { useIsLoggedIn } from '../hooks/useIsLoggedIn'
import React, { ComponentProps } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { getNhostClient } from '../utils/nhostClient'

interface VisitorQuestion {
  id: number
  label: string
  question_type: string
  active: boolean
}

const nhost = getNhostClient()

export interface RegistrationProps extends ComponentProps<'div'> {}

export const Registration = ({ className = '', ...props }: RegistrationProps) => {
  const [questions, setQuestions] = useState<VisitorQuestion[]>([])

  const { loggedIn } = useIsLoggedIn()
  useEffect(() => {
    if (!loggedIn) return
    ;(async () => {
      const res = await nhost.graphql
        .request<{ visitor_question: VisitorQuestion[] }>(
          `
        query getRegistrationQuestions {
          visitor_question {
            id
            label
            question_type
            active
          }
        }
      `,
        )
        .catch((err) => (err instanceof Error ? err : new Error(JSON.stringify(err))))

      if (res instanceof Error) {
        return console.error('bummer', res)
      }

      setQuestions(res.body?.data?.visitor_question ?? [])
    })()
  }, [loggedIn])

  return (
    <div className={`${className}`} {...props}>
      {questions.map((q) => (
        <div />
      ))}
    </div>
  )
}
