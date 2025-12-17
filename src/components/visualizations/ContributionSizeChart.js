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
  font-size: 1.3rem;
`;

const ChartDescription = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
`;

const SizeBar = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
  height: 40px;
  background: #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
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
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  position: relative;
  z-index: 1;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.percentage < 10 ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)'};
    z-index: -1;
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
`;

const CategoryLabel = styled.span`
  font-weight: 600;
  color: #2c3e50;
`;

const CategoryStats = styled.span`
  color: #666;
  font-weight: 500;
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
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
  border: 1px solid rgba(0,0,0,0.1);
`;

const LegendText = styled.span`
  color: #444;
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
      <ChartDescription>How political money flows by contribution size</ChartDescription>
      
      {categories.map((cat, index) => {
        const percentage = total > 0 ? (counts[index] / total) * 100 : 0;
        const hasText = percentage > 8; // Only show text if bar is wide enough
        
        return (
          <div key={index} style={{ marginBottom: '1.5rem' }}>
            <CategoryHeader>
              <CategoryLabel>{cat.label}</CategoryLabel>
              <CategoryStats>
                {counts[index]} contribution{counts[index] !== 1 ? 's' : ''} ({percentage.toFixed(1)}%)
              </CategoryStats>
            </CategoryHeader>
            <SizeBar>
              <BarSegment 
                color={cat.color} 
                percentage={percentage}
                title={`${counts[index]} contributions (${percentage.toFixed(1)}%) in ${cat.label} range`}
              >
                {hasText ? `${percentage.toFixed(0)}%` : ''}
              </BarSegment>
              {!hasText && percentage > 0 && (
                <div style={{
                  position: 'absolute',
                  left: `${percentage}%`,
                  transform: 'translateX(4px)',
                  color: cat.color,
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap'
                }}>
                  {percentage.toFixed(0)}%
                </div>
              )}
            </SizeBar>
          </div>
        );
      })}
      
      <Legend>
        {categories.map((cat, index) => (
          <LegendItem key={index}>
            <LegendColor color={cat.color} />
            <LegendText>{cat.label}</LegendText>
          </LegendItem>
        ))}
      </Legend>
    </ChartContainer>
  );
};

export default ContributionSizeChart;