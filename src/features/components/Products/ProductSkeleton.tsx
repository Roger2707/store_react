import styled from "styled-components";

export const ProductSkeleton = () => {
    return (
        <Style>
            <div style={{ height: '25vh', background: '#cfcfcf', borderRadius: '4px' }} />
            <div style={{ height: '10vh', background: '#d8d8d8', borderRadius: '4px' }} />
            <div style={{ height: '7vh', background: '#d8d8d8', borderRadius: '4px', width: '80%' }} />
        </Style>
    );
};

const Style = styled.div`
    background-color: '#e0e0e0';
    border-radius: '8px';
    padding: '16px';
    width: 100%;
    height: 42vh;
    display: 'flex';
    flex-direction: 'column';
    gap: '12px';
    animation: 'pulse 1.5s infinite';

    @keyframes pulse {
        0% {
            background-color: #e0e0e0;
        }
        50% {
            background-color: #f0f0f0;
        }
        100% {
            background-color: #e0e0e0;
        }
    }
`
