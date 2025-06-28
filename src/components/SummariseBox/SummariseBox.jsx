import './SummariseBox.css';

export default function SummariseBox({ fileName, onClose }) {
  return (
    <div className="summary-overlay">
      <div className="summary-content">
        <button className="summary-close-button" onClick={onClose}>
          ❌
        </button>
        <h2>Summary for <span style={{ fontWeight: 500 }}>{fileName}</span></h2>
        <p>This is your summary output.</p>
      </div>
    </div>
  );
}
