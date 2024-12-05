import { Card, CardContent } from "@/components/ui/card";
import { CharacterVoiceActor } from "@/types/server/anime-info-response";
import Image from "next/image";

interface AnimeCharactersProps {
  characters: CharacterVoiceActor[];
}

export function AnimeCharacters({ characters }: AnimeCharactersProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {characters?.map((char) => (
        <Card key={char.character.id}>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <div className="relative w-16 h-16">
                <Image
                  src={char.character.poster}
                  alt={char.character.name}
                  fill
                  className="rounded object-cover"
                  sizes="64px"
                />
              </div>
              <div>
                <p className="font-medium text-sm">{char.character.name}</p>
                <p className="text-xs text-gray-500">{char.character.cast}</p>
                <p className="text-xs mt-1">{char.voiceActor.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
