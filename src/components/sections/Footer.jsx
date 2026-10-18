import { LinkedIn } from "@mui/icons-material";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Bio } from "../../data/constants";

const FooterContainer = styled.div`
  width: 100%;
  padding: 3rem 0 2rem;
  display: flex;
  justify-content: center;
  z-index: 10;
  position: relative;
  border-top: 1px solid ${({ theme }) => theme.border};
  background: rgba(7, 10, 19, 0.52);
`;
const FooterWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: center;
  padding: 1rem;
  color: ${({ theme }) => theme.text_primary};
`;
const Logo = styled.div`
  font-weight: 800;
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
`;
const Nav = styled.ul`
  width: 100%;
  max-width: 800px;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: row;
  gap: 2rem;
  justify-content: center;
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    text-align: center;
    font-size: 12px;
  }
`;
const NavLink = styled.a`
  color: ${({ theme }) => theme.text_secondary};
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.2s ease-in-out;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const AdminFooterLink = styled(Link)`
  color: #22d3ee;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  &:hover {
    color: #67e8f9;
    text-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
  }
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;
const SocialMediaIcons = styled.div`
  display: flex;
  margin-top: 1rem;
`;
const SocialMediaIcon = styled.a`
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 1rem;
  font-size: 1.35rem;
  color: ${({ theme }) => theme.text_primary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.045);
  transition: all 0.2s ease-in-out;
  &:hover {
    color: ${({ theme }) => theme.white};
    background: linear-gradient(135deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.accent});
    transform: translateY(-2px);
  }
`;
const Copyright = styled.p`
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.soft2};
  text-align: center;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterWrapper>
        <Logo>Ajay Sapkale</Logo>
        <Nav>
          <NavLink href="#About">About</NavLink>
          <NavLink href="#Skills">Skills</NavLink>
          <NavLink href="#Experience">Experience</NavLink>
          <NavLink href="#Projects">Projects</NavLink>
          <NavLink href="#Education">Education</NavLink>
          <AdminFooterLink to="/admin">Admin Dashboard</AdminFooterLink>
        </Nav>
        <SocialMediaIcons>
          {Bio.linkedin && (
            <SocialMediaIcon href={Bio.linkedin} target="_blank" rel="noreferrer">
              <LinkedIn />
            </SocialMediaIcon>
          )}
        </SocialMediaIcons>
        <Copyright>&copy; 2026 Ajay Sapkale. All rights reserved.</Copyright>
      </FooterWrapper>
    </FooterContainer>
  );
};

export default Footer;
