import { notFound } from "next/navigation";
import { SceneStudio } from "@/components/admin/SceneStudio";
import { getSceneStudio } from "../actions";

export default async function SceneStudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const scene = await getSceneStudio(id);
    if (!scene) notFound();

    const drama = Array.isArray(scene.drama) ? scene.drama[0] : scene.drama;

    return (
      <SceneStudio
        scene={{
          ...scene,
          drama: drama ?? null,
          assets: scene.assets ?? [],
          clues: scene.clues ?? [],
        }}
      />
    );
  } catch {
    notFound();
  }
}
