import { PageContent } from './components/layout/PageContent';
import { MusicToggle } from './components/ui/MusicToggle';
import './styles/global.css';
import './styles/sections.css';
import './styles/panel.css';

export default function App() {
  return (
    <>
      <PageContent />
      <MusicToggle />
    </>
  );
}
