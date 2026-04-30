// State management for the VoterReady Simulator
export const state = {
    score: 0,
    maxPossibleScore: 0,
    categories: {
        'Booth Scenarios': { earned: 0, max: 0 },
        'EVM Knowledge': { earned: 0, max: 0 }
    },
    scenariosCompleted: 0
};

export function updateScore(category, pointsEarned, maxPoints) {
    state.categories[category].max += maxPoints;
    state.maxPossibleScore += maxPoints;
    state.categories[category].earned += pointsEarned;
    state.score += pointsEarned;
}

export function resetScore() {
    state.score = 0;
    state.maxPossibleScore = 0;
    for (const cat in state.categories) {
        state.categories[cat].earned = 0;
        state.categories[cat].max = 0;
    }
    state.scenariosCompleted = 0;
}
