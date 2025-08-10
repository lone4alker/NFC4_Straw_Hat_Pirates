const API_BASE_URL = 'http://localhost:8000'; 

/**
 * Calls the backend to generate text content using Gemini.
 * @param {string} prompt - The user's input prompt.
 * @param {string|null} filePath - The path to the user's scraped data file for tone analysis.
 * @returns {Promise<string>} - The generated text response.
 */
export async function generateWithGemini(prompt, filePath = null) {
  try {
    const payload = {
      prompt: prompt,
      filePath: filePath,
    };

    const response = await fetch(`${API_BASE_URL}/generate-content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to generate text from the API.');
    }

    const data = await response.json();
    return data.generated_text;
  } catch (error) {
    console.error("Error in generateWithGemini service:", error);
    throw error;
  }
}

/**
 * NEW: Calls the backend to analyze an image with a text query using Gemini.
 * @param {string} query - The user's text query about the image.
 * @param {File} imageFile - The image file to analyze.
 * @returns {Promise<string>} - The AI's answer about the image.
 */
export async function analyzeImageWithGemini(query, imageFile) {
  try {
    // We use FormData to send both a file and text in the same request.
    const formData = new FormData();
    formData.append('query', query);
    formData.append('file', imageFile);

    const response = await fetch(`${API_BASE_URL}/analyze-image`, {
      method: 'POST',
      body: formData, // When sending FormData, the browser sets the Content-Type header automatically.
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to analyze the image.');
    }

    const data = await response.json();
    return data.answer; // The backend returns the answer in the 'answer' field.
  } catch (error) {
    console.error("Error in analyzeImageWithGemini service:", error);
    throw error;
  }
}