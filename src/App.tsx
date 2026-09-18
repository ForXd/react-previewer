import { lazy, Suspense, useEffect, useState } from 'react';
import './App.css';
import DemoWorkbench from './demo/DemoWorkbench';
const AiWorkbench = lazy(() => import('./demo/ai/AiWorkbench'));

function App() {
  const [ai, setAi] = useState(window.location.hash === '#ai');
  useEffect(() => {
    const change = () => setAi(window.location.hash === '#ai');
    window.addEventListener('hashchange', change);
    return () => window.removeEventListener('hashchange', change);
  }, []);
  return ai ? (
    <Suspense fallback={<p>正在打开 AI Studio…</p>}>
      <AiWorkbench />
    </Suspense>
  ) : (
    <DemoWorkbench />
  );
}
export default App;
