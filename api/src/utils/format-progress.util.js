export const formatProgressResponse = (goal, trackings) => {
  const totalCalories = trackings.reduce((sum, t) => sum + t.calories, 0);
  const totalExerciseMins = trackings.reduce(
    (sum, t) => sum + t.exerciseMins,
    0,
  );

  return {
    goal: {
      id: goal.id,
      targetWeeklyCalories: goal.targetWeeklyCalories,
      targetExerciseMins: goal.targetExerciseMins,
      createdAt: goal.createdAt,
    },
    current: {
      totalCalories,
      totalExerciseMins,
    },
    percentage: {
      calories: Math.min(
        100,
        Math.round((totalCalories / goal.targetWeeklyCalories) * 100) || 0,
      ),
      exerciseMins: Math.min(
        100,
        Math.round((totalExerciseMins / goal.targetExerciseMins) * 100) || 0,
      ),
    },
  };
};
