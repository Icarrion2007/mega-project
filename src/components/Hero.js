import React from "react";
import styled from "styled-components";
import { useStaticQuery, graphql } from "gatsby";

const HeroSection = styled.section`
  position: relative;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  overflow: hidden;
  background: linear-gradient(rgba(10, 29, 63, 0.9), rgba(10, 29, 63, 0.95)),
              url('https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80');
  background-size: cover;
  background-position: center;
  border-bottom: 3px solid #00E5FF;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
  line-height: 1.1;

  span {
    color: #00E5FF;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const MissionStatement = styled.div`
  font-size: 1.8rem;
  color: #00E5FF;
  margin: 1rem 0 2rem 0;
  font-style: italic;
  text-align: center;
  max-width: 900px;
  line-height: 1.4;

  strong {
    color: #ffffff;
    font-style: normal;
  }

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 400;
  color: #cccccc;
  margin-bottom: 2rem;
  max-width: 800px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const DataStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin: 2rem auto;
  max-width: 800px;
  background: rgba(0, 229, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(0, 229, 255, 0.3);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const StatItem = styled.div`
  text-align: center;

  .stat-value {
    font-size: 2.2rem;
    font-weight: 800;
    color: #00E5FF;
    margin-bottom: 0.25rem;
    line-height: 1;

    @media (max-width: 768px) {
      font-size: 1.8rem;
    }
  }

  .stat-label {
    font-size: 0.95rem;
    color: #cccccc;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const LiveDataBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(46, 125, 50, 0.2);
  border: 1px solid #4caf50;
  border-radius: 20px;
  color: #a5d6a7;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 1rem;

  &::before {
    content: '●';
    color: #4caf50;
    font-size: 0.8rem;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const EnhancementBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 193, 7, 0.2);
  border: 1px solid #ffc107;
  border-radius: 20px;
  color: #ffecb3;
  font-size: 0.85rem;
  font-weight: 600;
  margin-left: 0.5rem;

  &::before {
    content: '✨';
  }
`;

const CTAGrid = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const PrimaryButton = styled.button`
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0A1D3F;
  background: #00E5FF;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 229, 255, 0.4);

  &:hover {
    background: '#0A1D3F';
    box-shadow: 0 6px 20px rgba(0, 229, 255, 0.6);
    transform: translateY(-3px);
  }
`;

const SecondaryButton = styled.button`
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  background: transparent;
  border: 2px solid #00E5FF;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(0, 229, 255, 0.1);
    transform: translateY(-3px);
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: #00E5FF;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  &:after {
    content: '↓';
    font-size: 1.5rem;
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
    40% {transform: translateY(-10px);}
    60% {transform: translateY(-5px);}
  }
`;

const Hero = () => {
  // CORRECTED GraphQL query - matches gatsby-node.js V4.2 schema
  const data = useStaticQuery(graphql`
    query HeroDataQueryV42 {
      metadata: moneyTrailMetadata {
        total_amount
        total_contributions
        biggest_donation
        average_amount
        data_source
        timestamp
        parties_present
        parties_full_present
        enhanced
      }

      committees: allMoneyTrail(limit: 5, sort: {contribution_receipt_amount: DESC}) {
        nodes {
          committee_name
          committee_type_full
          contribution_receipt_amount
        }
      }
    }
  `);

  const metadata = data.metadata || {};
  const sampleCommittees = data.committees?.nodes || [];

  // Format the total amount
  const formatTotal = (amount) => {
    if (!amount) return '$2.8B';
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    }
    return `$${(amount / 1000000).toFixed(0)}M`;
  };

  // Format large numbers with commas
  const formatNumber = (num) => {
    if (!num) return '100';
    return num.toLocaleString();
  };

  // Calculate average in millions
  const calculateAverageMillions = (total, count) => {
    if (!total || !count) return '$27.7M';
    return `$${(total / count / 1000000).toFixed(1)}M`;
  };

  // Format biggest donation
  const formatBiggestDonation = (amount) => {
    if (!amount) return '$90M';
    return `$${(amount / 1000000).toFixed(0)}M`;
  };

  // Get committee type summary from parties data
  const getCommitteeTypeSummary = () => {
    if (!metadata.parties_present || metadata.parties_present.length === 0) {
      return "Multiple parties tracked";
    }
    return `${metadata.parties_present.length} party${metadata.parties_present.length !== 1 ? 's' : ''}`;
  };

  // Get timestamp display
  const getTimestampDisplay = (timestamp) => {
    if (!timestamp) return 'Recently';
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return 'Recently';
    }
  };

  const handleExploreData = () => {
    document.getElementById('global-roadmap')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLearnMore = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <HeroSection>
      <Title>Make Every Government <span>Accountable</span></Title>

      <MissionStatement>
        "Sunlight is the best disinfectant."
        <strong> A thriving Earth is the only goal.</strong>
      </MissionStatement>

      <Subtitle>
        An open-source platform tracking money, rhetoric, and outcomes across governments.
        Starting with US campaign finance transparency. Built for journalists, researchers, and citizens.
      </Subtitle>

      {/* V4.2 ENHANCED DATA STATS */}
      <DataStats>
        <StatItem>
          <div className="stat-value">{formatTotal(metadata.total_amount)}</div>
          <div className="stat-label">Total Tracked</div>
          {metadata.enhanced && (
            <div style={{ fontSize: '0.7rem', color: '#ffc107', marginTop: '0.25rem' }}>
              V4.2 Enhanced
            </div>
          )}
        </StatItem>

        <StatItem>
          <div className="stat-value">{formatNumber(metadata.total_contributions)}</div>
          <div className="stat-label">Contributions</div>
          {metadata.parties_present && (
            <div style={{ fontSize: '0.7rem', color: '#4caf50', marginTop: '0.25rem' }}>
              {metadata.parties_present.length} {metadata.parties_present.length === 1 ? 'party' : 'parties'}
            </div>
          )}
        </StatItem>

        <StatItem>
          <div className="stat-value">
            {calculateAverageMillions(metadata.total_amount, metadata.total_contributions)}
          </div>
          <div className="stat-label">Average Donation</div>
        </StatItem>

        <StatItem>
          <div className="stat-value">
            {formatBiggestDonation(metadata.biggest_donation)}
          </div>
          <div className="stat-label">Largest Contribution</div>
        </StatItem>
      </DataStats>

      {/* ENHANCED STATUS BADGES */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <LiveDataBadge>
          LIVE DATA • Updated {getTimestampDisplay(metadata.timestamp)} • {formatNumber(metadata.total_contributions)} contributions
        </LiveDataBadge>

        {metadata.enhanced && (
          <EnhancementBadge>
            V4.2 ENHANCED • {getCommitteeTypeSummary()}
          </EnhancementBadge>
        )}
      </div>

      {/* SAMPLE COMMITTEE PREVIEW */}
      {sampleCommittees.length > 0 && (
        <div style={{
          marginTop: '1rem',
          fontSize: '0.85rem',
          color: '#cccccc',
          maxWidth: '600px',
          textAlign: 'center'
        }}>
          Tracking: {sampleCommittees.slice(0, 2).map((c, i) => (
            <span key={i}>
              {c.committee_name} ({c.committee_type_full}){i < 1 ? ', ' : ''}
            </span>
          ))}
          {sampleCommittees.length > 2 && ` and ${sampleCommittees.length - 2} more`}
        </div>
      )}

      <CTAGrid>
        <PrimaryButton onClick={handleExploreData}>
          Explore US Campaign Data
        </PrimaryButton>
        <SecondaryButton onClick={handleLearnMore}>
          How The Triangulation Engine Works
        </SecondaryButton>
      </CTAGrid>

      <ScrollIndicator>Explore the data</ScrollIndicator>
    </HeroSection>
  );
};

export default Hero;