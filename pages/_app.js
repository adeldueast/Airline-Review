import { useEffect } from 'react';
import '../styles/globals.css'
import initAuth from './../utils/initAuth';

initAuth()
const MyApp = ({ Component, pageProps }) => {

  useEffect(() => {
  
  }, [])

 return (
  
  
  
    
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Component {...pageProps} />
  )

}


export default MyApp