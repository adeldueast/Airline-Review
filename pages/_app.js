import '../styles/globals.css'
import initAuth from './../utils/initAuth';
import 'bootstrap/dist/css/bootstrap.min.css';
initAuth()
const MyApp = ({ Component, pageProps }) => {


 return <Component {...pageProps} />
}


export default MyApp