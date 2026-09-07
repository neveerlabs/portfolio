import type { SVGProps } from "react";

type SocialIconProps = SVGProps<SVGSVGElement>;

export const XIcon = (props: SocialIconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.963 6.817H1.684l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
  </svg>
);

export const InstagramIcon = (props: SocialIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
    <rect width="18" height="18" x="3" y="3" rx="5" />
    <circle cx="12" cy="12" r="4.25" />
    <circle cx="17.35" cy="6.65" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const FacebookIcon = (props: SocialIconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M13.5 21v-8h2.75l.41-3h-3.16V8.085c0-.868.242-1.46 1.5-1.46h1.82V3.94A24.3 24.3 0 0 0 14.165 3C11.62 3 9.875 4.55 9.875 7.4V10H7.25v3h2.625v8h3.625Z" />
  </svg>
);
