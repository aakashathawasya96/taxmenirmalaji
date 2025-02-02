import React, { useState } from 'react';
import './App.css';

function TaxCalculator() {
  const [salary, setSalary] = useState('');
  const [applyRebate, setApplyRebate] = useState(false);
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
    // First deduct standard deduction
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
    // First deduct standard deduction
    let taxableIncome = income - 75000;

    // Apply rebate if checkbox is checked and income is ≤ 12L
    if (applyRebate && income <= 1200000) {
      return 0;
    }

    let tax = 0;

    if (taxableIncome <= 400000) {
      tax = 0;
    } else if (taxableIncome <= 800000) {
      tax = (taxableIncome - 400000) * 0.05;
    } else if (taxableIncome <= 1200000) {
      tax = (800000 - 400000) * 0.05;
      tax += (taxableIncome - 800000) * 0.10;
    } else if (taxableIncome <= 1600000) {
      tax = (800000 - 400000) * 0.05;
      tax += (1200000 - 800000) * 0.10;
      tax += (taxableIncome - 1200000) * 0.15;
    } else if (taxableIncome <= 2000000) {
      tax = (800000 - 400000) * 0.05;
      tax += (1200000 - 800000) * 0.10;
      tax += (1600000 - 1200000) * 0.15;
      tax += (taxableIncome - 1600000) * 0.20;
    } else if (taxableIncome <= 2400000) {
      tax = (800000 - 400000) * 0.05;
      tax += (1200000 - 800000) * 0.10;
      tax += (1600000 - 1200000) * 0.15;
      tax += (2000000 - 1600000) * 0.20;
      tax += (taxableIncome - 2000000) * 0.25;
    } else {
      tax = (800000 - 400000) * 0.05;
      tax += (1200000 - 800000) * 0.10;
      tax += (1600000 - 1200000) * 0.15;
      tax += (2000000 - 1600000) * 0.20;
      tax += (2400000 - 2000000) * 0.25;
      tax += (taxableIncome - 2400000) * 0.30;
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

    const monthlyOldRegime = (income - oldTax) / 12;
    const monthlyNewRegime = (income - newTax) / 12;
    const monthlyPercentChange = ((monthlyNewRegime - monthlyOldRegime) / monthlyOldRegime) * 100;

    setResult({
      oldTax: Math.round(oldTax),
      newTax: Math.round(newTax),
      difference: Math.round(difference),
      monthlyOldRegime: Math.round(monthlyOldRegime),
      monthlyNewRegime: Math.round(monthlyNewRegime),
      monthlyPercentChange: monthlyPercentChange
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
    <div className="calculator">
      <div className="header">
        <h1>What's My Income Tax</h1>
        <h2>After Budget 2025</h2>
      </div>
      
      <div className="input-group">
        <label>Annual Salary (₹)</label>
        <input
          type="text"
          value={formatIndianNumber(salary)}
          onChange={handleInputChange}
          placeholder="Enter your annual salary"
        />
      </div>

      <div className="rebate-checkbox">
        <label>
          <input
            type="checkbox"
            checked={applyRebate}
            onChange={(e) => setApplyRebate(e.target.checked)}
          />
          Apply Rebate
        </label>
        {applyRebate && (
          <div className="rebate-info">
            No tax up to ₹12,00,000
          </div>
        )}
      </div>

      <button onClick={handleCalculate}>Tax Me Nirmala Ji</button>

      {result && (
        <div className="results">
          <div className="result-item">
            <h3>Tax under Old Regime:</h3>
            <p>₹{formatIndianNumber(result.oldTax)}</p>
          </div>
          <div className="result-item">
            <h3>Tax under New Regime:</h3>
            <p>₹{formatIndianNumber(result.newTax || 0)}</p>  
          </div>
          <div className="result-item difference">
            <h3>Difference:</h3>
            <p className={result.difference > 0 ? 'more' : 'less'}>
              ₹{formatIndianNumber(Math.abs(result.difference))}
              {result.difference > 0 ? ' more' : ' less'} in new regime
            </p>
          </div>
          <div className="result-item monthly-salary">
            <h3>Monthly In-Hand Salary:</h3>
            <div className="monthly-comparison">
              <p className="amount">₹{formatIndianNumber(result.monthlyNewRegime)}</p>
              <div className="change-indicator">
                <span className={`percentage ${result.monthlyPercentChange >= 0 ? 'increase' : 'decrease'}`}>
                  {result.monthlyPercentChange >= 0 ? '+' : ''}
                  {result.monthlyPercentChange.toFixed(1)}%
                  <span className="arrow-small">↑</span>
                </span>
              </div>
            </div>
          </div>
          
          <ShareButtons difference={result.difference} />
        <div className="share-section">
            <h3>Share Your Gains</h3>
            <ShareButtons difference={result.difference} />
        </div>
        
          <div className="disclaimer">
            This calculator provides an estimate and doesn't account for all deductions, exemptions, or tax rules. Consult a professional.
          </div>
        </div>
      )}
      
      <div className="footer">
        Made by <a href="https://x.com/AakashAtha" target="_blank" rel="noopener noreferrer">Aakash</a>
      </div>
    </div>
  );
}

export default TaxCalculator;
