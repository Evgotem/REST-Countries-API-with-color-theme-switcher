import React from 'react';
import { useNavigate } from 'react-router-dom';

import { List } from '../components/List';
import { Card } from '../components/Card';
import { Controls } from '../components/Controls';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllCountries, selectCountriesInfo, selectVisibleCountries } from '../store/countries/countries-selector';
import { loadCountries } from '../store/countries/countries-actions';
import { selectControls, selectSearch } from '../store/controls/controls-selector';

export const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {search, region} = useSelector(selectControls);
  const countries = useSelector(state => selectVisibleCountries(state, {search, region}));
  const { status, error, qty } = useSelector(selectCountriesInfo);


  React.useEffect(() => {
    if (!qty) {
      dispatch(loadCountries());
    }
  }, [qty, dispatch]);

  return (
    <>
      <Controls />

      {error && <h2>Can't fetch data</h2>}
      {status === 'loading' && <div style={{marginTop: '15px'}}><img src="img/loader.gif" alt='...loading' /></div>}

      {status === 'received' && (
        <List>
          {countries.map((c) => {
            const countryInfo = {
              img: c.flags.png,
              name: c.name,
              info: [
                {
                  title: 'Population',
                  description: c.population.toLocaleString(),
                },
                {
                  title: 'Region',
                  description: c.region,
                },
                {
                  title: 'Capital',
                  description: c.capital,
                },
              ],
            };

            return (
              <Card key={c.name} onClick={() => navigate(`/country/${c.name}`)} {...countryInfo} />
            );
          })}
        </List>
      )}
    </>
  );
};
