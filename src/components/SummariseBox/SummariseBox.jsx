import { useEffect, useState } from 'react';
import { Loader } from '@mantine/core';
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { HttpRequest } from '@aws-sdk/protocol-http';
import { Sha256 } from '@aws-crypto/sha256-browser';
import './SummariseBox.css';

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const accessKeyId = import.meta.env.VITE_ACCESS_KEY;
const secretAccessKey = import.meta.env.VITE_SECRET_ACCESS_KEY;
const region = 'ap-south-1'; 
const service = 'execute-api'; // Always this for API Gateway

export default function SummaryOverlay({ fileName, onClose }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const waitForSummary = (fileName) => {
      return new Promise((resolve) => {
        const interval = setInterval(async () => {
          try {
            const url = new URL(baseUrl);
            // 1. Create the inner JSON string for fileName
            const innerFileNamePayload = JSON.stringify({ fileName });

            // 2. Create the final payload structure
            const body = JSON.stringify({
              body: innerFileNamePayload,
            });

            const request = new HttpRequest({
              method: 'POST',
              protocol: 'https:',
              path: url.pathname,
              headers: {
                'Content-Type': 'application/json',
                host: url.host,
              },
              hostname: url.host,
              body,
            });

            const signer = new SignatureV4({
              credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
              },
              region: region,
              service: service,
              sha256: Sha256,
            });            

            const signed = await signer.sign(request);

            const res = await fetch(baseUrl, {
              method: 'POST',
              headers: signed.headers,
              body,
            });

            const data = await res.json();
                       // --- START OF MODIFICATION ---
            // Parse the 'body' string into a JavaScript object
            let parsedBody = {};
            if (data.body) {
              try {
                parsedBody = JSON.parse(data.body);
              } catch (e) {
                console.error("Error parsing inner 'body' string:", e);
                // Handle parsing error if the inner body is not valid JSON
                // You might want to resolve with an error message here or continue polling
                return; // Stop processing this iteration if parsing fails
              }
            }

            // Now check the status from the parsed object
            if (parsedBody.status === 'completed') {
              clearInterval(interval);
              clearTimeout(timeout);
              resolve(parsedBody.summary); // Get summary from parsedBody
            }
            // --- END OF MODIFICATION ---
          } catch (err) {
            console.error('Polling error:', err);
          }
        }, 10000);

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
          ✖️
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
