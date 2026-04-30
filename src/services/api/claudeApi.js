export const getHydrationInsight = async ({ logs, totalMl, goalMl, userName }) => {
  // Simulate network request delay (1.5 seconds) to make the UI look authentic
  await new Promise(resolve => setTimeout(resolve, 1500));

  const name = userName || 'there';
  const percent = goalMl > 0 ? (totalMl / goalMl) * 100 : 0;
  
  let observation = "";
  let tip = "";
  let encouragement = "";

  // Generate dynamic-looking responses based on the user's actual progress
  if (percent >= 100) {
    observation = `Incredible job, ${name}. You've already hit your goal of ${goalMl}ml today!`;
    tip = "For tomorrow, remember that consistency is key for optimal cellular hydration and maintaining energy levels.";
    encouragement = "Amazing work staying disciplined today.";
  } else if (percent > 50) {
    observation = `You are over halfway to your goal with ${totalMl}ml logged.`;
    tip = "Try drinking a full glass of water right before your next meal to easily close that gap and aid digestion.";
    encouragement = "You are doing great, keep that momentum going!";
  } else if (logs.length > 0) {
    observation = `You've started your day with ${totalMl}ml so far.`;
    tip = "Remember that sipping small amounts consistently throughout the day is much better than chugging a lot at once.";
    encouragement = "Let's pick up the pace and reach that target!";
  } else {
    observation = `I notice you haven't logged any drinks yet today, ${name}.`;
    tip = "Kickstart your metabolism and wake up your brain by having a large glass of water right now.";
    encouragement = "It is never too late in the day to start hydrating!";
  }

  return `${observation} ${tip} ${encouragement}`;
};