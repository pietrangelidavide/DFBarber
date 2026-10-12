// Va importato per primo: decide come mostrare l'app (telefono finto, computer o schermo intero) prima che l'app parta.
// Le scelte stanno nell'indirizzo: ?login=client|owner|barber  ?view=phone|computer  ?theme=light|dark
const Q = new URLSearchParams(location.search);

export type View = 'phone' | 'computer' | 'direct';
export const PHONE_W = 390;
export const PHONE_H = 844;
export const BAR_H = 56;

const wide = innerWidth >= 720;
const asked = Q.get('view');
export const view: View = !wide ? 'direct' : asked === 'computer' ? 'computer' : 'phone';
export const login = Q.get('login') || '';
export const themeAsked = Q.get('theme') === 'light' || Q.get('theme') === 'dark' ? (Q.get('theme') as 'light' | 'dark') : '';
export const dark = themeAsked ? themeAsked === 'dark' : !matchMedia('(prefers-color-scheme: light)').matches;

const stage = () => document.getElementById('phone');
(window as any).__DEMO = {
  os: view === 'computer' ? 'web' : 'ios',
  insets: view === 'phone' ? { top: 47, bottom: 34 } : view === 'direct' ? { top: 10, bottom: 18 } : { top: 0, bottom: 0 },
  dims: () => {
    if (view === 'phone') return { width: PHONE_W, height: PHONE_H };
    const el = stage();
    return { width: el?.clientWidth || innerWidth - (view === 'computer' ? 32 : 0), height: el?.clientHeight || innerHeight - BAR_H - (view === 'computer' ? 32 : 0) };
  },
};

// Orologio della demo: la data è quella di oggi ma l'ora di partenza è sempre le 10:40 (ora di Roma),
// così l'agenda mostra appuntamenti già fatti, in corso e ancora da fare qualunque sia l'ora in cui la si apre.
const RealDate = Date;
const romeMin = (t: number) => {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Rome', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new RealDate(t));
  const g = (k: string) => Number(p.find((x) => x.type === k)?.value ?? 0);
  return g('hour') * 60 + g('minute');
};
const shift = (10 * 60 + 40 - romeMin(RealDate.now())) * 60000;
class DemoDate extends RealDate {
  constructor(...a: any[]) {
    if (a.length === 0) super(RealDate.now() + shift);
    else super(...(a as [any]));
  }
  static now() { return RealDate.now() + shift; }
}
(window as any).Date = DemoDate;
