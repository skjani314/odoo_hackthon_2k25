import React, { useState, useEffect } from 'react';
import SkillList from '../../components/SkillList/SkillList.jsx';
import AvailabilityDisplay from '../../components/Availability Display/AvailabilityDisplay.jsx';
import InputField from '../../components/ui/input_field/InputField.jsx';
import Button from '../../components/ui/button/Button.jsx';
import ErrorMessage from '../../components/ui/Error/Error.jsx';   




const UserProfile = ({ user, isEditable = false, onUpdateProfile, isLoading, error }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(user);

  useEffect(() => {
    setProfileData(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSkillChange = (skill, type, action) => {
    setProfileData((prev) => {
      const skillsArray = type === 'offered' ? [...prev.skillsOffered] : [...prev.skillsWanted];
      if (action === 'add' && !skillsArray.includes(skill)) {
        skillsArray.push(skill);
      } else if (action === 'remove') {
        return {
          ...prev,
          [type === 'offered' ? 'skillsOffered' : 'skillsWanted']: skillsArray.filter(s => s !== skill)
        };
      }
      return {
        ...prev,
        [type === 'offered' ? 'skillsOffered' : 'skillsWanted']: skillsArray
      };
    });
  };

  const handleSave = async () => {
    if (onUpdateProfile) {
      await onUpdateProfile(profileData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setProfileData(user);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <ErrorMessage message={error} />
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
        <div className="flex-shrink-0 mb-4 md:mb-0">
          <img
            src={profileData.profilePhoto || 'https://placehold.co/150x150/cccccc/333333?text=No+Photo'}
            alt={`${profileData.name}'s profile`}
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
          />
        </div>
        <div className="flex-grow text-center md:text-left">
          {isEditing ? (
            <>
              <InputField
                label="Name"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                required
              />
              <InputField
                label="Location"
                name="location"
                value={profileData.location}
                onChange={handleChange}
                placeholder="e.g., New York, USA"
              />
              <div className="mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={profileData.isPublic}
                    onChange={handleChange}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                  />
                  <span className="ml-2 text-gray-700">Make profile public</span>
                </label>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-800">{profileData.name}</h2>
              {profileData.location && <p className="text-gray-600 text-lg mt-1">{profileData.location}</p>}
              <p className="text-gray-500 text-sm mt-2">Status: {profileData.isPublic ? 'Public' : 'Private'}</p>
            </>
          )}
        </div>
      </div>
      <div className="mt-6 border-t pt-6">
        <SkillList
          skills={profileData.skillsOffered}
          type="offered"
          isEditable={isEditing}
          onAddSkill={(skill) => handleSkillChange(skill, 'offered', 'add')}
          onRemoveSkill={(skill) => handleSkillChange(skill, 'offered', 'remove')}
        />
        <SkillList
          skills={profileData.skillsWanted}
          type="wanted"
          isEditable={isEditing}
          onAddSkill={(skill) => handleSkillChange(skill, 'wanted', 'add')}
          onRemoveSkill={(skill) => handleSkillChange(skill, 'wanted', 'remove')}
        />
        <AvailabilityDisplay
          availability={profileData.availability}
          isEditable={isEditing}
          onEditAvailability={(newAvailability) => setProfileData((prev) => ({ ...prev, availability: newAvailability }))}
        />
      </div>
      {isEditable && (
        <div className="mt-6 flex justify-end space-x-4">
          {isEditing ? (
            <>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="secondary" onClick={handleCancel} disabled={isLoading}>Cancel</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile; 