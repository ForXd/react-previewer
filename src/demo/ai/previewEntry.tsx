import { createRoot } from 'react-dom/client';
import PreviewHost from './PreviewHost';
import '../../lib/ReactPreview/index.css';
import './preview.css';

createRoot(document.getElementById('root')!).render(<PreviewHost />);
