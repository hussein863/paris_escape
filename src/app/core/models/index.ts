// ─── Auth ────────────────────────────────────────────────────────────────────
export interface AuthTokens {
  access: string;
  refresh: string;
}

// ─── User ────────────────────────────────────────────────────────────────────
export type UserRole = 'Customer' | 'Guide' | 'Business' | 'Admin';
export type UserStatus = 'Active' | 'Suspended' | 'KYC Pending';

export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  avatar: string | null;
  avatar_url: string | null;   // absolute URL returned by backend
  role: UserRole;
  status: UserStatus;
  country: string;
  city: string;
  preferred_language: string;
  currency: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  registration_date: string;
  guide_profile?: Guide;
}

export interface Guide {
  id: number;
  pronouns: string;
  headline: string;
  bio: string;
  cover_image: string | null;
  years_of_experience: number;
  is_verified: boolean;
  is_original: boolean;
  rating: number;
  review_count: number;
  total_tours: number;
  response_time: string;
  meeting_point_name: string;
  meeting_point_address: string;
  pickup_options: string;
  accessibility: string;
  languages: GuideLanguage[];
  specialties: GuideSpecialty[];
}

export interface GuideLanguage {
  id: number;
  name: string;
  level: 'Native' | 'Fluent' | 'Conversational' | 'Basic';
}

export interface GuideSpecialty {
  id: number;
  name: string;
}

// ─── Experience ───────────────────────────────────────────────────────────────
export type ExperienceStatus = 'Draft' | 'Pending' | 'Active' | 'Paused' | 'Under Review' | 'Refused';
export type ExperienceDifficulty = 'Easy' | 'Moderate' | 'Hard';
export type PricingModel = 'per-person' | 'private';

export interface Experience {
  id: number;
  guide: number;
  title: string;
  short_description: string;
  long_description: string;
  highlights: string[];
  category: string;
  subcategory: string;
  tags: string[];
  difficulty: ExperienceDifficulty;
  duration_value: number;
  duration_unit: 'minutes' | 'hours' | 'days';
  languages: string[];
  group_size_min: number;
  group_size_max: number;
  max_people: number;
  stroller_friendly: boolean;
  wheelchair_accessible: boolean;
  has_min_age: boolean;
  min_age: number | null;
  has_max_age: boolean;
  max_age: number | null;
  base_price: number;
  currency: string;
  pricing_model: PricingModel;
  child_pricing_enabled: boolean;
  child_price: number;
  child_age_range: string;
  image: string | null;
  status: ExperienceStatus;
  views: number;
  bookings: number;
  rating: number;
  review_count: number;
  created_date: string;
  updated_date: string;
  published_date: string | null;
  media?: ExperienceMedia[];
  inclusions?: ExperienceInclusion[];
  itinerary?: ExperienceItineraryItem[];
  options?: ExperienceOption[];
  availability?: ExperienceAvailability;
  policy?: ExperiencePolicy;
}

export interface ExperienceMedia {
  id: number;
  type: 'image' | 'video';
  url: string;
  caption: string;
  is_cover_image: boolean;
  ordering: number;
}

export interface ExperienceInclusion {
  id: number;
  text: string;
  type: 'included' | 'not-included' | 'to-bring';
  ordering: number;
}

export interface ExperienceItineraryItem {
  id: number;
  order: number;
  title: string;
  duration: string;
  description: string;
}

export interface ExperienceOption {
  id: number;
  title: string;
  description: string;
  icon: string;
  price: number;
  pricing_type: 'per-person' | 'per-booking';
}

export interface ExperienceAvailability {
  id: number;
  recurring_pattern: 'daily' | 'weekends' | 'custom';
  minimum_notice: string;
  same_day_cutoff: string | null;
  google_calendar_connected: boolean;
  ical_connected: boolean;
  time_slots: TimeSlot[];
}

export interface TimeSlot {
  id: number;
  time: string;
  label: string;
}

