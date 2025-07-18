const express = require('express')
const cors = require('cors')
const multer = require('multer')
const fs = require('fs')
const dotenv = require('dotenv')
const pdfParse = require('pdf-parse')
const {GoogleGenerativeAI} = require('@google/generative-ai')

dotenv.config();

const app = express()
const PORT=5000

app.use(cors(
  {
// origin: 'https://ai-powered-resume-analyzer.vercel.app', // ✅ Replace with your actual Vercel frontend URL
origin: ["https://ai-powered-resume-analyzer-beige.vercel.app/"],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true  }
))
app.use(express.json())

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
})
const upload = multer({storage})

const genAI = new GoogleGenerativeAI(process.env.API_KEY)


app.get('/', (req, res)=>{
  res.json('Hello , Backend Working')
})
app.post('/upload', upload.single('resume'), async (req, res)=>{
    try{
        const filePath = req.file.path
        const pdfBuffer = fs.readFileSync(filePath)
        const pdfData = await pdfParse(pdfBuffer)
        const resumeText=pdfData.text
     
         const prompt = `
You are an ATS (Applicant Tracking System) expert.
Score the following resume out of 100.
Then give detailed feedback to improve it for job applications.
Only return a JSON like:
{
  "score": 85,
  "feedback": "Your resume is well-structured but lacks keywords related to the job."
}

Resume Content:
${resumeText}
`;

const model = genAI.getGenerativeModel({model:"gemini-1.5-pro-latest"})
const result = await model.generateContent(prompt)
const response = await result.response
const text = response.text()
const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      const json = JSON.parse(match[0]);
      res.json(json);
    } else {
      res.status(500).json({ error: 'Gemini response format invalid.', raw: text });
    }
    } catch(error){
      console.error('Error', error);
      res.status(500).json({error: "Something went wrong. Try again later."})
    }
})

app.listen(PORT, ()=>{
  console.log(`Server is running on http://localhost:${PORT}`);
  
})
