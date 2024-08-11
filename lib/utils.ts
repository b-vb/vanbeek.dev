import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date) => date.toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
});

export const getAvatarUrl = (name: string) => {
  switch (name.toLowerCase()) {
    case 'bjorn':
      return 'https://avatar.iran.liara.run/public/38';
    case 'bas':
      return 'https://avatar.iran.liara.run/public/1';
    case 'gerrit':
      return 'https://avatar.iran.liara.run/public/45';
    case 'marjolein':
      return 'https://avatar.iran.liara.run/public/82';
    case 'jacqueline':
      return 'https://avatar.iran.liara.run/public/90';
    case 'cordelia':
      return 'https://avatar.iran.liara.run/public/77';
    default:
      return '';
  }
};
