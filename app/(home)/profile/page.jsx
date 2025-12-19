
import { getCurrentUserData } from "@/modules/profile/actions";
import PlaylistsSection from "@/modules/profile/components/playlist-section";
import ProfileStats from "@/modules/profile/components/profile-stats";
import SolvedProblems from "@/modules/profile/components/solved-problems";
import SubmissionsHistory from "@/modules/profile/components/submission-history";
import UserInfoCard from "@/modules/profile/components/user-info-card";
import { currentUser } from '@clerk/nextjs/server'

const ProfilePage = async () => {

    const profileData = await getCurrentUserData();
    const user = await currentUser();

    if(!user){
      return (
        <div className="flex flex-col items-center justify-center min-h-screen py-32">
          <h2 className="text-2xl font-semibold mb-4">User not found</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            The profile you are looking for does not exist.
          </p>
        </div>
      )
    }



    // console.log(profileData);

    return (
       <div className="min-h-screen  py-32">
      <div className="container mx-auto px-4 max-w-7xl">
        <UserInfoCard userData={profileData} />

        <ProfileStats
          submissions={profileData.submissions}
          solvedCount={profileData.solvedProblems.length}
          playlistCount={profileData.playlists.length}
        />

        <div className="grid  gap-8">
          <SolvedProblems solvedProblems={profileData.solvedProblems} />
          <PlaylistsSection playlists={profileData.playlists} />
        </div>
        <div className="mt-6">

        <SubmissionsHistory submissions={profileData.submissions} />
        </div>

      </div>
    </div>
    )
}

export default ProfilePage;