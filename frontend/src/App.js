import React, { useState } from 'react';
import './App.css';

function App() {
  const [videoId, setVideoId] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('es'); // Default to Spanish
  const [responseData, setResponseData] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle form submission to call the backend API
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResponseData({});

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId, targetLanguage }),
      });
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      setResponseData(data);
    } catch (error) {
      console.error('Error:', error);
      setResponseData({ message: 'An error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>YouTube Language Translator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="videoId">YouTube Video ID:</label>
          <input
            id="videoId"
            type="text"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            placeholder="Enter video ID"
            required
          />
        </div>
        <div>
          <label htmlFor="targetLanguage">Target Language Code:</label>
          <input
            id="targetLanguage"
            type="text"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            placeholder="e.g., es, fr, de"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Translate'}
        </button>
      </form>
      {responseData.message && (
        <div className="response">
          <h2>Response</h2>
          <p>{responseData.message}</p>
          {responseData.audioUrl && (
            <div>
              <audio controls src={responseData.audioUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

/*
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/
