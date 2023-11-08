import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Stack, Slider } from '@mui/material';

import BarChart from './bar-chart';

export function App() {
  const [ data, setData ] = useState<any[] | undefined>(undefined);
  const [ range, setRange ] = useState([0, 15]);

  useEffect(() => {
    if(data) return;

    let subscribed = true;

    d3.csv('/assets/repos.csv').then(data => {
      if(!subscribed) return;
      setData(data);
    });

    return () => {
      subscribed = false;
    };
  }, [ data ]);

  const normalizedData = useMemo(() => data?.slice(...range).map(({ language, num_repos }) => ({
    name: language,
    value: parseInt(num_repos)
  })), [data, range])

  return (
    <>
        <BarChart
          margin={{ left: 100, right: 10, top: 10, bottom: 100 }}
          width={600}
          height={400}
          data={normalizedData}
        />

        <Slider
          aria-label="Languages"
          defaultValue={range}
          getAriaValueText={(value) => `${value} languages`}
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={d3.max(data || [], ({ value } : any) => value)}
          onChange={(event, value) => {
            if(Array.isArray(value)) setRange(value);
          }}
        />
    </>
  );
}

export default App;
