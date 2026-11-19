import { useNavigation } from 'react-router';
import { A11Y_LABELS } from '@/config';

export function NavProgress() {
  const navigation = useNavigation();
  if (navigation.state !== 'loading') return null;
  return (
    <div
      role="progressbar"
      aria-label={A11Y_LABELS.pageLoading}
      className="fixed top-0 inset-x-0 h-0.5 bg-primary-container z-[60] animate-pulse"
    />
  );
}
