import { DateTime } from 'luxon';
import { useState } from 'react';
import Button from '@mui/material/Button';

import './main.css';

import { EditTimezones } from '~/main/EditTimezones';

/*
// https://moment.github.io/luxon/index.html#/zones?id=specifying-a-zone
// https://moment.github.io/luxon/index.html#/math
// https://moment.github.io/luxon/index.html#/tour

// timezones examples:
const time = DateTime.now().setZone('America/New_York');
console.log(time.offset);

console.log(`Current: ${time.day}.${time.month}.${time.year} ${time.hour}:${time.minute} - ${time.zoneName}`);
const newTime = time.plus({ days: 3, hours: 3 });
console.log(`After plus: ${newTime.day}.${newTime.month}.${newTime.year} ${newTime.hour}:${newTime.minute}`);

// const time = DateTime.now().setZone(-4*60); // UTC-4 (New York winter time)
*/

const defaultState = [
  'Europe/Vilnius',
  'Asia/Brunei',
  'America/New_York',
];

const renderTimezoneLine = (timezone: string) => {
  const hoursList = [];
  const time = DateTime.now().setZone(timezone);
  let timeItem = time;
  for (let i = 0; i < 24; i++) {
    hoursList.push(timeItem.hour);
    timeItem = timeItem.plus({ hours: 1 });
  }

  return (
    <div key={timezone}>
      <h2>{timezone} [{time.hour}:{time.minute}]</h2>
      <div className="m-2 p-2 border grid grid-cols-24">
        {hoursList.map((item, index) => (
          <div key={index} className="bg-gray-200 m-2 font-mono text-center">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export function Main() {
  const [isEditorVisible, setEditorVisible] = useState(false);
  const [timezones, setTimezones] = useState<string[]>(defaultState);

  return (
    <main>
      <div className="edit-block">
        {
          isEditorVisible ?
            <EditTimezones
              timezones={timezones}
              onSave={(timezones: string[]) => {
                setTimezones(timezones);
                setEditorVisible(false);
              }}
              onCancel={() => setEditorVisible(false)}
            />
          :
          <Button
            variant="outlined"
            onClick={() => setEditorVisible(!isEditorVisible)}
            className="px-1 py-0 border"
          >Edit</Button>
        }
      </div>

      {timezones.map((item) => renderTimezoneLine(item))}
    </main>
  );
}
