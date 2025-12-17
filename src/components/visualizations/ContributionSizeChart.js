import React from 'react';
import styled from 'styled-components';

const ChartContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
`;

const ChartTitle = styled.h3`
  margin-top: 0;
  color: #2c3e50;
  border-bottom: 2px solid #4a6fa5;
  padding-bottom: 0.75rem;
`;

const SizeBar = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
  height: 40px;
  background: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
`;

const BarSegment = styled.div`
  height: 100%;
  background: ${props => props.color};
  width: ${props => props.percentage}%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
  transition: width 0.3s ease;
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`;

const LegendColor = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: ${props => props.color};
`;

const ContributionSizeChart = ({ data }) => {
  // Categorize contributions by size
  const categories = [
    { label: 'Under $1M', max: 1000000, color: '#2e7d32' },
    { label: '$1M-$10M', max: 10000000, color: '#f57c00' },
    { label: '$10M-$50M', max: 50000000, color: '#d84315' },
    { label: 'Over $50M', max: Infinity, color: '#c62828' }
  ];

  const counts = categories.map(() => 0);
  data?.forEach(contrib => {
    const amount = contrib.amount || 0;
    for (let i = 0; i < categories.length; i++) {
      if (amount < categories[i].max) {
        counts[i]++;
        break;
      }
    }
  });

  const total = counts.reduce((sum, count) => sum + count, 0);

  return (
    <ChartContainer>
      <ChartTitle>💰 Contribution Size Distribution</ChartTitle>
      <p>How political money flows by contribution size</p>
      
      {categories.map((cat, index) => {
        const percentage = total > 0 ? (counts[index] / total) * 100 : 0;
        return (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span><strong>{cat.label}</strong></span>
              <span>{counts[index]} contributions ({percentage.toFixed(1)}%)</span>
            </div>
            <SizeBar>
              <BarSegment 
                color={cat.color} 
                percentage={percentage}
                title={`${counts[index]} contributions in ${cat.label} range`}
              >
                {percentage > 10 ? `${percentage.toFixed(0)}%` : ''}
              </BarSegment>
            </SizeBar>
          </div>
        );
      })}
      
      <Legend>
        {categories.map((cat, index) => (
          <LegendItem key={index}>
            <LegendColor color={cat.color} />
            <span>{cat.label}</span>
          </LegendItem>
        ))}
      </Legend>
    </ChartContainer>
  );
};

export default ContributionSizeChart;