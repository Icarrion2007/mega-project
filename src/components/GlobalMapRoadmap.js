import React from 'react';
import styled from 'styled-components';

const RoadmapContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed #00E5FF;
  border-radius: 16px;
  padding: 2.5rem;
  margin: 3rem auto;
  max-width: 1000px;
  text-align: center;
`;

const RoadmapTitle = styled.h2`
  color: #00E5FF;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const PhaseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 2.5rem 0;
`;

const PhaseCard = styled.div`
  background: ${props => props.active ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${props => props.active ? '#00E5FF' : '#444'};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: left;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 229, 255, 0.15);
  }
`;

const PhaseStatus = styled.div`
  position: absolute;
  top: -10px;
  right: 20px;
  background: ${props => 
    props.status === 'complete' ? '#2e7d32' : 
    props.status === 'active' ? '#f57c00' : '#757575'};
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const PhaseNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  color: ${props => props.active ? '#00E5FF' : '#666'};
  opacity: 0.3;
  margin-bottom: 0.5rem;
`;

const PhaseName = styled.h3`
  color: ${props => props.active ? '#ffffff' : '#aaa'};
  margin: 0.5rem 0;
  font-size: 1.3rem;
`;

const PhaseDescription = styled.p`
  color: ${props => props.active ? '#cccccc' : '#777'};
  font-size: 0.95rem;
  line-height: 1.6;
`;

const GlobeIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: radial-gradient(circle, #00E5FF 0%, #0A1D3F 70%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  box-shadow: 0 0 30px rgba(0, 229, 255, 0.5);
`;

const CallToAction = styled.div`
  margin-top: 2rem;
  color: #ccc;
  font-size: 1.1rem;
  
  strong {
    color: #00E5FF;
  }
`;

const GlobalMapRoadmap = () => {
  const phases = [
    {
      number: '1-3',
      name: 'United States Foundation',
      description: 'FEC campaign finance data, Congressional tracking, transparency scoring. Establishes the core Triangulation Engine.',
      status: 'complete',
      active: true
    },
    {
      number: '4',
      name: 'European Union Expansion',
      description: 'EU Transparency Register, European Parliament voting records, lobbyist registries. First international expansion.',
      status: 'planned',
      active: false
    },
    {
      number: '5',
      name: 'Indonesia & Global South',
      description: 'Anti-corruption agency data, developing democracy tracking. Testing the engine in high-corruption environments.',
      status: 'planned',
      active: false
    }
  ];

  return (
    <RoadmapContainer>
      <GlobeIcon>🌍</GlobeIcon>
      <RoadmapTitle>Global Triangulation Roadmap</RoadmapTitle>
      <p style={{ color: '#aaa', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto 1rem' }}>
        The interactive global map is Phase 4. Currently building the data foundations region by region.
      </p>
      
      <PhaseGrid>
        {phases.map((phase, index) => (
          <PhaseCard key={index} active={phase.active}>
            <PhaseStatus status={phase.status}>
              {phase.status.toUpperCase()}
            </PhaseStatus>
            <PhaseNumber active={phase.active}>{phase.number}</PhaseNumber>
            <PhaseName active={phase.active}>{phase.name}</PhaseName>
            <PhaseDescription active={phase.active}>
              {phase.description}
            </PhaseDescription>
          </PhaseCard>
        ))}
      </PhaseGrid>
      
      <CallToAction>
        <strong>Current Focus:</strong> Completing Phase 3 visualization layer before expanding to global map.
        The geographic patterns shown above reveal the US lobbying-industrial complex.
      </CallToAction>
    </RoadmapContainer>
  );
};

export default GlobalMapRoadmap;