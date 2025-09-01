import { ThemeProvider } from '../src/ThemeContext';
import Header from '../src/Header';
import Footer from '../src/Footer';
import ScrollButtons from '../src/ScrollButtons';
import '../src/index.css';
import '../src/App.css';

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <div className="App">
        <Header />
        <main>
          <Component {...pageProps} />
        </main>
        <Footer />
        <ScrollButtons />
      </div>
    </ThemeProvider>
  );
}

export default MyApp;

