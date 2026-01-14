"use client";
import { useState, useEffect } from "react";
import {
  getUserId,
  getUserName,
  setUserName,
  setUserId,
  clearUserData,
} from "../../actions/user-storage";
import { useCreateUser } from "../../hooks/use-create-user";
import { useHallOfFame } from "../../hooks/use-hall-of-fame";

interface LeaderboardEntry {
  position: number;
  userName: string;
  totalScore: number;
}

interface UserState {
  nick: string;
  savedName: string;
  existingUserId: string | null;
}

export default function QuizStart({
  onStart,
}: {
  onStart: (nick: string) => void;
}) {
  const [userState, setUserState] = useState<UserState>({
    nick: "",
    savedName: "",
    existingUserId: null,
  });
  const [error, setError] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const createUser = useCreateUser();
  const { data: hallOfFame } = useHallOfFame();

  useEffect(() => {
    const userId = getUserId();
    const userName = getUserName();
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserState({
      nick: userName,
      savedName: userName,
      existingUserId: userId,
    });
    setIsHydrated(true);
  }, []);

  const handleStart = () => {
    if (!isHydrated) {
      console.error("Hydration nie gotowa");
      return;
    }

    if (!userState.nick.trim()) {
      return;
    }

    setError("");

    const nickChanged = userState.savedName && userState.savedName !== userState.nick.trim();

    if (nickChanged && userState.existingUserId) {
      clearUserData();
      setUserState(prev => ({ ...prev, existingUserId: null }));
      setUserName(userState.nick);
      
      createUser.mutate(
        { name: userState.nick },
        {
          onSuccess: (data) => {
            if (data && data.userId) {
              setUserId(String(data.userId));
            }
            onStart(userState.nick);
          },
          onError: (error) => {
            console.error("Błąd tworzenia użytkownika:", error);
            setError("Błąd tworzenia użytkownika. Spróbuj ponownie.");
          },
        },
      );
      return;
    }

    if (userState.existingUserId && !nickChanged) {
      setUserName(userState.nick);
      onStart(userState.nick);
      return;
    }

    setUserName(userState.nick);

    createUser.mutate(
      { name: userState.nick },
      {
        onSuccess: (data) => {
          if (data && data.userId) {
            setUserId(String(data.userId));
          }
          onStart(userState.nick);
        },
        onError: (error) => {
          console.error("Błąd tworzenia użytkownika:", error);
          setError("Błąd tworzenia użytkownika. Spróbuj ponownie.");
        },
      },
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !createUser.isPending && userState.nick.trim()) {
      handleStart();
    }
  };

  const handleNickChange = (newNick: string) => {
    setUserState(prev => ({ ...prev, nick: newNick }));
    
    const nickChanged = userState.savedName && userState.savedName !== newNick.trim();
    
    if (hallOfFame && hallOfFame.length > 0 && newNick.trim()) {
      const nickExists = hallOfFame.some(
        (entry: LeaderboardEntry) => entry.userName.toLowerCase() === newNick.trim().toLowerCase(),
      );
      
      if (nickExists && (!userState.existingUserId || nickChanged)) {
        setError("Ten nick już istnieje! Jeśli to nie ty - wybierz inny.");
      } else {
        setError("");
      }
    } else {
      setError("");
    }
  };

  const nickChanged = userState.savedName && userState.savedName !== userState.nick.trim();
  const isReturningUser = userState.existingUserId && !nickChanged;
  const showNewNickMessage = nickChanged && !error;

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="bg-[#1f1f1f] p-8 rounded-3xl shadow-2xl border-2 border-blue-400 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-blue-500 font-bold uppercase text-2xl">
            Quiz o rejestracjach
          </h2>
          <p className="text-gray-400 text-sm">
            Sprawdź swoją wiedzę o polskich tablicach rejestracyjnych
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="nick"
              className="block text-sm font-semibold text-gray-300 mb-2"
            >
              {userState.existingUserId ? "Witaj ponownie!" : "Podaj swoją nazwę"}
            </label>
            <input
              id="nick"
              type="text"
              value={userState.nick}
              onChange={(e) => handleNickChange(e.target.value)}
              onKeyPress={handleKeyPress}
              maxLength={20}
              placeholder="Wpisz nick..."
              className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 transition-colors"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">Maksymalnie 20 znaków</p>
          </div>

          <button
            onClick={handleStart}
            disabled={!isHydrated || createUser.isPending || !userState.nick.trim()}
            className="bg-blue-400 px-4 py-2 rounded-xl text-black font-bold w-full filter"
          >
            START QUIZU!
          </button>

          {error && (
            <div className="bg-purple-500/20 rounded-lg p-3 text-center">
              <p className="text-purple-400 text-sm font-semibold">{error}</p>
            </div>
          )}

          {createUser.isError && !error && (
            <div className="bg-red-500/20 rounded-lg p-3 text-center">
              <p className="text-red-400 text-sm font-semibold">
                Błąd zapisu użytkownika
              </p>
            </div>
          )}

          {isReturningUser && (
            <div className="bg-green-500/20 rounded-lg p-3 text-center">
              <p className="text-green-400 text-xs">
                Witaj ponownie, {userState.savedName}!
              </p>
            </div>
          )}

          {showNewNickMessage && (
            <div className="bg-blue-500/20 rounded-lg p-3 text-center">
              <p className="text-blue-400 text-xs">
                Nowy nick - zostaniesz zarejestrowany jako nowy gracz
              </p>
            </div>
          )}
        </div>
        <div className="mt-8 pt-6 border-t border-gray-700">
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">
            Jak grać?
          </h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-blue-400">1.</span>
              <span>Wskaż województwo na mapie</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">2.</span>
              <span>Wybierz powiat z listy</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400">3.</span>
              <span>Zdobądź punkty za szybkość i dokładność!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
