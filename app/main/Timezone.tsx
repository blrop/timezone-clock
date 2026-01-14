import { DateTime } from 'luxon';
import React from 'react';
import { getCityName, zeroPad } from '~/lib/helpers';

type TimezoneProps = {
  timezone: string;
};

export const Timezone: React.FC<TimezoneProps> = ({ timezone }) => {
  const hoursList = [];
  const time = DateTime.now().setZone(timezone);
  let timeItem = time;
  for (let i = 0; i < 24; i++) {
    hoursList.push(timeItem.hour);
    timeItem = timeItem.plus({ hours: 1 });
  }

  return (
    <React.Fragment key={timezone}>
      <h2 className="mt-2 gap-2 inline-flex sticky left-0">
        <span className="bg-gray-600 text-gray-100 px-1 rounded font-mono">{zeroPad(time.hour)}:{zeroPad(time.minute)}</span>
        {getCityName(timezone)}
      </h2>
      <div className="mt-1 pb-2 flex gap-3">
        {hoursList.map((item, index) => (
          <div key={index} className="bg-gray-200 font-mono text-center min-w-10">
            {item}
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};
