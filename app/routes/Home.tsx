import React, { useState } from 'react';
import { Outlet } from 'react-router';
import type { Route } from '~/../.react-router/types/app/+types/root';

import { loadTimezones } from '~/lib/helpers';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Timezone Clock" },
    { name: "description", content: "" },
  ];
}

export type ContextProps = {
  timezones: string[];
  setTimezones: (timezones: string[]) => void;
}

export default function Home() {
  const [timezones, setTimezones] = useState<string[]>(loadTimezones());

  return (
    <main className="flex-grow flex flex-col items-center">
      <div className="p-3 md:max-w-3xl max-w-full flex-grow flex flex-col">
        <Outlet context={{ timezones, setTimezones }} />
      </div>
    </main>
  );
}
