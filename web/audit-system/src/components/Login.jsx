import { useState } from 'react';
import axios from 'axios';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', {
        username,
        password,
      });
      if (response.data.success) {
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('role', response.data.role);
        setUser({ username: response.data.username, role: response.data.role });
        navigate('/');
      } else {
        setError('无效的用户名或密码');
      }
    } catch (err) {
      setError('登录失败');
    }
  };

  return (
    <div className={styles.login}>
      <h2>登录</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>用户名:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>密码:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit">登录</button>
      </form>
    </div>
  );
}

export default Login;
