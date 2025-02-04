import React, { useState } from 'react';
import './App.css';
import nirmalaji from '/nirmalaji.png';  // Added this import

function TaxCalculator() {
  const [salary, setSalary] = useState('');
  const [result, setResult] = useState(null);

  const formatIndianNumber = (num) => {
    if (!num) return '';
    const number = num.toString();
    let lastThree = number.substring(number.length - 3);
    let otherNumbers = number.substring(0, number.length - 3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    let formattedNumber = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return formattedNumber;
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setSalary(value);
  };

  const calculateOldRegimeTax = (income) => {
    let taxableIncome = income - 50000;
    let tax = 0;

    if (taxableIncome <= 250000) {
      tax = 0;
    } else if (taxableIncome <= 500000) {
      tax = (taxableIncome - 250000) * 0.05;
    } else if (taxableIncome <= 1000000) {
      tax = (500000 - 250000) * 0.05;
      tax += (taxableIncome - 500000) * 0.20;
    } else {
      tax = (500000 - 250000) * 0.05;
      tax += (1000000 - 500000) * 0.20;
      tax += (taxableIncome - 1000000) * 0.30;
    }

    return tax;
  };

  const calculateNewRegimeTax = (income) => {
    let taxableIncome = income - 75000;
    let tax = 0;

    if (income <= 1275000) {
      return 0;
    }

    if (taxableIncome <= 300000) {
      tax = 0;
    } else if (taxableIncome <= 700000) {
      tax = (taxableIncome - 300000) * 0.05;
    } else if (taxableIncome <= 1000000) {
      tax = (700000 - 300000) * 0.05;
      tax += (taxableIncome - 700000) * 0.10;
    } else if (taxableIncome <= 1200000) {
      tax = (700000 - 300000) * 0.05;
      tax += (1000000 - 700000) * 0.10;
      tax += (taxableIncome - 1000000) * 0.15;
    } else if (taxableIncome <= 1500000) {
      tax = (700000 - 300000) * 0.05;
      tax += (1000000 - 700000) * 0.10;
      tax += (1200000 - 1000000) * 0.15;
      tax += (taxableIncome - 1200000) * 0.20;
    } else {
      tax = (700000 - 300000) * 0.05;
      tax += (1000000 - 700000) * 0.10;
      tax += (1200000 - 1000000) * 0.15;
      tax += (1500000 - 1200000) * 0.20;
      tax += (taxableIncome - 1500000) * 0.30;
    }

    return tax;
  };

  const handleCalculate = () => {
    const income = Number(salary);
    if (!income || income < 0) {
      alert('Please enter a valid salary');
      return;
    }

    const oldTax = calculateOldRegimeTax(income);
    const newTax = calculateNewRegimeTax(income);
    const difference = newTax - oldTax;

    setResult({
      oldTax: Math.round(oldTax),
      newTax: Math.round(newTax),
      difference: Math.round(difference)
    });
  };

  const ShareButtons = ({ difference }) => {
    const shareText = `Thanks to Nirmala Ji 🙏 I am paying ₹${formatIndianNumber(Math.abs(difference))} ${difference > 0 ? 'more' : 'less'} in the new regime.\n\nCheck out → taxmenirmalaji.vercel.app`;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=taxmenirmalaji.vercel.app&summary=${encodeURIComponent(shareText)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=taxmenirmalaji.vercel.app&quote=${encodeURIComponent(shareText)}`
    };

    return (
      <div className="share-buttons">
        <button 
          onClick={() => window.open(shareUrls.twitter, '_blank')}
          className="share-button twitter"
        >
          𝕏
        </button>
        <button 
          onClick={() => window.open(shareUrls.linkedin, '_blank')}
          className="share-button linkedin"
        >
          in
        </button>
        <button 
          onClick={() => window.open(shareUrls.facebook, '_blank')}
          className="share-button facebook"
        >
          f
        </button>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="calculator">
        <h1>What's My Salary?</h1>
        <h2>After Budget 2025</h2>
        
        <div className="input-group">
          <label>Annual Salary (₹)</label>
          <input
            type="text"
            value={formatIndianNumber(salary)}
            onChange={handleInputChange}
            placeholder="Enter your annual salary"
          />
        </div>

        <button onClick={handleCalculate}>Tax Me Nirmala Ji</button>
        <div className="tax-disclaimer">
          Tax rebate applicable on a salary of ₹12.75L and lower
        </div>

        {result && (
          <div className="results">
            <div className="tax-comparison">
              <div className="result-item old-regime">
                <h3>Tax under Old Regime:</h3>
                <p className="tax-amount">₹{formatIndianNumber(result.oldTax)}</p>
                <p className="effective-rate">
                  Effective Rate: {((result.oldTax / Number(salary)) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="result-item new-regime">
                <h3>Tax under New Regime:</h3>
                <p className="tax-amount">₹{formatIndianNumber(result.newTax)}</p>
                <p className="effective-rate">
                  Effective Rate: {((result.newTax / Number(salary)) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="result-item difference">
              <h3>Difference:</h3>
              <p className={result.difference > 0 ? 'more' : 'less'}>
                <span className="amount">₹{formatIndianNumber(Math.abs(result.difference))}</span>
                <span className="description">
                  {result.difference > 0 ? 'more' : 'less'} in new regime
                </span>
              </p>
            </div>
            <ShareButtons difference={result.difference} />
          </div>
        )}
        
        <div className="footer">
          Made by <a href="https://x.com/AakashAtha" target="_blank" rel="noopener noreferrer">Aakash</a>
        </div>
      </div>
      <div className="background-container">
        <img 
          src={nirmalaji} 
          alt="Nirmala Ji"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>
    </div>
  );
}

export default TaxCalculator;
