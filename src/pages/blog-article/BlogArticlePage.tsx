import { useParams } from 'react-router';
import { PlaceholderPage } from '../PlaceholderPage';

export default function BlogArticlePage() {
  const { slug } = useParams();
  return <PlaceholderPage title={`Articol: ${slug ?? ''}`} />;
}
