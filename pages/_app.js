import '../styles/globals.css'
import initAuth from './../utils/initAuth';
import 'bootstrap/dist/css/bootstrap.min.css';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json'
initAuth()
TimeAgo.addLocale(en)

const MyApp = ({ Component, pageProps }) => {


 return <Component {...pageProps} />
}


export default MyApp