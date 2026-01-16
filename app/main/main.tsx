import React, { useState } from 'react';
import Button from '@mui/material/Button';

import { EditTimezones } from '~/main/EditTimezones';
import { Timezone } from '~/main/Timezone';
import { loadTimezones, saveTimezones } from '~/lib/helpers';
import { EditIcon } from '~/lib/icons/EditIcon';

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
                <EditIcon />
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
