import { AppConfig } from '@/utils/AppConfig';

export const Logo = (props: {
  isTextHidden?: boolean;
}) => (
  <div className="flex items-center text-xl font-semibold">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 192 192">
      <circle cx="48.0" cy="8.0" r="8" fill="#2563EB" />
      <circle cx="68.0" cy="13.35898384862245" r="8" fill="#2563EB" />
      <circle cx="82.64101615137754" cy="28.0" r="8" fill="#2563EB" />
      <circle cx="82.64101615137756" cy="68.0" r="8" fill="#2563EB" />
      <circle cx="48.0" cy="88.0" r="8" fill="#2563EB" />
      <circle cx="13.358983848622458" cy="68.00000000000001" r="8" fill="#2563EB" />
      <circle cx="8.0" cy="48.00000000000001" r="8" fill="#2563EB" />
      <circle cx="13.358983848622458" cy="27.999999999999996" r="8" fill="#2563EB" />
      <circle cx="27.999999999999982" cy="13.358983848622465" r="8" fill="#2563EB" />
      <circle cx="128.0" cy="8.0" r="8" fill="#F59E0B" />
      <circle cx="148.0" cy="13.35898384862245" r="8" fill="#F59E0B" />
      <circle cx="162.64101615137753" cy="28.0" r="8" fill="#F59E0B" />
      <circle cx="168.0" cy="48.0" r="8" fill="#F59E0B" />
      <circle cx="162.64101615137756" cy="68.0" r="8" fill="#F59E0B" />
      <circle cx="148.0" cy="82.64101615137756" r="8" fill="#F59E0B" />
      <circle cx="108.0" cy="82.64101615137756" r="8" fill="#F59E0B" />
      <circle cx="88.0" cy="48.00000000000001" r="8" fill="#F59E0B" />
      <circle cx="107.99999999999999" cy="13.358983848622465" r="8" fill="#F59E0B" />
      <circle cx="68.0" cy="93.35898384862244" r="8" fill="#10B981" />
      <circle cx="88.0" cy="128.0" r="8" fill="#10B981" />
      <circle cx="68.0" cy="162.64101615137756" r="8" fill="#10B981" />
      <circle cx="48.0" cy="168.0" r="8" fill="#10B981" />
      <circle cx="28.000000000000007" cy="162.64101615137756" r="8" fill="#10B981" />
      <circle cx="13.358983848622458" cy="148.0" r="8" fill="#10B981" />
      <circle cx="8.0" cy="128.0" r="8" fill="#10B981" />
      <circle cx="13.358983848622458" cy="108.0" r="8" fill="#10B981" />
      <circle cx="27.999999999999982" cy="93.35898384862247" r="8" fill="#10B981" />
      <circle cx="128.0" cy="88.0" r="8" fill="#9333EA" />
      <circle cx="162.64101615137753" cy="108.0" r="8" fill="#9333EA" />
      <circle cx="168.0" cy="128.0" r="8" fill="#9333EA" />
      <circle cx="162.64101615137756" cy="148.0" r="8" fill="#9333EA" />
      <circle cx="148.0" cy="162.64101615137756" r="8" fill="#9333EA" />
      <circle cx="128.0" cy="168.0" r="8" fill="#9333EA" />
      <circle cx="108.0" cy="162.64101615137756" r="8" fill="#9333EA" />
      <circle cx="93.35898384862246" cy="148.0" r="8" fill="#9333EA" />
      <circle cx="93.35898384862246" cy="108.0" r="8" fill="#9333EA" />
    </svg>
    {!props.isTextHidden && AppConfig.name}
  </div>
);
