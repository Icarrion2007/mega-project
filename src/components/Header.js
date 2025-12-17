import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: rgba(10, 29, 63, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 229, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00E5FF, #0A1D3F);
  border: 2px solid #00E5FF;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #0A1D3F;
  }
`

const LogoText = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  color: #00E5FF;
  letter-spacing: -0.5px;
`

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  @media (max-width: 768px) {
    display: none;
  }
`

const NavLink = styled(Link)`
  color: #f0f0f0;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  &:hover {
    color: #00E5FF;
  }
`

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>
        <LogoIcon />
        <LogoText>M.E.G.A.</LogoText>
      </Logo>
      <Nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/map">Triangulation Engine</NavLink>
        <NavLink to="/library">Library</NavLink>
        <NavLink to="/network">Network</NavLink>
        <NavLink to="/about">About</NavLink>
      </Nav>
    </HeaderContainer>
  )
}

export default Header