import { useState } from "react";
import {
  getUserId,
  getUserName,
  setUserName,
  setUserId,
  clearUserData,
} from "../../actions/user-storage";
import { useCreateUser } from "../../hooks/use-create-user";

export default function QuizStart({
  onStart,
}: {
  onStart: (nick: string) => void;
}) {
  const [nick, setNick] = useState(() => getUserName());
  const [savedName] = useState(() => getUserName());
  const createUser = useCreateUser();
  const existingUserId = getUserId();

  const handleStart = () => {
    if (!nick.trim()) {
      return;
    }

    const nickChanged = savedName && savedName !== nick.trim();

    if (nickChanged && existingUserId) {
      clearUserData();
    }

    if (existingUserId && !nickChanged) {
      setUserName(nick);
      onStart(nick);
      return;
    }

    setUserName(nick);

    createUser.mutate(
      { name: nick },
      {
        onSuccess: (data) => {
          if (data && data.userId) {
            setUserId(data.userId);
          }
          onStart(nick);
        },
        onError: (error) => {
          console.error("Błąd tworzenia użytkownika:", error);
        },
      },
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !createUser.isPending && nick.trim()) {
      handleStart();
    }
  };

  const nickChanged = savedName && savedName !== nick.trim();
  const isReturningUser = existingUserId && !nickChanged;

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
              {existingUserId ? "Witaj ponownie!" : "Podaj swoją nazwę"}
            </label>
            <input
              id="nick"
              type="text"
              value={nick}
              onChange={(e) => setNick(e.target.value)}
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
            disabled={createUser.isPending || !nick.trim()}
            className="bg-blue-400 px-4 py-2 rounded-xl text-black font-bold w-full filter"
          >
            {" "}
            START QUIZU!
          </button>

          {createUser.isError && (
            <div className="bg-red-500/20 rounded-lg p-3 text-center">
              <p className="text-red-400 text-sm font-semibold">
                Błąd zapisu użytkownika
              </p>
            </div>
          )}

          {isReturningUser && (
            <div className="bg-green-500/20 rounded-lg p-3 text-center">
              <p className="text-green-400 text-xs">
                Witaj ponownie, {savedName}!
              </p>
            </div>
          )}

          {nickChanged && (
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
