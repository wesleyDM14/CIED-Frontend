import styled, { keyframes } from 'styled-components';
import { fadeIn, /*slideInUp*/ } from 'react-animations';

// Cores do sistema
const colors = {
  primary: '#2A5C8D',
  secondary: '#6C9BCF',
  accent: '#FF6B6B',
  textPrimary: '#2C3E50',
  textSecondary: '#5D6D7E',
  background: '#F8F9FA',
  success: '#4CAF50',
  error: '#FF5252',
  white: '#FFFFFF',
};

// Espaçamento
const spacing = {
  xsmall: '0.5rem',
  small: '1rem',
  medium: '1.5rem',
  large: '2rem',
  xlarge: '3rem'
};

// Breakpoints responsivos
const breakpoints = {
  mobile: '768px',
  tablet: '1024px'
};

// Animations
const fadeInAnimation = keyframes`${fadeIn}`;
//const slideInUpAnimation = keyframes`${slideInUp}`;

export const GradientBackground = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${colors.background} 0%, #E9ECEF 100%);
  padding: ${spacing.large};
  
  @media (max-width: ${breakpoints.mobile}) {
    padding: ${spacing.small};
  }
`;

export const CalendarContainer = styled.div`
  max-width: 95vw;
  margin: 0 auto;
  background: ${colors.white};
  border-radius: 24px;
  box-shadow: 0 12px 24px rgba(0,0,0,0.08);
  padding: ${spacing.large};
  animation: ${fadeInAnimation} 0.5s ease-in;
  position: relative;
  overflow: hidden;

  @media (max-width: ${breakpoints.mobile}) {
    border-radius: 16px;
    padding: ${spacing.small};
  }
`;

export const CalendarHeader = styled.header`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${spacing.medium};
  align-items: center;
  margin-bottom: ${spacing.large};
  padding: ${spacing.medium} ${spacing.large};
  background: ${colors.white};
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);

  .navigation{
    display: flex;
  }

  h1 {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 600;
    color: ${colors.textPrimary};
    display: flex;
    align-items: center;
    gap: ${spacing.small};
    
    svg {
      color: ${colors.primary};
      font-size: 1.5em;
    }
  }

  @media (max-width: ${breakpoints.mobile}) {
    grid-template-columns: 1fr;
    padding: ${spacing.small};
    
    h1 {
      font-size: 1.25rem;
    }
  }
`;

export const NavigationControls = styled.div`
  display: flex;
  gap: ${spacing.small};
  align-items: center;

  @media (max-width: ${breakpoints.mobile}) {
    justify-content: space-between;
  }
`;

export const NavigationButton = styled.button`
  background: ${colors.background};
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: ${colors.primary};
    color: ${colors.white};
    transform: translateY(-2px);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const TodayButton = styled(NavigationButton)`
  background: ${colors.primary};
  color: ${colors.white};
  padding: 0 ${spacing.medium};
  width: auto;
  
  &:hover {
    background: ${colors.secondary};
  }
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(120px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
  overflow-x: auto;
  min-width: 100%;

  @media (max-width: 1366px) { // Tamanho típico de notebook
    grid-template-columns: repeat(7, minmax(100px, 1fr));
    gap: 0.3rem;
  }

  @media (max-width: 1280px) {
    grid-template-columns: repeat(7, minmax(90px, 1fr));
  }
`;

interface DayNumberProps {
  $currentMonth?: boolean;
}

export const DayNumber = styled.div<DayNumberProps>`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ $currentMonth }) => $currentMonth ? colors.textPrimary : '#CBD5E1'};
  margin-bottom: ${spacing.xsmall};

  @media (max-width: 1366px) {
    font-size: 0.9rem;
  }
`;

interface CalendarDayProps {
  $hasSchedule?: boolean;
}

export const CalendarDay = styled.div<CalendarDayProps>`
  position: relative;
  background: ${({ $hasSchedule }) => $hasSchedule ? '#F0F6FF' : colors.white};
  border: 2px solid ${({ $hasSchedule }) => $hasSchedule ? colors.primary : '#EDF2F7'};
  border-radius: 16px;
  min-height: 130px;
  padding: ${spacing.small};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(42, 92, 141, 0.12);
  }

  &.other-month {
    background: #F8FAFC;
    opacity: 0.7;
    cursor: default;
    
    ${DayNumber} {
      color: #CBD5E1;
    }
  }

  @media (max-width: 1366px) {
    min-height: 110px;
    padding: 0.5rem;
  }

  @media (max-width: 1280px) {
    min-height: 100px;
  }
`;

