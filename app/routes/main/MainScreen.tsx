import React from 'react';
import { Link, useOutletContext } from 'react-router';
import type { Route } from '~/../.react-router/types/app/+types/root';

import { getColorHueForItem } from '~/lib/helpers';
import { EditIcon } from '~/lib/icons/EditIcon';
import { Timezone } from '~/routes/main/Timezone';
import type { ContextProps } from '~/routes/Home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Timezone Clock - Edit timezones" },
    { name: "description", content: "" },
  ];
}

export default function MainScreen() {
  const { timezones } = useOutletContext<ContextProps>();

  return (
    <>
      <div className="mb-2 flex gap-1 justify-between items-center">
        <h1 className="text-lg sm:text-2xl">Timezones Clock</h1>
        <Link to="/edit">
          <EditIcon />
        </Link>
      </div>

      <div className="overflow-x-auto flex-grow">
        {timezones.map((item, index) => (
            <Timezone key={item} timezone={item} colorHue={getColorHueForItem(index, timezones.length)} />
          )
        )}
      </div>
    </>
  );
}
