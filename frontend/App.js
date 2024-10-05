import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import CesarCipher from './componentes/cesar';
import EscitalaCipher from './componentes/escitala';

function App() {
  const [inputText, setInputText] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('CAST5');
  const [result, setResult] = useState('');

  // URL del backend desplegado en Render
  const baseURL = 'https://cifrado-sxwd.onrender.com';  // Asegúrate de que esta sea la URL correcta de Render

  const handleEncrypt = async () => {
    const routeMap = {
      'CAST5': '/api/cifrarCAST5',
      'Paillier': '/api/cifrarPaillier',
      'Skein': '/api/hashSHA512'    
    };

    try {
      const response = await axios.post(`${baseURL}${routeMap[selectedMethod]}`, {
        text: inputText
      });

      setResult(response.data.encrypted || response.data.hash);
    } catch (error) {
      console.error("Error durante el cifrado: ", error);
    }
  };

  const handleDecrypt = async () => {
    const routeMap = {
      'CAST5': '/api/descifrarCAST5',
      'Paillier': '/api/descifrarPaillier'
    };

    if (selectedMethod === 'Skein') {
      alert('Skein no puede ser descifrado.');
      return;
    }

    try {
      const response = await axios.post(`${baseURL}${routeMap[selectedMethod]}`, {
        encryptedText: result
      });

      setResult(response.data.decrypted);
    } catch (error) {
      console.error("Error durante el descifrado: ", error);
    }
  };

  return (
    <div className="container">
      <h1>Cifrados CAST5, Paillier y Skein</h1>
      <textarea
        placeholder="Texto a Cifrar/Descifrar"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <div className="buttons">
        <button onClick={() => setSelectedMethod('CAST5')} className={selectedMethod === 'CAST5' ? 'active' : ''}>CAST5</button>
        <button onClick={() => setSelectedMethod('Paillier')} className={selectedMethod === 'Paillier' ? 'active' : ''}>Paillier</button>
        <button onClick={() => setSelectedMethod('Skein')} className={selectedMethod === 'Skein' ? 'active' : ''}>Skein</button>
      </div>

      <div className="action-buttons">
        <button onClick={handleEncrypt}>Cifrar</button>
        <button onClick={handleDecrypt}>Descifrar</button>
      </div>

      <h3>Resultado:</h3>
      <textarea readOnly value={result}></textarea>

      <div className="result-buttons">
        <button onClick={() => navigator.clipboard.writeText(result)}>Copiar</button>
        <button onClick={() => setResult('')}>Limpiar</button>
      </div>

      {/* Cifrados César y Escítala */}
      <CesarCipher />
      <EscitalaCipher />
    </div>
  );
}

export default App;
