// service.js
const API_BASE_URL = 'http://localhost:8000'; // Your FastAPI backend URL

/**
 * Calls the FastAPI backend to generate text using Ollama.
 * @param {string} prompt - The user's input prompt.
 * @param {string} model - The Ollama model to use (e.g., "llama3.2").
 * @param {string} [tone] - Optional tone for the generation (e.g., "friendly", "formal").
 * @param {number} [temperature] - Optional temperature for the generation (0.0 to 1.0).
 * @returns {Promise<string>} - The generated text response.
 * @throws {Error} - If the API call fails.
 */
export async function generateText(prompt, model, tone = null, temperature = null) {
    try {
        const payload = {
            prompt: prompt,
            model: model,
        };

        if (tone) {
            payload.tone = tone;
        }
        if (temperature !== null) {
            payload.temperature = temperature;
        }

        const response = await fetch(`${API_BASE_URL}/generate_text`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to generate text from Ollama.');
        }

        const data = await response.json();
        return data.generated_text;
    } catch (error) {
        console.error("Error in generateText service:", error);
        throw error;
    }
}

// You can add other service functions here if needed, e.g., for fetching user data
// export async function getUserAccount(email) {
//     try {
//         const response = await fetch(`${API_BASE_URL}/account/${email}`);
//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.detail || 'Failed to fetch user data.');
//         }
//         return await response.json();
//     } catch (error) {
//         console.error("Error in getUserAccount service:", error);
//         throw error;
//     }