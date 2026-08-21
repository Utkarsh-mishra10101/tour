export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { query, currentPlannerState } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is missing.' });
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        role: "user",
                        parts: [{
                            text: `You are an AI Travel Assistant for "Hidden India", an app focused on budget-friendly offbeat destinations in India. Context on active filter: Starting from ${currentPlannerState?.startLocation}, budget ₹${currentPlannerState?.budget}, duration ${currentPlannerState?.duration} days. Answer this query concisely using bolding for key places: ${query}`
                        }]
                    }]
                })
            }
        );

        const data = await response.json();
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to communicate with Gemini API' });
    }
}