import { auth } from '@/auth'
import { EditProfileForm } from '@/components/user-profile-form'
import { userById } from '@/data/profile';


const ProfilePage = async () => {
  const userData = await auth();
  const fetchUserData = await userById(userData?.user?.id!);
 
  return (
    <>
    {    fetchUserData && <EditProfileForm user={fetchUserData} /> }
    </>
  )
}

export default ProfilePage