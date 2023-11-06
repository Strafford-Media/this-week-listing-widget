import { ComponentProps } from 'preact'
import { useDudaContext } from '../DudaContext'

export interface AppProps extends ComponentProps<'div'> {}

export const App = ({ className = '', ...props }: AppProps) => {
  const { pageData } = useDudaContext()

  return (
    <div className={`${className}`} {...props}>
      <section className="tw-p-12">
        <img src={pageData.logo} alt={`${pageData.business_name} Logo`} />
        {pageData.this_week_recommended && (
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="tw-w-6 tw-h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
            This Week Recommended!
          </div>
        )}
        <div>{pageData.island}</div>
        <div>{pageData.primary_email}</div>
        <div>{pageData.primary_phone}</div>
        <div>{pageData.primary_address}</div>
        <a
          href={pageData.primary_web_url}
          target="_blank"
          rel="noreferrer noopener"
        >
          {pageData.primary_web_url}
        </a>
        <div>{pageData.description}</div>
        <div>
          <h3>Photo Gallery</h3>
          <ul>
            {pageData.images.map((image) => (
              <li key={image.url}>
                <img src={image.url} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
