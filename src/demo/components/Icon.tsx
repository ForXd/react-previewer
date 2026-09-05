import type { SVGProps } from 'react';

const paths = {
  code: 'm8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18',
  preview: 'M2 5h20v14H2zM2 9h20',
  refresh: 'M20 7v5h-5M4 17v-5h5M6 6a8 8 0 0 1 13 2M5 16a8 8 0 0 0 13 2',
  reset: 'M8 3 3 8l5 5M3 8h11a7 7 0 0 1 0 14',
  inspect: 'M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6M9 9l3 9 2-4 4-2z',
  search: 'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14m5 12 6 6',
  arrow: 'M5 12h14m-5-5 5 5-5 5',
  close: 'm6 6 12 12M6 18 18 6',
  book: 'M12 5v16M12 5C8 2 5 3 2 4v15c3-1 6-2 10 1 4-3 7-2 10-1V4c-3-1-6-2-10 1',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  warning: 'm12 3 10 18H2zM12 9v5m0 3v1',
  sun: 'M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10',
  moon: 'M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11',
  desktop: 'M2 3h20v14H2zM8 21h8m-4-4v4',
  tablet: 'M4 2h16v20H4zM11 18h2',
  mobile: 'M7 2h10v20H7zM11 18h2'
} as const;

export type IconName = keyof typeof paths;
export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
