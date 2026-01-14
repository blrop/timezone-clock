import { DateTime } from 'luxon';
import React, { useState } from 'react';
import Button from '@mui/material/Button';

import './main.css';

import { EditTimezones } from '~/main/EditTimezones';
import { getCityName } from '~/lib/helpers';

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

function zeroPad(n: number): string {
  return n < 10 ? `0${n}` : n.toString();
}

const renderTimezoneLine = (timezone: string) => {
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

function saveTimezones(timezones: string[]) {
  window.location.hash = timezones.join(';');
}

function loadTimezones(): string[] {
  if (!window.location.hash) {
    return defaultState;
  }
  return window.location.hash
    .slice(1) // remove leading '#'
    .split(';');
}

export function Main() {
  const [isEditorVisible, setEditorVisible] = useState(false);
  const [timezones, setTimezones] = useState<string[]>(loadTimezones());

  return (
    <main className="flex justify-center">
      <div className="p-3 max-w-3xl">
        <div className="mb-2 flex gap-1 justify-between items-center">
          <h1 className="text-2xl">Timezones Clock</h1>
          {
            isEditorVisible || (
              <Button
                variant="text"
                onClick={() => setEditorVisible(!isEditorVisible)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"/>
                </svg>
              </Button>
            )
          }
        </div>

        {
          isEditorVisible ? (
            <EditTimezones
              timezones={timezones}
              onSave={(timezones: string[]) => {
                setTimezones(timezones);
                saveTimezones(timezones);
                setEditorVisible(false);
              }}
              onCancel={() => setEditorVisible(false)}
            />
          ) : (
            <div className="overflow-x-auto">
              {timezones.map((item) => renderTimezoneLine(item))}
            </div>
          )
        }
      </div>
    </main>
  );
}
