export default async function handler(req, res) {
    const { token, query } = req.query;
    
    const url = `https://quote.alltick.io/quote-stock-b-api/trade-tick?token=${token}&query=${encodeURIComponent(query)}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Proxy request failed', message: error.message });
    }
}
