'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { PhoneFrame, AuiExplainer } from '@/components/aui'
import type { OSType } from '@/components/aui'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Phone,
  VideoCamera,
  ChatCircle,
  CaretRight,
  MagnifyingGlass,
  Star,
  User,
  Clock,
  SquaresFour,
  Voicemail,
  Plus,
} from '@phosphor-icons/react'

/** Samsung One UI–style blue for links / tab selection */
const SAMSUNG_UI_BLUE = '#1C73E8'

type ViewState =
  | 'list'
  | 'contact-known'
  | 'contact-unknown'
  | 'contact-first'
  | 'contact-regular'

const contacts = [
  { id: 'ran', name: 'Ran', type: 'known' as const, lastCall: '3 weeks ago' },
  { id: 'unknown', name: '+972 52 000 0000', type: 'unknown' as const, lastCall: 'Yesterday' },
  { id: 'dr-cohen', name: 'Dr. Cohen', type: 'first' as const, lastCall: 'Never' },
  { id: 'noa', name: 'Noa', type: 'regular' as const, lastCall: '2 days ago' },
  { id: 'david', name: 'David', type: 'regular' as const, lastCall: 'Yesterday' },
  { id: 'mum', name: 'Mum', type: 'regular' as const, lastCall: 'Yesterday' },
]

export default function BeforeTheCallClient() {
  const router = useRouter()
  const [os, setOs] = useState<OSType>('ios')
  const [view, setView] = useState<ViewState>('list')
  const [selectedContact, setSelectedContact] = useState<typeof contacts[0] | null>(null)
  const [explainerOpen, setExplainerOpen] = useState(false)

  const handleCall = () => {
    router.push('/prototypes/during')
  }

  const handleContactTap = (contact: typeof contacts[0]) => {
    setSelectedContact(contact)
    if (contact.type === 'known') {
      setView('contact-known')
    } else if (contact.type === 'unknown') {
      setView('contact-unknown')
    } else if (contact.type === 'first') {
      setView('contact-first')
    } else {
      setView('contact-regular')
    }
  }

  const handleBack = () => {
    setView('list')
    setSelectedContact(null)
  }

  const stageLabels: Record<ViewState, string> = {
    list: 'Contacts List',
    'contact-known': 'Known Contact · Context Strip',
    'contact-unknown': 'Unknown Number · Context Strip',
    'contact-first': 'First Time Contact · Context Strip',
    'contact-regular': 'Saved Contact · AI Context Strip',
  }

  return (
    <main className="min-h-screen bg-[var(--aui-space)] flex items-center justify-center py-4 md:py-8 overflow-hidden">
      <PhoneFrame os={os} onOsChange={setOs} stageLabel={stageLabels[view]}>
        <div className="relative h-full min-h-0 flex flex-col flex-1">
          <div className="h-full min-h-0 flex flex-col flex-1">
            {view === 'list' ? (
              <ContactsList os={os} onContactTap={handleContactTap} />
            ) : (
              <ContactDetail
                os={os}
                contact={selectedContact!}
                onBack={handleBack}
                onExplain={() => setExplainerOpen(true)}
                onCall={handleCall}
              />
            )}
          </div>
          <AuiExplainer open={explainerOpen} onOpenChange={setExplainerOpen} />
        </div>
      </PhoneFrame>

    </main>
  )
}

function contactSectionLetter(c: (typeof contacts)[0]): string {
  const ch = c.name.charAt(0)
  if (/[A-Za-z]/.test(ch)) return ch.toUpperCase()
  return '#'
}

