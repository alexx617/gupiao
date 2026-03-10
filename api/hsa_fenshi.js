export default async function handler(req, res) {
    const { token, code, all } = req.query;
    
    const url = `http://www.sanhulianghua.com:2008/v1/hsa_fenshi?token=${token}&code=${code}&all=${all}`;
    
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
