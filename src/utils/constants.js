export const SPORT_TYPES = [
  { value: 'football',    label: 'Football',    emoji: '⚽' },
  { value: 'cricket',     label: 'Cricket',     emoji: '🏏' },
  { value: 'badminton',   label: 'Badminton',   emoji: '🏸' },
  { value: 'tennis',      label: 'Tennis',      emoji: '🎾' },
  { value: 'basketball',  label: 'Basketball',  emoji: '🏀' },
  { value: 'volleyball',  label: 'Volleyball',  emoji: '🏐' },
  { value: 'swimming',    label: 'Swimming',    emoji: '🏊' },
  { value: 'kabaddi',     label: 'Kabaddi',     emoji: '🤼' },
  { value: 'hockey',      label: 'Hockey',      emoji: '🏑' },
];

export const SKILL_LEVELS = [
  { value: 'beginner',     label: 'Beginner',     color: 'text-green-600 bg-green-50' },
  { value: 'intermediate', label: 'Intermediate',  color: 'text-blue-600 bg-blue-50'  },
  { value: 'advanced',     label: 'Advanced',      color: 'text-purple-600 bg-purple-50' },
];

export const VENUE_TYPES = [
  { value: 'indoor',  label: 'Indoor'  },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'both',    label: 'Both'    },
];

export const AMENITIES = [
  'parking', 'washroom', 'floodlights', 'drinking_water',
  'changing_room', 'cafeteria', 'air_conditioning', 'first_aid',
];

export const AVAILABILITY_STATUS = [
  { value: 'available_today', label: 'Available Today'  },
  { value: 'this_week',       label: 'Available This Week' },
  { value: 'weekends_only',   label: 'Weekends Only'    },
  { value: 'unavailable',     label: 'Unavailable'      },
];

export const BOOKING_STATUS_MAP = {
  pending:   { label: 'Pending',   color: 'badge-yellow' },
  confirmed: { label: 'Confirmed', color: 'badge-green'  },
  cancelled: { label: 'Cancelled', color: 'badge-red'    },
  completed: { label: 'Completed', color: 'badge-blue'   },
  no_show:   { label: 'No Show',   color: 'badge-gray'   },
};

export const GAME_STATUS_MAP = {
  open:      { label: 'Open',      color: 'badge-green'  },
  full:      { label: 'Full',      color: 'badge-blue'   },
  started:   { label: 'Started',   color: 'badge-yellow' },
  completed: { label: 'Completed', color: 'badge-gray'   },
  cancelled: { label: 'Cancelled', color: 'badge-red'    },
};

export const RADIUS_OPTIONS = [
  { value: 5,  label: '5 km'  },
  { value: 10, label: '10 km' },
  { value: 20, label: '20 km' },
  { value: 50, label: '50 km' },
];

export const ROLES = {
  PLAYER:     'player',
  TURF_OWNER: 'turf_owner',
  TRAINER:    'trainer',
  ORGANIZER:  'organizer',
  ADMIN:      'admin',
};
