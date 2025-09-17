import { islandClasses } from '../utils/islandClasses'
import { Category } from '../@types/duda'
import { ComponentProps } from 'preact'
import { getCategoryHref } from '../utils/urls'

export interface CategoryListProps extends Omit<ComponentProps<'div'>, 'size'> {
  categories?: Category[]
  island: string
  className?: string
  size?: 'sm' | 'lg'
}

const sizeClasses = {
  sm: 'tw-px-2 tw-py-0.5 tw-text-xs',
  lg: 'tw-px-3 tw-py-0.5 tw-text-sm',
}

export const CategoryList = ({ className = '', size = 'sm', categories, island, ...props }: CategoryListProps) => {
  if (!categories) return null

  const sizeClass = sizeClasses[size] ?? sizeClasses.sm

  return (
    <div
      className={`${className} no-scrollbar tw-flex tw-flex-nowrap tw-items-end tw-gap-2 tw-overflow-x-auto tw-py-1`}
      {...props}
    >
      {categories.map((category) => (
        <a
          href={getCategoryHref(category.label, island, category.is_primary)}
          className={`tw-whitespace-nowrap tw-rounded-full tw-capitalize ${sizeClass} ${islandClasses[island].coloredBg}`}
        >
          {category.label}
        </a>
      ))}
    </div>
  )
}
