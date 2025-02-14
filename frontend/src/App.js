import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainNav from './layouts/Header';
import Monitor from './components/Monitor';

function Home() {
    return (
        <div className="container mt-4 text-center">
            <h1>Welcome to Bat Sonar</h1>
            <p>Your go-to source for bat research and ultrasonic analysis.</p>
        </div>
    );
}

function App() {
    return (
        <Router>
            <MainNav />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/monitor" element={<Monitor />} />
            </Routes>
        </Router>
    );
}

export default App;
