const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { generateRandomKeys } = require('paillier-bigint'); // Paillier

const app = express();

// Configuración de CORS para permitir solo solicitudes desde tu frontend en Netlify
app.use(cors({
  origin: 'https://cifrados.netlify.app',  // Reemplaza con tu dominio de Netlify
  methods: ['GET', 'POST'],
}));

app.use(bodyParser.json());

// Almacena la clave para CAST5
let cast5Key = null;
// Genera las claves Paillier una sola vez
let paillierKeys = null;

const initKeys = async () => {
  try {
    paillierKeys = await generateRandomKeys(2048);
    console.log("Claves Paillier generadas correctamente");
  } catch (error) {
    console.error("Error al generar claves Paillier:", error);
  }
};
initKeys();

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Servidor de cifrado en funcionamiento');
});

// Cifrado CAST5 (Simétrico) - usando AES-256-CBC
app.post('/api/cifrarCAST5', (req, res) => {
  const { text } = req.body;
  cast5Key = crypto.randomBytes(32); // La clave debe ser de 32 bytes (256 bits)
  const cipher = crypto.createCipheriv('aes-256-cbc', cast5Key, cast5Key.slice(0, 16)); // La IV debe tener una longitud de 16 bytes
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  res.send({ encrypted });
});

// Descifrar CAST5
app.post('/api/descifrarCAST5', (req, res) => {
  const { encryptedText } = req.body;
  if (!cast5Key) return res.status(400).send({ error: "Clave no encontrada" }); // Verifica que la clave exista
  const decipher = crypto.createDecipheriv('aes-256-cbc', cast5Key, cast5Key.slice(0, 16)); // La IV debe ser la misma usada en el cifrado
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  res.send({ decrypted });
});

// Cifrado Paillier (Asimétrico)
app.post('/api/cifrarPaillier', async (req, res) => {
  const { text } = req.body;
  const unicodeValues = Array.from(text).map(char => char.charCodeAt(0));
  const textAsNumber = BigInt(unicodeValues.join('')); // Representación como BigInt

  if (!paillierKeys) {
    return res.status(500).send({ error: "Claves Paillier no inicializadas" });
  }

  try {
    const encrypted = paillierKeys.publicKey.encrypt(textAsNumber);
    res.send({ encrypted: encrypted.toString() });
  } catch (error) {
    console.error("Error durante el cifrado Paillier:", error);
    res.status(500).send({ error: "Error durante el cifrado Paillier" });
  }
});

// Descifrar Paillier
app.post('/api/descifrarPaillier', async (req, res) => {
  const { encryptedText } = req.body;

  if (!paillierKeys) {
    return res.status(500).send({ error: "Claves Paillier no inicializadas" });
  }

  try {
    const decryptedBigInt = paillierKeys.privateKey.decrypt(BigInt(encryptedText));

    // Convertir el BigInt de vuelta a una cadena de caracteres usando Unicode
    const decryptedText = String(decryptedBigInt).match(/.{1,3}/g)  // Cambia el tamaño del grupo según el formato original
      .map(num => String.fromCharCode(Number(num)))
      .join('');

    res.send({ decrypted: decryptedText });
  } catch (error) {
    console.error("Error durante el descifrado Paillier:", error);
    res.status(400).send({ error: "Error durante el descifrado Paillier" });
  }
});

// Hash con SHA-512 (no necesita descifrado)
app.post('/api/hashSHA512', (req, res) => {
  const { text } = req.body;
  const hash = crypto.createHash('sha512').update(text).digest('hex');
  res.send({ hash });
});

// Puerto
const PORT = process.env.PORT || 3001; // Usa el puerto de la variable de entorno o 3001
app.listen(PORT, () => {
  console.log(`Servidor de cifrado ejecutándose en puerto ${PORT}`);
});
