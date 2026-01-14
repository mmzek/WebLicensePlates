const isBrowser = () => typeof window !== 'undefined';

export function getUserId(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem("userId");
}

export function setUserId(userId: string): void {
  if (!isBrowser()) return;
  localStorage.setItem("userId", userId);
}

export function getUserName(): string {
  if (!isBrowser()) return '';
  
  let userName = localStorage.getItem("userName");

  if (!userName) {
    userName = generateNick();
    localStorage.setItem("userName", userName);
  }
  
  return userName;
}

export function setUserName(name: string): void {
  if (!isBrowser()) return;
  localStorage.setItem("userName", name);
}

export function clearUserData(): void {
  if (!isBrowser()) return;
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
}

function generateNick(): string {
  const adjectives = ["Szybki", "Mądry", "Dziki", "Super"];
  const nouns = ["Kierowca", "Mistrz", "Raf", "Pro"];
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNum = Math.floor(Math.random() * 1000);
  return `${randomAdj}${randomNoun}${randomNum}`;
}
