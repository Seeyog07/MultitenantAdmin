import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate a professional Job Description using Gemini AI
 * @param {Object} offerDetails - Details from offer
 * @param {Object} additionalDetails - Additional HR details
 * @returns {Promise<Object>} Generated JD content
 */
export const generateJDWithAI = async (offerDetails, additionalDetails) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an expert HR professional and job description writer. Create a professional, comprehensive job description based on the following information:

**Offer Details:**
- Job Title: ${offerDetails.jobTitle}
- Department/Description: ${offerDetails.description}
- Location: ${offerDetails.location}${offerDetails.city ? `, ${offerDetails.city}` : ""}
- Employment Type: ${offerDetails.employmentType}
- Positions Available: ${offerDetails.positionAvailable}
- Salary: ${offerDetails.salary} ${offerDetails.currency}
- Required Skills: ${offerDetails.skills.join(", ")}
- Preferred Skills: ${offerDetails.preferredSkills && offerDetails.preferredSkills.length > 0 ? offerDetails.preferredSkills.join(", ") : "None specified"}
- Experience Required: ${offerDetails.experience}

**Additional HR Details:**
- Company Name: ${additionalDetails.companyName || "Not specified"}
- Department: ${additionalDetails.department || "Not specified"}
- Reporting Manager: ${additionalDetails.reportingManager || "Not specified"}
- Key Responsibilities: ${additionalDetails.keyResponsibilities || "Not specified"}
- Required Qualifications: ${additionalDetails.qualifications || "Not specified"}
- Benefits: ${additionalDetails.benefits || "Not specified"}
- Company Culture/Additional Notes: ${additionalDetails.additionalNotes || "Not specified"}

Please generate a professional job description with the following sections in JSON format:
{
  "jobSummary": "A compelling 2-3 sentence overview of the position",
  "responsibilities": ["Array of 6-8 key responsibilities"],
  "requirements": ["Array of 6-8 essential requirements and qualifications"],
  "benefits": ["Array of benefits and perks"],
  "additionalInfo": "Any additional information about the role or company culture"
}

Make sure the description is professional, engaging, and tailored to attract the right candidates.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response as JSON");
    }

    const generatedJD = JSON.parse(jsonMatch[0]);

    return {
      success: true,
      data: generatedJD,
      raw: text,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Filter resumes with AI for a JD
export async function filterResumesWithAI(jd, candidates) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `You are an expert technical recruiter. Given the following job description and a list of candidates (with resume links and details), select the best-fit candidates for this role. For each candidate, provide a professional explanation and a fit score (0-100) based on their resume and the JD. Return two lists: filtered (best fit) and unfiltered (not a fit). Format:
{
  filtered: [
    { id, score, explanation }
  ],
  unfiltered: [
    { id, score, explanation }
  ]
}

Job Description:
Title: ${jd.jobSummary}
Responsibilities: ${jd.responsibilities.join(", ")}
Requirements: ${jd.requirements.join(", ")}

Candidates:
${candidates.map(c => `- Name: ${c.name}, Email: ${c.email}, Resume: ${c.resume}, Reallocate: ${c.reallocate}` ).join("\n")}

Be objective, fair, and professional. Score out of 100. Explanation should be 1-2 sentences.`;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Failed to parse AI response as JSON");
    const parsed = JSON.parse(jsonMatch[0]);
    return { success: true, filtered: parsed.filtered, unfiltered: parsed.unfiltered };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export default { generateJDWithAI };
