/* eslint-disable react/require-default-props */

'use client';

import { useState } from 'react';
import { CircleCheck, Share2 } from 'lucide-react';
import { Button } from './ui/button';

type Props = {
  shareData: ShareData;
  defaultChildren?: React.ReactNode;
  successChildren?: React.ReactNode;
};

export function ShareButton({
  shareData,
  defaultChildren = <Share2 className="w-5 h-5" />,
  successChildren = <CircleCheck className="w-5 h-5" />,
}: Props) {
  const [isShared, setIsShared] = useState(false);
  const handleShare = async () => {
    try {
      await navigator.share(shareData);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to share data:', err);
    }
  };

  return <Button variant="ghost" onClick={handleShare}>{isShared ? successChildren : defaultChildren}</Button>;
}
