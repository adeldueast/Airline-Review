import logo from '../public/logo.svg';

const styles = {
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}

const FullPageLoader = () => (
  <div style={styles.container}>
      <img src={`https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg`} className="App-logo" alt="logo" />
  </div>
)

export default FullPageLoader