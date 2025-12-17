import React from 'react';
import styled from 'styled-components';

const RoadmapContainer = styled.section`
  padding: 4rem 2rem;
  background: #0A1D3F;
  position: relative;
`;
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  color: #00E5FF;
  font-size: 2.2rem;
  margin-bottom: 1rem;
`;

const SectionSubtitle = styled.p`
  color: #cccccc;
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
`;

const PhaseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const PhaseCard = styled.div`
  background: ${props => props.active ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)'};
  border: 2px solid ${props => props.active ? '#00E5FF' : '#444'};
  border-radius: 16px;
  padding: 2rem;
  position: relative;
  transition: all 0.3s ease;
  cursor: ${props => props.active ? 'pointer' : 'not-allowed'};
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: ${props => props.active ? 'translateY(-8px)' : 'none'};
    border-color: ${props => props.active ? '#00E5FF' : '#444'};
    box-shadow: ${props => props.active ? '0 15px 30px rgba(0, 229, 255, 0.2)' : 'none'};
  }
`;

const PhaseBadge = styled.div`
  position: absolute;
  top: -12px;
  right: 20px;
  background: ${props => 
    props.status === 'complete' ? '#2e7d32' : 
    props.status === 'active' ? '#f57c00' : '#757575'};
  color: white;
  padding: 0.4rem 1.2rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PhaseNumber = styled.div`
  font-size: 3rem;
  font-weight: 900;
  color: ${props => props.active ? '#00E5FF' : '#666'};
  opacity: 0.3;
  margin-bottom: 0.5rem;
  line-height: 1;
`;

const PhaseName = styled.h3`
  color: ${props => props.active ? '#ffffff' : '#aaa'};
  margin: 0.5rem 0 1rem;
  font-size: 1.4rem;
  min-height: 3.5rem;
`;

const PhaseDescription = styled.p`
  color: ${props => props.active ? '#cccccc' : '#777'};
  font-size: 0.95rem;
  line-height: 1.6;
  flex-grow: 1;
  margin-bottom: 1.5rem;
`;

const PhaseFeatures = styled.ul`
  color: ${props => props.active ? '#aaaaaa' : '#666'};
  font-size: 0.9rem;
  padding-left: 1.2rem;
  margin: 0;
  
  li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }
`;

const CurrentFocus = styled.div`
  background: rgba(0, 229, 255, 0.05);
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
  text-align: center;
  
  strong {
    color: #00E5FF;
  }
`;

const GlobalMapRoadmap = () => {
  const phases = [
    {
      number: '1-3',
      name: 'United States Foundation',
      description: 'Complete analysis of US campaign finance, congressional voting, and lobbying data. Establishes the core Triangulation Engine methodology.',
      status: 'complete',
      active: true,
      features: [
        'FEC campaign contributions',
        'Congress.gov legislative tracking',
        'Lobbying disclosure analysis',
        'State-level transparency scoring'
      ]
    },
    {
      number: '4',
      name: 'European Union Expansion',
      description: 'EU Transparency Register, European Parliament voting, and member state lobbying registries. First international implementation.',
      status: 'planned',
      active: false,
      features: [
        'EU Transparency Register data',
        'European Parliament votes',
        'Cross-border lobbying tracking',
        'Multi-language support'
      ]
    },
    {
      number: '5',
      name: 'Global South & Emerging Democracies',
      description: 'Anti-corruption agency data, developing democracy monitoring, and civil society partnership models.',
      status: 'planned',
      active: false,
      features: [
        'Indonesia corruption monitoring',
        'African transparency initiatives',
        'Civil society API access',
        'Mobile-first interfaces'
      ]
    }
  ];

  const handlePhaseClick = (phase) => {
    if (phase.active) {
      if (phase.number === '1-3') {
        document.getElementById('quick-stats')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      alert(`${phase.name} is planned for future development. Currently focusing on US implementation.`);
    }
  };

  return (
    <RoadmapContainer id="global-roadmap">
      <Container>
        <SectionHeader>
          <SectionTitle>Global Transparency Roadmap</SectionTitle>
          <SectionSubtitle>
            Building accountability tools region by region. Select a region to explore available data 
            or view our development timeline.
          </SectionSubtitle>
        </SectionHeader>
        
        <PhaseGrid>
          {phases.map((phase, index) => (
            <PhaseCard 
              key={index} 
              active={phase.active}
              onClick={() => handlePhaseClick(phase)}
              title={phase.active ? `Explore ${phase.name} data` : 'Coming soon'}
            >
              <PhaseBadge status={phase.status}>
                {phase.status === 'complete' ? '✅ Live' : 
                 phase.status === 'active' ? '🚀 Active' : '📅 Planned'}
              </PhaseBadge>
              
              <PhaseNumber active={phase.active}>{phase.number}</PhaseNumber>
              <PhaseName active={phase.active}>{phase.name}</PhaseName>
              <PhaseDescription active={phase.active}>
                {phase.description}
              </PhaseDescription>
              
              <PhaseFeatures active={phase.active}>
                {phase.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </PhaseFeatures>
            </PhaseCard>
          ))}
        </PhaseGrid>
        
        <CurrentFocus>
          <p>
            <strong>Current Focus:</strong> Phase 1-3 (United States) implementation complete. 
            Exploring ${(934553461.79/1000000).toFixed(0)}M in campaign contributions across {25} records.
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>
            Click "United States Foundation" above to explore current data
          </p>
        </CurrentFocus>
      </Container>
    </RoadmapContainer>
  );
};

export default GlobalMapRoadmap;