export const ScheduleList = styled.div`
  display: grid;
  gap: ${spacing.xsmall};
`;

interface ScheduleBadgeProps {
  $index: number;
}

export const ScheduleBadge = styled.div<ScheduleBadgeProps>`
  background: ${({ $index }) => $index % 2 === 0 ? colors.primary : colors.secondary};
  color: ${colors.white};
  padding: ${spacing.xsmall} ${spacing.small};
  border-radius: 8px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: ${spacing.xsmall};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(4px);
  }

  svg {
    flex-shrink: 0;
    font-size: 0.9em;
  }
`;

export const AddButton = styled.button`
  position: absolute;
  bottom: ${spacing.small};
  right: ${spacing.small};
  background: ${colors.primary};
  color: ${colors.white};
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: ${colors.secondary};
    transform: scale(1.1);
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
`;

export const ModalContent = styled.div`
  max-width: 800px;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;

  .edit-mode-controls {
    margin: 1rem 0;
    display: flex;
    justify-content: flex-end;

    .toggle-button {
      background: #2196F3;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 0.9rem;

      &:hover {
        background: #1976D2;
        transform: translateY(-1px);
      }
    }
  }

  .existing-procedures {
    margin: 1rem 0;
    max-height: 400px;
    overflow-y: auto;

    .empty-message {
      color: #757575;
      font-style: italic;
      text-align: center;
      padding: 1rem;
    }
  }

  .remove-btn {
    background: #ff4444;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: #cc0000;
    }
  }

  .procedure-info {
    flex-grow: 1;
    padding-right: 1rem;
  }

  .procedures-list {
    max-height: 500px;
    overflow-y: auto;
    margin: 1rem 0;
  }

  .toggle-button {
    background: #2196f3;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 14px;
    margin: 15px 0;

    &:hover {
      background: #1976d2;
      transform: translateY(-2px);
      box-shadow: 0 3px 6px rgba(0,0,0,0.1);
    }
  }

  .procedure-info {
    flex: 1;
    padding-right: 15px;

    h4 {
      margin: 0 0 5px 0;
      color: #2c3e50;
      font-size: 16px;
    }

    p {
      margin: 0;
      color: #7f8c8d;
      font-size: 14px;
    }
  }

  .remove-btn {
    background: #e74c3c;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 13px;

    &:hover {
      background: #c0392b;
    }
  }

  .existing-procedures {
    max-height: 300px;
    overflow-y: auto;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 6px;
    margin: 15px 0;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.medium};

  h2 {
    margin: 0;
    color: ${colors.textPrimary};
    font-size: 1.5rem;
  }

  button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: ${colors.textSecondary};
    transition: all 0.3s;

    &:hover {
      color: ${colors.primary};
    }
  }
`;

export const ProcedureCard = styled.div`
  background: ${colors.white};
  border: 1px solid #EDF2F7;
  border-radius: 12px;
  padding: ${spacing.medium};
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${spacing.medium};
  align-items: center;
  transition: all 0.3s;

  &:hover {
    border-color: ${colors.primary};
    transform: translateY(-2px);
  }

  button {
    background: ${colors.primary};
    color: ${colors.white};
    border: none;
    padding: ${spacing.xsmall} ${spacing.medium};
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s;
    
    &:hover {
      background: ${colors.secondary};
    }
  }

  @media (max-width: ${breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

export const WeekDaysHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${spacing.small};
  margin-bottom: ${spacing.small};
  padding: 0 ${spacing.small};
`;

export const WeekDay = styled.div`
  text-align: center;
  color: ${colors.textSecondary};
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: uppercase;
  padding: ${spacing.small};
  background: rgba(42, 92, 141, 0.05);
  border-radius: 8px;
`;

export const ScheduleIndicator = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  .pulse-dot {
    width: 8px;
    height: 8px;
    background: ${colors.primary};
    border-radius: 50%;
    position: absolute;
  }

  .pulse-ring {
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid ${colors.primary};
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(0.8); opacity: 1; }
    70% { transform: scale(1.5); opacity: 0; }
    100% { opacity: 0; }
  }
`;

export const SelectedProcedure = styled.div`
  background-color: #ffeb3b;
  color: #2c3e50;
  padding: 8px 15px;
  border-radius: 8px;
  margin-top: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    margin-right: 5px;
  }
`;

export const SaveButton = styled.button`
  background-color: #2196f3;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1e88e5;
  }

  &:disabled {
    background-color: #b0bec5;
    cursor: not-allowed;
  }
`;