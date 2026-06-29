import { heroConfig } from '../config';
import { Spatial } from './Spatial';

export function Hero({ isReady: _isReady, data, onNavigate }: { isReady: boolean; data?: typeof heroConfig; onNavigate?: (page: string) => void }) {
  return <Spatial data={data} onNavigate={onNavigate} />;
}
