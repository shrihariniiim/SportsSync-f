import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Dumbbell,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { SPORT_TYPES } from '../../utils/constants';

const navLinks = [
  { label: 'Explore', to: '#explore' },
  { label: 'Games', to: '#games' },
  { label: 'Trainers', to: '#trainers' },
  { label: 'Events', to: '#events' },
];

const stats = [
  { value: '15+', label: 'sports supported' },
  { value: '4', label: 'ways to play' },
  { value: '24/7', label: 'booking flow' },
];

const steps = [
  { icon: Search, title: 'Discover', text: 'Find venues, games, trainers, and events from one clean sports hub.' },
  { icon: CheckCircle2, title: 'Choose', text: 'Filter by sport, availability, location, and the experience you want.' },
  { icon: CalendarDays, title: 'Book', text: 'Reserve your slot or join a game with an account-backed booking flow.' },
  { icon: Trophy, title: 'Play', text: 'Show up ready with your squad, coach, organizer, or next opponent.' },
];

const trustSignals = [
  'Role-based dashboards for players, owners, trainers, organizers, and admins',
  'Secure account flow with persisted sessions',
  'Live app experience after login with Socket.IO updates',
];

function LandingNav() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/90 backdrop-blur-xl">
      <div className="page-container flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-xl font-bold text-forest">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest text-sm font-black text-white">SS</span>
          <span>SportSync</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.to}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-950"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login" className="btn-ghost btn-sm">Login</Link>
          <Link to="/register" className="btn-primary btn-sm">Get Started</Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 shadow-lg md:hidden">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.to}
                onClick={close}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
            <Link to="/login" onClick={close} className="btn-secondary btn-sm">Login</Link>
            <Link to="/register" onClick={close} className="btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default function Landing() {
  const popularSports = SPORT_TYPES.filter((sport) => (
    ['football', 'cricket', 'badminton', 'tennis', 'basketball', 'volleyball', 'swimming', 'kabaddi'].includes(sport.value)
  ));

  return (
    <div className="min-h-screen bg-white text-gray-950">
      <LandingNav />

      <main>
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,#dcfce7,transparent_34%),linear-gradient(135deg,#f8fafc_0%,#ffffff_46%,#ecfdf5_100%)]">
          <div className="page-container grid min-h-[calc(100vh-4rem)] items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-forest shadow-sm">
                <Sparkles size={14} />
                Book, join, train, and compete
              </div>
              <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-gray-950 sm:text-6xl lg:text-7xl">
                Find your game. Find your venue. Find your people.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                SportsSync brings venue discovery, open games, coaching, and events into one premium sports experience built for players and sports businesses.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/explore" className="btn-primary btn-lg">
                  Explore Venues <ArrowRight size={18} />
                </Link>
                <Link to="/games" className="btn-secondary btn-lg">
                  Join a Game <Users size={18} />
                </Link>
              </div>
              <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-lg border border-gray-100 bg-white/80 p-3 shadow-sm">
                    <div className="text-xl font-black text-forest">{item.value}</div>
                    <div className="mt-1 text-xs font-medium leading-4 text-gray-500">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -left-4 top-8 hidden rounded-lg bg-white p-4 shadow-card lg:block">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
                    <Zap size={20} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-gray-950">Game opens tonight</p>
                    <p className="text-xs text-gray-500">5 players looking for 3 more</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white bg-forest p-4 shadow-2xl">
                <div className="overflow-hidden rounded-[1.5rem] bg-gray-950">
                  <div className="grid min-h-[520px] grid-rows-[1fr_auto] bg-[linear-gradient(160deg,rgba(15,76,58,0.08),rgba(15,23,42,0.75)),url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center">
                    <div className="p-6 text-white">
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                        <MapPin size={13} />
                        Nearby sports are waiting
                      </div>
                    </div>
                    <div className="bg-gradient-to-t from-gray-950 via-gray-950/90 to-transparent p-6 text-white">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'Book a court', icon: MapPin },
                          { label: 'Join players', icon: Users },
                          { label: 'Find coaching', icon: Dumbbell },
                          { label: 'Enter events', icon: Trophy },
                        ].map(({ label, icon: Icon }) => (
                          <div key={label} className="rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur">
                            <Icon size={20} className="mb-3 text-primary-300" />
                            <p className="text-sm font-bold">{label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-3 bottom-12 hidden rounded-lg border border-gray-100 bg-white p-4 shadow-card lg:block">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Next slot</p>
                <p className="mt-1 text-sm font-black text-gray-950">7:00 PM - Football</p>
              </div>
            </div>
          </div>
        </section>

        <section id="explore" className="py-16 sm:py-20">
          <div className="page-container">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary-700">Popular Sports</p>
                <h2 className="mt-2 text-3xl font-black text-gray-950 sm:text-4xl">Choose your arena</h2>
              </div>
              <Link to="/explore" className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 hover:underline">
                Explore all venues <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              {popularSports.map((sport) => (
                <Link
                  key={sport.value}
                  to={`/explore?sport=${sport.value}`}
                  className="group flex min-h-32 flex-col justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-card"
                >
                  <span className="text-3xl">{sport.emoji}</span>
                  <span className="text-sm font-bold text-gray-900 group-hover:text-forest">{sport.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-950 py-16 text-white sm:py-20">
          <div className="page-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary-300">Venue Discovery</p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">Popular venues near you</h2>
              <p className="mt-4 text-base leading-7 text-gray-300">
                Venue listings are protected by the current SportsSync API, so the public landing page stays fast and stable while guiding guests into the authenticated discovery flow.
              </p>
              <Link to="/explore" className="btn-primary btn-lg mt-7">
                Explore Venues <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: MapPin, title: 'Nearby search', text: 'Use your location after login to surface relevant turfs and courts.' },
                { icon: CalendarDays, title: 'Slot-first booking', text: 'Move from venue choice to available time slots without extra noise.' },
                { icon: ShieldCheck, title: 'Trusted flow', text: 'Bookings, profiles, and payments stay behind authenticated sessions.' },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-lg border border-white/10 bg-white/10 p-5">
                  <Icon className="text-primary-300" size={24} />
                  <h3 className="mt-5 text-lg font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-300">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="games" className="py-16 sm:py-20">
          <div className="page-container grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="rounded-2xl bg-primary-50 p-6 sm:p-8">
              <div className="rounded-xl bg-white p-5 shadow-card">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-primary-700">Open games</p>
                    <h3 className="mt-1 text-xl font-black text-gray-950">Don't have a team?</h3>
                  </div>
                  <Users className="text-forest" size={28} />
                </div>
                <div className="mt-5 space-y-3">
                  {['Find players nearby', 'Join a sport-specific match', 'Create your own game'].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 text-sm font-semibold text-gray-700">
                      <CheckCircle2 size={18} className="text-primary-600" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary-700">Play Together</p>
              <h2 className="mt-2 text-3xl font-black text-gray-950 sm:text-4xl">Join a game near you.</h2>
              <p className="mt-4 text-base leading-7 text-gray-600">
                SportsSync is built for spontaneous play as much as planned bookings. Find open games, match by sport, and get onto the field faster.
              </p>
              <Link to="/games" className="btn-primary btn-lg mt-7">
                Find a Game <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section id="trainers" className="bg-gray-50 py-16 sm:py-20">
          <div className="page-container grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary-700">Training</p>
              <h2 className="mt-2 text-3xl font-black text-gray-950 sm:text-4xl">Train smarter with the right coach.</h2>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Whether you are picking up a sport or sharpening match fitness, SportsSync connects players with trainer profiles through the existing app experience.
              </p>
              <Link to="/trainers" className="btn-primary btn-lg mt-7">
                Find a Trainer <ArrowRight size={18} />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: 'Skill building', text: 'Find focused coaching for technique, fitness, and game IQ.' },
                { title: 'Sport-specific help', text: 'Explore trainers around the sports you actually play.' },
                { title: 'Player-first flow', text: 'Move from discovery to booking inside your authenticated profile.' },
                { title: 'Premium profiles', text: 'Give coaches a clean place to manage their training business.' },
              ].map((item) => (
                <div key={item.title} className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                  <Dumbbell className="text-forest" size={22} />
                  <h3 className="mt-4 text-lg font-black text-gray-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="events" className="py-16 sm:py-20">
          <div className="page-container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-wide text-primary-700">Events</p>
              <h2 className="mt-2 text-3xl font-black text-gray-950 sm:text-4xl">From casual games to organized competition.</h2>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Organizers get a dedicated dashboard for events, while players get a cleaner path into the sports community around them.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                { icon: Trophy, title: 'Host tournaments', text: 'Manage event creation through organizer tools.' },
                { icon: CalendarDays, title: 'Plan sports days', text: 'Coordinate dates, venues, and participation.' },
                { icon: Users, title: 'Build community', text: 'Turn local players into repeat participants.' },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
                  <Icon className="text-primary-700" size={24} />
                  <h3 className="mt-4 text-lg font-black text-gray-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary-50 py-16 sm:py-20">
          <div className="page-container">
            <div className="mb-10 max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-wide text-primary-700">How it works</p>
              <h2 className="mt-2 text-3xl font-black text-gray-950 sm:text-4xl">Four steps from idea to match time.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              {steps.map(({ icon: Icon, title, text }, index) => (
                <div key={title} className="rounded-lg border border-primary-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <Icon className="text-forest" size={24} />
                    <span className="text-sm font-black text-primary-700">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-black text-gray-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="page-container">
            <div className="grid gap-8 rounded-2xl bg-gray-950 p-6 text-white sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-primary-300">Ready to play?</p>
                <h2 className="mt-2 text-3xl font-black sm:text-4xl">Your next game is closer than you think.</h2>
                <div className="mt-6 grid gap-2 sm:grid-cols-3">
                  {trustSignals.map((signal) => (
                    <div key={signal} className="flex gap-2 text-sm leading-6 text-gray-300">
                      <CheckCircle2 className="mt-1 shrink-0 text-primary-300" size={16} />
                      <span>{signal}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link to="/explore" className="btn-primary btn-lg">
                  Explore Venues <ArrowRight size={18} />
                </Link>
                <Link to="/register" className="btn-secondary btn-lg">
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 bg-white py-10">
        <div className="page-container grid gap-8 md:grid-cols-[1.2fr_2fr]">
          <div>
            <a href="/" className="flex items-center gap-2 text-xl font-bold text-forest">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest text-sm font-black text-white">SS</span>
              <span>SportSync</span>
            </a>
            <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
              A modern sports platform for finding venues, joining games, booking trainers, and organizing events.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            <FooterGroup title="Explore" links={[
              { label: 'Explore', to: '#explore' },
              { label: 'Games', to: '#games' },
              { label: 'Trainers', to: '#trainers' },
              { label: 'Events', to: '#events' },
            ]} />
            <FooterGroup title="Account" links={[
              { label: 'Login', to: '/login', route: true },
              { label: 'Register', to: '/register', route: true },
            ]} />
            <FooterGroup title="Legal" links={[
              { label: 'Terms', to: '#terms' },
              { label: 'Privacy', to: '#privacy' },
            ]} />
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterGroup({ title, links }) {
  return (
    <div>
      <h3 className="text-sm font-black uppercase tracking-wide text-gray-950">{title}</h3>
      <div className="mt-3 space-y-2">
        {links.map((link) => (
          link.route ? (
            <Link key={link.label} to={link.to} className="block text-sm font-medium text-gray-500 hover:text-forest">
              {link.label}
            </Link>
          ) : (
            <a key={link.label} href={link.to} className="block text-sm font-medium text-gray-500 hover:text-forest">
              {link.label}
            </a>
          )
        ))}
      </div>
    </div>
  );
}
