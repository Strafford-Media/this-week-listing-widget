import React, { ComponentProps } from 'react'
import { useDudaContext } from '../DudaContext'

export interface AppProps extends ComponentProps<'div'> {}

export const App = ({ className = '', ...props }: AppProps) => {
  const { pageData } = useDudaContext()

  return (
    <div className={`${className}`} {...props}>
      <section className="ps-p-12">
        <h2>{pageData.business_name}</h2>
        <p>{pageData.slogan}</p>
      </section>
    </div>
  )
}
