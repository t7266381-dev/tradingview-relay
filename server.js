const express = require('express');
const app = express();

// قراءة البيانات سواء كانت نصاً عادياً أو كائن JSON
app.use(express.text({ type: '*/*' }));
app.use(express.json());

let latestSignal = "No Signal";

// 1️⃣ المسار الدائم الذي يستقبل تنبيه TradingView مباشرة
app.post('/webhook', (req, res) => {
    let payload = req.body;
    if (typeof payload === 'object') {
        payload = JSON.stringify(payload);
    }
    
    if (payload && payload.trim().length > 0) {
        latestSignal = payload.trim();
        console.log(`[${new Date().toISOString()}] تم استقبال إشارة جديدة:`, latestSignal);
    }
    res.status(200).send("OK");
});

// 2️⃣ المسار الذي يقرأ منه كود الميتاتريدر الإشارة لحظياً
app.get('/get-signal', (req, res) => {
    res.send(latestSignal);
});

// مسار لفحص حالة السيرفر
app.get('/', (req, res) => {
    res.send("Webhook Server Active");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`السيرفر يعمل الآن على المنفذ ${PORT}`));