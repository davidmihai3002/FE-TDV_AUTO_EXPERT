export function jumpToSection(id: string) {
  const section = document.getElementById(id);
  if (!section) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  section.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  window.history.replaceState(window.history.state, '', `#${id}`);
  document.getElementById(`${id}-h`)?.focus({ preventScroll: true });
}
