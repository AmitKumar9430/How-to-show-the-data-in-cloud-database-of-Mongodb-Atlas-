const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
    origin: 'http://localhost:4000', // Adjust if frontend runs on a different port
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("DB Connection Error:", err.message, err.stack));

// Schema Definitions
const reportSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    resolved: { type: Boolean, default: false },
    actionTaken: { type: String, default: '' },
    proofImage: { type: String, default: '' },
    startTime: { type: Date, default: Date.now },
    countdown: { type: Number, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    comments: [{
        text: { type: String, required: true, trim: true },
        date: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const UploadSchema = new mongoose.Schema({
    imageURL: { type: String, required: true },
    name: { type: String, required: true, minlength: 3, maxlength: 100 },
    contact: { 
        type: String, 
        required: true, 
        validate: {
            validator: function(value) {
                return /^[0-9]{10}$/.test(value);
            },
            message: 'Invalid phone number. It should be a 10-digit number.'
        }
    },
    description: { type: String, required: true, maxlength: 500 },
    location: { type: String, required: true, maxlength: 100 },
    status: { 
        type: String, 
        required: true, 
        default: 'Pending', 
        enum: ['Pending', 'In Progress', 'Resolved', 'Closed'] 
    },
    timeElapsed: { type: Date, default: Date.now },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    comments: [{
        text: { type: String, required: true, trim: true },
        date: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

// Models
const Report = mongoose.model('Report', reportSchema);
const Upload = mongoose.model('Upload', UploadSchema);

// Sample data adapted to Report schema and frontend table
const sampleReports = [
    {
        "_id": {"$oid": "67d27cba7f911c24c52b0da7"},
        "name": "John Doe",
        "contact": "1234567890",
        "description": "Quarterly sales performance analysis",
        "location": "Sales Department",
        "resolved": true,
        "actionTaken": "Approved by management",
        "proofImage": "", 
        "startTime": new Date("2025-03-01"),
        "countdown": 0,
        "rating": 4,
        "comments": [
            {"text": "Exceeded targets by 15%", "date": new Date("2025-03-01")},
            {"text": "New client acquisition up 25%", "date": new Date("2025-03-01")}
        ]
    },
    {
        "_id": {"$oid": "67d27cba7f911c24c52b0da8"},
        "name": "Jane Smith",
        "contact": "9876543210",
        "description": "Annual security systems evaluation",
        "location": "IT Department",
        "resolved": false,
        "actionTaken": "Pending review",
        "proofImage": "",
        "startTime": new Date("2025-03-05"),
        "countdown": 0,
        "rating": 3,
        "comments": [
            {"text": "Firewall updates needed", "date": new Date("2025-03-05")},
            {"text": "Minor vulnerabilities detected", "date": new Date("2025-03-05")}
        ]
    },
    {
        "_id": {"$oid": "67d27cba7f911c24c52b0da9"},
        "name": "Mike Johnson",
        "contact": "5555555555",
        "description": "Monthly customer feedback analysis",
        "location": "Customer Service",
        "resolved": false,
        "actionTaken": "Rejected - needs more data",
        "proofImage": "",
        "startTime": new Date("2025-03-10"),
        "countdown": 0,
        "rating": 2,
        "comments": [
            {"text": "Response time needs improvement", "date": new Date("2025-03-10")},
            {"text": "80% positive feedback", "date": new Date("2025-03-10")}
        ]
    }
];

// Insert sample data on server start (runs once if data doesn't exist)
const insertSampleData = async () => {
    try {
        const transformedData = sampleReports.map(report => ({
            ...report,
            _id: new mongoose.Types.ObjectId(report._id.$oid)
        }));
        
        const existingCount = await Report.countDocuments({ _id: { $in: transformedData.map(d => d._id) } });
        if (existingCount === 0) {
            await Report.insertMany(transformedData, { ordered: true });
            console.log('✅ Sample reports inserted:', transformedData.length);
        } else {
            console.log('Sample reports already exist, skipping insertion');
        }
    } catch (error) {
        console.error('Error inserting sample data:', error.message);
    }
};

mongoose.connection.once('open', () => {
    insertSampleData();
});

// API Routes
app.get('/api/reports', async (req, res) => {
    try {
        const reports = await Report.find().sort({ startTime: -1 });
        if (reports.length === 0) {
            return res.status(200).json({ success: true, message: 'No reports found', data: [] });
        }
        const formattedReports = reports.map(report => ({
            id: report._id.toString(),
            name: report.name,
            description: report.description,
            location: report.location,
            resolved: report.resolved,
            actionTaken: report.actionTaken,
            rating: report.rating,
            comments: report.comments.map(comment => ({
                text: comment.text,
                date: comment.date
            }))
        }));
        res.status(200).json({ success: true, data: formattedReports });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ success: false, message: 'Error fetching reports', error: error.message });
    }
});

app.get('/api/uploads', async (req, res) => {
    try {
        const uploads = await Upload.find().sort({ timeElapsed: -1 });
        if (uploads.length === 0) {
            return res.status(200).json({ success: true, message: 'No uploads found', data: [] });
        }
        const formattedUploads = uploads.map(upload => ({
            id: upload._id.toString(),
            name: upload.name,
            contact: upload.contact,
            description: upload.description,
            location: upload.location,
            imageURL: upload.imageURL,
            status: upload.status,
            timeElapsed: upload.timeElapsed,
            rating: upload.rating,
            comments: upload.comments
        }));
        res.status(200).json({ success: true, data: formattedUploads });
    } catch (error) {
        console.error('Error fetching uploads:', error);
        res.status(500).json({ success: false, message: 'Error fetching uploads', error: error.message });
    }
});

// Rate a report
app.post('/api/reports/rate/:id', async (req, res) => {
    try {
        const { rating } = req.body;
        const parsedRating = parseInt(rating, 10);
        if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
            return res.status(400).json({ error: 'Rating must be a number between 0 and 5' });
        }
        const report = await Report.findByIdAndUpdate(req.params.id, { rating: parsedRating }, { new: true, runValidators: true });
        if (!report) return res.status(404).json({ error: 'Report not found' });
        res.json({ success: true, rating: report.rating });
    } catch (err) {
        console.error('Error updating report rating:', err);
        res.status(500).json({ error: 'Failed to update rating', details: err.message });
    }
});

// Comment on a report
app.post('/api/reports/comment/:id', async (req, res) => {
    try {
        const { comment } = req.body;
        if (!comment || typeof comment !== 'string' || comment.trim() === '') {
            return res.status(400).json({ error: 'Comment is required and must be a non-empty string' });
        }
        const report = await Report.findByIdAndUpdate(
            req.params.id,
            { $push: { comments: { text: comment } } },
            { new: true, runValidators: true }
        );
        if (!report) return res.status(404).json({ error: 'Report not found' });
        res.json({ success: true, comments: report.comments });
    } catch (err) {
        console.error('Error adding report comment:', err);
        res.status(500).json({ error: 'Failed to add comment', details: err.message });
    }
});

// Rate an upload
app.post('/api/uploads/rate/:id', async (req, res) => {
    try {
        const { rating } = req.body;
        const parsedRating = parseInt(rating, 10);
        if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
            return res.status(400).json({ error: 'Rating must be a number between 0 and 5' });
        }
        const upload = await Upload.findByIdAndUpdate(req.params.id, { rating: parsedRating }, { new: true, runValidators: true });
        if (!upload) return res.status(404).json({ error: 'Upload not found' });
        res.json({ success: true, rating: upload.rating });
    } catch (err) {
        console.error('Error updating upload rating:', err);
        res.status(500).json({ error: 'Failed to update rating', details: err.message });
    }
});

// Comment on an upload
app.post('/api/uploads/comment/:id', async (req, res) => {
    try {
        const { comment } = req.body;
        if (!comment || typeof comment !== 'string' || comment.trim() === '') {
            return res.status(400).json({ error: 'Comment is required and must be a non-empty string' });
        }
        const upload = await Upload.findByIdAndUpdate(
            req.params.id,
            { $push: { comments: { text: comment } } },
            { new: true, runValidators: true }
        );
        if (!upload) return res.status(404).json({ error: 'Upload not found' });
        res.json({ success: true, comments: upload.comments });
    } catch (err) {
        console.error('Error adding upload comment:', err);
        res.status(500).json({ error: 'Failed to add comment', details: err.message });
    }
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health Check Route
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(500).json({ error: 'Something went wrong on the server' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});