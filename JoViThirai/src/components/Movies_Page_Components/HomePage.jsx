import img from '../../assets/finalbackground.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API = import.meta.env.VITE_API_URL;

const HomePage = () => {
  const [lang, setLang] = useState('English');
  const navigate = useNavigate();

  const styles = {
    outer: {
      height: '100vh',
      backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${img})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: '#ffff',
      padding: '20px 45px',
    },
    header: {
      display: "flex",
      justifyContent: 'space-between',
    },
    nav: {
      display: 'flex',
      gap: '50px',
    },
    content: {
      height: '90%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    emailbox: {
      display: 'flex',
      gap: '10px',

    },
    inputbox: {
      display: 'flex',
      flexDirection: 'column',
      border: '2px solid white',
      borderRadius: '5px',
      backgroundColor: '#3b3636ff',
      padding: '2px 15px',
    }
  }

  const checkAndNavigate = async () => {
    try {
      const res = await fetch(`${API}/check-auth`, {
        credentials: "include",
      });

      if (res.ok) {
        navigate("/home/front"); 
      } else {
        navigate("/login"); 
      }
    } catch (err) {
      navigate("/login");
    }
  };




  return (

    <div style={styles.outer}>
      <div style={styles.header}>

        <h1 style={{
          color: '#e50914',
          fontWeight: '900',
          fontSize: '2rem',
          transform: 'perspective(500px) rotateX(5deg)',
        }}>JoViThirai</h1>
        <div style={styles.nav}>
          <select value={lang} onChange={(e) => { setLang(e.target.value) }}>
            <option style={{ color: 'black' }}>English</option>
            <option style={{ color: 'black' }}>Tamil</option>
          </select>
          <button onClick={checkAndNavigate} style={{ marginTop: '15px', height: '30px', backgroundColor: 'red', padding: '0px 25px', borderRadius: '5px' }}>Sign In</button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontSize: '3rem', fontWeight: '700px' }}>Discover the latest trailers and trending shows.</h2>
          <p>Your next favorite story starts here.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ fontSize: '1rem', marginBottom: '10px' }}>
            Ready to watch? Enter your email to explore unlimited joy.
          </p>
          <div style={styles.emailbox}>
            <button onClick={checkAndNavigate} style={{ backgroundColor: 'red', padding: '5px 15px', borderRadius: '2px' }}>Get Started {'>'}</button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default HomePage;