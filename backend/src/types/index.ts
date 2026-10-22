export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface QuestionSet {
  id: string;
  category_id: string;
  title: string;
  description?: string | null;
  status: 'draft' | 'published';
  created_at?: string;
  updated_at?: string;
  category_name?: string;
  question_count?: number;
}

export interface QuestionOption {
  id?: string;
  question_id?: string;
  option_label: string; 
  option_text: string;
  is_correct: boolean;
  sort_order: number;
}

export interface Question {
  id: string;
  category_id: string;
  question_set_id: string;
  question_text: string;
  explanation?: string | null;
  difficulty?: 'easy' | 'medium' | 'hard';
  status: 'draft' | 'published';
  source_metadata?: any;
  created_at?: string;
  updated_at?: string;
  options?: QuestionOption[];
}

export interface ParsedQuestionDraft {
  tempId: string;
  questionNumber: number;
  questionText: string;
  options: {
    label: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation?: string;
  hasValidKey: boolean;
  warnings: string[];
}

export interface SoloSession {
  id: string;
  user_id?: string | null;
  room_id?: string | null;
  question_set_id: string;
  mode: 'solo' | 'multiplayer';
  duration_per_question: number;
  total_questions: number;
  status: 'active' | 'completed';
  started_at: string;
  ended_at?: string | null;
}

export interface SoloQuestionClientView {
  id: string;
  order: number;
  total: number;
  question_text: string;
  duration_seconds: number;
  options: {
    id: string;
    label: string;
    text: string;
  }[];
}

export interface AnswerFeedback {
  questionId: string;
  isCorrect: boolean;
  isTimeout: boolean;
  selectedOptionId: string | null;
  correctOptionId: string;
  correctOptionLabel: string;
  explanation: string | null;
  timeTakenSeconds: number;
}

export interface ReviewQuestionItem {
  questionId: string;
  questionOrder: number;
  questionText: string;
  options: {
    id: string;
    label: string;
    text: string;
    isCorrect: boolean;
  }[];
  userAnswer: {
    selectedOptionId: string | null;
    isCorrect: boolean;
    isTimeout: boolean;
    timeTakenSeconds: number;
  } | null;
  correctOption: {
    id: string;
    label: string;
    text: string;
  };
  explanation: string | null;
}

export interface SessionResultSummary {
  sessionId: string;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  timeoutCount: number;
  scorePercentage: number;
  totalTimeSeconds: number;
  title: string;
  completedAt: string;
}

export interface MultiplayerRoom {
  id: string;
  room_code: string;
  host_id?: string | null;
  host_name: string;
  question_set_id: string;
  duration_per_question: number;
  status: 'lobby' | 'playing' | 'ended';
  created_at?: string;
  question_set_title?: string;
  participants?: RoomParticipant[];
}

export interface RoomParticipant {
  id: string;
  room_id: string;
  user_id?: string | null;
  player_name: string;
  socket_id?: string | null;
  is_host: boolean;
  is_ready: boolean;
  score: number;
  correct_count?: number;
  connected: boolean;
  joined_at?: string;
}
