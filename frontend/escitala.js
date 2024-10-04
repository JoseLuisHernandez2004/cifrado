import React, { useState } from 'react';

const EscitalaCipher = () => {
  const [mensaje, setMensaje] = useState('');
  const [clave, setClave] = useState(0);
  const [resultado, setResultado] = useState('');

  const cifrarEscitala = () => {
    let res = '';
    for (let i = 0; i < clave; i++) {
      for (let j = i; j < mensaje.length; j += clave) {
        res += mensaje[j];
      }
    }
    setResultado(res);
  };

  const descifrarEscitala = () => {
    let filas = Math.ceil(mensaje.length / clave);
    let res = Array(mensaje.length).fill('');
    let index = 0;
    for (let i = 0; i < clave; i++) {
      for (let j = i; j < mensaje.length; j += clave) {
        res[j] = mensaje[index++];
      }
    }
    setResultado(res.join(''));
  };

  return (
    <section id="escitala">
      <h2>Cifrado Escítala</h2>
      <textarea
        placeholder="Escribe el mensaje..."
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
      />
      <input
        type="number"
        placeholder="Ingresa el número de columnas..."
        value={clave}
        onChange={(e) => setClave(parseInt(e.target.value))}
      />
      <button onClick={cifrarEscitala}>Cifrar</button>
      <button onClick={descifrarEscitala}>Descifrar</button>
      <h3>Resultado:</h3>
      <textarea readOnly value={resultado} />
    </section>
  );
};

export default EscitalaCipher;
