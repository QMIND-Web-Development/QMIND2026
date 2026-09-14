export function shuffleProjects<T>(projects: readonly T[], random = Math.random): T[] {
  const shuffled = [...projects];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const destination = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[destination]] = [shuffled[destination], shuffled[index]];
  }

  return shuffled;
}
