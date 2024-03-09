export const islandClasses: Record<
  string,
  {
    coloredBg: string
    text: string
    ring: string
    islandHighlight: string
    hoverAndFocus: string
    peer: string
    label: string
  }
> = {
  hawaii: {
    coloredBg: 'tw-bg-red-500 tw-text-white',
    text: 'tw-text-red-500',
    ring: 'tw-ring-red-300',
    islandHighlight: '[--big-island-highlight-color:theme(colors.red.500)]',
    hoverAndFocus: 'focus:tw-bg-red-900 hover:tw-bg-red-900',
    peer: 'tw-peer/big-island',
    label: 'Big Island',
  },
  maui: {
    coloredBg: 'tw-bg-pink-500 tw-text-white',
    text: 'tw-text-pink-500',
    ring: 'tw-ring-pink-300',
    islandHighlight: '[--maui-highlight-color:theme(colors.pink.500)]',
    hoverAndFocus: 'focus:tw-bg-pink-900 hover:tw-bg-pink-900',
    peer: 'tw-peer/maui',
    label: 'Maui',
  },
  oahu: {
    coloredBg: 'tw-bg-yellow-500 tw-text-white',
    text: 'tw-text-yellow-500',
    ring: 'tw-ring-yellow-300',
    islandHighlight: '[--oahu-highlight-color:theme(colors.yellow.400)]',
    hoverAndFocus: 'focus:tw-bg-yellow-600 hover:tw-bg-yellow-600',
    peer: 'tw-peer/oahu',
    label: 'Oahu',
  },
  kauai: {
    coloredBg: 'tw-bg-fuchsia-500 tw-text-white',
    text: 'tw-text-fuchsia-500',
    ring: 'tw-ring-fuchsia-300',
    islandHighlight: '[--kauai-highlight-color:theme(colors.fuchsia.500)]',
    hoverAndFocus: 'focus:tw-bg-fuchsia-900 hover:tw-bg-fuchsia-900',
    peer: 'tw-peer/kauai',
    label: 'Kauai',
  },
  '': {
    coloredBg: 'tw-bg-red-500 tw-text-white',
    text: 'tw-text-red-500',
    ring: 'tw-ring-red-300',
    islandHighlight: '',
    hoverAndFocus: 'focus:tw-bg-red-900 hover:tw-bg-red-900',
    peer: 'tw-peer/any-island',
    label: 'Any Island',
  },
}
