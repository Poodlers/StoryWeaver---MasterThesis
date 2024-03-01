import { createTheme } from '@mui/material'

const primaryColor = '#5F6F52'
const secondaryColor = '#A9B388'
const tertiaryColor = '#B99470'
const textColor = '#FEFAE0'
const backgroundColor = '#2C3A47'

const myTheme = createTheme({
    palette: {
        primary: {
            main: '#5F6F52',
            contrastText: '#FEFAE0'
        },
        secondary: {
            main: '#A9B388',
            contrastText: '#FEFAE0'
        },
        warning : {
            main: '#83e1e5',
            contrastText: '#067089'

        },
        success: {
            main: '#ec6fa7'
        },
        info: {
            main: '#fff'
        },
        text: {
            primary: '#fff',
            secondary: '#75c1d7',
        }
    }
})

export {myTheme, primaryColor, secondaryColor, tertiaryColor, textColor, backgroundColor}