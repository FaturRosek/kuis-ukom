export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface QuestionSet {
  id: string;
  category_id: string;
  title: string;
  description?: string | null;
  status: 'draft' | 'published';
  category_name?: string;
  question_count?: number;
  created_at?: string;
}

export interface QuestionOption {
  id: string;
  question_id?: string;
  option_label: string;
  option_text: string;
  is_correct?: boolean;
  sort_order: number;
}

export interface Question {
  id: string;
  category_id: string;
  question_set_id: string;
  question_text: string;
  image_url?: string | null;
  explanation?: string | null;
  difficulty?: 'easy' | 'medium' | 'hard';
  status: 'draft' | 'published';
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
  question_set_id: string;
  mode: 'solo' | 'multiplayer';
  duration_per_question: number;
  total_questions: number;
  status: 'active' | 'completed';
}

export interface SoloQuestionClientView {
  id: string;
  order: number;
  total: number;
  question_text: string;
  image_url?: string | null;
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
  imageUrl?: string | null;
  image_url?: string | null;
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

export interface RoomParticipant {
  id: string;
  room_id: string;
  player_name: string;
  is_host: boolean;
  is_ready: boolean;
  score: number;
  connected: boolean;
}

export interface MultiplayerRoom {
  id: string;
  room_code: string;
  host_id?: string | null;
  host_name: string;
  question_set_id: string;
  duration_per_question: number;
  status: 'lobby' | 'playing' | 'ended';
  question_set_title?: string;
  participants?: RoomParticipant[];
}

export interface LeaderboardItem {
  id: string;
  playerName: string;
  isHost: boolean;
  correctCount: number;
  totalAnswered: number;
  totalTimeSeconds: number;
  score: number;
}

export interface PracticeHistoryItem {
  id: string;
  session_id: string;
  player_name: string;
  total_questions: number;
  correct_count: number;
  incorrect_count: number;
  timeout_count: number;
  score_percentage: number;
  total_time_seconds: number;
  created_at: string;
  question_set_title: string;
  category_name: string;
  mode: string;
}
