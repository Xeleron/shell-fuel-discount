import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [results, setResults] = useState('');

  const getParticipationId = () => {
    fetch(
      'https://tankenrubbelnsparen.at/api/participations?url=tankenrubbelnsparen.at',
      {
        method: 'POST',
        body: '{}',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        getPrizeId(result.participationId);
      });
  };

  const getPrizeId = (partId: string) => {
    fetch(`https://tankenrubbelnsparen.at/api/participations/${partId}`, {
      method: 'POST',
      body: JSON.stringify({ flow: '1' }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setCount((currCount) => currCount + 1);
        setResults(
          (currResults) =>
            `${currResults}\n${result.name} https://tankenrubbelnsparen.at/go?participationId=${partId}&prizeId=${result.prizeId}`
        );
        if (result.name == '8 cent pro liter fuel discount') {
          const newWindow = window.open(
            `https://tankenrubbelnsparen.at/go?participationId=${partId}&prizeId=${result.prizeId}`,
            '_blank',
            'noopener,noreferrer'
          );
          if (newWindow) newWindow.opener = null;
        } else {
          getParticipationId();
        }
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <button type="button" onClick={getParticipationId}>
          Claim 8 ct pro liter fuel discount
        </button>
        <p>Number of tries: {count}</p>
        <textarea readOnly value={results}></textarea>
      </header>
    </div>
  );
}

export default App;
