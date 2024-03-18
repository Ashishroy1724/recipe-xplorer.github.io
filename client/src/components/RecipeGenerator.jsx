import { useState } from 'react';

function RecipeGenerator() {
  const [recipe, setRecipe] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [allergies, setAllergies] = useState('');
  const [speech, setSpeech] = useState(null);
  const [recognition, setRecognition] = useState(null);

  const generateRecipe = async () => {
    try {
      const response = await fetch(`http://localhost:4000/recipe?ingredients=${encodeURIComponent(ingredients)}&cuisine=${encodeURIComponent(cuisine)}&allergies=${encodeURIComponent(allergies)}`);
      const data = await response.json();
      const recipe = data.recipe;
      setRecipe(recipe);
    } catch (error) {
      console.error(error);
      setRecipe('Failed to generate recipe');
    }

    stopVoiceRecognition();
  };

  const clearRecipe = () => {
    setRecipe('');
    setIngredients('');
    setCuisine('');
    setAllergies('');
    stopSpeech();
    stopVoiceRecognition();
  };

  const generateAnotherRecipe = () => {
    setRecipe('');
    generateRecipe();
    stopVoiceRecognition();
  };

  const speakRecipe = () => {
    const speech = new SpeechSynthesisUtterance(recipe);
    window.speechSynthesis.speak(speech);
    stopVoiceRecognition();
    setSpeech(speech);
  };

  const pauseSpeech = () => {
    if (speech) {
      window.speechSynthesis.pause();
    }
  };

  const playSpeech = () => {
    if (speech) {
      window.speechSynthesis.resume();
    }
  };

  const stopSpeech = () => {
    if (speech) {
      window.speechSynthesis.cancel();
    }
  };

  const startVoiceRecognition = () => {
    const recognition = new webkitSpeechRecognition();
    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();

      switch (command) {
        case "pause":
          pauseSpeech();
          break;
        case "play":
          playSpeech();
          break;
        case "stop":
          stopSpeech();
          break;
      }
    };

    recognition.start();
    setRecognition(recognition);
  };

  return (
    <div className="container p-5 mx-auto py-8 flex flex-col md:flex-row items-center">
      <div className="border p-7 shadow input-box mb-4 md:mb-0 md:mr-4">
        <h1 className="text-2xl font-bold mb-4">Recipe Generator</h1>
        <div className="mb-4">
          <label htmlFor="ingredients" className="block">Enter available ingredients:</label>
          <input type="text" id="ingredients" placeholder="e.g., chicken, tomatoes, pasta" value={ingredients} onChange={(e) => setIngredients(e.target.value)} className="border border-gray-300 px-3 py-2 rounded-md w-full" />
        </div>
        <div className="mb-4">
          <label htmlFor="cuisine" className="block">Cuisine:</label>
          <input type="text" id="cuisine" placeholder="e.g., Indian, Italian, American" value={cuisine} onChange={(e) => setCuisine(e.target.value)} className="border border-gray-300 px-3 py-2 rounded-md w-full" />
        </div>
        <div className="mb-4">
          <label htmlFor="allergies" className="block">Allergies:</label>
          <input type="text" id="allergies" placeholder="e.g., milk, eggs, fish" value={allergies} onChange={(e) => setAllergies(e.target.value)} className="border border-gray-300 px-3 py-2 rounded-md w-full" />
        </div>
        <button onClick={generateRecipe} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 w-full md:w-auto">Generate Recipe</button>
        <button onClick={clearRecipe} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md md:mr-2 mt-2 md:mt-0 w-full md:w-auto">Clear</button>
        <button onClick={startVoiceRecognition} className="bg-green-500 text-white px-4 py-2 rounded-md mt-4 w-full md:w-auto">Start Voice Recognition</button>
      </div>
      <div className="border p-7 shadow output-box md:w-2/3">
        <div className="output-header mb-4">
          <h2 className="text-xl font-bold mb-2">Generated Recipe</h2>
          <button onClick={generateAnotherRecipe} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 mt-2 md:mt-0 w-full md:w-auto">Generate Another Recipe</button>
          <button onClick={speakRecipe} className="bg-green-500 text-white px-4 py-2 rounded-md mr-2 mt-2 md:mt-0 w-full md:w-auto">Read Recipe</button>
          <button onClick={pauseSpeech} className="bg-green-500 text-white px-4 py-2 rounded-md mr-2 mt-2 md:mt-0 w-full md:w-auto">Pause</button>
          <button onClick={playSpeech} className="bg-green-500 text-white px-4 py-2 rounded-md mr-2 mt-2 md:mt-0 w-full md:w-auto">Play</button>
          <button onClick={stopSpeech} className="bg-red-500 text-white px-4 py-2 rounded-md mt-2 md:mt-0 w-full md:w-auto">Stop</button>
        </div>
        <p id="recipeResult" className="p-4 rounded-md font-normal text-slate-600">{recipe}</p>
      </div>
    </div>
  );
}

export default RecipeGenerator;
