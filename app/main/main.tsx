import { DateTime } from 'luxon';

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

export function Main() {
  const renderTimezoneLine = (timezone: string) => {
    const hoursList = [];
    const time = DateTime.now().setZone(timezone);
    let timeItem = time;
    for (let i = 0; i < 24; i++) {
      hoursList.push(timeItem.hour);
      timeItem = timeItem.plus({ hours: 1 });
    }

    return (
      <>
        <h2>{timezone} [{time.hour}:{time.minute}]</h2>
        <div className="m-2 p-2 border grid grid-cols-24">
          {hoursList.map((item, index) => (
            <div key={index} className="bg-gray-700 m-2 font-mono text-center">
              {item}
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <main>
      {renderTimezoneLine('Europe/Vilnius')}
      {renderTimezoneLine('Asia/Brunei')}
      {renderTimezoneLine('America/New_York')}
    </main>
  );
}

