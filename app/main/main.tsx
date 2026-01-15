import React, { useState } from 'react';
import Button from '@mui/material/Button';

import { EditTimezones } from '~/main/EditTimezones';
import { Timezone } from '~/main/Timezone';
import { loadTimezones, saveTimezones } from '~/lib/helpers';

export function Main() {
  const [editMode, setEditMode] = useState(false);
  const [timezones, setTimezones] = useState<string[]>(loadTimezones());

  return (
    <main className="flex-grow flex flex-col items-center">
      <div className="p-3 md:max-w-3xl max-w-full flex-grow flex flex-col">
        <div className="mb-2 flex gap-1 justify-between items-center">
          <h1 className="text-lg sm:text-2xl">Timezones Clock</h1>
          {
            editMode || (
              <Button
                variant="text"
                onClick={() => setEditMode(!editMode)}
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
          editMode ? (
            <EditTimezones
              timezones={timezones}
              onSave={(timezones: string[]) => {
                setTimezones(timezones);
                saveTimezones(timezones);
                setEditMode(false);
              }}
              onCancel={() => setEditMode(false)}
            />
          ) : (
            <div className="overflow-x-auto flex-grow">
              {timezones.map((item) => <Timezone key={item} timezone={item} /> )}
            </div>
          )
        }
      </div>
    </main>
  );
}
