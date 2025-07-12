import React, { useState } from 'react';
// Assuming the Button component is available and imported by you.
// It is a reusable UI component that SkillList will utilize for adding/removing skills.

// --- Reusable Button Component (Included for self-containment) ---
/**
 * Button Component
 * A highly reusable button component with various styling options.
 *
 * Props:
 * - onClick: Function to be called when the button is clicked.
 * - children: The content to be displayed inside the button (e.g., text, icons).
 * - variant: Defines the button's visual style ('primary', 'secondary', 'danger', 'outline').
 * Defaults to 'primary'.
 * - className: Additional Tailwind CSS classes to apply for custom styling.
 * - disabled: Boolean to disable the button, changing its appearance and preventing clicks.
 */
const Button = ({ onClick, children, variant = 'primary', className = '', disabled = false }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-semibold transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-75';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};


/**
 * SkillList Component
 *
 * A versatile component for displaying and optionally managing a list of skills.
 * It can be used in read-only mode (e.g., on public profiles) or in editable mode
 * (e.g., on the user's own profile editing page) to add and remove skills.
 *
 * Props:
 * - skills: (Array of Strings) The array of skill names to be displayed.
 * - type: (String) Indicates the category of skills, either 'offered' or 'wanted'.
 * Used for the section heading and placeholder text.
 * - isEditable: (Optional Boolean) If true, an input field and "Add" button are shown,
 * and each skill tag gets a close button. Defaults to false (read-only).
 * - onAddSkill: (Optional Function) Callback function triggered when a new skill is added.
 * Receives the new skill string and the 'type' ('offered'/'wanted') as arguments.
 * Required when 'isEditable' is true.
 * - onRemoveSkill: (Optional Function) Callback function triggered when a skill is removed.
 * Receives the skill string to be removed and the 'type' ('offered'/'wanted') as arguments.
 * Required when 'isEditable' is true.
 */
const SkillList = ({ skills, type, isEditable = false, onAddSkill, onRemoveSkill }) => {
  // State to manage the input field for adding new skills.
  const [newSkill, setNewSkill] = useState('');

  // Handler for adding a new skill.
  // It trims whitespace and calls the 'onAddSkill' prop if provided.
  const handleAdd = () => {
    if (newSkill.trim() && onAddSkill) {
      onAddSkill(newSkill.trim(), type);
      setNewSkill(''); // Clear the input field after adding
    }
  };

  // Determine the heading text based on the 'type' prop.
  const headingText = type === 'offered' ? 'Skills Offered' : 'Skills Wanted';
  // Determine the placeholder text for the input field.
  const placeholderText = `Add a new ${type === 'offered' ? 'offered' : 'wanted'} skill`;

  return (
    // Container for the skill list section.
    // 'mb-4' provides consistent vertical spacing.
    <div className="mb-4">
      {/* Section Heading */}
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{headingText}</h3>

      {/*
        Display area for skill tags:
        - 'flex flex-wrap gap-2': Uses flexbox to display skills in a row, allowing them to wrap
          to the next line if space runs out, with consistent spacing between tags.
      */}
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          // Map over the skills array to render each skill as a tag.
          skills.map((skill, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full flex items-center">
              {skill}
              {/*
                Remove button (only shown if 'isEditable' is true):
                - 'ml-2': Adds left margin for spacing from the skill text.
                - 'text-blue-600 hover:text-blue-800': Styles the close icon.
                - 'focus:outline-none': Removes default focus outline.
                - Calls 'onRemoveSkill' prop when clicked.
              */}
              {isEditable && (
                <button onClick={() => onRemoveSkill(skill, type)} className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none" aria-label={`Remove ${skill}`}>
                  &times; {/* HTML entity for a multiplication sign, commonly used as a close icon */}
                </button>
              )}
            </span>
          ))
        ) : (
          // Message displayed if no skills are listed.
          <p className="text-gray-500 text-sm">No {type} skills listed yet.</p>
        )}
      </div>

      {/*
        Add New Skill Input and Button (only shown if 'isEditable' is true):
        - 'flex mt-3': Uses flexbox to align the input and button horizontally, with top margin.
      */}
      {isEditable && (
        <div className="flex mt-3">
          {/*
            Input field for new skill:
            - 'flex-grow': Allows the input to take up available space.
            - Consistent styling with other form inputs (shadow, border, rounded-l-lg).
            - 'rounded-l-lg': Only rounds the left side to create a continuous look with the button.
          */}
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder={placeholderText}
            className="flex-grow shadow appearance-none border rounded-l-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyDown={(e) => { // Allow adding skill with Enter key
              if (e.key === 'Enter') {
                handleAdd();
              }
            }}
            aria-label={placeholderText}
          />
          {/*
            "Add" Button:
            - Uses the reusable 'Button' component.
            - 'rounded-l-none': Removes the left rounded corner to seamlessly connect with the input.
          */}
          <Button onClick={handleAdd} className="rounded-l-none">Add</Button>
        </div>
      )}
    </div>
  );
};

export default SkillList;
