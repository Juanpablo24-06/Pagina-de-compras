import { StoreProvider } from '../context/StoreContext';
import StoreLayout from '../components/store/StoreLayout';

function GamerStore() {
  return (
    // Ideally, the Provider should be higher up (in routes or App) to persist state
    // when navigating away and back. For now, I will wrap it here, but I will
    // move it to routes.jsx in the next action to ensure persistence as planned.
    <StoreLayout />
  );
}

export default GamerStore;
