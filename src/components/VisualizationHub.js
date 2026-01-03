// src/components/VisualizationHub.js - FIXED VERSION
import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import styled from "styled-components";
import RecipientFlowChart from "./visualizations/RecipientFlowChart";

const Container = styled.div`
  padding: 2rem;
  background: #0A1D3F;
  border-radius: 12px;
  border: 1px solid rgba(0, 229, 255, 0.3);
  margin: 2rem 0;
  color: #FFFFFF;
`;

const Title = styled.h2`
  color: #00E5FF;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
`;

const ChartCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 229, 255, 0.2);
  color: #FFFFFF;
`;

const ChartTitle = styled.h3`
  color: #00E5FF;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 0.75rem;
  background: rgba(0, 229, 255, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(0, 229, 255, 0.2);
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #00E5FF;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: #CCCCCC;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const VisualizationHub = () => {
  const data = useStaticQuery(graphql`
    query VisualizationData {
      allMoneyTrail(limit: 50, sort: {contribution_receipt_amount: DESC}) {
        nodes {
          contributor_name
          contribution_receipt_amount
          committee_name
          contributor_state
          party_full
        }
      }
      metadata: moneyTrailMetadata {
        total_amount
        total_contributions
      }
    }
  `);

  const contributions = data.allMoneyTrail?.nodes || [];
  const metadata = data.metadata || {};

  // Calculate stats for visualizations
  const totalAmount = metadata.total_amount || 0;
  const totalContributions = metadata.total_contributions || contributions.length;
  
  // Group by recipient
  const recipientMap = {};
  contributions.forEach(contrib => {
    const recipient = contrib.committee_name || 'Unknown';
    recipientMap[recipient] = (recipientMap[recipient] || 0) + (contrib.contribution_receipt_amount || 0);
  });
  
  // Group by state
  const stateMap = {};
  contributions.forEach(contrib => {
    const state = contrib.contributor_state || 'Unknown';
    stateMap[state] = (stateMap[state] || 0) + (contrib.contribution_receipt_amount || 0);
  });

  const formatCurrency = (amount) => {
    if (!amount) return '$0';
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(1)}K`;
  };

  return (
    <Container>
      <Title>Data Visualizations</Title>
      <p style={{ color: '#CCCCCC', marginBottom: '1.5rem' }}>
        Interactive charts revealing patterns in campaign finance data. Hover over elements for details.
      </p>
      
      <ChartsGrid>
        {/* Top Recipients Chart */}
        <ChartCard>
          <ChartTitle>
            <span>🏛️</span> Top Recipients
          </ChartTitle>
          <p style={{ color: '#CCCCCC', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Where the money flows - committees receiving most contributions
          </p>
          
          <RecipientFlowChart data={recipientMap} />
          
          <StatGrid>
            <StatItem>
              <StatValue>{Object.keys(recipientMap).length}</StatValue>
              <StatLabel>Unique Recipients</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{formatCurrency(totalAmount)}</StatValue>
              <StatLabel>Total to Top 50</StatLabel>
            </StatItem>
          </StatGrid>
        </ChartCard>
        
        {/* Geographic Flow Chart */}
        <ChartCard>
          <ChartTitle>
            <span>📍</span> Geographic Flow
          </ChartTitle>
          <p style={{ color: '#CCCCCC', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Political contributions by state - geographic concentration
          </p>
          
          <div style={{ 
            height: '200px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'rgba(0, 229, 255, 0.05)',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            <div style={{ textAlign: 'center', color: '#00E5FF' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🗺️</div>
              <div>State-by-state visualization</div>
              <div style={{ fontSize: '0.8rem', color: '#CCCCCC' }}>Data loaded: {Object.keys(stateMap).length} states</div>
            </div>
          </div>
          
          <StatGrid>
            <StatItem>
              <StatValue>{Object.keys(stateMap).length}</StatValue>
              <StatLabel>States with Contributions</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>
                {Object.keys(stateMap).slice(0, 3).map(state => `${state} `)}
              </StatValue>
              <StatLabel>Top States</StatLabel>
            </StatItem>
          </StatGrid>
        </ChartCard>
        
        {/* Contribution Size Distribution */}
        <ChartCard>
          <ChartTitle>
            <span>💰</span> Contribution Size Distribution
          </ChartTitle>
          <p style={{ color: '#CCCCCC', fontSize: '0.9rem', marginBottom: '1rem' }}>
            How political money flows by donation size categories
          </p>
          
          <div style={{ 
            height: '200px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'rgba(0, 229, 255, 0.05)',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            <div style={{ textAlign: 'center', color: '#00E5FF' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
              <div>Size distribution chart</div>
              <div style={{ fontSize: '0.8rem', color: '#CCCCCC' }}>{totalContributions} contributions analyzed</div>
            </div>
          </div>
          
          <StatGrid>
            <StatItem>
              <StatValue>{formatCurrency(totalAmount)}</StatValue>
              <StatLabel>Total Tracked</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{totalContributions}</StatValue>
              <StatLabel>Contributions</StatLabel>
            </StatItem>
          </StatGrid>
        </ChartCard>
      </ChartsGrid>
    </Container>
  );
};

export default VisualizationHub;