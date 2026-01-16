import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import { TIME_ZONES } from '~/lib/timezones';
import { DeleteIcon } from '~/lib/icons/DeleteIcon';

import './EditTimezones.css';

type EditTimezonesProps = {
  timezones: string[];
  onSave: (timezones: string[]) => void;
  onCancel: () => void;
};

export const EditTimezones: React.FC<EditTimezonesProps> = ({ timezones: initialTimezones, onSave, onCancel }) => {
  const [timezones, setTimezones] = useState(initialTimezones);
  const [zone, setZone] = useState<string>('');

  return (
    <div className="edit-timezones bg-amber-100 shadow-lg border-gray-400 rounded px-3 py-3 max-w-full">
      <h2 className="text-lg mb-6">Edit timezones</h2>

      {timezones.map((item, index) => (
        <div key={item} className="flex justify-between items-center gap-2 mb-2">
          <div className="break-all leading-none">
            {item}
          </div>
          <Button
            variant="outlined"
            onClick={() => {
              setTimezones(timezones.toSpliced(index, 1));
            }}
          >
            <DeleteIcon/>
          </Button>
        </div>
      ))}

      <div className="flex gap-2 mt-6">
        <Autocomplete
          className="flex-grow"
          options={TIME_ZONES}
          value={zone}
          onChange={(e, value) => {
            setZone(value ?? '');
          }}
          renderInput={(params) => <TextField {...params} label="Timezone name" />}
          size="small"
        />
        <Button
          variant="outlined"
          onClick={() => {
            if (zone !== null) {
              setTimezones([...timezones, zone]);
            }
          }}
        >Add</Button>
      </div>

      <div className="flex mt-6 gap-2">
        <Button
          variant="contained"
          onClick={() => {
            onSave(timezones);
          }}
        >Save</Button>
        <Button
          variant="outlined"
          onClick={onCancel}
        >Cancel</Button>
      </div>
    </div>
  );
};
