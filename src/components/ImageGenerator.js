import React, { useState } from 'react';
import axios from 'axios';

const ImageGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [imageSize, setImageSize] = useState('256x256');
  const [outputFormat, setOutputFormat] = useState('url');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerateImage = async () => {
    try {
      const response = await axios.post('https://api.openai.com/v1/images/generations', {
        prompt: inputText,
        size: imageSize,
        response_format: outputFormat,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response:', response.data);

      if (outputFormat === 'url') {
        setGeneratedImage(response.data.data[0].url);
      } else {
        setGeneratedImage(response.data.data[0].b64_json);
      }
    } catch (error) {
      setError(error.message);
      console.error('Error generating image:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Image Generator</h1>
      <div className="mb-4">
        <label className="block mb-2">Describe the image:</label>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Select image size:</label>
        <select
          value={imageSize}
          onChange={(e) => setImageSize(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="256x256">256x256</option>
          <option value="512x512">512x512</option>
          <option value="1024x1024">1024x1024</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Output format:</label>
        <select
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="url">URL</option>
          <option value="base64">Base64</option>
        </select>
      </div>
      <button
        onClick={handleGenerateImage}
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Generate Image
      </button>
      {error && (
        <div className="mt-4 text-red-500">
          <p>Error: {error}</p>
        </div>
      )}
      {generatedImage && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Generated Image:</h2>
          {outputFormat === 'url' ? (
            <img src={generatedImage} alt="Generated" />
          ) : (
            <img src={`data:image/png;base64,${generatedImage}`} alt="Generated" />
          )}
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
