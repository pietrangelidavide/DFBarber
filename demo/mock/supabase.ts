// Database finto per l'anteprima: stesse tabelle e funzioni che usa l'app, con dati di prova.
type Row = Record<string, any>;
const Q = new URLSearchParams(location.search);
// Giorno e ora di Roma (le sedi sono a Roma, qualunque sia il fuso di chi guarda la demo)
const romeParts = (t: number) => {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(t));
  const g = (k: string) => Number(p.find((x) => x.type === k)?.value ?? 0);
  return { y: g('year'), m: g('month'), d: g('day'), h: g('hour'), mi: g('minute') };
};
const at = (dayOff: number, h: number, m = 0) => {
  const n = romeParts(Date.now());
  const guess = Date.UTC(n.y, n.m - 1, n.d + dayOff, h, m);
  const w = romeParts(guess);
  const off = Date.UTC(w.y, w.m - 1, w.d, w.h, w.mi) - guess; // differenza tra l'ora di Roma e UTC
  return new Date(guess - off).toISOString();
};
const SAL = [
  { id: 's1', name: 'EUR · Papillo', address: 'Via A. Moravia 77, 00143 Roma', timezone: 'Europe/Rome', slot_step_min: 30, active: true, phone: '06 8398 6576', whatsapp: '351 729 7915', email: 'df7barber@gmail.com', lat: 41.8266, lng: 12.4685, google_review_url: 'https://search.google.com/local/writereview?placeid=demo' },
  { id: 's2', name: 'Fonte Laurentina', address: 'Via U. Cassina 20, 00128 Roma', timezone: 'Europe/Rome', active: true, phone: '06 5013 2211', whatsapp: '351 729 7915', email: null, lat: null, lng: null },
  { id: 's3', name: 'Cecchignola', address: 'Via A. Zanetta 64, 00128 Roma', timezone: 'Europe/Rome', active: true, phone: null, whatsapp: null, email: null, lat: null, lng: null },
];
const SERV = [
  { id: 'v1', name: 'Taglio', category: 'Capelli', duration_min: 30, price_cents: 2000, active: true },
  { id: 'v2', name: 'Taglio + shampoo', category: 'Capelli', duration_min: 40, price_cents: 2500, active: true },
  { id: 'v3', name: 'Barba con panno caldo', category: 'Barba', duration_min: 30, price_cents: 1500, active: true },
  { id: 'v4', name: 'Taglio e barba', category: 'Combo', duration_min: 60, price_cents: 3200, active: true },
  { id: 'v5', name: 'Taglio bambino', category: 'Capelli', duration_min: 30, price_cents: 1500, active: true },
];
const NAMES = ['Daniele', 'Luca', 'Claudia', 'Il Maestro', 'Lele', 'Massimo', 'Ciccio', 'Gabriele'];
const STAFF: Row[] = NAMES.map((name, i) => ({
  id: `st${i + 1}`, name, photo_url: null, active: true, user_id: i === 1 ? 'u-barber' : null,
  staff_salons: [{ salon_id: SAL[i % 2 === 0 ? 0 : 1].id, salons: { name: SAL[i % 2 === 0 ? 0 : 1].name } }, ...(i < 3 ? [{ salon_id: 's3', salons: { name: SAL[2].name } }] : [])],
  staff_services: SERV.map((s) => ({ service_id: s.id })),
}));
const PROD = [
  { id: 'p1', name: 'Dopo barba in crema', price_cents: 1800, description: 'Idratante, per pelli sensibili. 100 ml.', image_url: null, active: true },
  { id: 'p2', name: 'Cera opaca forte', price_cents: 1500, description: 'Tenuta forte, finish opaco.', image_url: null, active: true },
  { id: 'p3', name: 'Shampoo rinforzante', price_cents: 1400, description: null, image_url: null, active: true },
  { id: 'p4', name: 'Olio da barba', price_cents: 2000, description: 'Ammorbidisce e profuma.', image_url: null, active: true },
  { id: 'p5', name: 'Pomata brillante', price_cents: 1600, description: null, image_url: null, active: true },
  { id: 'p6', name: 'Crema viso idratante', price_cents: 2200, description: null, image_url: null, active: true },
];
const CLI = { id: 'u-client', first_name: 'Marco', last_name: 'Rossi', full_name: 'Marco Rossi', phone: '333 1234567', role: 'customer', preferred_salon_id: 's1', preferred_staff_id: 'st1' };
const DB: Record<string, Row[]> = {
  salons: SAL, services: SERV, staff: STAFF, products: PROD,
  staff_salons: [{ salon_id: 's2', staff: { user_id: 'u-barber' } }],
  shop_settings: [{ id: 1, shipping_cents: 590, free_shipping_over_cents: 5000 }],
  loyalty_settings: [{ id: 1, reward_credits: 100, reward_name: 'Un taglio gratis' }],
  loyalty_ledger: [
    ...[0, 1, 2, 3, 4, 5, 6].map((i) => ({ id: `l${i}`, user_id: 'u-client', staff_id: i % 3 ? 'st1' : 'st2', credits: 10, kind: 'earn', created_at: at(-14 * (i + 1), 12), staff: { name: i % 3 ? 'Daniele' : 'Luca', photo_url: null } })),
  ],
  loyalty_rewards: [],
  profiles: [CLI, { id: 'u-owner', role: 'owner', full_name: 'Daniele Fichera' }, { id: 'u-barber', role: 'barber', full_name: 'Luca' }],
  appointments: [
    { id: 'a0', customer_id: 'u-client', staff_id: 'st1', salon_id: 's1', status: 'completed', starts_at: at(-2, 11, 0), source: null, guest_name: null, guest_phone: null, reward_id: null, rating: null, salons: { name: SAL[0].name, timezone: 'Europe/Rome', whatsapp: '351 729 7915', google_review_url: 'https://search.google.com/local/writereview?placeid=demo' }, services: { name: 'Taglio e barba' }, staff: { name: 'Daniele' }, profiles: { full_name: 'Marco Rossi', phone: '333 1234567' } },
    { id: 'a1', customer_id: 'u-client', staff_id: 'st1', salon_id: 's1', status: 'confirmed', starts_at: at(2, 10, 30), source: null, guest_name: null, guest_phone: null, reward_id: null, salons: { name: SAL[0].name, timezone: 'Europe/Rome' }, services: { name: 'Taglio e barba' }, staff: { name: 'Daniele' }, profiles: { full_name: 'Marco Rossi', phone: '333 1234567' } },
    { id: 'a2', customer_id: 'u-client', staff_id: 'st2', salon_id: 's2', status: 'confirmed', starts_at: at(9, 17, 0), source: null, guest_name: null, guest_phone: null, reward_id: null, salons: { name: SAL[1].name, timezone: 'Europe/Rome' }, services: { name: 'Taglio' }, staff: { name: 'Luca' }, profiles: { full_name: 'Marco Rossi', phone: '333 1234567' } },
    ...([
      ['09:00', 'Taglio', 'Andrea B.', 'completed', 'st1', 's3'],
      ['09:00', 'Taglio e barba', 'Marco D.', 'completed', 'st3', 's3'],
      ['09:30', 'Barba con panno caldo', 'Giulio F.', 'completed', 'st2', 's3'],
      ['10:00', 'Taglio e barba', 'Matteo S.', 'confirmed', 'st1', 's3'],
      ['10:30', 'Taglio + shampoo', 'Gianni T.', 'confirmed', 'st2', 's3'],
      ['11:00', 'Taglio', 'Roberto M.', 'confirmed', 'st3', 's3'],
      ['11:30', 'Taglio', 'Federico L.', 'confirmed', 'st1', 's3'],
      ['12:00', 'Taglio bambino', 'Leo (figlio di Sara)', 'confirmed', 'st2', 's3'],
      ['15:00', 'Taglio e barba', 'Paolo R.', 'confirmed', 'st1', 's3'],
      ['15:30', 'Barba con panno caldo', 'Stefano C.', 'confirmed', 'st3', 's3'],
      ['16:00', 'Taglio', 'Daniele P.', 'confirmed', 'st2', 's3'],
      ['17:00', 'Taglio', 'Alessio P.', 'confirmed', 'st3', 's3'],
      ['09:30', 'Taglio', 'Simone D.', 'completed', 'st7', 's1'],
      ['10:00', 'Taglio', 'Emanuele V.', 'confirmed', 'st5', 's1'],
      ['14:30', 'Taglio e barba', 'Valerio G.', 'confirmed', 'st5', 's1'],
      ['16:30', 'Barba con panno caldo', 'Fabio N.', 'confirmed', 'st7', 's1'],
    ] as string[][]).map(([t, sv, who, status, st, sa], i) => ({
      id: `d${i}`, customer_id: null, staff_id: st, salon_id: sa, status, starts_at: at(0, +t.slice(0, 2), +t.slice(3)), source: i === 3 || i === 6 || i === 13 ? 'treatwell' : 'manual', guest_name: who, guest_phone: '338 ' + String(4120000 + i * 7311).padStart(7, '0'), reward_id: null,
      salons: { name: SAL.find((x) => x.id === sa)!.name, timezone: 'Europe/Rome' }, services: { name: sv }, staff: { name: STAFF.find((x) => x.id === st)!.name }, profiles: null,
    })),
  ],
  orders: [
    { id: 'o1', user_id: 'u-client', status: 'paid', created_at: at(-6, 11), total_cents: 3300, fulfillment: 'pickup', fulfillment_status: 'done', salons: { name: SAL[0].name }, order_items: [{ name: 'Dopo barba in crema', qty: 1 }, { name: 'Cera opaca forte', qty: 1 }], customer_name: 'Marco Rossi', customer_phone: '333 1234567', shipping_name: null, shipping_address: null },
    { id: 'o2', user_id: 'u-x', status: 'paid', created_at: at(-1, 16), total_cents: 2000, fulfillment: 'shipping', fulfillment_status: 'new', salons: null, order_items: [{ name: 'Olio da barba', qty: 1 }], customer_name: 'Paolo V.', customer_phone: '347 9988776', shipping_name: 'Paolo Verdi', shipping_address: { line1: 'Via Appia 100', city: 'Roma', postal_code: '00179', state: 'RM' } },
  ],
  working_hours: STAFF.flatMap((st) => st.staff_salons.flatMap((l: any) => [1, 2, 3, 4, 5, 6, 7].flatMap((w) => [
    { staff_id: st.id, salon_id: l.salon_id, weekday: w, start_time: '09:00:00', end_time: '13:00:00' },
    { staff_id: st.id, salon_id: l.salon_id, weekday: w, start_time: '14:30:00', end_time: '19:30:00' },
  ]))),
  time_off: [{ id: 't1', staff_id: 'st3', starts_at: at(5, 0), ends_at: at(8, 0), reason: 'Ferie', staff: { name: 'Claudia' } }],
};
const DUR: Record<string, number> = Object.fromEntries(SERV.map((x) => [x.name, x.duration_min]));
DB.appointments.forEach((r) => { if (!r.ends_at) r.ends_at = new Date(+new Date(r.starts_at) + (DUR[r.services?.name] ?? 30) * 60000).toISOString(); r.services = { ...r.services, duration_min: DUR[r.services?.name] ?? 30 }; });
const get = (r: Row, path: string): any[] => {
  let cur: any[] = [r];
  for (const k of path.split('.')) cur = cur.flatMap((x) => { const v = x?.[k]; return Array.isArray(v) ? v : [v]; });
  return cur;
};
let session: any = null;
const listeners = new Set<(e: string, s: any) => void>();
const userOf = (id: string, email: string) => ({ id, email });
const login = Q.get('login');
if (login) session = { user: userOf(login === 'owner' ? 'u-owner' : login === 'barber' ? 'u-barber' : 'u-client', `${login}@dfbarbershop.test`) };

