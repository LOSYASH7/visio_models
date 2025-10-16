import { Profile } from '../../components/Profile/Profile'

interface ProfilePageProps {
  user: any;
  onLogout: () => void;
}

export const ProfilePage = ({ user, onLogout }: ProfilePageProps) => {
  return (
    <>  
      <Profile user={user} onLogout={onLogout} />
    </>
  )
}

export default ProfilePage;