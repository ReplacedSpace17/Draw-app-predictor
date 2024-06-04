// src/App.js
import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import DrawingCanvas from './DrawingCanvas';

function App() {
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState('');

  useEffect(() => {
    async function loadModel() {
      const model = await tf.loadLayersModel('/tfjs_target_dir/model.json');
      console.log('Modelo cargado');
      setModel(model);
    }
    loadModel();
  }, []);

  const handleCanvasChange = async (canvas) => {
    if (!model) return;

    const imageData = canvas.getContext('2d').getImageData(0, 0, 280, 280);
    const tensor = tf.browser.fromPixels(imageData, 1)
      .resizeNearestNeighbor([28, 28])
      .toFloat()
      .div(255.0)
      .expandDims(0);

    const predictions = model.predict(tensor);
    const predictedIndex = predictions.argMax(-1).dataSync()[0];

    const labels = ['T-shirt/top', 'Trouser', 'Pullover', 'Dress', 'Coat', 
                    'Sandal', 'Shirt', 'Sneaker', 'Bag', 'Ankle boot'];

    console.log('Predicciones: ', predictions.dataSync());
    console.log('Índice predicho: ', predictedIndex);

    const preprocessedImage = tensor.squeeze().mul(255).toInt();
    const canvasDataUrl = await tf.browser.toPixels(preprocessedImage);
    document.getElementById('preprocessed-image').src = canvasDataUrl;

    setPrediction(labels[predictedIndex]);
  };

  return (
    <div>
      <h1>Draw a Clothing Item</h1>
      <DrawingCanvas onCanvasChange={handleCanvasChange} />
      <h2>Prediction: {prediction}</h2>
      <h3>Preprocessed Image:</h3>
      <canvas id="preprocessed-image" width="28" height="28" style={{ border: '1px solid black' }} />
    </div>
  );
}

export default App;
