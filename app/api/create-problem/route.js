
import { getJudgeOLanguageId, pullBatchResults, submitBatch } from "@/lib/judge0";
import { currentUserRole, getCurrentUser } from "@/modules/auth/actions";
import { UserRole } from "@/prisma/generated/enums";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    const userRole = await currentUserRole();
    const user = await getCurrentUser();

    if (userRole !== UserRole.ADMIN) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      difficulty,
      tags,
      hints,
      editorial,
      examples,
      constraints,
      testCases,
      codeSnippets,
      referenceSolutions,
    } = body;

    if(!title || !description || !difficulty || !testCases || !codeSnippets || !referenceSolutions) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if(!Array.isArray(testCases) || testCases.length === 0) {
      return NextResponse.json(
        { success: false, message: "Test cases must be a non-empty array" },
        { status: 400 }
      );
    }

    if(! referenceSolutions || typeof referenceSolutions !== 'object') {
      return NextResponse.json(
        { success: false, message: "Reference solutions must be provided for all languages" },
        { status: 400 }
      );
    }

    for(const [language, solutionCode] of Object.entries(referenceSolutions)) {

      const languageId = getJudgeOLanguageId(language);
      if(!languageId) {
        return NextResponse.json(
          { success: false, message: `Unsupported language: ${language}` },
          { status: 400 }
        );
      }

      const submissions = testCases.map(({input, output}) => ({
        language_id: languageId,
        source_code: solutionCode,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map(res => res.token)

      const results = await pullBatchResults(tokens);

      for(let i=0; i<results.length; i++) {
        const result = results[i];

        if(result.status.id !== 3) {
          return NextResponse.json(
            {
              error: `Validation failed for ${language}`,
              testCase: {
                input: submissions[i].stdin,
                expectedOutput: submissions[i].expected_output,
                actualOutput: result.stdout,
                error: result.stderr || result.compile_output,
              },
              details: result,
            },
            { status: 400 }
          );
        }
      }
    }
    // Step 3: Save the problem in the database after all validations pass

     const newProblem = await db.problem.create({
        data: {
          title,
          description,
          difficulty,
          tags,
          hints,
          editorial,
          examples,
          constraints,
          testCases,
          codeSnippets,
          referenceSolutions,
          userId: user.id,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Problem created successfully",
        data: newProblem,
      }, { status: 201 });
    
  } catch (error) {
        console.error("❌ Error creating problem:", error);
        return NextResponse.json({ success: false, error: "Failed to create problem" }, { status: 500 });
  }
}






