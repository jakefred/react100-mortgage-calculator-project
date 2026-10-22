import './App.css'
import { useState } from 'react'

function App() {
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [principal, setPrincipal] = useState(0);
  const [monthlyInterestRate, setMonthlyInterestRate] = useState(0);
  const [numberOfPayments, setNumberOfPayments] = useState(15);
  const [clicked, setClicked] = useState(false);
  const [edited, setEdited] = useState(false);

  const updateBalance = (event) => {
    const input = event.currentTarget;
    const value = input.value.replaceAll(',', '');
    const amount = Number(value);
    const valid = /^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})$/.test(value)
      && amount >= 0.01 && amount <= 1000000000;

    input.setCustomValidity(value === '' || valid
      ? ''
      : 'Enter a loan balance from $0.01 to $1,000,000,000 with up to two decimal places.');
    setPrincipal(valid ? amount : 0);
  };

  const formatBalance = (event) => {
    const input = event.currentTarget;
    if (input.value === '' || !input.validity.valid) return;

    const value = input.value.replaceAll(',', '');
    input.value = Number(value).toLocaleString('en-US', {
      minimumFractionDigits: value.split('.')[1]?.length ?? 0,
      maximumFractionDigits: 2,
    });
  };

  const calculateMortgage = () => {
    setClicked(true);
    setMonthlyPayment(
      principal * (monthlyInterestRate * (1 + monthlyInterestRate)**numberOfPayments) /
      ((1 + monthlyInterestRate)**numberOfPayments - 1)
    );
  }

  return (
    <div className="site-shell">
      <main>
        <section className="intro" aria-labelledby="page-title">
          <h1 id="page-title">Mortgage Calculator</h1>
          <p className="intro-copy">Estimate your monthly principal and interest payment.</p>
        </section>
        <div className="calculator">
          <section className="loan-panel" aria-labelledby="loan-title">
            <div className="panel-heading">
              <h2 id="loan-title">The loan</h2>
              <p>Enter your loan details to see your monthly payment.</p>
            </div>
            <form onChange={() => setEdited(true)} onSubmit={(event) => { event.preventDefault(); calculateMortgage(); setEdited(false); }}>
              <div className="field">
                <label htmlFor="balance">Loan balance</label>
                <div className="input-wrap">
                  <span aria-hidden="true">$</span>
                  <input 
                    id="balance" 
                    type="text" 
                    inputMode="decimal" 
                    required placeholder="e.g. 350,000" 
                    data-testid="balance" 
                    aria-describedby="balance-help" 
                    onChange={(event) => {
                      updateBalance(event);
                      formatBalance(event);
                    }} 
                  />
                </div>
                <p id="balance-help" className="field-help">The amount borrowed, after your down payment.</p>
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="rate">Interest rate</label>
                  <div className="input-wrap suffix"><input id="rate" type="number" inputMode="decimal" min="0.01" max="100" step="0.01" required placeholder="e.g. 6.25" data-testid="rate" aria-describedby="rate-help" onChange={(event) => setMonthlyInterestRate(event.target.value / 12 / 100)} /><span aria-hidden="true">%</span></div>
                  <p id="rate-help" className="field-help">Your annual interest rate.</p>
                </div>
                <div className="field">
                  <label htmlFor="term">Loan term</label>
                  <div className="input-wrap select-wrap">
                    <select id="term" data-testid="term" defaultValue="" required aria-describedby="term-help" onChange={(event) => setNumberOfPayments(event.target.value * 12)}><option value="" disabled>Select term</option><option value={15}>15 years</option><option value={30}>30 years</option></select>
                    <svg className="select-chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" /></svg>
                  </div>
                  <p id="term-help" className="field-help">The length of your loan.</p>
                </div>
              </div>
              <button className="calculate-button" type="submit" value="calculate" data-testid="submit">Calculate payment <span aria-hidden="true">→</span></button>

            </form>
          </section>
          <section className="result-panel" aria-labelledby="result-title">
            <div className="result-heading"><h2 id="result-title">The monthly payment</h2><span>Fixed rate</span></div>
            <div className="payment-area" aria-live="polite" aria-atomic="true">
              <p className="payment-label">Principal &amp; interest</p>
              {clicked ? <p className="payment" data-testid="output"><span className="payment-value">${monthlyPayment.toFixed(2)}</span><span className="payment-caption"> is your payment</span></p> : <p className="payment placeholder-payment">$<span>—</span><span className="per-month"> / month</span></p>}
              {clicked && <p className="result-status">{edited ? 'Details changed. Calculate again to update your estimate.' : 'Your monthly principal & interest payment.'}</p>}
            </div>
            <div className="house-art" aria-hidden="true">
              <svg viewBox="0 0 560 170" fill="none">
                <g stroke="#bfc4ac" strokeWidth="1" strokeLinejoin="miter">
                  <path d="M8 150h544M38 150V88h144m-157 0 43-52h128m-153 52 34-43h112M42 93h140" />
                  <path d="M168 150V66L280 7l112 59v84M155 69 280 0l125 69M169 61 280 10l112 51" strokeWidth="1.6" />
                  <path d="M378 88h145l-35-52H365m20 9h96l26 43M392 93h126v57M235 25V8h-18v28" />
                  <path d="M180 73h200M180 79h200M197 150V79m166 0v71M188 150V79m184 0v71M224 150V89h35v61M300 150V89h35v61" />
                  <path d="M268 150V87h24v63m-20-8V94h16v48M285 121h2M264 150v6h33v-6M257 156v6h46v-6" />
                  <path d="M72 106h30v31H72v-31Zm15 0v31m-15-16h30M124 106h30v31h-30v-31Zm15 0v31m-15-16h30M407 106h30v31h-30v-31Zm15 0v31m-15-16h30M459 106h30v31h-30v-31Zm15 0v31m-15-16h30" />
                  <path d="M229 94h25v37h-25V94Zm12 0v37m-12-19h25M305 94h25v37h-25V94Zm12 0v37m-12-19h25M269 40h22v22h-22V40Zm11 0v22m-11-11h22" />
                  <path d="M193 137h69m36 0h69M193 143h69m36 0h69M46 143h117m235 0h112M53 80l24-31m-9 31 24-31m-9 31 24-31m-9 31 24-31m-9 31 24-31m-9 31 24-31m-9 31 24-31m-9 31 24-31M398 49l22 31m-7-31 22 31m-7-31 22 31m-7-31 22 31m-7-31 22 31m-7-31 22 31" strokeOpacity=".4" />
                </g>
              </svg>
            </div>
            <div className="result-footnote"><p>Excludes property taxes, insurance & HOA fees.</p></div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
