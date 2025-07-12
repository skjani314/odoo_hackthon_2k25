import SkillList from '../../components/SkillList/SkillList'; // Assuming you have a SkillList component




const UserCard = ({ user, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={() => onClick(user._id)}
      role="button"
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(user._id);
        }
      }}
    >
      <img
        src={user.profilePhoto || 'https://placehold.co/100x100/cccccc/333333?text=No+Photo'}
        alt={`${user.name}'s profile`}
        className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-blue-200"
      />
      <h3 className="text-xl font-semibold text-gray-800 mb-1">{user.name}</h3>
      {user.location && <p className="text-gray-600 text-sm mb-2">{user.location}</p>}
      <div className="w-full mt-2">
        <SkillList skills={user.skillsOffered} type="offered" />
        <SkillList skills={user.skillsWanted} type="wanted" />
      </div>
    </div>
  );
};

export default UserCard;