function ContactsList({
  os,
  onContactTap,
}: {
  os: OSType
  onContactTap: (contact: typeof contacts[0]) => void
}) {
  const isIos = os === 'ios'

  const sections = [...new Set(contacts.map(contactSectionLetter))].sort((a, b) => {
    if (a === '#') return 1
    if (b === '#') return -1
    return a.localeCompare(b)
  })

  return (
    <div
      className={`flex-1 flex flex-col min-h-0 ${
        isIos ? 'bg-[#F2F2F7]' : 'bg-[#F2F2F2]'
      }`}
    >
      {isIos ? (
        <>
          <div className="bg-white px-4 pt-2 pb-1 shrink-0">
            <h1
              className="text-[34px] font-bold tracking-tight text-black leading-[1.05]"
              style={{ fontFamily: 'var(--font-ios)' }}
            >
              Contacts
            </h1>
          </div>
          <div className="bg-white px-4 pb-3 shrink-0">
            <div className="flex items-center gap-2.5 px-3 py-2 bg-[rgba(118,118,128,0.12)] rounded-[10px]">
              <MagnifyingGlass size={17} weight="bold" className="text-[#8E8E93] shrink-0" />
              <span
                className="text-[17px] text-[#8E8E93]"
                style={{ fontFamily: 'var(--font-ios)' }}
              >
                Search
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white shrink-0 px-4 pt-3 pb-3 border-b border-black/[0.06]">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h1
              className="text-[19px] font-semibold text-black tracking-tight"
              style={{ fontFamily: 'var(--font-samsung)' }}
            >
              Contacts
            </h1>
            <button
              type="button"
              className="p-1.5 rounded-full text-[#1C73E8] active:bg-black/[0.04]"
              aria-label="Create contact"
            >
              <Plus size={24} weight="regular" />
            </button>
          </div>
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#EEEEEE] rounded-full">
            <MagnifyingGlass size={18} weight="bold" className="text-black/40 shrink-0" />
            <span
              className="text-[15px] text-black/45"
              style={{ fontFamily: 'var(--font-samsung)' }}
            >
              Search contacts
            </span>
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden relative">
        {isIos && (
          <div
            className="absolute right-0 top-3 bottom-20 flex flex-col justify-center text-[10px] text-[#007AFF] font-semibold z-10 pointer-events-none select-none"
            style={{ fontFamily: 'var(--font-ios)' }}
          >
            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('').map((letter) => (
              <span key={letter} className="px-1 py-[1px] leading-[11px]">
                {letter}
              </span>
            ))}
          </div>
        )}

        <div className={isIos ? 'px-3 pr-5 pb-2' : 'px-0 pb-1'}>
          {sections.map((section) => (
            <div key={section} className={isIos ? 'mb-2' : 'mb-0'}>
              <div
                className={
                  isIos
                    ? 'px-4 py-1.5 bg-transparent text-[13px] font-semibold text-[#8E8E93] tracking-wide'
                    : 'px-4 py-2 bg-[#EDEDED] text-[12px] font-semibold text-black/55'
                }
                style={{ fontFamily: isIos ? 'var(--font-ios)' : 'var(--font-samsung)' }}
              >
                {section}
              </div>
              <div
                className={
                  isIos
                    ? 'bg-white rounded-[10px] overflow-hidden shadow-[0_0.5px_0_rgba(0,0,0,0.08)] divide-y divide-[#C6C6C8]/45'
                    : 'bg-white divide-y divide-black/[0.07]'
                }
              >
                {contacts
                  .filter((c) => contactSectionLetter(c) === section)
                  .map((contact) => (
                    <ContactRow
                      key={contact.id}
                      contact={contact}
                      os={os}
                      onTap={() => onContactTap(contact)}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomTabBar os={os} activeTab="contacts" />
    </div>
  )
}

function ContactRow({
  contact,
  os,
  onTap,
}: {
  contact: typeof contacts[0]
  os: OSType
  onTap: () => void
}) {
  const isIos = os === 'ios'
  const isUnknown = contact.type === 'unknown'

  return (
    <button
      type="button"
      onClick={onTap}
      className={`w-full flex items-center justify-between text-left transition-colors ${
        isIos
          ? 'h-[44px] pl-[15px] pr-3 bg-white active:bg-[#E5E5EA]'
          : 'h-[52px] px-4 bg-white active:bg-black/[0.04]'
      }`}
    >
      <span
        className={`${
          isIos ? 'text-[17px] leading-tight' : 'text-[16px] font-normal leading-snug'
        } text-black`}
        style={{ 
          fontFamily: isUnknown ? 'var(--font-geist-mono)' : (isIos ? 'var(--font-ios)' : 'var(--font-samsung)'),
          fontSize: isUnknown ? '14px' : undefined
        }}
      >
        {contact.name}
      </span>
      {isIos && <CaretRight size={14} weight="bold" className="text-[#C7C7CC]" />}
    </button>
  )
}

function ContactDetail({
  os,
  contact,
  onBack,
  onExplain,
  onCall,
}: {
  os: OSType
  contact: typeof contacts[0]
  onBack: () => void
  onExplain: () => void
  onCall: () => void
}) {
  const isIos = os === 'ios'
  const [showStrip, setShowStrip] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowStrip(true), 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`flex-1 flex flex-col min-h-0 ${isIos ? 'bg-[#F2F2F7]' : 'bg-[#F2F2F2]'}`}>
      <div className={`shrink-0 ${isIos ? 'bg-white/80 backdrop-blur-md' : 'bg-white border-b border-black/[0.06]'}`}>
        <button
          type="button"
          onClick={onBack}
          className={`flex items-center gap-0.5 px-3 py-2.5 ${
            isIos ? 'text-[#007AFF]' : 'text-[#1C73E8]'
          }`}
          style={{ fontFamily: isIos ? 'var(--font-ios)' : 'var(--font-samsung)' }}
        >
          <CaretRight size={isIos ? 20 : 22} weight="bold" className="rotate-180 -ml-0.5" />
          <span className={isIos ? 'text-[17px]' : 'text-[16px] font-medium'}>Contacts</span>
        </button>
      </div>

      <div
        className={`flex flex-col items-center shrink-0 ${
          isIos ? 'bg-white px-4 pt-2 pb-6' : 'bg-white px-5 pt-5 pb-6'
        }`}
      >
        <Avatar className={isIos ? 'w-24 h-24 mb-3' : 'w-[88px] h-[88px] mb-4'}>
          <AvatarFallback
            className={`font-medium ${
              contact.type === 'unknown'
                ? 'bg-[#E5E5EA] text-[#8E8E93] text-3xl'
                : isIos
                  ? 'bg-[#C7C7CC] text-white text-3xl'
                  : 'bg-[#5B8DEF] text-white text-[32px]'
            }`}
            style={{ fontFamily: isIos ? 'var(--font-ios)' : 'var(--font-samsung)' }}
          >
            {contact.type === 'unknown'
              ? '#'
              : contact.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <h2
          className={`text-black ${
            isIos ? 'text-[24px] font-medium mb-5' : 'text-[28px] font-semibold tracking-tight mb-1'
          }`}
          style={{ fontFamily: isIos ? 'var(--font-ios)' : 'var(--font-samsung)' }}
        >
          {contact.name}
        </h2>
        {!isIos && contact.type !== 'unknown' && (
          <p
            className="text-[14px] text-black/45 mb-5"
            style={{ fontFamily: 'var(--font-samsung)' }}
          >
            Mobile
          </p>
        )}

        <div className={`flex ${isIos ? 'gap-8' : 'gap-10'}`}>
          <ActionButton icon={<Phone size={24} weight="fill" />} label="call" os={os} primary onClick={onCall} />
          <ActionButton icon={<ChatCircle size={24} />} label="message" os={os} />
          <ActionButton icon={<VideoCamera size={24} />} label="video" os={os} />
        </div>
      </div>

      <div
        className={`
          flex-1 min-h-0 overflow-y-auto px-4 py-4 transition-all duration-300 ease-out
          ${showStrip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
        `}
      >
        <ContextStrip contact={contact} onExplain={onExplain} />
      </div>

      <BottomTabBar os={os} activeTab="contacts" />
    </div>
  )
}

function ActionButton({
  icon,
  label,
  os,
  primary = false,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  os: OSType
  primary?: boolean
  onClick?: () => void
}) {
  const isIos = os === 'ios'
  const activeColor = isIos ? 'text-[#007AFF]' : 'text-[#1C73E8]'

  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-1.5">
      <div
        className={`rounded-full flex items-center justify-center ${
          isIos ? 'w-14 h-14' : 'w-[52px] h-[52px]'
        } ${
          primary
            ? 'bg-[#34C759] text-white shadow-[0_2px_8px_rgba(52,199,89,0.35)]'
            : isIos
              ? 'bg-[#F2F2F7] ' + activeColor
              : 'bg-[#ECECEC] ' + activeColor
        }`}
      >
        {icon}
      </div>
      <span
        className={`${isIos ? 'text-[11px]' : 'text-[12px] font-medium'} ${
          primary ? 'text-[#34C759]' : activeColor
        }`}
        style={{ fontFamily: isIos ? 'var(--font-ios)' : 'var(--font-samsung)' }}
      >
        {label}
      </span>
    </button>
  )
}

const regularContextById: Record<string, { body: ReactNode; footer: string }> = {
  noa: {
    body: (
      <>
        Quick catch-up last week — you both mentioned the{' '}
        <em className="not-italic font-medium text-white">Friday design handoff</em>.
        <br />
        <span className="text-[13px] mt-2 block text-[rgba(255,255,255,0.65)]">
          She usually replies faster on Slack after lunch.
        </span>
      </>
    ),
    footer: 'From recent calls and threads · 2 days ago',
  },
  david: {
    body: (
      <>
        Often free for calls{' '}
        <em className="not-italic font-medium text-white">after 6pm</em>. Last time you
        compared notes on the{' '}
        <em className="not-italic font-medium text-white">lease renewal</em>.
      </>
    ),
    footer: 'From call history and calendar availability',
  },
  mum: {
    body: (
      <>
        <em className="not-italic font-medium text-white">Priority contact</em> — most
        calls are short check-ins weekday mornings when you&apos;re both free.
      </>
    ),
    footer: 'From call patterns and your labeled relationships',
  },
}

function ContextStrip({
  contact,
  onExplain,
}: {
  contact: (typeof contacts)[0]
  onExplain: () => void
}) {
  const content = {
    known: {
      body: (
        <>
          You haven&apos;t spoken since March. Last time you talked about the{' '}
          <em className="not-italic font-medium text-white">
            apartment renovation
          </em>
          .
        </>
      ),
      footer: 'From your last call · 3 weeks ago',
    },
    unknown: {
      body: (
        <>
          This looks like a{' '}
          <em className="not-italic font-medium text-white">
            local dental clinic
          </em>
          .
          <br />
          <span className="flex items-center gap-1 mt-2">
            {[...Array(4)].map((_, i) => (
              <Star key={i} size={11} weight="fill" className="text-[#FFD60A]" />
            ))}
            <Star size={11} weight="regular" className="text-[#FFD60A]" />
            <span className="text-[12px] ml-1.5 text-[rgba(255,255,255,0.6)]">4.2 · Usually picks up quickly</span>
          </span>
        </>
      ),
      footer: 'Matched from public business directory',
    },
    first: {
      body: (
        <>
          First time calling.{' '}
          <em className="not-italic font-medium text-white">
            Specialist at Ichilov Hospital
          </em>
          .
          <br />
          <span className="text-[13px] mt-2 block text-[rgba(255,255,255,0.7)]">
            Mutual connection:{' '}
            <em className="not-italic font-medium text-white">
              Yael Cohen
            </em>
          </span>
        </>
      ),
      footer: 'From shared contacts and calendar events',
    },
  }

  const data =
    contact.type === 'regular'
      ? regularContextById[contact.id]
      : content[contact.type]

  if (!data) return null

  return (
    <div className="bg-[#1a1a1a] border border-[var(--aui-fire)]/25 rounded-2xl p-4 shadow-lg animate-[slideUp_0.28s_ease-out_both]">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[var(--aui-fire)] flex items-center justify-center flex-shrink-0">
          {/* Sparkle icon - matches During call AI button */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z" fill="white"/>
            <circle cx="18" cy="5" r="1.5" fill="white" fillOpacity="0.7"/>
            <circle cx="6" cy="17" r="1" fill="white" fillOpacity="0.5"/>
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span 
              className="text-[10px] uppercase tracking-[0.1em] text-[var(--aui-fire)] font-medium"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              AI CONTEXT
            </span>
            <button 
              onClick={onExplain}
              className="text-[10px] text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.6)]"
            >
              ?
            </button>
          </div>
          <p 
            className="text-[14px] font-light text-[rgba(255,255,255,0.8)] leading-[1.5]"
            style={{ fontFamily: 'var(--font-geist-sans)' }}
          >
            {data.body}
          </p>
          <p 
            className="text-[10px] text-[rgba(255,255,255,0.4)] mt-3 tracking-wide"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            {data.footer}
          </p>
        </div>
      </div>
    </div>
  )
}

function BottomTabBar({
  os,
  activeTab,
}: {
  os: OSType
  activeTab: 'favorites' | 'recents' | 'contacts' | 'keypad' | 'voicemail'
}) {
  const isIos = os === 'ios'
  const activeColor = isIos ? '#007AFF' : SAMSUNG_UI_BLUE
  const inactiveColor = isIos ? '#8E8E93' : '#737373'

  const iosTabs = [
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'recents', label: 'Recents', icon: Clock },
    { id: 'contacts', label: 'Contacts', icon: User },
    { id: 'keypad', label: 'Keypad', icon: SquaresFour },
    { id: 'voicemail', label: 'Voicemail', icon: Voicemail },
  ]

  const samsungTabs = [
    { id: 'keypad', label: 'Keypad', icon: SquaresFour },
    { id: 'recents', label: 'Recents', icon: Clock },
    { id: 'contacts', label: 'Contacts', icon: User },
  ]

  const tabs = isIos ? iosTabs : samsungTabs

  return (
    <div
      className={`flex shrink-0 w-full min-w-0 items-stretch justify-around border-t box-border isolate overflow-hidden ${
        isIos
          ? 'bg-[rgba(249,249,249,0.94)] backdrop-blur-xl border-[rgba(0,0,0,0.08)] h-[76px] pt-1.5 pb-2.5'
          : 'bg-white border-black/[0.08] pt-1.5 pb-[max(10px,env(safe-area-inset-bottom,0px))] min-h-[56px]'
      }`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            type="button"
            key={tab.id}
            className={`flex min-w-0 flex-1 max-w-[22%] flex-col items-center justify-end gap-0.5 px-0.5 ${
              isIos ? '' : 'py-0.5'
            }`}
          >
            <tab.icon
              size={isIos ? 24 : 26}
              weight={isActive ? 'fill' : 'regular'}
              color={isActive ? activeColor : inactiveColor}
            />
            <span
              className={
                isIos
                  ? 'w-full truncate text-center text-[9px] leading-tight'
                  : 'text-[11px] font-medium tracking-tight'
              }
              style={{
                fontFamily: isIos ? 'var(--font-ios)' : 'var(--font-samsung)',
                color: isActive ? activeColor : inactiveColor,
              }}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
