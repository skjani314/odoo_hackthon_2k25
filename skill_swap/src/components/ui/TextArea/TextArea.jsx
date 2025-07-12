import React from 'react';

/**
 * TextAreaField Component
 *
 * A highly reusable and customizable text area component for multi-line text input
 * across the Skill Swap platform. It supports labels, placeholders, and displays
 * validation errors, similar to the InputField.
 *
 * Props:
 * - label: (String) The text label displayed above the text area.
 * - name: (String) The name attribute for the text area, useful for form handling.
 * - value: (String) The current value of the text area, controlled by React state.
 * - onChange: (Function) Callback function triggered when the text area value changes.
 * - placeholder: (Optional String) Text displayed inside the text area when it's empty.
 * - error: (Optional String) An error message to display below the text area.
 * If provided, the text area border will turn red.
 * - rows: (Optional Number) The visible height of the text area in terms of lines.
 * Defaults to 4.
 * - required: (Optional Boolean) If true, adds a red asterisk to the label and
 * the HTML 'required' attribute to the text area. Defaults to false.
 */
const TextAreaField = ({ label, name, value, onChange, placeholder, error, rows = 4, required = false }) => {
  return (
    // Container for the label, text area, and error message.
    // 'mb-4' provides consistent vertical spacing between form fields.
    <div className="mb-4">
      {/*
        Label for the text area:
        - 'block': Makes the label take up its own line.
        - 'text-gray-700 text-sm font-medium mb-2': Styles the label for readability.
        - 'htmlFor={name}': Associates the label with the text area by its 'name' attribute,
          improving accessibility (clicking the label focuses the text area).
        - Conditional red asterisk for required fields.
      */}
      <label htmlFor={name} className="block text-gray-700 text-sm font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/*
        Text area field:
        - 'shadow appearance-none border rounded-lg w-full py-2 px-3':
          Applies consistent styling: shadow, border, rounded corners, full width,
          and internal padding. 'appearance-none' resets some browser defaults.
        - 'text-gray-700 leading-tight': Sets text color and line height.
        - 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent':
          Custom focus styles for accessibility and visual feedback: removes default outline,
          adds a blue ring, and makes the border transparent when focused to avoid double borders.
        - Conditional border color: 'border-red-500' if an error is present,
          otherwise 'border-gray-300'.
        - 'resize-y': Allows vertical resizing by the user, providing flexibility for input.
      */}
      <textarea
        id={name} // 'id' matches 'htmlFor' for accessibility
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows} // Sets the initial visible height in lines
        required={required}
        className={`shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y ${error ? 'border-red-500' : 'border-gray-300'}`}
      ></textarea>

      {/*
        Error message display:
        - Only renders if an 'error' string is provided.
        - 'text-red-500 text-xs italic mt-1': Styles the error message clearly in red.
      */}
      {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
    </div>
  );
};

export default TextAreaField;
