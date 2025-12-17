import React from 'react';
import styled from 'styled-components';
import moneyTrailData from '../data/moneyTrail.json';

const StatsContainer = styled.section`
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #152642 0%, #0A1D3F 100%);
  id: quick-stats;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  color: #ffffff;
  text-align: center;
  margin-bottom: 2.5rem;
  font-size: 1.8rem;
  
  span {
    color: #00E5FF;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 229, 255, 0.1);
  border-radius: 12px;
  padding: 2rem 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    border-color: #00E5FF;
    box-shadow: 0 10px 25px rgba(0, 229, 255, 0.15);
    
    &:before {
      opacity: 0.1;
    }
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: #00E5FF;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
`;

const StatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  opacity: 0.8;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 0.5rem;
  line-height: 1;
  
  .small {
    font-size: 1.8rem;
  }
`;

const StatLabel = styled.div`
  color: #cccccc;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
`;

const StatSubtext = styled.div`
  color: #888;
  font-size: 0.85rem;
  font-style: italic;
`;

const QuickStats = () => {
  const { results } = moneyTrailData || {};
  const totalContributions = results?.length || 0;
  const totalAmount = results?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  const avgAmount = totalAmount / totalContributions || 0;
  
  // Find top state
  const stateMap = {};
  results?.forEach(contrib => {
    const state = contrib.state;
    if (state && state !== 'N/A') {
      stateMap[state] = (stateMap[state] || 0) + (contrib.amount || 0);
    }
  });
  const topState = Object.entries(stateMap).sort((a, b) => b[1] - a[1])[0] || ['N/A', 0];
  
  // Find largest single contribution
  const largestContribution = results?.reduce((max, item) => 
    Math.max(max, item.amount || 0), 0) || 0;

  return (
    <StatsContainer id="quick-stats">
      <Container>
        <SectionTitle>
          US Campaign Finance <span>At a Glance</span>
        </SectionTitle>
        
        <StatsGrid>
          <StatCard>
            <StatIcon>💰</StatIcon>
            <StatValue>
              ${(totalAmount / 1000000000).toFixed(1)}<span className="small">B</span>
            </StatValue>
            <StatLabel>Total Tracked</StatLabel>
            <StatSubtext>In political contributions</StatSubtext>
          </StatCard>
          
          <StatCard>
            <StatIcon>📊</StatIcon>
            <StatValue>{totalContributions.toLocaleString()}</StatValue>
            <StatLabel>Contributions</StatLabel>
            <StatSubtext>Individual records analyzed</StatSubtext>
          </StatCard>
          
          <StatCard>
            <StatIcon>📈</StatIcon>
            <StatValue>
              ${(avgAmount / 1000000).toFixed(1)}<span className="small">M</span>
            </StatValue>
            <StatLabel>Average Donation</StatLabel>
            <StatSubtext>Per contribution (mean)</StatSubtext>
          </StatCard>
          
          <StatCard>
            <StatIcon>📍</StatIcon>
            <StatValue>{topState[0]}</StatValue>
            <StatLabel>Top Contributing State</StatLabel>
            <StatSubtext>
              ${(topState[1] / 1000000).toFixed(0)}M from {topState[0]}
            </StatSubtext>
          </StatCard>
          
          <StatCard>
            <StatIcon>🏛️</StatIcon>
            <StatValue>
              ${(largestContribution / 1000000).toFixed(0)}<span className="small">M</span>
            </StatValue>
            <StatLabel>Largest Single Contribution</StatLabel>
            <StatSubtext>Maximum donation size</StatSubtext>
          </StatCard>
          
          <StatCard>
            <StatIcon>⏱️</StatIcon>
            <StatValue>2024</StatValue>
            <StatLabel>Primary Election Cycle</StatLabel>
            <StatSubtext>Most recent complete data</StatSubtext>
          </StatCard>
        </StatsGrid>
      </Container>
    </StatsContainer>
  );
};

export default QuickStats;