import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import type { KeyOption } from './keys.ts'

interface KeySelectProps {
  options: KeyOption[]
  selected: string
  onChange: (keyName: string) => void
}

function CheckIcon() {
  return (
    <svg className="key-check" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function KeySelect({ options, selected, onChange }: KeySelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const listId = useId()

  const selectedIndex = options.findIndex((option) => option.name === selected)

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
    setActiveIndex(selectedIndex)
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
    buttonRef.current?.focus()
  }

  function choose(option: KeyOption) {
    onChange(option.name)
    close()
  }

  function handleButtonKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      open()
    }
  }

  function handleListKeyDown(event: KeyboardEvent) {
    const lastIndex = options.length - 1
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
      choose(options[activeIndex])
    } else if (event.key === 'Escape') {
      close()
    } else if (event.key === 'Tab') {
      setIsOpen(false)
    }
  }

  return (
    <div className="key-select" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="key-button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleButtonKeyDown}
      >
        Tono: <strong>{options[selectedIndex].name}</strong>
      </button>
      {isOpen && (
        <ul
          ref={listRef}
          id={listId}
          className="key-list"
          role="listbox"
          aria-label="Tono"
          aria-activedescendant={`${listId}-${activeIndex}`}
          tabIndex={-1}
          onKeyDown={handleListKeyDown}
        >
          {options.map((option, index) => (
            <li
              key={option.name}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === selectedIndex}
              className="key-option"
              data-active={index === activeIndex}
              data-original={option.isOriginal}
              data-selected={index === selectedIndex}
              onClick={() => choose(option)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {index === selectedIndex ? <CheckIcon /> : <span className="key-check" />}
              <span className="key-name">{option.name}</span>
              {option.isOriginal && <span className="key-badge">Original</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
