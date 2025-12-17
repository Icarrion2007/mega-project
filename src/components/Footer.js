import React from "react"
import styled from "styled-components"

const FooterContainer = styled.footer`
  padding: 3rem 2rem;
  background: #070e1f;
  border-top: 1px solid rgba(0, 229, 255, 0.1);
  text-align: center;
`

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 2rem;
  a {
    color: #aaaaaa;
    text-decoration: none;
    &:hover {
      color: #00E5FF;
    }
  }
`

const FooterStatement = styled.p`
  color: #666666;
  font-size: 0.9rem;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.5;
`

const Footer = () => {
  return (
    <FooterContainer>
      <FooterLinks>
        <a href="/methodology">Methodology</a>
        <a href="/library">Library</a>
        <a href="/network">The Luminous Network</a>
        <a href="/contribute">Contribute Data</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </FooterLinks>
      <FooterStatement>
        M.E.G.A. is an open‑source, decentralized project. Built for resilience. Dedicated to truth. This is a Phase 1 prototype.
        <br />
        © {new Date().getFullYear()} — The continuum persists.
      </FooterStatement>
    </FooterContainer>
  )
}

export default Footer