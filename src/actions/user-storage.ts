"use client";

export function getUserId(): number | null {
  const userId = localStorage.getItem("userId");
  return userId ? parseInt(userId, 10) : null;
}

export function setUserId(userId: number): void {
  localStorage.setItem("userId", userId.toString());
}

export function getUserName(): string {
  let userName = localStorage.getItem("userName");

  if (!userName) {
    userName = generateNick();
    localStorage.setItem("userName", userName);
  }

  return userName;
}

export function setUserName(name: string) {
  localStorage.setItem("userName", name);
}

export function clearUserData(): void {
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
}

function generateNick(): string {
  const number = Math.floor(Math.random() * 10000);
  return `Gracz_${number}`;
}
