import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { getCityName, zeroPad } from '~/lib/helpers';

type TimezoneProps = {
  timezone: string;
  colorHue: string;
};

export const Timezone: React.FC<TimezoneProps> = ({ timezone, colorHue }) => {
  const [hoursList, setHoursList] = useState<number[]>([]);
  const [time, setTime] = useState<DateTime>();

  useEffect(() => {
    const onInterval = () => {
      const currentTime = DateTime.now().setZone(timezone);

      let timeItem = currentTime;
      const hoursListArray = [];
      for (let i = 0; i < 24; i++) {
        hoursListArray.push(timeItem.hour);
        timeItem = timeItem.plus({ hours: 1 });
      }

      setHoursList(hoursListArray);
      setTime(currentTime);
    };

    const interval = setInterval(onInterval, 1000);
    onInterval();

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <React.Fragment key={timezone}>
      <h2 className="mt-2 gap-2 inline-flex sticky left-0">
        <span
          className="text-gray-100 px-1 rounded font-mono"
          style={{ background: `oklch(0.60 0.15 ${colorHue})` }}
        >
          {zeroPad(time?.hour)}:{zeroPad(time?.minute)}
        </span>
        {getCityName(timezone)}
      </h2>
      <div className="mt-1 pb-2 flex gap-3">
        {hoursList.map((item, index) => (
          <div
            key={index}
            className="bg-gray-200 font-mono text-center min-w-10"
            style={{ background: `oklch(0.85 0.05 ${colorHue})` }}
          >
            {item}
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};
