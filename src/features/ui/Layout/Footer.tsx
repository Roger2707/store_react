import React from 'react';
import styled from 'styled-components';
import { FaFacebook } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaTwitterSquare } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";

const logo = require('../../assets/images/mainLogo.jpg');


export const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <Column>
          <Logo src={logo} alt="Company Logo" />
          <p>
            Your trusted e-commerce partner. Quality products, secure payment, and fast delivery nationwide.
          </p>
        </Column>

        <Column>
          <h4>Quick Links</h4>
          <ul>
            <li><span>Home</span></li>
            <li><span>Shop</span></li>
            <li><span>About Us</span></li>
            <li><span>Contact</span></li>
          </ul>
        </Column>

        <Column>
          <h4>Contact</h4>
          <p>Email: support@yourstore.com</p>
          <p>Phone: +84 123 456 789</p>
          <p>Address: 275 Dien Bien Phu, District 3, HCMC, Viet Nam</p>
        </Column>

        <Column>
          <h4>Follow Us</h4>
          <SocialLinks>
            <span><FaFacebook/></span>
            <span><FaInstagramSquare/></span>
            <span><FaTwitterSquare/></span>
            <span><FaTiktok/></span>
          </SocialLinks>
        </Column>
      </FooterContent>
      <CopyRight>© 2025 RogerBMT Store. All rights reserved.</CopyRight>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: #222;
  color: #fff;
  padding: 60px 20px 30px;
  font-size: 14px;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Column = styled.div`
  h4 {
    margin-bottom: 15px;
    font-size: 16px;
    color: #f2f2f2;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      margin-bottom: 8px;

      a {
        color: #ccc;
        text-decoration: none;
        transition: 0.3s;

        &:hover {
          color: #fff;
        }
      }
    }
  }

  p {
    margin-bottom: 10px;
    color: #ccc;
  }
`;

const Logo = styled.img`
  width: 120px;
  margin-bottom: 15px;
  border-radius: 8px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 12px;

  span {
    display: inline-block;
    color: #ccc;
    font-size: 18px;
    transition: 0.3s;
    cursor: pointer;

    &:hover {
      color: #fff;
    }
  }
`;

const CopyRight = styled.div`
  text-align: center;
  margin-top: 40px;
  font-size: 13px;
  color: #888;
`;

