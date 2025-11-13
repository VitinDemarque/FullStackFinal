import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import type { College } from '@/types'
import { collegesService } from '@services/colleges.service'
import { brUniversitiesService } from '@services/brUniversities.service'
import { FaPlus, FaSearch } from 'react-icons/fa'

type Props = {
  value?: string | ''
  onChange: (collegeId: string | '') => void
  onCreateRequested?: (name: string) => void
  placeholder?: string
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  min-width: 320px;
`

const Input = styled.input`
  width: 100%;
  background: var(--color-gray-200);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;

  &::placeholder { color: var(--color-text-light); }

  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }

  .dark & { background: var(--color-gray-800); }
`

const Suggestions = styled.ul`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  width: 100%;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  max-height: 280px;
  overflow-y: auto;
  z-index: 1000;
  margin: 0;
  padding: 8px;
  list-style: none;
  opacity: 1;
  backdrop-filter: none;
`

const SuggestionItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 0.95rem;
  background: var(--color-surface, #ffffff);

  &:hover { background: var(--surface-hover); }
`

const CreateOption = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border: 1px dashed var(--color-blue-500);
  color: var(--color-blue-600);
  background: var(--color-surface, #ffffff);
  border-radius: 10px;
  cursor: pointer;

  &:hover { background: var(--surface-hover); }
`

const Pill = styled.span`
  background: var(--color-gray-300);
  color: var(--text-secondary);
  border-radius: 8px;
  padding: 3px 8px;
  font-size: 0.85rem;
`

function displayCollege(c: College) {
  const acronym = (c.acronym || '').trim()
  const hasAcronymInName = acronym ? (c.name || '').toLowerCase().includes(`(${acronym.toLowerCase()})`) : false
  const displayName = hasAcronymInName ? c.name : `${c.name}${acronym ? ` (${acronym})` : ''}`
  return displayName
}

export default function CollegeAutocomplete({ value = '', onChange, onCreateRequested, placeholder = 'Digite o nome da faculdade' }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<College[]>([])
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const debounceRef = useRef<number | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  // Busca inicial: universidades brasileiras
  useEffect(() => {
    let active = true
    brUniversitiesService.search('', 10).then((res) => {
      if (!active) return
      const mapped: College[] = res.items.map(u => ({
        id: u.id,
        name: u.name,
        acronym: u.acronym || null,
        city: u.city || null,
        state: u.state || null,
      }))
      setResults(mapped)
    })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(async () => {
      const br = await brUniversitiesService.search(query, 10)
      const mapped: College[] = br.items.map(u => ({
        id: u.id,
        name: u.name,
        acronym: u.acronym || null,
        city: u.city || null,
        state: u.state || null,
      }))
      setResults(mapped)
      // Mantém aberto enquanto o campo estiver focado, mesmo com query vazia
      setOpen(focused)
    }, 250)
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
    }
  }, [query, focused])

  // Fecha ao clicar fora
  useEffect(() => {
    function handleDocClick(ev: MouseEvent | TouchEvent) {
      const el = wrapperRef.current
      if (!el) return
      const target = ev.target as Node | null
      if (target && !el.contains(target)) {
        setOpen(false)
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handleDocClick)
    document.addEventListener('touchstart', handleDocClick)
    return () => {
      document.removeEventListener('mousedown', handleDocClick)
      document.removeEventListener('touchstart', handleDocClick)
    }
  }, [])

  const selectedLabel = useMemo(() => {
    const found = results.find((c) => c.id === value)
    return found ? displayCollege(found) : ''
  }, [results, value])

  async function handleSelect(c: College) {
    // Tentar localizar no banco local por nome exato (case-insensitive)
    const local = await collegesService.search(c.name, 5)
    const exact = local.items.find(item => (item.name || '').trim().toLowerCase() === (c.name || '').trim().toLowerCase())
    if (exact) {
      onChange(exact.id)
    } else {
      // Criar no banco local e retornar o id
      try {
        const created = await collegesService.create({ name: c.name, acronym: c.acronym || undefined, city: c.city || undefined, state: c.state || undefined })
        onChange(created.id)
      } catch (err) {
        // Em caso de conflito (já existe), buscar novamente para obter o id
        const retry = await collegesService.search(c.name, 5)
        const match = retry.items.find(item => (item.name || '').trim().toLowerCase() === (c.name || '').trim().toLowerCase())
        if (match) onChange(match.id)
      }
    }
    setQuery(displayCollege(c))
    setOpen(false)
  }

  function handleCreate() {
    const name = query.trim()
    if (!name) return
    onCreateRequested?.(name)
  }

  return (
    <Wrapper ref={wrapperRef}>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { setFocused(true); setOpen(true) }}
        placeholder={placeholder}
        aria-label="Faculdade"
      />
      {open && (
        <Suggestions role="listbox">
          {results.map((c) => (
            <SuggestionItem key={c.id} onClick={() => handleSelect(c)}>
              <span><FaSearch /> {displayCollege(c)}</span>
              {(c.city || c.state) && <Pill>{[c.city, c.state].filter(Boolean).join(' / ')}</Pill>}
            </SuggestionItem>
          ))}
          {query.trim() && (
            <li>
              <CreateOption type="button" onClick={handleCreate} title="Criar nova faculdade">
                <FaPlus /> Criar "{query.trim()}"
              </CreateOption>
            </li>
          )}
        </Suggestions>
      )}
    </Wrapper>
  )
}