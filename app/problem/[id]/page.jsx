"use client";

import { useTheme } from "next-themes";
import Editor from "@monaco-editor/react";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Send,
  Code,
  FileText,
  Lightbulb,
  Trophy,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { getJudgeOLanguageId } from "@/lib/judge0";
import { toast } from "sonner";
import Link from "next/link";
import { getProblemById } from "@/modules/problems/actions";

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "EASY":
      return "bg-green-100 text-green-800 border-green-200";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "HARD":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const ProblemIdPage = ({ params }) => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [executionResponse, setExecutionResponse] = useState(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const resolvedParams = await params;
        console.log(resolvedParams);
        const problemData = await getProblemById(resolvedParams.id)
        if(problemData.success){
            setProblem(problemData.data);
            setCode(problemData.data.codeSnippets[selectedLanguage] || '')
        }
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };
    fetchProblems();
  }, [params]);

if(!problem){
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <Loader2 className='animate-spin size-5 text-amber-400' />
      </div>
    )
  }

  return(

      <div >{JSON.stringify(problem)}</div>
  )
};

export default ProblemIdPage;
