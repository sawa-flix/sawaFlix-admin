import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/getUserProfile";

export default async function PostFoodPage() {
    const profile = await getUserProfile();
    
    // Kick them out if they aren't approved for food
    if (profile.category?.toLowerCase() !== 'food') {
        redirect('/creator-dashboard'); 
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Post Food</h1>
            <p className="text-gray-400">Upload and share your food recipes.</p>
        </div>
    );
}
