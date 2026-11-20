import { useRef, useState, type FormEvent } from 'react';
import {
  Accordion,
  ArrowLink,
  Badge,
  Button,
  Card,
  CardMedia,
  Checkbox,
  Chip,
  Container,
  DateInput,
  Dialog,
  Icon,
  Input,
  PageTitle,
  SectionHeading,
  Select,
  Skeleton,
  Textarea,
} from '@/components';
import { REQUIRED_LEGEND, VALIDATION_MESSAGES, formatDate, formatPercent, formatRon, isValidEmail, isValidRoPhone, pluralRo, tomorrowIso } from '@/libs';

export default function UiKitPage() {
  const [chip, setChip] = useState('toate');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSize, setDialogSize] = useState<'sm' | 'md' | 'lg'>('md');

  return (
    <Container className="py-xl flex flex-col gap-xl">
      <title>UI kit · TDV Auto Expert</title>
      <PageTitle accent="UI kit">TDV</PageTitle>

      <Block title="Diacritice">
        {(['font-headline font-semibold', 'font-headline font-bold', 'font-body font-normal', 'font-body font-medium', 'font-body font-semibold'] as const).map(
          (cls) => (
            <p key={cls} className={`${cls} text-body-lg`}>
              Ăă Ââ Îî Șș Țț — „Programează o lecție” <span className="uppercase">ștergătoare țară</span>{' '}
              <span className="text-label-sm text-on-surface-variant">({cls})</span>
            </p>
          ),
        )}
      </Block>

      <Block title="Formatare">
        <p className="text-body-md">
          {formatRon(1300)} · {formatRon(85.5)} · {formatDate('2026-11-18')} · {formatPercent(94.2)} ·{' '}
          {pluralRo(20, 'lecție', 'lecții')} · {pluralRo(2, 'lecție', 'lecții')}
        </p>
      </Block>

      <Block title="Butoane">
        <div className="flex flex-wrap gap-4 items-center">
          <Button>Programează o lecție</Button>
          <Button glow trailingIcon="arrow_forward">
            Cu strălucire
          </Button>
          <Button variant="outline">Calculează prețul</Button>
          <Button variant="tonal" leadingIcon="calculate">
            Tonal
          </Button>
          <Button variant="tonal-neutral">Tonal neutru</Button>
          <Button variant="ghost">Încarcă mai multe</Button>
          <Button size="sm">Mic</Button>
          <Button size="lg">Mare</Button>
          <Button loading>Se trimite</Button>
          <Button disabled>Dezactivat</Button>
        </div>
        <div className="flex flex-wrap gap-md mt-md">
          <ArrowLink to="/flota" uppercase>
            Vezi toate mașinile
          </ArrowLink>
          <ArrowLink to="/blog" tone="gold">
            Citește mai mult
          </ArrowLink>
        </div>
      </Block>

      <Block title="Badge-uri și chip-uri">
        <div className="flex flex-wrap gap-3 items-center">
          <Badge variant="pill" icon="verified">
            Instruire premium
          </Badge>
          <Badge variant="primary">Manual și automat</Badge>
          <Badge variant="secondary">Doar automat</Badge>
          <Badge variant="neutral">Fundamente</Badge>
          <Badge variant="danger">Avansat</Badge>
          <Badge variant="tag">Trafic urban</Badge>
          <Badge variant="category" tone="blue">
            Sfaturi
          </Badge>
          <Badge variant="primary" shape="pill">
            Pill
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 mt-md">
          {['toate', 'mecanica', 'siguranta'].map((c) => (
            <Chip key={c} selected={chip === c} onClick={() => setChip(c)}>
              {c === 'toate' ? 'Toate' : c === 'mecanica' ? 'Mecanica conducerii' : 'Siguranță'}
            </Chip>
          ))}
        </div>
      </Block>

      <Block title="Carduri">
        <div className="grid md:grid-cols-3 gap-gutter">
          <Card interactive="glow">
            <Icon name="speed" size={30} className="text-primary-container mb-4" />
            <h3 className="text-headline-md text-primary mb-2">Card implicit</h3>
            <p className="text-on-surface-variant">Hover: chenar auriu și strălucire.</p>
          </Card>
          <Card tone="low" interactive="lift" media>
            <CardMedia src="/images/tdv-logo.jpg" alt="Logo TDV" aspect="video" />
            <div className="p-md">
              <h3 className="text-headline-md text-primary">Card media</h3>
            </div>
          </Card>
          <Card tone="highest" shadow="deep">
            <h3 className="text-headline-md text-primary mb-2">Highest + deep</h3>
            <Skeleton lines={3} />
          </Card>
        </div>
      </Block>

      <Block title="Titluri de secțiune">
        <SectionHeading
          title="Cunoaște flota"
          description="Mașini moderne, întreținute impecabil."
          eyebrow="Flotă"
          eyebrowIcon="directions_car"
          action={{ label: 'Vezi toate mașinile', to: '/flota', mobileLabel: 'VEZI TOT' }}
        />
      </Block>

      <Block title="Acordeon">
        <Accordion
          single
          defaultOpenId="a"
          items={[
            { id: 'a', question: 'Câte ore de practică sunt obligatorii?', answer: 'Minimum 30 de ore pentru categoria B.' },
            { id: 'b', question: 'Ce acte îmi trebuie?', answer: 'Buletin, fișă medicală și aviz psihologic.' },
          ]}
        />
      </Block>

      <Block title="Dialog">
        <div className="flex flex-wrap gap-4">
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <Button
              key={s}
              variant="outline"
              onClick={() => {
                setDialogSize(s);
                setDialogOpen(true);
              }}
            >
              Deschide {s}
            </Button>
          ))}
        </div>
        <DemoBookingDialog open={dialogOpen} size={dialogSize} onClose={() => setDialogOpen(false)} />
      </Block>
    </Container>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-md">
      <h2 className="text-headline-md text-primary border-b border-outline-variant/30 pb-2">{title}</h2>
      {children}
    </section>
  );
}

