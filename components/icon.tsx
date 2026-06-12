import {
  ArrowLeft,
  ChevronRight,
  Check,
  CheckCircle,
  X,
  Search,
  Plus,
  Building,
  Clipboard,
  Euro,
  Tag,
  Wallet,
  AlertCircle,
  Info,
  Sparkles,
  Pencil,
  Settings,
  FileText,
  Trash,
  FileUp,
  type LucideProps,
} from 'lucide-react';

export type IconName =
  | 'arrowLeft'
  | 'chevronRight'
  | 'check'
  | 'checkCircle'
  | 'x'
  | 'search'
  | 'plus'
  | 'building'
  | 'clipboard'
  | 'euro'
  | 'tag'
  | 'wallet'
  | 'alertCircle'
  | 'info'
  | 'sparkles'
  | 'pencil'
  | 'settings'
  | 'fileText'
  | 'trash'
  | 'edit2'
  | 'fileUp';

const ICONS: Record<IconName, React.ComponentType<LucideProps>> = {
  arrowLeft: ArrowLeft,
  chevronRight: ChevronRight,
  check: Check,
  checkCircle: CheckCircle,
  x: X,
  search: Search,
  plus: Plus,
  building: Building,
  clipboard: Clipboard,
  euro: Euro,
  tag: Tag,
  wallet: Wallet,
  alertCircle: AlertCircle,
  info: Info,
  sparkles: Sparkles,
  pencil: Pencil,
  settings: Settings,
  fileText: FileText,
  trash: Trash,
  edit2: Pencil,
  fileUp: FileUp,
};

export function Icon({ name, size = 20, className, style }: { name: IconName } & LucideProps) {
  const Cmp = ICONS[name];
  return <Cmp size={size} className={className} style={style} strokeWidth={1.8} />;
}
