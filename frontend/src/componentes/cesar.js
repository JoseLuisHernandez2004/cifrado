import React, { useState } from 'react';

const CesarCipher = () => {
  const [mensaje, setMensaje] = useState('');
  const [clave, setClave] = useState(0);
  const [resultado, setResultado] = useState('');

  const cifrarCesar = () => {
    let res = '';
    for (let i = 0; i < mensaje.length; i++) {
      let codigo = mensaje.charCodeAt(i);
      if (codigo >= 65 && codigo <= 90) {
        res += String.fromCharCode(((codigo - 65 + clave) % 26) + 65);
      } else if (codigo >= 97 && codigo <= 122) {
        res += String.fromCharCode(((codigo - 97 + clave) % 26) + 97);
      } else {
        res += mensaje[i];
      }
    }
    setResultado(res);
  };

  const descifrarCesar = () => {
    let res = '';
    for (let i = 0; i < mensaje.length; i++) {
      let codigo = mensaje.charCodeAt(i);
      if (codigo >= 65 && codigo <= 90) {
        res += String.fromCharCode(((codigo - 65 - clave + 26) % 26) + 65);
      } else if (codigo >= 97 && codigo <= 122) {
        res += String.fromCharCode(((codigo - 97 - clave + 26) % 26) + 97);
      } else {
        res += mensaje[i];
      }
    }
    setResultado(res);
  };

  return (
    <section id="cesar">
      <h2>Cifrado César</h2>
      <textarea
        placeholder="Escribe el mensaje..."
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
      />
      <input
        type="number"
        placeholder="Ingresa la clave..."
        value={clave}
        onChange={(e) => setClave(parseInt(e.target.value))}
      />
      <button onClick={cifrarCesar}>Cifrar</button>
      <button onClick={descifrarCesar}>Descifrar</button>
      <h3>Resultado:</h3>
      <textarea readOnly value={resultado} />
    </section>
  );
};

export default CesarCipher;
