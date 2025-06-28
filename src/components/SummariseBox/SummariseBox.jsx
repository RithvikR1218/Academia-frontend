import { useEffect, useState } from 'react';
import { Loader } from '@mantine/core';
import './SummariseBox.css';

const baseUrl = import.meta.env.VITE_API_BASE_URL;
export default function SummaryOverlay({ fileName, onClose }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const waitForSummary = (fileName) => {
      return new Promise((resolve) => {
        const interval = setInterval(async () => {
          try {
            const res = await fetch(`${baseUrl}fileName=${fileName}`);//change this if required
            const data = await res.json();
            if (data.status === 'completed') {
              clearInterval(interval);
              clearTimeout(timeout);
              resolve(data.summary);
            }
          } catch (err) {
            console.error('Polling error:', err);
          }
        }, 5000);

        const timeout = setTimeout(() => {
          clearInterval(interval);
          resolve('❌ Summary generation timed out.');
        }, 180000);
      });
    };

    waitForSummary(fileName).then((result) => {
      setSummary(result);
      setLoading(false);
    });
  }, [fileName]);

  return (
    <div className="summary-overlay">
      <div className="summary-content">
        <button className="summary-close-button" onClick={onClose}>
          ❌
        </button>
        <h2>
          Summary for <span style={{ fontWeight: 500 }}>{fileName}</span>
        </h2>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            <Loader color="blue" size="md" variant="dots" />
          </div>
        ) : (
          <p>{summary}</p>
        )}
      </div>
    </div>
  );
}
