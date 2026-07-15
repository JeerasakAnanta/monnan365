import {
  Sparkles,
  Leaf,
  Map,
  Calendar,
  Mountain,
  Landmark,
  Waves,
  ScrollText,
  Target,
  Thermometer,
  Ruler,
  Car,
  CalendarDays,
  CircleDollarSign,
  Loader2,
  Snowflake,
  Sun,
  CloudRain,
  Sunrise,
  Lightbulb,
  Clock,
  Phone,
  BookOpen,
  AlertTriangle,
  Mail,
  MapPin,
  Menu,
  X,
  Check,
  Handshake,
  Castle,
  Share2,
  Printer,
  Settings,
  Eye,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

function SaltIcon({ size = 24, color = "currentColor", strokeWidth = 2, ...rest }: LucideProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}

function RiceTerraceIcon({ size = 24, color = "currentColor", strokeWidth = 2, ...rest }: LucideProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <path d="M2 22L12 2l10 20" />
      <path d="M5 18h14" />
      <path d="M8 14h8" />
      <path d="M10 10h4" />
    </svg>
  );
}

function BambooIcon({ size = 24, color = "currentColor", strokeWidth = 2, ...rest }: LucideProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <path d="M12 2v20" />
      <path d="M12 6h4" />
      <path d="M12 6H8" />
      <path d="M12 12h4" />
      <path d="M12 12H8" />
      <path d="M12 18h4" />
      <path d="M12 18H8" />
      <path d="M16 4c1 1 1 3 0 4" />
      <path d="M8 4c-1 1-1 3 0 4" />
    </svg>
  );
}

function AutumnLeafIcon({ size = 24, color = "currentColor", strokeWidth = 2, ...rest }: LucideProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  sparkles: Sparkles,
  leaf: Leaf,
  map: Map,
  calendar: Calendar,
  mountain: Mountain,
  temple: Landmark,
  salt: SaltIcon,
  rice: RiceTerraceIcon,
  bamboo: BambooIcon,
  waves: Waves,
  scroll: ScrollText,
  castle: Castle,
  target: Target,
  handshake: Handshake,
  thermometer: Thermometer,
  ruler: Ruler,
  car: Car,
  "calendar-days": CalendarDays,
  "circle-dollar-sign": CircleDollarSign,
  loader: Loader2,
  snowflake: Snowflake,
  sun: Sun,
  "cloud-rain": CloudRain,
  "autumn-leaf": AutumnLeafIcon,
  sunrise: Sunrise,
  lightbulb: Lightbulb,
  clock: Clock,
  phone: Phone,
  "book-open": BookOpen,
  "alert-triangle": AlertTriangle,
  mail: Mail,
  "map-pin": MapPin,
  menu: Menu,
  x: X,
  check: Check,
  share: Share2,
  printer: Printer,
  settings: Settings,
  eye: Eye,
};

export type IconName = keyof typeof ICON_MAP;

export function NanIcon({ name, className, ...props }: { name: IconName } & LucideProps) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon className={className} {...props} />;
}
