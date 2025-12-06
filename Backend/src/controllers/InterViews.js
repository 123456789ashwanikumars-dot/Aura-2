const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const InterviewModel = require("../model/InterViewQuestionModel");

dotenv.config();

async function generateWithRetry(model, payload, retries = 3, delay = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(payload);
      return result;
    } catch (error) {
      if (error.message.includes("503")) {
        console.warn(` Gemini API overloaded (Attempt ${attempt}/${retries})`);
        if (attempt === retries) throw error;
        await new Promise((res) => setTimeout(res, delay * attempt));
      } else {
        throw error;
      }
    }
  }
}

/**
 * Controller: Generate AI-based interview questions
 */
const question = async (req, res) => {
  try {
    const { JobPosition, JobDescription, Experience } = req.body;

    // Validate inputs
    if (!JobPosition || !JobDescription || Experience === undefined || Experience === null) {
      return res.status(400).json({
        message:
          "Credential missing: JobPosition, JobDescription, or Experience is required.",
      });
    }

    //  Initialize Gemini client and choose model
    const ai = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
    let model;
    try {
      model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    } catch (err) {
      console.warn(" gemini-2.5-flash unavailable, switching to gemini-1.5-flash");
      model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    //  Construct prompt
    const messages = [
      {
        role: "user",
        parts: [
          {
            text: `You are an **AI Interview Question Generator** that produces **unique, high-quality**, and **role-specific** interview questions and answers every time you are called — even if the job inputs are the same.

### Objective:
Generate 5 relevant technical and behavioral interview questions **with fresh variations** and **detailed, accurate answers** based on the provided job information.

### Input Parameters:
- [Job Position]: ${JobPosition}
- [Job Description]: ${JobDescription}
- [Experience Level]: ${Experience}

### Guidelines:
1. **Relevance:** Tailor every question and answer specifically to the given job position and description.
2. **Difficulty Level:**
    - <2 years → beginner
    - 2–5 years → intermediate
    - >5 years → advanced
3. **Question Types (5 total):**
    - 3 technical
    - 1 scenario-based
    - 1 behavioral/soft-skill
4. **Answer Format:**
    - Each question should be followed by a detailed, clear, example-based answer.
5. **Output Format (JSON):**
{
  "JobPosition": "${JobPosition}",
  "Experience": ${Experience},
  "Questions": [
    { "Question": "Q1 text here", "Answer": "Answer to Q1 here" },
    ...
  ]
}

### Important:
Always return **valid JSON** strictly following the format above.
Avoid explanations outside JSON output.`
          }
        ]
      }
    ];

    //  Generate content with retry logic
    const result = await generateWithRetry(model, {
      contents: messages,
      systemInstruction: {
        role: "system",
        parts: [
          {
            text:
              "You are an AI Interview Question Generator that outputs only valid JSON containing high-quality, role-specific interview questions and answers.",
          },
        ],
      },
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    //  Parse and validate AI response
    const responseText = result.response.text();
    console.log(" Raw AI Response:", responseText);

    let aiResponseData;
    try {
      aiResponseData = JSON.parse(responseText);
    } catch (err) {
      console.error(" JSON Parsing Error:", err.message);
      return res.status(500).json({
        message: "AI response was not valid JSON, cannot process.",
        rawResponse: responseText,
      });
    }



    // Send response
    return res.status(201).json({
      message: "Interview questions generated and saved successfully!",
      data: {
        JobPosition: aiResponseData.JobPosition,
        JobDescription,
        Experience: aiResponseData.Experience,
        Questions: aiResponseData.Questions,

      },
    });

  } catch (error) {
    console.error(" Error in question controller:", error);

    if (error.message.includes("503")) {
      return res.status(503).json({
        message:
          "The AI model is currently overloaded. Please try again in a few seconds.",
      });
    }

    res.status(500).json({
      message: "Internal Server Error: " + error.message,
    });
  }
};



const InterviewResult = async (req, res) => {
  try {
    const { Question } = req.body;

    // Validate inputs
    if (!Question || !Array.isArray(Question)) {
      return res.status(400).json({
        message: "Missing required fields: Question array is required.",
      });
    }

    if (!Question.every(q => q.Question && q.Answer && q.userAnswer)) {
      return res.status(400).json({
        message: "Each question must include Question, Answer, and userAnswer.",
      });
    }

    // Initialize Gemini client
    const ai = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
    let model;
    try {
      model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    } catch (err) {
      console.warn("gemini-2.5-flash unavailable, switching to gemini-1.5-flash");
      model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    // Construct prompt for evaluation
    const evaluationPrompt = {
      role: "user",
      parts: [
        {
          text: `You are an AI Interview Evaluator. Evaluate the candidate's answers to the following interview questions and provide detailed feedback.

### Interview Details:

${Question.map((q, index) =>
            `Q${index + 1}: ${q.Question}
Candidate Answer: ${q.userAnswer}
Expected Answer: ${q.Answer}
ID: ${q._id}`
          ).join('\n\n')}

### Guidelines:
1. Evaluate each answer on accuracy, relevance, clarity, and completeness.
2. Provide an overall score out of 10 for the entire interview.
3. Give constructive feedback for improvement.
4. Suggest strengths and areas to work on.

### Output Format (JSON):
{
  "overallScore": 8.5,
  "feedback": "Detailed feedback here...",
  "questionEvaluations": [
    {
      "questionNumber": 1,
      "score": 9,
      "evaluation": "Detailed evaluation for Q1..."
    }
  ]
}

Always return valid JSON strictly following the format above.`
        }
      ]
    };

    // Generate evaluation
    const result = await generateWithRetry(model, {
      contents: [evaluationPrompt],
      systemInstruction: {
        role: "system",
        parts: [
          {
            text: "You are an AI Interview Evaluator that outputs only valid JSON containing detailed feedback and scores.",
          },
        ],
      },
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const responseText = result.response.text();
    console.log("Raw AI Evaluation Response:", responseText);

    let evaluationData;
    try {
      evaluationData = JSON.parse(responseText);
    } catch (err) {
      console.error("JSON Parsing Error:", err.message);
      return res.status(500).json({
        message: "AI evaluation response was not valid JSON.",
        rawResponse: responseText,
      });
    }

    return res.status(200).json({
      message: "Interview evaluated successfully!",
      data: evaluationData,
    });

  } catch (error) {
    console.error("Error in InterviewResult controller:", error);
    res.status(500).json({
      message: "Internal Server Error: " + error.message,
    });
  }
};




const StoreInterview = async (req, res) => {
  try {

    const data = req.body;
    //  Save generated questions in DB
    const newInterviewQuestions = await InterviewModel.create({
      InterViewModelCreator: req?.result._id,
      message: data?.message,
      feedback: data?.feedback,
      overallScore: data?.overallScore,
      Experience: data?.Experience,
      JobDescription: data?.JobDescription,
      JobPosition: data?.JobPosition,
      mergedData: data?.mergedData,
    });


    res.send("Data saved Sucessfully!!!")

  } catch (error) {


    res.send("Error: " + error);

  }



}



const TotalInterviewConducted = async (req, res) => {

  try {
    const _id = req.result?._id;

    const data = await InterviewModel.find({ InterViewModelCreator: `${_id}` });


    res.send(data)

  } catch (error) {
    res.send("The error : " + error)
  }


}



const getProblemDetail = async (req, res) => {
  try {
    const { id: problem_id } = req.params;

    // Validate ID
    if (!problem_id) {
      return res.status(400).json({
        success: false,
        message: "Problem ID is missing!",
      });
    }

    // Fetch from DB
    const problemData = await InterviewModel.findById(problem_id);

    // Check if exists
    if (!problemData) {
      return res.status(404).json({
        success: false,
        message: "No details available for this problem!",
      });
    }

    // Success response
    return res.status(200).json({
      message: "Problem details fetched successfully",
      data: problemData,
    });

  } catch (error) {
    console.error("Error fetching problem details:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};




module.exports = { question, InterviewResult, StoreInterview, TotalInterviewConducted, getProblemDetail };
