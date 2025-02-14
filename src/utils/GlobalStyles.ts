import { createGlobalStyle } from "styled-components";

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

}

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
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
`;
