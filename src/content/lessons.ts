export type Lesson = { id: string; title: string; summary: string; body: string };

// Short, general explanations of Canadian investing basics. Rules change; the app links users to CRA for current limits.
export const LESSONS: Lesson[] = [
  {
    id: 'compounding',
    title: 'Why starting early matters',
    summary: 'Growth earns growth.',
    body:
      'When an investment grows, next year’s growth is calculated on the bigger balance. Over long periods this compounding can contribute more than your deposits. Open any goal to see how much of the projected balance comes from contributions and how much from growth.',
  },
  {
    id: 'tfsa',
    title: 'TFSA: tax-free growth',
    summary: 'No tax on growth or withdrawals.',
    body:
      'A Tax-Free Savings Account is available to Canadian residents aged 18 or older with a valid SIN. Contributions are not tax-deductible, but investment growth and withdrawals are tax-free. Contribution room builds up every year from age 18, unused room carries forward, and amounts you withdraw are added back to your room the following calendar year. Check the CRA site for this year’s limit.',
  },
  {
    id: 'rrsp',
    title: 'RRSP: save tax now, pay it later',
    summary: 'Deduct today, taxed on withdrawal.',
    body:
      'Registered Retirement Savings Plan contributions reduce your taxable income now; withdrawals are taxed as income later. Room is based on earned income from the previous year, up to an annual maximum. RRSPs tend to suit people who expect a lower tax rate when they withdraw than when they contribute.',
  },
  {
    id: 'fhsa',
    title: 'FHSA: saving for a first home',
    summary: 'Deductible in, tax-free out for a first home.',
    body:
      'A First Home Savings Account combines both: contributions are deductible like an RRSP, and qualifying withdrawals to buy a first home are tax-free like a TFSA. The limit is $8,000 a year and $40,000 over your lifetime.',
  },
  {
    id: 'etf',
    title: 'ETFs and diversification',
    summary: 'Many companies in one purchase.',
    body:
      'An exchange-traded fund holds a basket of investments, such as hundreds of companies, and trades like a single stock. Spreading money across many holdings means one company’s bad year has less effect on your goal. Compare the fund’s fee (MER): a 1% difference compounds just like returns do.',
  },
  {
    id: 'risk',
    title: 'Risk and time horizon',
    summary: 'Short goals need steadier money.',
    body:
      'Growth portfolios can rise more over time but also fall further in a bad year. For a goal a year or two away there is little time to recover from a drop, so a conservative mix is common. That is why each goal shows a range: the low line is what a weak market could look like.',
  },
];
