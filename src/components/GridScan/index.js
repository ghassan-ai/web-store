import dynamic from 'next/dynamic';

const GridScan = dynamic(() => import('./GridScan').then(m => m.GridScan), { ssr: false });
export default GridScan;
