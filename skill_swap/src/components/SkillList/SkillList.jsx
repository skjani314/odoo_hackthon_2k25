import React, { useState } from 'react';
import Button from '../../components/ui/button/Button.jsx'; // Assuming you have a Button component in your UI library



const SkillList = ({ skills, type, isEditable = false, onAddSkill, onRemoveSkill }) => {
  const [newSkill, setNewSkill] = useState('');
  const handleAdd = () => {
    if (newSkill.trim() && onAddSkill) {
      onAddSkill(newSkill.trim(), type);
      setNewSkill('');
    }
  };
  const headingText = type === 'offered' ? 'Skills Offered' : 'Skills Wanted';
  const placeholderText = `Add a new ${type === 'offered' ? 'offered' : 'wanted'} skill`;

  if(!skills || !Array.isArray(skills)) {
    return <p className="text-red-500">Invalid skills data provided.</p>;
  }

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{headingText}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full flex items-center">
              {skill}
              {isEditable && (
                <button onClick={() => onRemoveSkill(skill, type)} className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none" aria-label={`Remove ${skill}`}>
                  &times;
                </button>
              )}
            </span>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No {type} skills listed yet.</p>
        )}
      </div>
      {isEditable && (
        <div className="flex mt-3">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder={placeholderText}
            className="flex-grow shadow appearance-none border rounded-l-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
            aria-label={placeholderText}
          />
          <Button onClick={handleAdd} className="rounded-l-none">Add</Button>
        </div>
      )}
    </div>
  );
};

export default SkillList; 