export interface ExperiencePolicy {
  id: number;
  cancellation_window: '24-hours' | '48-hours' | '72-hours';
  late_arrival_policy: string;
  no_show_policy: string;
  weather_policy: string;
  safety_notes: string;
  insurance_coverage: boolean;
  emergency_procedures: boolean;
  photography_consent: boolean;
}

// ─── Booking ──────────────────────────────────────────────────────────────────
export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'Disputed';

export interface Booking {
  id: number;
  booking_ref: string;
  experience: number;
  experience_title?: string;
  experience_image?: string;
  customer: number;
  customer_name?: string;
  customer_email?: string;
  guide: number;
  guide_name?: string;
  guide_avatar?: string;
  date: string;
  time: string;
  time_zone: string;
  status: BookingStatus;
  adults: number;
  children: number;
  base_price: number;
  addons_total: number;
  subtotal: number;
  service_fee: number;
  taxes: number;
  total_amount: number;
  cancellation_deadline: string | null;
  created_date: string;
  modified_date: string;
  addons?: BookingAddon[];
  detail?: BookingDetail;
}

export interface BookingAddon {
  id: number;
  option: number;
  name: string;
  price: number;
  quantity: number;
}

export interface BookingDetail {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_code: string;
  phone_number: string;
  country: string;
  special_requests: string;
  accept_terms: boolean;
  receive_updates: boolean;
}

// ─── Review ───────────────────────────────────────────────────────────────────
export interface Review {
  id: number;
  booking: number;
  experience: number;
  experience_title?: string;
  experience_image?: string | null;
  guide: number;
  customer: number;
  customer_name: string;
  customer_avatar?: string | null;
  rating: number;
  content: string;
  language: string;
  verified: boolean;
  photos: string[];
  helpful: number;
  date: string;
  reply?: ReviewReply;
}

export interface ReviewReply {
  id: number;
  guide: number;
  content: string;
  date: string;
  last_edited: string | null;
}

// ─── Messaging ────────────────────────────────────────────────────────────────
export interface Conversation {
  id: number;
  customer: number;
  guide: number;
  guide_name?: string;
  guide_avatar?: string;
  customer_name?: string;
  customer_avatar?: string;
  experience?: number | null;
  experience_id?: number | null;
  experience_title?: string | null;
  experience_image?: string | null;
  experience_price?: number | null;
  experience_duration?: string | null;
  booking: number | null;
  status: 'Confirmed' | 'Pending' | 'Pre-contact' | 'Open';
  last_message: string;
  last_message_at: string;
  messages?: Message[];
  is_unread?: boolean;
  is_archived?: boolean;
  is_flagged?: boolean;
}

export interface Message {
  id: number;
  conversation: number;
  sender: number;
  sender_type: 'Customer' | 'Guide';
  text: string;
  timestamp: string;
  read: boolean;
}

// ─── Plans & Subscriptions ────────────────────────────────────────────────────
export interface Plan {
  id: number;
  name: string;
  slug: 'free' | 'pro' | 'business';
  tagline: string;
  price_monthly: number;
  price_yearly: number;
  commission_rate: number;
  max_experiences: number | null;
  features: string[];
  is_active: boolean;
  is_popular: boolean;
  ordering: number;
}

export interface Subscription {
  id: number;
  guide: number;
  plan: Plan | null;
  billing_cycle: 'month' | 'year';
  status: 'Active' | 'Paused' | 'Cancelled';
  start_date: string;
  renewal_date: string;
  end_date: string | null;
}

// ─── Payments ─────────────────────────────────────────────────────────────────
export interface Payment {
  id: number;
  invoice_number: string;
  booking: number | null;
  user: number;
  type: 'Booking' | 'Commission' | 'Refund' | 'Subscription';
  date: string;
  amount: number;
  currency: string;
  status: 'Paid' | 'Unpaid' | 'Failed' | 'Pending' | 'Completed';
  method: string;
  description: string;
}

export interface Favorite {
  id: number;
  customer: number;
  experience: number;
  saved_at: string;
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
