type IconProps = { className?: string };

const base =
  (path: React.ReactNode) =>
  ({ className = "h-[18px] w-[18px]" }: IconProps) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {path}
    </svg>
  );

export const HomeIcon = base(<path d="m3 11 9-8 9 8M5 10v10h14V10" />);
export const BookIcon = base(
  <>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
  </>
);
export const MapIcon = base(
  <>
    <path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z" />
    <path d="M9 3v15M15 6v15" />
  </>
);
export const VideoIcon = base(
  <>
    <rect x="2" y="5" width="14" height="14" rx="2" />
    <path d="m22 8-6 4 6 4V8Z" />
  </>
);
export const ClipboardIcon = base(
  <>
    <rect x="5" y="4" width="14" height="17" rx="2" />
    <path d="M9 2h6a1 1 0 0 1 1 1v2H8V3a1 1 0 0 1 1-1ZM8 10h8M8 14h8M8 18h5" />
  </>
);
export const AwardIcon = base(
  <>
    <circle cx="12" cy="8" r="6" />
    <path d="m9 14-1.5 7L12 19l4.5 2L15 14" />
  </>
);
export const CreditCardIcon = base(
  <>
    <rect x="2" y="5" width="20" height="15" rx="2" />
    <path d="M2 10h20" />
  </>
);
export const GearIcon = base(
  <>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M19.4 13.5a7.7 7.7 0 0 0 0-3l2-1.5-2-3.4-2.3.9a7.6 7.6 0 0 0-2.6-1.5L14 2h-4l-.5 2.5a7.6 7.6 0 0 0-2.6 1.5l-2.3-.9-2 3.4 2 1.5a7.7 7.7 0 0 0 0 3l-2 1.5 2 3.4 2.3-.9c.77.66 1.65 1.17 2.6 1.5L10 22h4l.5-2.5a7.6 7.6 0 0 0 2.6-1.5l2.3.9 2-3.4-2-1.5Z" />
  </>
);
export const UsersIcon = base(
  <>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M2.5 20c.7-3.4 3.3-5.5 6.5-5.5s5.8 2.1 6.5 5.5" />
    <circle cx="17.5" cy="8.5" r="2.6" />
    <path d="M16 14.8c2.6.4 4.6 2.3 5.2 5.2" />
  </>
);
export const BriefcaseIcon = base(
  <>
    <rect x="2.5" y="7" width="19" height="13" rx="2" />
    <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M2.5 12.5h19" />
  </>
);
export const BarChartIcon = base(<path d="M4 20V10m6 10V4m6 16v-7m6 7v-3" />);
export const MegaphoneIcon = base(
  <>
    <path d="M3 11v2a2 2 0 0 0 2 2h1l2 6h2l-1-6h5l6 4V5l-6 4H6a2 2 0 0 0-2 2Z" />
  </>
);
export const TicketIcon = base(
  <>
    <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" />
  </>
);
export const CalendarIcon = base(
  <>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 10h18" />
  </>
);
export const SchoolIcon = base(
  <>
    <path d="m2 9 10-5 10 5-10 5-10-5Z" />
    <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v6" />
  </>
);
export const FileIcon = base(
  <>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
  </>
);
export const DollarIcon = base(
  <>
    <path d="M12 1v22M17 5.5c0-1.9-2.2-3-5-3s-5 1.3-5 3 2 2.7 5 3.3 5 1.7 5 3.4-2.2 3.3-5 3.3-5-1.1-5-3" />
  </>
);
export const AuditIcon = base(
  <>
    <path d="M9 11V6a3 3 0 0 1 6 0v5M5 11h14l-1 10H6L5 11Z" />
  </>
);

export const iconMap: Record<string, (p: IconProps) => React.JSX.Element> = {
  home: HomeIcon,
  book: BookIcon,
  map: MapIcon,
  video: VideoIcon,
  clipboard: ClipboardIcon,
  award: AwardIcon,
  card: CreditCardIcon,
  gear: GearIcon,
  users: UsersIcon,
  briefcase: BriefcaseIcon,
  chart: BarChartIcon,
  megaphone: MegaphoneIcon,
  ticket: TicketIcon,
  calendar: CalendarIcon,
  school: SchoolIcon,
  file: FileIcon,
  dollar: DollarIcon,
  audit: AuditIcon,
};
