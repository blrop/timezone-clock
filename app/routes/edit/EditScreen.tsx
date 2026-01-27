import React from 'react';
import { useNavigate, useOutletContext } from 'react-router';
import type { Route } from '~/../.react-router/types/app/+types/root';

import { getTimezonesHash } from '~/lib/helpers';
import { EditTimezones } from '~/routes/edit/EditTimezones';
import type { ContextProps } from '~/routes/Home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Timezone Clock - Edit timezones" },
    { name: "description", content: "" },
  ];
}

export default function EditScreen() {
  const navigate = useNavigate();

  const { timezones, setTimezones } = useOutletContext<ContextProps>();

  const navigateHome = (timezones: string[]) => {
    navigate(`/#${getTimezonesHash(timezones)}`);
  };

  return (
    <>
      <h1 className="text-lg sm:text-2xl mb-2">Timezones Clock</h1>

      <EditTimezones
        timezones={timezones}
        onSave={(newTimezones: string[]) => {
          setTimezones(newTimezones);
          navigateHome(newTimezones);
        }}
        onCancel={() => {
          navigateHome(timezones);
        }}
      />
    </>
  );
}