class Qb {
  op = 'select'; f: ((r: Row) => boolean)[] = []; ord: any = null; lim: number | null = null; head = false; cnt = false; patch: any = null; one: string | null = null;
  constructor(public t: string) {}
  select(_c?: string, o?: any) { if (o?.head) this.head = true; if (o?.count) this.cnt = true; return this; }
  eq(c: string, v: any) { this.f.push((r) => get(r, c).some((x) => x === v)); return this; }
  neq(c: string, v: any) { this.f.push((r) => get(r, c).every((x) => x !== v)); return this; }
  gte(c: string, v: any) { this.f.push((r) => get(r, c).some((x) => x >= v)); return this; }
  gt(c: string, v: any) { this.f.push((r) => get(r, c).some((x) => x > v)); return this; }
  lt(c: string, v: any) { this.f.push((r) => get(r, c).some((x) => x < v)); return this; }
  lte(c: string, v: any) { this.f.push((r) => get(r, c).some((x) => x <= v)); return this; }
  in(c: string, l: any[]) { this.f.push((r) => get(r, c).some((x) => l.includes(x))); return this; }
  is(c: string, v: any) { this.f.push((r) => get(r, c).every((x) => (v === null ? x == null : x === v))); return this; }
  not(c: string, op: string, v: any) { if (op === 'is' && v === null) this.f.push((r) => get(r, c).some((x) => x != null)); return this; }
  order(c: string, o?: any) { this.ord = [c, o?.ascending !== false]; return this; }
  limit(n: number) { this.lim = n; return this; }
  single() { this.one = 'single'; return this; }
  maybeSingle() { this.one = 'maybe'; return this; }
  insert(row: any) { this.op = 'insert'; this.patch = row; return this; }
  update(p: any) { this.op = 'update'; this.patch = p; return this; }
  delete() { this.op = 'delete'; return this; }
  run(): any {
    const all = DB[this.t] ?? [];
    let rows = all.filter((r) => this.f.every((fn) => fn(r)));
    if (this.op === 'update') { rows.forEach((r) => Object.assign(r, this.patch)); return { data: null, error: null }; }
    if (this.op === 'insert') { all.push({ id: `n${all.length}`, ...this.patch }); return { data: null, error: null }; }
    if (this.op === 'delete') { DB[this.t] = all.filter((r) => !rows.includes(r)); return { data: null, error: null }; }
    if (this.ord) { const [c, asc] = this.ord; rows = [...rows].sort((a, b) => (a[c] > b[c] ? 1 : a[c] < b[c] ? -1 : 0) * (asc ? 1 : -1)); }
    if (this.lim != null) rows = rows.slice(0, this.lim);
    if (this.head) return { data: null, count: rows.length, error: null };
    if (this.one) return { data: rows[0] ?? null, error: this.one === 'single' && !rows[0] ? { message: 'no rows' } : null };
    return { data: rows, error: null };
  }
  then(res: any, rej: any) { return new Promise((r) => setTimeout(() => r(this.run()), 20)).then(res, rej); }
}
const rpc = (fn: string, a: any = {}) => {
  let data: any = null;
  if (fn === 'get_available_days') {
    data = [];
    for (let d = new Date(a.p_from + 'T12:00:00'); d <= new Date(a.p_to + 'T12:00:00'); d.setDate(d.getDate() + 1)) {
      const wd = d.getDay(); const n = new Date(); n.setHours(0, 0, 0, 0);
      if (wd >= 1 && wd <= 6 && d > n && d.getDate() % 7 !== 3) data.push({ day: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` });
    }
  } else if (fn === 'get_available_slots') {
    const [y, m, d] = String(a.p_day).split('-').map(Number); data = [];
    for (let h = 9; h < 19.5; h += 0.5) { const dt = new Date(y, m - 1, d, Math.floor(h), (h % 1) * 60); if (dt.getTime() > Date.now() && (h * 2 + d) % 5 !== 0) data.push({ slot_start: dt.toISOString(), staff_id: a.p_staff ?? 'st1' }); }
  } else if (fn === 'get_salon_hours') {
    data = [1, 2, 3, 4, 5, 6].map((w) => ({ weekday: w, start_time: '09:00:00', end_time: '19:30:00' }));
  } else if (fn === 'rate_appointment') {
    const row = DB.appointments.find((r) => r.id === a.p_id); if (row) row.rating = a.p_rating;
  } else if (fn === 'control_room') {
    data = {
      online: 4500,
      salons: SAL.map((s, i) => ({ id: s.id, name: s.name, services: [182000, 141500, 38000][i], shop: [24500, 18000, 5200][i], cuts: [96, 74, 21][i] })),
      staff: STAFF.slice(0, 5).map((s, i) => ({ id: s.id, name: s.name, photo_url: null, revenue: [98000, 81000, 64500, 52000, 30000][i], cuts: [52, 44, 35, 29, 17][i] })),
      days: Array.from({ length: a.p_days ?? 30 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (a.p_days - 1 - i)); return { day: d.toISOString().slice(0, 10), revenue: [0, 9000, 14000, 11000, 17500, 21000, 0][d.getDay()] + (i % 4) * 700 }; }),
    };
  }
  return Promise.resolve({ data, error: null });
};
export const supabase: any = {
  from: (t: string) => new Qb(t),
  rpc,
  auth: {
    getSession: () => Promise.resolve({ data: { session } }),
    onAuthStateChange: (cb: any) => { listeners.add(cb); return { data: { subscription: { unsubscribe: () => listeners.delete(cb) } } }; },
    signInWithPassword: async ({ email }: any) => { const k = email.startsWith('owner') ? 'u-owner' : email.startsWith('barber') ? 'u-barber' : 'u-client'; session = { user: userOf(k, email) }; listeners.forEach((f) => f('SIGNED_IN', session)); return { error: null }; },
    signUp: async ({ email }: any) => ({ data: { user: { id: 'new', email }, session: null }, error: null }),
    resend: async () => ({ error: null }),
    updateUser: async () => ({ error: null }),
    signOut: async () => { session = null; listeners.forEach((f) => f('SIGNED_OUT', null)); return { error: null }; },
  },
  storage: { from: () => ({ upload: async () => ({ error: null }), getPublicUrl: () => ({ data: { publicUrl: '' } }) }) },
  functions: { invoke: async () => ({ data: { url: '#' }, error: null }) },
};
