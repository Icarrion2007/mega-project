import React from "react"
import styled from "styled-components"

const VisionSection = styled.section`
  padding: 5rem 2rem;
  background: #0A1D3F;
  text-align: center;
`

const VisionTitle = styled.h2`
  font-size: 2.5rem;
  color: #ffffff;
  margin-bottom: 2rem;
`

const VisionCard = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  border-left: 5px solid #00E5FF;
  padding: 2.5rem;
  border-radius: 0 12px 12px 0;
  text-align: left;
`

const VisionQuote = styled.blockquote`
  font-size: 1.4rem;
  color: #f0f0f0;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-style: italic;
`

const VisionAuthor = styled.p`
  color: #00E5FF;
  font-weight: 600;
  font-size: 1.1rem;
`

const VisionText = styled.div`
  color: #cccccc;
  line-height: 1.7;
  margin-top: 2rem;
  p {
    margin-bottom: 1.5rem;
  }
`

const Vision = () => {
  return (
    <VisionSection>
      <VisionTitle>Why "Make Earth Great Again"?</VisionTitle>
      <VisionCard>
        <VisionQuote>
          "Accountability is not an end in itself. It is the first, non‑negotiable step toward a positive future."
        </VisionQuote>
        <VisionAuthor>— M.E.G.A. Principle</VisionAuthor>
        <VisionText>
          <p>
            'Greatness' is redefined here not by dominance, but by <strong>integrity, health, and legacy</strong>. A great Earth is one with clean air, water, and stable climates. A great human society is one where power is transparent and people are free from predation.
          </p>
          <p>
            We believe these are not partisan goals. They are human imperatives. M.E.G.A. is the tool to clear the fog. Building the future is the work that comes next.
          </p>
        </VisionText>
      </VisionCard>
    </VisionSection>
  )
}

export default Vision