type Field = 'name' | 'phone' | 'email' | 'date' | 'slot' | 'consent';

function DemoBookingDialog({ open, size, onClose }: { open: boolean; size: 'sm' | 'md' | 'lg'; onClose: () => void }) {
  const [values, setValues] = useState({ name: '', phone: '', email: '', date: '', slot: '', message: '', consent: false });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const slotRef = useRef<HTMLSelectElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const min = tomorrowIso();

  function validate() {
    const e: Partial<Record<Field, string>> = {};
    if (!values.name.trim()) e.name = VALIDATION_MESSAGES.required;
    if (!values.phone.trim()) e.phone = VALIDATION_MESSAGES.required;
    else if (!isValidRoPhone(values.phone)) e.phone = VALIDATION_MESSAGES.phone;
    if (values.email && !isValidEmail(values.email)) e.email = VALIDATION_MESSAGES.email;
    if (!values.date) e.date = VALIDATION_MESSAGES.required;
    else if (values.date < min) e.date = VALIDATION_MESSAGES.dateMin;
    if (!values.slot) e.slot = VALIDATION_MESSAGES.required;
    if (!values.consent) e.consent = VALIDATION_MESSAGES.consent;
    return e;
  }

  function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    const order: [Field, React.RefObject<HTMLElement | null>][] = [
      ['name', nameRef],
      ['phone', phoneRef],
      ['email', emailRef],
      ['date', dateRef],
      ['slot', slotRef],
      ['consent', consentRef],
    ];
    const first = order.find(([k]) => e[k]);
    if (first) first[1].current?.focus();
    else onClose();
  }

  const set = (k: keyof typeof values) => (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: ev.target.type === 'checkbox' ? (ev.target as HTMLInputElement).checked : ev.target.value }));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size={size}
      title="Programează o lecție"
      description="Formular demonstrativ (ticket 06 îl implementează pe cel real)."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Renunță
          </Button>
          <Button type="submit" form="demo-booking">
            Trimite cererea
          </Button>
        </>
      }
    >
      <form id="demo-booking" noValidate onSubmit={onSubmit} className="flex flex-col gap-md">
        <p className="text-label-sm text-on-surface-variant">{REQUIRED_LEGEND}</p>
        <Input ref={nameRef} label="Nume complet" required autoComplete="name" value={values.name} onChange={set('name')} error={errors.name} />
        <Input
          ref={phoneRef}
          label="Telefon"
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="07xx xxx xxx"
          leadingIcon="call"
          value={values.phone}
          onChange={set('phone')}
          error={errors.phone}
        />
        <Input ref={emailRef} label="Email" type="email" autoComplete="email" value={values.email} onChange={set('email')} error={errors.email} />
        <div className="grid md:grid-cols-2 gap-md">
          <DateInput ref={dateRef} label="Data preferată" required min={min} value={values.date} onChange={set('date')} error={errors.date} />
          <Select
            ref={slotRef}
            label="Interval orar"
            required
            value={values.slot}
            onChange={set('slot')}
            error={errors.slot}
            options={[
              { value: 'dimineata', label: 'Dimineața (08–12)' },
              { value: 'pranz', label: 'Prânz (12–16)' },
              { value: 'seara', label: 'Seara (16–20)' },
            ]}
          />
        </div>
        <Textarea label="Mesaj" maxLength={500} value={values.message} onChange={set('message')} hint="Opțional" />
        <Checkbox
          ref={consentRef}
          required
          checked={values.consent}
          onChange={set('consent')}
          error={errors.consent}
          label={
            <>
              Sunt de acord cu prelucrarea datelor personale conform{' '}
              <a href="#" className="text-secondary underline">
                Politicii de confidențialitate
              </a>
            </>
          }
        />
      </form>
    </Dialog>
  );
}
