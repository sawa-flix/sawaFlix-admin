import { getUserProfile } from "@/lib/getUserProfile";
import { getCreatorContent } from "@/lib/getCreatorContent"; // you'll create this
import Link from "next/link";

export default async function CreatorContentPage() {
  const profile = await getUserProfile();
  const content = await getCreatorContent(profile.id);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Content</h1>
        <p className="text-gray-400 mt-2">
          Manage and track your uploaded cultural content.
        </p>
      </div>

      {/* Empty State */}
      {content.length === 0 && (
        <div className="bg-[#11151F] border border-gray-800 rounded-xl p-10 text-center">
          <p className="text-gray-400 mb-4">
            You haven’t posted any content yet.
          </p>
          <Link
            href="/creator/post"
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition"
          >
            Post Your First Content
          </Link>
        </div>
      )}

      {/* Content Grid */}
      {content.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {content.map((item) => (
            <div
              key={item.id}
              className="bg-[#11151F] border border-gray-800 rounded-xl p-6 flex flex-col justify-between"
            >
              <div>
                {/* Type Icon */}
                <div className="text-3xl mb-3">
                  {item.type === "story" && "📖"}
                  {item.type === "music" && "🎵"}
                  {item.type === "food" && "🍲"}
                </div>

                {/* Title */}
                <h2 className="text-lg font-semibold">
                  {item.title}
                </h2>

                {/* Description Preview */}
                <p className="text-gray-400 text-sm mt-2 line-clamp-3">
                  {item.description || "No description provided."}
                </p>

                {/* Status Badge */}
                <div className="mt-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium
                      ${item.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : item.status === "approved"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }
                    `}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Date */}
                <p className="text-xs text-gray-500 mt-3">
                  Posted on{" "}
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center mt-6">
                <Link
                  href={`/creator/content/${item.id}/edit`}
                  className="text-sm text-gray-400 hover:text-white transition"
                >
                  Edit
                </Link>

                <button className="text-sm text-red-500 hover:text-red-400 transition">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}