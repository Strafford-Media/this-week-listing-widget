import { islandClasses } from '../utils/islandClasses'
import { Category } from '../@types/duda'
import { ComponentProps } from 'preact'

export interface CategoryListProps extends ComponentProps<'div'> {
  categories?: Category[]
  island: string
  className?: string
}

export const CategoryList = ({ className = 'tw-flex', categories, island, ...props }: CategoryListProps) => {
  if (!categories) return null

  return (
    <div
      className={`${className} no-scrollbar tw-flex-nowrap tw-items-end tw-gap-2 tw-overflow-x-auto tw-bg-gradient-to-t tw-from-white tw-from-60% tw-px-2 sm:tw-absolute sm:tw-inset-x-0 sm:tw-bottom-0 sm:tw-pb-2 sm:tw-pt-6`}
      {...props}
    >
      {categories.map((category) => (
        <span
          className={`tw-whitespace-nowrap tw-rounded-full tw-px-2 tw-py-0.5 tw-text-xs tw-capitalize ${islandClasses[island].coloredBg}`}
        >
          {category.label}
        </span>
      ))}
    </div>
  )
}
