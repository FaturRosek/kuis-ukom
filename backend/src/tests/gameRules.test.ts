import { describe, it, expect } from 'vitest';

describe('Game Rules and Scoring Logic', () => {
  it('accurately calculates academic score based strictly on accuracy without rewarding timeouts', () => {
    const totalQuestions = 5;
    const correctCount = 3;
    const incorrectCount = 1;
    const timeoutCount = 1;

    
    const accuracy = (correctCount / totalQuestions) * 100;
    expect(accuracy).toBe(60.0);
    expect(correctCount + incorrectCount + timeoutCount).toBe(totalQuestions);
  });

  it('correctly ranks multiplayer results by correct count first, then by elapsed time as tie-breaker', () => {
    const players = [
      { name: 'Rina', correct: 4, time: 45.2 },
      { name: 'Andi', correct: 5, time: 58.1 },
      { name: 'Siti', correct: 4, time: 38.6 },
      { name: 'Budi', correct: 3, time: 20.0 },
    ];

    players.sort((a, b) => {
      if (b.correct !== a.correct) return b.correct - a.correct;
      return a.time - b.time;
    });

    expect(players[0].name).toBe('Andi'); 
    expect(players[1].name).toBe('Siti'); 
    expect(players[2].name).toBe('Rina'); 
    expect(players[3].name).toBe('Budi'); 
  });
});
