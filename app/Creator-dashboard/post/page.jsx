import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/getUserProfile";

export default async function PostSelectorPage() {
  const profile = await getUserProfile();

  if (!profile) redirect("/login");

  // Auto-redirect to their specific niche if they are approved
  // Mappings from Step1Category.jsx IDs
  const category = profile.category?.toLowerCase();

  if (category === 'lifestyle') redirect('/creator-dashboard/post/food');
  if (category === 'music') redirect('/creator-dashboard/post/music');
  if (category === 'storyteller') redirect('/creator-dashboard/post/story');

  // Fallbacks for flexibility
  if (category === 'food') redirect('/creator-dashboard/post/food');
  if (category === 'stories' || category === 'storytelling') redirect('/creator-dashboard/post/story');

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">
          What would you like to share?
        </h1>
        <p className="text-gray-400 mt-2">
          Choose the type of cultural content you want to post.
        </p>
      </div>

      {/* Content Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* ===== Story Card ===== */}
        <Link
          href="/creator-dashboard/post/story"
          className="bg-[#11151F] border border-gray-800 hover:border-red-500 transition-all rounded-xl p-8 group"
        >
          <div className="text-4xl mb-4">📖</div>
          <h2 className="text-xl font-semibold group-hover:text-red-400 transition-colors">
            Traditional Story
          </h2>
          <p className="text-gray-400 mt-3 text-sm">
            Share written folklore or upload an audio narration of a traditional story.
          </p>
        </Link>

        {/* ===== Music Card ===== */}
        <Link
          href="/creator-dashboard/post/music"
          className="bg-[#11151F] border border-gray-800 hover:border-red-500 transition-all rounded-xl p-8 group"
        >
          <div className="text-4xl mb-4">🎵</div>
          <h2 className="text-xl font-semibold group-hover:text-red-400 transition-colors">
            Music
          </h2>
          <p className="text-gray-400 mt-3 text-sm">
            Upload traditional or modern cultural music with cover artwork.
          </p>
        </Link>

        {/* ===== Food Card ===== */}
        <Link
          href="/creator-dashboard/post/food"
          className="bg-[#11151F] border border-gray-800 hover:border-red-500 transition-all rounded-xl p-8 group"
        >
          <div className="text-4xl mb-4">🍲</div>
          <h2 className="text-xl font-semibold group-hover:text-red-400 transition-colors">
            Food / Recipe
          </h2>
          <p className="text-gray-400 mt-3 text-sm">
            Share traditional dishes, ingredients, preparation steps, and images.
          </p>
        </Link>

      </div>
    </div>
  );
}
