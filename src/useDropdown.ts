import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'

interface DropdownOptions {
  itemCount: number
  initialIndex: number
  onChoose: (index: number) => void
}

export function useDropdown({ itemCount, initialIndex, onChoose }: DropdownOptions) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!isOpen) return

    listRef.current?.focus()

    function closeOnOutsidePress(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsidePress)
    return () => document.removeEventListener('pointerdown', closeOnOutsidePress)
  }, [isOpen])

  function open() {
    setActiveIndex(initialIndex)
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
    buttonRef.current?.focus()
  }

  function choose(index: number) {
    onChoose(index)
    close()
  }

  function handleButtonKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      open()
    }
  }

  function handleListKeyDown(event: KeyboardEvent) {
    const lastIndex = itemCount - 1
    const moves: Record<string, number> = {
      ArrowDown: Math.min(activeIndex + 1, lastIndex),
      ArrowUp: Math.max(activeIndex - 1, 0),
      Home: 0,
      End: lastIndex,
    }

    if (event.key in moves) {
      event.preventDefault()
      setActiveIndex(moves[event.key])
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      choose(activeIndex)
    } else if (event.key === 'Escape') {
      close()
    } else if (event.key === 'Tab') {
      setIsOpen(false)
    }
  }

  return {
    isOpen,
    rootRef,
    buttonProps: {
      ref: buttonRef,
      type: 'button' as const,
      'aria-expanded': isOpen,
      'aria-controls': listId,
      onClick: () => (isOpen ? close() : open()),
      onKeyDown: handleButtonKeyDown,
    },
    listProps: {
      ref: listRef,
      id: listId,
      'aria-activedescendant': `${listId}-${activeIndex}`,
      tabIndex: -1,
      onKeyDown: handleListKeyDown,
    },
    itemProps: (index: number) => ({
      id: `${listId}-${index}`,
      'data-active': index === activeIndex,
      onClick: () => choose(index),
      onMouseEnter: () => setActiveIndex(index),
    }),
  }
}
