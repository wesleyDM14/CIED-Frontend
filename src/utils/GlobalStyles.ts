import { createGlobalStyle } from "styled-components";
import { isSmallScreen } from "./Funtions";

export const colors = {
    title: '#1A332D',
    background: '#F4F4F4',
    sidebar: '#1A332D',
    mainText: '#424242',
    description: '#6E6E6E',
    icon: '#E2C27B',
    hover: '#F1E2B3',
    btnPrimary: '#E2C27B',
    btnSecondary: '#1A332D',
    white: '#FFFFFF',
    red: '#E74C3C',
    greenNeutral: '#27AE60',
    darkGray: '#6E6E6E',
    slimGray: '#D1D1D1',
    navbar: '#1A332D'
}

export const ModalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: isSmallScreen() ? '10%' : 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        overflowY: 'auto' as const,
        maxHeight: '600px',
        padding: '0',
        maxWidth: '90%'
    }
}

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        transition: background-color 0.3s ease, color 0.3s ease;
    }

    body {
        font-family: 'Roboto', sans-serif;
        background-color: ${colors.background};
    }

    h1, h2, h3, h4, h5, h6 {
        font-family: 'Montserrat', sans-serif;
    }

    p, span, a, li {
        font-family: 'Open Sans', sans-serif;
    }

    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }

    ::-webkit-scrollbar {
        width: 5px;
        height: 6px;
    }

    ::-webkit-scrollbar-track {
        background-color: ${colors.slimGray};
        border-radius: 10px;
        box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);
    }

    ::-webkit-scrollbar-thumb {
        background-color: ${colors.greenNeutral};
        border-radius: 10px;

        &:hover {
            background-color: ${colors.darkGray};
        }
    }

    .main-container {
        display: grid;
        height: 100vh;
        width: 100%;
        grid-template-columns: 0.8fr repeat(3, 1fr);
        grid-template-rows: 0.2fr 3fr;
        grid-template-areas: 
            'sidebar nav nav nav'
            'sidebar main main main'
        ;

        @media only screen and (max-width: 978px) {
            grid-template-columns: 1fr;
            grid-template-rows: 0.2fr 3fr;
            grid-template-areas: "nav" "main";
        }
    }

    .sidebar-responsive {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        background: ${colors.sidebar};
        padding: 20px;
        z-index: 9999 !important;
        overflow-y: auto;
        display: flex !important;
        flex-direction: column;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
    .sidebar-responsive::-webkit-scrollbar {
        display: none; /* Chrome, Safari e Edge */
    }

    .label-responsive {
    
        @media only screen and (max-width: 978px){
            display: none !important;
        }
    }

    .first-label {
        margin-left: 5px;
    }

    #sidebar {
        background: ${colors.sidebar};
        grid-area: sidebar;
        overflow-y: auto;
        padding: 20px;
        -webkit-transition: all 0.5s;
        transition: all 0.5s;
        scrollbar-width: none;
        -ms-overflow-style: none;

        @media only screen and (max-width: 978px){
            display: none;
        }
    }

    #sidebar::-webkit-scrollbar {
        display: none; /* Chrome, Safari e Edge */
    }

    .react-datepicker-wrapper {
        display: flex !important;
    }

    .react-datepicker__input-container {
        display: flex !important;
    }

    .react-datepicker__input-container>input {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 10px 2px;
        font-size: 17px;
        letter-spacing: 1px;
        color: ${colors.mainText};
        background-color:${colors.background};
        border-radius: 5px;
        border: 0;
        outline: 0;
        margin: 0px 0 10px 0;
        transition: ease-in-out 0.3s;
        display: block;
    }

    .responsive-header {
        @media only screen and (max-width: 978px){
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
        }
    }

    .eyeIcon {
        top: 20% !important;
        color: ${colors.mainText} !important;
        font-size: 16px !important;
    }

    .react-date-picker {
        display: flex !important;
        width: 90%;
        background-color: #fff;
        border-color: #dbdbdb;
        border-radius: 4px;
    }

    .react-date-picker__inputGroup {
        padding-bottom: calc(.5em - 1px) !important;
        padding-left: calc(.75em - 1px) !important;
        padding-right: calc(.75em - 1px) !important;
        padding-top: calc(.5em - 1px) !important;
    }

    .react-calendar {
        background: #fff;
        border: 1px solid #a0a096;
        font-family: Arial, Helvetica, sans-serif;
        line-height: 1.125em;
        max-width: 100%;
        width: 350px;
    }

    .react-calendar__navigation {
        display: flex;
        height: 44px;
        margin-bottom: 1em;
    }

    .react-calendar__navigation > button {
        background: none;
        min-width: 44px;
        border: 0 !important;
    }

    .react-calendar__tile {
        background: none;
        line-height: 16px;
        max-width: 100%;
        padding: 10px 6px;
        text-align: center;
        border: 0;
    }

    .react-calendar__tile--active {
        background-color: ${colors.sidebar};
        color: ${colors.white};
    }

    .label {
        font-weight: bold;
        font-size: 16px;
    }

    .label-chart-responsive {
        font-size: 12px;
        @media only screen and (max-width: 978px){
            font-size: 7px;
        }
    }

    .detail-span {
        font-size: 12px !important;
    }

    main {
        background-color: ${colors.background};
        grid-area: main;
        overflow-y: auto;
    }
`;
