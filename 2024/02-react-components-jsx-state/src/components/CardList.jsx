import Card from './Card';
import viteLogo from '/vite.svg';
import reactLogo from '/react.svg';
import angularLogo from '/angular.png';
import qwikLogo from '/qwik.png';

import Button from './Button';

import { libraries } from '../utils/libraries';

const CardList = () => {
  const librariesData = [
    {
      id: 0,
      name: 'vite',
      logo: viteLogo,
      url: libraries.vite.url,
      alt: libraries.vite.description
    },
    {
      id: 1,
      name: 'react',
      logo: reactLogo,
      url: libraries.react.url,
      alt: libraries.react.description
    },
    {
      id: 2,
      name: 'angular',
      logo: angularLogo,
      url: libraries.angular.url,
      alt: libraries.angular.description
    },
    {
      id: 3,
      name: 'qwik',
      logo: qwikLogo,
      url: libraries.qwik.url,
      alt: libraries.qwik.description
    }
  ];

  return (
    <div style={{ display: 'inline-flex'}}>
      {librariesData.map(library => (
        <Card key={library.id} ButtonComponent={Button}  {...library} />
      ))}
    </div>
  );
};

export default CardList;