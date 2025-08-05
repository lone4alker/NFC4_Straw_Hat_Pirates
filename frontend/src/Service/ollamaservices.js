// src/Service/ollamaservices.js

export const sendPromptToBackend = async (sentence) => {
  try {
    const response = await fetch('http://localhost:8000/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sentence }),  // ✅ Fix here
    });

    if (!response.ok) {
      throw new Error('Failed to get response from backend');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Backend error:', error);
    return 'Sorry, something went wrong while generating the response.';
  }
};
