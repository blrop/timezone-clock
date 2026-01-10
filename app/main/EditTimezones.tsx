import React, { useState } from 'react';
import { TIME_ZONES } from '~/lib/timezones';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import './EditTimezones.css';

type EditTimezonesProps = {
  timezones: string[];
  onSave: (timezones: string[]) => void;
  onCancel: () => void;
};

export const EditTimezones: React.FC<EditTimezonesProps> = ({ timezones: initialTimezones, onSave, onCancel }) => {
  const [timezones, setTimezones] = useState(initialTimezones);
  const [zone, setZone] = useState<string | null>('');

  return (
    <div>
      <h2>Edit timezones</h2>
      <div className="add-form">
        <Autocomplete
          className="add-form__autocomplete"
          options={TIME_ZONES}
          value={zone}
          onChange={(e, value) => {
            setZone(value);
          }}
          renderInput={(params) => <TextField {...params} label="Timezone name" />}
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
      
      {timezones.map((item, index) => (
        <div key={item} className="timezone-item">
          {item}
          <Button
            variant="outlined"
            onClick={() => {
              setTimezones(timezones.toSpliced(index, 1));
            }}
          >Delete</Button>
        </div>
      ))}
      <div className="buttons-block">
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
